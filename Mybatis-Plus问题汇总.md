# Mybatis-Plus问题汇总

1. **只要用 LambdaQueryWrapper / LambdaQueryChainWrapper**

   你传的**排序字段、查询列、where 条件列**，**统统必须是：实体类的方法引用**

   格式：`实体类::getXxx`

   例如：`Course::getPrice`、`User::getId`

   

2. **绝对不能直接传字符串**

   像 `"price"`、`"duration"` 这种字符串，**Lambda  wrapper 完全不认**，直接爆红 / 报错。

   

3. **必须是【对应实体】的引用**

   你查 `Course`，就只能传 `Course::getXXX`

   不能传其他类（比如你的 `Sort::getField`），类型完全对不上。

   

**LambdaWrapper = 只认 实体类::getXxx，不认字符串，不认其他类方法！**
## 代码为什么错？

```java
orderBy(true, sort.getAsc(), sort::getField);
```

- `sort::getField` 是 **Sort 这个查询类**的方法
- 不是 **Course 实体类**的方法
- LambdaWrapper 直接爆红

---

# 正确逻辑

前端 / 传参 **字符串**

↓ ↓ ↓

写代码 **手动映射成 实体引用**

↓ ↓ ↓

才能传给 **LambdaWrapper**

```java
String field = sort.getField(); // 拿到字符串

// 映射成 Course 实体的方法引用（必须做！）
SFunction<Course, ?> column = "price".equals(field) ? Course::getPrice : Course::getDuration;

// 再排序
lambdaQueryChainWrapper.orderBy(true, sort.getAsc(), column);
```

## 配套映射方法（必须写）

```java
private SFunction<Course, ?> getColumn(String field) {
    switch (field) {
        case "price": return Course::getPrice;
        case "duration": return Course::getDuration;
        default: return Course::getId;
    }
}
```



# `SFunction<Course, ?>` 就是 MyBatis-Plus 规定的：“实体类的方法引用” 的标准类型！

```java
Course::getPrice
Course::getDuration
Course::getId
```

**它们的类型，统一就是 SFunction<Course, ?>**

# 拆开逐字讲

## 1. SFunction

**MyBatis-Plus 提供的函数式接口**

作用：**用来接收 “实体类的 getter 方法引用”**

也就是：

```java
实体::getXxx
```

## 2. Course表示：**这个方法引用属于 Course 这个实体类**

你不能传 User::getName，因为泛型限定死了是 Course。

## 3. ? （问号）

表示：**返回值类型不限**

- price 可能是 BigDecimal
- duration 可能是 Integer
- id 可能是 Long

**? 就是兼容所有类型，不用管。**

------

# 所以合起来意思就是：

## `SFunction<Course, ?>`

**“一个属于 Course 实体类的、任意返回值类型的 getter 方法引用”**

```java
Course::getPrice
Course::getDuration
Course::getId
```

# 为什么必须用它？

因为 MyBatis-Plus 的 **Lambda 排序** 长这样：

```java
orderBy(boolean condition, boolean isAsc, SFunction<T, ?> column)
```

**第三个参数，强制规定必须是 SFunction 类型！**

传字符串不行

传 Sort::getField 不行

**只能传 SFunction**

------

# 对应关系

| 你写的代码          | 实际类型             |
| ------------------- | -------------------- |
| Course::getPrice    | SFunction<Course, ?> |
| Course::getDuration | SFunction<Course, ?> |
| Course::getId       | SFunction<Course, ?> |

所以方法必须返回 `SFunction<Course, ?>`

------

# 总结

### **LambdaWrapper 要的字段

=== 实体类的方法引用

=== 类型就是 SFunction <实体，?>**

- `SFunction<Course, ?>` = **专门装 Course::getXxx 这种方法引用的类型**
- 是 MyBatis-Plus 强制要求的
- `?` 代表任意返回值类型，兼容所有字段



这是 **Java 8+ Lambda + 函数式编程** 的标准写法，**不是普通方法**，但能实现 “方法里面定义函数” 的效果。

# 先看整段代码

```java
// 定义一个函数式接口变量
Function<String, SFunction<Course, ?>> getColumn = fieldName -> {
    return switch (fieldName) {
        case "type" -> Course::getType;
        case "edu" -> Course::getEdu;
        default -> Course::getId;
    };
};
```

第一层：这不是方法！是 **变量**

```java
Function<String, SFunction<Course, ?>> getColumn
```

意思：

**getColumn 是一个变量**

它的类型是：`Function<String, SFunction<Course, ?>>`

你可以理解成：

> 它是一个**可以被调用的函数变量**
>
> 不是方法，是变量！

------

# 第二层：Function 是什么？

`Function<A, B>` 是 Java 自带的函数式接口：

- 接收 **A 类型参数**
- 返回 **B 类型结果**

所以：

```java
Function<String, SFunction<Course, ?>>
```

意思：

- **输入：String**（字段名字符串，如 "type"）
- **输出：SFunction<Course,?>**（MyBatis-Plus 的方法引用，如 Course::getType）

------

# 第三层：右边的 Lambda 实现

```java
= fieldName -> { ... }
```

这就是：

**给函数变量赋值一段逻辑**

- `fieldName`：输入的字符串（比如 "type"、"edu"）
- `{ ... }`：里面是处理逻辑

------

# 第四层：switch 根据字符串返回对应的方法引用

```java
switch (fieldName) {
    case "type" -> Course::getType;
    case "edu" -> Course::getEdu;
    default -> Course::getId;
};
```

作用：

**输入字符串 → 输出 Course 对应的 Lambda 方法引用**

------

# 整段代码翻译

```java
Function<String, SFunction<Course, ?>> getColumn = fieldName -> {
    return 字符串转对应的 Course::getXXX;
};
```

> **给我一个字符串字段名，我还给你一个 MyBatis-Plus 能用的方法引用**

------

# 怎么用？

定义完后，你可以**像调用方法一样调用它**：

```java
getColumn.apply("type");   → 得到 Course::getType
getColumn.apply("edu");    → 得到 Course::getEdu
```

所以你排序就能写：

```java
wrapper.orderBy(true, sort.getAsc(), getColumn.apply(sort.getField()));
```

# 为什么能写在方法里面？

因为：

### **Java 允许在方法内部定义变量！**

不管是：

- int a = 10;
- String s = "abc";
- **Function 变量 = Lambda**

都可以

------

# 通俗类比

你平时写：

```java
int a = 10;
```

现在写：

```java
Function<...> getColumn = Lambda;
```

**一模一样！只是类型特殊一点！**

------

# 总结

1. **这不是方法，是方法内部的 “函数变量”**
2. **输入 String，输出 SFunction<Course,?>**
3. **作用：字符串字段名 → 转成 MyBatis-Plus 方法引用**
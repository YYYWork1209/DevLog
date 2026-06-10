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

---


`Mybatis`中使用`LambdaWrapper`来构建`Sql`语句时，避免采用硬编码，使用方法引用的方式来进行条件或者查询字段名的指定，但是引用获取到的是的方法的返回值，`Mybatis-plus`底层采用的是反射的机制来获取对应需要的字段名的（通过对引用的方法进行解析）

# MyBatis-Plus 中 Lambda 方法引用的原理
## 核心原理
您的疑问非常有价值！在 MyBatis-Plus 中使用 `User::getUsername` 这样的方法引用，实际上是一个非常巧妙的设计。这里的关键在于：

**MyBatis-Plus 并不是通过方法引用获取字段值，而是通过解析 Lambda 表达式来提取字段名**。

## 实现机制
### 1. Lambda 表达式解析
MyBatis-Plus 内部通过 `LambdaUtils` 等工具类，利用 Java 8+ 的 Lambda 表达式特性，解析方法引用对应的字段信息：

+ **步骤 1**：当您编写 `User::getUsername` 时，Java 编译器会将其转换为一个 Lambda 表达式
+ **步骤 2**：MyBatis-Plus 捕获这个 Lambda 表达式
+ **步骤 3**：通过反射和字节码分析，提取出对应的字段名 "username"

### 2. 技术实现
MyBatis-Plus 实现这一功能的核心代码大致如下（简化版）：

```java
// 伪代码：解析 Lambda 表达式获取字段名
public static String getFieldName(SFunction<?, ?> func) {
    // 1. 获取 Lambda 表达式的实现
    Method method = func.getClass().getDeclaredMethod("writeReplace");
    method.setAccessible(true);
    SerializedLambda serializedLambda = (SerializedLambda) method.invoke(func);
    
    // 2. 从序列化的 Lambda 中提取方法名
    String methodName = serializedLambda.getImplMethodName();
    
    // 3. 根据方法名推断字段名（如 getUsername -> username）
    if (methodName.startsWith("get")) {
        return Introspector.decapitalize(methodName.substring(3));
    } else if (methodName.startsWith("is")) {
        return Introspector.decapitalize(methodName.substring(2));
    }
    return methodName;
}
```

## 为什么使用方法引用
### 1. 类型安全
+ 编译时检查：如果字段不存在或方法名错误，编译器会直接报错
+ 避免运行时错误：不会因为字段名拼写错误导致 SQL 执行失败

### 2. 代码可读性
+ 直观明了：`User::getUsername` 比字符串 "username" 更能表达意图
+ 便于理解：一眼就能看出是哪个实体类的哪个字段

### 3. 重构友好
+ 当实体类字段名变更时，IDE 会自动更新方法引用
+ 避免了手动修改字符串带来的遗漏

### 4. IDE 支持
+ 支持字段名的自动补全
+ 支持跳转到字段定义

## 实际效果
当您编写：

```java
LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<User>()
        .like(User::getUsername, "o")
        .ge(User::getBalance, 1000);
```

MyBatis-Plus 会解析为：

```sql
SELECT ... FROM user 
WHERE username LIKE '%o%' 
AND balance >= 1000
```

## 总结
MyBatis-Plus 利用 Java Lambda 表达式的特性，通过解析方法引用间接获取字段名，实现了类型安全的查询条件构建。这种方式既保持了代码的可读性，又避免了硬编码字符串带来的各种问题。

这是 MyBatis-Plus 的一个非常优雅的设计，体现了框架设计者对 Java 语言特性的深入理解和巧妙应用。



# MyBatis-Plus 解析 Lambda 表达式核心代码详解
## 核心代码解析
```java
// 伪代码：解析 Lambda 表达式获取字段名
public static String getFieldName(SFunction<?, ?> func) {
    // 1. 获取 Lambda 表达式的实现
    Method method = func.getClass().getDeclaredMethod("writeReplace");
    method.setAccessible(true);
    SerializedLambda serializedLambda = (SerializedLambda) method.invoke(func);
    
    // 2. 从序列化的 Lambda 中提取方法名
    String methodName = serializedLambda.getImplMethodName();
    
    // 3. 根据方法名推断字段名（如 getUsername -> username）
    if (methodName.startsWith("get")) {
        return Introspector.decapitalize(methodName.substring(3));
    } else if (methodName.startsWith("is")) {
        return Introspector.decapitalize(methodName.substring(2));
    }
    return methodName;
}
```



# `SFunction<?, ?>` 参数详解
## 基本概念
`SFunction<?, ?>` 是 MyBatis-Plus 框架中定义的一个**函数式接口**，用于表示一个**从输入类型到输出类型的函数**。

### 1. 类型参数解析
+ `SFunction`：是 MyBatis-Plus 提供的函数式接口，继承自 Java 标准库的 `Function<T, R>` 接口
+ `<?, ?>`：是 Java 泛型中的**通配符**，表示：
    - 第一个 `?`：输入类型（任意类型）
    - 第二个 `?`：输出类型（任意类型）

## 详细解释
### 1. `SFunction` 接口定义
MyBatis-Plus 中的 `SFunction` 接口定义大致如下：

```java
@FunctionalInterface
public interface SFunction<T, R> extends Function<T, R> {
    // 继承自 Function<T, R> 的抽象方法：R apply(T t)
}
```

### 2. 通配符 `<?, ?>` 的作用
在 `getFieldName(SFunction<?, ?> func)` 方法中：

+ `<?, ?>` 表示**不关心具体的输入和输出类型**
+ 这样设计的目的是：**使该方法能够处理任何实体类的方法引用**，而不仅限于特定类型

### 3. 实际使用场景
当我们传入 `User::getUsername` 这样的方法引用时：

+ **输入类型 **`T` 是 `User`（实体类）
+ **输出类型 **`R` 是 `String`（`username` 字段的类型）

但在 `getFieldName` 方法中，我们**不关心具体的 **`T`** 和 **`R`** 是什么类型**，只需要：

1. 解析 Lambda 表达式
2. 提取方法名
3. 推断字段名

### 4. 为什么使用 `SFunction<?, ?>` 而非具体类型
+ **通用性**：可以处理任何实体类的方法引用，如 `User::getBalance`、`Order::getAmount` 等
+ **类型安全**：虽然使用了通配符，但实际传入的方法引用仍然是类型安全的
+ **简化代码**：无需为不同实体类编写不同的解析方法

## 函数式接口的作用
`SFunction<T, R>` 在 MyBatis-Plus 中的核心作用：

+ **作为 Lambda 表达式的载体**：捕获用户编写的方法引用（如 `User::getUsername`）
+ **提供类型信息**：通过泛型参数 `T` 关联到具体的实体类
+ **支持方法引用语法**：让用户可以使用简洁的 `Entity::getField` 语法

## 示例解析
当调用 `getFieldName(User::getUsername)` 时：

1. `User::getUsername` 被转换为 `SFunction<User, String>` 类型的 Lambda 表达式
2. 该 Lambda 表达式作为参数传入 `getFieldName` 方法
3. 方法内部通过解析 Lambda 表达式，提取出方法名 `"getUsername"`
4. 进一步推断出字段名 `"username"`

## 总结
`SFunction<?, ?>` 是一个**通用的函数式接口类型**，用于接收任何实体类的方法引用。它的设计使得 MyBatis-Plus 能够：

+ 统一处理不同实体类的字段提取
+ 保持类型安全的同时提供简洁的 API
+ 支持通过方法引用构建查询条件，避免硬编码字符串

这种设计充分利用了 Java 泛型和 Lambda 表达式的特性，体现了 MyBatis-Plus 框架的优雅和灵活性。



### 1. `writeReplace` 方法的作用
**背景知识**：  
Java 中的 Lambda 表达式在序列化时，会由编译器自动生成一个特殊的方法 `writeReplace()`。这个方法是 Java 序列化机制的一部分，用于在对象序列化前替换为另一个对象。

**代码解析**：

+ `func.getClass()`：获取 Lambda 表达式对应的运行时类（这是一个由编译器生成的匿名内部类）
+ `getDeclaredMethod("writeReplace")`：获取该类中声明的 `writeReplace` 方法
+ `method.setAccessible(true)`：设置方法可访问性，因为 `writeReplace` 通常是 `private` 的
+ `method.invoke(func)`：执行该方法，返回 `SerializedLambda` 实例

### 2. `SerializedLambda` 类的作用
`SerializedLambda` 是 Java 内部提供的一个类，用于表示 Lambda 表达式的序列化状态。它包含了 Lambda 表达式的关键信息：

+ 实现方法名（`implMethodName`）
+ 所属类名（`implClass`）
+ 函数式接口信息等

### 3. `getImplMethodName()` 方法
**作用**：从 `SerializedLambda` 中提取 Lambda 表达式所引用的**实际方法名**。

**示例**：

+ 当使用 `User::getUsername` 时，`getImplMethodName()` 返回 `"getUsername"`
+ 当使用 `User::isEnabled` 时，`getImplMethodName()` 返回 `"isEnabled"`

## 完整流程示例
以 `User::getUsername` 为例：

1. **输入**：`SFunction<User, String> func = User::getUsername`
2. **步骤 1**：`func.getClass()` 获取 Lambda 表达式的运行时类（匿名内部类）
3. **步骤 2**：获取并执行 `writeReplace()` 方法，得到 `SerializedLambda` 实例
4. **步骤 3**：`serializedLambda.getImplMethodName()` 返回 `"getUsername"`
5. **步骤 4**：通过字符串处理（`substring(3)` 并 `decapitalize`）得到字段名 `"username"`

## 技术原理深度解析
### 为什么 Lambda 表达式会有 `writeReplace` 方法？
Java 的 Lambda 表达式在编译时会被转换为：

1. 一个实现了对应函数式接口的匿名内部类
2. 该内部类会自动生成 `writeReplace()` 方法
3. 当序列化时，`writeReplace()` 会返回 `SerializedLambda` 对象，而非 Lambda 本身

### `SerializedLambda` 的信息来源
`SerializedLambda` 包含的信息来自于 Lambda 表达式的**运行时上下文**，包括：

+ **实现方法**：Lambda 表达式引用的具体方法（如 `getUsername`）
+ **所属类**：方法所在的类（如 `User`）
+ **函数式接口**：Lambda 表达式实现的接口（如 `SFunction`）

## 代码执行流程图
```plain
┌─────────────────┐
│ User::getUsername │  // 方法引用
└────────────┬────┘
             │
┌────────────▼────────────┐
│ Lambda 表达式 (SFunction) │
└────────────┬────────────┘
             │
┌────────────▼──────────────────┐
│ 运行时类 (匿名内部类)         │
└────────────┬──────────────────┘
             │
┌────────────▼──────────────────┐
│ getDeclaredMethod("writeReplace") │
└────────────┬──────────────────┘
             │
┌────────────▼──────────────────┐
│ method.setAccessible(true)    │
└────────────┬──────────────────┘
             │
┌────────────▼──────────────────┐
│ method.invoke(func)           │
└────────────┬──────────────────┘
             │
┌────────────▼──────────────────┐
│ SerializedLambda 实例         │
└────────────┬──────────────────┘
             │
┌────────────▼──────────────────┐
│ getImplMethodName() → "getUsername" │
└────────────┬──────────────────┘
             │
┌────────────▼──────────────────┐
│ 提取字段名 → "username"        │
└───────────────────────────────┘
```

## 总结
MyBatis-Plus 通过以下步骤实现从方法引用到字段名的转换：

1. **利用 Java 序列化机制**：通过 `writeReplace()` 方法获取 `SerializedLambda`
2. **解析 Lambda 元数据**：从 `SerializedLambda` 中提取方法名
3. **推断字段名**：根据 Java Bean 命名规范（`getXxx` → `xxx`）转换为字段名

这种方式的优势在于：

+ **类型安全**：编译时检查方法引用的合法性
+ **无硬编码**：避免直接使用字符串字段名
+ **IDE 友好**：支持字段名自动补全和重构

通过这种巧妙的设计，MyBatis-Plus 实现了既优雅又安全的查询条件构建方式。



# 自定义Sql结合Mybatis_Plus构建Sql语句
`Mybatis-Plus`中主要通过生成好的各种方法来简化`Sql`语句的书写，对于条件语句`where`的书写即便复杂也能完成，但是对于多表查询，以及`Sql`语句前半部分的书写还不能完全依赖`Mybatis-Plus`，但是如果直接在业务层进行拼接自定义 Sql 语句拼接结合 Mybatis_Plus的方式来构建Sql语句的话，可能会违反开发规定，（ Sql语句一般不允许出现在业务层中）

原本的形式如下

```java
List<Long> ids = List.of(1L,2L,4L);

UpdateWrapper<User> userUpdateWrapper = new UpdateWrapper<User>()
//Sql语句进行了直接定义在了业务层，不符合开发规范
.setSql(" balance = balance + 200")
.in("id",ids);

userMapper.update(null,userUpdateWrapper);
```

为了解决该方法，**我们可以利用MyBatisPlus的Wrapper来构建复杂的Where条件，然后自己定义SQL语句中剩下的部分。**

**基于wrapper构建where条件**

```java
List<Long> ids = List.of(1L, 2L, 4L);int amount = 200;
//1.构建条件
LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<User>() .in(User::getId, ids) ;//2.自定义SQL方法调用
userMapper.updateBalanceByIds(wrapper, amount) ;
```

**在mapper方法参数中用Param注解声明wrapper变量名称，必须是ew**

```java
void updateBalanceByIds(@Param("ew") LambdaQueryWrapper<User> wrapper, @Param("amount") int amount) ;
```

**自定义SQL，并使用wrapper条件（可以直接使用注解写到方法上，也可以采用下面格式写到xml文件中）**

```java
<update id="updateBalanceByIds">
UPDATE tb_user SET balance = balance - #{amount} ${ew.customSqlSegment}]
</update>
```



# IService中的Lambda方式（LambdaQuery、Update）
**优势不需要构建**`Wrapper`**以及自定义**`Sql`**语句，可以直接调用**`LambdaQuery/LambdaUpdate`**来构建Sql语句，且不需要自定义Sql语句，但是只能用于复杂查询与修改，**

```java

    @Override
    public List<User> findUserList(String name, Integer status, Integer minBalance, Integer maxBalance) {

        return lambdaQuery().like(name!=null ,User::getUsername,name)
                .eq(status !=null,User::getStatus,status)
                .ge(minBalance !=null,User::getBalance,minBalance)
                .le(maxBalance !=null,User::getBalance,maxBalance)
                .list();

    }
```

代码对应的SQL语句格式如下：

```java
<select id="findUserList" resultType="com.你的包名.User">
    SELECT * FROM user
    <where>
        <!-- 用户名模糊查询 -->
        <if test="name != null and name != ''">
            AND username LIKE CONCAT('%', #{name}, '%')
        </if>
        
        <!-- 状态精确匹配 -->
        <if test="status != null">
            AND status = #{status}
        </if>
        
        <!-- 最小余额 >= -->
        <if test="minBalance != null">
            AND balance >= #{minBalance}
        </if>
        
        <!-- 最大余额 <= -->
        <if test="maxBalance != null">
            AND balance <= #{maxBalance}
        </if>
    </where>
</select>
```



# Iservice的批量新增
需求为：实现批量插入十万条用户信息

最慢的：采用for循环一次一次的插入，每次插入都是发送一次网络请求，并且在数据库中执行一次sql语句

速度中等：采用`Iservice`的批量插入方式，在原本的for循环中加入`if`语句进行判断，每一千次发送一次请求，但是每次请求执行一千次sql语句

最快的：`yml`文件配置`rewriteBatchedStatements=true`，在每一千次发送的请求基础上把所有的数据合并为一条sql语句，这样只执行一次sql语句即可，网络请求还是发送十次，一次插入一千条数据，但是只需执行一次sql语句


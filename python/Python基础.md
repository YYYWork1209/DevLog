**极简Python速查备忘录**，有Java基础但长时间没用Python用来回顾复习。

---

### 1. 核心语法 (与Java的区别)

- **缩进即大括号**：代码块靠**缩进**（通常4空格）区分，不用 `{}`。行末必须加 `:`。
- **无分号**：行尾不需要 `;`。
- **动态强类型**：变量无需声明类型，运行时确定；类型不匹配会报错（不会隐式强转）。
- **一切皆对象**：连 `int`、`bool`、`函数` 都是对象，传递时传引用。
- **逻辑运算符**：`&&` `||` `!` -> **`and`**、**`or`**、**`not`**。
- **三目**：`条件 ? 真 : 假` -> **`真 if 条件 else 假`**。
- **主入口**：Java是 `main` 方法，Python是文件级判断 `if __name__ == "__main__":`。

---

### 2. 基本数据类型 

| 类别 | Python写法 | Java对比备注 (关键) |
| :--- | :--- | :--- |
| **整数** | `int` | **无长度限制**（不会溢出）。与Java `BigInteger`类似。 |
| **浮点** | `float` | 对应Java `double`（只有双精度）。 |
| **布尔** | `bool` (值为 `True` / `False`) | **首字母大写**，且是 `int` 的子类（`True=1`）。 |
| **空值** | `None` | 对应Java `null`。 |
| **字符串** | `str` | **不可变**。可用单引号 `'` 或双引号 `"`，**无char类型**（单字符也是str）。 |

> **字符串必记语法**：
> - **f-string**：`f"Hello {name}"`（最强格式化，相当于Java模板字符串）。
> - **原始字符串**：`r"C:\Users"`（忽略转义，相当于Java不处理反斜杠）。
> - **多行字符串**：`"""..."""`。

---

### 3. 核心容器数据结构 

| 类型 | 语法 | 可变性 | 对应Java | 关键特性 |
| :--- | :--- | :--- | :--- | :--- |
| **列表 (List)** | `[1, 2, 3]` | **可变** | `ArrayList` | 可存任意类型，动态长度。 |
| **元组 (Tuple)** | `(1, 2, 3)` 或 `1,2,3` | **不可变** | `List.of(...)` 不可变版 | 性能优于列表，可作为字典键。 |
| **字典 (Dict)** | `{"a": 1, "b": 2}` | **可变** | `HashMap` | 键可为任意不可变类型（不仅是字符串）。 |
| **集合 (Set)** | `{1, 2, 3}` | **可变** | `HashSet` | 无序、去重。 |

> **易忘点**：空字典是 `{}`，空集合**不能**用 `{}`（那是空字典），必须用 `set()`。

---

### 4. 常用语法片段 

**条件判断**（无 `switch`，用 `elif`）：
```python
if x > 0:
    pass          # 占位符，相当于空语句
elif x == 0:
    print("zero")
else:
    pass
```

**循环**（无 Java 的 `for(int i;;)`，只有 `for-in`）：
```python
# 遍历数字 0~4
for i in range(5):     # range(5) -> [0,1,2,3,4]
    print(i)

# 遍历列表
for item in my_list:
    print(item)

# 带索引遍历（Java的带下标for）
for idx, value in enumerate(my_list):
    print(idx, value)

# while循环（同Java）
while condition:
    pass
```

**函数定义**（无重载，同名函数后者覆盖前者）：
```python
def add(a, b=0):          # 默认参数（相当于Java重载简写）
    return a + b

def greet(name: str) -> str:  # 类型注解（仅提示，不强制，FastAPI用）
    return f"Hello {name}"

# 可变参数 (*args 收元组, **kwargs 收字典)
def test(*args, **kwargs):
    pass
```

**类与对象**（无 `new` 关键字，构造器用 `__init__`）：
```python
class Person:
    # 类变量（相当于Java static）
    species = "Human"

    # 构造器（self 相当于 Java 的 this，但必须显式写在形参第一位）
    def __init__(self, name):
        self.name = name    # 实例变量直接动态挂载

    def say(self):
        return self.name
# 实例化：p = Person("Tom")   # 不用 new
```

---

### 5. 异常处理（与Java异同）

- 语法：`try...except...else...finally`（Java是 `catch`，Python用 `except`）。
- 捕获所有异常：`except Exception as e:`（记得加 `as e` 取实例）。
- **没有 `throws` 关键字**（函数签名不需要声明抛出异常，全靠自觉）。

```python
try:
    risky()
except ZeroDivisionError as e:
    print(e)
else:                # 没异常时执行
    print("ok")
finally:
    print("clean")
```

---

### 6. Python 独有的实用特性（捡回来用）

- **切片 (Slice)**：`list[0:10:2]`（起始:结束:步长），字符串、元组通用。
- **解包 (Unpacking)**：`a, b = (1, 2)` 或 `a, *rest = [1,2,3]`（Java无此语法）。
- **列表推导式 (Comprehension)**：`[x*2 for x in range(10) if x%2==0]`（秒杀Java流式，常用）。
- **链式比较**：`if 0 < a < 10:`（Java必须拆成 `&&`）。

---

### 备注

- 忘记类型？用 `type(var)` 查看。
- 忘记方法？用 `dir(var)` 查看所有属性和方法，用 `help(var)` 查看文档。
- 导包：`import math` 或 `from math import sqrt`（相当于Java的 `import static`）。
- 变量作用域：函数内默认读写局部变量，要修改外部全局变量需加 `global`，修改嵌套函数变量需加 `nonlocal`（这个容易忘，遇到闭包再查）。


# Python中的类型提示
**Python 本身不强制要求定义类型，但在 FastAPI 中，强烈建议（且必须）定义类型才能发挥其核心功能。**

### 1. Python 语言的本质：动态类型（不需要定义）
从 Python 语言的底层机制来说，**变量确实不需要定义类型**。以下代码完全合法且能正常运行：

```python
# 变量可以随时改变类型
a = 1          # 现在是 int
a = "hello"    # 现在是 str
a = [1, 2, 3]  # 现在是 list
```

因为在运行时，Python 解释器只关心对象本身的类型，不关心变量声明时的类型。所以，**如果你写纯 Python 脚本，不定义类型完全 OK**。

---

### 2. Python 的类型提示（Type Hints）：可选定义（不需要强制）
Python 3.5+ 引入了类型提示（如 `def read_item(item_id: int)`），但这**仅仅是“注解”**，不会影响代码的实际运行逻辑。

- 如果你写了 `item_id: int`，但传入了字符串 `"abc"`，Python 解释器**不会报错**，程序依然会跑（除非代码内部做了类型校验）。
- 它主要服务于**代码编辑器**（如 VSCode、PyCharm）的智能补全和静态检查工具（如 `mypy`）。

---

### 3. 为什么在 FastAPI 中必须定义类型？
虽然 Python 不强制，但 **FastAPI 强依赖这些类型注解来实现核心功能**。如果你不在 FastAPI 的路由中定义类型，它会失去两大杀手锏：

- **请求数据的自动校验与转换**：当你定义 `item_id: int` 时，FastAPI 会自动把 URL 中的字符串 `"123"` 转为整数 `123`，如果传了 `"abc"` 它会自动返回 422 校验错误（无需你写 `try...except`）。
- **自动生成交互式 API 文档**（Swagger UI 和 ReDoc）：FastAPI 会读取这些类型注解，自动生成清晰的参数说明和 JSON Schema。

**结论**：在 FastAPI 中，**为了享受自动校验和文档生成，你“必须”定义类型**，否则框架不知道如何解析和验证传入的数据。

---

### 为了更直观，举一个反例：

```python
# 不定义类型（虽然 Python 能跑，但 FastAPI 失去校验能力）
@app.get("/items/{item_id}")
def read_item(item_id):  # 没写类型
    return {"item_id": item_id, "double": item_id * 2}
# 如果访问 /items/5，返回 {"item_id":"5","double":"55"}（字符串乘法，不是你想要的）
```

```python
# 定义类型（FastAPI 生效）
@app.get("/items/{item_id}")
def read_item(item_id: int):  # 写了 int
    return {"item_id": item_id, "double": item_id * 2}
# 如果访问 /items/5，返回 {"item_id":5,"double":10}（整数乘法，符合预期）
```

---

### 总结一句话：
- **纯 Python 环境**：数据类型**不需要**定义。
- **FastAPI 环境**：数据类型的定义**不是给 Python 解释器看的，而是给 FastAPI 框架做校验和文档用的**。为了框架正常运转，**必须定义**。

---


#  遍历集合时直接删除元素，导致集合大小变化，破坏迭代器  
```python
student_name = input("请输入需要删除的学生姓名：")
for student in student_set:
    if student.name == student_name:
        student_set.remove(student)
        print("删除成功！")
```

控制台信息如下：

```
请输入需要使用的教务系统功能序号：3

请输入需要删除的学生姓名：闫金超

删除成功！


Traceback (most recent call last):

  File "D:\PythonProject\教务系统\edumanagement.py", line 49, in <module>

    for student in student_set:

RuntimeError: Set changed size during iteration
```



 核心原因是：**在遍历集合（set）的过程中直接修改了集合的大小（删除元素）**，会破坏迭代器的正常工作，导致 Python 抛出运行时错误  



### 解决方案
安全的做法是：**遍历集合的副本**（而不是原集合），或者先找到要删除的元素，遍历结束后再执行删除操作。下面提供两种可行的修复方案：

#### 方案1：遍历集合的副本（推荐）
```python
student_name = input("请输入需要删除的学生姓名：")
# 遍历集合的副本（通过list()转换生成新列表），避免迭代时修改原集合
for student in list(student_set):
    if student.name == student_name:
        student_set.remove(student)
        print("删除成功！")
        # 找到并删除后可直接退出循环，提升效率
        break
else:
    # 如果循环正常结束（没触发break），说明没找到该学生
    print("未找到该学生，删除失败！")
```

#### 方案2：先查找再删除
```python
student_name = input("请输入需要删除的学生姓名：")
# 先找到要删除的学生对象
target_student = None
for student in student_set:
    if student.name == student_name:
        target_student = student
        break

# 遍历结束后再执行删除操作
if target_student:
    student_set.remove(target_student)
    print("删除成功！")
else:
    print("未找到该学生，删除失败！")
```

### 关键代码解释
1. `list(student_set)`：将原集合**转换为列表**，遍历的是这个**静态的列表副本**，即使原集合删除元素，也不会影响当前的遍历过程。
2. `break`：找到目标学生并删除后，立即退出循环，避免不必要的遍历（如果集合中有多个同名学生，可根据需求决定是否保留break）。
3. `else` 分支（for-else结构）：当循环正常结束（未触发break）时执行，用于处理“未找到学生”的场景，提升程序的健壮性。

### 总结
1. **核心问题**：遍历集合时直接删除元素，导致集合大小变化，破坏迭代器。
2. **解决思路**：遍历集合的副本，或先查找目标元素、遍历结束后再删除。
3. **额外优化**：增加“未找到学生”的提示，让程序逻辑更完整。



# `for - else` 与 `while - else `
```python
student_name = input("请输入需要删除的学生姓名：")
# 遍历集合的副本（通过list()转换生成新列表），避免迭代时修改原集合
for student in list(student_set):
    if student.name == student_name:
        student_set.remove(student)
        print("删除成功！")
        # 找到并删除后可直接退出循环，提升效率
        break
else:
    # 如果循环正常结束（没触发break），说明没找到该学生
    print("未找到该学生，删除失败！")
```

`**else**`**与**`**for**`**是一体的，并不是只有**`**if - else**`**的结合**

### 一、先彻底理解`for...else`的逻辑
`for...else`的核心规则：

+ `for`块：正常执行循环体（遍历、处理元素）。
+ `else`块：**只有当for循环完整执行完毕（没有被break中断）时，才会执行**。

这段代码的逻辑：

1. 遍历学生集合的副本，逐个检查姓名是否匹配。
2. 如果找到匹配的学生：执行`remove` → 打印“删除成功” → `break`（强制终止循环）→ `else`块**不会执行**。
3. 如果遍历完所有学生都没找到匹配的：循环完整执行（没有触发break）→ `else`块执行 → 打印“未找到该学生”。

### 二、例子直观对比
#### 场景1：找到元素，触发break → else不执行
```python
student_set = ["张三", "李四", "王五"]
student_name = "李四"

for student in list(student_set):
    if student == student_name:
        student_set.remove(student)
        print("删除成功！")
        break
else:
    print("未找到该学生，删除失败！")

# 输出：删除成功！
```

#### 场景2：没找到元素，循环完整执行 → else执行
```python
student_set = ["张三", "李四", "王五"]
student_name = "赵六"

for student in list(student_set):
    if student == student_name:
        student_set.remove(student)
        print("删除成功！")
        break
else:
    print("未找到该学生，删除失败！")

# 输出：未找到该学生，删除失败！
```

### 三、为什么else和for缩进一致？
在Python中，缩进代表代码块的归属：

+ `for`关键字后面的缩进块（`if`/`remove`/`print`/`break`）是**循环体**，属于`for`的执行逻辑。
+ `else`与`for`缩进一致，说明它不是循环体的一部分，而是和`for`绑定的**同级结构**（就像`if...else`中`else`和`if`缩进一致）。

可以把`for...else`理解为一个“组合结构”：

```python
for 变量 in 可迭代对象:
    循环体（满足条件时执行）
else:
    循环正常结束（未被break）时执行的代码
```

### 四、语法的常见用途
除了“查找并删除/修改”场景，`for...else`还常用于：

1. 检查列表中是否存在某个元素（替代额外的标志变量）。
2. 遍历完所有数据后执行收尾操作（如“未找到匹配项”提示）。
3. 避免写冗余的`found = False`这类标志变量，让代码更简洁。

### 总结
1. `for...else`是Python专属语法，`else`不依赖`if`，而是和`for`绑定，缩进与`for`一致。
2. `else`块的执行条件：**for循环完整执行完毕，没有被break中断**。
3. 代码中的`else`作用：专门处理“遍历完所有学生都没找到目标”的场景，比单独用标志变量更简洁。

这个语法刚开始接触会觉得“反直觉”，但理解后会发现它能让代码更优雅，尤其是处理“查找-判断”类逻辑时特别好用。


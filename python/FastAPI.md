# FastAPI 快速开始

# Python中的类型提示（前置知识）
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

## 1. 先安装 `pip install "fastapi[standard]"`？

- **`fastapi` 基础包**只包含核心功能，缺少生产环境常用的依赖。
- **`fastapi[standard]`** 是官方推荐的完整安装方式，它额外安装了以下常用组件：
  - **`uvicorn[standard]`**：高性能 ASGI 服务器（支持 WebSocket、HTTP/2 等）。
  - **`python-multipart`**：解析表单数据和文件上传。
  - **`email-validator`**：邮箱格式验证。
  - 其他可选依赖（如 `httpx`、`jinja2` 等，视版本而定）。
- 使用 `[standard]` 可以**一键获得开箱即用的环境**，避免后续手动安装缺失库，同时确保与官方文档示例完全兼容。

> 💡 如果你只需要轻量级开发，也可以只装 `fastapi` 并手动添加所需依赖，但 `[standard]` 是大多数项目的首选。

---


## 2. 同步路由（`def`） vs 异步路由（`async def`）的区别
**2.1同步路由调用**
```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
 ```

 **2.2异步路由调用**
 ```python 
 from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
```


| 对比维度 | 同步函数 (`def`) | 异步函数 (`async def`) |
|--------|----------------|----------------------|
| **运行方式** | FastAPI 会将同步函数放在**外部线程池**中执行（通过 `run_in_threadpool`），不会阻塞主事件循环。 | 直接在**主事件循环**中运行，支持 `await` 异步操作。 |
| **适用场景** | 适合**CPU 密集型**任务或同步 I/O（如文件读写、同步数据库驱动）。 | 适合**I/O 密集型**任务（如异步数据库查询、HTTP 请求、WebSocket 通信）。 |
| **性能影响** | 由于切换线程，有一定开销，但避免了阻塞事件循环，整体吞吐量仍可接受。 | 无线程切换开销，但若函数内没有 `await` 操作，反而会因事件循环调度增加微小延迟（不如同步函数高效）。 |
| **编写限制** | 内部**不能**使用 `await` 关键字。 | 内部**可以**使用 `await` 调用其他异步协程。 |
| **最佳实践** | 如果路由函数**不需要**调用异步库，建议使用 `def`，性能更佳。 | 如果路由函数需要与异步库交互（如 `asyncpg`、`httpx.AsyncClient`），必须使用 `async def`。 |

---

### 补充说明

- FastAPI 对两种写法**完全兼容**，你可以根据业务需求灵活选择。
- 即使使用 `async def` 但没有 `await`，代码也能正常运行，但 FastAPI 会将其视为普通协程，效率略低于同步函数，因此不推荐这样写。
- 在 FastAPI 的依赖项、后台任务中，同样适用上述规则。

---

### 示例对比

- **同步版本**（使用 `def`）：  
  两个路由都将在线程池中运行，适合简单的返回 JSON 操作，无异步依赖。

- **异步版本**（使用 `async def`）：  
  路由可直接挂起等待其他异步操作，但如果内部没有 `await`，反而会降低些许性能。  

> 对于给出的简单示例（仅返回字典），两种写法在功能上完全一致，但推荐使用 `def`，因为更轻量。

---

### 总结

- **安装**：始终使用 `pip install "fastapi[standard]"` 以获得完整功能。
- **函数定义**：根据实际业务逻辑选择 `def` 或 `async def`，遵循“需要 `await` 则用异步，否则用同步”的原则。
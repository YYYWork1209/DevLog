# LangChain和LangGraph的相互合作

- **LangChain** = 提供“**积木**”（模型接口、工具、解析器、记忆），让你能**拼出**一个强大的单智能体。
- **LangGraph** = 提供“**流水线图纸**”，让你能**规划**任何复杂的流程（**不仅是多智能体，也包括单智能体内部的复杂循环**）。


### 1. LangGraph 不只是“多智能体协作”，它更是“复杂单智能体”的底盘

LangGraph 是对于多智能体之间如何协作进行规划或者单智能体内部如何规划执行的框架

在 LangChain 最新的架构（v1.0+）中，**就连“单个强大的智能体”（比如能自动调用 10 个工具的 Agent）其底层引擎也是 LangGraph**。

- 一个智能体在思考时，内部流程其实是：`思考(LLM)` -> `调用工具` -> `观察结果` -> `再思考(LLM)` -> ...
- 这个**“思考-行动-观察”的循环**，如果用 LangChain 旧的 `AgentExecutor` 来实现，像个黑盒，很难调试。
- 用 **LangGraph** 来实现，你可以把“思考”画成一个节点，“调用工具”画成另一个节点，然后用**条件边**让它在“工具调用错误”时跳回“思考”重试。

LangGraph 是“**状态机（State Machine）**”，它既可以管好几个智能体之间的协作，也可以管好一个智能体内部的多次思考。它是流程控制层，**不挑单多**。

---

### 2. LangChain 不只是“造智能体”，它是“造所有 LLM 零件”

LangChain 最强大的地方在于它的**集成生态（Integrations）**：

- 你需要对接 50 种不同的向量数据库？LangChain 有统一接口。
- 你需要写一个不涉及任何智能体的**纯粹的 RAG（检索增强生成）**（流程：查文档 -> 拼提示词 -> 生成答案）？LangChain 的 `LCEL（LangChain 表达式语言）` 用几行代码就能搭个线性链。
- 你需要解析 AI 返回的 JSON 格式？LangChain 有输出解析器。

LangChain 更像是一个**LLM 操作系统的基础库**，它提供的是零件（Model、Tool、Retriever），而 LangGraph 是那个用来把这些零件以**非线性的、带条件跳转的**方式组装起来的工作台。

---

### 3.“一个是创建好用工具，一个是如何充分利用好工具”


**LangChain 提供了海量的‘标准零件（API 封装）；LangGraph 提供了一张‘图纸’，让你能把这些零件组装成带有循环和条件的精密流水线。”**

---

### 开发中的互相合作

在实际的企业级项目中，它们根本不分家：

```python
# 1. 用 LangChain 的零件（积木）
from langchain_openai import ChatOpenAI
from langchain_community.tools import DuckDuckGoSearchRun

model = ChatOpenAI()           # 积木1：模型
search_tool = DuckDuckGoSearchRun()  # 积木2：工具

# 2. 用 LangGraph 的图纸（工作台）
from langgraph.graph import StateGraph

# 把上面的积木塞进图纸的节点里
workflow.add_node("agent", call_model)  
workflow.add_node("action", call_tool)  
workflow.add_conditional_edges("agent", should_continue)  # 判断是否调用工具
```

也可以理解为**它们是同一个生态系统中的“前端”和“后端”**：
- 遇到调用模型、写提示词、连数据库，优先翻 **LangChain** 的文档。
- 遇到需要判断、循环、多轮对话、人机交互，优先翻 **LangGraph** 的文档。

# 基于LangGraph的简易三步问答架构（帮助理解LangGraph的图编排理念）
## 统一的数据结构（全局状态）
首先依据需求定义统一的数据结构，用于节点之间的消息传递，同时便于后续调试
> LangGraph中采用图编排的方式构建智能体，不同的智能体或工具作为图中的节点，边则指定智能体 => 智能体、智能体 => 工具间的执行顺序，节点与边共同组成图，而节点与节点之间的数据交互方式就是我们依据项目需求自定义的数据结构。

这是一个共享的数据结构，它在图的每个节点之间传递，作为工作流的持久化上下文。 每个节点都可以读取该结构中的数据，并对其进行更新
```python
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class SearchState(TypedDict):
    messages: Annotated[list, add_messages]
    user_query: str      # 经过LLM理解后的用户需求总结
    search_query: str    # 优化后用于Tavily API的搜索查询
    search_results: str  # Tavily搜索返回的结果
    final_answer: str    # 最终生成的答案
    step: str            # 标记当前步骤
```
同时包含了` user_query `和 `search_query `字段。这允许智能体先将用户的自然语言提问，优化成更适合搜索引擎的精炼关键词，从而显著提升搜索结果的质量(问题重写)。

> 知识拓展：
> 这里的`message：Annotated[list, add_message]`中 
> - `list`:指的是`message`字段是`list`类型的。
> - `add_message`：当这个字段有更新时，请使用 add_messages 这个函数来处理,而不是直接覆盖


## `add_message`：一条写给`LangGraph`框架的处理规则
###  1. Annotated 到底是什么？
语法：`Annotated[Type, Metadata]`

作用：告诉类型检查工具也就是框架（这里是 LangGraph）：“这个字段的类型是 Type，并且附带这条 Metadata 信息。”

在上面的代码中：

- Type（类型）：list —— 表示 messages 是一个列表。

- Metadata（元数据）：add_messages —— 告诉 LangGraph 框架：“当这个字段有更新时，请使用 add_messages 这个函数来处理，而不是直接覆盖。”

### 2. 核心机制：add_messages 是“缩减器（Reducer）”
这是 LangGraph 状态管理的设计。如果没有 add_messages，默认情况下，当**多个节点**往 messages 里写数据时，后面的会完全覆盖前面的。

假设没有缩减器（默认行为）：

- 节点 A 返回 `{"messages": ["你好"]}`

- 节点 B 返回 `{"messages": ["世界"]}`

- 最终状态：`["世界"]`（节点 A 的内容丢失了）。

使用 `Annotated[list, add_messages]` 后：

- 节点 A 返回 `{"messages": ["你好"]}`

- 节点 B 返回 `{"messages": ["世界"]}`

- `LangGraph `内部检测到 `messages` 带有 `add_messages` 元数据，于是调用该函数来处理：`add_messages(["你好"], ["世界"])`。

- 最终状态：`["你好", "世界"]`（追加合并）。

所以，`add_messages` 是一条写给 `LangGraph `引擎的“处理规则”。

## 关于`add_message`:  

`add_messages `是 LangGraph 框架预置好的一个标准“归约器”（Reducer）函数 

“不可变更新”原则。LangGraph 的节点返回值是用来做“差异对比（Diff）”的。如果大家都用 .append 直接改 state，在多节点并行或循环时，会出现数据覆盖的混乱（节点A改的，被节点B的旧缓存覆盖）。

所以每个节点只返回自己产生的数据回来，这样即方便后续调试（可以很直观的看到哪个节点产生了什么样的数据），也方便我们进行数据的管理。

### 什么是“归约器”（Reducer）？

可以把“归约器”理解为一个**状态更新规则**。

在 LangGraph 中，每个节点（Node）并不是直接修改全局状态，而是**返回一个“更新（Update）”**。框架收到所有节点的更新后，需要有一套规则来决定如何把这些“更新”合并到“旧状态”中，生成“新状态”。这套规则就是“归约器”。

*   **默认规则是“覆盖”**：如果一个字段没有指定归约器，那么新的值会**直接覆盖**旧的值。
*   **`add_messages` 的规则是“追加”**：它的作用，就是确保新的消息**追加**到已有消息列表的末尾，而不是覆盖掉整个历史记录。

### `add_messages` 的工作原理

`add_messages` 是一个专门为处理消息列表而设计的归约器，它的工作比简单的“追加”要更智能一些：

1.  **规范化输入**：它能把传入的消息统一处理成标准的消息列表格式。
2.  **自动生成ID**：它会确保每一条消息都有一个唯一、稳定的ID，方便追踪和管理。
3.  **智能合并**：
    *   对于**新消息**（没有匹配ID），直接**追加**到列表末尾。
    *   对于**已存在消息**（匹配ID），会用新消息**替换**旧消息。
    *   它还支持通过发送 `RemoveMessage` 来**删除**特定消息。

### 如何使用？

`add_messages` 的使用方式很直接，就是将它作为类型注解的一部分。

如果你使用 LangGraph 内置的 `MessagesState`，它已经为你配置好了：

```python
from langgraph.graph import MessagesState

# MessagesState 内部已经使用了 add_messages
class MessagesState(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]
```

如果你想自定义状态，也可以手动添加：

```python
from typing import Annotated, TypedDict
from langgraph.graph.message import add_messages

class MyState(TypedDict):
    messages: Annotated[list, add_messages]  # 为 messages 字段指定使用 add_messages 规则
    user_query: str
```

### 总结

简单来说，`add_messages` 是 LangGraph 提供的一个**智能的消息合并工具**。它让你在处理对话历史时，只需简单返回新的消息，框架就会自动、正确地将它们合并到总历史中，而无需你手动管理列表的追加、更新或删除。


## 基础环境配置
```python
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from tavily import TavilyClient

# 加载 .env 文件中的环境变量
load_dotenv()

# 初始化模型
# 我们将使用这个 llm 实例来驱动所有节点的智能
llm = ChatOpenAI(
    model=os.getenv("LLM_MODEL_ID", "gpt-4o-mini"),
    api_key=os.getenv("LLM_API_KEY"),
    base_url=os.getenv("LLM_BASE_URL", "https://api.openai.com/v1"),
    temperature=0.7
)
# 初始化Tavily客户端
tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
```


## 创建三个核心工作流节点（理解与问题重写 => 搜索 => 回答）
### 1. 问题重写节点
对于用户的模糊或者自然语言进行提炼总结，得出查询方向，查询关键词，依此调用查询工具进行查询
```python
def understand_query_node(state: SearchState) -> dict:
    """步骤1：理解用户查询并生成搜索关键词"""
    user_message = state["messages"][-1].content
    
    understand_prompt = f"""分析用户的查询："{user_message}"
请完成两个任务：
1. 简洁总结用户想要了解什么
2. 生成最适合搜索引擎的关键词（中英文均可，要精准）

格式：
理解：[用户需求总结]
搜索词：[最佳搜索关键词]"""
    # 传入系统提示词，创建SystemMessage类的实例传入列表中，解析为大模型对应接收的json类型数据
    response = llm.invoke([SystemMessage(content=understand_prompt)])
    response_text = response.content
    
    # 解析LLM的输出，提取搜索关键词
    search_query = user_message # 默认使用原始查询
    if "搜索词：" in response_text:
        search_query = response_text.split("搜索词：")[1].strip()
    
    return {
        "user_query": response_text,
        "search_query": search_query,
        "step": "understood",
        "messages": [AIMessage(content=f"我将为您搜索：{search_query}")]
    }
```

### 2.搜索节点
负责执行智能体的“工具使用”能力，它将调用 Tavily API 进行真实的互联网搜索。
```python
def tavily_search_node(state: SearchState) -> dict:
    """步骤2：使用Tavily API进行真实搜索"""
    search_query = state["search_query"]
    try:
        print(f"🔍 正在搜索: {search_query}")
        response = tavily_client.search(
            query=search_query, search_depth="basic", max_results=5, include_answer=True
        )
        # ... (处理和格式化搜索结果) ...
        search_results = ... # 格式化后的结果字符串
        
        return {
            "search_results": search_results,
            "step": "searched",
            "messages": [AIMessage(content="✅ 搜索完成！正在整理答案...")]
        }
    except Exception as e:
        # ... (处理错误) ...
        return {
            "search_results": f"搜索失败：{e}",
            "step": "search_failed",
            "messages": [AIMessage(content="❌ 搜索遇到问题...")]
        }
```
节点通过 tavily_client.search 发起真实的 API 调用。它被包裹在 try...except 块中，用于捕获可能的异常。如果搜索失败，它会更新 step 状态为 "search_failed"，这个状态将被下一个节点用来触发失败之后的备用方案。

### 3.回答节点
结合用户问题，搜索结果进行回答，最后的回答节点能够根据上一步的搜索是否成功，来选择不同的回答策略。
```python
def generate_answer_node(state: SearchState) -> dict:
    """步骤3：基于搜索结果生成最终答案"""
    if state["step"] == "search_failed":
        # 如果搜索失败，执行回退策略，基于LLM自身知识回答
        fallback_prompt = f"搜索API暂时不可用，请基于您的知识回答用户的问题：\n用户问题：{state['user_query']}"
        response = llm.invoke([SystemMessage(content=fallback_prompt)])
    else:
        # 搜索成功，基于搜索结果生成答案
        answer_prompt = f"""基于以下搜索结果为用户提供完整、准确的答案：
用户问题：{state['user_query']}
搜索结果：\n{state['search_results']}
请综合搜索结果，提供准确、有用的回答..."""
        response = llm.invoke([SystemMessage(content=answer_prompt)])
    
    return {
        "final_answer": response.content,
        "step": "completed",
        "messages": [AIMessage(content=response.content)]
    }
```
该节点通过检查 state["step"] 的值来执行条件逻辑。如果搜索失败，它会利用 LLM 的内部知识回答并告知用户情况。如果搜索成功，它则会使用包含实时搜索结果的提示，来生成一个有据可依的回答。

## 利用LangGraph进行图编排，把节点串起来
这里没有使用条件边进行编排，后续可以通过条件边进行拓展（例如若是回答不准确则循环到问题重写节点进行重新执行，直到回答准确，要注意循环次数的限制）

通过条件边，我们可以轻松构建“反思-修正”循环，例如在我们的案例中，如果搜索失败，可以设计一个回退到备用方案的路径。这是构建能够自我优化和具备容错能力的智能体的关键（LangGraph的优点）。

```python
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver

def create_search_assistant():
    workflow = StateGraph(SearchState)
    
    # 添加节点
    workflow.add_node("understand", understand_query_node)
    workflow.add_node("search", tavily_search_node)
    workflow.add_node("answer", generate_answer_node)
    
    # 设置线性流程，后续可使用条件边进行拓展
    workflow.add_edge(START, "understand")
    workflow.add_edge("understand", "search")
    workflow.add_edge("search", "answer")
    workflow.add_edge("answer", END)
    
    # 编译图
    memory = InMemorySaver()
    app = workflow.compile(checkpointer=memory)
    return app

    # 运行图
    inputs = {"current_task": "分析最近的AI行业新闻", "messages": []}
    for event in app.stream(inputs):
      print(event)
```
**图编排中的一些概念：**

1. **`InMemorySaver`**：临时内存“存档库”，程序重启即丢失，仅用于本地开发测试。
2. **`checkpointer=memory`**：编译时注入“自动存档”功能，每执行完一个节点自动保存当前完整状态。  
Checkpointer（检查点器） 是指一种能在图执行过程中自动保存“运行快照（Snapshot）”的机制。  
    * checkpointer=memory 的含义：告诉 LangGraph 引擎：“在我执行节点时，每走一步，就把当前的完整状态（比如 messages、user_query 等）保存到 memory 这个仓库里去。”  
    * 为什么指向它：因为 memory 是 InMemorySaver 的实例，它是一个实现了“保存（put）”和“读取（get）”接口的具体存储工具。编译时注入它，图就有了“存档”和“读档”的能力。  
    * 类比：这就像玩游戏时，你的游戏程序（图）本身不会自动存档，但你在设置里挂载了一个“自动存档插件”（checkpointer），并指定把存档文件存在“内存盘”（memory）里。
3. **`app.stream(inputs)`**：**流式执行**，每跑完一个节点立即产出事件，边跑边汇报，非阻塞等待。
4. **`event`**：流式产出的“进度包裹”，常见格式为 `{节点名: 该节点返回的状态更新}`，最终结束标志为 `{'__end__': ...}`。  
    - 是图在执行过程中，每一个“步骤（Step）”结束后发出的状态更新包
5. **状态更新铁律**：**禁止**在节点内使用 `state["messages"].append()`（绕过框架），必须通过 `return {"messages": [新消息]}` 让框架的 `add_messages` 归约器智能合并（支持按 ID 去重/替换），确保持久化安全。

# LangGraph的优缺点：
如搜索助手案例所示，LangGraph 将完整的实时问答流程，显式地定义为一个由状态、节点和边构成的“流程图”。

**优势：**

这种设计有高度的可控性与可预测性。开发者可以精确地规划智能体的每一步行为，同时通过条件边，我们可以轻松构建“反思-修正”的循环智能体。

例如在我们的案例中，如果搜索失败，可以设计一个回退到备用方案的路径。这是构建能够自我优化和具备容错能力的智能体的关键。

此外，由于每个节点都是一个独立的 Python 函数，这带来了高度的模块化。同时，在流程中插入一个等待人类审核的节点也变得非常直接，后续功能的拓展也十分方便。

**局限性：**

与基于对话的框架相比，LangGraph 需要开发者编写更多的前期代码，定义状态、节点、边等一系列操作，使得对于简单任务而言，开发过程显得更为繁琐。

开发者需要更多地考虑如何控制流程，而不是做什么（what）。由于工作流是预先定义的，LangGraph 的行为虽然可控，但也缺少了对话式智能体那种动态的、发散式的交互。（执行过于固定）

它的强项在于执行一个确定的、可靠的流程，而非模拟开放式的、不可预测的社会性协作。

调试过程同样存在挑战。虽然流程比对话历史更清晰，但问题可能出在多个环节：某个节点内部的逻辑错误、在节点间传递的状态数据发生异变，或是边跳转的条件判断失误。这要求开发者对整个图的运行机制有全局性的理解。





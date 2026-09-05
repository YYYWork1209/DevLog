## config配置基类
给出固定默认值，同时若未传入参数，从环境变量中进行读取
```python
"""配置管理"""
import os
from typing import Optional, Dict, Any
from pydantic import BaseModel

class Config(BaseModel):
    """HelloAgents配置类"""
    
    # LLM配置
    default_model: str = "gpt-3.5-turbo"
    default_provider: str = "openai"
    temperature: float = 0.7
    max_tokens: Optional[int] = None
    
    # 系统配置
    debug: bool = False
    log_level: str = "INFO"
    
    # 其他配置
    max_history_length: int = 100
    
    @classmethod
    def from_env(cls) -> "Config":
        """从环境变量创建配置"""
        return cls(
            debug=os.getenv("DEBUG", "false").lower() == "true",
            log_level=os.getenv("LOG_LEVEL", "INFO"),
            temperature=float(os.getenv("TEMPERATURE", "0.7")),
            max_tokens=int(os.getenv("MAX_TOKENS")) if os.getenv("MAX_TOKENS") else None,
        )
    
    def to_dict(self) -> Dict[str, Any]:
        """转换为字典"""
        return self.dict()
```

## Message消息类
通过 typing.Literal 将 role 字段的取值严格限制为 "user", "assistant", "system", "tool" 四种，这直接对应 OpenAI API 的规范，保证了类型安全
```python
"""消息系统"""
from typing import Optional, Dict, Any, Literal
from datetime import datetime
from pydantic import BaseModel

# 定义消息角色的类型，限制其取值
MessageRole = Literal["user", "assistant", "system", "tool"]

class Message(BaseModel):
    """消息类"""
    
    content: str
    role: MessageRole
    timestamp: datetime = None
    metadata: Optional[Dict[str, Any]] = None
    
    def __init__(self, content: str, role: MessageRole, **kwargs):
        super().__init__(
            content=content,
            role=role,
            timestamp=kwargs.get('timestamp', datetime.now()),
            metadata=kwargs.get('metadata', {})
        )
    
    def to_dict(self) -> Dict[str, Any]:
        """转换为字典格式（OpenAI API格式）"""
        return {
            "role": self.role,
            "content": self.content
        }
    
    def __str__(self) -> str:
        return f"[{self.role}] {self.content}"
```
## llm基础客户端
主要实现基础的模型客户端，是所有Agent实现交流的基础，功能如下：
1. 依据传入的apikey,baseurl等信息进行创建模型客户端，进行大模型的调用
2. 依据provider进行不同模型的自适应，主要是通过模型的apikey以及baseurl进行匹配，然后返回对应的模型提供商，得知使用的供应商后就去获取对应供应商的环境变量信息（这里匹配还是依据不同供应商配置的不同名称的环境变量，太依靠变量名称了，名称一换就匹配不到了）

    ```python
          """" 自动检测LLM提供商

        检测逻辑：
        1. 优先检查特定提供商的环境变量
        2. 根据API密钥格式判断
        3. 根据base_url判断
        4. 默认返回通用配置"""
        # 上面是得出使用的哪个供应商，下面是使用对应供应商的信息
        if self.provider == "openai":
            resolved_api_key = api_key or os.getenv("OPENAI_API_KEY") or os.getenv("LLM_API_KEY")
            resolved_base_url = base_url or os.getenv("LLM_BASE_URL") or "https://api.openai.com/v1"
            return resolved_api_key, resolved_base_url
            
    ```
3. 实现了一些基础功能，例如流式非流式调用等

## Agent基类

- 通过接收基础的模型客户端llm，在此基础上进行封装，对除基本问答功能与自动识别供应商外的拓展功能进行统一
- 借助抽象类的特性，继承python中的ABC模式，结合@abstractmethod注解，实现对agent类型的结构功能统一。
- 基类创建好基础的属性以及方法，同时规定子类必须统一实现相同结构的run方法，这样后续不同类型智能体都通过继承方式，实现基础功能统一，若是需要添加独有功能，直接进行添加即可。
- 后续实现不同类型的Agent，都会继承该Agent基类，保证不同类型Agent的调用都是同一种模式，实现**无感切换**。封装内部实现细节。

```python
"""Agent基类"""
from abc import ABC, abstractmethod
from typing import Optional, Any
from .message import Message
from .llm import HelloAgentsLLM
from .config import Config

class Agent(ABC):
    """Agent基类"""
    
    def __init__(
        self,
        name: str,
        llm: HelloAgentsLLM,
        system_prompt: Optional[str] = None,
        config: Optional[Config] = None
    ):
        self.name = name
        self.llm = llm
        self.system_prompt = system_prompt
        self.config = config or Config()
        self._history: list[Message] = []
    
    @abstractmethod
    def run(self, input_text: str, **kwargs) -> str:
        """运行Agent"""
        pass
    
    def add_message(self, message: Message):
        """添加消息到历史记录"""
        self._history.append(message)
    
    def clear_history(self):
        """清空历史记录"""
        self._history.clear()
    
    def get_history(self) -> list[Message]:
        """获取历史记录"""
        return self._history.copy()
    
    def __str__(self) -> str:
        return f"Agent(name={self.name}, provider={self.llm.provider})"
```

## 工具基类Tool
- 这里同样采用抽象类进行结构统一，方便后续注册工具时进行统一管理
- 每一个工具都包含：
  1. 工具名称：name
  2. 工具描述：description，用来告诉大模型该工具的作用，让模型依据该描述来判断是否需要调用这个工具
  3. 是否可展开：expandable，工具是否是可以进行展开的，也就是该工具是否还有子工具。
    子工具会使用装饰器进行装饰，给工具附上属性（工具其实就是一个个函数，装饰器就是给函数加上属性，判断时依据属性来判断是否是子工具）
      > 对工具进行了整合，类似于汽车中包含发动机，这种关联性比较强的工具直接整合到一起，作为子工具出现
  4. 获取工具的参数列表：一般是通过从方法签名或是方法描述文档中获取。

### 如何获取子工具
先来了解一下装饰器的作用:
1. Python 装饰器：是一个在代码加载时立即执行的函数，它接收被装饰的函数作为参数,给函数贴上属性标签后返回，返回一个新的函数（或原函数）
2. 使用方式
  ```python
  @tool_action("memory_add", "添加新记忆")
  def _add_memory(...): ...
  ```
  - 先调用 tool_action("memory_add", ...)，得到内部的 decorator 函数
  - 再把 _add_memory 传给 decorator
  - decorator 给函数贴上属性标签（func._is_tool_action = True）后返回

通过装饰器我们可以对函数进行属性的添加，类似于**贴上标签**，后续可以依据标签实现差异化处理。  
例如使用装饰器装饰的函数（或者说是带标签，带属性的）是子工具，未使用装饰器的就是其他辅助函数，类似格式转换，数据解析函数等

**装饰器示例代码**：
```python
def tool_action(name: str = None, description: str = None):
    """装饰器：标记一个方法为可展开的工具 action

    用法:
        @tool_action("memory_add", "添加新记忆")
        def _add_memory(self, content: str, importance: float = 0.5) -> str:
            '''添加记忆

            Args:
                content: 记忆内容
                importance: 重要性分数
            '''
            ...

    Args:
        name: 工具名称（如果不提供，从方法名自动生成）
        description: 工具描述（如果不提供，从 docstring 提取）
    """
    def decorator(func: Callable):
        func._is_tool_action = True
        func._tool_name = name
        func._tool_description = description
        return func
    return decorator
```

#### 获取子工具方式
```python
  def get_expanded_tools(self) -> Optional[List['Tool']]:
        """获取展开后的子工具列表

        默认实现：自动从标记了 @tool_action 的方法生成子工具
        子类可以重写此方法提供自定义的展开逻辑

        Returns:
            如果工具支持展开，返回子工具列表；否则返回 None
        """
        if not self.expandable:
            return None

        # 自动从装饰器标记的方法生成工具
        tools = []
        for name, method in inspect.getmembers(self, predicate=inspect.ismethod):
            if hasattr(method, '_is_tool_action'):
                tool = AutoGeneratedTool(
                    parent=self,
                    method=method,
                    name=method._tool_name,
                    description=method._tool_description
                )
                tools.append(tool)

        return tools if tools else None
```
1. 依据inspect.getmembers来获取工具的所有属性，包括方法，同时使用predicate=inspect.ismethod来过滤，得到方法所有的实例方法列表
2. 过滤只要使用装饰器装饰过的方法，因为工具内部还有一些是辅助类方法，像对格式进行转换，整理数据这类方法不可能是子工具，所以就不需要。
3. 过滤得到的数据结构是字典类型，键值对的形式。

### 对子工具进行处理
由于提取出之后的子工具本质还是方法，我们要把子工具解析为工具Tool的统一格式，工具名称，工具名，然后统一交给大模型，方便使用。  
- 主要就是，父工具绑定（要知道当前子工具是哪个工具下的），子工具名，子工具描述，子工具的参数获取

## 注册工具
注册工具时，有两种方式进行注册：
1. 直接注册为Tool对象，注册到工具列表中
    > 注册为Tool对象之后，可进行调用工具中的方法获取基本信息，增强了工具的自述性  
    例如获取工具的参数信息，子工具信息，子工具参数信息等
2. 注册为一个函数，把一个个函数放到列表中
    ```python
      def create_calculator_registry():
        """创建包含计算器的工具注册表"""
        registry = ToolRegistry()

        # 注册计算器函数
        registry.register_function(
            name="my_calculator",
            description="简单的数学计算工具，支持基本运算(+,-,*,/)和sqrt函数",
            func=my_calculate
        )

        return registry
        #使用示例
        # 创建包含计算器的注册表
        registry = create_calculator_registry()
    ```

## 关于调用工具
发消息给大模型之前会连同当前可用工具的列表一并发送，工具列表中信息为工具的名称，工具的描述
- 注册工具：向工具列表中添加工具信息，注意若是有可展开的子工具则进行展开处理
- 提取参数: 从上下文中进行提取参数信息，要注意参数的类型转换
- 执行工具：依据工具名获取到工具的本体进行执行对应函数

### 关于参数的提取与转换
1. 先解析传来的参数信息，可能是键值对，可能是json，都进行解析得到参数字典
2. 结合工具的参数的类型信息，对参数进行类型转换
3. 把转换好的参数字典传给工具，执行工具调用，得到结果

## 获取工具执行信息
既然我们想让智能体执行对应工具，那我们就**要能够知道智能体每一步执行了哪个工具，结果是什么，而不是只知道智能体执行了工具其他一概不知**。

### 实现方式
实现的方法如下：
1. 通过提示词规定模型返回的文本中要包含工具调用日志信息，工具名，工具参数，执行结果，对结构进行设定。
2. 得到结果后对内容进行提取，得到我们需要的详细信息然后进行记录或是直接输出。
3. 提示词以及解析方式如下：  
  **提示词示例**如下：
    ```txt
      ## 可用工具
      你可以使用以下工具来帮助回答问题
      {tools_description} 

      ## 工具调用格式
      当需要使用工具时，请使用以下格式：
      [TOOL_CALL:{tool_name}:{parameters}]
    ```
    **解析方式示例**如下：
    ```python
    def _parse_tool_calls(self, text: str) -> list:
        """解析文本中的工具调用"""
        pattern = r'\[TOOL_CALL:([^:]+):([^\]]+)\]'
        matches = re.findall(pattern, text)
        
        tool_calls = []
        for tool_name, parameters in matches:
            tool_calls.append({
                'tool_name': tool_name.strip(),
                'parameters': parameters.strip(),
                'original': f'[TOOL_CALL:{tool_name}:{parameters}]'
            })
        
        return tool_calls
    ```

## 多工具协作
### 链式调用
Agent完成某个任务时可能需要多个工具进行协作，为此建立了一个工具的链式调用机制。
 
**工具系统开发的核心理念**：在设计层面，每个工具都应该遵循单一职责原则，专注于特定功能的同时保持接口的统一性，并将完善的异常处理和安全优先的输入验证作为基本要求。在性能优化方面，利用异步执行提高并发处理能力，同时合理管理外部连接和系统资源。

执行时，先把需要使用的工具注册到工具管理器中，然后注册到过滤器链中，让工具按特定顺序执行(本质上是使用列表进行存储工具的顺序，遍历时作为执行依据)

示例如下：
```python
def create_research_chain() -> ToolChain:
    """创建一个研究工具链：搜索 -> 计算 -> 总结"""
    chain = ToolChain(
        name="research_and_calculate",
        description="搜索信息并进行相关计算"
    )

    # 步骤1：搜索信息
    chain.add_step(
        tool_name="search",
        input_template="{input}",
        output_key="search_result"
    )

    # 步骤2：基于搜索结果进行计算
    chain.add_step(
        tool_name="my_calculator",
        input_template="2 + 2",  # 简单的计算示例
        output_key="calc_result"
    )

    return chain

```

### 工具异步执行
采用线程池配合Python的**协程**结合实现工具的异步执行，支持多个工具的并行异步


## Agent的记忆系统
采用多种记忆模式设计记忆系统：
1. **长期记忆（语义记忆）**：它存储的是更为抽象的知识、概念和规则。例如，通过对话了解到的**用户偏好**、需要长期遵守的指令或领域知识点，都适合存放在这里。这部分记忆具有高度的持久性和重要性，是智能体形成“知识体系”和进行关联推理的核心
2. **短期的工作记忆**：一般只针对当前对话，并有最大窗口限制，扮演着智能体“短期记忆”的角色，主要用于存储当前对话的上下文信息。为确保高速访问和响应，其容量被有意限制（例如，默认50条），并且生命周期与单个会话绑定，会话结束后便会自动清理
3. **情景记忆**：它负责长期存储具体的交互事件和智能体的学习经历。与工作记忆不同，情景记忆包含了丰富的上下文信息，并支持按时间序列或主题进行回顾式检索，是智能体“复盘”和学习过往经验的基础。
4. **感知记忆**:该模块专门处理图像、音频等**多模态**信息，并支持跨模态检索。其生命周期会根据信息的重要性和可用存储空间进行动态管理。

采用统一入口状态机进行区分调用的记忆操作类型：
```python
def execute(self, action: str, **kwargs) -> str:
    """执行记忆操作

    支持的操作：
    - add: 添加记忆（支持4种类型: working/episodic/semantic/perceptual）
    - search: 搜索记忆
    - summary: 获取记忆摘要
    - stats: 获取统计信息
    - update: 更新记忆
    - remove: 删除记忆
    - forget: 遗忘记忆（多种策略）
    - consolidate: 整合记忆（短期→长期）
    - clear_all: 清空所有记忆
    """

    if action == "add":
        return self._add_memory(**kwargs)
    elif action == "search":
        return self._search_memory(**kwargs)
    elif action == "summary":
        return self._get_summary(**kwargs)
    # ... 其他操作
```
**通过action参数指定具体操作，使用kwargs允许每个操作有不同的参数需求**,这里kwargs接受多个参数，一般是键值对的形式（也就是关键字参数）方法需要参数则对应传入，不需要则可以进行按需过滤，或者不做处理单纯忽略掉不需要的参数。实现按需接收。

存储记忆时采用同步存入记忆对应的importance重要程度（依据分类来区分，例如属于短期记忆的内容重要程度会低一些），用来作为搜索记忆时的权重，越低的越不重要，排序时尽量靠后。

---

### MemoryTool基础功能
这是暴露给大模型的几个基础功能：
1. `add`：add操作是记忆系统的基础，它模拟了人类大脑将感知信息编码为记忆的过程。在实现中，我们不仅要存储记忆内容，还要为每个记忆添加丰富的上下文信息，这些信息将在后续的检索和管理中发挥重要作用
2. `search`：search操作是记忆系统的核心功能，它需要在大量记忆中快速找到与查询最相关的内容。它涉及语义理解、相关性计算和结果排序等多个环节。
3. `forget`：遗忘机制模拟人类大脑的选择性遗忘过程，支持三种策略：基于重要性（删除不重要的记忆）、基于时间（删除过时的记忆）和基于容量（当存储接近上限时删除最不重要的记忆）
4. `consolidate`：模拟人类大脑将短期记忆转化为长期记忆的过程。默认设置是将重要性超过0.7的工作记忆转换为情景记忆，这个阈值确保只有真正重要的信息才会被长期保存。整个过程是自动化的，用户无需手动选择具体的记忆，系统会智能地识别符合条件的记忆并执行类型转换。

MemoryTool构建了一个完整的记忆生命周期管理体系。从记忆的**创建、检索、摘要到遗忘、整合和管理**，形成了一个闭环的智能记忆管理系统，让Agent真正具备了类人的记忆能力

---

### MemoryManager管理类
MemoryManager作为记忆系统的核心协调者，负责管理不同类型的记忆模块(上述提到的四个功能模块)，并提供统一的操作接口，并**指定使用的配置信息**。具体的存储与检索能力由**各记忆类型在内部实现**

MemoryTool在初始化时会创建一个MemoryManager实例，并根据**配置**启用不同类型的记忆模块。这种设计让用户可以根据具体需求选择启用哪些记忆类型

### 四种记忆类型的设计
#### 1. 工作记忆
工作记忆是记忆系统中最活跃的部分，它负责存储当前对话会话中的临时信息。工作记忆的设计重点在于快速访问和自动清理，这种设计确保了系统的响应速度和资源效率。    

##### **工作记忆的存储：**

工作记忆采用了纯内存存储方案(直接存到集合中)，配合TTL（Time To Live）机制进行自动清理。这种设计的优势在于访问速度极快，但也意味着工作记忆的内容在系统重启后会丢失。这种特性正好符合工作记忆的定位，存储临时的、易变的信息

##### **工作记忆的检索**

```python
   base_relevance = vector_score * 0.7 + keyword_score * 0.3 if vector_score > 0 else keyword_score
            time_decay = self._calculate_time_decay(memory.timestamp)
            importance_weight = 0.8 + (memory.importance * 0.4)
            
            final_score = base_relevance * time_decay * importance_weight
```
         

- 这里的base_relevance是综合向量得分占0.7关键词得分占0.3然后得出的总体值

- 这里的timedecay则是时间越久远分值就越低，

- 然后最后的importance_weight则是给前两个分数一个整体的权重值，如果是1就不对他们造成影响，如果是小于1就代表让整体得分变低，排序就更靠后，自然降低了排序率，

然后importance_weight内部的话，一般保存记忆时会关联带的有记忆重要性分值也就是memory_importance的值（0-1），这样的话若是0.5则刚刚好乘以0.4再加0.8等于1，不对整体分值照成影响，若是大于0.5则importance_weight会大于1，这样提高分值，若是小于0.5则会小于1刚好降低相关性。

importance_weight是针对于记忆的基础记忆重要性分值，然后timedeacy则是依据记忆新鲜度，第一个baserelevacnce则是关于语义相似度的分值，三者结合**综合了语义相关性，新鲜度，记忆本身的重要性**得出一个综合分数进行搜寻相关的内容

最后根据排序取关联性最高同时时效性最高的记忆


#### 2. 情景记忆
情景记忆存储的是记忆与事件的关联，存储具体的事件和经历，它偏向于保持**事件的完整性和时间序列关系**。情景记忆采用了SQLite+Qdrant的混合存储方案，SQLite负责结构化数据的存储和复杂查询，Qdrant负责高效的向量检索。    
 - SQLite: 结构化存储记忆信息，包括记忆相关的元数据信息  
 - Qdrant: 向量存储记忆信息，用于语义搜索


##### **情景记忆存储**  

情景记忆的存储是SQLite结构化存储和Qdrant向量存储两种方式。  
1. 把记忆进行结构化之后存储进SQLite中
2. 记忆向量化后存入Qrdant中
检索时，先依据需求去SQLite中查询符合要求的记忆列表，然后去向量数据库中寻找语义相近的记忆列表，最后得到两部分的交集记忆列表。  
3. 依据权重计算得分总值：(向量相似度 × 0.8 + 时间近因性 × 0.2) × (0.8 + 重要性 × 0.4)  

这样**确保检索结果既语义相关又时间相关**



##### **情景记忆的检索方式**
1. 利用 SQLite 处理精确查询的接口。在检索时，先去调用该方法，根据传入的时间范围、重要性等级、用户ID等硬性条件，把符合结构化规则的事件 ID 先筛选出来
2. 然后去Qrdant中查询语义相关的记忆列表利用 Qdrant 处理语义查询的接口。它将用户的自然语言问题转为向量，在海量历史记忆中找出“意思最像”的 Top N 个结果
3. 结合前两步的结果，求两者的交集数据，作为这次查询相关的记忆结果
4. 最后依据权重计算得分总值：(向量相似度 × 0.8 + 时间近因性 × 0.2) × (0.8 + 重要性 × 0.4)  

**确保检索结果既语义相关又时间相关**


#### 3. 语义记忆
语义记忆负责存储**抽象的概念、规则和知识**。语义记忆的设计重点在于知识的结构化表示和智能推理能力。语义记忆采用了Neo4j图数据库和Qdrant向量数据库的混合架构，这种设计让系统**既能进行快速的语义检索，又能利用知识图谱进行复杂的关系推理**。

结合语义记忆的原理，我们可以在这个基础上进行智能体的增强，让智能体把聊天过程中的信息进行整合，最终变 成知识库，可以是常用知识点的总结（如何判断呢？加一个字段作为知识点的出现频繁程度，若是特别频繁就进行存储为对应类型的知识库，判断出现次数时需要进行语义的判断），也可以是某种错误事件的经验总结，若是之前ai犯错，那就把事件类型，原因总结起来作为错误经验知识库，让智能体可以自动成长。

##### 语义记忆的存储
1. 写入记忆时，使用nlp从非结构化文本中自动抽取出 Entity 和 Relation，把记忆存储到图数据库。
2. 记忆转换为向量，结合元数据存储到向量数据库中
    ```python
    def add(self, memory_item: MemoryItem) -> str:
        """添加语义记忆"""
        # 1. 生成文本嵌入
        embedding = self.embedding_model.encode(memory_item.content)
        
        # 2. 提取实体和关系
        entities = self._extract_entities(memory_item.content)
        relations = self._extract_relations(memory_item.content, entities)
        
        # 3. 存储到Neo4j图数据库
        for entity in entities:
            self._add_entity_to_graph(entity, memory_item)
        
        for relation in relations:
            self._add_relation_to_graph(relation, memory_item)
        
        # 4. 存储到Qdrant向量数据库
        metadata = {
            "memory_id": memory_item.id,
            "entities": [e.entity_id for e in entities],
            "entity_count": len(entities),
            "relation_count": len(relations)
        }
        
        self.vector_store.add_vectors(
            vectors=[embedding.tolist()],
            metadata=[metadata],
            ids=[memory_item.id]
        )
    ```


##### 语义记忆的检索
语义记忆的检索实现了混合搜索策略，结合了向量检索的语义理解能力和图检索的关系推理能力

先分别去向量数据库和图数据库去查询相关的记忆列表，然后对记忆列表进行整合，最后依据权重计算总得分，返回排序后的记忆结果。

语义记忆的评分公式为：(向量相似度 × 0.7 + 图相似度 × 0.3) × (0.8 + 重要性 × 0.4)。这种设计的核心思想是：

- 向量检索权重（0.7）：语义相似度是主要因素，确保检索结果与查询语义相关
- 图检索权重（0.3）：关系推理作为补充，发现概念间的隐含关联
- 重要性权重范围[0.8, 1.2]：避免重要性过度影响相似度排序，保持检索的准确性

```python
def _combine_and_rank_results(self, vector_results, graph_results, query, limit):
    """混合排序结果"""
    combined = {}
    
    # 合并向量和图检索结果
    for result in vector_results:
        combined[result["memory_id"]] = {
            **result,
            "vector_score": result.get("score", 0.0),
            "graph_score": 0.0
        }
    
    for result in graph_results:
        memory_id = result["memory_id"]
        if memory_id in combined:
            combined[memory_id]["graph_score"] = result.get("similarity", 0.0)
        else:
            combined[memory_id] = {
                **result,
                "vector_score": 0.0,
                "graph_score": result.get("similarity", 0.0)
            }
    
    # 计算混合分数
    for memory_id, result in combined.items():
        vector_score = result["vector_score"]
        graph_score = result["graph_score"]
        importance = result.get("importance", 0.5)
        
        # 基础相似度得分
        base_relevance = vector_score * 0.7 + graph_score * 0.3
        
        # 重要性权重 [0.8, 1.2]
        importance_weight = 0.8 + (importance * 0.4)
        
        # 最终得分：相似度 * 重要性权重
        combined_score = base_relevance * importance_weight
        result["combined_score"] = combined_score
    
    # 排序并返回
    sorted_results = sorted(
        combined.values(),
        key=lambda x: x["combined_score"],
        reverse=True
    )
    
    return sorted_results[:limit]
```

感知记忆的评分公式为：(向量相似度 × 0.8 + 时间近因性 × 0.2) × (0.8 + 重要性 × 0.4)。感知记忆的评分机制还支持跨模态检索，通过统一的向量空间实现文本、图像、音频等不同模态数据的语义对齐。当进行跨模态检索时，系统会自动调整评分权重，确保检索结果的多样性和准确性。此外，感知记忆中的时间近因性计算采用了指数衰减模型

### 四种记忆类型中的时间性计算方式

#### 自然指数函数作为衰减模型
自然指数曲线图如图所示：

![](/imgs/自然指数函数.png)

**自然指数指的是数学中的e^x（e 约等于 2.71828）**:

当x>0时：
1. x趋近于正无穷，e^x的值就越大，趋近于正无穷
2. x趋近于负无穷，e^x值越小，趋近于0

当x<0时：
1. x趋近于正无穷，e^x的值趋近于0
2. x趋近于负无穷，e^x值越大趋近于正无穷


以此做为计算记忆的时间得分。公式为：e^(-衰减因子`*`天数)  即 e^-(衰减因子`*`天数)
1. 用当前查询当前时间（当时取记忆的时间）减去存储记忆的初始时间，得到小时数后用小时数/24得到记忆的天数。
2. 衰减因子是定义衰减程度的阈值，值越大，与天数的乘积自然越大，加上前面的负号，最终e^-x的值的情况：

    - x越大(就是衰减因子*天数的值越大)，最终结果越趋近于0，记忆的时间得分越低
    - x越小（就是衰减因子*天数的值越小），最终结果越大，记忆时间得分越大

> **由于是用记忆初始存储时间到当前查询记忆时间的小时数除以24的到的天数，所以天数最小为0，e^-x的值最大为1，时间得分的范围为0-1**

---

#### 时间衰减的计算
```python
def _calculate_recency_score(self, timestamp: str) -> float:
    """计算时间近因性得分"""
    try:
        memory_time = datetime.fromisoformat(timestamp)
        current_time = datetime.now()
        age_hours = (current_time - memory_time).total_seconds() / 3600
        
        # 指数衰减：24小时内保持高分，之后逐渐衰减
        decay_factor = 0.1  # 衰减系数
        # 使用自然指数函数，以e为底，变量decay_factor为衰减系数进行计算，exp就是方式计算函数
        # math.exp(x) 不是绝对值，它指的是自然指数函数，即数学中的e^x（e 约等于 2.71828）
        # 若想增大衰减程度，增大decay_factory系数即可
        recency_score = math.exp(-decay_factor * age_hours / 24)
        
        return max(0.1, recency_score)  # 最低保持0.1的基础分数
    except Exception:
        return 0.5  # 默认中等分数
```

`math.exp(x)`它指的是自然指数函数，即数学中的 **\( e^x \)**（\( e \) 约等于 2.71828）。

这里专门写成 `math.exp(-decay_factor * age_hours / 24)`，是利用 **\( e \) 的负幂次方** 来生成一条从 1 平滑下降到 0 的衰减曲线。

**1. 定义“衰减速度”**

代码中的 `decay_factor = 0.1` 是速率常数，而 `age_hours / 24` 是把小时换算成“天”。所以，**指数部分**（即 \( x \)）实际上等于 **\( 0.1 \times 天数 \)**。

**2. `exp(-x)` 的意义**

`exp(-x)` 等价于 \( e^{-x} \)，也就是 \( \frac{1}{e^{x}} \)。

- 当 **age=0**（刚发生）时：\( x = 0 \)，`exp(0) = 1`（满分）。
- 当 **age=24小时（1天）** 时：\( x = 0.1 \)，`exp(-0.1) ≈ 0.905`。这意味着即使过了一天，分数依然有 **90.5%**，衰减非常缓慢（这是“24小时内保持高分”的体现）。
- 当 **age=240小时（10天）** 时：\( x = 1.0 \)，`exp(-1) ≈ 0.368`。分数降到了 36.8%。
- 当 **age=无限大** 时：分数无限趋近于 0（但因为最后有 `max(0.1, ...)`，所以最低会卡在 0.1）。


**总结**：`exp(-x)` 就是标准的**指数衰减**，利用 \( e \) 的幂次方特性，让分数随着时间增长按比例平滑下降，而不是直线下降。可以把它理解为“记忆的半衰期”模型——越久远的事情，权重越低，但永远不会直接归零。

如果觉得 `0.1` 系数衰减太慢（10天后还有36%），想让它“忘得更快”，只需要把 `decay_factor` 调大即可（比如改成 `0.5`，那么1天后就只剩 60.6% 了）。

这种时间衰减模型模拟了人类记忆中的遗忘曲线，确保了感知记忆系统能够优先检索到时间上更相关的记忆内容。



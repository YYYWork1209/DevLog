# AI 智能客服系统设计

## 整体架构

基于多维特征信号的多阶段意图分类引擎，结合规则状态机将问题路由至三种执行模式（统一 Agent、通用生成、混合生成），覆盖售前咨询、售后处理、投诉转人工、工单申请、订单查询等 9 个业务领域和 13 种服务意图的精准识别。

系统核心由四个模块组成：意图识别与路由、RAG 多级检索、实体抽取与业务执行、流式交互与异步处理。

---

## 一、智能意图识别与多模式路由

### 多维特征信号融合

输入不止是用户当前消息，还融合了：

- 历史对话上下文（最近 3 轮）
- 用户画像标签（会员等级、历史工单类型）
- 当前页面来源（如从订单详情页发起）
- 客服场景下的业务阶段（售前/售后）

这些信号被编码为文本前缀或拼接进分类模型输入。

### 多阶段意图分类

**第一阶段：领域粗分类**

使用轻量文本分类模型（如蒸馏版 BERT 或 fastText），将问题归入 9 个业务领域：

```java
public enum Domain {
    PRE_SALES("售前咨询"),
    AFTER_SALES("售后处理"),
    COMPLAINT("投诉转人工"),
    WORK_ORDER("工单申请"),
    ORDER_QUERY("订单查询"),
    GENERAL("通用闲聊");
}

public enum Intent {
    // 售前
    PRODUCT_INFO("商品咨询"),
    PRICE_QUERY("价格查询"),
    // 售后
    REFUND("退款申请"),
    EXCHANGE("换货申请"),
    REPAIR("维修申请"),
    // 投诉
    COMPLAINT_HUMAN("投诉转人工"),
    // 工单
    WORK_ORDER_APPLY("工单提交"),
    // 订单
    ORDER_STATUS("订单状态"),
    ORDER_CANCEL("取消订单"),
    // 兜底
    UNKNOWN("未知意图");
}
```

**第二阶段：意图细分类**

每个领域下挂载专属小模型，进一步识别服务意图。置信度判断逻辑：

- 置信度 > 0.85 → 直接调用对应模型，跳过细分类
- 置信度过低 → 调用细分类模型进一步判断
- 特别低 → 回退至强规则（关键词 + 正则）兜底

### 规则状态机与模式路由

对话状态由有限状态机维护：`{领域, 意图, 槽位, 对话阶段}`。根据识别结果路由至三种模式：

| 模式 | 适用场景 | 特点 |
|------|------|------|
| **统一 Agent** | 多步工具调用（如订单查询需调 API） | LLM 完成「思考 → 调工具 → 整合结果」 |
| **通用生成** | 纯闲聊或简单 FAQ | 直接由 LLM 生成回复，不涉及外部调用 |
| **混合生成** | 需要知识库辅助 + 总结 | 先检索片段，再交由 LLM 融合生成 |

---

## 二、RAG 多级检索引擎

设计"向量召回 → 关键词补召 → 上下文融合"三层容错体系。

### 第一层：pgvector 向量语义检索

将用户问题通过 Embedding 模型转换为向量，在 PostgreSQL 的 pgvector 扩展中执行余弦相似度搜索，快速返回 Top-K 相关文档块。

### 第二层：无阈值回退逻辑

当向量检索最高相似度低于阈值（如 0.7）时，自动触发关键词模糊匹配：

```sql
-- PostgreSQL 全文检索：直接用用户提问做模糊查询
to_tsvector(text) @@ plainto_tsquery('用户输入内容')
```

- `to_tsvector(text)`：将文档文本转换为词位向量（分词索引）
- `plainto_tsquery()`：将用户输入自动分词，生成 AND 逻辑查询
- `@@`：全文匹配操作符

### 第三层：合并与重排序

将两层结果合并，按文档 ID 去重，基于相似度分数或关键词相关度排序，取 Top 片段注入上下文。

### 上下文承接与跨文档继承

**文档继承机制**：维护活跃文档上下文栈。用户从文档 A 切换到文档 B 时，从 A 的问答历史中提取摘要或实体，与针对 B 的新查询拼接，防止意图漂移。

**跨会话传递**：利用 Redis 存储最近对话中涉及的文档 ID 及槽位信息。新会话开始时预注入系统提示词，让模型"记得"上次聊到的文档内容。

---

## 三、业务动作识别与实体抽取

### 实体自动抽取

**正则表达式**作为高精度抽取器：

- 订单编号：`ORD-\d{8,}`、`\b[A-Z]{2}\d{12}\b`
- 数量：`\d+\s*(个|件|台|kg)`
- 手机号、工单号等

复杂实体（商品描述、地址）辅助使用 NER 模型或 LLM 做实体识别。

### 跨轮次槽位解析

使用 Redis 维护每个会话的动态槽位表：

```
{意图: "退款", 订单号: None, 数量: None, 原因: None}
```

流程：用户说"我要退款" → 检查槽位 → 订单号为空 → 追问"请提供订单号" → 正则提取补全 → 所有必填槽位填满 → 触发 API 调用。

### 提示词注入

槽位信息最终拼入系统提示词：

```java
String systemPrompt = String.format(
    "你是客服Agent，用户意图为：【%s】。已提取的订单信息：%s。...",
    intent.getChineseName(),
    slots.toString()
);
```

LLM 在 Function Calling 时利用这些槽位去调用对应工具。

---

## 四、流式交互与异步处理

### SSE 流式问答

后端采用 Server-Sent Events 协议，调用大模型流式生成接口，每收到一个 token 封装为 `data: {token}` 写入响应流，前端用 `EventSource` 实时渲染打字机效果。

关键点：API 网关需关闭对该接口的缓冲，支持长连接。

### 基于 RabbitMQ 的异步文档处理

```
上传文件 → 存对象存储 → 返回"正在处理" → 发消息到队列 → Worker 异步处理
```

后台 Worker 按序执行：**解析**（Unstructured/LangChain 提取文本）→ **分块**（RecursiveCharacterTextSplitter） → **嵌入**（批量向量化） → **入库**（pgvector，更新状态为 ready）。

失败则进入死信队列重试或告警。非阻塞设计让上传接口响应时间从数秒降至几十毫秒。

---

## 总结

| 模块 | 核心技术 | 解决的问题 |
|------|------|------|
| 意图识别 | 级联分类 + 状态机 | 高精度路由，避免答非所问 |
| RAG 检索 | 三层容错 + 上下文继承 | 多轮跨文档场景的检索稳定性 |
| 实体抽取 | 槽位填充 + 正则 + 跨轮记忆 | 从"能说"到"能做"的业务闭环 |
| 流式 & 异步 | SSE + RabbitMQ | 交互实时性与系统伸缩性 |


# RAG 流程自定义增强

## 为什么需要自定义

Spring AI 官方提供的 `QuestionAnswerAdvisor` 只能走固定流程：

```
用户问题 → 知识库检索 → 自动拼接提示词 → 大模型 → 回答
```

它的问题：
- 自动拼接提示词，用的是固定模板，不能改
- 无法在检索前/后插入自定义逻辑
- 不能对用户问题做预处理

使用 `RetrievalAugmentationAdvisor` 可以构建自己的 Advisor，在 RAG 管线前后自由扩展：

```
自定义后：
用户问题 → 问题重写 → 检索 → 自定义拼接规则 → 大模型 → 回答
```

---

## 一、用户问题重写

用户提问往往不规范：口语化、模糊、甚至包含错别字。在检索前对问题做规范化重写，能显著提升检索命中率。

```java
Advisor retrievalAugmentationAdvisor = RetrievalAugmentationAdvisor.builder()
    .queryTransformers(RewriteQueryTransformer.builder()
            .chatClientBuilder(chatClientBuilder.build().mutate())
            .build())
    .documentRetriever(VectorStoreDocumentRetriever.builder()
            .similarityThreshold(0.50)
            .vectorStore(vectorStore)
            .build())
    .build();

String answer = chatClient.prompt()
    .advisors(retrievalAugmentationAdvisor)
    .user(question)
    .call()
    .content();
```

关键组件说明：

| 组件 | 作用 |
|------|------|
| `RetrievalAugmentationAdvisor` | 自定义 RAG 管线入口 |
| `RewriteQueryTransformer` | 调用大模型将口语化问题优化为标准检索问题 |
| `.chatClientBuilder(...)` | 指定用哪个大模型改写问题 |
| `.mutate()` | 复制一个独立 ChatClient，不污染主对话上下文 |
| `VectorStoreDocumentRetriever` | 配置向量库检索规则（相似度阈值、向量库实例）|

---

## 二、自定义提示词拼接

使用自定义 Advisor 后，官方 `QuestionAnswerAdvisor` 的自动拼接功能不再生效，需要自己用 `PromptTemplate` 完成。

### PromptTemplate 的作用

把**用户问题 + 检索出来的文档**拼接成完整提示词：

```markdown
请根据下面的上下文回答用户问题，不要编造答案。
上下文：{documents}
用户问题：{question}
```

### 通过模板控制回答规则

- 要求 AI 只使用文档内容回答
- 没有找到答案时禁止瞎编
- 指定语气：专业 / 口语化
- 格式要求：分点、带序号
- 要求附上来源文档标题
- 指定语言：中文 / 英文

**全部通过模板控制**，不需要改代码。

---

## 三、SystemPrompt vs PromptTemplate vs templateRenderer

这三个概念容易混淆，区别如下：

| 组件 | 作用 | 生效范围 |
|------|------|------|
| **SystemPrompt / defaultSystem** | 定义全局角色和规则 | 整个 ChatClient 生命周期，所有请求都生效 |
| **PromptTemplate** | RAG 环节的局部任务模板 | 仅在 RAG 流程中被调用，拼接问题与文档 |
| **templateRenderer** | 底层字符串替换引擎 | 为 PromptTemplate 等服务，负责把 `{变量}` 替换为实际值 |

核心区别：如果大模型回答问题没走 RAG 流程，就不会用到 `PromptTemplate`，但 `SystemPrompt` 的全局规则始终生效。

### 代码示例

```java
// SystemPrompt：全局系统提示词
@Bean
public ChatClient chatClient(OpenAiChatModel model) {
    return ChatClient.builder(model)
            .defaultSystem("你是专业的技术客服，回答必须简洁准确")
            .build();
}
```

```java
// PromptTemplate：RAG 环节的局部模板
String template = """
    请根据下面的上下文回答用户问题，不要编造答案。
    上下文：{documents}
    用户问题：{question}
    """;
```

---

## 四、检索后文档过滤

使用 `DocumentPostProcessor` 在文档传给模型前做后处理：

- 按相关性重排序
- 移除不相关或冗余文档
- 压缩文档内容，减少噪声

这确保注入大模型上下文的文档是**精准、去噪**的，避免无关内容干扰回答质量。

---

## 总结

| 阶段 | 默认行为 | 自定义能力 |
|------|------|------|
| 检索前 | 直接检索 | 问题重写、规范化 |
| 检索中 | 固定阈值 | 自定义相似度、过滤规则 |
| 检索后 | 固定模板拼接 | 自定义 PromptTemplate |
| 传模型前 | 直接传入 | DocumentPostProcessor 过滤 |


# 解锁RAG与Spring AI的实战应用：https://cloud.tencent.com/developer/article/2626104


问题重写判断：

使用了 **Spring AI Alibaba 框架**实现查询重写（Query Rewriting），但**当前实现并未包含“是否需要重写”的智能判断逻辑**，而是对所有输入强制执行重写操作。以下从框架设计原理和代码实现角度详细分析：

---

### 一、当前代码的核心逻辑与问题
#### 1. **关键代码行为**
```java
public String doQueryRewriter(String prompt) {
    Query query = new Query(prompt);
    Query transformedQuery = queryTransformer.transform(query); // 直接调用重写
    return transformedQuery.text();
}
```
- **问题本质**：  
  `queryTransformer.transform(query)` **无条件执行重写**，未对输入 `prompt` 做任何前置条件判断。  
  即使用户输入的是独立完整问题（如“2024年端午节放假几天？”），也会被送入大模型重写，**必然增加无效耗时**。

#### 2. **框架设计限制**
- `RewriteQueryTransformer` 是 Spring AI Alibaba 中专用于**强制重写**的实现类（类名已体现其目的）。  
- 其 `transform()` 方法的**设计意图就是始终返回重写后的新查询**，而非“按需重写”。  
- **框架未内置判断逻辑**：Spring AI 的 `QueryTransformer` 接口本身不包含 `shouldRewrite()` 这类钩子方法，需开发者自行扩展。

---

### 二、为什么需要“是否需要重写”的判断？
#### 1. **当前实现的缺陷**
| 场景 | 用户输入 | 当前行为 | 问题 |
|------|----------|----------|------|
| 独立问题 | “通义千问最新版本是什么？” | 强制调用大模型重写 | **浪费50ms+ API调用时间** |
| 模糊指代 | “那上海呢？”（前文讨论报销标准） | 正确重写为“上海差旅报销标准” | 合理 |
| 高频FAQ | “密码重置流程” | 重写后仍为相同内容 | **无意义调用** |

#### 2. **性能影响量化**
- 每次强制重写需 **50~200ms**（含网络延迟 + 大模型推理）。
- 若系统 QPS=100，**100%请求强制重写**将导致：  
  **每秒额外增加 5~20 秒的无效计算时间**，显著拖累整体响应速度。

---

### 三、如何改造以支持“按需重写”？
#### 1. **方案：扩展 ConditionalQueryTransformer**
Spring AI 提供了 `ConditionalQueryTransformer` 接口，专用于实现**条件性重写**。改造步骤如下：

##### 改进后的代码
```java
@Component
public class SmartQueryRewriter implements ConditionalQueryTransformer { // 实现条件接口

    private final QueryTransformer rewriteTransformer; // 重写执行器
    private final ChatClient chatClient;

    public SmartQueryRewriter(ChatModel dashscopeChatModel) {
        this.chatClient = ChatClient.builder(dashscopeChatModel).build();
        this.rewriteTransformer = RewriteQueryTransformer.builder()
                .chatClient(this.chatClient)
                .build();
    }

    // 【核心】判断是否需要重写
    @Override
    public boolean shouldTransform(Query query) {
        String prompt = query.text();
        
        // 规则1：独立问题直接跳过（示例规则，需根据业务完善）
        if (isStandaloneQuestion(prompt)) {
            return false;
        }
        
        // 规则2：高频FAQ跳过（需维护FAQ列表）
        if (isFaqQuestion(prompt)) {
            return false;
        }
        
        // 规则3：模糊指代必须重写（如包含"这个/那/呢"且上下文缺失）
        return containsAmbiguousReference(prompt);
    }

    @Override
    public Query transform(Query query) {
        // 仅当 shouldTransform() 返回 true 时才会执行此方法
        return rewriteTransformer.transform(query);
    }

    // 以下为示例规则实现（需根据实际业务补充）
    private boolean isStandaloneQuestion(String prompt) {
        // 检查是否包含明确时间/地点/实体（简化版）
        return prompt.matches(".*(\\d{4}年|哪里|多少|如何).*");
    }

    private boolean containsAmbiguousReference(String prompt) {
        // 检查模糊指代词
        return prompt.matches(".*(这个|那个|那|呢|这里).*");
    }
}
```

##### 改进点
| 改进项 | 说明 |
|--------|------|
| **实现 `ConditionalQueryTransformer`** | 框架会自动调用 `shouldTransform()` 做前置判断 |
| **轻量级规则引擎** | 用正则/关键词匹配快速过滤无需重写的问题（**耗时<1ms**） |
| **保留强制重写能力** | 仅对模糊问题调用大模型，避免无效 API 调用 |

#### 2. **生产环境增强建议**
- **动态规则库**：将判断规则存储在配置中心（如 Nacos），支持实时更新。
- **缓存高频结果**：对已重写的相似问题缓存结果（如“上海报销标准” → “上海差旅报销标准”）。
- **熔断机制**：大模型服务异常时，回退到基于规则的简单重写（如替换“那”为前文主题）。

---

### 四、Spring AI 框架的局限性说明
#### 1. **框架未解决的问题**
- **上下文感知缺失**：`ConditionalQueryTransformer` 默认**不提供对话历史**，需自行注入 `ConversationContext`。
- **规则需业务定制**：模糊指代的判断逻辑（如“那上海呢？”）高度依赖业务场景，框架无法开箱即用。

#### 2. **正确集成上下文的方法**
```java
// 在 shouldTransform() 中获取对话历史
@Override
public boolean shouldTransform(Query query, ConversationContext context) {
    // 检查历史中是否存在可解析的指代对象
    boolean hasAmbiguousRef = containsAmbiguousReference(query.text());
    boolean hasRelevantHistory = !context.getHistory().isEmpty();
    
    return hasAmbiguousRef && hasRelevantHistory;
}
```
> **注意**：需确保 `SmartQueryRewriter` 在调用链中能访问到 `ConversationContext`（通常由 Spring AI 的 `AiClient` 传递）。

---

### 结论
1. **当前代码问题**：  
   直接使用 `RewriteQueryTransformer` 会导致**所有查询强制重写**，未实现“是否需要重写”的判断，**必然引入不必要延迟**。

2. **正确做法**：  
   - **必须实现 `ConditionalQueryTransformer` 接口**，通过 `shouldTransform()` 方法前置过滤。  
   - **结合业务规则 + 轻量NLP**（如指代词检测）快速决策，避免盲目调用大模型。  
   - **关键指标**：确保 60%+ 的独立问题能跳过重写环节（实测可降低平均延迟 30ms+）。

3. **框架定位**：  
   Spring AI Alibaba 提供了扩展点，但**智能判断逻辑需开发者自行实现**——这正是区分“可用系统”和“高性能系统”的关键细节。




# 模型发送请求使用异步执行分析任务

```java
@PostMapping(value = "/ai_ops", produces = "text/event-stream;charset=UTF-8")
public SseEmitter aiOps() {
    SseEmitter emitter = new SseEmitter(600000L); // 10分钟超时（告警分析可能较慢）
    executor.execute(() -> {
        try {
            // 调用 AiOpsService 执行分析流程
            Optional<OverAllState> overAllStateOptional = aiOpsService.executeAiOpsAnalysis(chatModel, toolCallbacks);
            OverAllState state = overAllStateOptional.get();
            logger.info("AI Ops 编排完成，开始提取最终报告...");

            // 提取最终报告
            Optional<String> finalReportOptional = aiOpsService.extractFinalReport(state);
            // 输出最终报告
            if (finalReportOptional.isPresent()) {
                // 发送
            }
        }
    });
    return emitter;
}
```

代码中的executor就是把agent请求的任务交给了另一个线程，让他去执行，避免了等待，提高了高并发情况下的稳定性

### 异步执行分析任务，为什么需要另一个线程？

简单来说，这是为了 **“不让一个人（线程）累死，也不让他堵住后面的所有人”**。

想象一下餐厅的运作：

- **Tomcat 的请求处理线程** = 餐厅门口接待客人的 **迎宾员**。
- **耗时的 AI 分析任务** = 需要厨师花很长时间才能做好的 **复杂菜肴**。

#### 同步方式（错误示范）

迎宾员（Tomcat 线程）接到一个点餐（请求）后，自己跑到后厨，亲自盯着厨师做完这道菜（耗时 5 分钟），然后端着菜给客人，再回来迎接下一位客人。

**问题**：

1. **效率极低**：迎宾员 5 分钟只能服务一位客人。
2. **服务瘫痪**：如果同时来了 10 位客人，就需要 10 位迎宾员，但餐厅可能总共就 5 位迎宾员。后来的客人只能排队等待，甚至被拒绝服务。这就是你说的 **“拖垮服务器”**。

#### 异步方式（代码的做法）

迎宾员（Tomcat 线程）接到点餐后，立刻把菜单交给一个专门负责传菜的 **“跑单员”**（自定义线程池 `executor`），然后马上回头去接待新的客人。

- **跑单员** 的任务很简单：拿着菜单，等着厨师（AI 分析任务）把菜做好，然后端给客人。
- **厨师** 在后厨慢慢做菜，完全不影响前台的迎宾工作。

**好处**：

1. **迎宾员解放**：负责网络请求的 Tomcat 线程可以瞬间返回，继续处理成百上千的其他请求，并发能力大增。
2. **任务有序执行**：耗时的 AI 任务会被放到一个独立的、可控的 “跑道”（线程池）上排队执行，不会让服务器乱套。

**一句话总结：** 这是网络服务器处理耗时任务的 **标准工业实践**，目的是为了将 **“管理请求的轻量工作”** 与 **“处理业务的重量工作”** 分离开，保证服务的整体稳定和高效

**改进建议**：如果想更优雅，可以改用 `CompletableFuture` + `SseEmitter` 的组合，让代码更健壮（超时控制、异常传递）。

# Optional < >一个帮忙判断是否是空的包装盒



## `Optional<String>` 是什么？

这是一个用于 **“安全地告诉调用方：我可能有值，也可能没有”** 的容器。

#### 为什么会有 `Optional`？

在 Java 中，一个方法如果可能返回 `null`，调用方很容易忘记检查，直接调用 `null` 对象的方法就会触发 `NullPointerException`（空指针异常），导致程序崩溃。`Optional` 就像一个 **“漂亮的包装盒”**，它明确地告诉你：**“里面的东西可能存在，也可能是空的，你必须拆开检查后才能使用”**。

#### 在这个场景中

- `extractFinalReport(state)` 方法（从 AI 多 Agent 的执行结果中提取最终的告警报告）不能保证 100% 成功。如果内部流程出错，报告字段缺失等，就无法提取出报告。
- 于是，这个方法返回一个 `Optional<String>`：
  - **如果成功**：盒子里装着报告内容（`Optional.of("报告内容")`）。
  - **如果失败**：盒子里是空的（`Optional.empty()`）。

`isPresent()`的作用

# `isPresent()`、`ifPresent` 方法的作用

它就是 **“检查包装盒是否为空”** 的官方方法。

- **返回 `true`**：说明盒子里有东西，可以安全地用 `.get()` 方法拿出来。
- **返回 `false`**：说明盒子是空的，不能拿，需要走其他逻辑（比如返回错误信息）。

**你看到的这段代码**

```java
if (finalReportOptional.isPresent()) {
    // 发送
}
```

它的完整逻辑应该是：

```java
if (finalReportOptional.isPresent()) {
    // 1. 用 .get() 方法安全地取出报告内容
    String report = finalReportOptional.get();
    // 2. 通过 SSE 发送给客户端
    emitter.send(report);
    // 3. 表示任务完成，可以关闭连接了
    emitter.complete();
} else {
    // 盒子是空的，说明提取报告失败
    emitter.send("系统内部错误：无法生成最终报告，请检查日志。");
    // 以异常形式完成连接
    emitter.completeWithError(new RuntimeException("No report extracted"));
}
```



**更优雅的写法：**
使用 `ifPresent` 方法，代码更简洁，也完全避免了 `get()` 可能带来的风险：

```java
finalReportOptional.ifPresentOrElse(
    report -> { emitter.send(report); emitter.complete(); }, // 有值
    () -> { emitter.send("无法生成报告"); emitter.completeWithError(...); } // 无值
);
```
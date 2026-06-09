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

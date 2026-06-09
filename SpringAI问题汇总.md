# SpringAI问题汇总

# RAG相关的Pom.xml配置

- **`spring-ai-advisors-vector-store`**：提供开箱即用的 RAG 流程实现，比如 `QuestionAnswerAdvisor` 等功能。它能自动协调 "何时检索，如何增强提示词" 等流程问题。
- **`spring-ai-vector-store`**：提供核心的抽象层，定义了通用的 `VectorStore` 接口。它规定了向向量数据库增、删、查的API标准，与具体存储无关。
- **`spring-ai-redis-store`**：作为上述接口的一个具体实现，提供连接 Redis 进行向量存储和检索的功能。

# 原子引用相关问题

```java
public class SystemPromptConfig {

    private final AIProperties aiProperties;

    private final NacosConfigManager nacosConfigManager;

    //原子引用，保证线程安全，不让多线程情况下，出现读取提示词信息读取一半的情况出现，要么读取完整旧信息，要么读取完整新信息
    //这里的原子引用就是一个盒子，需要信息就从中取，保证信息的完整性准确性
    private final AtomicReference<String> chatSystemMessage = new AtomicReference<String>();

    private final AtomicReference<String> routeAgentSystemMessage = new AtomicReference<>();

    private final AtomicReference<String> recommendAgentSystemMessage = new AtomicReference<>();

    @PostConstruct
    public void initSystemPrompt() throws NacosException {

        //加载系统提示词，并配置热更新
        loadSystemPrompt(aiProperties.getSystem().getChat(),chatSystemMessage);
        loadSystemPrompt(aiProperties.getSystem().getRouteAgent(), routeAgentSystemMessage);
        loadSystemPrompt(aiProperties.getSystem().getRecommendAgent(), recommendAgentSystemMessage);

    }


    /**
     * 实现从nacos中实时加载配置文件信息，并使用原子引用保证数据安全性
     * @param promptProperties 配置文件信息对应实体类,配置文件名，所属组名，连接超时时间
     * @param chatSystemMessage 原子引用用来存储配置信息防止多线程情况下出错
     */
    private void loadSystemPrompt(AIProperties.System.Chat promptProperties,AtomicReference<String> chatSystemMessage) throws NacosException {

        try {
            //先获取配置服务然后通过配置服务中的get方法依据配置文件名，组名获取到对应配置文件的信息
            ConfigService configService = nacosConfigManager.getConfigService();
            //获取配置信息同时添加监听器实现热更新，返回结果就是获取到的配置信息的内容
            String systemPrompt = configService.getConfigAndSignListener(promptProperties.getDataId(), promptProperties.getGroup(), promptProperties.getTimeoutMs(), new Listener() {
                @Override
                public Executor getExecutor() {
                    return null;
                }

                /**
                 * <p>监听到配置文件变化后的更新操作</>
                 * 把新的提示词存入到原子引用当中
                 * @param systemPrompt
                 */
                @Override
                public void receiveConfigInfo(String systemPrompt) {
                    chatSystemMessage.set(systemPrompt);
                }
            });
            //获取配置信息成功，存入到原子引用当中
            chatSystemMessage.set(systemPrompt);
            log.info("读取原子引用{}成功,存入系统提示词内容为：{}",chatSystemMessage,systemPrompt);

        } catch (NacosException e) {
            log.error("读取原子引用{}失败",chatSystemMessage,e);
        }


    }


解释一下这里的原子引用，以及是否会造成多实例下数据不统一的问题，可以用在生产环境下吗
```

这段代码是用 **Nacos 作为配置中心，实现提示词（System Prompt）动态热更新** 的典型写法。下面分点解释你关心的问题。

---

### 1. 原子引用在这里的作用

`AtomicReference<String>` 是一个**对象引用容器**，保证对其中引用的读写操作具有原子性，即：

- 写：`chatSystemMessage.set(newPrompt)` 是一个原子操作，不会出现“写一半”的中间状态。
- 读：`chatSystemMessage.get()` 直接返回一个完整的 `String` 对象，不会读到损坏的字符串。

在并发场景下，一个线程在更新提示词，另一个线程正在读取提示词去调用大模型，如果没有原子引用，可能会（例如）读到拼接了一半的字符串，导致发给模型的 prompt 损坏。  
原子引用解决了**单 JVM 内多线程读写的安全问题**。

---

### 2. 多实例下数据不统一的问题

会存在，但这**不是 AtomicReference 的问题**，而是**分布式配置推送延迟**带来的天然现象。

- Nacos 配置更新后，是异步通知各个服务实例的 `Listener`。
- 不同实例接收到通知、执行 `receiveConfigInfo` 的时间**不可能绝对同时**，因此各实例上的 `AtomicReference` 指向的字符串，在很短的时间窗口内会不一致。
- 这属于**最终一致性**，通常在毫秒到秒级会统一。如果你的业务对这个短暂不一致敏感（比如同时要求所有请求必须立即使用新提示词），则需要额外处理。

**常见缓解手段**：
- 设计上接受短暂不一致，因为提示词变更通常不是强一致性需求。
- 如果需要更强的同步，可以用 Nacos 的配置版本对比 + 定期自检，但一般没必要。

---

### 3. 能在生产环境使用吗？

**可以，而且这是很成熟的生产实践。** 但需要注意几个点，确保健壮性：

#### ✅ 已经做对的地方
- **用 `AtomicReference` 保证单实例线程安全**，避免读到中间态。
- **通过 Nacos Listener 实现热更新**，修改配置后无需重启服务。
- **在 `@PostConstruct` 中初始化时先从 Nacos 拉取一次配置**，保证启动即有值。

#### ⚠️ 需要检查/改进的地方，提升生产可靠性

1. **空值保护**  
   如果 Nacos 不可用或配置被误删，`getConfigAndSignListener` 可能返回 `null`。调用方直接 `get()` 会 NPE。应保证：
   - 初始化时若获取失败，有默认提示词兜底，或启动时快速失败。
   - 在读取使用的地方做 `Optional.ofNullable` 保护。

2. **Listener 回调中的异常处理**  
   `receiveConfigInfo` 方法内部应 `try-catch`，防止回调异常导致后续配置变更监听失效。

3. **Nacos 单点故障**  
   Nacos 集群本身需要高可用，否则配置服务中断会影响新实例启动（拉不到配置）。但运行中实例的热更新会失效，保留最后一次有效配置，影响较小。

4. **配置格式校验**  
   推送的新配置可能是非法内容（比如乱码、不完整的模板）。可以在 `receiveConfigInfo` 中增加校验，校验不通过则保留旧值并告警，避免注入了坏提示词影响全部问答。

5. **提示词大小限制**  
   Nacos 单配置内容不宜过大（通常建议 < 1M），对于超长 System Prompt 要考虑压缩或拆分配置。

---

### 总结

- **原子引用**保证了**单实例内**并发读写安全，是正确且必要的。
- **多实例数据不统一**是分布式配置中心的固有特性，通常**业务可接受**，不影响生产使用。
- **生产可用**，但需要补上降级兜底、空值防护、回调异常处理等常规的防御性编码。

如果你的服务实例数量不多（几个到几十个），且提示词变更不是频繁且强一致性要求极高的场景（比如不是每秒更新一次），这个方案完全够用且可靠。



# 函数式接口的解析


我来详细解释这些Java泛型和函数式接口的含义：

## 1. @NotNull Runnable 的含义

- **@NotNull**: 注解，表示该参数不能为null，用于编译时和运行时检查
- **Runnable**: Java内置函数式接口，无参数、无返回值（void）
  ```java
  @FunctionalInterface
  public interface Runnable {
      void run();
  }
  ```

## @NotNull 和 参数数量无关

`@NotNull` 注解与函数式接口的参数数量没有关系：

- **@NotNull**: 仅表示这个参数对象本身不能为null
- **函数式接口的参数**: 由具体的接口定义决定

## 具体分析

```java
@NotNull Runnable onFirst
```
- `@NotNull` 表示：`onFirst` 这个变量不能为null
- `Runnable` 表示：这个函数式接口的 `run()` 方法不需要参数且无返回值

```java
@NotNull Consumer<String> consumer
```
- `@NotNull` 表示：`consumer` 这个变量不能为null  
- `Consumer<String>` 表示：需要一个String参数，无返回值

```java
@NotNull Function<String, Integer> function
```
- `@NotNull` 表示：`function` 这个变量不能为null
- `Function<String, Integer>` 表示：需要一个String参数，返回Integer值

## 核心区别

- **@NotNull** 约束的是：参数对象本身的存在性（非null）
- **函数式接口** 定义的是：调用时的参数和返回值类型

这两个是完全正交的概念，不存在矛盾。就像一个人的名字不能是null（@NotNull），但这不影响这个人说话的内容（函数式接口的参数和返回值）。
        

## 2. Class<? extends Throwable> exceptionType, Consumer<? super Throwable> onError

- **Class<? extends Throwable>**: 泛型类型，表示Throwable类及其子类的Class对象
  - `? extends Throwable` 表示上界通配符，可以是Exception、RuntimeException等异常类
- **Consumer<? super Throwable>**: 消费者函数式接口
  - `? super Throwable` 表示下界通配符，接收Throwable或其父类实例
  - 接收异常对象并进行处理，无返回值

## 3. Predicate<? super Throwable> predicate, Consumer<? super Throwable> onError

- **Predicate<? super Throwable>**: 断言函数式接口
  - `? super Throwable` 表示接收Throwable或其父类实例
  - 接收异常对象，返回boolean值（true/false）用于判断条件
- **Consumer<? super Throwable> onError**: 同上，用于处理匹配条件的异常

## 4. Predicate<? super ChatResponse> continuePredicate

- **Predicate**: 函数式接口，接收一个参数，返回boolean值
- **<? super ChatResponse>**: 下界通配符
  - 接收ChatResponse或其父类型实例
  - 对于每个ChatResponse对象返回true/false，决定是否继续处理

## 关键概念说明

**上界通配符（extends）**: `? extends Type` - 可以是Type或Type的子类
**下界通配符（super）**: `? super Type` - 可以是Type或Type的父类
**PECS原则**: Producer Extends, Consumer Super - 生产者使用extends，消费者使用super

这种设计提供了良好的类型安全性和灵活性，确保了泛型类型在继承关系中的正确使用。
        

## 函数式接口的返回值特性

判断是否有返回值确实取决于函数式接口的定义。Java中常见的函数式接口有不同的返回值特性：

- **Runnable**: 无返回值（void），只执行操作

- Consumer

  : 无返回值（void），消费参数

- **Function<T,R>**: 有返回值R，转换T到R，

  - `T`：输入参数的类型
  - `R`：返回结果的类型

- Predicate

  : 有返回值boolean，判断条件



# ChatMemory与ChatMemoryRepository

二者职责不同，首先注意理解**记忆与历史**

- **聊天记忆**：大语言模型在对话过程中保留并用于维持上下文感知的信息。
- **聊天历史**：完整的对话记录，包含用户与模型之间交换的所有消息。

## `Chatmemory`是对会话记忆类型的设定

接口中包含了各种类型的`ChatMemory`，用来满足不同类型的大模型对上下文话记忆的需求

例如可以设置上下文保留消息条数，维护固定容量的消息窗口（默认 20 条）。当消息超限时，自动移除较早的对话消息（始终保留系统消息）

## `ChatMemoryRepository`是对会话记忆的存储的实现

不同类型的`Repository`对应往不同类型的数据库中存储记忆数据，

主要负责对会话记忆的增删改查。



# 模型调用工具（Tool）后，运行结果直接交给了大数据，如果需要返回结果如何处理？

在方法执行的结尾，把方法返回的结果存入一个**容器**中，大模型在回答结束之后，如果需要方法返回的结果，就去容器中去找，把结果拼接到Flux流式输出中。

这里需要注意的是，容器要是线程安全的，避免因为高并发场景下的数据混乱或者异常。



## 线程安全的 Map 结构（ConcurrentHashMap）

在高并发环境下，多个请求可能同时访问工具结果容器：

```java
// 非线程安全的 HashMap 会出现问题
Map<String, Object> unsafeMap = new HashMap<>();
// 多线程同时 put/get 可能导致数据不一致或异常

// 线程安全的 ConcurrentHashMap
ConcurrentHashMap<String, Object> safeMap = new ConcurrentHashMap<>();
// 支持高并发的读写操作，内部采用分段锁机制

```


## 分段锁机制详解

`ConcurrentHashMap` 的分段锁机制是一种优化的并发控制策略：

### 传统锁机制的问题
```java
// HashMap 在多线程环境下不安全
HashMap<String, Object> map = new HashMap<>();
// 多线程同时操作可能导致数据损坏

// 使用 synchronized 保护（性能较差）
synchronized(map) {
    map.put(key, value);  // 整个 map 被锁定
}
```

### ConcurrentHashMap 的分段锁实现

**JDK 1.7 版本**：
- 将整个哈希表分成多个段（Segment）
- 每个段独立加锁
- 不同段之间可以并行操作

```java
// 伪代码示意
class ConcurrentHashMap<K,V> {
    Segment[] segments;  // 多个段数组
    
    static class Segment extends ReentrantLock {
        HashEntry[] table;  // 每段包含自己的哈希表
    }
    
    // 操作时只锁定目标段
    public V put(K key, V value) {
        int segmentIndex = hash(key) >>> segmentShift;
        Segment segment = segments[segmentIndex];
        segment.lock();  // 只锁定当前段
        try {
            // 执行 put 操作
        } finally {
            segment.unlock();
        }
    }
}
```

**JDK 1.8 版本改进**：
- 放弃分段锁，改用 CAS + synchronized
- 使用 Node 数组 + 链表 + 红黑树
- 细粒度锁定，只锁定链表头节点

### 高并发读写优势

- **写操作**：不同桶（bucket）的写操作可以并行
- **读操作**：大多数情况下无需加锁，支持完全并行
- **混合操作**：读写可以同时进行，互不影响

这样设计使得 `ConcurrentHashMap` 能够在保持线程安全的同时，提供比传统同步集合更高的并发性能。
        



## 设置合理的过期时间避免内存泄漏

工具执行结果只需要在对应请求的生命周期内保留：

```java
// 使用带有过期时间的缓存实现
LoadingCache<String, Object> cache = Caffeine.newBuilder()
    .expireAfterWrite(5, TimeUnit.MINUTES)  // 5分钟后自动清除
    .maximumSize(10000)                     // 最大容量限制
    .build(key -> null);

// 或使用定时清理机制
ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
scheduler.scheduleAtFixedRate(() -> {
    // 清理过期的请求ID
    cleanupExpiredEntries();
}, 1, 1, TimeUnit.MINUTES);

```



## 异步执行场景下的线程安全问题

工具执行通常是异步的，需要考虑以下场景：

```java
public class ToolResultManager {
    private final ConcurrentHashMap<String, CompletableFuture<Object>> pendingResults = 
        new ConcurrentHashMap<>();
    
    // 异步工具执行开始时
    public void recordToolStart(String requestId) {
        pendingResults.put(requestId, new CompletableFuture<>());
    }
    
    // 工具执行完成时
    public void recordToolResult(String requestId, Object result) {
        CompletableFuture<Object> future = pendingResults.get(requestId);
        if (future != null) {
            future.complete(result);  // 完成异步任务
        }
    }
    
    // 流式输出时等待工具结果
    public Object waitForToolResult(String requestId) throws ExecutionException, InterruptedException {
        CompletableFuture<Object> future = pendingResults.get(requestId);
        if (future != null) {
            return future.get(10, TimeUnit.SECONDS);  // 设置超时时间
        }
        return null;
    }
}
```




在 Reactor（Flux/Mono）编程模型中，"订阅"（Subscribe）是指启动数据流处理的过程：

## 订阅的概念

**发布-订阅模式**：
- **发布者（Publisher）**：Flux/Mono 是数据流的发布者
- **订阅者（Subscriber）**：消费数据流的组件
- **订阅**：建立发布者和订阅者之间的连接

## 延迟执行特性

```java
// 1. 创建 Flux（此时不执行任何操作）
Flux<String> flux = Flux.just("A", "B", "C")
    .map(s -> s.toLowerCase())
    .filter(s -> s.length() > 0);

// 2. 订阅时才开始执行（触发数据流）
flux.subscribe(
    data -> System.out.println("接收到: " + data),
    error -> System.out.println("发生错误: " + error),
    () -> System.out.println("流已完成")
);
```

## Flux.just vs Flux.defer 的订阅区别

### Flux.just 示例
```java
Flux<String> immediate = Flux.just("当前时间: " + System.currentTimeMillis());

// 订阅1
immediate.subscribe(System.out::println); // 输出: 当前时间: 1234567890

// 订阅2（一毫秒后）
Thread.sleep(1);
immediate.subscribe(System.out::println); // 输出: 当前时间: 1234567890 (相同值)
```

### Flux.defer 示例
```java
Flux<String> deferred = Flux.defer(() -> 
    Flux.just("当前时间: " + System.currentTimeMillis()));

// 订阅1
deferred.subscribe(System.out::println); // 输出: 当前时间: 1234567890

// 订阅2（一毫秒后）
Thread.sleep(1);
deferred.subscribe(System.out::println); // 输出: 当前时间: 1234567891 (不同值)
```

## 在你代码中的含义

```java
Flux.defer(() -> {
    // 这里的代码只有在订阅时才会执行
    Map<String,Object> toolResult = ToolResultHolder.get(requestId);
    // ...
})
```

- **未订阅时**：工具结果检查不会执行
- **订阅时**：才会去检查工具执行结果并生成相应事件
- **时机控制**：确保在正确的时间点检查工具结果 

这就是 Reactive Programming 的核心理念：**数据流在被订阅时才开始流动**。
        

# 设置会话标题，问题重写增加耗时的解决方案





# 多智能路由协同相关问题

## 我在改造升级java项目时，打算采用多智能体路由协同的方法进行构建由路由智能体决定应该使用哪个智能体处理用户提问，我打算把一些共性的功能抽取出来，这里查找资料发现他们有的是采用先抽取为一个接口，然后再使用抽象类，后续使用实例时再进行具体的实现。
请回答：
1、为什么要这样，直接实现接口不行吗，毕竟接口中已经抽取了共性方法，抽象类是不是多余了？
2、还是说接口是对所有可能用到的总的方法进行抽取，抽象类则是更加精准的抽取，因为有的可能并不需要？
3、另外我需要你再解释一下这里使用接口与抽象类的区别，以及为什么
4、注意回答准确，不准捏造内容，回答之前进行检验答案，确认正确再输出

针对你关于“接口+抽象类”组合模式与直接实现接口的疑问，答案是：在抽取共性的多实现场景下，这个组合是经典且有效的 Java 设计实践。接口负责定义“做什么”的规范，而抽象类则负责“怎么做”的代码复用。

下面我将为你逐一拆解这其中的逻辑。

### 📜 职责分离：接口与抽象类的核心差异

要理解为什么要组合使用，首先要清楚接口和抽象类在面向对象设计中扮演着完全不同的角色：

*   **接口 (Interface)**：它代表的是一种**规范/契约 (Can-Do)**。接口只**声明方法（做什么），而不提供具体实现**（至少不提供核心业务逻辑的实现）。它定义了实现者必须遵循的规则，**实现了“规范”与“实现”的解耦**。
*   **抽象类 (Abstract Class)**：它代表的是一种**模板/复用 (Is-A)**。抽象类主要用于代码复用，它可以将子类共有的、相同的**代码逻辑提取出来，形成可被继承的具体方法**。这是典型的**模板方法模式 (Template Method Pattern)** 的体现。

简单来说，**接口定义“我能做什么”，而抽象类提供“我已经为你做好了什么”**。

### 🤔 回答你的疑问：接口+抽象类的组合为何必要？

现在，我们来回答你的具体疑问：

*   **1、直接实现接口不行吗？为什么需要抽象类？**
    *   **可以，但会产生重复代码**。如果一个接口有多个实现类，且这些实现类中存在完全相同的逻辑，那么每个实现类都需要重复编写这段代码。
    *   **抽象类的价值在于消除重复**。通过引入一个实现了接口的抽象类，我们可以将那些共有的、完全相同的代码**一次性**写入该抽象类中，所有子类通过继承就能自动获得这些实现，无需重复编码。因此，抽象类并非多余，而是遵循了“不要重复自己”（DRY， Don‘t Repeat Yourself）原则，是代码复用的关键。

*   **2、是否接口抽取所有方法，抽象类进行更精准的抽取？**
    *   你的这个理解非常接近，但更准确的描述是：**接口是“全集”的规范定义，抽象类则是“公共子集”的实现载体。**
    *   **接口**：作为对外的契约，它通常会定义所有实现类**可能**用到的全部方法。但这不代表每个实现类都需要所有方法。如果接口过于臃肿，未来可能需要根据 **“接口隔离原则” (ISP)** 将其拆分为更小、更专注的接口。
    *   **抽象类**：它并不抽取接口的“全部”方法，而是精准地抽取那些在**所有子类中实现逻辑完全一致**的方法，并将它们实现为具体方法。对于那些**行为各异**的方法，抽象类则会保留其“抽象”状态，强制要求子类去提供各自独特的实现。
    *   **举个例子**：一个 `Loggable` 接口可能定义了 `log()`、 `getLoggerName()`、 `formatMessage()` 等方法。一个 `AbstractLogger` 抽象类可能只实现 `getLoggerName()` 的通用逻辑，而将 `formatMessage()` 和 `log()` 留为抽象方法，让子类（如 `FileLogger`、 `ConsoleLogger`）去实现具体的写入和格式化逻辑。

### 🎯 落地实践：在你的多智能体路由场景中应用

将这个模式应用到你的Java多智能体路由项目中，思路会非常清晰：

1.  **定义接口 (`Agent`)**：
    这是一个顶层的契约，定义了所有智能体必须遵守的规范。
    
    ```java
    public interface Agent {
        // 所有智能体处理用户提问的入口
        String handle(String userQuery);
        
        // 所有智能体都必须能介绍自己的能力
        String getCapability();
    }
    ```
    
2.  **定义抽象基类 (`BaseAgent`)**：
    这是代码复用的核心，它实现 `Agent` 接口，并将所有智能体共有的逻辑（如任务路由、日志记录等）集中于此。
    ```java
    // 抽象类实现接口，作为子类的模板
    public abstract class BaseAgent implements Agent {
        private String agentName;
        
        public BaseAgent(String name) {
            this.agentName = name;
        }
        
        // 1. 共有的具体实现：日志记录
        protected void log(String message) {
            System.out.println("[" + agentName + "] " + message);
        }
        
        // 2. 实现接口中的getCapability()，复用逻辑
        @Override
        public String getCapability() {
            return "I am " + agentName;
        }
        
        // 3. 核心路由：决定哪个子类来处理，这是模板方法的核心
        public String routeAndHandle(String userQuery) {
            if (canHandle(userQuery)) {
                log("Handling query: " + userQuery);
                // 调用子类具体的处理逻辑
                return handle(userQuery);
            }
            return null; // 或抛出异常，表明此智能体无法处理
        }
        
        // 4. 抽象方法：判断是否能处理，强制子类实现
        protected abstract boolean canHandle(String query);
    }
    ```

3.  **创建具体智能体 (`WeatherAgent`)**：
    具体的智能体只需继承 `BaseAgent` 并实现其抽象方法，专注于自身的特有逻辑。
    
    ```java
    public class WeatherAgent extends BaseAgent {
        public WeatherAgent() {
            super("WeatherAgent");
        }
        
        @Override
        protected boolean canHandle(String query) {
            // 自己的判断逻辑：询问是否包含“天气”
            return query.contains("天气");
        }
        
        @Override
        public String handle(String userQuery) {
            // 自己的处理逻辑：调用天气API或查询数据
            return "为您查询到今日天气...";
        }
    }
    ```
    
4.  **构建路由智能体 (`RouterAgent`)**：
    路由智能体本身也是一个 `Agent`，它的核心职责是管理一组具体智能体，并根据它们各自的判断逻辑（`canHandle`）将任务分发给正确的智能体处理。
    
    ```java
    import java.util.List;
    
    public class RouterAgent implements Agent {
        private List<Agent> agents;
        
        public RouterAgent(List<Agent> agents) {
            this.agents = agents;
        }
        
        @Override
        public String handle(String userQuery) {
            for (Agent agent : agents) {
                // 此处的类型判断和调用方式可根据你的具体设计调整
                if (agent instanceof BaseAgent) {
                    String result = ((BaseAgent) agent).routeAndHandle(userQuery);
                    if (result != null) {
                        return result;
                    }
                }
            }
            return "抱歉，我无法处理您的问题。";
        }
        
        @Override
        public String getCapability() {
            return "路由智能体，负责分发任务";
        }
    }
    ```
    
    这种设计遵循了**依赖倒置原则 (DIP)**， `RouterAgent` 的 `handle` 方法依赖于 `Agent` 抽象，而不是具体的 `WeatherAgent`，使得系统更容易扩展。同时，它也体现了**开闭原则 (OCP)**，未来要增加新的智能体，只需新建一个继承 `BaseAgent` 的类，无需修改 `RouterAgent` 的代码。

### 💎 总结：如何做出选择？

为了更直观地理解两者的区别和如何选择，可以参考下表：

| 对比维度      | 接口 (Interface)                                             | 抽象类 (Abstract Class)                                      |
| :------------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **设计初衷**  | 定义“能做”的**规范/契约** (Can-Do)                           | 为子类提供“是什么”的**模板**，侧重于代码复用 (Is-A)          |
| **方法实现**  | Java 8+ 允许 `default` 方法提供基础实现，但主要用于接口演进，不能替代抽象类的复用职责 | 可包含已实现的具体方法（复用代码）和未实现的抽象方法（定义模板） |
| **成员变量**  | 只能定义 `public static final` 常量                          | 可以定义实例变量，拥有自己的状态                             |
| **构造器**    | 不允许有构造器                                               | 可以有构造器，常用于子类共享的初始化逻辑                     |
| **继承/实现** | 一个类可以实现**多个**接口                                   | 一个类只能继承**一个**抽象类（Java单继承限制）               |
| **核心思想**  | **面向接口编程**，降低系统耦合度                             | **模板方法模式**，提高代码内聚性，消除重复                   |

**在你改造项目时，可以遵循这个简单清晰的决策路径：**

1.  **起点：首先定义接口 (`interface`)**。这是模块间解耦的关键，让你的路由智能体依赖于抽象的规范，而不是具体的某个智能体实现。
2.  **观察：实现接口时，是否发现不同子类中有完全相同的代码逻辑？**
    *   **没有**：如果每个实现类的方法都完全不同，那直接实现接口就够了，无需引入抽象类。
    *   **有**：**立刻创建一个实现该接口的抽象类 (`abstract class`)**，将这些共有的、重复的代码上移到抽象类中。
3.  **扩展：未来有了新的共性逻辑**，直接将其加入到抽象基类中，所有子类便能自动获得此能力，极大地提升了项目的可维护性和扩展性。

这个组合模式正是将接口的灵活性（多实现）与抽象类的复用性（单继承）紧密结合，在保持系统高可扩展性的同时，有效消除了代码冗余。



# **抽象类不必实现接口中的所有方法。**

这正是抽象类在“接口与具体类之间”起到的关键缓冲作用。Java 允许抽象类只实现接口的一部分方法，剩下的方法会**自动变成抽象类的抽象方法**，留给下一级非抽象子类去实现。

---

### 用你的例子来说明

假设 `Agent` 接口有两个方法：

```java
public interface Agent {
    String getCapability();    // 方法1
    String handle(String query); // 方法2
}
```

你的 `BaseAgent` 抽象类只实现了 `getCapability()`，但**完全不管** `handle()` 方法：

```java
public abstract class BaseAgent implements Agent {
    // 实现了 getCapability
    @Override
    public String getCapability() {
        return "I am " + agentName;
    }
    
    // 没有实现 handle() —— 编译器不会报错！
}
```

此时 `BaseAgent` 因为包含未实现的接口方法 `handle()`，它必须被声明为 `abstract class`。而这个 `handle()` 方法实际上就变成了 `BaseAgent` 的一个**隐式抽象方法**，等价于你在类里写了：

```java
public abstract String handle(String query);
```

最终，具体的 `WeatherAgent` 等子类必须同时实现 `handle()` 以及 `BaseAgent` 自己定义的抽象方法（如 `canHandle`），否则无法实例化。

---

### 为什么这样设计？

这就是抽象类作为**模板**最强大的地方：

- **它可以只做“公共部分”**：比如日志、权限校验、缓存等通用逻辑。
- **它把不确定的、需要子类定制的部分留空**：不强迫模板去实现它根本不知道怎么实现的方法。
- **最终保证完整性**：当非抽象子类（可以 new 的类）登场时，才要求“补全所有欠下的债”（所有抽象方法，无论来自接口还是抽象父类）。

---

### 一点补充：关于 `default` 方法

如果接口中有 `default` 方法，抽象类更可以**完全不用重写**，直接继承接口的默认实现。只有在想修改默认行为时才需要覆盖。

例如：
```java
interface Agent {
    default String getVersion() { return "1.0"; }
    String handle(String query); // 抽象方法
}

abstract class BaseAgent implements Agent {
    // 可以不重写 getVersion，子类会直接继承默认的 "1.0"
    // 也不用实现 handle，留空给子类
}
```

---

**总结**：抽象类实现接口时，想实现多少就实现多少，没实现的自然成为抽象方法，这是标准且推荐的用法，也是模板方法模式、适配器模式等大量设计模式的基础。



# 那如果是到最后都要重写接口中的所有抽象方法，那我也可以直接定义接口，然后用子类直接实现，为什么还要用抽象类做个中间层？

这个疑问直击了抽象类最核心的存在价值。**如果子类之间的实现毫无共同点，那确实可以直接实现接口，完全不需要抽象类。** 抽象类的意义，恰恰在于子类们**有大量共同的代码或固定的调用流程**时，避免让每个子类都把这些逻辑复制粘贴一遍。

抽象类作为中间层，主要解决以下三个问题：

---

### 1. 消除重复代码——它是一块“代码跳板”
所有子类都需要的逻辑，写在抽象类里一次，子类直接继承使用，这是最直接的好处。

**不用抽象类（直接实现接口）**
```java
// 天气助手要自己写日志
public class WeatherAgent implements Agent {
    // 每个子类都要写这一段（重复代码）
    private void log(String msg) {
        System.out.println("[" + getClass().getSimpleName() + "] " + msg);
    }
    
    // 还要自己实现 getCapability，逻辑完全一样
    public String getCapability() {
        return "I am " + getClass().getSimpleName();
    }
}

// 订餐助手也要把同样的代码再写一遍（重复代码）
public class OrderAgent implements Agent {
    // 又是相同的 log
    // 又是相同的 getCapability
}
```
**使用抽象类**
```java
// 日志、getCapability 都只写一次，子类不用重复
public abstract class BaseAgent implements Agent {
    private String name;
    public BaseAgent(String name) { this.name = name; }
    
    public String getCapability() { return "I am " + name; }
    protected void log(String msg) { System.out.println("[" + name + "] " + msg); }
}
```

---

### 2. 强制约束调用流程——模板方法模式
这才是抽象类**不可替代**的价值。它能用 `final` 方法固定一个核心流程，只把变化的部分（`canHandle`、`handle`）留作抽象方法，由子类填空。

```java
public abstract class BaseAgent implements Agent {
    // 1. 流程固定、不能改 —— final 方法
    public final String routeAndHandle(String userQuery) {
        if (canHandle(userQuery)) {             // 2. 步骤A：让子类填空
            log("Handling query: " + userQuery);
            return handle(userQuery);           // 3. 步骤B：让子类填空
        }
        return "无法处理该请求";
    }
    
    // 4. 填空处（抽象方法）
    protected abstract boolean canHandle(String query);
    protected abstract String handle(String query);
}
```

**对比**：如果只是定义接口，每个子类都得自己重复写整个 `routeAndHandle` 的判断流程，不仅工作量大，而且**很容易有人写错流程顺序**。抽象类保证了所有子类都遵守同一个模板。

---

### 3. 预留扩展点，不破坏老代码
当系统上线后，你需要给所有 `Agent` 增加一个新功能（比如访问控制或性能统计），如果只有接口，你改接口定义，所有实现类全部报错要改。

用抽象类则优雅得多：
```java
public abstract class BaseAgent implements Agent {
    // 新增一个通用方法，直接带默认实现
    public void preHandle(String query) {
        // 默认什么都不做，子类想用就覆盖，不用就不管
        log("请求到达: " + query);
    }
    
    // 在模板方法中加上这个扩展点
    public final String routeAndHandle(String userQuery) {
        preHandle(userQuery);  // 新加的步骤，老代码全自动支持
        // ... 其余流程不变
    }
}
```
所有已有的子类**一行代码都不用改**，新功能就集成进来了。接口的 `default` 方法虽然也能做到部分效果，但无法持有状态或调用模板方法中的流程。

---

## 总结

|              | 接口           | 抽象类中间层               |
| :----------- | :------------- | :------------------------- |
| **核心作用** | 规定“能做什么” | **解决“怎么做”的公共部分** |
| **代码复用** | 无法复用       | **大量复用**               |
| **流程约束** | 不能约束       | **模板方法强制约束**       |

你完全可以只定义接口，然后找几十个类去实现，但随之而来的是**疯狂的复制粘贴和极高的维护成本**。抽象类作为中间层，正是面向对象中 **“单一职责”** 和 **“开闭原则”** 的完美体现：每个层次只做自己该做的事，需要扩展时毫不费力。

**还记得你之前的微服务架构吗？** Spring 的 `AbstractApplicationContext` 就是典型的抽象类中间层，它实现了 `ApplicationContext` 接口，完成大量通用的上下文刷新、事件发布等工作，具体的 `ClassPathXmlApplicationContext` 或 `SpringBoot` 容器只需要填空式地实现少量抽象方法。如果没有这个中间层，每个容器都要从头实现数百行代码。

**所以**：接口是“合同”，子类是“最终执行者”，而抽象类就是那个让你免于写重复条款的**合同模板**。



所有已有的子类一行代码都不用改，新功能就集成进来了。接口的 default 方法虽然也能做到部分效果，但无法持有状态或调用模板方法中的流程。

# 这句无法持有状态和调用摸版方法流程是什么意思？

这句总结点出了抽象类比接口 `default` 方法更强的两个能力：**持有状态**和**定义不可更改的固定流程**。下面拆开解释。

---

## 1. “无法持有状态”

**状态**指的是对象自身的属性（成员变量）。接口中**不能定义实例变量**（除了 `public static final` 常量），所以 `default` 方法无法依赖对象的“状态”来工作。

**例子**：假设你要给所有智能体增加一个“请求计数”功能，每次处理请求时统计次数。  
如果用抽象类，可以直接定义一个 `requestCount` 成员变量：

```java
public abstract class BaseAgent {
    private int requestCount = 0;  // 状态

    protected void incrementCount() {
        requestCount++;
    }

    protected int getRequestCount() {
        return requestCount;
    }
}
```

如果用接口的 `default` 方法，你**不能**在接口里写 `private int count;`，因为接口不允许非静态成员。你只能靠外部手段（比如传入参数或使用 `ThreadLocal`）来模拟状态，但那就不是对象自身的状态了。

---

## 2. “无法调用模板方法流程”

这里的关键是：接口中的**所有方法默认是 `public` 且不能声明为 `final`**。这意味着你无法在接口中定义一个“不可被覆盖”的骨架方法，而 `default` 方法随时可以被实现类覆盖掉，从而破坏流程。

**模板方法模式的核心**是：  
- 一个 `final` 的主方法，按固定顺序调用多个抽象步骤（或具体步骤）。  
- 子类只能“填空”（覆盖抽象步骤），但**不能修改**主流程的顺序。

**接口做不到这一点**，因为：
- 接口中的方法不能是 `final` 的，子类可以随意重写你的“骨架方法”。
- `default` 方法虽然可以有实现，但无法保证不被覆盖。

**例子对比**：

```java
// 抽象类：流程锁死，子类无法篡改
public abstract class BaseAgent {
    public final void execute(String query) {  // final 保证流程不可变
        before(query);      // 扩展点
        String result = handle(query); // 抽象步骤，子类填空
        after(result);      // 扩展点
    }

    protected void before(String query) { }
    protected abstract String handle(String query);
    protected void after(String result) { }
}
```

如果用接口：
```java
public interface Agent {
    default void execute(String query) {  // 子类可以覆盖这个方法，改变流程
        before(query);
        String result = handle(query);
        after(result);
    }

    default void before(String query) { }
    String handle(String query);
    default void after(String result) { }
}
```
任何实现类都可以**直接重写 `execute` 方法**，跳过 `before`、打乱顺序，模板就失效了。

---

## 总结

| 抽象类                                            | 接口 `default` 方法                |
| :------------------------------------------------ | :--------------------------------- |
| 可以定义**实例变量**，方法能直接使用对象状态      | 不能定义实例变量，无法持有对象状态 |
| 可以用 `final` 方法定义**不可修改的流程**（模板） | 方法可被重写，无法强制流程         |

这就是为什么当你的设计需要**共用状态**或**严格流程控制**时，抽象类是不可替代的。接口的 `default` 更适用于提供可选的功能扩展，而不是作为模板基座。



# 关于多智能体协同的架构实现

## 首先对于智能体的共性代码进行抽取

把共性的代码抽取出来，例如基础的创建会话，流式调用返回信息，创建智能体客户端，后续实现其他类型智能体时，**不需要进行重复代码编写**，直接实现接口或者抽象类即可。

```java
/**
 * AI代理接口，定义处理聊天事件和会话的核心能力
 */
public interface Agent {

    /**
     * 表示空参数的预定义数组
     */
    Object[] EMPTY_OBJECTS = new Object[0];

    /**
     * 处理流式请求（如流式回答）
     *
     * @param question  用户输入的问题
     * @param sessionId 会话唯一标识
     * @return 包含中间结果的反应式事件流（Flux）
     */
    Flux<ChatEventVO> processStream(String question, String sessionId);

    /**
     * 处理标准请求（非流式）
     *
     * @param question  用户输入的问题
     * @param sessionId 会话唯一标识
     * @return 最终处理结果字符串
     */
    String process(String question, String sessionId);

    /**
     * 获取智能体类型标识
     *
     * @return 代理类型枚举值（如：ROUTE、RECOMMEND等）
     */
    AgentTypeEnum getAgentType();

    /**
     * 停止指定会话的处理
     *
     * @param sessionId 需要终止的会话ID
     */
    void stop(String sessionId);

    /**
     * 获取系统提示信息模板，默认为空字符串，子类可以覆盖重写该方法以返回自定义的系统提示信息。
     *
     * @return 系统提示的文本模板
     */
    default String systemMessage() {
        return "";
    }


    /**
     * 获取工具列表，默认返回空数组。子类需根据需求覆盖此方法。
     */
    default Object[] tools() {
        return EMPTY_OBJECTS;
    }

    /**
     * 创建并返回一个工具上下文的空Map对象。
     *
     * @param sessionId 会话标识符
     * @param requestId 请求标识符
     * @return 默认返回一个空的Map对象，子类可以覆盖重写该方法以返回自定义的工具上下文。
     */
    default Map<String, Object> toolContext(String sessionId, String requestId) {
        return Map.of();
    }

    /**
     * Advisor列表，默认返回空对象
     */
    default List<Advisor> advisors() {
        return List.of();
    }

    /**
     * 创建并返回一个Advisor的空Map对象。
     *
     * @param sessionId 会话标识符
     * @param requestId 请求标识符
     * @return 默认返回一个空的Map对象，子类可以覆盖重写该方法以返回自定义的工具上下文。
     */
    default Map<String, Object> advisorParams(String sessionId, String requestId) {
        return Map.of();
    }

    /**
     * 获取系统提示信息模板的参数，默认为空Map，子类可以覆盖重写该方法以返回自定义的系统提示信息参数。
     */
    default Map<String, Object> systemMessageParams() {
        return Map.of();
    }

}
```



## 对于多智能体协同的解耦（调用方式的不同实现）

### 第一种：在主智能体中通过Bean的方式注入其他智能体的客户端，实现不同客户端的调用

这里代码都在抽象类中定义好了，具体实现如下：

```java
@Slf4j
public abstract class AbstractAgent implements Agent{

    @Resource
    private ChatClient chatClient;

    @Resource
    private ChatMemory chatMemory;


    // 用来存储会话信息id与对应的生成标志，若为false或者不存在则采用默认值停止生成内容，
    // 因为可能同时有多个回话同时进行，所以不同回话对应不同的生成标志
    // 案例采用移除的方式，若是依据id值查询不到则采用默认值false默认停止生成
    // 点击停止生成便移除map值，减少内存开销
    private static final Map<String, Boolean> GENERATE_STATUS = new ConcurrentHashMap<>();

    private static final ChatEventVO STOP_EVENT = ChatEventVO.builder().eventType(ChatEventTypeEnum.STOP.getValue()).build();



    /**
     * 流式输出的客户端，对响应结果进行流式输出
     * @param question  用户输入的问题
     * @param sessionId 会话唯一标识
     * @return
     */
    @Override
    public Flux<ChatEventVO> processStream(String question, String sessionId) {

        // 大模型输出内容的缓存器，用于在输出中断后的数据存储
        StringBuilder outputBuilder = new StringBuilder();

        // 获取会话id
        var conversationId = ChatService.createConversationId(sessionId);

        String requestId = this.getRequestId();

        getClient(question,sessionId,requestId)
                .stream()
                .chatResponse()
                .doFirst(()->{ GENERATE_STATUS.put(sessionId,true);})  // 第一次输出内容时先存入生成标志
                .doOnError(onError ->{GENERATE_STATUS.remove(sessionId);}) // 发生错误时停止生成
                .doOnComplete(()->{GENERATE_STATUS.remove(sessionId);})  // 生成完成后移除会话生成标志
                .doOnCancel(
                        ()->{
                            // 当输出被取消时，保存输出的内容到历史记录中
                            this.saveStopHistoryRecord(conversationId, outputBuilder.toString());
                        }
                )
                .takeWhile(generate->{ // 通过返回值来控制Flux流是否继续，true：继续，false：终止
                    return  GENERATE_STATUS.getOrDefault(sessionId,false);
                })
                .map(chatResponse -> {
                    // 获取大模型的输出的内容
                    String text = chatResponse.getResult().getOutput().getText();
                    // 追加到输出内容中
                    outputBuilder.append(text);
                    // 封装响应对象
                    return ChatEventVO.builder()
                            .eventData(text)
                            .eventType(ChatEventTypeEnum.DATA.getValue())
                            .build();
                })
                .concatWith(
                        Flux.defer(()->{
                            // 判断用没用工具，通过判断容器中有没有工具返回结果
                            Map<String,Object> toolResult = ToolResultHolder.get(requestId);
                            if(ObjectUtil.isEmpty(toolResult)){
                                //为空说明没有调用工具，没有工具产生结果
                                return Flux.just(STOP_EVENT);
                            }
                            // 有结果进行提取按指定格式返回，并删除值，防止内存溢出
                            ToolResultHolder.remove(requestId);
                            return Flux.just(ChatEventVO.builder()
                                            .eventData(toolResult)  // 传入工具结果
                                            .eventType(ChatEventTypeEnum.PARAM.getValue()) // 指定消息类型为参数类型
                                            .build(),
                                    STOP_EVENT);
                        })
                );
        return null;
    }

    /**
     * 非流式输出客户端采用该方法
     * @param question  用户输入的问题
     * @param sessionId 会话唯一标识
     * @return
     */
    @Override
    public String process(String question, String sessionId) {

        String response = getClient(question, sessionId, this.getRequestId())
                .call()
                .content();
        return response;
    }



    @Override
    public void stop(String sessionId) {

    }

    @Override
    public Map<String, Object> advisorParams(String sessionId, String requestId) {
        return Agent.super.advisorParams(sessionId, requestId);
    }

    private String getRequestId(){
        return IdUtil.fastSimpleUUID();
    }

    private ChatClient.ChatClientRequestSpec getClient(String question, String sessionId, String requestId) {
        return chatClient.prompt()
                .system(promptSystemSpec -> { // 传入系统提示词，以及提示词中占位符需要的参数
                    promptSystemSpec.text(this.systemMessage()).params(this.systemMessageParams());
                })
                .advisors(advisorSpec -> {
                    advisorSpec.advisors(this.advisors()).params(this.advisorParams(sessionId, requestId));
                })
                .tools(this.tools())
                .toolContext(toolContext(sessionId, requestId))
                .user(question);
    }

    /**
     * 保存停止输出的记录
     *
     * @param conversationId 会话id
     * @param content        大模型输出的内容
     */
    private void saveStopHistoryRecord(String conversationId, String content) {
        this.chatMemory.add(conversationId, new AssistantMessage(content));
    }
}




/**
 * 路由智能体实现如下：
 */
@Component
@RequiredArgsConstructor
public class RouteAgent extends AbstractAgent {

    private final SystemPromptConfig systemPromptConfig;

    @Override
    public String systemMessage() {
        return this.systemPromptConfig.getRouteAgentSystemMessage().get();
    }

    @Override
    public AgentTypeEnum getAgentType() {
        return AgentTypeEnum.ROUTE;
    }

}

```



### 第二种：使用工具类的方式把智能体注册为工具，实现解耦，后续添加新的功能，不需要修改主智能体代码，在工具中进行扩充即可

首先主智能体也就是路由智能体实现工具调用的时候是采用方法`.tools(Object[] tools)`，传入工具类的集合，内部由SpringAI内置的方法实现工具调用

我们可以定义一个AgentModelTool，在一开始的时候把工具传入方法tools中，这样后续就可以直接只在AgentModelTool中进行拓展不同类型的智能体，将来主智能体调用的时候，通过调用方法的形式调用不同类型智能体即可

**注意**：关于参数的传入以及返回结果的召回需要注意，之前调用工具时，是工具返回的参数没有拿到，没有保护存到历史记录中，后续采用的是在调用工具方法的末尾把结果保存起来。（CurrentHashMap是保存在单个实例中的，多实例的微服务集群下不同实例内数据不通，最好采用Redis等数据库存储结果）



#### CurrentHashMap详解

```java
    private static final Map<String, Map<String, Object>> HANDLER_MAP = new ConcurrentHashMap<>();

```

`ConcurrentHashMap` 在多线程环境下比普通的 `HashMap` 要**线程安全得多**。

简单解释一下区别：

- **普通 `HashMap`（非线程安全）**
  如果多个线程同时对它进行 `put`、`remove` 等操作，可能会造成数据不一致，甚至在高并发时触发死循环（JDK7）或破坏内部结构，需要额外加锁才能安全使用。
- **`Hashtable` 或 `Collections.synchronizedMap()`**
  它们通过在**整个表**上加锁来实现线程安全，同一时间只能有一个线程操作整个 Map，并发量高时性能很差。
- **`ConcurrentHashMap`（线程安全 + 高并发）**
  它采用**分段锁**（JDK7）或 **CAS + synchronized 锁单个节点**（JDK8）的技术，允许多个线程**同时**操作不同的桶（bucket），大幅提升了并发性能。读写操作基本可以并行执行，不会锁住整个表。

在你的代码里，`HANDLER_MAP` 被定义为 `static final`，很可能在全局被多个线程访问，用 `ConcurrentHashMap` 是一个正确的选择，不需要再额外加锁。

你提出的问题核心在于**“工具调用结果如何在多轮对话或跨实例场景中共享”**，以及**“本地缓存与分布式缓存的取舍”**。

首先，针对你补充的 Spring AI 工具调用特性，需要明确一个细节：  
Spring AI 在 **单次请求-响应** 中，工具调用结果是会保留并自动回传给模型的，模型可以看到上一个工具的输出并作为后续参数的依据。  
你可能遇到的是 **跨多次请求的上下文共享**（比如多智能体协同，步骤 A 的工具结果需要被步骤 B 使用），这确实需要你自己管理存储。

---

### 1. `ConcurrentHashMap` 的问题：多实例下数据不一致

- `ConcurrentHashMap` 是**进程内缓存**，数据仅存储在当前 JVM 实例的内存中。  
- 当部署多个服务实例时（例如负载均衡），不同实例的 `ConcurrentHashMap` **完全独立**。  
- 如果用户的第一次请求被路由到实例 A，工具调用结果存在 A 的内存中；第二次请求被路由到实例 B，B 的内存中没有这份数据，就会导致上下文丢失。

**结论：** 在微服务多实例环境下，不适合用本地 `ConcurrentHashMap` 存储需要跨请求共享的工具结果。

---

### 2. 使用 Redis 的优势

- **数据一致共享**：所有服务实例连接同一个 Redis，任何实例写入的数据都能被其他实例读取。  
- **跨请求/跨服务协同**：符合多智能体协同的需要，工具结果可以按会话 ID（如 `sessionId`）缓存，再被后续工具或智能体获取。  
- **与时效性结合**：可设置过期时间，自动清理临时数据，避免内存膨胀。

所以**推荐使用 Redis** 存储工具调用产生的中间结果，作为分布式缓存。

---

### 3. 具体实现建议

你可以根据会话标识（如 `sessionId`）组织键值结构：

```
key: session:{sessionId}:tool:{toolName}:result
value: 序列化后的工具返回值（如JSON字符串）
```

使用时：
- 工具调用完成后，将结果写入 Redis。
- 后续步骤需要该结果时，根据当前会话 ID 和工具名称读取。
- 利用 Redis 的 `EXPIRE` 设置合理生存时间，完成协同后或超时后自动清理。

如果某些数据只在单个实例的短期内存内高频使用，也可以采用**两级缓存**：先查本地 `ConcurrentHashMap`，未命中再查 Redis，但需注意缓存一致性。多数情况下直接用 Redis 就足够简单可靠。

---

**一句话总结：**  
在多服务实例的微服务集群中，不要用本地 `ConcurrentHashMap` 存储需要跨请求共享的工具结果，会导致不同实例数据不同。应使用 **Redis** 这类集中式存储，以会话 ID 为维度保存和读取中间结果。

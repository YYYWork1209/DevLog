# Spring&Mybatis

# Spring中的单例Bean是线程安全的吗

一般Spring中的Bean默认就是单例模式，可以通过注解@Scope（value= “ ”）来设置模式

```java
@Service
@Scope("singleton")
public class UserServicelmpl implements UserService {
    
}
```

- singleton：bean在每个Spring IOC容器中只有一个实例。
- prototype：一个bean的定义可以有多个实例



## 使用ThreadLocal解决Bean的线程安全问题

该方法是再每个线程需要自己单独的数据，不想与其他线程使用共享数据时使用，每个线程从Bean中取出自己需要的变量存储起来，作为自己需要使用的数据，后续就保存再自己线程中。

- **Bean 是单例的**，但 `ThreadLocal` 的作用不是把值存在 Bean 里。
- 每个 `Thread` 对象内部都有一个 `ThreadLocalMap`。当你调用 `counter.get()` 时，`ThreadLocal` 会以**当前线程**为 key，去这个线程专属的 Map 里取出属于这个线程的那个 Integer 对象。
- 因此，每个线程修改的都是**自己 Map 里的那个值**，不存在“写回 Bean”的动作。Bean 里根本就没有那个数值。

#### 针对你的累加例子：为什么结果还是1？

你设想的场景：

> 线程A获取初始值0准备加1，还没写回；线程B也获取了初始值0。最后两个线程都把自己的副本变成了1。那结果不还是1吗？应该是2才对啊。

这里面有一个**理解偏差**：你内心想要的是一个**所有线程共享的全局计数器**，所以期望最终结果是 2。但 `ThreadLocal` 的设计目标恰恰相反，它是**为了隔离，而不是为了共享**。

- **你想要的效果（全局累加器）**：所有线程操作同一个数，加两次从0变成2。这需要用 `AtomicInteger`、加锁等**共享并保护**的方式。
- **ThreadLocal 的效果（线程级局部变量）**：线程A自己的值从0变成1，线程B自己的值也从0变成1。它们各自独立，互不干扰。

`ThreadLocal` 典型应用场景是：**每个线程需要一份自己独立的数据副本，且不希望与其他线程共享**。例如：

- 存储当前登录用户信息（`UserContext`）
- 存储数据库连接（每个线程一个连接）
- 存储事务上下文

所以，你用 `ThreadLocal` 去做全局计数，注定得不到累加结果 2，因为它天生就不是干这个的。你的困惑正是把**隔离**误以为能实现**有保护的共享**，而这恰恰是两种相反的思路。



### 数据生命周期：确实会“消失”

你理解得很准：`ThreadLocal` 里的数据，本质就是**临时暂存**，它和数据库里的持久数据是两回事。

- **线程结束就没了**：数据存在线程的 `ThreadLocalMap` 里，线程一销毁，数据就会被 GC 回收。在线程池环境下，如果线程用完了没清理，数据倒是还在，但会被下个复用的任务“看到”，这就叫**脏数据**，会造成业务错乱。
- **服务重启就没了**：这数据在 JVM 内存里，重启自然全丢。

### “下次需要时”从哪里取？

这得看“下次”是**同一次请求内**，还是**跨请求**。

- **场景一：同一次请求里，避免层层传参**
  这是 `ThreadLocal` 最经典的用法。比如，控制器里把登录用户信息存进去，后面 Service、DAO 想用的时候，直接从 `ThreadLocal` 拿，不需要在每个方法参数里传。这种情况下，数据就是从当前线程的 `ThreadLocal` 里取的。
- **场景二：跨请求（比如下次登录）**
  这时候，**必须从数据库里取**。你可以想象一个 `UserContext` 类的完整流程：
  1. **新请求来了**：拦截器先从数据库（或 Redis/Session）查出用户信息。
  2. **暂存**：把它 `set` 到 `UserContext` 这个 `ThreadLocal` 里。
  3. **本次使用**：这次请求内，所有地方都能直接从 `UserContext` 拿。
  4. **请求结束**：在 `finally` 代码块里调用 `remove()` 清理掉，免得在线程池里污染下一次请求。
     **简单说就是：`ThreadLocal` 本身不是数据源，它只负责临时“托管”从数据库里取出来的数据，用完就清掉。**



### 一个至关重要的习惯：用完必须清理

既然你理解了它的本质，就一定要记住：**用完 `remove()`**。
在线程池（像 Tomcat 的线程池）这种线程复用的环境里，如果不清理，当前线程处理完你的请求后，会被下一个用户的请求复用。如果那个请求没做新的 `set`，就可能无意中读到你上次留下的用户信息，这是重大的安全风险。

------



##  加锁解决线程安全问题

理解完全正确。通过对修改共享状态的方法或代码块加锁（`synchronized` 或 `Lock`），强制同一时刻只有一个线程能执行，化并行为串行，以此保证正确性，但会牺牲并发性能。

------



## 设置`prototype` 作用域解决，但需注意陷阱

你的理解“线程来时每个线程都独占一个属于自己的Bean”是对的。每次通过容器获取（`getBean`）或注入（`@Autowired`）时，Spring 都会创建一个全新的实例。
但这有个**关键陷阱**：如果单例 Bean A 注入了原型 Bean B，B 也只会被创建一次（注入那一刻），之后单例 Bean A 一直持有同一个 B 实例，导致原型失效。要每次使用都获取新的，通常需要注入 `ObjectProvider` 或 `@Lookup`。



# SpringAOP的理解

AOP称为面向切面编程，用于将那些与业务无关，但却对多个对象产生影响的公共行为和逻辑，抽取并封装为一个可重的模块，这个模块被命名为“切”（Aspect），减少系统中的重复代码，降低了模块间的耦合度，同时提高了系统的可维护性。

**事务一般都是采用AOP实现的，AOP底层使用动态代理实现**



## AOP的使用流程

首先定义一个切面类，加上注解@Aspect标注为该类为一个切面类，在其中编写所需切面方法，并依据需求加入对应注解（@Around，@Before，@After），同时使用自定义注解来指定该切面类在哪些方法中生效

```java
@Pointcut("@annotation(com.itheima.annotation.Log)")
private void pointcut() {
}
@Around("pointcut()")
public Object around(ProceedingJoinPoint joinPoint) throws Throwable {... ...}

// 使用AOP的方法加上@Log注解
@GetMapping("/getById/{id}")
@Log(name="根据用户id获取用户")
public User getById(@PathVariable("id") Integer id){
    return userService.getById(id);
}
```



# Spring中事务的实现

Spring支持**编程式事务管理**和**声明式事务管理**两种方式。

-  **编程式事务控制：**需使用TransactionTemplate来进行实现，对业务代码有侵入性，项目中很少使用
- **声明式事务管理（@Transactional）：**声明式事务管理建立在AOP之上的。其本质是通过AOP功能，对方法前后进行拦截，将事务处理的功能编织到拦截的方法中，也就是在目标方法开始之前加入一个事务，在执行完目标方法之后根据执行情况提交或者回滚事务。

声明式事务就是加@Transactional实现事务管理，本质就是Spring给我们定义好了一个AOP，所有被加上@Transactional的方法都会执行该AOP中的方法。



# Spring事务的失效

## 异常捕获后，事务会失效

原本事务执行中如果出现异常，会自动执行事务回滚，但是当我们使用try-catch进行捕获事务后，若是不抛出异常，事务便会失效。

解决时可以再catch中进行异常继续抛出，这样事务可以检测到执行出现了异常，便不会失效。



## 抛出检查异常事务失效

Spring事务默认是检查到有非检查异常时才会进行回滚，若是检查类的异常便不会回滚，例如读取不纯在的文件时，会抛出FileNotFoundException，属于检查类的异常，事务便会失效，不会回滚数据。

通过在注解@Transactional后面配置rollbackFor属性

**@Transactional(rollbackFor=Exception.class)指定事务碰到任何异常时都进行回滚**



## 非public方法造成的事务失效

**Spring 为方法创建代理、添加事务通知、前提条件都是该方法是public的**

解决方案就是，将需要进行事务的方法设定为public即可



# Spring中Bean的生命周期

1. 通过BeanDefinition获取bean的定义信息
2. 调用构造函数实例化bean
3. bean的依赖注入
4. 处理Aware接口(BeanNameAware、BeanFactoryAware、ApplicationContextAware)
5. Bean的后置处理器BeanPostProcessor-前置
6. 初始化方法(InitializingBean、init-method)
7. Bean的后置处理器BeanPostProcessor-后置
8. 销毁bean


**所以流程中的就是：**

1. 最开始是依据BeanDefinition获取到Bean的各项相关信息，通过构造方法先获取到一个Bean实例，但是此时的实例中所有的值都还没有进行赋值或者注入，都是默认值，
2. 后续进行依赖注入，把那些在该Bean实例中需要嵌入的其他Bean进行依赖注入，
3. 然后掉用aware进行获取一些Bean可能会需要配置的类加载器，环境变量，类名，资源加载等等需要的资源信息，这一步是对Bean进行配置吗？
4.执行后置处理器的前置步骤BeanPostProcessor，这一步一般是什么？
5.执行初始化方法initializingBean和init-method是Bean中的初始化方法吗，那他与前面第二步依赖注入，第三步配置环境的区别是什么？
6. 这一步是BeanPostProcessor后置处理，一般是进行代理对象生成对吗？然后Bean对象就可以使用了。
7. 最后就是关闭容器的时候，会执行对应的Bean的销毁的方法



你描述的流程非常准确，已经抓住了 Bean 生命周期的核心主干。我来针对你提出的几个具体问题，逐一详细解释一下。

---

### 1. 关于 Aware 接口：这一步是“配置”吗？

**不完全是配置，而是“感知容器，获取基础设施资源”。**

- **依赖注入（第2步）**：注入的是**业务依赖**，比如你的 `UserService` 需要 `UserDao`，这是你自己的 Bean。
- **Aware 回调**：注入的是**容器本身的基础设施对象**，比如当前 Bean 在容器中的名字 (`BeanNameAware`)，或是 `BeanFactory`、`ApplicationContext`、`Environment` 等。

它的作用是让一个 Bean **有能力与 Spring 容器交互**，或者获取容器级别的配置。例如，一个 Bean 实现了 `ApplicationContextAware` 后，就可以编程式地获取其他 Bean 或发布事件。这一步在本质上是一种**回调注入**，并不是给 Bean 设置业务参数，而是赋予它容器上下文。

---

### 2. BeanPostProcessor 前置处理一般做什么？

`postProcessBeforeInitialization` 是一个**扩展点**，可以在 Bean 的初始化方法执行之前，对 Bean 实例进行处理。常见用途包括：

- **处理特定的注解**  
  比如 `@PostConstruct` 注解就是在这一步（由 `CommonAnnotationBeanPostProcessor`）执行的。虽然通常我们说 `@PostConstruct` 是初始化步骤，但它底层就是通过前置处理来实现的。
- **处理 Aware 接口**  
  其实很多 Aware 接口的调用本身也是由专门的 `BeanPostProcessor` 完成的。例如 `ApplicationContextAwareProcessor` 就是在前置处理中调用 `setApplicationContext` 的。
- **对 Bean 进行包装或标记**  
  如果你需要给某些 Bean 做统一的预处理（如设置一个特殊标记、将 Bean 注册到某个管理器），这是合适的时机。
- **安全、事务等切面的预置**  
  某些基础设施会在这一步为 Bean 设定特定的状态或上下文。

可以简单理解为：**在用户自己的初始化方法调用之前，框架或扩展组件对 Bean 的最后一轮“预处理”。**

---

### 3. 初始化方法与依赖注入、Aware 的区别

你问得非常好，这几步很容易混淆。区别在于**时机和目的**：

| 步骤                                                  | 做什么                                              | 目的                                                         |
| ----------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| **依赖注入**                                          | 给 Bean 的字段/setter 注入依赖的其他 Bean 或配置值  | **装配业务需要的组件**，让 Bean 能正常工作                   |
| **Aware 回调**                                        | 传入 `BeanFactory`、`ApplicationContext` 等容器资源 | **赋予与容器交互的能力**，获取基础设施                       |
| **初始化方法** (`afterPropertiesSet` / `init-method`) | 执行 Bean 自定义的业务初始化逻辑                    | **完成 Bean 自己的准备工作，如校验配置、连接外部资源、启动线程等** |

**举例：**
- 一个 `DataSource` Bean，在依赖注入阶段获得了 `url`、`username`、`password` 等配置值。
- 它不需要 `ApplicationContext`，所以不实现 Aware。
- 在 `afterPropertiesSet()` 里，它用这些值真正创建数据库连接池并校验连接的有效性。**这个逻辑就属于初始化方法。**

所以，依赖注入和 Aware 是“别人给你东西”，初始化方法是“你自己用这些东西开始干活”。

---

### 4. BeanPostProcessor 后置处理一般是生成代理吗？

**是的，最常见且最重要的作用就是生成 AOP 代理对象。**

`AbstractAutoProxyCreator` 就是在 `postProcessAfterInitialization` 中检查 Bean 是否需要被切面增强，如果需要，就创建一个 JDK 或 CGLIB 代理对象，并返回代理，从而替换掉原来的 Bean 实例。我们最终从容器拿到的，通常就是这个代理后的对象。

除此之外，后置处理也可以做：
- 将 Bean 包装成其他类型（如一些框架的 Stub 替换）。
- 将 Bean 注册到 JMX 等管理接口。
- 对完成初始化的 Bean 进行最终校验。

但记住**代理的生成是后置处理最核心的功能**，这也是 AOP 能够透明的根本原因。

---

你总结的流程：
1. `BeanDefinition` 获取定义
2. 构造实例（无依赖，默认值）
3. 依赖注入
4. Aware 回调
5. 前置处理
6. 初始化方法
7. 后置处理（生成代理）
8. 使用
9. 销毁

这个流程非常正确，而且你已经理解了每个阶段的重点。上面这些补充应该能帮你把“是什么”和“为什么”完全贯通。如果还有哪个点想继续深挖，可以随时追问。



**那这里的Aware其实就是这样的：因为我们要把Bean交给Spring容器处理，所以在创建过程中，我们需要把Bean的信息交给容器，注册到容器中，这样我们也可以获取到容器中的一些信息，对Bean进行配置，让它可以与容器进行交流。**
**我这样理解对吗，除了判断我的理解对不对，对于我的描述中的与容器进行交流我不知道怎么交流，所以描述比较模糊，需要帮我解释一下，回答之前检查是否回答正确，然后再进行回答。**



你理解的大方向没错，但在细节上有一个小小的偏差，我帮你梳理一下，然后重点解释你感觉模糊的“交流”到底是什么。

---

### 你的理解里，哪些是对的？
- Aware 确实让 Bean **获取到容器中的一些信息**。
- 让 Bean **可以与容器进行交流**，这个说法完全正确。
- 你意识到了 Aware 和“配置”有关，这也是对的。

### 需要微调的一点
你说：
> 我们需要把 Bean 的信息交给容器，注册到容器中

**Aware 并不是 Bean 向容器“注册”或“交出信息”，而是容器主动把信息“推”给 Bean。**  
Bean 的定义信息（`BeanDefinition`）早就注册好了，Aware 是容器在实例化并注入依赖后，**反过来**对 Bean 说：
> “我把我的地址、名字、环境给你，你可以用这些来找我。”

所以准确地说：**Aware 是容器把自身资源的引用注入给 Bean，让 Bean 有能力反过来访问容器。**

---

### 与容器“交流”到底怎么交流？

Spring 容器就像 Bean 的“大管家”，交流就是指 Bean 能通过获得的对象**主动调用容器提供的能力**。根据实现的不同 Aware 接口，具体交流方式如下：

#### 1. `BeanNameAware` → 知道自己的名字
```java
public class MyBean implements BeanNameAware {
    private String beanName;
    @Override
    public void setBeanName(String name) {
        this.beanName = name;
    }
}
```
**交流方式**：Bean 知道自己在容器中的 ID，可以用来做日志、注册到别的组件时标识自己。

#### 2. `BeanFactoryAware` / `ApplicationContextAware` → 获取容器本身
```java
public class MyBean implements ApplicationContextAware {
    private ApplicationContext context;
    @Override
    public void setApplicationContext(ApplicationContext ctx) {
        this.context = ctx;
    }
    
    public void doSomething() {
        // 主动从容器获取另一个Bean
        OtherBean other = context.getBean(OtherBean.class);
        // 或者发布一个事件
        context.publishEvent(new MyEvent(this));
    }
}
```
**交流方式**：
- **获取其他 Bean**：不用等注入，可以程序化地按类型、名字获取 Bean。
- **发布事件**：利用 `ApplicationContext` 发布事件，让其他监听器接收。
- **获取环境信息**：通过 `context.getEnvironment()` 拿到配置。

#### 3. `EnvironmentAware` → 获取环境变量
```java
public class MyBean implements EnvironmentAware {
    private Environment env;
    @Override
    public void setEnvironment(Environment env) {
        this.env = env;
    }
    public String getDbUrl() {
        return env.getProperty("db.url");
    }
}
```
**交流方式**：直接读取 Spring 环境抽象里的配置，无需 `@Value` 注入。

#### 4. `ResourceLoaderAware` → 加载资源
```java
public class MyBean implements ResourceLoaderAware {
    private ResourceLoader loader;
    public void loadFile(String path) {
        Resource res = loader.getResource(path);
        // 读文件流
    }
}
```
**交流方式**：用容器的资源加载规则（类路径、文件、URL 等）读取文件。

可以看到，“交流”并不是模糊的抽象概念，**就是 Bean 可以主动使用容器提供的基础设施功能**，而不是被动地等着容器把所有东西都注入好。

---

### 总结你的理解修正版
- **原描述**：通过 Aware 把 Bean 的信息交给容器，注册进去，以获取容器信息进行配置。
- **更准确的描述**：Aware 是**容器在创建 Bean 时，主动将一些基础资源对象（如自己的名字、工厂、环境）注入给 Bean**，让 Bean 能够**反向调用容器的能力**，比如查找其他 Bean、读取环境变量、发布事件、加载资源等。这实现了 Bean 与容器的**双向沟通**。

你之前的流程总结完全正确，Aware 就是那张“与管家单线联系的电话卡”，现在你应该清楚电话到底能打给管家的哪些部门了。如果还有想讨论的，随时说。



**那这里的容器具体指的是什么，Spring的IOC控制反转指的是把Bean的创建销毁交给容器管理，需要的时候有容器创建，不需要的时候由容器销毁，容器创建Bean的流程就是上面叙述的那些，那这里的BeanDefinition是创建Bean的各项信息，这里的信息是从哪里得到的呢，是从我们定义Bean的java文件吗，例如我在某个类上使用@Component，@Bean等注解那该类的各项信息就会作为Bean的基本信息**



你这个问题问得非常到位，涉及 Spring 的核心本质。我们分两个部分来说清楚。

---

### 1. “容器”具体指的是什么？

**容器就是 Spring 中实现了 `BeanFactory` 或 `ApplicationContext` 接口的对象。**

最常用的容器是 **`ApplicationContext`** 的几个实现类，比如：
- `AnnotationConfigApplicationContext` — 基于注解的容器
- `ClassPathXmlApplicationContext` — 基于类路径下 XML 配置的容器
- `SpringApplication` 启动的 `ConfigurableApplicationContext`（Spring Boot 内嵌容器也属于这一类）

这个容器对象在内部维护着：
- **`BeanDefinitionRegistry`** — 存放所有 `BeanDefinition` 的注册表（一个 `Map<String, BeanDefinition>`）
- **`singletonObjects`** — 存放所有已创建的单例 Bean 的池（`ConcurrentHashMap`）
- **一系列 `BeanPostProcessor`、监听器、环境变量等**

所以，当你问“容器”是什么时，可以想象它是一个**大工厂 + 大仓库**：根据 `BeanDefinition` 图纸生产 Bean，并保存在仓库中供你获取。同时，它还管理着 AOP、事件、国际化、环境配置等各种周边设施。

---

### 2. BeanDefinition 的信息从哪里来？

你说**“某个类上使用 @Component、@Bean 等注解，该类的各项信息就会作为 Bean 的基本信息”**，这个理解完全正确，并且可以更精确地描述为：

**`BeanDefinition` 来源于“配置元数据”（Configuration Metadata），注解只是最主流的一种形式。**

Spring 提供了多种方式来描述一个 Bean 的元数据，容器启动时会**将这些元数据统一解析、合并、转换成 `BeanDefinition` 并注册**。

#### 来源主要有以下几种：

| 来源                       | 示例                                                         | 如何变成 BeanDefinition                                      |
| -------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **注解扫描**               | `@Component`, `@Service`, `@Controller`, `@Repository`, `@Configuration` 等 | 通过 `ClassPathBeanDefinitionScanner` 扫描 classpath，读取类上的注解以及 `@Scope`、`@Lazy`、`@DependsOn`、`@PostConstruct`、`@PreDestroy` 等，生成 `ScannedGenericBeanDefinition` |
| **@Bean 方法**             | 在 `@Configuration` 类里的 `@Bean` 方法                      | 解析配置类时，每个 `@Bean` 方法会被转换为 `ConfigurationClassBeanDefinition`，包含了方法返回类型、`initMethod`、`destroyMethod`、`@Scope` 等信息 |
| **XML 配置**               | `<bean id="..." class="...">`                                | 通过 `XmlBeanDefinitionReader` 解析 XML 文件，生成 `GenericBeanDefinition` |
| **Java 原生注册**          | 通过 `BeanDefinitionBuilder` 或直接 `new RootBeanDefinition(...)` 编程式注册 | 开发者可以在扩展点（如 `BeanFactoryPostProcessor`）中手动构造并注册 `BeanDefinition` |
| **Spring Boot 的自动配置** | `spring.factories` 中的 `EnableAutoConfiguration` 条目       | Spring Boot 会根据条件注解 (`@ConditionalOnClass`, `@ConditionalOnMissingBean` 等) 生成并注册一系列 `BeanDefinition` |

---

### 以 `@Component` 扫描为例，详细说明过程：

1. 你在类上标注 `@Component("myBean")`，并可能加上 `@Scope("prototype")`、`@Lazy` 等。
2. 容器启动时，`@ComponentScan` 触发了 `ClassPathBeanDefinitionScanner` 对指定包路径进行扫描。
3. 扫描到你的 `.class` 文件，ASM 字节码技术读取到类上的所有注解元数据，**不用真正加载类**。
4. 根据注解元数据创建一个 `ScannedGenericBeanDefinition`，填充：
   - beanClassName → 你的类全限定名
   - scope → 来自 `@Scope`
   - lazyInit → 来自 `@Lazy`
   - dependsOn → 来自 `@DependsOn`
   - initMethodName / destroyMethodName → 来自 `@PostConstruct` / `@PreDestroy`（通过 `CommonAnnotationBeanPostProcessor` 关联）或 `@Bean` 的 `initMethod`/`destroyMethod`
   - 依赖注入信息 → 通过 `@Autowired`、`@Value` 等注解，记录在 `BeanDefinition` 的 `propertyValues` 或通过 `AutowiredAnnotationBeanPostProcessor` 在后续处理
5. 将这个 `BeanDefinition` 注册到 `BeanDefinitionRegistry` 中，key 就是 bean name（如 `"myBean"`）。

之后，容器就可以根据这份“图纸”完成我们前面聊过的整个生命周期流程。

---

### 总结一句话：
- **容器** = `ApplicationContext` 这个对象，负责管理 Bean 的整个生命周期。
- **BeanDefinition 的信息**来源于我们在 Java 代码里写的**注解、XML、或者编程式注册**，Spring 启动时会统一扫描、解析这些元数据，生成对应的 `BeanDefinition` 并存入注册中心。

你用的 `@Component` 等注解，就是被 Spring 的扫描器捕捉到，然后自动生成对应的“Bean 定义信息”。你之前关于生命周期的理解加上现在对元数据来源的理解，已经串起了 Spring 容器工作的完整逻辑。



# SpringIOC控制反转

**控制反转（Inversion of Control，IoC）** 是 Spring 框架的核心思想。简单说就是：

> **把“创建对象”和“管理对象之间依赖关系”的控制权，从程序代码转移给 Spring 容器。**

---

### 传统方式 vs IoC
- **没有 IoC 时**：你需要自己 `new` 对象，手动调用 `setXxx()` 把依赖关系注入，完全由代码显式控制。
- **有了 IoC 后**：你只需要描述“我需要什么”或“我是一个 Bean”，Spring 容器负责创建、装配、并最终交给你使用。程序不再主动创建，而是被动接收。

---

### Spring 中的 IoC 容器
Spring 提供了两个核心容器接口：
- **`BeanFactory`**：基础的 IoC 容器，提供基本的依赖注入能力。
- **`ApplicationContext`**：`BeanFactory` 的扩展，增加了企业级功能（事件发布、国际化、AOP 等），是实际项目中最常用的容器。

容器内部通过 **`BeanDefinition`** 保存每个 Bean 的元数据，并按照完整的生命周期流程（我们之前讨论过的那些步骤）来创建、初始化、注入依赖、以及最终销毁 Bean。

---

### IoC 的具体实现：依赖注入（DI）
IoC 最常见的实现方式就是 **依赖注入（Dependency Injection，DI）**。容器会在创建 Bean 时，自动把该 Bean 所依赖的其他 Bean 注入给它。例如：
```java
@Service
public class UserService {
    @Autowired
    private UserDao userDao;  // 容器自动注入，无需 new UserDao()
}
```
`UserService` 不需要知道 `UserDao` 从哪来、怎么创建，所有控制权都交给了容器。

---

### IoC 带来的好处
- **解耦**：对象之间只依赖接口，不依赖具体实现，更换实现极其方便。
- **可测试**：通过注入 Mock 对象，单元测试变得简单。
- **统一管理**：Bean 的作用域、生命周期、初始化/销毁回调等都由容器统一处理。
- **易于扩展**：基于 AOP 等机制，可以无侵入式地添加事务、日志等功能。

结合我们之前的内容，你可以把 IoC 容器理解为：**根据 BeanDefinition 这份“图纸”，自动负责从诞生到销毁全过程的“智能工厂”**。



# Spring中的循环引用

```java
// 循环依赖或者说是循环引用
@Component
public class A {
	@Autowired
	private B b;
}

@Component
public class B {
	@Autowired
	private A a;
}
```

循环引用指的是，类A，与类B中，互相引用的情况，A中引入B的依赖，B中引入A的依赖，也可能是更深层次的套娃式引用。

![](/imgs/循环依赖.png)

## 三级缓存解决循环依赖

Spring解决循环依赖是通过三级缓存，对应的三级缓存如下所示：

```java
// 单实例对象注册器
public class DefaultSingletonBeanRegistry extends SimpleAliasRegistry implements SingletonBeanRegistry {
	private static final int SUPPRESSED_EXCEPTIONS_LIMIT= 100;
	private final Map<String, Object> singletonObjects = new ConcurrentHashMap(256);  //  一级缓存
	private final Map<String, ObjectFactory<?>> singletonFactories = new HashMap(16); // 三级缓存
	private final Map<String, Object> earlySingletonObjects = new ConcurrentHashMap(16); // 二级缓存
}
```



| 缓存名称 | 源码名称              | 作用                                                         |
| -------- | --------------------- | ------------------------------------------------------------ |
| 一级缓存 | singletonObjects      | 单例池，缓存已经经历了完整的生命周期，已经初始化完成的bean对象 |
| 二级缓存 | earlySingletonObjects | 缓存早期的bean对象（生命周期还没走完）                       |
| 三级缓存 | singletonFactories    | 缓存的是ObjectFactory，表示对象工厂，用来创建某个对象的      |



### 一级缓存无法解决循环依赖

无法解决循环依赖问题，一级缓存的目的是把创建好的单例Bean缓存起来，但是循环依赖中的Bean无法走完完整的生命周期，根本无法创建并初始化完成（如果单指创建的话则可以先走构造函数创建，但是后续的依赖注入则会陷入循环，后续的周期也无法完成）

### 一二级缓存共用解决循环依赖问题（代理对象无法处理）

1. A实例化 → 暴露早期对象到**二级缓存**（如果是代理场景，实际是通过三级缓存的 `ObjectFactory` 提前生成代理，再放入二级缓存）。
2. 填充A的属性时发现依赖B → 去创建B。
3. B实例化 → 填充属性时依赖A → 从**二级缓存**中拿到A的早期引用（可能是代理） → 注入。
4. B完成初始化，成为完整Bean → 放入**一级缓存**，并从二级缓存**移除半成品A**（注意这里移除的是A的半成品，而不是B，你原文说“删除二级缓存中的半成品实例对象A”，这是对的）。
5. **回到A的创建过程**：A继续填充属性B，此时B已在一级缓存，直接拿到完整的B注入。
6. A完成初始化，成为完整Bean，放入一级缓存。



共用解决的实现方案是，先创建对象A的早期对象（只走了构造函数创建了基本的实例，后续的依赖注入以及容器信息Aware，初始化，代理对象等都没有执行），并保存到二级缓存中（二级缓冲的作用就是保存早期的Bean对象）。

然后开始执行对象B的完整的生命周期，构造函数 => 依赖注入A（去二级缓存中取出该实例对象进行依赖注入）=> 执行Aware接口方法把容器信息交给对象B => 执行BeanPostProcessor后置处理器的前置处理逻辑 => 执行初始化方法（**依据依赖注入的对象以及Aware注册的容器信息进行Bean的自己的初始化处理，如校验配置、连接外部资源、启动线程等**） => 执行后置处理器BeanPostProcessor的后置处理，决定是否生成代理对象，以及生成什么样的代理对象 => Bean对象创建完成 => **存入一级缓存中，并删除二级缓存中的半成品实例对象A**

随后A继续完成属性填充的时候，就可以直接从一级缓存中取出创建好的实例对象B，进行依赖注入，执行后续完成创建后把实例存入一级缓存中即可，至此A，B对象均完成创建，由此解决循环依赖问题。

![](/imgs/一级二级缓存共用解决循环依赖.png)

注意：**如果是通过代理增强的代理对象A，那B在依赖注入阶段也需要注入一个代理对象A，所以这里需要使用三级缓存（BeanFactory）来进行解决**



### 三级缓存（解决代理对象问题）

### 为什么代理对象需要三级缓存？

- **只有一、二级缓存**：A提前暴露到二级缓存的是**原始对象**，B注入的就是这个原始对象。即使A最终被后置处理器创建成了代理对象，容器里是一级缓存中的代理对象，而B持有的却是原始对象，这就出现**引用不一致**。
- **引入三级缓存（`ObjectFactory`）**：当B获取A的早期引用时，会触发 `ObjectFactory.getObject()`，此时 `SmartInstantiationAwareBeanPostProcessor` 可以提前调用 `getEarlyBeanReference` 为A生成代理对象，并将其放入二级缓存（替换或覆盖）。这样B注入的就是代理对象，与容器最终持有的代理对象一致。



## 构造函数发生了循环依赖（引用）怎么办

由于上述缓存方案解决的都是在对象进行执行完构造函数之后的，依赖注入阶段发生的循环依赖问题，若是在构造函数阶段就发生循环依赖则无法通过缓存解决。

```java
// Bean创建的初始阶段，构造方法阶段就出现循环依赖
@Component
public Class A{
    // B成员变量
    private B b;
    
    public A(B b){
        System.out.println("A的构造方法执行了")
            this.b=b;
    }
}

@Component
public Class B{
    // A成员变量
    private A a;
    
    public B(A a){
        System.out.println("B的构造方法执行了")
            this.a=a;
    }
}
```

解决方案是在**构造函数参数处加注解@Lazy**让属性延迟加载，只在需要对象时才进行Bean对象的创建。

构造器循环依赖是一个经典的无法通过 Spring 三级缓存解决的难题。因为三级缓存能解决的循环依赖前提是**对象已经实例化成功**（即构造方法执行完毕，生成了原始对象的引用），但构造器注入的依赖发生在实例化阶段，此时连半成品对象都还不存在，自然无法暴露给另一个对象。

`@Lazy` 正是用来打破这个死锁的。

---

### 1. `@Lazy` 解决构造器循环依赖的原理

当你在某个构造器参数上标注 `@Lazy` 时，Spring 不会立即从容器中获取真实 Bean 来注入，而是**注入一个代理对象**。

```java
@Component
public class A {
    private B b;

    public A(@Lazy B b) {   // 注意这里
        this.b = b;
    }
}
```

此时的执行流程变成：

1. 容器开始创建 A，发现它的构造器依赖 B。
2. 因为参数带有 `@Lazy`，Spring **不会触发 B 的完整创建**，而是直接生成一个 B 的代理对象（懒加载代理）。
3. 这个代理对象是一个空的壳，它**实现了相同的接口或继承了相同的类**，但内部暂时不持有真正的 B 实例。
4. A 的构造器被这个代理对象满足，A 实例化成功。
5. 接下来容器开始创建 B，B 的构造器可能依赖 A，此时 A 已经是一个完整的 Bean，可以直接注入，B 也顺利创建。
6. 最终，那个 A 所持有的懒加载代理对象在**第一次真正调用 B 的方法时**，才会去容器中查找真正的 B 实例并完成调用。

**关键点**：`@Lazy` 将强依赖的 Bean 创建时机，从“注入的那一刻”推迟到了“第一次真正使用的那一刻”，从而切断了实例化阶段的互相等待，打破了循环。

---

### 2. 与三级缓存的本质区别

| 方案         | 适用循环依赖类型                       | 核心思想                             |
| ------------ | -------------------------------------- | ------------------------------------ |
| **三级缓存** | Setter / Field 注入循环依赖            | 提前暴露仅实例化未填充的半成品引用   |
| **@Lazy**    | 构造器循环依赖（以及任何想延迟的场景） | 注入一个代理占位符，真正使用时才解析 |

构造器循环依赖没有“半成品引用”可以提前暴露，因为对象连构造都没走完，所以三级缓存无能为力。而 `@Lazy` 用一个代理“骗过”构造器，让对象先被创建出来，绕开了这个限制。

---

### 3. 生成的代理是什么样的

Spring 对 `@Lazy` 的处理是通过 `ContextAnnotationAutowireCandidateResolver` 结合 `ProxyFactory` 生成代理：

- 如果 B 是**接口**，生成 JDK 动态代理。
- 如果 B 是**具体类**，默认使用 CGLIB 生成子类代理（即使类不是 final 且有默认构造器即可）。

这个代理内部持有一个 `ObjectFactory` 或直接引用 `BeanFactory`，等到真实调用方法时，才去 getBean，并委托给真实对象。

---

### 4. 一句话总结

`@Lazy` 让 Spring **不立即创建真实依赖，而是先注入一个代理**，将依赖的解析推迟到首次方法调用，从而打破了构造器阶段“你等我、我等你”的僵局，是解决构造器循环依赖的标准手段。



# SpringMVC执行流程

## 视图阶段

![](/imgs/MVC视图阶段.png)

1. 用户发送出请求到前端控制器DispatcherServlet
2.  DispatcherServlet收到请求调用HandlerMapping(处理器映射器)
3. HandlerMapping找到具体的处理器，生成处理器对象及处理器拦截器(如果有)，再一起返回给DispatcherServlet。
4. DispatcherServlet调用HandlerAdapter(处理器适配器)
5. HandlerAdapter经过适配调用具体的处理器（Handler/Controller)）
6. Controller执行完成返回ModelAndView对象
7. HandlerAdapter将Controller执行结果ModelAndView返回给DispatcherServlet
8. DispatcherServlet将ModelAndView传给ViewReslover(视图解析器)
9. ViewReslover解析后返回具体View（视图）
10. DispatcherServlet根据View进行渲染视图（即将模型数据填充至视图中）
11. DispatcherServlet响应用户



## 前后端分离开发

![](/imgs/前后端分离阶段.png)

1. 用户发送出请求到前端控制器DispatcherServlet
2. DispatcherServlet收到请求调用HandlerMapping(处理器映射器)
3. HandlerMapping找到具体的处理器，生成处理器对象及处理器拦截器(如果有)，再一起返回给DispatcherServlet。
4. DispatcherServlet调用HandlerAdapter(处理器适配器)
5. HandlerAdapter经过适配调用具体的处理器(Handler/Controller）
6. 方法法上添加了@ResponseBody
7. 通过HttpMessageConverter来返回结果转换为JSON并响应



# SpringBoot自动装配原理

1. 在Spring Boot项目中的引导类上有一个注解@SpringBootApplication，这个注解是对三个注解进行了封装，分别是：

   • @SpringBootConfiguration

   • @EnableAutoConfiguration

   •@ComponentScan

2. 其中**@EnableAutoConfiguration**是实现自动化配置的核心注解。该注解**通过@Import注解导入对应的配置选择器**。`@Import(AutoConfigurationImportSelector.class)`

3. 内部就是读取了该项目和该项目引用的Jar包的的**classpath路径下META-INF/spring.factories文件(Spring规定配置文件需要写在这个文件中)**中的所配置的类的全类名。在这些配置类中所定义的Bean会根据**条件注解所指定的条件来决定是否需要将其导入到Spring容器中。**

   > **新版本补充**：从 Spring Boot 2.7 开始，新的配置方式改为 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` 文件（每行一个类名），但底层机制一致。

4. 条件判断会有像**@ConditionalOnClass**这样的注解，判断是否有对应的class文件，如果有则加载该类，把这个配置类的所有的Bean放入spring容器中使用。



## `@Import(AutoConfigurationImportSelector.class)` 是怎么知道“要去读哪些文件”的？

这个过程并不是凭空猜测，而是一套**约定+加载机制**在起作用。

### 1. 约定好的配置文件位置

Spring Boot 约定，所有自动配置类必须在 **`META-INF/spring.factories`** 文件中注册，文件中的 Key 是 `org.springframework.boot.autoconfigure.EnableAutoConfiguration`。

例如，`spring-boot-autoconfigure.jar` 里就有这样一个文件：

```properties
# 第一行是key的值，后续\是换行符，后面都是跟的value值，中间用，隔开
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration,\
org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,\
...
```

这就是所谓的“确定要导入哪些文件”——实际上是要导入哪些**配置类**，而这些配置类的全类名就列在这个文件里。

> **新版本补充**：从 Spring Boot 2.7 开始，新的配置方式改为 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` 文件（每行一个类名），但底层机制一致。

### 2. `AutoConfigurationImportSelector` 如何加载这些文件？

这个类实现了 `DeferredImportSelector`，它的核心方法 `selectImports` 会调用 `getAutoConfigurationEntry()`，其中关键步骤是：

java

```java
protected List<String> getCandidateConfigurations(AnnotationMetadata metadata,
                                                  AnnotationAttributes attributes) {
    // 使用 SpringFactoriesLoader 去所有 jar 包的 META-INF/spring.factories 中
    // 查找 key=EnableAutoConfiguration.class 对应的全类名列表
    List<String> configurations = SpringFactoriesLoader.loadFactoryNames(
            EnableAutoConfiguration.class, getBeanClassLoader());
    return configurations;
}
```



**`SpringFactoriesLoader`** 会：

- 遍历 classpath 下**所有 jar 包**中的 `META-INF/spring.factories` 文件。
- 找出所有 key 为 `org.springframework.boot.autoconfigure.EnableAutoConfiguration` 的值。
- 将这些值（全类名）收集成一个 `List`，这就是**全部候选的自动配置类**。

所以，“确定要导入哪些文件”并不是找文件本身，而是按照这个约定，读取文件中注册的类名列表。这个列表可能包含几百个自动配置类。

------

### 3. 条件注解的二次筛选

你得到这个候选列表后，不会全部导入。`AutoConfigurationImportSelector` 接着会：

- 应用 `@ConditionalOnClass`、`@ConditionalOnMissingBean` 等条件过滤。
- 排除用户显式排除的类（`spring.autoconfigure.exclude`）。
- 最后返回一个真正应该导入的类名数组，交给容器处理。

这样，每个配置类内部还可以再用 `@ConditionalOnXxx` 做更细粒度的条件判断。如果某个配置类被过滤掉，它里面的所有 `@Bean` 都不会注册。

### 总结

**`AutoConfigurationImportSelector` 通过 `SpringFactoriesLoader` 去 classpath 下所有 `META-INF/spring.factories` 文件中读取 `EnableAutoConfiguration` 对应的类名，从而确定候选配置类集合，再结合条件注解过滤出最终要导入的配置类。** 整个过程遵循“约定大于配置”的思想，文件名、Key名都是预定义好的。



# Spring常见注解

| 注解                                           | 说明                                                         |
| ---------------------------------------------- | ------------------------------------------------------------ |
| @Component、@Controller、@Service、@Repository | 使用在类上用于实例化Bean                                     |
| @Autowired                                     | 使用在字段上用于根据类型依赖注入                             |
| @Qualifier                                     | 结合@Autowired一起使用用于根据名称进行依赖注入               |
| @Scope                                         | 标注Bean的作用范围                                           |
| @Configuration                                 | 指定当前类是一个Spring 配置类，当创建容器时会从该类上加载注解 |
| @ComponentScan                                 | 用于指定 Spring 在初始化容器时要扫描的包                     |
| @Bean                                          | 使用在方法上，标注将该方法的返回值存储到Spring容器中使用     |
| @Import                                        | @Import导入的类会被Spring加载到ioc容器中                     |
| @Aspect、@Before、@After、@Around、@Poincut    | 用于切面编程AOP                                              |



# SpringMVC注解

| 注解            | 说明                                                         |
| --------------- | ------------------------------------------------------------ |
| @RequestMapping | 用于映射请求路径，可以定义在类上和方法上。用于类上，则表示类中的所有的方法都是以该地址作为父路径 |
| @RequestBody    | 注解实现接收http请求的json数据，将json转换为java对象         |
| @RequestParam   | 指定请求参数的名称                                           |
| @PathViriable   | 从请求路径下中获取请求参数(/user/{id})，传递给方法的形式参数 |
| @ResponseBody   | 注解实现将controller方法返回对象转化为json对象响应给客户端   |
| @RequestHeader  | 获取指定的请求头数据                                         |
| @RestController | @Controller + @ResponseBody                                  |



# SpringBoot

| 注解                     | 说明                                                         |
| ------------------------ | ------------------------------------------------------------ |
| @SpringBootConfiguration | 组合了@Configuration功能，实现配置文件功能                   |
| @EnableAutoConfiguration | 打开自动配置的功能，依据条件加载所需配置                     |
| @ComponentScan           | Spring组件扫描，例如Mapper层需要Spring进行生成自动代理，需要被启动类扫描到 |



---


# Spring学习笔记
# 一，IoC（Inversion of Control）控制反转&DI（Dependency Injection）依赖注入：
由于原本的书写代码的方式代码之间耦合度较高，一般功能写为接口，通过**接口多态**调用当前接口的实现类，但是由于是采用new的方法new出的对象，所以当**添加新功能或者更改实现类的时候，就需要修改源码，修改源码后就需要重新编译，耦合度太高不利于开发！**



**耦合度**：一般是指代码之间的联系的紧密程度，即修改代码时对其他代码的影响大小，耦合度越高影响越大，**代码之间的关联越大。**



**解决方案**  
**使用对象时，在程序中不要主动使用new产生对象，转换为由外部提供对象**

示例如下：

```java
//业务层实现
public class BookServiceImpl implements BookService{

    private BookDao bookDao = new BookDaoImpl2();
    //此时是利用new来创建的功能实现类对象，耦合度太高，当功能发生变化，就需要修改此处代码。
    //解决方案
    //使用对象时，在程序中不要主动使用new产生对象，转换为由外部提供对象
    public void save() {

    bookDao.save();
    }
}

//数据层实现
public class BookDaoImpl implements BookDao {
    public void save() {
        System.out.println("book dao save...");
    }
}

//数据层发生了功能变化
public class BookDaoImpl2 implements BookDao{
    public void save(){
        System.out.println("book dao save...2");
    }
}
```



**解决方案**  
**使用对象时，在程序中不要主动使用new产生对象，转换为由外部提供对象**

这种思想（方法）被叫做：**IoC（Inversion of Control）控制反转**

### 1.IoC（Inversion of Control）控制反转：
+ 	使用对象时，由主动new产生对象转换为由外部提供对象，此过程中对象创建控制权由程序转移到**外部**，此思想称为控制反转
+ Spring技术对Ioc思想进行了实现  
Spring提供了一个容器，称为**Ioc容器**，用来充当Ioc思想中的**'外部'**  
  Ioc容器负责对象的创建、初始化等一系列工作，被创建或被管理的**对象**在Ioc容器中统称为**Bean**



**2.DI（Dependency Injection）依赖注入：**  
    **在容器中建立bean（对象）与bean（对象）之间的依赖关系的整个过程，称为依赖注入**

原因：部分对象之间存在依赖关系

例如商品属性类与商品类：商品会有自己的独特的口味，包装规格，价格......，都可以称作商品的属性，当使用一个商品类对象时，会用到商品的属性，此时就需要**在商品类中定义一个商品属性类对象，这种包含关系称为依赖关系。**



利用IoC（Inversion of Control）控制反转&DI（Dependency Injection）依赖注入的目的：

1.使程序充分解耦：

+ 	**使用Ioc容器管理bean（IoC）**
+ 	**在Ioc容器内将有依赖关系的bean进行关系绑定(DI)**

2.最终效果  
    **使用对象时不仅可以直接从Ioc容器中获取，并且获取到的bean已经绑定了所有的依赖关系**



# 二，容器的创建以及Bean的创建与获取
### 1.容器的创建方式：
类路径下加载配置文件创建容器：

```java
//在主函数中运行时，加载类路径下的配置文件（得到容器）
ApplicationContext app=new ClassPathXmlApplicationContext("配置文件.xml");
//前面的Applicationtext是接口类型，后面是接口类的实现类对象，采用了接口多态来调用，传入的是配置文件的名称，以此来加载配置文件的信息
```

文件路经加载配置文件创建容器：

```java
//用文件路径寻找加载配置文件
ApplicationContext	ctx=new	FileSystemXmlApplicationContext("Xml配置文件的绝对路径")
```



加载多个配置文件时：

```java
ApplicationContext ctx = new ClassPathXmlApplicationContext("bean1.xml", "bean2.xml");
```



### 2.Bean的配置：
**采用的是getBean的方法来获取Bean，此方法返回的变量类型是Object类型的，所以要对返回结果进行强制类型转换，或者指明其对应需要的变量类型。**



+ 强制类型转换的形式进行获取Bean
+ 在获取时指明对应需要的Bean类型
+ 指明需要的Bean类型，依次来获取对象



```java
BookDao bookDao =（BookDao）ctx.getBean("bookDao");

//强制类型转换的形式进行获取Bean

BookDao bookDao = ctx.getBean("bookDao",BookDao.class);

//在获取时指明对应需要的Bean类型

BookDao bookDao = ctx.getBean(BookDao.class);

//指明需要的Bean类型，依次来获取对象
```



### 3.也可用BeanFactory创建容器，但是用BeanFactory获取的所有的bean均为延迟加载
# 三，对核心容器的总结：
### 1.对Bean的总结：
```java
<bean
id="bookDao"	//bean的Id

 name="dao bookDaoImpl daoImpl"  //bean别名
 
class="com.itheima.dao.impl.BookDaoImpl"	//bean类型，静态工厂类，FactoryBean类
    
 scope="singleton"	//控制bean的实例数量
    
init-method="init"	//生命周期初始化方法
    
destroy-method="destory"	//生命周期销毁方法
    
 autowire="byType"	//自动装配类型
    
factory-method="getInstance"	//bean工厂方法，应用于静态工厂或实例工厂
    
factory-bean="com.itheima.factory.BookDaoFactory"	//实例工厂bean
    
lazy-init="true"	//控制bean延迟加载
    
/>
```



### 2.对依赖注入方法的总结：
```java
<bean id="bookService" class="com.itheima.service.impl.BookServiceImpl">

<constructor-arg name="bookDao" ref="bookDao"/>		//构造器注入引用类型
<constructor-arg name="userDao" ref="userDao"/>

<constructor-arg name="msg" value="wARN"/>		//构造器注入简单类型

<constructor-arg type="java.lang.String" index="3" value="WARN"/>		//类型匹配与索引匹配

<property name="bookDao" ref="bookDao"/>		//setter注入引用类型
<property name="userDao" ref="userDao"/>

<property name="msg" value="WARN"/>		//setter注入简单类型

<property name="names">		//setter注入集合类型

<list>		//list集合

<value>itcast</value>		//集合注入简单类型

<ref bean="dataSource"/>		//集合注入引用类型

</list>

</property>

</bean>

```



# 四，纯注解开发配置Bean和容器：
### 1.Spring提供@Component注解的三个衍生注解：
+ @Controller：用于表现层bean定义
+ @Service：用于业务层bean定义
+ @Repository：用于数据层bean定义

**三种方式作用相同，名称不同是为了方便对程序的理解。**

```java

//前面指定用注解的方式创建Bean,括号中指定名称
@Repository("bookDao")
public class BookDaoImpl implements BookDao {
}

//不指定名称也可正常配置
@Service
public class BookServiceImpl implements BookService {
}

//配置完Bean后需要在核心配置文件中通过组件扫描加载bean，不扫描的话Spring并不知道配置的Bean是哪个，在哪
<context:component-scan base-package="com.itheima"/>
```



注意：使用**@Component以及三个注解时**时，此时已经标注一个实现类配置为Bean，但是此时Spring框架并不知道配置的哪个实现类是Bean，所以要采用**<context:component-scan base-package="com.itheima"/>**来扫描对应的包，找到所配置的那个类。



### 2.纯注解开发
-   
  Spring3.o开启了纯注解开发模式，使用Java类替代配置文件，开启了Spring快速开发赛道

+ **Java类代替Spring核心配置文件,**		@Configuration注解用于设定当前类为配置类		@ComponentScan注解用于设定扫描路径，此注解只能添加一次，多个数据请用数组格式

```java
//具体对应替代如下：
<?xml version="1.o" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="
http://www.springframework.org/schema/beans
http://www.springframework.org/schema/beans/spring-beans.xsd">
</beans>


//以上内容只需用如下代码代替即可：
//下面是一个java配置类，用来代替xml配置文件，简化开发
//@Configuration注解用于设定当前类为配置类
@Configuration
public class SpringConfig{
}

//此时原xml配置文件中的扫描步骤只需用一个注解即可代替：
<context:component-scanbase-package="com.itheima"/>

//扫描步骤对应注解为：
@ComponentScan("com.itheima")
    
//此注解对应参数为String[]类型，传入多个参数时，只需加个大括号和逗号即可
//@ComponentScan注解用于设定扫描路径，此注解只能添加一次，多个数据请用数组格式
@ComponentScan({"com.itheima.service","com.itheima.dao"}) 
    

```



**最终格式为：**

```java
//扫描一个包
@Configuration    		//标志这是一个配置类
@ComponentScan("com.itheima")   
//扫描的作用是扫描包下的接口和类以及属性文件，不扫描的话Spring不知道所配置好的Bean在哪

public class SpringConfig{
    
}


//扫描多个包
@Configuration
@ComponentScan({"com.itheima.service","com.itheima.dao"})     
//扫描的作用是扫描包下的接口和类以及属性文件,

public class SpringConfig{
    
}
```



**读取Spring核心配置文件初始化容器对象切换为读取Java配置类初始化容器对象**

```java
//加载配置文件初始化容器
ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");

//加载配置类初始化容器，Annotation表示注解的意思
ApplicationContext ctx = new AnnotationConfigApplicationContext(SpringConfig.class);
```



### 3.纯注解开发下的Bean的生命周期：
+ 使用**@Scope**定义bean**作用范围**	定义Bean是不是单例模式，

```java
@Repository
@Scope("singleton")
public class BookDaoImpl implements BookDao{
}
```

+ 使用**@PostConstruct，@PreDestroy**定义bean**生命周期**
    - @PostConstruct:  构造方法后
    - @PreDestroy：销毁方法前

```java
@Repository
@Scope("singleton")
public class BookDaoImpl implements BookDao {
    public BookDaoImpl(){
        System.out.println("book dao constructor...");
    }
    
    @PostConstuct
     public void init(){
        System.out.println("book init ...");
    }
    
    @PreDestroy
     public void destroy(){
        System.out.println("book destory ...");
    }
    
}
```



### 4.纯注解模式下的Bean的依赖注入：
#### 4.1使用@Autowiked注解开启自动装配模式（按类型）
```java
@Service
public class BookServiceImpl implements BookService {
    @Autowired   	//自动按类型装配
  
     private BookDao bookDao;

    public void save() {
        System.out.println("book service save ...");
        bookDao.save();
    }
}
```

+ 注意：自动装配基于反射设计创建对象并暴力反射对应属性为私有属性初始化数据，因此无需提供setter方法
+ 注意：自动装配建议使用无参构造方法创建对象（默认），如果不提供对应构造方法，请提供唯一的构造方法



**若有多个相同类型的实现类对象，需要按名称装配Bean**



#### 4.2使用@Qualifier注解开启指定名称装配bean
```java
@Service
public class BookServiceImpl implements BookService {
    @Autowired    //自动装配，默认是按类型匹配
    @Qualifier("bookDao")   //此处利用注解指定要加载的Bean的名称
     @Resource(name="")   //也是按名称装配
    private BookDao bookDao;
}
```

**注意：@Qualifier注解无法单独使用，必须配合@Autowired注解使用**



#### 4.3简单类型的依赖注入：
使用**@Value**实现简单类型注入

```java
@Repository("bookDao")
public class BookDaoImpl implements BookDao {
    @Value("100")   
//直接@value指定值即可,但是这样的话相当于直接写到源码里面，
//耦合性太高且与Private int numb=100;的写法相同。
    private String connectionNum;
}


//应采用属性文件的方法来降低耦合性，通过加载属性文件来存入数据
@Repository("bookDao")
public class BookDaoImpl implements BookDao{
    @Value("${name}")    //name的值来源于加载的属性文件
    private String name;

    public void save(){
        System.out.println("book dao save ....." + name);
    }
}
```



**5.加载properties文件**

使用**@PropertySource**注解加载properties文件

```java
@Configuration
@ComponentScan("com.itheima")
@PropertySource("classpath:jdbc roperties")    //里面写上属性文件名称
public class SpringConfig {

}
//注意：路径仅支持单一文件配置，多文件请使用数组格式配置，不允许使用通配符*
```



五，Spring与Mybatis的注解方式整合

1.属性文件：

jdbc.properties:（数据库属性文件，分别是数据库驱动，数据库地址，用户名，用户密码）

```java
jdbc.driver=com.mysql.cj.jdbc.Driver

jdbc.url=jdbc:mysql://localhost:3306/ssmdb?characterEncoding=utf8&useSSL=false&serverTimezone=UTC&rewriteBatchedStatements=true

jdbc.username=root

jdbc.password=123456
```

2.核心配置文件：

Mybatis的核心配置文件（.xml文件转为class文件）

```java
//原本的代码如下：
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

//读取（加载）数据库属性文件（数据库驱动，数据库地址，用户名，用户密码）
<configuration>
    <properties resource="MySql.properties "></properties>

    
    //给配置文件指定包名，这样书写类型的时候，不用书写前面的包名，简化书写
    <typeAliases>
        <package name="JavaPojo"/>
        <package name="JavaDao"/>
    </typeAliases>

    
    //配置加载环境，指定数据源来源
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"></transactionManager>

            <dataSource type="POOLED">
                <property name="driver" value="${driver}"/>
                <property name="url" value="${url}"/>
                <property name="username" value="${username}"/>
                <property name="password" value="${password}"/>
            </dataSource>

        </environment>

    </environments>

    //以上内容都是为SqlSessionFactory服务的，下面的是指定映射文件所在包的位置,所以Mybatis配置文件大体可分为两部分(转换为class文件与Spring整合时也就转换为了两个类！)
    
    
    //扫描映射文件所在的包，获取映射文件
    <mappers>
        <mapper resource="LQYMapper/LQYStudentMapper.xml"/>
        <mapper resource="LQYMapper/LQYBanjiWithStudent.xml"/>
        <mapper class="JavaDao.StudentMapper"/>
    </mappers>

</configuration>

```

转换为的MybatisConfig文件如下所示：

```java
public class MybatisConfig {

    //创建SqlSessionFactory对象，把该对象的创建权交给Spring,这样在调用其他方法时，Spring会自动创建SqlSessionFactory和SqlSession对象
    //并在使用完后自动关闭，释放资源
    @Bean
    public SqlSessionFactoryBean getSqlSessionFactory(DataSource dataSource){
        SqlSessionFactoryBean sfb=new SqlSessionFactoryBean();
        sfb.setDataSource(dataSource);
        return sfb;
    }


    //扫描映射文件包
    @Bean
    public MapperScannerConfigurer getPojoMapper(){
        MapperScannerConfigurer msc=new MapperScannerConfigurer();
        msc.setBasePackage("com.yan.dao");
        return msc;
    }

}
```





# 


# SSM框架整合具体步骤：
**注意：使用框架整合时，因为是用框架帮助我们开发，所以对象都要依赖于框架里面的配置好的Bean，所有的对象都要从框架里面拿**

## 一，SSM整合流程如下：
### 1.创建工程
首先创建新的SpringMvc项目，初始创建时会少一些文件，需要从File--->Project Structure------>Modules中对缺少的文件进行添加，在Marks as中，可以选择添加的包的类型。

具体添加操作是：

**在main包下添加：**

+ 一个java源文件包：指定为java源文件包（Marks as中浅蓝色的包类型Sources，**主要用来放置一些class文件，controlle，service，dao，impl，domain等都在这个包下，各种类和接口**）
+ 一个resources资源包：指定为Resources类型的资源包（用来放各种属性文件，xml类型的配置文件，mapper映射文件，properties类型的属性文件）

**在src包下添加：**

+ 一个test文件包：用于放置一些开发中对service（业务层）的测试代码，测试业务层的功能能否正常执行。（普通文件包，不需单独指定类型）

**在test包下添加：**

+ 一个装不同实体的测试代码的javatest包（包名可任意），类型为Marks as中的Tests类型，主要存一些对业务层（service）的测试代码，例如：StudentServiceTest，UserServiceTest.......

### 2.SSM整合
+ Spring  
    SpringConfig
+ MyBatis		MybatisConfig		JdbcConfig		jdbc.properties
+ SpringMVC		ServletConfig		SpringMvcConfig

**注意：在配置依赖 javax.servlet-api 时：**

```java
    <dependency>
      <groupId>javax.servlet</groupId>

      <artifactId>javax.servlet-api</artifactId>

      <version>3.1.0</version>

<!--        provided：在编译时可用运行时不可用，test：正好相反-->
<!--        使用servlet时需要配置他的scop属性为provide，否则会与tomcat7-maven-plugin的插件起冲突，无法运行-->
<!--        为什么 scope=provided 是必要的？-->
<!--        scope=provided 表示该依赖仅在编译和测试时需要，运行时由容器（如 Tomcat）提供。这样可以避免打包 Servlet API 到 WAR 文件中，从而防止与容器自带的 API 冲突。-->
        <scope>provided</scope>

    </dependency>

    
        不配置<scope>provided</scope>会出现A child container failed start错误
```



添加事务时：

1. **权衡利弊**：

在实际开发中，许多团队会选择在 Service 类上整体添加`@Transactional`注解，同时对特殊方法进行单独配置，这样既保证了代码的简洁性，又能满足不同业务场景的需求

    - 对于所有方法都需要事务的 Service 类，类级别注解是很好的选择
    - 对于只有部分方法需要事务的类，逐个方法添加注解更合适
    - 默认传播行为是`REQUIRED`，通常适用于大多数业务场景
    - 可以在类级别设置合适的传播行为
        * 方法级别的`@Transactional`注解会覆盖类级别的配置
        * 如示例中的`getUserById`方法使用了`readOnly=true`覆盖了类级别的配置

```java
@Service
@Transactional(rollbackFor = Exception.class)
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public void createUser(User user) {
        // 自动在事务中执行
        userRepository.save(user);
    }
    
    @Override
    public void updateUser(User user) {
        // 自动在事务中执行
        userRepository.save(user);
    }
    
    @Override
    public void deleteUser(Long id) {
        // 自动在事务中执行
        userRepository.deleteById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        // 覆盖类级别的事务配置，设置为只读事务
        return userRepository.findById(id).orElse(null);
    }
}
```



### 3.功能模块
+ 表与实体类  
dao（接口+自动代理）
+ service（接口+实现类）  
业务层接口测试（整合JUnit）
+ controller  
表现层接口测试（PostMan）


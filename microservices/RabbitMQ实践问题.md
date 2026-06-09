# RabbitMQ 实践问题

## Maven 依赖作用域导致的自动配置失败

### 问题场景

在公共模块 `hm-common` 中使用 `spring.factories` 暴露 MQ 配置类，但依赖了该模块的部分服务启动报 `NoClassDefFoundError`，找不到 MQ 相关类。

### 核心原因

`spirng.factories` 让所有依赖 `hm-common` 的模块都尝试加载 MqConfig，但 `pom.xml` 中 MQ 依赖声明了 `provided` 作用域：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
    <scope>provided</scope>  <!-- 问题所在 -->
</dependency>
```

Maven 中 `provided` 的含义：
- 当前模块编译时可用
- **不会作为传递依赖**带给下游模块
- 不会被打包进最终的部署包

结果就是：**自动配置类被传递了，但它依赖的 MQ 类库没有被传递**。

### 为什么 `@ConditionalOnClass` 也没拦住

`@ConditionalOnClass(RabbitTemplate.class)` 并非万能防护：

- 注解里引用了 `RabbitTemplate.class`
- 方法返回值用了 `MessageConverter`
- 方法体内 new 了 `Jackson2JsonMessageConverter`

只要 Spring 解析配置类，就会触发这些类型的加载。如果类路径没有，直接报错。

### 三种解决方案

| 方案 | 做法 | 适用场景 |
|------|------|----------|
| **方案一** | 去掉 `provided`，改成默认 `compile` | 所有服务都需要 MQ |
| **方案二** | 需要 MQ 的服务自己引入 MQ 依赖 | 部分服务需要 MQ |
| **方案三（推荐）** | 把 MQ 配置拆成独立 starter | 最佳实践，职责清晰 |

> 核心教训：公共模块只放通用配置；可选能力不要塞进全局自动配置。

---

## `@RabbitListener` 注解嵌套原理

### 为什么注解里能再嵌套注解？

```java
@RabbitListener(bindings = @QueueBinding(
    value = @Queue(name = "trade.pay.success.queue", durable = "true"),
    exchange = @Exchange(name = "pay.direct"),
    key = "pay.success"
))
public void paySuccessListener(Long orderId) {
    orderService.markOrderPaySuccess(orderId);
}
```

这是 **Java 注解语法规则**决定的，不是 Spring 特殊语法。注解属性的类型可以是：基本类型、String、Class、枚举、**另一个注解**、以及它们的数组。

### 嵌套的本质

`@RabbitListener` 的 `bindings` 属性被框架定义为接收 `@QueueBinding` 类型，`@QueueBinding` 又定义了 `value`（接收 `@Queue`）、`exchange`（接收 `@Exchange`）、`key`（接收字符串）。

这本质是用注解表达一棵**配置树**：

```
@RabbitListener              ← 监听器
  └── @QueueBinding          ← 绑定关系
        ├── @Queue           ← 队列配置
        ├── @Exchange        ← 交换机配置
        └── key              ← 路由键
```

就是把原来的 yaml 或管理台配置，改用代码元数据表达。

### 监听器类为什么必须加 `@Component`

Spring 要处理 `@RabbitListener`，前提是这个类必须是容器里的 Bean。否则 Spring 不会把它当作候选对象去解析监听方法。因此监听器类必须加 `@Component`（或通过 `@Bean` 注册）。

### 什么时候该加 `@Component`

| 加 `@Component` | 不加 `@Component` |
|------|------|
| 需要依赖注入 | 纯数据对象（DTO/VO/Entity） |
| 被 Spring 注解机制识别 | 全是静态方法的工具类 |
| 参与事务/AOP/监听/定时任务 | 枚举、常量类 |
| 消息监听器、策略实现类 | 只在某处临时 new 的对象 |

**判断口诀**：先问需不需要 Spring 接管 → 再问属于哪类角色（Service/Repository/Controller/Component） → 自己写的类优先类上加注解，第三方类优先 `@Bean`。

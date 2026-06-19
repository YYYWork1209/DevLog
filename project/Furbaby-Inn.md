# 定义前后端交互规范(RESTFul)
``` java
/**
 * 响应结果实体类,用于封装响应结果
 * 包含状态码、消息和数据
 * 状态码: 200 成功, 500 失败
 * 消息: 成功或失败的描述
 * 数据: 成功时返回的数据列表
 * 提供成功和失败的静态方法,用于快速创建成功或失败的响应结果
 * @param <T>
 */
@Data
@AllArgsConstructor
@Builder
public class Result<T> {
    private String code;
    private String message;
    private List<T> data;

    public static <E> Result<E> success() {
        return Result.<E>builder()
                .code("200")
                .message("成功")
                .data(List.of())
                .build();
    }
    
    public static <E> Result<E> success(List<E> data) {
        return Result.<E>builder()
                .code("200")
                .message("成功")
                .data(data)
                .build();
    }
    
    public static <E> Result<E> error(String message) {
        return Result.<E>builder()
                .code("500")
                .message(message)
                .data(List.of())
                .build();
    }

}
```
## 注意泛型的使用


### 为什么返回值 `Result<T>` 前面还要加一个 `<T>`？

关键在于**分清“类的泛型”和“方法的泛型”**。

- **`class Result<T>`** 这里的 `T` 是**类的泛型**，属于实例级别。它只有在创建对象时（比如 `new Result<User>()`）才会被确定。
- **静态方法**属于类本身，它**不依赖**于任何具体的对象实例。因此，**静态方法不能直接使用类上定义的泛型 `T`**（因为静态方法加载时，实例的泛型还没确定呢）。

所以，如果静态方法想使用泛型，**必须自己声明自己的泛型**。

**语法拆解：`public static <T> Result<T> success(List<T> data)`**

我们把这段代码分成三部分来看：

| 代码片段 | 含义 |
| :--- | :--- |
| `public static` | 访问修饰符，静态方法 |
| **`<T>`** | **声明**：告诉编译器“我这个静态方法自己定义了一个泛型符号，叫 `T`”。（这个 `T` 和类头上的 `Result<T>` 不是同一个，只是恰好名字一样） |
| `Result<T>` | **使用**：返回类型。告诉编译器，我返回的 `Result` 对象里装的正是刚才声明的那个 `T` 类型。 |
| `(List<T> data)` | **参数**：入参也是刚才声明的那个 `T` 类型的列表。 |

---

### 如果去掉方法上的 `<T>` 会怎样？

```java
// 错误示范
public static Result<T> success(List<T> data) { // 报错！
    // ...
}
```
编译器会直接报红：**`cannot find symbol 'T'`**（找不到符号 T）。因为如果不写 `<T>`，编译器认为这里的 `T` 是指类头上的 `Result<T>`，但静态方法访问不了类的泛型，所以直接报错。


当你写 `Result.success(users)` 时，**你还没有创建 `Result` 的任何对象实例**。你调用的是**类名** `Result` 上的静态方法，这时候内存里连个 `Result` 对象都没 new 出来呢。

既然没有对象实例，何来“对象实例传入自己的 `T`”呢？所以，静态方法推断泛型，靠的**不是对象实例**，而是**方法调用时的上下文**（也就是你传进去的参数，以及你把返回值赋值给谁）。

---

### 静态方法的 `T` 到底怎么来的？

**关键原则：静态方法的泛型，完全由方法参数和返回值赋值决定，和类头上的 `<T>` 没有任何瓜葛。**

我们对比两种情况：

#### 情况 1：你传的是 `List<User>`
```java
List<User> users = ...; 
Result<User> result = Result.success(users); 
```
- 编译器看了一眼你传的参数 `users`，类型是 `List<User>`。
- 它对照方法签名 `public static <T> Result<T> success(List<T> data)`，发现参数 `data` 是 `List<T>`，而你给的是 `List<User>`。
- **结论**：编译器把静态方法自己的那个 `<T>` 推断为 `User`。

#### 情况 2：假设类上定义的是 `Result<String>`，但静态方法依然不看它
```java
// 假设类定义是 class Result<String>（类T是String）
// 但静态方法我照样可以这么干：
List<Integer> numbers = ...;
Result<Integer> result = Result.success(numbers); // 完全合法！
```
静态方法返回的是 `Result<Integer>`，它**完全无视**了类定义的 `Result<String>`。这足以证明，静态方法的泛型和对象实例的泛型是两个世界的东西。

---



- **类上的 `T`（实例级别）**：相当于一个**模具**。你拿这个模具去造东西（`new Result<User>()`），造出来的东西上面刻着“User”。
- **静态方法上的 `<T>`（方法级别）**：相当于一个**独立的生产机器**。它不依赖任何模具，它只看你丢进去的原料（参数）是什么，就能生产出对应型号的产品（返回值）。

它们俩恰好都叫“T”，只是个名字巧合。你完全可以给静态方法换个字母，比如写成 `public static <E> Result<E> success(List<E> data)`，效果完全一样。编译器照样通过你传入的 `List<User>` 把 `E` 推断成 `User`。

---


### 总结
1. **类型推断**：编译器通过你传入的 `List<User>` 自动识别出 `T=User`。
2. **方法上的 `<T>`**：这是**必须的**，它是静态方法“自带的身份证”，告诉编译器“我也有自己的泛型，别拿我和类的泛型搞混”。

你可以把类的泛型 `T` 理解成“**对象的属性**”，把静态方法的 `<T>` 理解成“**方法的局部变量**”，虽然名字一样，但作用域完全不同！

### 总结
**静态方法里的 `<T>` 是“自给自足”的，它从参数里猜出来你要什么，压根儿不关心类上声明的是什么 `T`。** 

---

# 登录模块

## 使用过滤器来进行用户请求的鉴权
若是用户发来请求，先到拦截器中判断是否是白名单中的请求：
- 是白名单中的请求，例如“/login”，放行该请求
- 不是白名单中的请求，进行登录校验（目前采用jwt方式），解析通过放行请求，不通过或为空，返回401状态码，前端进行跳转到登录界面

**拦截器的执行顺序**

下面是一个清晰的执行流程图，假设我们有两个 Interceptor（**Interceptor1, Interceptor2**）：
```markdown
请求进入
  |
  v
Interceptor1.preHandle()  (return true)
  |
  v
Interceptor2.preHandle()  (return true)
  |
  v
Controller 方法执行
  |
  v
Interceptor2.postHandle()  <-- 注意这里是倒序
  |
  v
Interceptor1.postHandle()
  |
  v
视图渲染
  |
  v
Interceptor2.afterCompletion() <-- 这里也是倒序
  |
  v
Interceptor1.afterCompletion()
  |
  v
响应客户端
```

## 完整执行流程
Spring MVC HandlerInterceptor 的完整执行流程。一个请求从进入到完成，主要会经过以下几个阶段，HandlerInterceptor 的三个方法（preHandle、postHandle、afterCompletion）会在不同阶段被调用。

### 1.preHandle(request, response, handler)

- 执行时机: 在 Controller 的处理方法（Handler）执行之前调用。
- 核心作用: 这是第一道关卡，通常用于进行权限验证、登录状态检查、日志记录等。
- 注意点:
  - 此方法返回一个布尔值。如果返回 true，则继续执行后续的 Interceptor 和 Handler。

  - 如果返回 false，则请求处理流程会中断，不会再调用后续的 Interceptor 和 Handler，但已经执行过的 Interceptor 的 afterCompletion 方法仍然会被调用。
### 2.Controller 方法执行

- 在 preHandle 返回 true 后，DispatcherServlet 会调用匹配的 Controller 方法来处理业务逻辑。

### 3.postHandle(request, response, handler, modelAndView)

- 执行时机: 在 Controller 的处理方法执行之后，但在视图（View）渲染之前调用。
- 核心作用: 提供了在视图渲染前修改 ModelAndView 的机会。例如，可以向 ModelAndView 中添加一些所有页面都需要共用的数据。
  - 注意点:
  - 只有在 preHandle 方法返回 true 的情况下才会被调用。
  - 如果在 Controller 方法中抛出了异常，postHandle 方法将不会被执行。
### 4.视图渲染
- DispatcherServlet 会根据 ModelAndView 渲染视图，并响应给客户端。

### 5.afterCompletion(request, response, handler, ex)

- 执行时机: 在整个请求处理完成（包括视图渲染）之后调用。
- 核心作用: 主要用于资源清理工作，例如记录请求耗时、处理异常等。
- 注意点:
  - 只要一个 Interceptor 的 preHandle 方法返回 true，那么无论后续处理（Controller 执行、视图渲染）是否发生异常，这个 Interceptor 的 afterCompletion 方法总是会被调用。
  - ex 参数包含了在请求处理过程中可能抛出的异常对象，方便进行统一的异常处理或记录。


## 关于Http响应数据中的状态码Code与自定义返回数据Result中的状态码Code


- **HTTP 状态码**：是**协议层/传输层**的状态，属于“快递物流”信息（快递有没有送到、服务器有没有炸）。
- **`Result.code`**：是**业务层**的状态，属于“包裹里的货物”信息（货物有没有坏、是不是发错了）。

既然分工明确，那为什么要在响应体里再塞一个 `code`，直接用 HTTP 状态码不就行了吗？这绝不是多此一举，而是现代企业级开发（特别是微服务和移动端开发）的核心设计。

举一个**常见**的场景， 关于`code` 的不可替代性：

---

### 场景：用户下单，余额不足

- **HTTP 状态码（协议层）**：服务器正常运行，没有宕机，请求处理完毕。状态码设为 **`200 OK`**（因为我服务器没出问题）。
- **`Result.code`（业务层）**：你下单失败了。业务码设为 **`1001`**（代表“余额不足”）。

**如果只依赖 HTTP 状态码（只有 200）**，前端拿到后一脸懵：“收到 200 了，我该给用户展示‘下单成功’还是‘余额不足’？”——**没法区分**。

**有了自定义 `code` 后**，前后端规范的写法是：

```javascript
// 前端 axios 拦截器
if (response.status === 200) { 
  // 1. 服务器网络层面通了，检查业务层面
  if (response.data.code === '200') {
    // 业务成功，展示成功页面
    showSuccess();
  } else {
    // 2. 业务失败（如 1001 余额不足），弹窗提示 response.data.message
    showError(response.data.message);
  }
} else if (response.status === 401) {
  // 3. 协议层未授权（比如 Token 过期），直接跳转登录页
  router.push('/login');
}
```

---

### 自定义业务码（`Result.code`）的三大核心作用

| 作用 | 详细说明 | 举例 |
| :--- | :--- | :--- |
| **1. 承载精细化业务错误** | 同一个 HTTP 200 下，可能有成千上万种业务结果。自定义 code 可以细分（如 1001=余额不足，1002=库存不足，1003=账户冻结）。 | 淘宝下单返回 `200`，但 `code=1001` 提示“余额不足”，`code=1002` 提示“库存没了”。前端根据不同的 `code` 展示不同的文案甚至走不同的逻辑分支。 |
| **2. 区分“服务器崩溃”和“业务操作失败”** | 如果服务器代码报错（空指针、数据库连接超时），HTTP 状态码是 500，前端可以直接报“系统繁忙”。如果是业务失败（密码错误），HTTP 状态码是 200，前端只用取 `code` 提示“密码错误”即可。**这能有效避免“一报错就显示服务器炸了”的尴尬。** | 登录时密码输错 -> HTTP 200，code=4010（业务错）。服务器宕机 -> HTTP 500，前端直接弹“网络开小差”。 |
| **3. 网关/监控/日志统计** | 运维监控只看 HTTP 状态码（比如 Nginx 只统计 5xx 的数量）。如果业务失败全部抛 400 或 500，会导致服务器监控疯狂报警（明明只是用户输错密码，运维却收到“服务器异常”警报）。**有了自定义 code，业务错误全返回 HTTP 200，内部用 `code` 区分，运维只看 HTTP 5xx 即可，报警极其精准。** | 你希望在监控大屏上只看到“真实系统故障”，而不是“用户手滑输错密码”。 |

---

### 总结

- **HTTP 状态码**：告诉前端“**网络通不通**”（用于全局拦截，如 401 跳登录、503 显示服务器维护）。
- **自定义 `Result.code`**：告诉前端“**业务成不成**”（用于局部提醒，如弹窗提示“密码错误”或“余额不足”）。

它们各司其职，**缺一不可**。现在的设计（`Result` 里带 `code` + 全局异常里配 `@ResponseStatus`）实现了两层的解耦。


- **HTTP 状态码**（Response Status）是**协议层/传输层**的状态，属于“快递物流”信息（快递有没有送到、服务器有没有炸）。
- **`Result.code`** 是**业务层**的状态，属于“包裹里的货物”信息（货物有没有坏、是不是发错了）。

既然分工明确，那为什么要在响应体里再塞一个 `code`，直接用 HTTP 状态码不就行了？这绝不是多此一举，而是现代企业级开发（特别是微服务和移动端开发）的核心设计。我举一个你马上就会遇到的场景，你就豁然开朗了：

---

### 场景：用户登录时密码输错了

- **HTTP 状态码（协议层）**：服务器正常运行，没有宕机，请求处理完毕。状态码设为 **`200 OK`**（因为我服务器没出问题，正常返回了结果）。
- **`Result.code`（业务层）**：登录失败了。业务码设为 **`1001`**（代表“密码错误”）。

**如果只依赖 HTTP 状态码（返回 200）**，前端拿到后一脸懵：“收到 200 了，我是该跳转到首页，还是提示密码错了？”——**没法区分**。

**有了自定义 `code` 后**，前后端规范的写法是：

```javascript
// 前端 axios 拦截器
if (response.status === 200) { 
  // 1. 服务器网络层面通了，检查业务层面
  if (response.data.code === '200') {
    // 业务成功，跳转首页
    router.push('/home');
  } else {
    // 2. 业务失败（如 1001 密码错误），弹窗提示 response.data.message
    showError(response.data.message); // 弹窗：“密码不正确”
  }
} else if (response.status === 401) {
  // 3. 协议层未授权（比如 Token 真的过期了），直接跳转登录页
  router.push('/login');
}
```

---

### 自定义业务码（`Result.code`）的三大核心作用

| 作用 | 详细说明 | 举例 |
| :--- | :--- | :--- |
| **1. 承载精细化业务错误** | 同一个 HTTP 200 下，可能有成千上万种业务结果。自定义 code 可以细分（如 1001=密码错误，1002=账户冻结，1003=验证码过期）。 | 淘宝下单返回 `200`，但 `code=1001` 提示“余额不足”，`code=1002` 提示“库存不足”。前端根据不同的 `code` 展示不同的提示甚至走不同的逻辑分支。 |
| **2. 区分“服务器崩溃”和“业务操作失败”** | 如果服务器代码报错（空指针、数据库连接超时），HTTP 状态码是 500，前端可以直接报“系统繁忙”。如果是业务失败（密码错误），HTTP 状态码是 200，前端只用取 `code` 提示“密码错误”即可。**这能有效避免“一报错就显示服务器炸了”的尴尬。** | 登录输错密码 -> HTTP 200，code=1001。服务器宕机 -> HTTP 500，前端弹“网络开小差”。 |
| **3. 网关/监控/日志统计** | 运维监控只看 HTTP 状态码（比如 Nginx 只统计 5xx 的数量）。如果业务失败全部抛 400 或 500，会导致服务器监控疯狂报警（明明只是用户输错密码，运维却收到“服务器异常”警报）。**有了自定义 code，业务错误全返回 HTTP 200，内部用 `code` 区分，运维只看 HTTP 5xx 即可，报警极其精准。** | 在监控大屏上只看到“真实系统故障”，而不是“用户手滑输错密码”。 |

---

### 总结

- **HTTP 状态码**：告诉前端“**网络通不通**”（用于全局拦截，如 401 跳登录、503 显示服务器维护）。
- **自定义 `Result.code`**：告诉前端“**业务成不成**”（用于局部提醒，如弹窗提示“密码错误”或“余额不足”）。

它们各司其职，**缺一不可**。现在的设计（`Result` 里带 `code` + 全局异常里配 `@ResponseStatus`）实现了两层的解耦。


## Jwt生成流程
**主要使用 JJWT 进行生成jwt令牌**
```java
    public String generateToken(String userId) {
        // 可选：将额外的用户信息放入 Claims（比如用户名、角色）
        Map<String, Object> claims = new HashMap<>();
        //        claims.put("userId", userId); 
         //subject即可标明用户ID，claims可放置其他信息，不能是敏感信息

        // 如果你还想放个昵称，可以 claims.put("nickname", "张三");

        return Jwts.builder()
                .claims(claims)                // 放入私有声明
                .subject(userId)               // 标明Jwt令牌是属于谁的（一般是用户ID），
                .issuedAt(new Date())          // 签发时间
                .expiration(new Date(System.currentTimeMillis() + expiration)) // 过期时间
                .signWith(getSecretKey())      // 签名（加密）
                .compact();                    // 压缩成字符串
    }
```

---

### `subject`（主题）的作用？

`subject`（在标准字段里缩写为 `sub`）是 JWT 中**最核心的标准化字段**，它的作用就一句话：**标识“这个 Token 到底是发给谁的（谁是登录用户）”**。

*   **它是“身份证号”**：在 OAuth 2.0、OIDC（OpenID Connect）等标准协议中，资源服务器（后端）拿到 Token 后，第一件事就是读取 `sub` 字段，来确定当前操作的是哪个用户。
*   **它和 `claims` 的区别**：
    *   **`claims` (私有声明)**：相当于一个**“装满随身物品的背包”**，你可以往里面随便塞 `userId`、`role`、`nickname`（爱放什么放什么）。
    *   **`subject` (主题)**：相当于**“背包上的姓名牌”**。它是给外界统一看的，告诉所有系统“这个包的主人叫张三”。
*   **实际作用**：
    *   微服务之间互相调用时，网关解析 JWT 后，会把 `sub` 提取出来放到请求头里（比如 `X-User-Id`），下游服务直接拿这个当用户 ID，而不用去解析复杂的 `claims` 结构。
    *   在日志中打印 `sub`，可以快速追踪到是哪个用户在操作（无需打出一大串 JSON 数据）。


---

###  `issuedAt`（签发时间）的作用（踢人下线，时效判断，过期时间）

*   **作用一（计算过期）**：确实，`expiration = issuedAt + 有效期`。这是它的主要数学用途。
*   **作用二（时效性判断 / 新鲜度校验）**：很多安全策略不允许使用“未来签发的 Token”。如果服务器时间不同步，`issuedAt` 大于当前时间，JWT 库在校验时会直接报错（拒绝接受来自未来的 Token）。
*   **作用三（强制重新登录 / 踢人下线）**：这是企业级应用非常常见的业务场景。比如：**修改密码后，让所有旧的 Token 失效**。后端不需要存 Token 列表，只需要存**“上次修改密码的时间”**。当拦截器解析 Token 时，取出 `issuedAt`，如果发现 `issuedAt` 小于“上次修改密码的时间”，就直接判定 Token 失效，强制重新登录。**这个功能的实现，完全依赖 `issuedAt` 字段。**

---

### 总结

- **`subject`**：是**“给谁用的”**（用户的唯一标识），是 JWT 的标准“用户 ID 位”。
- **`issuedAt`**：是**“什么时候发的”**，除了算过期时间，更是你做**“令牌吊销、强制下线”**等高级安全控制的基础时间锚点。

## 过滤器拦截器执行顺序
```txt
客户端 → [过滤器 1] → [过滤器 2] → [DispatcherServlet] → [拦截器 1] → [拦截器 2] → [你的Controller]
```
**“过滤器先做认证，拦截器以后再加来做鉴权” 的设计模式:**
---

### 之前的架构：过滤器 = 认证入口
```
请求 → JWT 过滤器（解析 token，设置用户上下文） → Controller → 业务逻辑
```

-   **过滤器**负责：  
    - 提取 Header 中的 `Authorization: Bearer xxx`  
    - 解析 JWT，获取 userId  
    - 将 userId（或整个 Claims）放入一个 **与线程绑定的上下文**（比如你的 `UserContext`，或者 Spring Security 的 `SecurityContextHolder`）  
    - 验证失败则直接返回 401，不放行  

-   这个时候**不需要拦截器**， Controller 已经可以安全地获取当前用户 ID。

---

### 2. 将来需要再进行：拦截器 ：业务鉴权补充

当需要**更细粒度的权限控制**时（例如“VIP 用户才能访问某个接口”、“同一个用户 1 分钟内只能提交一次”），再把拦截器加上：

-   拦截器在请求**到达 Controller 之前**执行，可以拿到过滤器设置的 userId。
-   可以写一个 `@VIPOnly` 注解，然后用拦截器检查用户角色。
-   或者写一个限流拦截器，根据 userId 计数。

**这时过滤器和拦截器的分工如下：**

| 层级 | 负责 | 举例 |
| :--- | :--- | :--- |
| 过滤器 | **我是谁**（认证） | 解析 JWT，确认用户身份，设置上下文 |
| 拦截器 | **我能干什么**（鉴权） | 检查权限、限流、日志、黑名单等 |

---


## 项目登录模块鉴权功能升级
### 使用Spring Security来进行分布式场景下的鉴权与上下文信息传递
原先采用**拦截器+JWT令牌校验**，验证通过后**在ThreadLocal中进行存储信息**的方式缺点如下：
- ThreadLocal 保证每个线程都有一个独立副本，不同线程间不共享，因此读取时不会串数据。
  然而在 Web 容器（如 Tomcat）中，**线程是基于线程池复用的**。
  如果一个请求结束后没有清空 ThreadLocal，下一个请求复用到同一线程时，就会读到上一个请求残留的用户 ID —— 这属于严重的安全漏洞（身份冒充）。

- 分布式环境（多实例 + 服务间调用）中，ThreadLocal 本身不会带来额外漏洞，但有功能局限：

  - JWT 本身就是无状态的：每个请求都携带 token，每个服务实例都可以独立解析 JWT 并放入自己的 ThreadLocal。

  - 问题在于服务间调用：
    假设服务 A 调用服务 B，如果服务 B 也需要知道当前用户 ID，它需要从请求头中继续传递 JWT，然后自己解析放入 ThreadLocal。
    ThreadLocal 不会自动跨 JVM 传递，你必须在 Feign/RestTemplate 等调用时，手动把 JWT 写到新请求的 Authorization 头里。

**这不是 ThreadLocal 的“漏洞”，而是分布式上下文传递的设计要求。**
如果你不做这件事，B 服务拿到一个没有 JWT 的请求，就会丢失用户身份。

## 特别注意：异步场景
如果你在业务方法中使用了 `@Async、CompletableFuture `等，子线程会丢失父线程的 `ThreadLocal` 变量。
此时需要用 `InheritableThreadLocal` 并配合在线程池中传递上下文（如 Spring 的 `TaskDecorator`），或者使用专门的上下文传播机制（比如阿里 `TransmittableThreadLocal`）。

### 改为使用Spring Security进行鉴权以及信息传递
- 高并发情况
  - 自动清理：Spring Security 的 SecurityContextHolder 默认使用 ThreadLocal 策略，但它的过 滤器链末尾会自动调用 SecurityContextHolder.clearContext()，杜绝残留。
  比自己手动 try-finally 更不易出错。，只要你不手动干预，它的过滤器会自动清理上下文。

  - 线程池复用：它的清理机制在每次请求结束时执行，不会残留，比你手动 finally 更加安全。
- 分布式情况：
  跨服务调用：
  仍然需要在 Feign/RestTemplate 中把 JWT 向下游传递，然后在每个服务中用 Spring Security 相同的上下文方式处理即可

**原先拦截器+JWT+ThreadLocal** 与 **Spring Security** 方案在开发上的区别

---

### 开发区别

| 关注点 | 原先：拦截器 + JWT + ThreadLocal | Spring Security |
| :--- | :--- | :--- |
| **上下文管理** | 自己创建 `ThreadLocal` 工具类，手动 `set`，**必须 `try-finally` 执行 `remove()`** | 直接使用 `SecurityContextHolder`，**过滤器链末尾自动清理**，无需手动干预 |
| **过滤器/拦截器** | 通常用拦截器做认证，容易被静态资源等绕过，覆盖不完整 | **规范使用过滤器**，在安全过滤器链中统一处理，全覆盖无死角 |
| **身份对象** | 仅存放 userId 等简单数据，无标准身份类型 | 统一使用 `Authentication` 对象，可携带权限、详细信息，与 `@PreAuthorize` 等无缝衔接 |
| **权限控制** | 需自己写注解 + 拦截器实现鉴权 | 开箱即用：`@PreAuthorize`、`hasRole()` 等声明式鉴权，支持方法级安全 |
| **异步支持** | 需引入 `InheritableThreadLocal` 或 `TransmittableThreadLocal` 手动传递 | 框架集成 `TaskDecorator` 即可自动传播 `SecurityContext` |
| **分布式** | 都需在 Feign/RestTemplate 中手动传递 JWT | 同样需传递 JWT，但配合 `spring-security-oauth2` 可配置资源服务器，验签逻辑更标准化 |
| **开发量** | 需自行维护清理、鉴权、上下文传递代码，容易出错 | 初始配置稍多，但后续**安全功能几乎零代码**，长期更简洁可靠 |

---

### Spring Security 的区别

**把“手写安全上下文 + 手动清理 + 手写鉴权”全部替换为“标准化过滤器链 + 自动生命周期管理 + 声明式权限控制”，让分布式下的上下文传递从“自行保证”变为“框架保障”。**

---

# SpringCloud中间件



# SpringCloud的组件有哪些

nacos:注册中心，配置中心

Gateway：网关

Feign：远程调用，负载均衡（这里负载均衡是采用获取实例列表，然后随机访问实现的，也可设置权重）

sentinel： 限流，熔断降级

seata：分布式事务



# 监控微服务的组件

### skywalking链路追踪工具

一个分布式系统的应用程序性能监控工具（Application PerformanceManagment），提供了完善的链路追踪能力,apache的顶级项目（前华为产品经理吴晟主导开源）

![](/imgs/SkyWalking控制面板.png)

  

打开部署好的组件控制面板可以查看**微服务的请求耗时**以及**服务的关系图**

**请求慢的服务会靠上显示，点击服务进去之后可以看到当前服务的响应耗时情况**：

例如这里是网关服务（紫色）与文章服务（绿色），最下面的是与数据库连接的，耗时最短（几乎没有）说明与数据库连接没有问题，且点击发向请求数据库的请求之后可以查看当前的SQL语句执行情况。

![](/imgs/服务响应情况.png)

打开拓**扑图**查看服务之间的调用关系

**告警栏**查看服务相应的告警信息，同时还可以绑定企业微信，钉钉等软件，服务出现异常时便会发送信息提醒开发者。

在配置文件中预先定义的告警规则总结如下：

1. 在过去10分钟的3分钟内服务平均响应时间超过1秒达3次
2. 在过去10分钟内服务成功率低于80%达2次
3. 在过去10分钟内服务90%响应时间低于1秒达3次
4. 在过去10分钟内服务的响应时间超过1秒达2次
5. 在过去10分钟内端点的响应时间超过1秒达2次







# 服务注册中心Nacos

Nacos与eureka的共同点（注册中心）

​	①都支持服务注册和服务拉取

​	② 都支持服务提供者心跳方式做健康检测

Nacos与Eureka的区别（注册中心）

​	①Nacos支持服务端主动检测提供者状态：I临时实例采用心跳模式，非临时实例采用主动检测模式

​	② 临时实例心跳不正常会被剔除，非临时实例则不会被剔除

​	③Nacos支持服务列表变更的消息推送模式，当服务发生变化Nacos会主动推送变化给消费者，服务列表更新更及时

​	④Nacos集群默认采用AP方式，当集群中存在非临时实例时，采用CP模式；Eureka采用AP方式

Nacos还支持了配置中心，eureka则只有注册中心，也是选择使用nacos的一个重要原因

>
>
>AP,CP模式核心是在说**分布式系统的 CAP 定理**，以及不同注册中心在设计上如何权衡 **可用性** 和 **一致性**。
>
>---
>
>## 1.  CAP 里的 AP 和 CP
>
>CAP 定理指出，分布式系统无法同时完美满足以下三点：
>
>- **C（一致性 Consistency）**：所有节点在同一时刻看到的数据完全一致。
>- **A（可用性 Availability）**：任何非故障节点都能在合理时间内返回响应（不报错、不超时）。
>- **P（分区容错性 Partition Tolerance）**：系统在发生网络分区（节点间通信中断）时仍能正常运行。
>
>**现实系统中 P 必须满足**（网络问题无法避免），所以只能在 C 和 A 之间做取舍：
>
>- **AP 模式**：优先保证 **可用性** 和 **分区容错性**，牺牲强一致性。  
>  发生网络分区时，系统仍然可以接受读写请求，但不同节点返回的数据可能短暂不一致（最终一致）。  
>   → **用得着的时候系统一定能响应，但不保证每次拿到的都是最新数据。**
>
>- **CP 模式**：优先保证 **一致性** 和 **分区容错性**，牺牲可用性。  
>  发生网络分区时，为了保证数据一致，系统会拒绝少数派节点的请求（或整个集群暂时不可用）。  
>   → **拿到的数据一定是最新、正确的，但在某些时刻系统可能拒绝服务。**
>
>---
>
>## 2. Nacos 集群：“默认 AP，有非临时实例时 CP”
>
>Nacos 作为注册中心和配置中心，提供了一个**混合模式**，能根据注册的实例类型动态切换。
>
>### （1）默认 AP 模式
>- Nacos 集群在没有特殊配置的情况下，优先保障 **可用性**。
>- 服务实例默认是 **临时实例（ephemeral=true）**，靠客户端心跳维持，如果心跳断了，实例会自动剔除。
>- 这些临时实例的数据通过 Nacos 自研的 Distro 协议在集群间同步。Distro 是 AP 型协议，节点间异步复制，可能各节点数据有短暂差异，但集群整体随时可用。
>- **好处**：注册中心不会因为部分节点故障或网络分区而整体挂掉，很适合微服务里大量服务实例的频繁上下线场景。
>
>### （2）遇到“非临时实例”时切换为 CP
>- **非临时实例（ephemeral=false）** 也叫持久化实例，需要主动注销才会被移除，不依赖心跳。
>- 这种实例的元数据通常需要**强一致性**存储，比如需要严格保证实例上下线状态在整个集群一致。
>- 一旦集群中注册了非临时实例，Nacos 就会自动切换到 **CP 模式**，使用 **Raft 协议**（就是上一个问题里解释的强一致性协议）来同步这些实例数据。
>- **表现**：此时如果集群发生网络分区，少数派节点可能会拒绝写入，优先保证数据不出现分歧。可用性会暂时受到影响，但换来的是实例信息的绝对准确。
>
>> 简单记：Nacos **日常是 AP**，但当你使用了需要强一致的持久化实例时，它会 **自动升级成 CP**。
>
>---
>
>## 3. Eureka 采用纯 AP 方式
>
>Eureka 是 Netflix 的服务注册中心，它的设计理念就是 **高可用 >> 强一致**。
>
>- 内部没有选举主节点，各节点平等，数据异步复制，**不保证各节点数据实时一致**。
>- 当网络分区或大量心跳丢失时，Eureka 会进入 **自我保护模式**，宁可保留旧的实例信息，也不会轻易剔除它们。这会导致消费者可能拿到已下线的服务地址，但注册中心本身始终可以读写。
>- Eureka **没有实例类型的区分**，在任何情况下都采用 AP 模式，不存在切换到 CP 的说法。
>- 这种设计更适合 Netflix 内部那种“宁可拿到错误数据也要保证系统整体响应”的场景。
>
>---
>
>## 4. 总结
>
>- **Eureka**：永远是 **AP**，追求“注册中心一定活着”，数据可能不一致。
>- **Nacos**：默认 **AP**（临时实例，高可用），但如果注册了需要强一致的**非临时实例**，就会切换到 **CP**（Raft 强一致），在一致性和可用性之间灵活取舍。
>
>这种差异也代表了两代注册中心设计思想的演进：Nacos 试图用一个组件同时满足 AP 和 CP 两种需求，而 Eureka 只保 AP 这一种。





# 负载均衡Ribbon流程

  负载均衡Ribbon，发起远程调feign就会使用Ribbon，具体流程如下：

服务通过Feign发起远程调用后，Ribbon去服务注册中心拉取服务列表，注册中心返回对应服务实例列表，Ribbon依据设定的负载均衡策略进行调用服务。

若不使用Ribbon插件，也可简单对从nacos中拉取到的服务列表进行挨个遍历实现轮询机制，或者使用随机数Randon实现随机访问。



## Ribbon负载均衡的策略

- **RoundRobinRule：简单轮询服务列表来选择服务器，依次进行调用**
- **WeightedResponseTimeRule：按照权重来选择服务器，响应时间越长，权重越小，访问频次越低**
- **RandomRule：随机选择一个可用的服务器**
- BestAvailableRule：忽略那些短路的服务器，并选择并发数较低的服务器，当前访问量低的服务器
- RetryRule：重试机制的选择逻辑，先采用轮询，当访问的服务实例为空或者宕机，便以一定频率进行重试
- AvailabiityFilteringRule：可用性敏感策略，先过滤非健康的（不稳定的或者已经宕机的，nacos注册中心检测失活），再选择连接数较小的实例
- **ZoneAvoidanceRule：以区域可用的服务器为基础进行服务器的选择。使用Zone对服务器进行分类，这个Zone可以理解为一个机房、一个机架等。而后再对Zone内的多个服务做轮询（该策略为默认策略）**

 

## 如何自定义负载均衡策略

可以自己**创建类实现IRule接口**，然后再**通过配置类或者配置文件配置即可**，通过定义IRule实现可以修改负载均衡规则，有两种方式：

1. 使用注解@Bean把自定义的负载均衡策略交给Spring管理

   该方案为**全局配置**，配置后**该服务发起的所有远程调用都会采用这个负载均衡策略进行调用**

   ```java
   @Bean
   public IRule randomRule(){
   	return new RandomRule();
   }
   ```

2. 在application.yml配置文件中配置

   该方案为**局部配置**，只有**访问userService服务时才会采用该负载均衡策略**

   ```yml
   userservice:
   	ribbon:
   		NFLoadBalancerRuleClassName:com.netflix.loadbalancer.RandomRule #负载均衡规则
   ```



# 服务雪崩问题

服务雪崩，也叫**级联故障**，是指微服务调用链中，一个基础服务不可用，导致依赖它的所有上游服务接连崩溃，最终拖垮整个系统的现象。

**简单例子：**
服务 A → 服务 B → 服务 C。如果 C 发生故障响应变慢，B 的调用线程会被阻塞占满，B 也变得不可用，接着 A 同样被拖垮，故障就像雪崩一样层层传递。

**根本原因：**
- 服务间存在**强依赖链**，同步调用缺乏保护。
- 单个服务因高负载、Bug、网络延迟等原因响应慢或宕机，调用方资源（线程池、连接池）被耗尽。

**解决方案：**

- **熔断**：下游故障时，快速失败不再调用，保护自身。

- **限流**：控制进入服务的请求量，防止过载（QPS：每秒钟请求/并发数量）

- **降级**：服务不可用时，返回兜底数据或友好提示，又叫降级处理（FallBack）降级太多可能会触发熔断示例

- **超时与重试控制**：设置合理超时时间（请求一段时间后还未得到返回结果便进行降级处理），避免无限等待，并限制重试次数（重试次数用完后走降级处理）

- **资源隔离**：对不同服务使用独立的线程池，防止一个出问题把线程池占满，影响其他服务调用

  服务A中，会远程调用服务B，C，同时服务A中线程数有限，要避免因为某个服务调用阻塞或者异常而占满A服务线程池中所有线程数，必须限制每个服务中业务的可用线程数，实现线程隔离。

  这样即便某个服务异常，也只会占用给他分配的线程额度，剩余线程池部分不受影响



## **应对方案（使用的是Sentinel）**

### 限流控制

对每秒钟访问服务的线程数量进行控制，也就是QPS，每秒钟的线程并发数量

![](/imgs/流控规则设定.png)

#### 限流控制（Nginx限流）

##### 控制请求速率

使用**漏桶算法**进行限流（可依据ip也可依据请求路径），一个固定的桶来存储请求，例如大小为10，多出的请求可以选择快速抛弃或者让他们继续等待，然后以一个固定的速率放行桶中的请求，例如每秒5个。

##### 控制并发连接数

1. 设置单个ip最多持有20个连接
2. 设置虚拟主机最多同时处理的并发连接数量



#### 限流控制（网关限流）

yml配置文件中，微服务路由设置添加局部过滤器**RequestRateLimiter**

依据**令牌桶算法**：

桶可以存储固定容量的令牌，以固定的速率去生成令牌，生成好的令牌放到桶中，桶满了则停止生成。

请求需要先到桶中申请令牌，获取到令牌后才能继续申请对应服务，没有申请到令牌的请求会被阻塞或者抛弃。

令牌桶放行请求的速度与令牌桶的令牌生成速度有关，会有波动。

>令牌存储到Redis数据库中

配置文件示例如下：

```yaml
  - id: gateway-consumer
	uri:1b://GATEWAY-CONSUMER
	predicates:
	- Path=/order/**
	filters:
	- name: RequestRateLimiter
	  args:
		#使用SpEL从容器中获取对象
		key-resolver:'#{@pathKeyResolver}"
		#令牌桶每秒填充平均速率
		redis-rate-limiter.replenishRate: 1
		#令牌桶的上限
		redis-rate-limiter.burstCapacity: 3
```

**key-resolver**：定义限流对象（ip、路径、参数），需代码实现，使用spel表达式获取
**replenishRate**：令牌桶每秒填充平均速率。
**urstCapacity**：令牌桶总容量。



### 线程隔离

使用Sentinel的界面与限流控制中的一样，但是是选中并发线程数，然后此时单击阈值中设置是可以使用的线程数量。

例如设定为5，然后QPS为2，就代表该接口每秒钟单个线程并发数为2，可使用线程数为5，这样的话该接口每秒钟的并发数就为10.

![](/imgs/线程隔离.png)



### 降级处理（FallBack）

在请求服务实例时，对于由于达到限流上限，或者服务发生异常或者是发生熔断，而调用失败的请求，若不使用降级处理，则会直接向前端抛出异常，或者是界面空白等类似效果，此时可以**采用降级处理FallBack，让这些请求服务失败的请求都去执行FallBack中的兜底逻辑**，返回**默认数据或者友好提示，保证用户体验**

首先使用的是Sentinel组件，其中**只会检测Controller中的接口会成为簇点链路资源**，我们既然使用Open Feign进行调用其他微服务模块，那也需要把哪些通过FeignClient发送请求的接口作为Sentinel中的簇点链路，从而实现对所有接口的降级处理

同时在sentinel中，使用FeignClient进行的调用会出现在对应服务的接口下面，例如在UserService的/user/pay接口中使用了PayClient调用了PayService中的支付接口/pay，使用PayClient请求的接口路径就会出现到/user/pay接口下，图示如下：

![](/imgs/Sentinel控制面板.png)



在yaml配置文件中进行如下配置即可把FeignClient发送的请求也作为簇点链路中的资源，在Sentinel控制台实现对该接口的流控规则（包括实现FallBack降级处理）

```yaml
# 将FeignClient作为Sentinel的簇点资源：
feign:
	sentinel:
		enabled: true
```



#### **FeignClient的Fallback有两种配置方式**：

- 方式一：FallbackClass，无法对远程调用的异常做处理
- 方式二：FallbackFactory，可以对远程调用的异常做处理，通常都会选择这种

方式二更加灵活，且可以在其中配置对于异常的处理，所以这里采用方式二的方式进行配置：

##### **案例如下**：

给FeignClient编写Fallback逻辑，案例UserClient的定义如下：

```java
@FeignClient(value = "userservice)
public interface UserClient {

	@GetMapping("/user/{id}")
	User findById(@PathVariable("id") Long id);
}
```

##### **步骤一**：自定义类，实现FallbackFactory，编写对某个FeignClient的fallback逻辑：

```java
@Slf4j
public class UserClientFallbackFactory implements FallbackFactory<UserClient>{
    @override
	public UserClient create(Throwable throwable) {
		//创建UserClient接口实现类，实现其中的方法，编写失败降级的处理逻辑
    	return new UserClient() {
			@override
			public User findById(Long id) { 
                // 记录异常信息，可以返回空或抛出异常 
           	 	log.error("查询用户失败"，throwable);
            	return nutl;
        	}
		};
    }
}
```

##### 步骤二：将刚刚定义的UserClientFallbackFactory注册为一个Bean：

```java
@Bean
public UserClientFallbackFactory userClientFallback(){
    return new UserClientFallbackFactory();
}
```

##### 步骤三：在UserClient接口中使用UserClientFallbackFactory：

```java
@FeignClient(value = "userservice", fallbackFactory = UserClientFallbackFactory.class)
public interface UserClient {
	@GetMapping("/user/{id}")
	User findById(@PathVariable("id") Long id);
}
```

 

### 服务熔断

熔断是解决雪崩问题的重要段。思路是由**断路器**统计服务调用的异常比例、慢请求比例，如果超出阈值则会熔断该服务。即拦截访问该服务的切请求；当服务恢复时，**断路器**会放访问该服务的请求。

主要目的是，当服务出现响应缓慢，或是出现异常，此时再往该服务发请求只会浪费不必要的资源，即便前面已经做了限流，线程隔离，降级处理，仍会产生不必要的资源请求

采用熔断的思路，发现异常比例过高，慢请求比例过高等异常信息便熔断该接口，拦截向该服务（也可以说是接口）发送的请求，同时对请求进行降级处理，走FallBack兜底逻辑。



#### 断路器原理

断路器中的状态机有三个状态Closed，Open，Half-Open

- Closed：默认状态下是该状态，此时允许所有请求通过断路器，但是会依据设定的规则统计请求的响应情况，当异常比例，慢请求比例过高或者达到设定阈值时，便会转变为Open状态
- Open：此时对接口进行熔断，所有请求拦截不让通过，让他们走定义好的FallBack逻辑避免造成雪崩 ，熔断时间也是依据设定时长为准，该状态为临时状态，熔断时间结束后转换为Half-Open状态
- Half-Open：此时熔断时间刚结束，断路器会尝试放行部分请求，若是服务器仍然响应失败或者请求状态异常，便继续转变为Open状态进行熔断。
- 直到Half-Open放行请求正常被响应，才结束熔断。

##### 配置方式

同样要在yaml配置文件中开启对FeignClient发起的请求的监控，让他成为Sentinel中的簇点链路，以实现对对应接口的各种流控配置。

![](/imgs/熔断配置.png)



# 分布式系统理论



## CAP原理

1998年，加州大学的计算机科学家EricBreWer提出，分布式系统有三个指标：

-  Consistency(一致性)
- Availability（可用性）
- Partition tolerance (分区容错性）

Eric Brewer说，**分布式系统无法同时满足这三个指标**。这个**结论就叫做CAP 定理**。分布式系统通过网络链接，一定存在分区问题，当某个节点网络出现问题，此时系统的一致性与可用性便无法同时满足。



### CAP定理-Consistency

Consistency（一致性）：用户访问分布式系统中的任意节点，得到的数据必须一致



### CAP定理-Availability

Availabiity（可用性）：用户访问集群中的任意健康节点，**必须能得到响应**，而不是超时或拒绝



### CAP定理-Partition tolerance

**Partition（分区）**：因为网络故障或其它原因导致分布式系统中的**部分节点与其它节点失去连接**，**形成独立分区**。

**Tolerance（容错）**：在集群出现分区时，整个系统也要持续对外提供服务

断开网络链接后，形成了分区，某个节点发生数据修改时，数据变化无法同步到其他节点，所以**无法实现数据一致性**。

如果要实现数据一致性，则需要让访问未完成数据同步的节点的请求进行等待，等该节点完成数据同步后，再进行响应。这样就**无法满足可用性**



## AP和CP

1. 分布式系统节点之间肯定是需要网络连接的，分区（P）是必然存在的
2. 如果保证访问的高可用性（A），可以持续对外提供服务，但不能保证数据的强一致性-->AP
3. 如果保证访问的数据强一致性（C），就要放弃高可用性-->CP



## BASE理论

BASE理论是对CAP的一种解决思路，包含三个思想：

1. BasicallyAvailable（基本可用）：分布式系统在出现故障时，允许**损失部分可用性**，即保证核心可用。
2. SoftState（软状态）：在一定时间内，允许出现中间状态，比如**临时的不一致状态**。
3. EventuallyConsistent（最终一致性）：虽然无法保证强一致性，但是在软状态结束后，**最终达到数据一致**。



# 分布式事务的解决方案

## Seata框架解决

Seata事务管理中有三个重要的角色：

1. **TC(TransactionCoordinator）-事务协调者：**维护全局和分支事务的状态，协调（决定）全局事务提交或回滚。
2. **TM(TransactionManager）事务管理器：**定义**全局事务的范围**、开始全局事务、提交或回滚全局事务。
3. **RM(ResourceManager)-资源管理器：**管理分支事务处理的资源，与**TC交谈以注册分支事务和报告分支事务的状态**，并驱动分支事务提交或回滚。



### TC，TM，RM相互关系如下:

每一个微服务模块都是一个**RM（资源管理器）**，当项目启动时，RM会注册到**TC（事务协调器中）**，**TM（事务管理器）**负责管理事务的范围，包括哪几个**RM（资源管理器）**，以及事务的起始位置，结束位置在哪，**TC（事务管理器）**依据TM（事务管理器）的范围中的RM（资源管理器）的完成状态来决定**事务是否需要进行提交**

1. **业务执行与状态汇报**：在`TM`发起全局事务后，各个`RM`会执行本地事务并向`TC`注册和汇报状态。
2. **TM发起最终决议**：业务方（`TM`端）在得知所有服务调用成功后，会调用 `GlobalTransaction.commit()` 方法，向 `TC` 发送一个全局提交的请求。
3. **TC判断并执行提交**：
   - `TC`收到`TM`的提交请求后，会检查该全局事务下所有`RM`的状态。
   - 确认所有`RM`都成功后，`TC`会**直接**向各个`RM`发送“分支提交 (Branch Commit)”指令。这个过程是完全由`TC`驱动的。
   - `RM`收到指令后执行清理操作（如删除`undo_log`），完成二阶段提交。



### Seata的XA模式（强一致）

对应与CP模式，保证数据的强一致性。

**RM一阶段的工作**：

1.  注册分支事务到TC
2.  执行分支业务sql但不提交
3.  报告执行状态到TC

**TM工作：**

1. 设定全局事务的起始位置与结束位置，以及包含哪几个RM
2. 当所有的RM都执行完毕后，向TC发送提交请求，由TC进行判断是否进行提交

**TC二阶段工作：**

- TC检测各分支事务执行状态
  - 如果都成功，通知所有RM提交事务
  - 如果有失败，通知所有RM回滚事务

**RM二阶段的工作：**

- 接收TC指令，提交或回滚事务

执行过程中当TM中的所有RM都完成了各自的业务逻辑（完成但是先不提交，等待所有事务都完成TC也检查无误，发来提交命令再提交），TM会向TC发送一个事务提交的请求，此时TC再去检查全局事务中的各个RM是否执行成功，成功则向各个RM发送分支提交命令。

**XA模式保证强一致性导致性能不好**：主要是因为单个事务分支RM在执行完毕后，要等待同属于一个全局事务的其他RM（分支事务）完成，才能确定是否需要提交，在全部完成之前，各个分支事务都需要进行互相等待，同时其他线程是无法进行操作相关的数据的，所以 



### Seata的AT模式（最终一致）

AT模式同样是分阶段提交的事务模型，不过缺弥补了XA模型中资源锁定周期过长的缺陷。

**阶段一RM工作：**

- 注册分支事务
- 记录undo-log（数据快照)
- **执行业务sql并提交**
- 报告事务状态

**阶段二RM工作：**

- 此时若是要执行提交代表业务都成功，删除undo-log
- 若是执行回滚操作代表业务失败，依据undo-log恢复数据到更新前

**AT模式可用性高，性能较好但是数据可能短暂不一致**：RM执行完后直接提交，不需要等待其他事务全部完成，数据更新快但是若是其中某个RM有误，TC会命令所有RM进行回滚操作，若在回滚之前就有线程读取数据，会造成短暂数据不一致，但是最终一致。



### Seata的TCC模式

你总结的三个阶段很准确。TCC 的本质，就是把一个完整的业务操作，拆分成资源预留、确认提交、取消释放这三个步骤，由业务代码自行实现。

结合 Seata 的 TCC 模式，整个流程是这样的：

### 1. 一阶段 Try：资源检测与预留
在 TCC 里，一阶段就已经是业务操作了，但**只是冻结资源，不真正消耗**。

比如一个转账操作，Try 阶段要做的不是直接扣钱，而是做两件事：
- **业务检查**：检查账户是否存在、余额是否足够。
- **资源预留**：冻结转账金额（比如把 100 元从“可用余额”移到“冻结余额”），让这笔钱暂时不能被其他交易用掉。

这个阶段的目的是确保后续有资源可以操作，并把临时状态留给二阶段处理。

### 2. 二阶段 Confirm：完成资源操作
如果所有 Try 都成功，TC（事务协调器）收到 TM 的提交决议后，会驱动各个 RM 执行 Confirm。

Confirm 要做的是**把预留的资源真正消耗掉**。在转账例子里，就是把“冻结余额”里的 100 元扣掉，完成真正的扣款。

这里有个核心设计原则：**只要 Try 成功，Confirm 就一定要能成功**。也就是说，Confirm 阶段不能有任何业务校验，只做纯粹的、必定成功的提交操作。

### 3. 二阶段 Cancel：释放预留资源
如果某个 Try 失败，或者 TM 决定回滚，TC 就会驱动所有 RM 执行 Cancel。

Cancel 是 **Try 的反向操作**，作用是释放之前预留的资源。转账例子里，就是把“冻结余额”的 100 元恢复成“可用余额”。

### 架构中的执行流程（以 Seata 为例）
和前面聊的 AT 模式类似，整个过程由**TM 决议 + TC 调度 + RM 执行**协作完成：

- **TM**：业务代码通过 `@GlobalTransactional` 发起全局事务，最终调用 `commit()` 或 `rollback()` 给 TC 发决议。
- **TC**：收到 TM 决议后，**直接向各个 RM 下发二阶段指令**（Confirm 或 Cancel）。因为 TCC 的二阶段逻辑是业务自定义的，Seata 框架会调用你实现的 `commit` 和 `rollback` 方法。
- **RM**：执行你定义的 `Try`、`Confirm`、`Cancel` 方法，并向 TC 汇报状态。

### 实现时必须处理的三个关键问题
因为 TCC 把业务分成了多个阶段，运行在分布式环境中，所以你的 `Confirm` 和 `Cancel` 接口必须做好以下几点：

- **允许空回滚**：可能 Try 请求还没执行，Cancel 就先到了（比如网络超时，TC 提前触发回滚）。这时 `Cancel` 要能识别出没有需要释放的资源，直接返回成功，不能报错。
- **防悬挂控制**：当空回滚发生后，又被重试的 Try 请求到达，不能让它再预留资源。需要能识别出“已经回滚过，不要再执行 Try”。
- **幂等控制**：`Confirm` 和 `Cancel` 可能被重复调用，必须保证多次执行的结果与一次相同，不能重复扣款或重复释放。

简单来说，TCC 模式把分布式事务的控制权交给了你的业务代码，性能比 AT 模式高（锁资源的时间更短），但开发成本也更高。如果你想看看具体代码怎么写，或者比较 TCC 和 AT 的适用场景，我可以展开再说说。



### MQ解决分布式事务







# RabbitMQ

先回顾RabbitMQ的流程：

生产者（publisher）发送消息到交换机（exchange），交换机（exchange）把消息（message）转发给对应的队列（queue），消费者（consumer）监听的队列（queue）中有消息便进行消费消息

**Spring AMQP**
Spring AMQP 是 Spring 官方提供的对 AMQP（高级消息队列协议）的支持项目，核心是对 RabbitMQ 的**高层抽象和封装**。它提供了 `RabbitTemplate`（发送消息）、`RabbitListener`（接收消息）、连接工厂自动配置等功能，让你用声明式、模板化的方式操作 RabbitMQ，无需手动管理 Channel、连接、确认等底层细节。简单说，它就是 **Spring 生态中简化 RabbitMQ 开发的框架**。



在消息队列（如 RabbitMQ）中，**Broker** 就是**消息代理服务器**，可以理解为**消息的中转站**。

具体职责：
- 接收生产者发来的消息。
- 根据路由规则把消息分发到对应的队列里。
- 确保消息按规则持久化、投递给消费者，并提供确认回执（如 `ack` / `nack`）。
- 管理交换器、队列、绑定等逻辑。

简单说，你在代码里连接 RabbitMQ 时填写的 **IP + 端口**（如 `localhost:5672`）指向的那个服务，就是 Broker。它负责消息的接收、存储和转发，是整个消息系统的核心枢纽。



## 保证消息不丢失 

首先就是**消费者可能发送消息过程中丢失**，然后就是**没有进行持久化，消息会消失**，最后则是**消费者也可能导致消息丢失**

## 一、生产者发送消息过程中丢失

### 生产者确认机制
RabbitMQ提供了publisher confirm机制来避免消息发送到MQ过程中丢失。消息发送到MQ以后，会返回一个结果给发送者，表示消息是否处理成功，依据返回值判断



**判断依据**  
消息发送后，Broker 会通过 `basic.ack` 或 `basic.nack` 回执生产者。在 Spring AMQP 中，`ConfirmCallback` 的 `ack` 参数直接反映结果：  

- `ack = true`：消息成功到达交换机，并根据路由规则至少入队到一个队列中。  
- `ack = false`：失败，通常原因是交换机不存在、路由不可达、队列已满或被拒绝等。`cause` 会包含失败原因描述。



### 消息失败之后如何处理：

- 回调方法即时重发
- 记录日志
- 保存到数据库然后定时重发，成功发送后即刻删除表中的数据
- **即时重试**：根据业务容忍度，可立即重发 1～2 次（需有最大次数限制，避免死循环）。  
- **记录与告警**：将失败消息、原因持久化到日志或数据库，并触发告警通知。  
- **异步补偿**：若多次重试仍失败，可将消息写入本地失败表，由定时任务扫描重发，或转人工处理。  
- **保证幂等**：重发时消息体需携带业务唯一 ID，避免重复消费。  

关键原则：确认失败不代表消息绝对丢失（可能只是交换机未达），但必须把失败当作“可能丢失”处理，采取可靠兜底。



## 二、未开启消息持久化

### 开启消息持久化

在 RabbitMQ 中，**消息持久化**是指将消息保存到磁盘，让它在 Broker 重启后依然存在，避免因宕机导致数据丢失。

---

### 为什么需要持久化？
默认情况下，RabbitMQ 把消息存放在内存中，重启后所有未消费的消息都会丢失。对一些关键业务（订单、支付通知等），必须保证消息不因故障而消失，持久化就是为此而生。

---

### 如何保证持久化？
需要**同时满足三个条件**才能保证消息在 Broker 重启后不丢失：

| 环节             | 设置方法                                                     | 作用                                     |
| ---------------- | ------------------------------------------------------------ | ---------------------------------------- |
| **队列持久化**   | `channel.queueDeclare(QUEUE_NAME, durable=true, …)`          | 队列元数据存盘，重启后队列依然存在       |
| **消息持久化**   | 发消息时设置 `MessageProperties.PERSISTENT_TEXT_PLAIN`       | 把消息体标记为持久化，让 Broker 写入磁盘 |
| **交换机持久化** | `channel.exchangeDeclare(EXCHANGE_NAME, "direct", durable=true)` | 保证交换机信息在重启后恢复               |

**三个缺一不可**：如果队列持久化但消息未持久化，重启后队列是空的；如果消息持久化但队列不是持久的，重启后队列消失，消息自然也丢了。

---

### 工作原理简述
标记为持久化的消息到达队列后，RabbitMQ 会把它放入持久化日志中，尽快写入磁盘（可以配置写入策略，通常异步批量落盘）。重启时从磁盘重放这些日志来重建队列状态。

---

### 性能注意
持久化会带来磁盘 I/O，因此吞吐量会略低于非持久化消息。常规优化是**批量发送、适当调大落盘间隔**，或只在关键业务上开启持久化。

总结：**持久化 = 防重启丢消息，靠队列、交换机、消息自身的持久化属性共同完成**。

MQ默认是内存存储消息，开启持久化功能可以把消息存储到磁盘，确保缓存在MQ中的消息不丢失。

#### 交换机持久化

```java
@Bean
public DirectExchange simpleExchange(){
// 三个参数：交换机名称、是否持久化、当没有queue与其绑定时是否自动删除
    return new DirectExchange("'simple.direct", true, false);
}
```



#### 队列持久化

```java
@Bean
public Queue simpleQueue(){
// 使用QueueBuilder构建队列，durable就是持久化的
return QueueBuilder.durable("'simple.queue").build();
}
```



#### 消息持久化

消息持久化，SpringAMQP中的的消息默认是持久的，可以通过MessageProperties中的DeliveryMode来指定

```java
Message msg = MessageBuilder
.withBody(message·getBytes(StandardCharsets.UTF_8)) // 消体体
    .setDeliveryMode(MessageDeliveryMode.PERSIsTENT) // 持久化
    .build();
```



## 三、消费者造成消息丢失

消费者导致消息丢失通常由**消息确认方式不当**或**消费端异常处理不足**引起，主要场景如下：

---

### 1. 自动确认模式（`autoAck=true`）
- **丢失原因**：消费者从队列取出消息后，Broker 立即认为消息已处理完成并**立即删除**。若消费者随后处理过程中宕机或发生异常，消息已经从队列中消失，无法恢复。
- **典型场景**：消费者执行过程中进程崩溃、网络断开，但消息已被 Broker 删除。

### 2. 手动确认模式下主动拒绝且不重回队列
- **丢失原因**：消费者收到消息后，调用 `basic.reject` 或 `basic.nack`，并将 `requeue` 参数设为 `false`，Broker 会直接**删除**该消息，不重新入队。
- **典型场景**：业务逻辑判断某消息无法处理（如格式错误），故意丢弃，但若处理不当（比如误判）就会丢失有效消息。

### 3. 消费者长时间未确认导致连接断开
- **丢失原因**：手动确认模式下，消费者处理消息耗时超过**连接超时时间**或**消费者进程崩溃**，连接关闭。如果消息预取数量较多（`prefetch`），所有未确认的消息会**重新排队**（通常不丢）。但如果此时队列设置了**消息 TTL** 且消息已过期，则会被 Broker 移除导致丢失。

### 4. 队列溢出或消息过期
- **丢失原因**：消费者**消费过慢**，队列堆积达到最大长度或消息存活时间到期，后续进入队列的消息会被 Broker 按策略**丢弃**（`overflow` 设置为 `reject-publish` 或 `drop-head`）。这不完全是消费者代码直接导致，但根因是消费能力不足。

---

### 如何避免消费者侧丢失？
- **关闭自动确认**：设置 `autoAck=false`，改为手动确认（`channel.basicAck`），确保处理成功后再确认。
- **拒绝时务必重回队列**：除非确需丢弃，否则 `requeue=true`。
- **做好异常处理**：`catch` 住处理逻辑，异常时发送 `nack` 并 `requeue=true`。
- **设置合理的预取值**：避免消费者取走太多消息而处理不来，导致连接超时或大量重入队。
- **配合死信队列**：对反复消费失败的消息，转入死信队列人工干预，避免无限循环或丢弃。
- **监控队列深度和消费者状态**：及时发现处理缓慢或异常的情况。

总结：消费者导致消息丢失的主因是**自动确认下的异常崩溃**和**主动拒绝不回队**，其他都是间接由消费能力不足触发。核心解决思路是**转为手动确认 + 异常兜底 + 死信备份**。



RabbitMQ支持消费者确认机制，即：消费者处理消息后可以向MQ发送ack回执，MQ收到ack回执后才会删除该消息。而SpringAMQP则允许配置三种确认模式：

- manual：手动ack，需要在业务代码结束后，调用api发送ack。
- auto：自动ack，**由spring监测listener代码是否出现异常，没有异常则返回ack；抛出异常则返回**
- nacknone：关闭ack，MQ假定消费者获取消息后会成功处理，因此消息投递后立即被删除

---

**一般采用第二种方法，但是若是消费者接受消息失败，则进行预定好的重试机制**：

我们可以利用Spring的retry机制，在消费者出现异常时利用本地重试，设置重试次数，当次数达到了以后，如果消息依然失败，将消息投递到异常交换机，交由人工处理



## 消息重复消费

 首先，消费者有消费确认，如果在消费者已经消费完数据，在给Spring返回消息消费确认信息ack的时候，网络抖动或者消费者宕机，导致Spring没有收到消费确认的消息ack，误以为消费者还没有消费当前消息，所以造成了消息重复消费。

### 解决方案

- 使用每条消息中的一个唯一的标识id，作为消息是否被消费的标志
- 幂等方案：【分布式锁、数据库锁（悲观锁、乐观锁）】，但是造成性能变低





## 消息堆积

- 当生产者发送消息的速度超过了消费者处理消息的速度，就会导致队列中的消息堆积，
- 直到队列存储消息达到上限。之后发送的消息就会成为死信，可能会被丢弃，
- 这就是消息堆积问题

解决消息堆积有三种种思路：

1.  增加更多消费者，提高消费速度

2.  在消费者内开启线程池加快消息处理速度

   - 采用多线程提高处理速度，但是要依据Cpu硬件情况，设计合理的线程池大小

3.  扩大队列容积，提高堆积上限

   1. 采用RabbitMQ中的惰性队列

   2. 惰性队列的特征如下：

      - 接收到消息后直接存入磁盘而非内存，普通队列是把消息存到内存中，所以存储量不大

      - 消费者要消费消息时才会从磁盘中读取并加载到内存

      -  支持数百万条的消息存储

      - ```java
        @Bean
        public Queue lazyQueue(){
        return QueueBuilder
        		.durable("lazy.queue")
        		.Lazy() // 开启x-queue-mode为lazy
        		.build();
        }
        ```

        





## 延迟队列（死信交换机）

延迟队列 = 死信交换机+TTL（消息生存时间）：延迟队列指的是进入队列的消息会延迟消费，一般例如优惠卷，下单，定时发布等具有时间限制的场景会用到



### 死信交换机

正常流程是：生产者发送消息 ==> 交换机接受消息 ===> 队列接受消息 ===> 消费者消费消息

**死信：**消息由于某种原因，后续不会再被消费的消息，可能会被直接丢弃

1. 消费者使用basic.reject拒绝接受或basic.nack声明消费失败，并且消息的requeue参数设置为false

   > ### `requeue` 参数的含义
   >
   > - **`requeue = true`**
   >   消息会被 Broker **重新放回原队列的头部**，稍后会再次推送给（可能相同的）消费者。
   >   效果：如果消费者每次都失败且返回 `requeue=true`，就会形成**死循环**，消息永远在队列和消费者之间往返。
   > - **`requeue = false`**
   >   消息**不会**重新入队，而是被 Broker 丢弃（或进入死信队列，如果配置了死信交换器 DLX）。
   >   使用场景：消息格式错误、无法处理的内容、已达重试上限等，需要将其移走以免阻塞队列。
   >
   > ###  这算“消息重试”吗？
   >
   > 严格来说**不是**。`requeue` 是“重新排队”，不是主动的“重试机制”。
   > 区别在于：
   >
   > - `requeue=true` 只是把消息放回队列，消息会按正常流程再次被**任意**消费者获取。没有次数限制，没有延迟，也不感知失败原因。
   > - 真正的“消息重试”通常需要**消费者自己实现**（例如配合死信队列 + 延迟队列，或消费端记录重试次数，达到上限后 `requeue=false`）。Spring AMQP 的 `RetryTemplate` 或在 RabbitMQ 中配置 `x-dead-letter-exchange` 等都属于这类高级重试策略。
   >
   > ### 总结
   >
   > `basic.reject` / `basic.nack` 是消费者**主动拒绝消息**的方法，`requeue` 参数仅控制**是否让消息重回队列**。
   > 设置 `requeue=false` 能有效丢弃或转入死信队列，避免无限重试；而 `requeue=true` 仅简单重新排队，易引发循环，一般不直接用于业务重试。
   >
   > 

2. 消息是一个过期消息，超时无人消费

3. 要投递的队列消息堆积满了，最早的消息可能成为死信

如果该队列配置了**dead-letter-exchange属性**，指定了一个**交换机**是死信交换机，那么队列中的**死信就会投递到这个交换机**中，而这个交换机称为**死信交换机**（Dead Letter Exchange，简称DLX）

后续该死信交换机也可绑定一个自己的队列（同时原队列在指定死信交换机的同时除了dead-letter-exchange = dead.direct指定死信交换机时，还需要设置属性dead-letter-routing-key = deadqueue（符合binding key值为deadqueue的队列）指定把消息发送给哪个消息队列），称为**死信队列**，再执行消费者进行消费也可以。

> 流程是：
> 1. 绑定队列到交换机时，指定一个 `key`（比如 `order.create`），队列说：“我收这个 `key` 的消息”。
> 2. 发消息时，生产者指定一个 `key`，交换机对比它与绑定的 `key`，匹配就投递。
>
> **这个流程里涉及了两个“key”，就是 Routing Key 和 Binding Key。**  
> 你记忆中的“交换机传来的 key”其实是 **Routing Key**，而“队列绑定时指定的 key”是 **Binding Key**。
>
> ---
>
> ### 两者在 Direct 交换机下完全一致
> 如果用的是 **Direct 交换机**（默认），逻辑就是**完全相等才投递**。  
> 例如：
> - 绑定：队列 A 使用 `Binding Key = "error"` 绑定到 Direct 交换机。
> - 发送：生产者发送消息时，指定 `Routing Key = "error"`。
> - 结果：交换机发现 Routing Key == Binding Key，投递到队列 A。
>
> **这时你可以认为 Routing Key 和 Binding Key 是同一个值**，只是叫法不同。  
> 事实上很多教程在 Direct 模式下也直接说“队列绑定一个 routing key”，因为两者确实相等。
>
> ---
>
> ### 什么时候它们“不同”？
> 当使用 **Topic 交换机** 或 **Headers 交换机** 时，匹配规则不再是简单相等：
>
> - **Topic 交换机**：Binding Key 可以是通配符（如 `order.#`），Routing Key 是生产者发出的具体值（如 `order.create.2024`）。  
>   这时 Binding Key 是 **匹配模板**，Routing Key 是 **待匹配的字符串**，显然不是同一个东西。
>
> - **Headers 交换机**：根本不看 Routing Key，只看消息头，两者完全脱离关系。
>
> ---
>
> ### 总结
> - **Routing Key**：生产者发送消息时指定的“目的地标签”。
> - **Binding Key**：队列绑定到交换机时指定的“接收兴趣”。
>
> 在 **Direct 交换机**下，它们必须相同才会投递，所以你可以理解为“绑定时的 key 就是将来消息带来的 key”，两者一致。  
> 在 **Topic/Fanout/Headers** 交换机下，它们就可能相同、部分相同或无关。
>
> 所以你的记忆没错，只是它默认了 Direct 交换机场景，且把两个名字混成了一个。实际开发中，这两个是分开配置的参数，分别由生产者和消费者设定。
>
> ---
>
> ### 1. 死信交换机（DLX）与死信队列（DLQ）
> - **死信交换机（DLX）**：就是一个普通的交换机，只是被某个队列通过 `x-dead-letter-exchange` 参数指定为“死信接收者”。当该队列中的消息变为死信时，Broker 会自动将其投递到这个交换机。
> - **死信队列（DLQ）**：绑定到死信交换机上的普通队列，用于最终存储死信消息，供后续消费或人工处理。
>
> 所以，交换机本身不叫“死信队列”，**队列才是存储死信的地方**。你的描述中“称为死信队列”是对的，但需明确是先有 DLX（交换机），再有 DLQ（队列），两者是分开的两个资源。
>
> ---
>
> ### 2. 提到的配置是否准确？
> 你提到：
> > 需要设置属性 `dead-letter-routing-key = deadqueue` 指定死信队列
>
> 这里有**术语混淆**：`dead-letter-routing-key` 设置的**不是死信队列的名字，而是死信消息投递到 （死信交换机）DLX 时使用的 Routing Key**。  
> 这个 Routing Key 要和 **DLX(死信交换机) 与 DLQ（死信队列） 之间的 Binding Key** 匹配，消息才能准确路由到目标死信队列。  
> 它不是直接“指定死信队列”，而是通过**交换机路由规则**间接指定。
>
> **正确配置逻辑（以 Java 举例）：**
> - 声明 DLX 和 DLQ：
>   ```java
>   channel.exchangeDeclare("dlx.exchange", "direct");
>   channel.queueDeclare("dlq.queue", true, false, false, null);
>   channel.queueBind("dlq.queue", "dlx.exchange", "dead-letter");
>   ```
> - 原队列声明时设置死信参数：
>   ```java
>   Map<String, Object> args = new HashMap<>();
>   args.put("x-dead-letter-exchange", "dlx.exchange");   // 指定 DLX
>   args.put("x-dead-letter-routing-key", "dead-letter"); // 指定投递到 DLX 时的 routing key
>   channel.queueDeclare("original.queue", true, false, false, args);
>   ```
>   当原队列产生死信，Broker 会把它发送到 `dlx.exchange`，routing key 为 `dead-letter`，从而路由到 `dlq.queue`。
>
> ---
>
> ### 3. 总结
> 你的描述整体流程没错，但：
> - **“设置死信队列”的说法不严谨**：`dead-letter-routing-key` 并不是队列名，而是路由键。即为交换机与队列绑定时指定的binding-key
> - **死信交换机和死信队列是两个资源**，交换机负责路由，队列负责存储。
>
> `x-dead-letter-routing-key = deadqueue` 中的 `deadqueue` 是**消息被重定向时自动附加的 Routing Key**，它必须与死信交换机到死信队列的 **Binding Key** 匹配（假设死信交换机是 direct 或 topic 类型），消息才能进入死信队列。
> 如果你把死信队列绑定到死信交换机时使用的 Binding Key 也是 `deadqueue`，那刚好对应上，但配置时仍需分别设定



### TTL

TTL，也就是Time-To-Live。如果一个队列中的消息TTL结束仍未消费，则会变为死信，ttl超时分为两种情况：

-  消息所在的队列设置了存活时间
- 消息本身设置了存活时间
- 两者取最短的为准

设定方式：

1. 通过定义队列或者发送消息时指定，若同时指定，则取二者中最短的为准
2. 使用**安装在RabbitMQ中的DelayExchange插件**来指定
   - 声明一个交换机，添加delayed属性为true
   -  发送消息时，添加x-delay头，值为超时时间



## 死信队列





## 高可用机制

### 普通集群

普通集群，或者叫标准集群（classiccluster），具备下列特征：

- 会在集群的各个节点间共享部分数据，包括：交换机、队列元信息。不包含队列中的消息。同时节点中还包含其他节点的引用，当消息访问的节点不具备所对应的队列时，就通过引用去找对应的队列
- 当访问集群某节点时，如果队列不在该节点，会从数据所在节点传递到当前节点并返回，
- 队列所在节点宕机，队列中的消息就会丢失

<img src="/imgs/MQ普通集群.png" style="zoom:100%;" />



### 镜像集群

镜像集群：本质是主从模式，具备下面的特征：

1. 交换机、队列、队列中的消息会在各个mq的镜像节点之间同步备份。
2. 创建队列的节点被称为该队列的主节点，备份到的其它节点叫做该队列的镜像节点。
3. 一个队列的主节点可能是另一个队列的镜像节点
4. 所有操作都是主节点完成，然后同步给镜像节点
5. 主岩机后，镜像节点会替代成新的主节点
6. 可能会出现主节点数据更新，未来得及同步给镜像节点就宕机，造成数据不一致，解决的话可以采用**仲裁队列**处理

![](/imgs/MQ镜像集群.png)

缺点：

- 镜像间复制往往是异步的，可能出现消息在主节点确认，但镜像节点还未复制完成时主节点崩溃，导致**消息丢失**。
- 网络分区（脑裂）时，可能多节点同时认为自己是主，造成**数据不一致**。
- 无成熟的选主和恢复机制，运维复杂



### 仲裁队列（镜像集群的一种）

仲裁队列：仲裁队列是3.8版本以后才有的新功能，用来替代镜像队列，具备下列特征： 

- 与镜像队列一样，都是主从模式，支持主从数据同步
- 主从同步基于Raft协议，强一致

```java
@Bean
public Queue quorumQueue(){ 
return QueueBuilder
		.build();
		.durable("quorum。queue"）// 持久化
		·quorum()// 仲裁队列
}
```



###  在仲裁队列中，Raft 如何运作

RabbitMQ 的仲裁队列底层基于一个 Raft 状态机，每个队列成员节点（主、从）都运行 Raft 实例。

- **角色对应**
  - 队列的 **主节点** = Raft 的 **领导者 (Leader)**
  - 队列的 **从节点** = Raft 的 **跟随者 (Follower)**
- **写入一条消息的完整过程**
  1. **客户端发消息到 Leader**。
  2. Leader 将这条消息作为一个 Raft 日志条目追加到本地日志。
  3. Leader **并行的**将该日志条目发送给所有 Follower，要求它们复制。
  4. 当 Leader 收到 **超过半数（多数派）** Follower 的确认后，这条日志被标记为“已提交”。
  5. Leader 应用这条日志（消息真正入队，并可被消费）。
  6. Leader 向客户端返回“写入成功”，同时会异步通知剩余 Follower 提交该条目。
- **强一致性的保证**
  正是因为“必须多数节点确认才算成功”，所以：
  - 哪怕 Leader 立刻宕机，剩余节点中**必然有至少一个节点**拥有这条已提交的日志。
  - 紧接着 Raft 会发起新的选举，而选举规则会**阻止**日志不够新的节点成为 Leader（只有拥有全部已提交日志的节点才能当选）。
  - 新 Leader 会继续将这条日志复制到其他落后节点，保证数据不丢。
    这就实现了 **数据一旦确认，就永久存在且全局可见**。
- **读操作（消费消息）**
  在仲裁队列中，默认也是通过 Leader 进行消费，这样可以天然读到最新已提交数据。如果需要更高的读一致性，可以通过特殊配置实现线性一致读（需要 Leader 确认自己仍是 Leader 后再响应）。



# 分布式服务的接口幂等性设计

描述的是**同一个操作，执行一次和执行多次，对系统产生的影响是完全相同的**。

- 网络波动，用户反复点击多次，发送了多次请求
- MQ中的消息被重复消费
- 失败重试机制中发送了多次请求

在单体应用中，可以靠数据库事务来保证操作的原子性。但在分布式服务里，以下场景几乎无法避免，它们都会导致**同一个请求被执行多次**：

- **网络不可靠与客户端重试**：服务调用超时，客户端收到的响应可能只是“网络超时”，但服务端实际已处理成功。客户端通常会自动重试，导致请求重复。
- **消息队列的“至少一次投递”**：为保证消息不丢，MQ 通常保证至少成功投递一次。这就意味着，消费者可能会拉取到同一条消息并处理多次。
- **分布式事务中的重试与回滚**：比如之前提到的 TCC 模式，事务协调器（TC）为了保证最终一致性，可能会多次向下游服务发送 `Confirm` 或 `Cancel` 指令。

如果接口不具备幂等性，这些重试就会造成灾难：**用户重复下单、库存反复扣减、账户被多次扣款**。

判断幂等性，核心是看接口**是否改变了业务状态，以及这种改变是否可重复**。

- **天然幂等的操作**：`查询`（如 `SELECT`）、`删除`（`DELETE`，删除一条已删的数据，结果仍是已删）、`修改为固定值`（`UPDATE SET status = 10 WHERE id = 1`，执行多次结果都是10）。
- **非幂等的操作**：`新增`（`INSERT`，会重复插入多条数据）、`增量修改`（`UPDATE SET count = count + 1`，执行一次加1，两次加2）。

幂等性设计的本质，就是**通过技术手段，把非幂等的操作，变成幂等的**。



## 实现幂等性的常见设计方法

设计方法，就是给每个业务操作，找一个不会改变的“身份证”：

1. **唯一键约束（最可靠）**
   利用数据库的唯一索引，强行保证某个业务单据只能有一条记录。比如创建订单时，把“订单号”设为唯一键，重复 `INSERT` 会直接报错，业务捕获后返回成功即可。
2. **Token 机制（防重复提交）**
   先向服务端申请一个操作令牌（Token），提交业务时必须带上。服务端检查并删除令牌，如果删除失败（说明令牌已被用过），就判定为重复请求。适合点击按钮、提交表单等场景。
3. **状态机约束**
   把业务单的状态流转设计成有限状态机。比如订单状态从“待支付”到“已支付”，更新时附带条件 `WHERE status = '待支付'`。重复的支付回调，会因为状态已不再是“待支付”而无法更新，从而保证幂等。
4. **全局唯一 ID + 本地记录表**
   为每次请求生成全局唯一 ID（如 `requestId`），业务处理前先写入一张去重表并加唯一约束，或写入 Redis 设置过期时间。一旦发现该 ID 已处理过，直接返回成功。这是最通用的解耦方案。



## 接口幂等

基于RESTfuIAPI的角度对部分常见类型请求的幂等性特点进行分析：

| 请求方式 | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| GET      | 查询操作，天然幂等                                           |
| POST     | 新增操作，请求一次与请求多次造成的结果不同，不是幂等的       |
| PUT      | 更新操作，如果是以绝对值更新，则是幂等的。如果是通过增量的方式更新，则不是幂等的 |
| DELETE   | 删除操作，根据唯一值删除，是幂等的                           |

1. 数据库设置唯一索引
2. Redis + token：判断请求中是否带有token，第一次请求带有token，执行完业务后，把存在Redis中的token删除，后续再次请求时Redis中没有token，便不会执行，保证了幂等性
3. 使用分布式锁进行加锁处理即可
4. **新增采用数据库唯一索引，新增或者修改，分布式锁性能较差，token+redis性能好响应快**



# 分布式任务调度



---


# ，微服务拆分流程
首先由单模块拆分为各个小模块，例如购物车，用户，支付模块，然后对于各模块之间的相互调用，由之前的直接注入Bean，通过动态代理调用Service模块实现对相邻模块的调用改为，使用OpenFeign来实现不同模块之间的相互调用，（本质是通过发送Http请求请求对应模块的Controller层来实现相应需求，创建对应模块的接口XXXClient，内部定义需要的功能方法，定义方式与Controller中一致），然后使用alibaba的nacos作为服务注册中心，同一模块可以有多个实例，使用loadbalancer来实现负载均衡（对于不同服务实例的优先级进行设置，对请求进行分流，减轻单个服务器的压力），okhttp实现连接池功能，（提前创建好多个请求实例，后续不需再次创建进行复用，节省资源，提高请求速度），对于登录方式的校验，通过定义一个网关模块，配置基础请求路径实现对其他微服务路径的请求转发，同时内部定义过滤器，实现对请求路径的拦截与放行以及对token的解析，然后在向后续转发请求到其他微服务模块的时候，在请求内部加入存储用户信息的请求头，后续在工具模块common中定义基于SpringMvc实现的拦截器，拦截请求后从中取出存储有用户信息的请求头，获取到当前登录的用户信息，同时把信息存储到ThreadLocal中，方便后续同一模块下的其他业务使用（不能在一开始就使用ThreadLocal因为不同模块不在同一个Tomcat服务下，也可能不在同一服务器下）

# 关于启动类指定扫描范围的原因
```java

@EnableFeignClients( basePackages = "com.hmall.api.client" )
@EnableFeignClients( clients = {UserClient.class} )
@MapperScan("com.hmall.cart.mapper") 
@SpringBootApplication
public class CartApplication {
    public static void main(String[] args) {
        SpringApplication.run(CartApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
}
```

# @MapperScan 的扫描范围
制定该项目的Mapper文件所处的位置，因为我们要使用Spring的动态代理模式，来帮我们自动生成代理对象，然后通过代理对象来实现对数据库的数据交换。

# @EnableFeignClients 的扫描范围
启动类默认扫描的该类所在的包及其同级目录下的子包，这里指定是因为我们使用的`com.hmall.api.client`是位于`hmall-api`模块下的类，与当前启动类不在同一个模块下，所以需要指定扫描位置，同样也是借助spring来使用它的动态代理功能

也可以通过制定字节码文件的方式进行扫描



# 指定配置文件只在使用了SpringMvc的微服务模块下生效
```java
@ConditionalOnClass(DispatcherServlet.class)
public class MvcConfig implements WebMvcConfigurer {
    @override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new UserInfoInterceptor());
    }
}
```



`@ConditionalOnClass(DispatcherServlet.class)` 的作用是：**只有当类路径中存在 **`DispatcherServlet`** 类时，这个配置类才会生效**。



`DispatcherServlet` 是 Spring MVC 的核心前端控制器。这个条件确保只有在 Spring MVC 环境下才会注册这个拦截器配置，避免在非 Web 环境或其他 Web 框架环境下错误加载。



意思是：**只有当项目的依赖中包含了 **`DispatcherServlet`** 这个类时**，配置才会生效。

具体来说：

1. **类路径（classpath）** 就是项目运行时能访问到的所有类文件的集合
2. 当你的 `pom.xml` 中引入了 `spring-webmvc` 依赖时，`DispatcherServlet` 类就会被加载到类路径中
3. 如果没有引入相关依赖（比如纯 Spring Boot 非 Web 项目），这个类就不存在



所以 `@ConditionalOnClass(DispatcherServlet.class)` 就是 Spring Boot 的一种**自动配置机制**：

+ 有 Spring MVC → 配置生效 → 注册拦截器
+ 没有 Spring MVC → 配置不生效 → 跳过注册

这样可以避免在没有 Web 环境的项目中报错。



# ServerHttpRequest与ServerWebExchange的区别
```java
      ServerHttpRequest request = exchange.getRequest().mutate()
              .header("user-info",userId.toString())
              .build();
        
//request() 方法会创建一个 ServerHttpRequest.Builder 实例，
// 然后将其作为参数传递给 Lambda 表达式 builder -> builder.header(...)，执行添加请求头的操作。
//第 3 步：build() 方法根据修改后的 ServerHttpRequest.Builder 生成新的 ServerWebExchange 实例。
       ServerWebExchange request = exchange.mutate()
               .request(builder -> builder.header("user-info",userInfo))
               .build();

```

+ `ServerHttpRequest` 仅代表请求本身，不可变，修改后需更新到 `ServerWebExchange` 中才会生效。
+ `ServerWebExchange` 是过滤器链的核心传递对象，封装了完整的请求-响应上下文，修改其内部的请求对象是确保头部变更被后续过滤器感知的唯一方式。

因此，在 Gateway 过滤器中添加请求头时，必须通过 `ServerWebExchange.mutate()` 来修改并传递新的上下文对象。

### `builder` 参数的来源
在代码中，`builder` 是通过 **方法参数传递** 而来的，具体流程如下：

**调用 **`**exchange.mutate()**`：

1. `ServerWebExchange` 的 `mutate()` 方法返回一个 `ServerWebExchange.Builder` 实例，用于构建新的 `ServerWebExchange`。

**调用**** **`**request()**`** ****方法**：

2. `ServerWebExchange.Builder` 的 `request()` 方法接受一个 `Consumer<ServerHttpRequest.Builder>` 类型的参数，该参数是一个函数式接口，用于修改内部的 `ServerHttpRequest`。

**Lambda 表达式中的**** **`**builder**`：

3. 当我们传入 `builder -> builder.header("user-info", userInfo)` 这个 Lambda 表达式时，`builder` 就是 `request()` 方法自动传入的 `ServerHttpRequest.Builder` 实例，用于构建新的请求对象。



# SpringBoot配置文件默认加载过程
先是点击SpringBoot启动类进行运行项目时，程序会先去读取项目中的`application.yaml`文件进行配置文件的加载，然后创建`ApplicationContext`上下文对象，然后通过上下文对象中的信息进行运行程序。

# 加入SpringCloud的配置文件加载过程
当集合了SpringCloud的SpringCloud项目进行运行时，项目的配置文件加载的顺序为：

1. 先加载`bootstrap.yaml`文件，里面包含对项目的基本配置信息，包括服务名称，服务配置文件运行环境，nacos服务地址，以及共享配置文件的名称（也就是需要读取哪些配置文件）

```yaml
spring:
  application:
    name: cart-service # 服务名称
  profiles:
    active: dev
  cloud:
    nacos:
      server-addr: 192.168.59.133:8848  # nacos服务地址
      config:
        file-extension: yaml  # 文件后缀名
        shared-configs:    # 指定要加载的配置文件
          - data-id: hm-jdbc.yaml
          - data-id: hm-log.yaml
          - data-id: hm-swagger.yaml

```

2. 然后依据`bootstrap`的配置文件中的nacos地址，来从nacos上拉取需要读取的共享配置文件
3. 然后生成SpringCloud的`ApplicationContext`上下文对象
4. 加载SpringBoot的`application.yaml`配置文件，加载项目特有的基础配置文件

```yaml
server:
  port: 8082

hm:
  jwt:
    location: classpath:hmall.jks
    alias: hmall
    password: hmall123
    tokenTTL: 30m
  auth:
    excludePaths:
      - /search/**
      - /users/login
      - /items/**
      - /hi
feign:
  okhttp:
    enabled: true  #开启okhttp使用连接池，提高访问速度
# keytool -genkeypair -alias hmall -keyalg RSA -keypass hmall123 -keystore hmall.jks -storepass hmall123      - /hello/**

```

5. 最后生成总的`ApplicationContext`上下文对象，运行项目内容



# Nacos配置共享配置文件
把SpringCloud中配置文件重复的部分进行拆分到`Nacos`中。



抽取出来的共享配置文件分别为，`hm-jdbc.yaml`,`hm-log.yaml`,`hm-swagger.yaml`

例如数据库配置文件取名为`hm-jdbc.yaml`，取名尽量带上后缀，表明文件为何种类型的文件，否则nacos进行加载时默认加载的是`properties`类型的文件，可能会报错

```yaml
spring:
  datasource:
    url: jdbc:mysql://${hm.db.host}:3306/${hm.db.database}?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: ${hm.db.pw}
mybatis-plus:
  configuration:
    default-enum-type-handler: com.baomidou.mybatisplus.core.handlers.MybatisEnumTypeHandler
  global-config:
    db-config:
      update-strategy: not_null
      id-type: auto
```

此处数据库配置文件中的配置`${hm.da.host},${hm.da.database},${hm.db.pw}`，表示加载该配置文件时，此处占位符中的内容从另一个配置文件的属性`hm`下的`db`下的`host，database，pw`三个属性中进行读取

```yaml
hm:
  db:
    host: 192.168.59.133 # 修改为你自己的虚拟机IP地址
    pw: 123 # 修改为docker中的MySQL密码
    database: hm-cart
```



然后引入**nacos配置管理依赖**和**读取bootstrap配置文件**的依赖

```xml
<!--        nacos配置管理-->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
        </dependency>
<!--        读取bootstrap配置文件-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-bootstrap</artifactId>
        </dependency>
```

依赖作用是让SpringCloud启动时自动去读取bootstrap配置文件，然后拉取nacos共享配置文件完成共享以及项目特有的配置文件的加载





# Nacos配置热部署的配置文件
**配置热部署后，当配置文件进行更改时，项目不需重新启动即可完成配置信息的更改**

1. 首先nacos中要有一个与微服务名称一样的配置文件，项目启动时会依据bootstrap中配置的name，active，file-extension进行读取该配置文件

```yaml
spring:
  application:
    name: cart-service # 服务名称
  profiles:
    active: dev
  cloud:
    nacos:
      server-addr: 192.168.59.133:8848  # nacos服务地址
      config:
        file-extension: yaml  # 文件后缀名
        shared-configs:    # 指定要加载的配置文件
          - data-id: hm-jdbc.yaml
          - data-id: hm-log.yaml
          - data-id: hm-swagger.yaml
```

> 命名规则为微服务名称+运行环境（本地还是开发，dev还是local，也可以不指定，不指定的话就是任何环境下都会启用）+后缀名
>

```yaml
hm:
  cart:
    maxItems: 1

```



2. 项目中要有一个与配置文件相关的属性类,用来接收配置文件中的属性，当属性发生更改时，属性类中的值也会改变

```java
@Data
@Component
@ConfigurationProperties(prefix = "hm.cart")
public class CartProperties {
    private Integer maxItems;
}
```



两步都配置好后就可以进行热部署的测试，`CartProperties`中的`maxItems`是用来指定购物车可存入的最大值的，具体代码位于CartServiceImpl中的添加商品到购物车，当商品数量加一后大于指定的最大购物车商品数量`maxItem`时，返回异常信息：购物车商品数量超出限制

```java
    private void checkCartsFull(Long userId) {
        int count = lambdaQuery().eq(Cart::getUserId, userId).count();
        if (count >= cartProperties.getMaxItems()) {
            throw new BizIllegalException(StrUtil.format("用户购物车课程不能超过{}", 10));
        }
    }
```

此时设定为1，进行测试，后面进行改为3进行测试即可测试热部署是否完成

# Nacos配置动态路由
引入nacos-config依赖后，利用依赖中提供的`nacosConfigManager`类，进行对nacos中配置文件的拉取

1. 通过`nacosConfigManager`调用`getConfigService`获取到`ConfigService`配置服务类实例，这个实例是与 Nacos 服务器通信的核心对象，
2. 然后通过获取到的`ConfigService`配置服务类调用`getConfigAndSignListener`方法，依据参数传入的`dataId`获取到配置文件信息，并对该配置文件添加监听器，该方法的返回值`configInfo`包含了当前配置文件的各项配置信息
3. 当配置文件发生变化时，便会执行监听器中的`receiveConfigInfo`方法，对配置文件进行热更新



4. 对于`receiveConfigInfo`中的`updateRouteConfig`路由配置更新方法的内容解析如下：



+ 首先更新采用先删除后添加的方式，先对之前的路由进行删除（路由名称-`id`保存在routeList集合中），使用 Spring Cloud Gateway  中提供的`routeDefinitionWriter.delete().subscribe()`进行删除
+ 然后再添加新的配置路由信息到路由表中，先把读取到的`JSON`文件转换为`RouteDefinition`对象，（该对象为 Spring Cloud Gateway  中提供的专门用来存储路由信息的`java`实体类，内部包含路由的id,uri，predicates，）然后通过`RouteDefinition`对象获取到对应路由的 id（也就是名称），通过`routeDefinitionWriter.save(Mono.just(routeDefinition)).subscribe()`加载新的路由信息到网关中。



5. 监听器采用的是，异步执行（执行更新时采用其他线程，不阻塞主线程，即项目不需重启即可完成更新），实现动态配置路由的目的 。Nacos 配置监听 = 普通事件回调（非响应式）更新路由的操作 = 响应式 API  

## 注意
`routeDefinitionWriter.delete().subscribe()`以及`routeDefinitionWriter.save().subscribe()`方法的后面必须加上`subscribe()`否则代码执行到这里时，不会真正执行save或者delete方法，只有加上`subscribe`后才会执行。

+ **<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">无 </font>**`**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">subscribe()</font>**`**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);"> 时</font>**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">：</font><font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">代码执行到这一行时，仅仅完成了 “创建保存操作的 Mono 对象” 的动作，底层的</font>`<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">save</font>`<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">逻辑（比如向配置中心写入数据、操作存储介质）不会被触发。程序不会报错，也不会有任何实际 IO 操作发生，就像这段代码被 “跳过” 了一样。</font>
+ **<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">有 </font>**`**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">subscribe()</font>**`**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);"> 时</font>**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">：</font><font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">执行到这一行时，</font>`<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">subscribe()</font>`<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);"> 会触发该</font>`<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">Mono</font>`<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">的订阅，底层才会真正执行</font>`<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">save</font>`<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">逻辑，完成路由配置的保存，同时可以通过</font>`<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">subscribe</font>`<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">的回调处理成功 / 失败结果。</font>
+ <font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);"> Nacos 配置监听 = 普通事件回调（非响应式）更新路由的操作 = 响应式 API  </font>

### <font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">总结</font>
<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">“不会执行” 指的是</font>**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">响应式流的实际处理逻辑（真正的 IO 操作 / 业务逻辑）没有被触发</font>**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">，代码仅停留在 “构建数据流定义” 的阶段，而非执行逻辑阶段。这是响应式编程区别于命令式编程（如直接调用方法即执行）的核心特点之一。</font>



```java
package com.hmall.gateway.routes;

import cn.hutool.json.JSONUtil;
import com.alibaba.cloud.nacos.NacosConfigManager;
import com.alibaba.nacos.api.config.listener.Listener;
import com.alibaba.nacos.api.exception.NacosException;
import com.alibaba.nacos.api.config.ConfigService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.cloud.gateway.route.RouteDefinition;
import org.springframework.cloud.gateway.route.RouteDefinitionMetrics;
import org.springframework.cloud.gateway.route.RouteDefinitionWriter;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.Executor;

/**
 * 动态路由加载器
 * <p>
 * 负责从 Nacos 配置中心加载和监听路由配置，实现网关路由的动态更新
 * 无需重启网关服务即可实时生效新的路由规则
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DynamicRouteLoader {

    /**
     * Nacos 配置管理器
     * <p>
     * 用于从 Nacos 配置中心获取配置服务实例，进而获取配置信息并注册配置变更监听器
     */
    private final NacosConfigManager nacosConfigManager;

    /**
     * 路由定义写入器
     * <p>
     * Spring Cloud Gateway 提供的用于操作路由定义的接口，支持保存和删除路由
     * 通过响应式编程方式操作路由
     */
    private final RouteDefinitionWriter routeDefinitionWriter;

    /**
     * 路由配置文件的 Data ID
     * <p>
     * 对应 Nacos 配置中心中存储路由规则的配置文件 ID
     */
    private String dataId = "gateway-routes.json";

    /**
     * 路由配置文件的分组
     * <p>
     * 对应 Nacos 配置中心中配置文件的分组
     */
    private String group = "DEFAULT_GROUP";

    /**
     * 路由 ID 列表
     * <p>
     * 用于记录当前已加载的路由 ID，便于后续更新时删除旧路由
     */
    private Set<String> routeList = new HashSet<>();

    /**
     * 初始化路由配置监听器
     * <p>
     * 使用 @PostConstruct 注解，确保在 Spring 容器初始化时自动执行
     * 注册 Nacos 配置监听器，监听路由配置文件的变更，实现路由的动态更新
     *
     * @throws NacosException 当 Nacos 配置服务操作失败时抛出
     */
    @PostConstruct
    public void initRouteConfigListener() throws NacosException {
        // 1. 获取 Nacos 配置服务实例
        ConfigService configService = nacosConfigManager.getConfigService();

        // 2. 获取配置并注册监听器，也叫响应式编程
        // 参数说明：
        // dataId: 配置文件的唯一标识
        // group: 配置文件的分组
        // timeoutMs: 获取配置的超时时间（毫秒）
        // listener: 配置变更监听器,配置文件发生变化时自动调用监听器函数进行更新
        String configInfo = configService.getConfigAndSignListener(dataId, group, 5000, new Listener() {
            /**
             * 获取执行回调的线程池
             * <p>
             * 返回 null 时，Nacos 使用默认线程池执行回调，
             * <p>
             * 主线程继续运行，在主线程不停止的情况下，调用其他线程执行回调函数进行配置更新,回调函数
             *
             * @return 执行回调的线程池，null 表示使用默认线程池
             */
            @Override
            public Executor getExecutor() {
                return null;
            }

            /**
             * 接收配置变更通知
             * <p>
             * 当 Nacos 中的路由配置发生变更时，此方法才会被调用
             *
             * @param configInfo 依据dataId加载到的配置文件内容
             */
            @Override
            public void receiveConfigInfo(String configInfo) {
                // 1. 解析配置内容为路由规则
                // 2. 更新网关的路由表
                // 3. 记录配置变更日志
                updateRouteConfig(configInfo);

            }
        });

        //更新配置文件信息，configInfo 依据dataId加载到的配置文件内容
        //用于第一次初始化路由配置信息
        updateRouteConfig(configInfo);

    }

    /**
     * 更新路由配置
     * <p>
     * 1. 删除旧路由
     * 2. 清空路由 ID 列表
     * 3. 解析新路由配置
     * 4. 添加新路由
     * 5. 更新路由 ID 列表
     *
     * @param configInfo  依据 dataId加载到的配置文件内容（JSON 格式）
     */
    private void updateRouteConfig(String configInfo) {

        // 先删除上一次更新的路由列表
        // 如果是第一次加载，则 routeList 为空，不执行删除操作
        // 后续每次更新时都先删除旧路由，再添加新路由
        log.info("开始更新路由配置，删除旧路由数量：{}", routeList.size());

        if (routeList != null && !routeList.isEmpty()) {
            for (String s : routeList) {
                // 使用响应式编程方式删除路由
                // 调用 subscribe() 触发响应式流的执行
                routeDefinitionWriter.delete(Mono.just(s)).subscribe();
            }
            //更新之前把旧的路由表清空，否则原本的旧数据还在里面会再次被添加
            routeList.clear();
        }

        // 解析配置内容为路由定义列表
        List<RouteDefinition> routeDefinitionList = JSONUtil.toList(configInfo, RouteDefinition.class);

        //使用RouteDefinitionWriter来进行路由更新，相当于覆盖
        for (RouteDefinition routeDefinition : routeDefinitionList) {
            // 使用响应式编程方式保存路由
            // 调用 subscribe() 触发响应式流的执行，由于Spring WebFlux的响应式编程特性
            // 若没有subscribe代码执行到这里只是编译save方法，并不执行
            // subscribe的作用就是告诉代码执行这里时编译并执行save方法
            routeDefinitionWriter.save(Mono.just(routeDefinition)).subscribe();
            // 记录路由 ID，用于下次更新时删除
            routeList.add(routeDefinition.getId());
        }
        log.info("路由配置更新完成，新路由数量：{}", routeDefinitionList.size());

    }
}

```



## Ai总结版
---

### Nacos 配置实现 Spring Cloud Gateway 动态路由（标准说明）
引入 `nacos-config` 依赖后，可借助 `NacosConfigManager` 拉取 Nacos 中的路由配置文件，并实现配置变更的热更新，核心流程如下：

1. **获取 Nacos 配置通信实例**  
通过 `nacosConfigManager.getConfigService()` 获取 `ConfigService` 实例，它是与 Nacos 服务器通信的核心对象，负责配置的拉取与监听。
2. **拉取配置并注册监听器**  
调用 `configService.getConfigAndSignListener(dataId, group, listener)`，传入配置的 `dataId`、`group` 与自定义监听器。该方法会拉取当前配置内容，并为该配置注册一个变更监听器。方法返回值中可获取当前配置的内容。
3. **配置变更触发热更新回调**  
当 Nacos 上的配置文件发生变更时，监听器的 `receiveConfigInfo(String configInfo)` 方法会被回调，传入最新的配置内容，在此方法中实现路由的动态更新逻辑。
4. **路由更新逻辑（先删后增）**  
在 `updateRouteConfig` 方法中，采用**先删除旧路由、再添加新路由**的方式更新网关路由：
    - **删除旧路由**：遍历之前缓存的路由 ID 列表，通过 `RouteDefinitionWriter.delete(Mono.just(routeId)).subscribe()` 删除旧路由定义（`delete` 方法必须传入路由 ID，无参调用无效）。
    - **添加新路由**：将新配置的 JSON 内容解析为 `Spring Cloud Gateway` 提供的 `RouteDefinition` 实体对象（包含路由的 `id`、`uri`、断言 `predicates`、过滤器 `filters` 等信息），再通过 `RouteDefinitionWriter.save(Mono.just(routeDefinition)).subscribe()` 将新路由注册到网关中。

> 注：`RouteDefinitionWriter` 是 `Spring Cloud Gateway` 提供的路由操作类，其 `save/delete` 方法返回 `Mono`，属于响应式 API，需调用 `subscribe()` 触发执行。
>

5. **动态路由的异步与非阻塞特性**
    - Nacos 监听器的回调由 Nacos 内部线程池异步触发，不会阻塞网关主线程；
    - 路由更新操作本身通过响应式 API 执行，网关无需重启即可完成路由规则的动态生效，实现配置热更新。

---



# Sentinel解决雪崩问题
1. 先在本地或者虚拟机（服务器）上配置sentinel软件包，并运行起来
2. 项目中引入Sentinel依赖，yaml文件中配置sentinel配置信息，然后就可以访问到sentinel控制台页面，对项目中各个请求路径进行监控

```yaml
spring:
  clous:
    sentinel:
        transport: # sentinel配置
          dashboard: 192.168.59.133:8090  # sentinel dashboard 控制台地址
        http-method-specify: true  #把请求方式 + 请求路径作为簇点资源名称
```

3. 配置好之后需要访问一下需要监控的接口，然后刷新sentinel控制台即可看到刚才访问的接口（簇点）信息，对其进行各个控制。

> sentinel监控的主要是controller层中的相应路径，一个请求路径为一个簇点
>

4. 由于使用的RESTful风格的请求，很多路径只是请求方式不一样，路径完全一样，所以在配置文件中加上如下配置开启以 **请求方式+请求路径 **作为簇点，方便区分

```yaml
spring:
  clous:
    sentinel:
        transport: # sentinel配置
          dashboard: 192.168.59.133:8090  # sentinel dashboard 控制台地址
        http-method-specify: true  #把请求方式 + 请求路径作为簇点资源名称
```

5. 对于服务之间的相互请求，使用的是openfeign方式发送请求，配置中需要开启如下配置把openfeign发送的请求也作为簇点进行控制

```yaml
feign:
  sentinel:
    enabled: true 
    # 把通过openfeign发起的请求也作为sentinel中的簇点链路资源，对其进行线程隔离等操作
```

## 一、请求限流
对服务的请求访问量进行限制。

+ QPS阈值：限制每秒允许正常通行的请求数量，超出阈值的请求会被限流或降级处理。

## 二、线程隔离
限制单个服务可同时处理的并发线程数，实现服务之间资源隔离，防止故障扩散。

+ 并发线程阈值：代表当前服务同一时间能够并行处理的请求数量，例如设置为6，即最多同时允许6个请求并发访问处理。

举例：  
假设服务全局总可用线程为100，包含A、B两个业务模块。  
给A服务设置：最大并发线程25，请求等待队列容量25。  
同一时间最多只有25个线程正常处理A服务请求；  
若A服务响应缓慢、发生阻塞，25个处理线程全部占满后，新请求进入等待队列，队列满负载为25；  
当25个处理线程 + 25个等待队列全部占满后，后续新的A服务请求会被拒绝；  
如果是OpenFeign远程调用发起的请求，会自动进入Fallback降级逻辑；  
A服务只会占用自身分配的线程与队列资源，不会挤占全局剩余空闲线程，剩余资源可完全供给B服务使用，保证B服务正常运行，互不影响。

## 三、Fallback 降级失败响应
通过OpenFeign发起远程调用时，出现以下任意情况，都会触发Fallback降级：

1. 请求达到QPS限流阈值；
2. 并发线程隔离上限耗尽、队列占满；
3. 目标服务宕机、调用超时、程序异常、网络异常等调用失败。

触发降级后，不会直接抛出异常、展示错误信息，而是执行预设兜底逻辑，返回默认数据、友好提示或默认页面，避免接口报错、页面卡死，提升整体使用体验。

## 四、服务熔断
当依赖服务频繁报错、响应超时、大面积调用异常时，触发熔断机制，避免大量无效请求持续冲击故障服务，防止服务雪崩。  
配置指定熔断触发条件与冷却时间；  
熔断开启后处于开路状态，大部分请求直接走降级Fallback，减少对故障服务的调用；  
冷却时间结束后，进入半开状态，试探性放行少量请求检测服务健康状态；  
若探测请求正常响应，判定服务恢复，关闭熔断，恢复正常调用；  
若探测请求依旧失败，判定服务未修复，重新触发熔断；  
所有OpenFeign发起的熔断请求，均会执行Fallback兜底降级逻辑。



# 分布式事务（Seata）
在分布式系统中，如果一个业务需要多个服务合作完成，而且每一个服务都有事务，多个事务必须同时成功或失败，这样的事务就是分布式事务。其中的**每个服务的事务**就是一个**分支事务**。**整个业务**称为**全局事务**。



## Seata分布式事务管理器
Seata事务管理中有三个重要的角色：

+ TC(TransactionCoordinator)-事务协调者：维护全局和分支事务的状态，协调全局事务提交或回滚。
+ TM(TransactionManager）-事务管理器：定义全局事务的范围、开始全局事务、提交或回滚全局事务。
+ RM(ResourceManager)-资源管理器：管理分支事务，与TC交谈以注册分支事务和报告分支事务的状态



## XA规范
XA规范是X/Open组织定义的分布式事务处理（DTP，Distributed Transaction Processing）标准，XA规范描述了全局的TM与局部的RM之间的接口，几乎所有主流的关系型数据库都对XA规范提供了支持。Seata的XA模式如下：

### 一阶段的工作：
1. RM注册分支事务到TC
2. RM执行分支业务sqI但不提交
3. RM报告执行状态到TC

### 二阶段的工作：
1. TC检测各分支事务执行状态
+ 如果都成功，通知所有RM提交事务
+ 如果有失败，通知所有RM回滚事务
2. RM接收TC指令，提交或回滚事务



### XA模式的优点是什么？
+ 事务的强一致性，满足ACID原则。
+ 常用数据库都支持，实现简单，并且没有代码侵入

### XA模式的缺点是什么？
+ 因为阶段需要锁定数据库资源，等待阶段结束才释放，
+ 性能较差依赖关系型数据库实现事务



## 使用XA模式的步骤
修改application.yml文件（每个参与事务的微服务），开启xA模式：（默认为AT模式）

```yaml
seata:
data-source-proxy-mode：XA #开启数据源代理的XA模式
```

给发起全局事务的入口方法添加@GlobalTransactional注解标注方法为全局事务，内部调用其他服务注解使用@Transactional标注为分支事务



## AT模式
Seata主推的是AT模式，AT模式同样是分阶段提交的事务模型，不过缺弥补了XA模型中资源锁定周期过长的缺陷。

### 阶段一RM的工作：
+ 注册分支事务
+ 记录undo-log（数据快照）
+ 执行业务sql并提交
+ 报告事务状态

### 阶段二提交时RM的工作：
+ 删除undo-log即可

### 阶段二回滚时RM的工作：
+ 根据undo-log恢复数据到更新前



## 简述AT模式与XA模式最大的区别是什么？
+ XA模式一阶段不提交事务，锁定资源；AT模式一阶段直接提交，不锁定资源。
+ XA模式依赖数据库机制实现回滚；AT模式利用数据快照实

现数据回滚。

+ XA模式强一致；AT模式最终一致，AT模式会存在短暂的数据不一致但是时间较短毫秒级，所以可以忽略，如果对一致性要求较高则使用XA模式



# RabbitMQ 用户名密码必须在 docker run 中指定的核心原因
这是**RabbitMQ 设计机制**和**Docker 容器化部署**共同决定的，和 Nacos、Sentinel 完全不同，我给你讲清楚底层逻辑：

## 1. 最核心：RabbitMQ 的**初始化机制**
RabbitMQ 有一个硬性规则：  
**管理员账号（默认用户）必须在 第一次启动 / 初始化 时创建，无法后期自动从数据库读取生成。**

+ 你在 `docker run` 里写的：

```plain
-e RABBITMQ_DEFAULT_USER=itheima
-e RABBITMQ_DEFAULT_PASS=123321
```

这两个是**环境变量**，作用是：  
**告诉 RabbitMQ：第一次启动时，自动创建这个管理员账号。**

+ 如果不写这两个环境变量：  
RabbitMQ 只会使用默认账号：`guest/guest`，**而且这个账号只能本机访问，远程无法登录**。

---

## 2. 为什么 Nacos、Sentinel 可以存在数据库里？
因为它们的定位是**配置/管理平台**，账号是**业务数据**：

+ Nacos：用户表、权限表存在 MySQL
+ Sentinel：规则、账号存在数据库或本地文件

**但 RabbitMQ 不是管理平台，它是消息队列中间件！**

+ 它的**管理员账号**是**服务级账号**，不是业务账号
+ 它**不依赖外部数据库**存储自己的账号
+ 账号信息存在 RabbitMQ 自己的内部存储（Mnesia 数据库）中

---

## 3. Docker 容器为什么必须在 run 时指定？
Docker 容器是**一次性初始化**的：

1. 容器第一次启动 → RabbitMQ 初始化
2. 初始化时**读取环境变量** → 创建管理员账号
3. 初始化完成后 → 账号就固定在容器数据卷里了
4. **之后再改环境变量也不会生效！**

所以必须在 `docker run` 阶段就把账号密码告诉它。

---

## 4. 一句话总结区别
| 组件 | 账号类型 | 存储位置 | 配置方式 |
| --- | --- | --- | --- |
| **RabbitMQ** | 服务管理员账号 | 自身内部库 | **必须在启动时用环境变量指定** |
| Nacos/Sentinel | 平台管理账号 | 外部MySQL | 写在数据库里 |


---

### 总结
1. **RabbitMQ 管理员账号是服务启动级账号，不是业务账号**
2. **必须在第一次启动时通过环境变量创建，无法从外部数据库读取**
3. Docker 容器化部署时，`docker run` 就是启动时机，所以必须写在命令里
4. Nacos/Sentinel 是管理平台，账号存在业务库，和 RabbitMQ 不是一回事



```java
@Bean
public MessageConverter messageConverter(){
    // 1.定义消息转换器
    Jackson2JsonMessageConverter jackson2JsonMessageConverter = new Jackson2JsonMessageConverter();
    // 2.配置自动创建消息id，用于识别不同消息，也可以在业务中基于ID判断是否是重复消息
    jackson2JsonMessageConverter.setCreateMessageIds(true);
    return jackson2JsonMessageConverter;
}
```

我先直接给你结论：  
`setCreateMessageIds(true)`** 不是为了“消息用完就删掉”，而是为了给每一条消息生成一个唯一ID，用来做：消息追踪、重复消费判断、幂等性保障、死信排查。**

---

### 一、先搞懂：这个方法到底做了什么？
```java
jackson2JsonMessageConverter.setCreateMessageIds(true);
```

作用：  
**让 Spring AMQP 在序列化消息时，自动给每一条消息生成一个唯一的 **`messageId`（UUID），放进消息头里。

就像给每一条消息贴一个**唯一身份证号**。

---

### 二、你疑惑的点：消息消费完不就没了吗？为什么还要ID？
你理解的“用完消息就没有了”是**正常场景**，但真实生产环境会遇到大量**异常场景**：

#### 1. 消息**重试/重复投递**时，消息会被反复消费
比如：

+ 消费时服务突然宕机
+ 消费抛出异常
+ 网络抖动导致 ACK 失败

RabbitMQ 会**重新投递这条消息**。  
这时候：

+ 消息体没变
+ 消息内容没变
+ **只有 messageId 是唯一不变的**

你必须靠这个 ID 判断：**这条消息我是不是已经处理过了？**

#### 2. 业务必须保证**幂等性**（不能重复扣款/重复下单）
比如订单支付、积分发放、库存扣减。  
如果没有 messageId，你根本不知道这条消息是不是重复的，就会导致：

+ 重复扣钱
+ 重复发券
+ 数据错乱

**messageId 就是判断重复的核心依据。**

#### 3. 日志、监控、问题排查必须靠 ID
生产环境出问题：

+ 消息丢失了？
+ 消息发不出去？
+ 消息进死信队列了？

你只能通过 **messageId** 去日志/监控里追踪整条链路。  
没有 ID，问题根本查不出来。

#### 4. 消息可能被转发、死信、延迟重发
哪怕原始消息被确认了，它的“副本/复刻版”还会在系统里流转：

+ 死信队列
+ 延迟队列
+ 重试队列

**唯一的 messageId 能让你始终识别它是同一条消息。**

---

### 三、最简单的一句话总结
**消息虽然会被消费删除，但消息可能会：重试、重复、转发、进入死信、需要排查问题。  
****messageId 就是这条消息的“唯一身份证”，跟消息是否被删除无关。**

---

### 四、实际业务中怎么用这个 ID？
你在消费消息时，可以直接拿到：

```java
@RabbitListener(queues = "test.queue")
public void listen(Message message, Object payload) {
    // 获取自动生成的唯一消息ID
    String messageId = message.getMessageProperties().getMessageId();
    
    // 1. 判断是否已经消费过（Redis 存 ID）
    if (redis.hasKey(messageId)) {
        return; // 重复消息，直接丢弃
    }
    
    // 2. 正常业务逻辑
    doBusiness(payload);
    
    // 3. 标记已消费
    redis.set(messageId, "true", 24L, TimeUnit.HOURS);
}
```

这就是**幂等性**的标准实现。

---

### 五、那默认 false 为什么不行？
默认 false：

+ 不生成 messageId
+ 消息头里没有 ID
+ 你无法判断重复
+ 无法追踪消息
+ 生产环境极难维护

**true 是生产环境必开的配置。**

---

### 总结
1. `setCreateMessageIds(true)` = **给每条消息生成唯一ID**
2. 用途：**重复消费判断、幂等性、消息追踪、问题排查**
3. 跟消息是否被删除无关，是消息的**唯一标识**
4. 这是**生产环境必备配置**

如果你愿意，我还能给你讲：

+ 消息ID 存在哪里？
+ 为什么不用自己生成ID？
+ 消息重复的完整解决方案？




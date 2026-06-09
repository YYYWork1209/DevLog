# Mybatis

# Mybatis执行流程

1. 首先，依据mybatis-config.xml读取配置信息，包括数据库连接信息，需要使用哪些映射包。
2. 然后通过会话构建工厂SqlSessionFactory构建多个SqlSession会话对象（包含执行SQL语句的方法】），工厂制定会话Session的功能，会话Session使用功能进行调用对应的Executor执行器（数据库功能接口，同时负责查询缓存维护）
3. MappedStatement用来读取写好的数据库SQL语句封装到自己的内部属性中，对于传入的参数以及返回的结果都进行数据类型转换，java类型与数据库类型之间的转换
4. 然后Exector执行器通过MappedStatement来实现数据库相关功能
5. 注意使用注解方法后，底层仍然采用的是这些流程，只是采用注解封装了起来而已。



# Mybatis的延迟加载

 ## 什么是延迟加载（默认不开启）

例如用户表与订单表是一对多的关系，一个用户可以对应多个订单

**立即加载：**查询用户的时候，把用户所属的订单数据也查询出来，这个是**立即加载**

**延迟加载：**查询户的时候，暂时不查询订单数据，当需要订单的时候，再查询订单，这个就是**延迟加载**

- 延迟加载的意思是：就是在需要用到数据时才进行加载，不需要用到数据时就不加载数据。
- Mybatis支持一对一关联对象和一对多关联集合对象的延迟加载
- 在Mybatis配置文件中，可以配置是否启用延迟加载**lazyLoadingEnabled=truelfalse**，默认是关闭的



## 延迟加载的原理

1. 使用CGLIB创建目标对象的代理对象
2. 当调用目标方法user.getOrderList()时，进入拦截器invoke方法，发现user.getOrderListO是null值，执行sql查询order列表
3. 把order查询上来，然后调用user.setOrderList(List<Order>orderList），接着完成user.getOrderList()方法的调用

![](/imgs/延迟加载流程图.png)

# Mybatis的一二级缓存

1. 一级缓存:基于PerpetualCache的HashMap本地缓存，其存储作用域为Session，当Session进行flush或close之后，该Session中的所有Cache就将清空，默认打开一级缓存
2. 二级缓存是基于namespace和mapper的作用域起作用的，不是依赖于SQLsession，默认也是采用PerpetualCache，HashMap存储。需要单独开启，一个是核心配置，一个是mapper映射件

## 一级缓存

基于PerpetualCache的HashMap本地缓存，其**存储作用域为 Session**，范围较小

当Session进行flush或close之后，该Session中的所有Cache就将清空，**默认打开一级缓存**

## 二级缓存

二级缓存是**基于namespace和mapper的作用域起作用**的，不是依赖于SQL session，默认也是采用PerpetualCacheHashMap 存储

默认关闭，开启方式如下：

1. 配置文件把cacheEnabled设置为true
2. 对应xml映射文件中加入`<cache/>`标签即可



## 注意

1. 对于缓存数据更新机制，当**某一个作用域(一级缓存 Session/二级缓存Namespaces)的进行了新增、修改、删除操作后，默认该作用域下所有select中的缓存将被clear**
2. 二级缓存需要**缓存的数据实现Serializable接口**
3. 只有**会话提交或者关闭以后，一级缓存中的数据才会转移到二级缓存中**


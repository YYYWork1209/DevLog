  
**Docker 导出镜像 / 打包容器 成 tar 压缩包**，一共就 2 个核心命令。

## 需求1：把**本地已有的镜像**导出成 tar（最常用）
比如你本地有 `rabbitmq:3.8-management`，想导出成 `mq.tar`

### 命令
```bash
docker save -o mq.tar rabbitmq:3.8-management
```

### 解释
+ `docker save`：导出**镜像**
+ `-o mq.tar`：输出文件名叫 mq.tar
+ `rabbitmq:3.8-management`：你要导出的**镜像名+版本**

### 导出后别人怎么用？
```bash
docker load -i mq.tar
```

---

## 需求2：把**正在运行的容器**打包成镜像（改了容器内容才用）
比如你启动了 mq 容器，装了插件、改了配置，想把**当前容器状态**打包成镜像。

### 步骤1：先把容器打包成新镜像
```bash
docker commit mq my-rabbitmq:1.0
```

+ `mq`：容器名
+ `my-rabbitmq:1.0`：新镜像名字（自己随便起）

### 步骤2：再把新镜像导出成 tar
```bash
docker save -o mq-container.tar my-rabbitmq:1.0
```

---

# 二、关键区别
| 命令 | 作用 | 适用场景 |
| --- | --- | --- |
| **docker save** | 导出**镜像** | 干净、原始镜像（推荐） |
| **docker commit** | 把**容器 → 镜像** | 你在容器里改了东西，要保存状态 |
| **docker load** | 导入镜像 | 别人给你的 tar 包 |


---

# 三、打包命令汇总
+ **导出镜像**：`docker save -o 文件名.tar 镜像名`
+ **导入镜像**：`docker load -i 文件名.tar`
+ **容器打包成镜像**：`docker commit 容器名 新镜像名`

---

### 总结
1. **导出镜像**（最常用）

```bash
docker save -o mq.tar rabbitmq:3.8-management
```

2. **把运行中的容器打包**

```bash
docker commit mq my-mq
docker save -o mq.tar my-mq
```




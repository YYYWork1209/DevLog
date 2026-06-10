# Java Web学习笔记
# Web前端基础
前端学习网站：

+ [MDN Web Docs](https://developer.mozilla.org/zh-CN/)（网站主页）
+ [HTML（超文本标记语言） | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML)（html学习文档页面）



## 一，HTML
### 引入CSS方式
1. 行内样式
2. 内部样式
3. 外部样式（增强复用性）外部样式用link标签引入

```html
<link rel="stylesheet" href="CSS的URL地址">
//rel表示引入的内容是什么类型的,stylesheet表示是CSS
```



### 颜色表示形式
| 表示方式 | 属性值 | 说明 | 示例 |
| --- | --- | --- | --- |
| 关键字 | 颜色英文单词 | red，green，blue | red，blue |
| rgb表示法 | rgb(r,g,b) | 红绿蓝三原色，取值0-255 | rgb（0,0,0）,rgb(0,255,0) |
| rgba表示法 | rgba(r,g,b,a) | 红绿蓝三原色，取值0-1，后面第四位是a，表示透明度 | rgba(0,0,0,0.3),rgba(255,0,0,0.5) |
| 十六进制表示法 | #rrggbb | #开头，数字转换为十六进制表示 | #000000, # f f 0000,简写：#000，# f 00 |


### 选择器
**CSS选择器用来选取需要设置格式的元素（标签）**

| 选择器 | 写法 | 示例 | 示例说明 |
| --- | --- | --- | --- |
| 元素选择器 | 元素名称{  } | h1{  } | 选择页面上所有的h1标签 |
| 类选择器 | . class属性名{  } | . cls {  } | 选择页面上所有class属性名为cls的标签 |
| id选择器 | # id属性名 | # hid {  } | 选择页面上所有id属性名为hid的标签 |
| 分组选择器 | 选择器1，选择器2{ } | h1，h2{ } | 选择页面上所有的h1，h2标签 |
| 属性选择器 | 元素名称 [ 属性 ] | input [ type ]{  } | 选择页面上有type属性的input标签 |
| 属性选择器 | 元素名称 [ 属性名="  值" ]  {  } | input [ type = "text" ]  {  } | 选择页面上type属性为text的input标签 |
| 后代选择器 | 元素1，元素2{  } | form input {   } | 选择form标签内的所有input标签 |


**若需同时选择多个（多个标签使用统一样式），只需在选择器后面加英文'  ，'即可**



### 音视频图片标签
#### 视频标签
**设置视频大小时，width和height只设置一个即可，另一个会等比例改变。**

**用百分比设置视频大小时，百分比相当于占父元素的百分之多少的大小（父元素指当前标签的上一级元素）**

```html
<!--定义一个视频，引入video/news.mp4

    video标签属性
    src：视频地址
    controls：显示插放控件
    autoplay：自动播放
-->
<video src="video/news.mp4" controls autoplay width="300px"></video>

```

#### 音频标签
```java
<audio src="audio/news.mp3"controls></audio>

```

#### 图片标签
img标签属性：

alt：图片无法正常展示时显示的信息

src：图片的访问地址

1．绝对路径

+ 绝对磁盘路径：C:\Users\Administrator\Desktop\img\1.gif (不推荐)
+ 绝对网络路径：[https://www.baidu.com/img/1.gif（图片来源于网络，点击左键网络图片，在新标签页中打开即可得到图片的网络路径）](https://www.baidu.com/img/1.gif（图片来源于网络，点击左键网络图片，在新标签页中打开即可得到图片的网络路径）)

2．相对路径

+ .／：当前目录（可以省略），如：./img/1.gif
+ ../：上一级目录
+ width：图片宽度（建议：宽度和高度只设置一个即可，另一个会等比例缩放)
+ height：图片高度

```java
<img src="c:\Users\deng\Desktop\HTML-CSS\img\1.gif" ></img>

<!--此时图片路径为磁盘路径，加载html页面时，不能以服务器的形式运行，否则找不到图片.
可以采用Open In Default Browser方式加载html页面
或者把路径修改为相对路径，文件夹/文件
-->
```



### 行高与首行缩进
```java
p{
    /*设置行高*/
    line-height：2；		/*行高：2倍行高*/
    /*设置首行缩进*/
    text-indent:2em;		/*首行缩进2个字符*/
}	
```



### 文字加粗显示
+ b标签
+ strong标签



### 换行标签
br：用于换行，一个br换一行



### 超链接href标签
超链接标签：

	href指定：链接地址（URL地址）

	target指定：打开方式

					_blank：新窗口打开

				    _self：本窗口打开（默认）

```java
    <a href="https://www.cctv.com"target="_blank">央视网</a>

```



### 盒子模型
布局标签：网页开发中，会使用div 和span 这两个没有语义的布局标签。

特点：

div标签:														span标签:

一行只显示一个 (独占一行)						一行可以显示多个

宽度默认是父元素的宽度							高度默认由内容撑开宽度和高度默认由内容撑开

可以设置宽高（width、height）				不可以设置宽高（width、height）



### span标签
**没有语义，对于一些需要单独设置的元素，可以用span标签包裹起来进行修改设置属性**



### 表单标签
在网页中主要负责数据采集功能，如注册、登录等数据采集。

标签：form

表单项：不同类型的input 元素、下拉列表、文本域等。

 注意：**表单项要想能够采集数据，必须得设置name属性，表示当前表单项中的数据的名**

```java
<input>：定义表单项，通过type属性控制输入形式（text/password/...)
<select>：定义下拉列表
    <option>:定义下拉列表中的列表项
<textarea>：定义文本域
```



#### **input**中**type**属性的取值
| type取值 | 描述 |
| --- | --- |
| text | 默认值，定义单行的输入字段 |
| password | 定义密码字段 |
| radio | 定义单选按钮（选项前面是圆圈，只能选一个） |
| checkbox | 定义复选框（选项前面是方框，可以选多个） |
| file | 定义文件上传按钮 |
| date / time / datetime-local | 定义日期（年月日） / 时间（时分秒） / 日期时间（年月日时分秒） |
| hidden | 定义隐藏域（表单中看不到，但是提交的时候会提交过去） |
| submit / reset / button | 定义提交按钮／重置按钮／可点击按钮 |


属性:

+ **action**：规定当提交表单时向何处发送表单数据，**URL**
+ **method**：规定用于发送表单数据的芳式。**GET**、**POST**

实例：

```java
<body>
<!--form表单：
    action：表单数据提交的url地址
    method：提交方式
        get：默认，表单数据会出现在url后面，形式：/save?name=Tom&age=18
            特点：
            1．如果表单中包含了隐私数据，get方式并不安全，不推荐使用该方式.
            2．在浏览器中get请求的大小是有限制的，不适合提交大数据量的表单.
          post：表单数据会在消息体/请求体中提交到服务器
               特点：
            1．安全.
            2．请求大小没有限制	
    注意：表单项要想能够采集数据，必须得设置name属性，表示当前表单项中的数据的名字
-->
<form action="/save"method="get">
    姓名: <input type="text" name="name">
    年龄：<input type="text" name="age">
    <input type="submit" value="提交">
</form>

</body>

```



#### label标签
常用来改善体验，当用label标签把选项的内容全部包起来，无论是点击文字还是前面的选择按钮（方框或者圆圈），都等同于选择该选项

```java
<input type=radio name="gender" value=1>男
<input type=radio name="gender" value=2>女

<label><input type=checkbox name="hobby" value="java">java</label>

<label><input type=checkbox name="hobby" value="C++">C++</label>

<label><input type=checkbox name="hobby" value="python">python</label>

<!--这里的 value 属性有以下作用：

其中value的作用是指定对应的name属性的值为多少，也就是当用户点击对应按钮后，
表单向服务器端提交的数据就是value所指定的内容

-->
```



#### value属性
这里的 `value` 属性有以下作用：

1. **标识选项**：每个复选框的 `value` 值（如 `"java"`、`"C++"`、`"python"`）代表了用户选择的具体内容。



2. **表单数据提交**：当用户提交表单时，如果某个复选框被选中，与该复选框关联的 `name` 和 `value` 会被发送到服务器。例如，如果用户同时选中了 Java 和 Python，提交的表单数据可能是 `hobby=java&hobby=python`。



3. **后端处理依据**：服务器端脚本（如 PHP、Python、Java 等）可以通过 `name`（这里是 `"hobby"`）获取所有被选中的值，从而知道用户选择了哪些选项。



4. **与标签文本的区别**：`value` 属性的值是传递给服务器的实际数据，而标签（如 `Java`、`C++`、`Python`）只是为用户提供的可见文本提示，不会直接提交到服务器。



需要注意的是：

+ 如果没有设置 `value` 属性，复选框默认提交的值是 `"on"`，这通常不是我们想要的结果。
+ 多个复选框可以使用相同的 `name`（如这里的 `"hobby"`），这样服务器可以将它们作为同一组选项处理。
+ 当复选框未被选中时，其 `name` 和 `value` 不会被提交到服务器



#### 搜索栏设置
具体搜索栏主题代码如下：

```html
//普通搜索栏，直接在搜索栏里面输入需要搜索的信息
<form class="search-form" action="/search" method="post">
    <label for="name">姓名：</label>

<input type="text" id="name" name="name" placeholder="请输入姓名">
    
 //下拉搜索栏，点击后会显示下拉菜单
    <label for="gender">性别：</label>

<select id="gender" name="gender">
    <option value=""></option>

    <option value="1">男</option>

    <option value="2">女</option>

</select>

    
<!--
其中id标签定义各个表单名称，用label加for标签对表单进行绑定，绑定后点击label标签中的信息即可进行相对应绑定的搜索栏进行操作，绑定操作是用for=id来进行绑定
-->
```



### 表格标签
+ table标签作为整个表格的主体，
+ thead标签作为表格的表头，第一行的部分
+ tbody标签作为表格的主体
+ tr标签表示一行的内容
+ th表示表头行里面的单元格
+ td表示表格里面普通行的单元格

```html
<table>
    <thead>
        <tr>
            <th>学号</th>

            <th>姓名</th>

            <th>性别</th>

            <th>班级</th>

            <th>操作</th>

        </tr>

    </thead>

    <tbody>
        <tr>
            <td>1545</td>

            <td>闫金超</td>

            <td>男</td>

            <td>15</td>

            <td calss="action-buttons">
                <button type="button">修改</button>

                <button type="button">删除</button>

            </td>

        </tr>

    </tbody>

</table>

```



### 版权展示区
**footer**标签定义底部内容

```html
<footer>
<p>江苏传智播客教育科技股份有限公司</p>

<p>版权所有 Copyright 2006-2024 A11Rights Reserved</p>

</footer>

```



**底部内容只放入需要的内容，具体底部栏的内容是css样式来制作的**

```html
.footer {
    background-color：#b5b3b3；	/*灰色背景*/
    color：口white；	/*白色文字*/
    text-align：center;	/*居中文本*/
    padding：10px0；	/*底部文字上下内边距*/
    margin-top:30px 	/*距离上面内容的边距*/
}
```



### Flex布局（弹性布局）
+ lex是flexibleBox的缩写，意为"弹性布局"，是一种一维的布局模型。flex布局可以为元素之间提供强大的空间分布和对齐能力。
+ 通过**给父容器添加**flex的相关属性，来控制**子元素**的位置和排列方式。



| 属性 | 取值 | 含义 |
| :---: | --- | --- |
| display | flex | 使用flex布局 |
| flex-direction（设置主轴） | row | 主轴方向为x轴，水平向右（默认） |
| flex-direction（设置主轴） | column | 主轴方向为y轴，垂直向下 |
| justify-content（子元素在主轴上的对齐方式） | flex-start | 从头开始排列 |
| justify-content（子元素在主轴上的对齐方式） | flex-end | 从尾部开始排列 |
| justify-content（子元素在主轴上的对齐方式） | center | 在主轴居中对齐 |
| justify-content（子元素在主轴上的对齐方式） | space-around | 平分剩余空间 |
| justify-content（子元素在主轴上的对齐方式） | space-between | 先两边贴边，再平分剩余空间 |


因为搜索表单定义时，是`label`加上`input`两个标签合起来共同实现的输入框的样式，`display=flex`的弹性布局，

 是对父元素开启，对子元素进行排列方式的设置，所以为了**避免输入框前面的内容与输入框分隔太远**，

 就需要用`div`对元素`label`和`input`进行包裹起来使其作为父元素`form`下的同一个子元素，

 然后可以利用`gap`来设置各个组件之间的距离 



## 二，JavaScript
### 引入JS方式
内部脚本：将JS代码定义在HTML页面中

1. 			JavaScript 代码必须位于 **script 标签之间**
2. 			在HTML文档中，可以在任意地方，放置任意数量的 script 
3. 			一般会把脚本置于 **body 元素的底部**，可改善显示速度

```html
<body>

<！-页面内容-->

<script>
    alert('Hello World');
</script>

</body>

```



外部脚本：将JS代码定义在**外部JS文件**中，然后**引入到HTML页面中**

```html
alert('Hello World'); 		/*JS文件名为 demo.js*/

<script src="js/demo.js"> </script>			/*JS引入方式，表示引入js文件夹下的demo.js*/
```

**结束符：每行结尾以分号结尾，结尾分号可有可无**



### JS基本语法
#### 变量&常量
JS中用 **let 关键字**来声明**变量**（弱类型语言，变量可以存放不同类型的值）

变量名需要遵循如下规则：

+ 只能用字母、数字、下划线（_）、美元符号（$）组成，且数字不能开头
+ 变量名严格区分大小写，如name和Name是不同的变量
+ 不能使用关键字，如：let、var、if、for等

```java
<script>
    //变量
    let a =20;
    a = "Hello";
    alert(a);
</script>

```



JS中用 **const** 关键字来声明**常量**

一旦声明，常量的值就不能改变（不可以重新赋值）

```java
<script>
    //常量
    const PI=3.14;
    // PI=3.5;  常量不能被二次赋值
    console.log(PI);
</script>

```



**JS输出结果方式：**

```java
alert（a）; 		//弹框方式输出

console.log (a) ; 		//输出到浏览器控制台

document.write(a);		//输出到body区域
```



#### 数据类型
JavaScript的数据类型分为：**基本数据**类型和**引用数据**类型（对象）。

**使用 typeof 运算符获取数据类型**

```java
<script>
    let a=20；
    alert(typeof a)；//获取数据类型
</script>

```



##### 1.基本数据类型：
+ number：	数字（整数、小数、NaN ( Not a Number ）)
+ boolean:	布尔 true，false
+ null：对象为空。JavaScript是大小写敏感的，因此**null、Null、NULL是完全不同的**
+ undefined：当声明的变量**未初始化时，该变量的默认值是undefined**
+ string：字符串，**单引号、双引号、反引号皆可**，推荐使用单引号



+ 注意：**反引号**引起来的字符串为**模板字符串，可以简化拼接**

###### **模板字符串语法：**
+ 		 (反引号，英文输入模式下按键盘的tab键上方波浪线～那个键）		内容拼接变量时，使用${ }包住变量



```java
模板字符串语法：
        ` ` (反引号，英文输入模式下按键盘的tab键上方波浪线～那个键）
        内容拼接变量时，使用${}包住变量，用反引号包住字符串整体
<script>
let name = 'Tom';
let age = 18;
console.log('大家好，我是新入职的'+name +'，今年'+age+'岁了，请多多关照');
console.log(`大家好，我是新入职的${name}，今年${age}岁了，请多多关照`);
</script>


  <script>
    // 模板字符串拼接
    // 1. 普通字符串拼接
    let str1 = "hello";
    let str2 = `world`;		//需要被包住的变量
    let str3 = str1 + str2;
    console.log(str3);    // helloworld

    // 2. 模板字符串拼接
    let str4 = `hello${str2}`;		//字符串主体
    console.log(str4); // helloworld
  </script>

```

如上两个案例所示，反引号的简化字符串拼接方式，**不是指把需要拼接到其他地方的字符串用反引号括起来**，而是把需要拼接其他字符串的**字符串主体**拼接起来，然后在其中用 **${ }** 包住变量，在程序运行时，因为字符串主体被反引号包住，所以会直接把 **$ { }**中的变量自动拼接到字符串主体中，若不是反引号，则把 ** ${ }**作为字符串打印出来，不会把他转换成对应的变量



##### 2.引用数据类型：
#### 函数
函数（function）是被设计用来执行特定任务的代码块，方便程序的封装复用。

JavaScript中的函数通过 **function** 关键字进行定义。

##### 1.具名函数：
```java
function functionName (参数1，参数2...){
    //要执行的代码
}

//示例
function add (a,b){
    return a + b;
}

//调用形式
let result = add(10,20);
alert(result);
```

注意：**由于JS是弱类型语言，形参、返回值都不需要指定类型。在调用函数时，实参个数与形参个数可以不一致，但是建议一致。**

##### 2.匿名函数：
匿名函数是指一种没有名称的函数，可以通过两种方式定义：**函数表达式**和**箭头函数**。

```java
//函数表达式形式的匿名函数
let	add	= function(a,b){
    return a + b;
}

//箭头函数形式的匿名函数
let add =(a,b)=>{
    return a+b;
}

//匿名函数定义后，可以通过变量名直接调用。
let result = add(10,20);
alert(result);
```

注意：**JS是弱类型语言，定义函数时，形参、返回值都无需指定类型**



#### JS对象
定义格式如下：

```java
let	对象名	=	{
    属性名1：属性值1，
    属性名2：属性值2，
    属性名3：属性值3，
    方法名：function（形参列表）{}
}

//示例如下：
let user =	{
    name:'Tom',
    age: 20,
    gender:'男',
    sing: function	()	{
        alert(this.name+'唱着最炫的民族风')
    }
}

//其中定义函数时的冒号和函数名可以不写，简化格式如下
let	user = {
    name:'Tom',
    age: 20,
    gender:'男',
    sing () {
        alert(this.name+'唱着最炫的民族风')
    }
}

//使用箭头函数时，this指向的不是当前对象，而是当前对象的父级对象
let user = {
    name: 'Tom',
    age: 18,
    gender:'男',
    sing:：() => {			//注意：在箭头函数中，this并不指向当前对象－指向的是当前对象的父级
        alert(this+':悠悠的唱着最炫的民族风~')
    }
}

//调用格式如下：
对象名.属性名；
对象名.方法名();

//示例如下：
console.log(user.name);
user.sing();
```

注意：**在定义对象中的方法时，尽量不要使用箭头函数（this），使用箭头函数时，this指向的不是当前对象，而是当前对象的父级对象**



#### JSON类型
概念：JavaScriptObjectNotation，JavaScript对象标记法（**Js对象标记法书写的文本**）**本质就是字符串，JSON指的是文本字符串的格式为JSON格式**（与JS中自定义对象格式类似）

由于其语法简单，层次结构鲜明，现多用于作为数据载体，在网络中进行**数据传输**（例如前后端数据传输，使用的就是JSON）。

```java
//JS类型自定义对象格式
{
    name: "Tom",
    age: 20,
    gender: "男"
}

//JSON类型字符串格式,本质是字符串，但是在postman中向后端发送请求时，返回的数据为了美观(便于阅读去掉了''或者是"")格式如下
{
    "name": "Tom",
    "age": 20,
    "gender": "男"
}

//实际返回的是数据是下面这样的
'{ "name": "Tom", "age": 20, "gender": "男" }'
//或者是这样的
"{ "name": "Tom", "age": 20, "gender": "男" }"
```

JS中提供了两个方法用于JS自定义对象与JSON类型字符串之间的相互转换。

**JSON.parse( .. )**	：JSON类型字符串转JS类型自定义对象

**JSON.stringify( .. )**  ：JS自定义对象转JSON类型字符串

```java
//3.JSON－JS对象标记法
let person = {
    name:'itcast',
    age: 18,
    gender：'男'
}
alert( JSON.stringify ( person ) );	//js对象-->json字符串
let personJson = '{"name":"heima", "age":18 }';		//因为JSON中里面key值也就是属性值要用双引号，所以最外层用单引号便于区分
alert(JSON.parse (personJson).name);  //JSON类型字符串转JS类型自定义对象
```



##### 注意：
##### postman测试时返回的数据：
也就是**后端返回的数据**

1. Postman 展示的这段数据，**本质上是一个 JSON 格式的字符串**，只是 Postman 为了可读性，在展示时自动去掉了外层的引号（`''` 或 `""`），并进行了格式化（缩进、换行等）。



1. JSON 的本质就是**符合特定语法规则的字符串**（比如键必须用双引号包裹、值只能是字符串 / 数字 / 布尔 / 数组 / 对象 /null 等）。当后端接口返回数据时，传输的是这种字符串形式，而 Postman 作为工具，会自动解析并美化显示，让开发者更直观地看到结构，但这并不改变其 “字符串” 的本质。



2. 当你在前端用 axios 等工具请求数据时，axios 会自动将这段 JSON 字符串**解析为 JavaScript 对象**（通过 `JSON.parse()` 底层实现），所以你才能直接用 `v-for` 遍历、用 `.` 访问属性（如 `p.name`）。



2. 如果用原始的 `XMLHttpRequest` 不做处理，你会看到返回的 `responseText` 就是带引号的字符串形式，需要手动调用 `JSON.parse()` 才能转为 JS 对象。



##### JS对象与JSON字符串数据的区别：
###### 1. JavaScript 对象属性名的引号规则
在 JavaScript 中，对象属性名可以使用以下方式定义：

+ **不加引号**：`{ name: "张三" }`（最常见写法）
+ **单引号**：`{ 'name': "张三" }`（不常见，但合法）
+ **双引号**：`{ "name": "张三" }`（与 JSON 格式保持一致）

这三种写法在 JavaScript 中完全等价，解释器会将它们都解析为对象属性名。 



###### 2. 两种写法对比
写法一（属性名不加引号）：

```java
personList: [
  {
    id: 1,
    gender: '男',
    name: "闫金超",
    age: 21
  }
  // ...
]
```

写法二（属性名加双引号）：

```java
personList: [
  {
    "id": 1,
    "gender": '男',
    "name": "闫金超",
    "age": 21
  }
  // ...
]
```

**两者的区别仅在于语法风格**，JavaScript 解释器会将它们解析为完全相同的对象结构。



###### 3. 与 JSON 的关系
+ **JSON 格式要求**：**属性名必须用双引号包裹**，例如：

```java
{ "name": "张三", "age": 30 }
```

+ **JavaScript 对象**：属性名可以使用单引号、双引号或省略引号。

当你在 JavaScript 代码中直接编写 `{ "name": "张三" }` 时，这仍然是一个 JavaScript 对象，而不是 **JSON 字符串**。只有**当数据以字符串形式存在（例如从服务器获取的响应）时**，才需要区分 JSON 和 JavaScript 对象。



###### 4. 最佳实践建议
+ **在 JavaScript 代码中**：推荐使用无引号的属性名（写法一），这是更简洁的 JavaScript 风格。
+ **与 JSON 交互时**：确保从服务器接收的 JSON 字符串被正确解析为 JavaScript 对象（通常通过 `JSON.parse()` 或 Axios 等库自动处理）。



###### 总结
你的两种写法都是合法的 JavaScript 对象数组定义方式，Vue 的 `v-for` 指令可以同等处理它们。选择哪种写法主要取决于团队编码风格和个人偏好，但在 JavaScript 代码中通常推荐使用无引号的属性名（写法一）





#### DOM类型
概念：DocumentObject Model，文档对象模型。（**把html页面中的内容按标签名分为不同的JS对象**）

+ Document：整个文档对象
+ Element：元素对象
+ Attribute：属性对象
+ Text：文本对象
+ Comment：注释对象

**JavaScript 通过 DoM，就能够对HTML进行操作**：

+ 改变 HTML 元素的内容
+ 改变 HTML 元素的样式（CSS）
+ 对 HTML DOM 事件作出反应
+ 添加和删除 HTML 元素



##### DOM操作
OM操作核心思想：**将网页中所有的元素当做对象来处理**。（标签的所有属性在该对象上都可以找到）

操作步骤：

+ 获取要操作的DOM元素对象
+ 操作DOM对象的属性或方法（查文档（[w3school]([w3school 在线教程](https://www.w3school.com.cn/))）或AI）

获取DOM对象：

+ 根据**CSS选择器**来获取DoM元素，**获取匹配到的第一个元素**：document.querySelector（‘选择器’）
+ 根据**CSS选择器**来获取DoM元素，**获取匹配到的所有元素**：document.querySelectorALl（'选择器'）注意：**得到的是一个NodeList节点集合，是一个伪数组（有长度、有索引的数组可以用索引来指定要操作的对象）**

```java
/*
<h1 id="title1">11111</h1>

<h1>22222</h1>

<h1>33333</h1>

*/

//1.修改第一个h1标签中的文本内容
//1.1获取DOM对象
 let h1 = document.querySelector('#titlel');
let h1=document.querySelector（'h1'）；		//获取第一个h1标签
let hs = document.querySelectorAll('h1');

//1.2调用DOM对象中属性或方法
h1.innerHTML = '修改后的文本内容'；
hs[O].innerHTML = '修改后的文本内容'；
```



### JS事件监听
语法：**事件源.addEventListener（'事件类型'，事件触发执行的函数）**；

事件监听三要素：

1. 事件源：哪个dom元素触发了事件，要**获取dom元素**
2. 事件类型：用**什么方式触发**，比如：鼠标单击click
3. 事件触发执行的函数：**要做什么事**

```java
//语法：事件源.addEventListener（'事件类型'，事件触发执行的函数）；
<input id="btn" type="button" value="点我一下试试2">
<script>
    document.querySelector('#btn').addEventListener('click',()=>{
        alert（'试试就试试'）;
    })	
</script>

```



早期版本写法（了解）：事件源.on事件=function（）{......}

```java

<input id="btn" type="button" value="点我—下试试2">
<script>
    document.querySelector('#btn').onclick =function () {
        alert（'试试就试试'）;
    })
</script>

```

区别：**on方式会被覆盖（添加多个相同触发方式的事件时，新的会把旧的覆盖掉），addEventListener方式可以绑定多次(添加多个相同触发方式的事件)，拥有更多特性，推荐使用**



#### 事件监听类型
绑定事件的方式与上面的鼠标单击事件一样

1. 鼠标事件click：鼠标点击mouseenter：鼠标移入mouseleave：鼠标移出
2. 键盘事件keydown：键盘按下触发**（不能指定特定的按键）**keyup：键盘抬起触发**（不能指定特定的按键）**
3. 焦点事件focus：获得焦点触发（比如鼠标点击输入框）blur：失去焦点触发（焦点指鼠标箭头，鼠标点击输入框以外的地方，输入框失去焦点）
4. 表单事件input：用户输入时触发submit：表单提交时触发



### JS的模块化开发
JavaScript的代码写入到HTML页面中复用性较差，我们可以采用外部引用的方式来引用需要使用的JavaScript代码，同时可以**将JS代码中的重复性或类似功能抽取成一个单独的JS模块**，通过**在JS中引入JS模块**，**在HTML中引入JS文件**来实现JS的模块开发。

1. 首先把JS代码抽取到一个单独的JS文件中，相似功能抽取成JS模块（也就是再抽取为一个单独的JS文件）
2. 模块中的**函数需要暴露（export function）****出来，才能被JS****文件导入（import  { 导入内容 }  from  ' 文件位置'）**
3. 在HTML的 **script 标签中指定引入的JS文件的位置**，同时需**指定 type = "module" 指明引入的JS采用了模块化开发**

示例如下：

HTML页面：

```java
//HTML页面的引入内容，若有模块化的JS，需要指定 type = "module"
<script src="./js/eventDemo.js" type="module"> </script>

```

JS文件：

```java
//抽取的JS内容，在开头用 import { 导入内容 } from '文件位置' 的形式导入
//原本是console.log("")，后抽取为了 utils.js的单独的模块，在模块中定义 printLog函数并 export (暴漏出来)
//不用 export爆露出来，不能被导入到其他JS文件中

import { printLog } from './utils.js'

//click：鼠标点击事件
document.querySelector('#b2').addEventListener('click'，(）=>{
    printLog("我被点击了...")；
})
//mouseenter：鼠标移入
document.querySelector('#last').addEventListener('mouseenter'，()=>{
    printLog("鼠标移入了...")；
})
//mouseLeave：鼠标移出
document.querySelector('#last').addEventListener('mouseleave'，()=>{
    console.log("鼠标移出了...");
})
```

JS功能模块：

```java
//名为 utils的JS功能模块,定义的函数需用 export 爆露出来，否则不能导入到其他JS模块中
export function printLog (msg) {
    console.log(msg) ;
}
```



## 三，Vue框架
[Vue](https://cn.vuejs.org/)是一款用于**构建用户界面（把数据库的数据渲染展示到页面上）****的****渐进式**()JavaScript框架，Vue官网([https://cn.vuejs.org](https://cn.vuejs.org))

Vue核心包：

+ 声明式渲染（构建用户界面）
+ 组件系统

Vue插件：

1. 客户端路由插件：VueRouter
2. 状态管理工具：Vue2版本中叫：VuexVue3版本中叫：Pinia
3. 项目构建工具：Vue2版本中叫：WebpackVue3版本中叫：Vite

开发的两种形式：

1. 只使用Vue核心包开发，局部，模块改造
2. 同时使用Vue核心包，Vue插件工程化开发，整站开发



### Vue快速入门
包括创建Vue应用实例模型（createApp），以及设置对应的数据模型



#### 1. 核心流程的理解
**数据与视图绑定的基本流程**

+ 先在模板（HTML）中通过`{{ 插值表达式 }}`标记数据需要填充的位置（如`{{ message }}`）；
+ 再通过`createApp`创建 Vue 应用实例，在`data()`函数中定义与插值表达式对应的**数据模型**（如`message: "hello vue"`）；
+ 最后通过`mount('#app')`将实例挂载到指定 DOM 元素（`#app`），使 Vue 能够控制该范围内的模板，自动将数据模型中的值填充到插值位置



#### 2. 对 Vue 核心能力的初步认知
 Vue 的核心设计思想 ——**数据驱动视图**：

+ 无需手动编写 DOM 操作代码（如`document.getElementById().innerText = ...`），而是通过定义数据模型，让 Vue 自动处理数据到视图的映射。



#### 3. 需要补充的深层机制
Vue 的功能不止于 “一次性填充”，其核心优势在于**响应式系统**：

+ 当数据模型（如`message`）发生变化时（例如通过代码修改`app.message = "新内容"`），Vue 会自动检测到变化，并**实时更新对应的视图**（插值位置的内容会同步改变），无需手动操作 DOM。
+ 这种 “数据变化→视图自动更新” 的响应式能力，是 Vue 区别于简单模板填充工具的关键。



#### 关于：createApp函数为什么是在（）里面加了一个{  }
在 Vue 3 中，`createApp()` 函数接受一个**选项对象**（即你看到的 `{}`也就是**JS对象**）作为参数，这是 Vue 应用的**配置入口**。这个对象包含了组件的各种选项（如数据、方法、生命周期钩子等），用于定义应用的行为和状态。



### 为什么是 ( ) 里加 {  } ？
这是 JavaScript 函数调用的语法：

+ `createApp()` 是一个函数，**括号 ( ) 用于传入函数参数**，以及调用函数；
+ 括号内的 `{}` 是一个**对象字面量**，作为参数传递给 `createApp`，用于配置 Vue 应用的选项。



+ **对象字面量**是 JavaScript 中创建对象的一种简洁语法，用大括号 `{ }` 包裹键值对来定义对象的属性和方法。



+  **1.基本结构：**

```java
{ 
    key1: value1, 
    key2: value2, 
    ... 
}
```

其中 `key` 是属性名（可省略引号，特殊字符时需加），`value` 可以是任意数据类型（字符串、数字、函数等）。



**2.示例：**

```java
const obj = { 
            name: "Vue", 
            version: 3, 
            run: () => console.log("运行中") 
            }
```

这里直接通过字面量创建了包含 `name`、`version` 属性和 `run` 方法的对象。



**3.作用：**		无需使用 `new Object()` 即可快速创建对象，是 JavaScript 中最常用的对象创建方式，在 Vue 等框架中常用于配置选项（如 `createApp({ ... })` 中的配置对象）



+ let obj={ }的声明对象的方式一样。`createApp({ ... })` 中传入的 `{}` 和 `let obj = { ... }` 中用于声明对象的 `{}` 是**同一种语法 —— 对象字面量**。



### 两者的一致性：
+ 在 JavaScript 中，只要是用 `{}` 直接定义的对象（不通过 `new Object()` 等构造函数），都属于**对象字面量**语法。

```java
// 1. 声明变量时使用对象字面量
let obj = { 
  name: "Vue", 
  version: 3 
};

// 2. 作为函数参数使用对象字面量
createApp({ 
  data() { return { message: "Hello" } },
  methods: { ... }
});
```



这两种场景中的 `{}` 完全遵循相同的语法规则：







**唯一区别：使用场景**





**总结**

`createApp` 中的 `{}` 和 `let obj = {}` 中的 `{}` 是**完全相同的对象字面量语法**，只是使用场景不同：一个作为函数参数，一个用于变量赋值。这也是 JavaScript 中对象字面量灵活性的体现 —— 可以直接在需要的地方定义，无需额外步骤。

    - 内部通过 `key: value` 键值对定义属性 / 方法；
    - 键可以是标识符（如 `name`）、字符串（如 `"version"`）或表达式（如 `[keyVariable]`）；
    - 值可以是任意数据类型（基本类型、函数、对象等）。
    - `let obj = { ... }` 是**将对象字面量赋值给变量**，方便后续复用该对象；
    - `createApp({ ... })` 是**直接将对象字面量作为参数传递给函数**，无需单独声明变量（当然也可以先声明再传递，效果相同）：

```java
// 先声明对象字面量，再传递给createApp
const appOptions = { 
  data() { return { message: "Hello" } } 
};
createApp(appOptions).mount('#app'); // 和直接传{}效果一致
```



### 选项对象的具体内容
传入 **createApp() 的对象可以包含多种选项**，常见的有：

```java
createApp({
  // 1. 数据：定义组件的状态
  data() {
    return {
      message: "Hello Vue"
    }
  },
  
  // 2. 方法：定义组件的行为
  methods: {
    updateMessage() {
      this.message = "Updated!";
    }
  },
  
  // 3. 生命周期钩子：在特定阶段执行代码
  mounted() {
    console.log("组件挂载完成");
  }
}).mount('#app');
```



### 为什么设计成这样？
这种设计让 Vue 应用的配置更**灵活**和**可扩展**：

+ 选项对象可以包含不同类型的配置（数据、方法、生命周期等），使代码组织更清晰；
+ 未来可以轻松添加新的选项，而不破坏现有 API（例如 Vue 3 新增的 `setup()` 函数）。

**总结**

`createApp()` 括号中的 `{}` 是一个配置对象，用于定义 Vue 应用的各种选项



### Vue 应用的执行流程
#### 1. 引入 createApp 函数
从 **Vue 库中导入 **`createApp`** 函数**，它是创建 Vue 应用的入口：

```java
import { createApp } from 'vue';
```



#### 2. 创建应用实例并配置选项
调用 `createApp` 函数时传入一个**选项对象**，包含 `data`、`methods`、`mounted` 等配置：

```java
const app = createApp({
  // 数据：定义响应式状态
  data() {
    return {
      message: "Hello Vue"
    }
  },
  
  // 方法：定义可执行的函数
  methods: {
    changeMessage() {
      this.message = "Updated!"; // 修改数据
    }
  },
  
  // 生命周期钩子：在组件挂载后执行
  mounted() {
    console.log("组件已挂载到DOM");
  }
});
```



#### 3. 挂载应用到 DOM
通过 `mount('#app')` 将应用挂载到 HTML 中的目标元素：

```java
app.mount('#app');
```



此时，Vue 会自动完成以下工作：

+ **初始化数据**：调用 `data()` 函数，将返回的对象转换为**响应式数据**。
+ **编译模板**：解析 HTML 中的插值表达式（如 `{{ message }}`），并与数据绑定。
+ **渲染视图**：将初始数据填充到 DOM 中。
+ **注册方法**：将 `methods` 中的函数绑定到组件实例，可通过 `this` 访问。
+ **触发生命周期钩子**：按顺序执行 `beforeCreate`、`created`、`beforeMount`、`mounted` 等钩子。



#### 4.关键概念总结
| 选项 | 作用 |
| --- | --- |
| data() | 返回响应式数据对象，与模板中的插值表达式绑定。数据变化时，视图自动更新。 |
| methods | 定义组件的方法，可通过事件（如点击按钮）触发执行。 |
| mounted() | 生命周期钩子，在组件挂载到DOM后自动执行（常用于初始化操作，如 API 请求) |


### **总结**
Vue 的核心是**数据驱动视图**和**响应式系统**：



+ **数据绑定**：通过 `data()` 和插值表达式实现。
+ **事件处理**：通过 `methods` 定义交互逻辑。
+ **生命周期管理**：通过钩子函数（如 `mounted`）控制特定阶段的行为。



### Vue常用指令
HTML标签上带有**V-前缀**的特殊**属性**，不同的指令具有不同的含义，可以实现不同的功能。

**Vue指令是属于标签当中的属性，要写在标签当中**

**常用指令:**

| 指令 | 作用 |
| --- | --- |
| v - for | 列表渲染，遍历容器的元素或者对象的属性 |
| v - bind | 为HTML标签绑定属性值，如设置 href，CSS样式等 |
| v - if  /  v - else - if   /  v - else | 条件性的渲染某元素，判定为true时渲染，否则不渲染 |
| v - show | 根据条件展示某元素，区别在于切换的是display属性的值 |
| v - model | 在表单元素上创建双向数据绑定 |
| v - on | 为HTML标签绑定事件 |


#### v - for指令：
渲染列表，遍历容器的元素或者对象的属性

语法:

```java
<tr v-for="(item,index) in items" :key="item.id"> {{item}} </tr>

```

参数说明：

+ items 为遍历的数组
+ item 为遍历出来的元素 ( 可为遍历出来的元素取个别名，例如 empList 中为元素取别名为 e)
+ index为索引下标，从0开始；可以省略，省略index语法：v - for = " item in items "

key:

+ 元素添加的唯一标识，便于vue进行列表项的正确排序复用，提升渲染性能
+ 推荐使用id作为key（唯一），不推荐使用 index 作为 key（会变化，不对应)



注意：**遍历的数组，必须在data中定义；要想让哪个标签循环展示多次，就在哪个标签上使用v-for指令**

案例如下：

```java
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue_v-fro_demo</title>

<style>
  #app{
    width: 80%;  /*宽度*/
    margin: 0 auto; /*居中*/
    border: 1px;  /*边框*/
    border-color: #000000;  /*边框颜色*/
  }
  table{
    width: 100%;  /*宽度*/
    border-collapse: collapse;  /*合并边框*/
    text-algin: center;
  }
  th,td{
    border: 1px solid #000000;
  }
</style>

</head>

<body>
  <div id="app">
    <table>  
      <thead>           
          <!--表头内容，thead指定为表头，tr指定为一行数据，th指定为表头列标题，td为每一列的数据-->
        <tr>
          <th>序号</th>

          <th>头像</th>

          <th>姓名</th>

          <th>性别</th>

          <th>年龄</th>

          <th>身份</th>

          <th>操作</th>

        </tr>

      </thead>

      <tbody>
        <tr v-for="(p, index) in personList" :key="p.id"> 
<!--（）中的p是指需要循环的personList中的一个元素，index是数组索引值，默认从零开始key是对元素的一个标记便于对数据进行操作，数组中索引值对应的数据可能会发生变化，类似于数据库中的主键 -->
          <td>{{p.id}}</td>

          <td><img src="{{p.image}}" alt="{{p.name}}"></td>    
<!--在 HTML 中，<img> 标签的 alt 属性用于为图像提供替代文本。当图像无法显示时（如加载失败、用户使用屏幕阅读器等辅助技术时），这个文本会被显示或朗读出来。alt="avatar" 表示这张图片是一个头像（avatar），如果图片无法加载，用户会看到 "avatar" 这个文本。-->
<!--     <td><img v-bind:src="p.image" :alt="p.name" width="20px"></td>                    -->
          <td>{{p.name}}</td>

          <td>{{p.gender}}</td>

          <td>{{p.age}}</td>

          <!-- v-if 控制数据的显示与隐藏（只渲染条件为真的数据） -->
          <!-- <td>
            <span v-if="p.name=='闫金超'">爸爸</span>

            <span v-if="p.name=='廖青云'">妈妈</span>

            <span v-if="p.name=='乌萨奇'">儿子</span>

          </td> -->

           <!-- v-show 控制元素的显示与隐藏(数据都渲染出来，通过CSS样式来选择显示与隐藏) -->
          <td>
            <span v-show="p.age>18">成年人</span>

            <span v-show="p.age<=18">未成年人</span>

          </td>

          <td>
            <button>修改</button>

            <button>删除</button>

          </td>

        </tr>

      </tbody>

    </table>

  </div>

  <script type="module">
    import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';  //引入vue.js

      createApp({
        data(){
          return {
  /* 在createApp中的data函数的返回值中定义数据模型，[]表示后面是一个数组，数组中数据之间用','隔开，数组中的属性之间用','隔开，最后一个属性的结尾不需要',' */
            personList:[    
              {
                id:1,
                gender:'男',
                name:"闫金超",
                image:"../img/dad.jpg",
                age:21
              },
              {
                id:2,
                gender:'女',
                name:"廖青云",
                image:"../img/mom.jpg",   //当img文件夹与html文件不在同一个文件中，在html文件上一级用 ../
                age:20
              },
              {
                id:3,
                name:"乌萨奇",
                image:"./img/son.jpg",     //当img文件夹与html文件同一个文件中时，用 ./
                gender:'男',
                age:1
              }
            ]
          }
        }
      }).mount('#app')
    
  </script>

</body>

</html>

```

##### 注意：
1. 当在表格中进行图片的替换时，由于插值表达式不能直接写到标签内部，否则会直接原原本本的展示插值表达式

```java
<!-- 插值表达式写到标签中间-->          
<td>{{p.id}}</td>


<!-- 插值表达式写到标签里面,alt表示当图片不能正常显示时，展示的提示信息，此时由于无法正常读取插值表达式，图片不能显示出来，展示alt的内容，{{p.name}}也在标签里面写着，所以直接展示字符串{{p.name}}-->
<td><img src="{{p.image}}" alt="{{p.name}}"></td>  

```

2. 对于data函数中定义的数据模型，由于前后端数据交互采用的都是JSON类型的数据



#### v - bind指令：
场景：**动态为标签属性绑定值 ( 插值表达式，不能在标签内使用 )**

语法：V-bind : 属性 = "变量"／: 属性 = " 变量 "

```java
<!--插值表达式是不能出现在标签内部-->
<td><img class="avatar" v-bind:src="e.image" :alt="e.name"></td>

<!--前一个 v-bind 是完整模式，后一个alt的绑定是 v-bind的简化模式直接 ：属性即可-->
```



#### v - if & v - show指令：
**通过指令后跟的条件表达式的真假来判断是否对元素进行展示**

##### v-if 与 v-show 的区别：
+ v-if：条件不成立,直接不渲染这个元素 (不频繁切换的场景)

```java
<!--V-if：控制元素的显示与隐藏-->
<td>
<span v-if="e.job == 1">班主任</span>

<span v-else-if="e.job == 2">讲师</span>

<span v-else-if="e.job == 3">学工主管</span>

<span v-else-if="e.job == 4">教研主管</span>

<span v-else-if="e.job == 5">咨询师</span>

<span v-else>其他</span>

</td>


<!-- 只展示条件为真的元素，其他元素直接不渲染出来 -->
<td>
<span>班主任</span>

</td>

```

+ v-show：通过css样式,来控制元素的展示与隐藏 (频繁切换的场景)

```java
<!--V-show：控制元素的显示与隐藏-->
<td>
<span v-show="e.job == 1">班主任</span>

<span v-show="e.job == 2">讲师</span>

<span v-show="e.job == 3">学工主管</span>

<span v-show="e.job == 4">教研主管</span>

<span v-show="e.job == 5">咨询师</span>

</td>


<!--先把所有元素渲染出来，条件为真时，通过CSS中的display来进行为真的元素的展示，以及其他元素的隐藏-->
<td>
<span>班主任</span>

<span style="display:none;">讲师</span>

<span style="display:none;">学工主管</span>

<span style="display:none;">教研主管</span>

<span style="display:none;">咨询师</span>

</td>

```



#### v - model 指令：
作用：在**表单元素上使用**，**双向数据绑定**。可以方便的获取或设置表单项数据

语法：v-model="变量名"，**变量必须在data中声明**

```java
<!-- 将id=name这个输入表单与data中定义的searchForm对象的name属性相绑定 -->
<input type="text" id="name" v-model="searchForm.name">  

<form class="search-form">
  <!-- 定义用于绑定搜索表单的数据模型，用于把搜索表单的信息传到后端，绑定模式为v-module="" -->
  <label for="name">姓名：</label>

  <input type="text" id="name" v-model="searchForm.name" placeholder="请输入姓名">

  <label for="gender">性别：</label>

  <select id="gender" v-model="searchForm.gender">
    <option value="">请选择</option>

    <option value="男">男</option>

    <option value="女">女</option>

  </select>

  <!-- 设置按钮，类型为普通按钮，后续绑定自定义函数 -->
   <!-- 第一种绑定方法为完整方法，第二种为简化方法 -->
  <button id="search" type="button" v-on:click="search">搜索</button>

  <button id="reset" type="button" @click="clear">清空</button>

</form>

<!--变量如下-->
<script type="module">
import { createApp }  from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';  //引入vue.js
createApp({
    data(){
//定义数据模型，采集搜索表单数据
        return{
            searchForm:{
                name:'',
                gender:'',
                job:''
            }
        }
    },
     methods:{
          search(){
            alert('您输入的信息为：'+this.searchForm.name+this.searchForm.gender)  
    //在vue实例中若要用定义的数据模型，需要带上this
          },
          clear(){
            this.searchForm.name = ''
            this.searchForm.gender = ''
          }
        }
}).mount('#app')
    </script>

```

双向数据绑定即，**当表单当中输入的信息发生变化时，对应的绑定的数据也会实时变化**，当绑定的数据发生变化时，对应的页面中的表单中输入信息也会发生变化，二者互相影响。但是用户一般无法看到以及更改绑定的数据，所以用户能做的就是在表单输入框中输入信息，当用户输入错误清空信息时，**绑定的数据也会随着用户的操作实时更新**。



#### v - on指令：
作用：事件绑定

语法：v - on: click = " ... "   简化方式  @click=" ... " 

```java
<!--第一种为完整方法，第二种为简化方法-->
<div id="app">
<button type="button" v-on:click="handle">点我</button>

<button type="button" @click="handle">再点我</button>

</div>

<!--绑定的方法需要在createApp中的与data函数同级的位置定义的methods中定义-->
<script type="module">
import { createApp }  from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';  //引入vue.js
createApp({
    data(){
        //......
    },
    methods:{
        handle(){
            console.log('试试就试试')
        }
    }
})
</script>

```

**在vue应用实例中定义的函数中使用实例中需要定义的数据模型时，需要用**`this`**指定**



### Vue生命周期
生命周期的**八个阶段**：每触发一个生命周期事件，会自动执行一个生命周期方法(钩子)

| 状态 | 阶段周期 |
| --- | --- |
| beforeCreate | Vue应用实例创建前 |
| created | Vue应用实例创建后 |
| beforeMount | 挂载页面元素前 |
| mounted | 挂载完成后 |
| beforeUpdate | 数据模型更新前 |
| updated | 数据模型更新后 |
| beforeUnmount | Vue应用实例组件销毁前 |
| unmounted | Vue应用实例组件销毁后 |


**创建钩子函数位置：与**`data`**函数同级**

```java
<script type="module">
import {createApp} from 'https://.../vue.esm-browser.js'
const app = createApp({
        data(){
            return{
                message:"HelloVue"
             }
        }
        //生命周期-钩子函数mounted,在页面加载完毕时，发起异步请求，加载数据，渲染页面。
        mounted(){
            console.Log（'Vue挂载完毕，发送请求获取数据...;
        }
}).mount("#app");
</script>

```



## 四，Ajax请求
作用：

+ 数据交换：通过Ajax可以给**服务器发送请求，并获取服务器响应的数据**。
+ 异步交互：可以在**不重新加载整个页面**的情况下，与**服务器交换数据并更新部分网页**的技术，如：搜索联想、用户名是否可用的校验等等。

#### 同步与异步对比：
1. **同步请求**：当客户端向服务端发送请求时，在请求未完成时，客户端将不能进行任何操作，必须等待请求完成，才能继续后续操作
2. **异步请求**：客户端向服务端发送请求后，客户端继续进行其他事务，不需等待请求完成，当请求完成时，再向客户端响应请求回来的结果



#### Axios工具
[Axios](https://www.axios-http.cn/)** 对原生的Ajax进行了封装，简化书写，快速开发**。

Axios官网：[https://www.axios-http.cn/](https://www.axios-http.cn/)

步骤：

1. 引入Axios的js文件（参照官网）

```java
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>

```

2. 使用Axios发送请求，并获取响应结果

```java
//通过Axios向服务端发送异步请求
axios(
    method:'GET'，
    url:'https://web-server.itheima.net/emps/list'
}).then((result)=>{
    console.log(result.data);
}).catch((err)=>{
    alert(err);
);
    
/*
method:请求方式，GET/POST

url：请求路径

data:请求数据 	
(当请求方式为POST时，需要再请求体中传入数据就用这个)

params：发送请求时携带的url参数    
(当请求方式为GET时也可以直接加入到url地址后面格式为：如：...?key=val,)

then( (result)=>{} )	是成功回调函数，当发送请求成功时，就调用该函数
catch( (err)=>{} )		是失败回调函数，当发送请求失败时，就调用该函数
*/
```

3. 当请求成功时，**result** 中会包含很多信息，例如配置信息和状态码一类....，要获取到服务器端响应到的数据，我们要采用 **result.data** 的格式，此时一般 `result.data` 中包含的有 `code,msg,data``code`表示执行是否成功的状态码`msg`表示执行请求后服务器端返回的提示信息`data`表示执行请求后返回的数据（纯数据不包含其它信息）**所以获得服务器端响应回来的纯数据用`result.data.data**`



#### Axios简化方式
为了方便起见，Axios已经为所有支持的请求方法提供了别名

格式：axios.请求方式 ( url ，data ，config)

+ **url**：请求地址
+ **data**：请求体数据（Post请求中的）
+ **config**：需要发送的配置信息
+ **GET**：数据会附加在 URL 的查询字符串中，例如：`https://example.com/api?name=John&age=30`。
+ **POST**：数据存放在 HTTP 请求体中，不会直接显示在 URL 里。

**GET 方法**主要用于从服务器**获取资源，****而 ****POST 方法****则用于向服务器****提交数据**。这是两者最基本的功能区分

GET请求方式：

```java
/*
反引号的简化字符串拼接方式，不是指把需要拼接到其他地方的字符串用反引号括起来，而是把需要拼接其他字符串的字符串主体拼接起来，然后在其中用 ${ } 包住变量，在程序运行时，因为字符串主体被反引号包住，所以会直接把 ${ }中的变量自动拼接到字符串主体中，若不是反引号，则把 ${ }作为字符串打印出来，不会把他转换成对应的变量
*/

//传参数方法一
axios.get(`https://example/api?name=${this.search.name}`).then((result) =>{
    console.log(result.data);
}).catch((err)=>{
    console.log(err);
);
    
//传参数方法二 
axios.get('https://api.example.com/data', {
  params: {
    name: this.search.name,
    age: this.search.age
  }
})
```

POST请求方式：

```java

axios.post('https://mock.apifox.cn/m1/3083103-0-default/emps/update','id=1').then((result) =>{
    console.log(result.data);
}).catch((err) =>{
    console.log(err);
);
```



#### async & await 作用
**可以通过async、await可以让异步变为同步操作。async就是来声明一个异步方法，await是用来等待异步任务执行**

目的：

当进行开发时，若提交的是异步请求，当请求结果还未返回时，程序就已经执行下面的代码了，不好判断是那个是代码的结果，所以用`async`和`await`来让异步请求变为同步请求。

```java
methods:{
    async search(){
//根据用户输入的搜索条件，基于axios发送异步请求（https://web-server.itheima.net/emps/List）到服务端...
    let result= await axios.get(
        'https://web-server.itheima.net/emps/listname=xxx&gender=xxx&job=xxx');
    this.employees = result.data.data;
    }
}

//await关键字只在async函数内有效，await关键字取代then函数，等待获取到请求成功的结果值
```

注意：`await`关键字只在`async`函数内有效，`await`关键字取代`then`函数，等待获取到请求成功的结果值







##### then( ) 括号的作用
`then()` 后面括号的作用并非仅仅是标注范围，它实际上是在调用 `then` 方法，并且把**回调函数当作参数传递进去**。下面通过代码示例来说明：

```java

fetchData() // 假设这是一个返回 Promise 的函数
  .then(function(result) {
    // 成功回调函数
    console.log(result);
  })
  .catch(error => {
    // 失败回调函数
    console.error(error);
  });
```

从这段代码可以看出，`then()` 是 **Promise 对象**的一个方法，它**接收一个回调函数作为参数**。**当 Promise 状态变为 resolved** 时，就会**执行这个回调函数**。



##### 为什么这样设计？
这种设计是为了支持链式调用。`then()` 方法本身会返回一个新的 Promise 对象，这就使得多个异步操作能够以链式的方式串联起来。

```java
fetchUserData()
  .then(user => fetchUserPosts(user.id))
  .then(posts => processPosts(posts))
  .then(result => displayResult(result))
  .catch(error => handleError(error));
```



#### Promise对象
Promise 是 JavaScript 中用于处理异步操作的对象，它代表一个异步操作的最终完成（或失败）及其结果值。

其核心特点包括：

+ **三种状态**：pending（进行中）、fulfilled（已成功）、rejected（已失败），状态一旦改变就不会再变。
+ **链式调用**：通过 `then()` 方法指定成功时的回调，`catch()` 方法指定失败时的回调，支持多个异步操作**按顺序执行**。
+ **解决回调地狱**：**相比嵌套回调，Promise 用链式写法让异步代码结构更清晰，便于维护**。

例如，发起网络请求时，Promise 会先**处于 pending 状态**，请求**成功后变为 fulfilled 并触发 **`then()`** 里的回调**，**失败则变为 rejected 并触发 **`catch()`** 回调**。



	在 JavaScript 的 Promise 中，**resolved** 是 Promise 对象的一种状态，**表示异步操作成功完成并返回了结果**。

当 Promise 从初始的 `pending`（等待）状态转变为 `resolved` 状态时，会触发通过 `then()` 方法注册的成功回调函数，

并将操作结果作为参数传递给该回调，从而执行后续的处理逻辑。

例如，**在网络请求成功获取数据、异步任务顺利完成等场景下，Promise 就会进入 **`resolved`** 状态。**



#### then方法的链式调用
在 JavaScript 中，Promise 对象的 `.then()` 方法允许链式调用，这是实现异步操作按顺序执行的核心机制。下面详细介

绍链式调用的原理、用法及注意事项。



**关键点**：

1. **每个 .then() 都返回一个新的 Promise**  
无论你在 `.then()` 中是返回一个值、另一个 Promise，还是不返回任何内容，`.then()` 都会返回一个新的 Promise 对象，这使得链式调用成为可能。（因为后续的then方法是否调用，都要看前一个then方法返回的 Promise对象）
2. **回调函数的返回值决定后续 Promise 的状态**
    - 如果返回 **普通值**（或不返回），新 Promise 会立即 **resolved**（表示请求成功），值为返回值。
    - 如果返回 **Promise**，新 Promise 会等待这个 Promise 的结果（resolved（成功） 或 rejected（请求失败））。
    - 如果抛出 **异常**，新 Promise 会立即 **rejected**（表明请求失败）。



#### 一、核心流程详解
##### 1. 每个 `.then()` 返回一个新 Promise
+ **返回普通值**：新 Promise 立即 resolved，值为返回值。
+ **返回 Promise**：新 Promise 等待这个 Promise 的结果。
+ **抛出异常**：新 Promise 立即 rejected。

##### 2. 后续 `.then()` 执行规则
+ **前一个 Promise resolved**：执行下一个 `.then()` 的成功回调。
+ **前一个 Promise rejected**：跳过后续 `.then()`，直到遇到 `.catch()`

```java
Promise1 (resolved)
  ↓
.then(result1 => {
  return result1 + 1; // 返回普通值 → Promise2 resolved
})
  ↓
Promise2 (resolved with result1+1)
  ↓
.then(result2 => {
  return fetchData(); // 返回 Promise → Promise3 等待 fetchData
})
  ↓
Promise3 (等待 fetchData 的结果)
  ↓
.then(result3 => {
  throw new Error('出错了'); // 抛出异常 → Promise4 rejected
})
  ↓
Promise4 (rejected)
  ↓
.catch(error => {
  return handleError(error); // 恢复并返回值 → Promise5 resolved
})
  ↓
Promise5 (resolved with handleError 的结果)
```



#### 二、关键结论
1. **链式调用是线性执行的**  
每个 `.then()` 必须等待前一个 Promise 完成（resolved/rejected）才能执行。
2. **错误会跳过后续 .then()**  
一旦某个 Promise rejected，控制权会直接跳到最近的 `.catch()`，直到错误被处理后才继续执行。
3. **.catch() 后可以继续链式调用**  
`.catch()` 本身也返回 Promise，因此可以在错误处理后继续执行后续操作。



#### 三、常见误区
##### 误区 1：认为 `.then()` 会阻塞后续代码
```java
fetchData()
  .then(() => console.log('完成'));

console.log('这行会先执行'); // 异步操作不会阻塞主线程
```

##### 误区 2：在 `.then()` 中忘记返回值
```java
fetchData()
  .then((data) => {
    processData(data); // 没有返回值 → 隐式返回 undefined
  })
  .then((result) => {
    console.log(result); // undefined
  });
```



##### 总结
Promise 链式调用的核心就是 **状态传递** 和 **线性执行**。理解每个 `.then()` 如何影响后续 Promise 的状态，是编写复杂异步逻辑的关键。



# Web后端开发
## Maven工具
[Maven](http://maven.apache.org/)是一款用于**管理和构建Java项目**的工具，是apache旗下的一个开源项目，它基于**项目对象模型**（POM，把项目看作一个对象）的概念，**通过一小段描述信息来管理项目的构建**

**官网:** [http://maven.apache.org/](http://maven.apache.org/)



1. **依赖管理****传统方式**：引入 jar 包时需要在 java 项目的与 src 同级的位置创建一个存放 jar 包的文件包，然后把官网上下载到的 jar 包放到该文件包下，才能使用 jar 包中的工具类**Maven方式**：在 pom.xml 文件中用 dependencies 标签下的，dependency 标签来添加需要使用的 jar 包，并指定需要使用的版本，此时点击 idea 右侧的 Maven 管理栏点击刷新，Maven即可自动下载对应的 jar 包并自动加入到项目

```java
<dependencies>
    <dependency>
        <groupId>commons-io</groupId>

        <artifactId>commons-io</artifactId>    //jar包名称
        <version>2.16.1</version> 			//jar包版本
    </dependency>

</dependencies>


</project>

```

2. **项目构建流程**标准化的跨平台（Linux、Windows、MacOS）的自动化项目构建方式。**提供了对项目的，编译，测试，打包的一键式操作，便于项目的运行与发布**。



2. 在`idea`中点击项目右侧的`Maven`面板，点击面板中的`Lifecycle`中的`compile（编译），test（测试），package（打			包）`，点击相应的功能即可对项目进行相应操作。



2. **编译：**点击`compile`后会在项目文件夹下生成一个`target`包，这个包里面就是项目代码编译完成后生成的`.class`字节码文件**打包：**点击`package`后会在项目`target`文件夹下生成一个`jar`包，这个包就是项目代码打包完成后生成的`jar`文件



2. **其中**`compile，package`**等都是Maven提供的对项目进行操作的指令，在其他平台例如（Linux、Windows、MacOS）都可以使用**



3. **统一项目管理**对于开发者使用的不互通的开发工具，目录结构不一样无法相通，使用Maven可以对开发提供一个相同的目录结构，便于开发的维护交流。

```java
//Maven项目的文件结构
>maven-project
    >src		//存放项目的总的源代码文件
        >main		//主程序，项目的核心代码
            >java		//java源代码
            >resources		//项目的配置文件
        >test		//测试程序，测试相关代码
            >java		//测试相关的java代码
            >resources		//测试相关配置文件
        pom.xml		//项目的核心配置文件，项目的依赖等内容
```

4. **Maven项目的 pom.xml 文件结构**`pom.xml`文件中包含 **项目对象模型**，**依赖管理模型**，**构建项目生命周期 / 阶段的插件**官方Maven仓库地址：[https://repo1.maven.org/maven2/](https://repo1.maven.org/maven2/)



4. **项目对象模型（POM）**：对项目的位置，名称，版本号的声明



4. **依赖管理模型（Dependency）**：当项目需要用到一些`jar`包中的工具类时，在`Dependency`标签中声明需要使用的`jar`包的位置，版本，名称。



4. 此时`Maven`会先从本地**仓库（存储和管理jar包）**寻找是否有对应的`jar`文件，若有，直接引用到项目中；若没有，则从公司及团队搭建的私服上寻找（如果有私服的话），找到后下载到本地仓库上，然后引用到项目中。或者**本地**（以及**私服仓库**）没有之后直接从**[官方仓库](https://repo1.maven.org/maven2/)**中进行寻找，找到后下载到本地；或者先下载到私服上，在下载到本地上，然后进行引用到项目中。

```java
本地仓库 --> 私服仓库（没有则跳过） --> 中央仓库 --> 下载到私服仓库（没有则跳过）--> 下载到本地仓库
```



**构建项目生命周期/阶段（Build lifecycle & phases）：**例如项目的编译，测试，打包，以及各个操作阶段产生的一系列文件（编译后的`target`包下的`.class`文件，测试文件，`jar`包文件）



pom.xml 文件格式如下：

```java


<?xml version="1.0" encoding="UTF-8"?>
<!--这是 XML 文档的声明部分，用于指定 XML 的版本和编码格式。
version="1.0"：表示使用的 XML 版本为 1.0（目前主流的 XML 版本）。
encoding="UTF-8"：指定文档的字符编码为 UTF-8，确保文档在不同环境下能正确解析中文等特殊字符。-->

<!--<project>是pom.xml的根元素，所有 Maven 项目的配置都嵌套在该元素内。其属性主要用于声明命名空间（XML Namespace），确保 XML 元素的唯一性和解析规范：-->
<project xmlns="http://maven.apache.org/POM/4.0.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-							4.0.0.xsd">
<!-- xmlns="http://maven.apache.org/Pom/4.0.0"
声明默认命名空间，指定当前pom.xml遵循 Maven 4.0.0 版本的 POM（Project Object Model，项目对象模型）规范。
命名空间的作用是区分不同 XML 规范中可能重名的元素（例如，避免 Maven 的<dependency>与其他 XML 规范中的同名元素冲突）。
-->   
    
<!-- xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 声明xsi前缀对应的命名空间，该命名空间来自 W3C（万维网联盟），用于引入 XML Schema（XML 模式）的相关功能。
xsi是一个约定俗成的前缀，用于后续指定 Schema 文件的位置（通过xsi:schemaLocation属性）。
-->
    
<!-- 
xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"
 该属性用于关联命名空间与对应的 XML Schema 文件（.xsd文件），明确 XML 文档的结构约束（例如，哪些元素是必需的、元素的嵌套规则等）。
格式为 “命名空间URL 对应的Schema文件URL”，两个 URL 成对出现：
前半部分http://maven.apache.org/PoM/4.0.0：对应前面声明的默认命名空间。
后半部分http://maven.apache.org/xsd/maven-4.0.0.xsd：指定该命名空间对应的 Schema 文件位置，Maven 会通过该文件验证pom.xml的格式是否符合规范（例如，是否漏写了<groupId>、<artifactId>等核心元素）。
-->
    
<!-- 这部分代码的核心作用是：
定义 XML 文档的基本格式（版本、编码）。
通过命名空间和 Schema 文件，明确pom.xml需遵循 Maven 4.0.0 的规范，确保 Maven 能正确解析项目配置（如依赖、插件、构建规则等）。
后续在<project>元素内，会包含groupId（项目组织 ID）、artifactId（项目唯一 ID）、version（版本号）等核心配置，这些才是 Maven 管理项目的关键信息 -->
    
    
        
<modelVersion>4.0.0</modelVersion>     <!--项目的模型版本-->

<groupId>com.itheima</groupId>			<!--项目的组织名，也可以是公司的域名反写-->
<artifactId>maven_project</artifactId>		<!--项目的名称-->
<version>1.0-SNAPSHOT</version>			<!--项目的版本-->


<properties>
    <maven.compiler.source>17</maven.compiler.source> 		<!--项目开发所使用的JDK版本-->
    <maven.compiler.target>17</maven.compiler.target>		<!--项目运行所使用的JDK版本-->
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>   <!--项目使用的字符集-->
</properties>



<dependencies>
    <dependency>
        <groupId>commons-io</groupId>		<!--项目需要使用的jar包所在的包名-->
        <artifactId>commons-io</artifactId>		<!--项目使用的jar包的名称-->
        <version>2.16.1</version>			<!--项目使用jar包的版本-->
    </dependency>

</dependencies>

```



## Maven的安装
**安装步骤：**

### 1．解压
解压官网下载到的 `apache-maven-3.9.4-bin.zip`文件

```java
//解压后 apache-maven-3.9.4 目录如下
apache-maven-3.9.4
    >bin
    >boot
    >conf
    >lib
```

#### 1.1 bin 目录
+ **功能**：存放 Maven 的可执行脚本。
+ 核心文件：
    - `mvn`（Linux/Mac）和 `mvn.cmd`（Windows）：Maven 的主命令行工具，用于执行各种构建任务（如编译、测试、打包）。
    - `mvnDebug` 和 `mvnDebug.cmd`：调试版本的命令，用于排查 Maven 执行过程中的问题。
    - `mvnWrapper` 和 `mvnw.cmd`：Maven Wrapper 脚本，允许项目自动下载并使用特定版本的 Maven，无需全局安装。

#### 1.2 boot 目录
+ **功能**：存放 Maven 启动时所需的引导类和依赖。
+ 核心内容：
    - `plexus-classworlds`：Maven 的类加载器框架，负责隔离和管理 Maven 自身及其插件的依赖，确保不同版本的库不会冲突。

#### 1.3conf 目录
+ **功能**：存放 Maven 的全局配置文件。
+ 核心文件：
    - `settings.xml`：Maven 的全局配置文件，包含本地仓库位置、远程镜像、认证信息等。可通过 `<localRepository>` 指定本地仓库路径，或通过 `<mirrors>` 配置国内镜像源（如阿里云）以加速依赖下载。
    - `logging` 子目录：包含日志配置文件，控制 Maven 执行过程中的日志级别和输出格式。

#### 1.4lib 目录
+ **功能**：存放 Maven 运行时所需的核心库和依赖。
+ 核心内容：
    - Maven 自身的 JAR 文件（如 `maven-core-*.jar`）：实现项目构建、依赖解析等核心功能。
    - 第三方依赖库：如 Apache HttpClient（用于远程仓库访问）、SLF4J（日志框架）等。

#### 补充说明
+ **本地仓库**：默认位于 `~/.m2/repository`（用户目录下），但可通过 `settings.xml` 配置修改。Maven 下载的所有依赖 JAR 文件都存储在此。
+ **用户配置**：除了全局的 `settings.xml`，每个用户还可在 `~/.m2/settings.xml` 中定义自己的配置，覆盖全局设置。
+ **项目隔离**：通过 Maven Wrapper（`mvnw`），项目可指定特定版本的 Maven，避免因环境中 Maven 版本不一致导致的构建问题。



### 2．配置本地仓库
修改`conf/settings.xml`中的`<localRepository>`为一个指定目录（**作为Maven的本地仓库**）。

```java
<localRepository> D:\develop\apache-maven-3.9.4\mvn_repo </localRepository>

```



### 3．配置阿里云私服
修改conf/settings.xl中的`<mirrors>`标签，为其添加如下子标签:

**若不配置，本地仓库没有需要的**`jar`**包，便直接去国外的中央仓库下载，速度较慢**

```java
<mirror>
    <id>alimaven</id>

    <name>aliyun maven</name>

    <url>http://maven.aliyun.com/nexus/content/groups/public/</url>

    <mirrorof>central</mirrorof>

</mirror>

```



### 4．配置环境变量
`MAVEN_HOME`为`Maven`的解压目录，并将其`bin`目录加入`PATH`环境变量。

**关于环境变量的内容详情见 java学习笔记**



## Maven的IDEA配置
1.在`IDEA`的主界面点击`Customize`后点击`All settings`中的`Build，Execution，Deployment`中的`Build Tools`下的`Maven`中设置`Maven`的

```java
Maven home path："D:/........."			//maven的安装目录
User settings file: "D:/........"			//maven的配置文件settings.xml,在conf包下
Local repository: "D:/........"			//maven的本地仓库目录
```



2.在`Maven`下的`Runner`中配置需要使用的`JRE`版本。

3.在`Build，Execution，Deployment`下的`Compiler`选项下的`Java Compiler`中的`Project bytecode version`中配置要使用的`Java`编译器的版本

### 注意
**配置时要点击**`Close Project`**先把项目关掉**，**去IDEA的主界面配置**，这样配置的**才是对于所有项目的全局配置**，否则只是对单个项目的配置。



## 创建Maven项目
1. 在`IDEA`的欢迎界面选择创建新的空项目，然后创建成功后在`Project Structuer`中设置一下项目使用的JDK版本（一般IDEA会自动配置好检查一下即可）。
2. 然后在空项目下新建一个`Module`左边默认选择`Java`即可，右侧界面选择`Maven`模块，然后指定一下模块名称及组织名即可



### Maven的坐标
1. Maven中的坐标是资源(jar包)的唯一标识，通过该坐标可以唯一定位资源位置（确定要引入的文件）。
2. 使用坐标来定义项目或引入项目中需要的依赖。



#### Maven坐标主要组成
1. groupId：定义当前Maven项目隶属组织名称（通常是域名反写，例如：com.itheima，实际上也是包名）
2. artifactId：定义当前Maven项目名称（通常是模块名称，例如order-service、goods-service）
3. version：定义当前项目版本号
+ SNAPSHOT：功能不稳定、尚处于开发中的版本，即快照版本
+ RELEASE：功能趋于稳定、当前更新停止，可以用于发行的版本

```java
<!--Maven的坐标-->
<groupId>com.itheima</groupId>

<artifactId>maven-project01</artifactId>

<version>1.0-SNAPSHOT</version>

<!--需要引入的jar包的坐标-->
<dependency>
    <groupId>cn.hutool</groupId>

        <artifactId>hutool-all</artifactId>

    <versio>5.8.27</version>

</dependency>

```



## 导入Maven项目
**方式一**：

File - > Project Structure - > Modules  - > Import Module  - > 选择 maven 项目的 pom.xml。

**一般提前把Maven项目拷贝到需要导入的项目下**

**方式二**：

Maven 面板 - > + (Add Maven Projects) - > 选择 maven 项目的 pom.xml。



## Maven的依赖配置
**依赖**：**指当前项目运行所需要的jar包，一个项目中可以引入多个依赖。**

**配置**:

1. 在 pom.xml 中编写`<dependencies>`标签
2. 在`<dependencies>`标签中使用`<dependency>`引入坐标
3. 定义坐标的`groupId,artifactId,version`
4. 点击刷新按钮，引入最新加入的坐标

```java
<dependency>
    <groupId>org.springframework</groupId>

    <artifactId>spring-context</artifactId>

    <version>6.1.4</version>

</dependency>

```

**注意：**

**如果不知道依赖的坐标信息，可以到 **[https://mvnrepository.com/](https://mvnrepository.com/)** 中搜索，找到对应的版本号点击后拷贝依赖坐标，Maven会自动下载，配置完之后需要重载一下**`Maven`**项目**





### 依赖传递
当引入依赖`A`时，若依赖`A`使用到了依赖`B，C`，那么配置依赖时，依赖`B,C`也会被配置进来，这种现象称为**依赖传递**



### 依赖排除
当我们不想要依赖传递传递来的某个依赖时，可以**用**`exclusion`**进行依赖排除**，排除只需指定依赖的组织名及依赖名称

排除时，依赖排除标签写在引入依赖的`dependency`中，

例如：**要排除因为**`spring-context`**依赖而传进来的依赖，排除标签**`exclusion`**要写在引入**`spring-context`**的**`dependency`**里面。**

示例如下:

```java
<!--配置依赖-->
<dependencies>
    
    <dependency>
        <groupId>org.springframework</groupId>

        <artifactId>spring-context</artifactId>

        <version>6.1.4</version>

        
        <!--排除依赖-->
        <exclusions>
            <exclusion>
                <groupId>io.micrometer</groupId>

                <artifactId>micrometer-observation</artifactId>

            </exclusion>

        </exclusions>

    </dependency>

    
<dependencies>
```



### 注意事项
+ **一旦依赖配置变更了，记得重新加载**
+ **引入的依赖在本地仓库不存在，记得联网**



### 依赖范围
依赖的`jar`包，默认情况下，可以在任何地方（这里的任何地方指的是`main`包下）使用。可以通过`<scope>....</scope>`设置其作用范围。

#### 默认的依赖作用范围
+ 主程序范围有效。（`main`文件夹范围内）
+ 测试程序范围有效。(`test`文件夹范围内）
+ 是否参与打包运行。（`package`指令范围内）



#### 如何指定依赖范围
在引入依赖的时候，在依赖的版本号下面，用`<scop>....</scop>`来指定依赖的作用范围

```java
<dependency>
    <groupId>org.junit.jupiter</groupId>

    <artifactId>junit-jupiter</artifactId>

    <version>5.9.3</version>

    <scope>test</scope>   <!--指定了junit-jupiter依赖的作用范围只能在test包范围下-->
</dependency>

```



##### scop 的取值
| scope值 | 主程序(main包下) | 测试程序（test包下） | 打包（运行） | 范例 |
| :---: | --- | :---: | :---: | :---: |
| compile（默认） | Y | Y | Y | log4j |
| test | - | Y | - | junit |
| provided | Y | Y | - | servlet-api |
| runtime | - | Y | Y | `jdbc`驱动 |


注意：打包（package）指的是项目打包时，把依赖一起打包



### 下载依赖报错
首先先刷新一下`Maven`面板，若刷新后还是报错可能是因为下载时网络不通畅，或者下载不完整而残留有残缺依赖文件，导致`Idea`以为已经存在该依赖，不会重新下载，所以刷新后还是报错。

若下载依赖并刷新后还是报错，找到依赖的残留文件进行删除，然后重新下载依赖文件即可。

产生原因：由于网络原因，依赖没有下载完整导致的，在`maven`仓库中生成了`xxx.lastUpdated`文件，该文件不删除，不会再重新下载。

解决方案：

1. 根据maven依赖的坐标，找到仓库中对应的 xxx.lastUpdated 文件，删除，删除之后重新加载项目即可。
2. 通过命令（`del/s＊.lastUpdated`）批量递归删除指定目录下的 xxx.lastUpdated 文件，删除之后重新加载项目即可。当有大量不完整文件时可以这样删除，在找到包含 xxx.lastUpdated 文件的目录后，在该目录的文件路径上输入`CMD`然后用上述命令进行批量删除。



## Maven的生命周期
Maven的生命周期是指`Maven`项目从创建到开发，测试，发布的一系列流程。

Maven中有**3套相互独立**的**生命周期**：

1. clean：清理工作，清理上一次编译产生的字节码文件，以及打包文件等一系列文件
2. default：核心工作，如：编译、测试、打包、安装、部署等。
3. site：生成报告、发布站点等。



每套生命周期包含一些阶段（phase），阶段是有顺序的，**后面的阶段依赖于前面的阶段**（执行后面的阶段的时候前面的阶段都要执行，**加粗的为需要学习的**）。

#### `clean`阶段
+ pre-clean
+ **clean**
+ post-clean



#### `default`阶段
+ validate
+ initialize
+ generate-sources
+ process-sources
+ generate-resources
+ process-resources
+ **compile**
+ process-classes
+ generate-test-sources
+ process-test-sources
+ generate-test-resources
+ process-test-resources
+ test-compile
+ process-test-classes
+ **test**
+ prepare-package
+ **package**
+ verify
+ **install**
+ deploy



#### `site`阶段
+ pre-site
+ site
+ post-site
+ site-deploy



#### 主要学习阶段如下
1. **clean**：**移除上一次构建生成的文件（字节码文件及jar包等文件）**
2. compile：编译项目源代码
3. test：使用合适的单元测试框架运行测试（junit）
4. package：将编译后的文件打包，如：jar、war等
5. **install**：**安装项目到本地仓库**

#### 注意
在**同一套**生命周期中，当运行后面的阶段时，前面的阶段都会运行。

重点注意这个**同一套**指的是处于同一个阶段，比如compile，test，package，install都属于default阶段，当近乎处于**default阶段末尾**的install执行时，前面的同一阶段的compile，test，package都会执行，但是**clean属于前一个clean阶段**，所以**不会执行**。



#### 阶段的执行方式
点击`IDEA`程序右侧的`Maven`面板中的`Lifecycle`，在里面选择想要执行的阶段进行点击即可执行

执行`install`安装后，项目会被安装到本地目录，依据项目的域名（也就是项目所在的包名），来找到安装的项目。

各个**阶段的功能**实际上是**依赖于项目中的插件**`plungs`**来实现的**。



## 软件测试的阶段
测试：是一种用来促进鉴定软件的正确性、完整性、安全性和质量的过程。

**阶段划分**：**单元测试 --->  集成测试 ---> 系统测试 ---> 验收测试**。

**测试方法**：**白盒测试、黑盒测试 及 灰盒测试**。



+ **白盒测试**：清楚软件内部结构、代码逻辑。  
用于验证代码、逻辑正确性。



+ **黑盒测试**：不清楚软件内部结构、代码逻辑。  
用于验证软件的功能、兼容性等方面。



+ **灰盒测试**：结合了白盒测试和黑盒测试的特点，既关注  
软件的内部结构又考虑外部表现（功能）。





### 单元测试
+ 介绍：对软件的基本组成单位进行测试，最小测试单位。
+ 目的：检验软件基本组成单位的正确性。
+ 测试人员：开发人员
+ 测试类型：白盒测试



### 集成测试
+ 介绍：将已分别通过测试的单元，按设计要求组合成系统或子系统，再进行的测试。
+ 目的：检查单元之间的协作是否正确。
+ 测试人员：开发人员
+ 测试类型：灰盒测试



### 系统测试
+ 介绍：对已经集成好的软件系统进行彻底的测试。
+ 目的：验证软件系统的正确性、性能是否满足指定的要求。
+ 测试人员：测试人员
+ 测试类型：黑盒测试



### 验收测试
+ 介绍：交付测试，是针对用户需求、业务流程进行的正式的测试。
+ 目的：验证软件系统是否满足验收标准。
+ 测试人员：客户/需求方
+ 测试类型：黑盒测试



## 单元测试
单元测试：就是针对**最小的功能单元(方法）**，**编写测试代码对其正确性进行测试**，使用**JUnit**进行测试

**JUnit**：最流行的JaVa测试框架之一，提供了一些功能，方便程序进行**单元测试**（第三方公司提供）。

运行单元测试（测试通过：绿色；测试失败：红色）。



### `main`方法测试
使用`JUnit`测试之前，通常采用**`main`方法进行测试**:

1. 测试代码与源代码未分开，难维护
2. 一个方法测试失败,程序便会停止运行，影响后面方法
3. 无法自动化测试，得到测试报告

```java
public class Test{
    public static void main(String[]args）{
        //查询所有的方法测试
        findALLStudent();
        //添加学生
        addStudent(）；
        //修改学生
        updateStudent();
        //删除学生
        deleteStudent(）；
    }
              
    //测试删除学生
    private staticvoid deleteStudent(){...}
    //测试修改学生
    private staticvoid updateStudent(){...}
    //测试添加学生的方法
    private static void addStudent(){...}
    //查询所有的学生数据
    private staticvoid findAllStudent(){...}
}
```



### JUnit单元测试
1. 测试代码与源代码分开，便于维护
2. 可根据需要进行自动化测试
3. 可自动分析测试结果，产出测试报告



#### 测试步骤
1. 在`pom.xml`中，引入`JUnit`的依赖。

```java
<dependency>
    <groupId>org.junit.jupiter</groupId>

    <artifactId>junit-jupiter</artifactId>

    <version>5.9.1</version>

</dependency>

```

2. 在 `test / java `目录下，创建测试类，并编写对应的测试方法，并在方法上声明 **@Test 注 解**。

```java
@Test
publicvoid testGetAge(){
    Integer age =new UserService().getAge("110002200505091218");
    System.out.println(age);
}
```



#### 注意
`JUnit`单元测试类名命名规范为：XxxxxTest【规范】。`JUnit`单元测试的方法，必须声明为 pubLic void【规定】

**规范可以不遵守，规定必须遵守！**



### 断言测试
`JUnit`提供了一些辅助方法，用来帮我们**确定被测试的方法是否按照预期的效果正常工作**，这种方式称为**断言**

在JUnit单元测试中，为什么要使用断言?

1. **单元测试方法运行不报错，不代表业务方法没问题。**
2. 通过断言可以**检测**方法**运行结果是否和预期一致**，从而判断业务方法的正确性
3. `Assertions.assertXxxx ( ... )`



| 断言方法 | 描述 |
| --- | --- |
| Assertions.assertEquals ( object exp, Object act, String msg ) | 检查预期值与结果值是否相等，不相等就报错。 |
| Assertions.assertNotEquals ( object unexp, Object act, String msg ) | 检查预期值与结果值是否不相等，相等就报错。 |
| Assertions.assertNull ( object act,String msg ) | 检查对象是否为nuLl，不为null，就报错。 |
| Assertions.assertNotNull ( object act, String msg ) | 检查对象是否不为null，为null，就报错。 |
| Assertions.assertTrue ( boolean condition, String msg ) | 检查条件是否为true，不为true，就报错。 |
| Assertions.assertFalse ( boolean condition, String msg ) | 检查条件是否为false，不为false，就报错。 |
| Assertions. assertThrows ( class expType, Executable exec, String msg ) | 检查预期异常与实际异常是否相等，不相等，就报错。 |


提示：**上述方法形参中的最后一个参数msg，表示错误提示信息，可以不指定（有对应的重载方法）**。



#### 使用示例如下：
```java
@Test
public void testGenderwithAssert(){
    UserService userService = new UserService();
    String gender = userService.getGender( idCard:"100000200010011011");
    //断言
    //Assertions.assertEquals("男"， gender);
    Assertions.assertEquals( expected:"男"，gender,message:"性别获取错误有问题"）;
}
                            

@Test
public void testGenderWithAssert2(){
    UserService userService = new UserService();
    //断言
    Assertions.assertThrows(IllegalArgumentException.class, () ->{
    userService.getGender( idCard: null);
    });
}                           
```



### Junit 常见注解
在JUnit中还提供了一些注解，还增强其功能，常见的注解有以下几个:

| 注解 | 说明 | 备注 |
| --- | --- | --- |
| @Test | 测试类中的方法用它修饰才能成为测试方法，才能启动执行 | 单元测试 |
| @ParameterizedTest | 参数化测试的注解（可以让单个测试运行多次，每次运行时仅参数不同） | 用了该注解，就不需要aTest注解了 |
| @ValueSource | 参数化测试的参数来源，赋予测试方法参数 | 与参数化测试注解配合使用 |
| @DisplayName | 指定测试类、测试方法显示的名称（默认为类名、方法名） |  |
| @BeforeEach | 用来修饰一个实例方法，该方法会在每一个测试方法执行之前执行一次。 | 初始化资源(准备工作) |
| @AfterEach | 用来修饰一个实例方法，该方法会在每一个测试方法执行之后执行一次。 | 释放资源(清理工作) |
| @BeforeAll | 用来修饰一个**静态方法**，该方法会在所有测试方法之前只执行一次。 | 初始化资源(准备工作) |
| @AfterAll | 用来修饰一个**静态方法**，该方法会在所有测试方法之后只执行一次。 | 释放资源(清理工作) |


示例如下：

```java

```



### 单元测试的覆盖率
单元测试进行时，对各种情况都需要进行测试，此时可以**通过用运行操作里的**`Run'Test' with Coyerage`**功能进行查看测试覆盖率**，

这种测试方式可以看到**单元测试对代码的测试覆盖率**。

测试完成后弹出的面板中会包含`Class,Method,Line,Branch`四个列表，每个列表表示的信息如下：

+ `Class`:表示对某一个类中的代码的覆盖率（哪些测试到了，哪些没有测试到）
+ `Method`:表示对类中的方法的测试覆盖率
+ `Line`:表示对类中代码的测试覆盖率（相对于类中的代码总行数来看，有多少行代码测试到了，多少行没有测试到）
+ `Branch`:表示对类中的分支代码测试的覆盖率，例如`if`语句所造成的分支



#### 如何指定需要测试的的类或者包
点击`Idea`面板的右上角的运行标志旁边的带有当前运行类名的下拉菜单，点击菜单中的`Edit Configurations`，然后在`Code Coverge`中的`Packages and classes to include in coverage data`来进行对测试目标类或者包的切换。



# SpringBoot Web
前端的各种资源（静态，动态资源）都是存储在`Web`服务器上的（例如 Tomcat）。

+ 静态资源：服务器上存储的不会改变的数据，通常不会根据用户的请求而变化。比如：HTML、CSS、JS、图片、视频等(负责页面展示)
+ 动态资源：服务器端根据用户请求和其他数据动态生成的，内容可能会在每次请求时都发生变化。比如：Servlet、JSP等(负责逻辑处理)，目前已被淘汰，取而代之的是（Spring）

用户用浏览器向服务器发送请求以及服务器返回信息时遵循的都是`HTTP`协议:

Web 应用（例如网页版抖音，天猫，京东）架构为 BS 架构：  
Browser/Server，浏览器/服务器架构模式。客户端只需浏览器，应用程序的逻辑和数据都存在服务器端。（维护方便体验一般）

客户端应用（就是安装的软件）：  
`Client/Server`，客户端/服务器架构模式。需要单独开发维护客户端。（体验不错 开发维护麻烦）



## SpringBoot Web入门
[Spring](官网: spring.io) 是`SpringBoot`的基础，SpringBoot 是基于 Spring 开发出来的框架，Spring 中的各种框架，都是基于 Spring FrameWork（也就是 Spring）来开发出来的，相对于直接使用 Spring 来开发项目，SpringBoot 会更简单。



### SpringBoot  Web 创建
新建项目 -- > `Spring Boot / Spring Initializr` -- > 设置 `Spring Boot `的 `name` ，`Group ，Artifact（模块名称），Type 选 Maven`  -- >`Packing(打包方式选 jar 包)`

第一步完成后点击`select` 进行下一步，设置`Spring Boot`的版本以及在`Dependencies`的`Web`下选择`Spring Web`依赖，这样创建时会自动引入该依赖。

注意建立`SpringBoot`项目时，里面的`Package name`指的是建立好后的项目中的`main`包和`test`包下的`java`文件包结构，一个点就是一个包（点是包名之间的分界线）。

创建好之后只需要保存，目录`src`和`pom.xml`以及`.iml`文件即可。

创建成功后会在 main 包的 java 包下自动生成一个**启动类用来启动项目**，在 test 包下的 java 包下生成一个**测试类来进行对项目的测试**。



#### main 包作用
1. `java` 包存放项目源代码
2. `resources`包存放一些资源文件	`static`: 存放一些页面静态资源文件，例如`HTML,CSS,JS`等。	`templates`: 存放模板文件	`application.properties`: 存放`SpringBoot`的配置文件



创建成功后会在`src --> main --> java`包下自动创建一个启动类用来启动项目。

启动类如下：

```java
package org.springboot.springbootweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


//启动类，用来启动项目
//注解为标志启动类的注解
@SpringBootApplication
public class SpringBootWebApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootWebApplication.class, args);
    }

}

```



创建成功后的`pom.xml`文件如下：

```java
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

<!--    父工程-->
    <parent>
        <groupId>org.springframework.boot</groupId>

        <artifactId>spring-boot-starter-parent</artifactId>

        <version>3.5.5</version>

        <relativePath/> <!-- lookup parent from repository -->
    </parent>

<!--    项目的坐标及描述信息-->
    <groupId>org.SpringBoot</groupId>

    <artifactId>SpringBoot-Web</artifactId>

    <version>0.0.1-SNAPSHOT</version>

    <name>SpringBoot-Web</name>

    <description>SpringBoot-Web</description>

<!--    作用不大，基本用不到，删掉也可以-->
<!--    <url/>-->
<!--    <licenses>-->
<!--        <license/>-->
<!--    </licenses>-->
<!--    <developers>-->
<!--        <developer/>-->
<!--    </developers>-->
<!--    <scm>-->
<!--        <connection/>-->
<!--        <developerConnection/>-->
<!--        <tag/>-->
<!--        <url/>-->
<!--    </scm>-->


    <properties>
        <java.version>17</java.version>

    </properties>

    <dependencies>

        <!--引入的Web依赖，并没有指定版本，因为在上面parent父工程里已经指定过版本信息-->
        <dependency>
            <groupId>org.springframework.boot</groupId>

            <artifactId>spring-boot-starter-web</artifactId>

        </dependency>

<!--        项目的测试依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>

            <artifactId>spring-boot-starter-test</artifactId>

            <scope>test</scope>

        </dependency>

    </dependencies>

    <build>
<!--        项目的打包插件-->
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>

                <artifactId>spring-boot-maven-plugin</artifactId>

            </plugin>

        </plugins>

    </build>

</project>

```



#### 起步依赖
一个`main`方法就能直接启动项目的原因是因为引入的`spring-boot-starter-web`依赖已经包含了项目所需的启动文件。

1. `spring-boot-starter-web`：包含了`web`应用开发所需要的常见依赖。
2. `spring-boot-starter-test`：包含了单元测试所需要的常见依赖。
3. 官方提供的`starter`:https://docs.spring.io/spring-boot/docs/3.1.3/reference/htmlsingle/#using.build-systems.starters(包含了各种类型项目功能的起步依赖)

当我们需要开发某一个功能时，只需要引入对应的起步依赖即可，因为`Maven`项目具有依赖传递，当我们引入相关启动依赖时，与该项目功能相关的所需的依赖都会通过引入的起步依赖进行依赖传递，全部传递进来。

当我们运行网页项目时，需要`Web`服务器，但是由于起步依赖中已经包含了依赖传递来的`Tomcat`服务器的相关依赖，所以我们在开发项目时不需单独安装`Tomcat`服务器。内嵌`Tomcat`服务器。

启动类的作用是启动引入的`Tomcat`服务器。默认监听端口号是 8080，服务器启动后会把我们写的代码部署到服务器中，然后就可以通过`https://localhost:8080/....`请求路径来访问我们写的页面。



#### 完成 SpringBoot-Web 的 HelloWorld
在`main`包下的`java`包下建立请求处理类（业务层），用`@RestController`来进行注解标注该类为一个业务类（请求处理类），然后在里面的业务方法上用`@RequestMapping`来指定该方法对应的请求路径。

示例如下：

```java
package org.springboot.springbootweb;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//标注该类为一个请求处理类，业务层，对请求路径进行响应
@RestController
public class HelloSpringBoot {

    //指定方法对应的请求路径
    @RequestMapping("/hello")
    public String HelloSpring(String spr){
        System.out.println("Hello"+spr);
        return "Hello"+spr;
    }
}

```



##### 注意
**业务类只能写到与启动类同一个目录下**，若是单独建了一个**与启动类不在同一目录**的`controller`包，把业务类放到了`controller`包下，会出现找不到页面的问题，原因是写在**与启动类不是同级目录**的`controller`包下的业务类不能被`Spring Boot`的启动类（也叫主类）扫描到，不在主类的扫描范围。

创建时若是出现`Error：Error message: Cannot download*https://start.spring.io Connecttimed out`，说明**连接不上**`Spring`**的官方提供的模板骨架**，此时需要更换为国内的**阿里云提供的**`Spring`**骨架**

在`Server URL`处更换原本的`https://start.spring.io`为：`https://startaiyun.com`把**原本使用的**`Spring`**官网提供的地址换为国内阿里云提供的创建模板骨架地址**。



## TCP 协议：互联网可靠数据传输的 “核心规则”
TCP（Transmission Control Protocol，传输控制协议）是互联网中**面向连接、可靠的字节流传输协议**，位于 TCP/IP 协议栈的传输层，主要作用是为应用层（如网页浏览、文件传输、即时通讯）**提供 “不丢包、不重复、按序到达” 的数据传输保障**，是支撑绝大多数网络服务稳定运行的基础。



### 一、TCP 的核心定位：为什么需要它？
网络传输的本质是 “数据在多个设备间传递”，但底层网络（如 IP 层）存在天然缺陷：**IP 协议仅负责 “把数据包送到目标地址”，不保证数据包不丢失、不乱序、不重复。**  
而 TCP 的核心价值就是**弥补这些缺陷**—— 比如你通过微信发一段语音，语音会被拆成多个小数据包，TCP 会全程 “保驾护航”：确保所有数据包完整到达对方设备，且按原本顺序重组，最终让对方听到连贯的语音，而非碎片化的内容。



### 二、TCP 的 5 个关键特性：可靠传输的 “底层逻辑”
TCP 的 “可靠性” 并非单一机制实现，而是由 5 个核心特性共同支撑，这些特性也是理解 TCP 的关键：



#### 1. 面向连接：先 “握手”，再传数据
TCP 传输前必须先建立 **双向连接**，就像打电话要先拨通、确认对方接听，再开始说话。这个过程被称为**三次握手（Three-Way Handshake）**，具体步骤如下：

+ **第 1 次（客户端→服务器）**：客户端发送`SYN`报文（请求连接），表示 “我想和你传数据，能接吗？”；
+ **第 2 次（服务器→客户端）**：服务器回复`SYN+ACK`报文（同意连接 + 确认收到请求），表示 “我能接，你可以发了”；
+ **第 3 次（客户端→服务器）**：客户端发送`ACK`报文（确认收到回复），表示 “好的，连接正式建立”。



**为什么需要 3 次？** 避免 “单向连接失效”—— 比如客户端发了请求但服务器没收到，或服务器回复了但客户端没收到，3 次握手能确保 “双方都确认：对方能发、也能收”，避免无效数据传输。



#### 2. 可靠传输：丢包重传，不缺不漏
TCP 通过 “确认应答（ACK）” 和 “重传机制” 保证数据不丢失：

+ 发送方每传递一个数据包，会给数据包标上 “序号”（方便接收方按序重组）；
+ 接收方收到数据包后，会立即回复`ACK`报文（确认 “已收到序号 XX 的数据包”）；
+ 若发送方在规定时间内没收到`ACK`（说明数据包丢失或`ACK`丢失），会自动重新发送该数据包，直到接收方确认收到。



比如传文件时，若 “第 5 个数据包” 在传输中丢失，发送方会重新发送第 5 个包，确保接收方不会漏收任何数据。



#### 3. 按序交付：给数据 “排好队”
TCP 会给每个数据包分配唯一的 “序号”（**基于数据的字节流顺序**），接收方收到数据包后，会按照序号将数据重新排列 —— 即使传输过程中数据包因网络路由不同导致 “乱序到达”（比如第 3 包比第 2 包先到），接收方也能通过序号调整顺序，最终输出和发送方一致的完整数据。



#### 4. 流量控制：“别发太快，我接不住”
若**发送方传递数据的速度远超接收方的处理能力**（比如接收方设备内存小、CPU 繁忙），接收方会因 “来不及处理” 导致数据包丢失。  
**TCP 的 “流量控制” 通过 “滑动窗口” 机制解决此问题**：

+ 接收方会告诉发送方 “我当前最多能接收 X 个数据包”（即 “窗口大小”）；
+ 发送方严格按照 “窗口大小” 发送数据，只在收到接收方的`ACK`确认后，才 “滑动窗口” 继续发送下一批数据，避免 “发得太快导致丢包”。



#### 5. 拥塞控制：“路堵了，先慢点”
除了接收方的处理能力，网络本身也可能 “拥堵”（比如高峰期多人同时刷视频、下载文件）。若网络已拥堵，发送方仍大量发数据，会加剧拥堵、导致更多丢包。  
**TCP 的 “拥塞控制” 会实时感知网络状态并调整发送速率**：

+ **慢启动**：初始阶段缓慢增加发送量（如先发 1 个包，确认后发 2 个，再发 4 个），避免突然占用大量带宽；
+ **拥塞避免**：当发送量达到一定阈值后，缓慢增加发送量，降低拥堵风险；
+ **快速重传 / 恢复**：若检测到丢包（说明网络拥堵），立即减少发送量，并快速重传丢失的数据包，待网络恢复后再逐步提升速率。



### 三、TCP 的 “收尾”：四次挥手，优雅断开连接
当数据传输完成（如关闭网页、挂断视频），TCP 需要通过**四次挥手（Four-Way Handshake）** 断开连接，确保双方都 “不再等待数据”：

1. **客户端→服务器**：发送`FIN`报文，请求 “我这边没数据要发了，准备断开连接”；
2. **服务器→客户端**：发送`ACK`报文，确认 “收到你的断开请求，我先检查是否有未传完的数据”；
3. **服务器→客户端**：若服务器也无数据可传，发送`FIN`报文，请求 “我这边也准备好了，断开吧”；
4. **客户端→服务器**：发送`ACK`报文，确认 “收到你的请求，正式断开连接”。



**为什么需要 4 次？** 因为服务器收到客户端的断开请求后，可能仍在处理剩余数据（如收尾、校验），无法立即回复`FIN`，需分 “确认请求” 和 “发起断开” 两步，确保双方都无残留数据后再断开。



### 四、TCP 的应用场景
TCP 的 “可靠性” 使其适合所有**对数据完整性要求高**的场景，常见包括：

+ 网页浏览（HTTP/HTTPS 协议基于 TCP）；
+ 文件传输（FTP、网盘下载）；
+ 即时通讯（微信文字 / 语音消息、QQ 聊天）；
+ 邮件发送（SMTP 协议基于 TCP）；
+ 视频会议（需确保语音 / 画面连贯，无明显卡顿丢包）。



与之相对，若场景**更看重 “速度”** 而非 “绝对可靠”（如视频直播、游戏实时画面），则会使用 **UDP 协议（TCP 的 “兄弟协议”，无连接、不可靠但传输更快**）。



### 一句话总结
TCP 就像一位 “细心的快递员”：传输前先确认对方 “能收件”（三次握手），把包裹拆小标好顺序（分片编号），对方收一个确认一个（ACK），对方收得慢就少发点（流量控制），路上堵就慢点送（拥塞控制），送完后确认双方都 “没问题” 再离开（四次挥手）—— 用一套完整的机制，确保数据 “安全、完整、有序” 到达目的地。





## HTTP 协议
特点：

1. 基于TCP协议：面向连接，安全
2. 基于请求-响应模型的：一次请求对应一次响应
3. HTTP协议是无状态的协议：对于事务处理没有记忆能力。每次请求-响应都是独立的。
4. 缺点：多次请求间不能共享数据。  
优点：速度快
5. 建立浏览器与服务器沟通的桥梁。规定数据传输的格式请求发送格式以及服务层回应数据格式，确保双方都能看懂传来的数据。



## HTTP协议：互联网“数据沟通”的通用语言
HTTP（HyperText Transfer Protocol，超文本传输协议）是**客户端（如浏览器、手机APP）与服务器之间传输数据的规则集合**，位于TCP/IP协议栈的应用层。简单来说，当你打开网页、刷朋友圈、看在线视频时，背后都是HTTP（或其安全版本HTTPS）在“帮你和服务器说话”，比如告诉服务器“我要加载这个网页”，再接收服务器返回的“网页内容”。





### 一、HTTP的核心定位：为什么它是“通用语言”？
互联网由无数台服务器（存储网页、视频、数据）和客户端（访问这些资源的设备）组成，不同设备、不同系统（如Windows、iOS）的“沟通方式”本不相同。  
HTTP的价值就是**定义一套“通用规则”**：无论客户端是电脑还是手机，服务器用的是Linux还是Windows，只要都遵守HTTP，就能理解彼此的请求和响应——就像全世界人都用英语交流，无需担心“听不懂”。





### 二、HTTP的3个关键特性：理解它的“性格”
**HTTP的设计围绕“简单、灵活、无状态”**展开，这些特性决定了它如何工作：



#### 1. 基于请求-响应：“一问一答”的模式
**HTTP的通信永远是“客户端先问，服务器再答”**，没有“服务器主动找客户端”的情况，就像你去餐厅吃饭：

+ **请求（Request）**：你告诉服务员“我要一份汉堡”（客户端向服务器发送需求）；
+ **响应（Response）**：服务员把汉堡给你（服务器向客户端返回结果）。

只有客户端发起请求，服务器才会返回响应；若客户端不发请求，服务器不会主动推送数据（比如你不刷新网页，服务器不会自动把新内容传给你——这一点后来被`WebSocket`补充，但HTTP本身不支持）。



#### 2. 无状态（Stateless）：“记不住之前的事”
HTTP是“无状态”协议，意思是**服务器不会记住“上一次和客户端的沟通内容”**。比如你第一次访问某购物网站，登录了账号；第二次再访问时，若没有额外机制（如`Cookie`），服务器会“不认识你”，需要你重新登录——就像你去咖啡店，服务员每次都问“你要什么”，不会记住你上次点的拿铁。

“无状态”的好处是服务器不用存储大量历史数据，处理请求更快；缺点是需要额外手段（Cookie、Session）来“记住用户状态”（比如登录、购物车内容）。



#### 3. 灵活可扩展：“能传各种数据”
HTTP最初是为传输“超文本”（如HTML网页）设计的，但后来通过“头部字段”（Header）扩展，能传输几乎所有类型的数据：

+ 文本（网页代码、文档）；
+ 图片（JPG、PNG）；
+ 视频（MP4）；
+ 音频（MP3）；
+ 二进制文件（安装包、压缩包）。

**只要在请求/响应的头部说明“要传的数据类型”，服务器和客户端就能正确处理**——就像快递包裹上贴了“易碎品”“生鲜”标签，收件方知道该怎么处理。



### 三、HTTP的工作流程：从“打开网页”看全过程
以你在浏览器输入“[www.baidu.com”并按下回车为例，HTTP的完整工作流程如下：](http://www.baidu.com”并按下回车为例，HTTP的完整工作流程如下：)



1. **URL解析**：浏览器先把“[www.baidu.com”解析成“百度服务器的IP地址”（通过DNS协议，相当于查“电话号码本”）；](http://www.baidu.com”解析成“百度服务器的IP地址”（通过DNS协议，相当于查“电话号码本”）；)



2. **建立TCP连接**：浏览器和百度服务器通过TCP“三次握手”建立可靠连接（毕竟要确保网页数据不丢包，参考之前讲的TCP协议）；



3. **发送HTTP请求**：浏览器向服务器发送HTTP请求，告诉服务器“我要加载百度首页”，请求内容包含3部分：
    - **请求行**：核心信息，比如“GET / HTTP/1.1”（GET表示“获取资源”，/表示“根目录”，HTTP/1.1是协议版本）；
    - **请求头部**：补充信息，比如“浏览器类型（Chrome）”“能接收的数据类型（HTML、图片）”；
    - **请求体**：可选，比如你登录时输入的账号密码（只有“提交数据”的请求才会有，如登录、填表单）；

```java
POST /brand HTTP/1.1
Accept: application/json,text/plain,*/*
Accept-Encoding: gzip,deflate,br
Accept-Language: zh-CN,zh;q=0.9
Content-Length: 161
Content-Type: application/json;charset=UTF-8
Cookie: Idea-8296eb32=841b16f0-0cfe-495a-9cc9-d5aaa71501a6;JSESSI0NID=0FDE4E430876BD9C5C955F061207386F
Host: 1ocalhost:8080
User-Agent: Mozi1la/5.0(Windows NT 10.0; Win64; x64)AppleWebKit/537.36(KHTML，1ike Gecko） Chrome/...

{"status":1,"brandName":"黑马","companyName":"黑马程序员","id":"","description":"黑马程序员"}
```

```java
     
  
   
4. **服务器处理请求**：百度服务器接收请求，判断“客户端要首页”，然后准备首页的HTML代码、图片等资源；

   

5. **发送HTTP响应**：服务器向浏览器返回HTTP响应，包含3部分：
   - **响应行**：核心结果，比如“HTTP/1.1 200 OK”（200是状态码，表示“请求成功”，OK是描述）；

   - **响应头部**：补充信息，比如“返回数据的类型（HTML）”“数据大小”；

   - **响应体**：实际数据，比如百度首页的HTML代码、图片二进制数据；

     ```http
     HTTP/1.1 200 OK
     Content-Type:application/json
  Transfer-Encoding:chunked
     Date:Tue,10May 202207:51:07GMT
  Keep-Alive:timeout=60
     Connection:keep-alive
     
     [{id：1，brandName：“阿里巴巴"，companyName：“腾讯计算机系统有限公司"，description：“玩玩玩"}]
```

     

6. **关闭TCP连接**：若数据传输完成，浏览器和服务器通过TCP“四次挥手”断开连接（部分场景会保持连接，即“长连接”，减少重复握手的时间）；



7. **浏览器渲染页面**：浏览器解析响应体中的HTML、CSS、JS代码，最终把百度首页显示在屏幕上。



#### 请求的数据格式
第一行为请求行，后面的以`key : value `形式出现的都是请求头，若是`POST`方式的请求，在请求头的下方还有一个请求体，是客户端/浏览器向服务器发送的请求体的数据，一般与请求头会有一空行隔开。`GET`方式的请求体是在请求路径后面一并传输到服务器的。

1. 请求方式-GET：请求参数在请求行（请求路径）中，没有请求体，如：/brand/findALL?name=OPPO&status=1。GET请求大小在浏览器中是有限制的。
2. 请求方式-POST：请求参数在请求体中，POST请求大小是没有限制的

请求体如下：

```java
POST /brand HTTP/1.1
Accept: application/json,text/plain,*/*
Accept-Encoding: gzip,deflate,br
Accept-Language: zh-CN,zh;q=0.9
Content-Length: 161
Content-Type: application/json;charset=UTF-8
Cookie: Idea-8296eb32=841b16f0-0cfe-495a-9cc9-d5aaa71501a6;JSESSI0NID=0FDE4E430876BD9C5C955F061207386F
Host: 1ocalhost:8080
User-Agent: Mozi1la/5.0(Windows NT 10.0; Win64; x64)AppleWebKit/537.36(KHTML，1ike Gecko） Chrome/...

{"status":1,"brandName":"黑马","companyName":"黑马程序员","id":"","description":"黑马程序员"}
```



##### 请求头的内容
| Host | 请求的主机名 |
| --- | --- |
| User-Agent | User-Agent浏览器版本，例如Chrome浏览器的标识类似Mozilla/5.0...Chrome/79，IE浏览器的标识类似Mozilla/5.0 (Windows NT ...）like Gecko |
| Accept | 表示浏览器能接收的资源类型，如text/*，image/_或者_/*表示所有; |
| Accept-Encoding | 表示浏览器可以支持的压缩类型，例如gzip，deflate等。 |
| Accept-Language | 表示浏览器偏好的语言，服务器可以据此返回不同语言的网页； |
| Content-Type | 请求主体的数据类型。 |
| Content-Length | 请求主体的大小（单位：字节）。 |


#### 响应的数据格式
第一行为响应行（包括当前使用的协议，状态码，对响应信息的描述），后面的以 `key : value `键值对形式出现的都是响应头，第三部分是响应体，与响应头同样有一空行隔开。

响应体格式如下：

```java
HTTP/1.1 200 OK
Content-Type:application/json
Transfer-Encoding:chunked
Date:Tue,10May 202207:51:07GMT
Keep-Alive:timeout=60
Connection:keep-alive

[{id：1，brandName：“阿里巴巴"，companyName：“腾讯计算机系统有限公司"，description：“玩玩玩"}]
```



##### 响应体的内容
###### 状态码
| 状态码 | 状态码信息 |
| --- | --- |
| 1xx | 响应中-临时状态码，表示请求已经接收，告诉客户端应该继续请求或者如果它已经完成则忽略它 |
| 2xx | 成功-表示请求已经被成功接收，处理已完成 |
| 3xx | 重定向-重定向到其他地方；让客户端再发起一次请求以完成整个处理。 |
| 4xx | 客户端错误一处理发生错误，责任在客户端。如：请求了不存在的资源、客户端未被授权、禁止访问等。 |
| 5xx | 服务器错误一处理发生错误，责任在服务端。如：程序抛出异常等 |


###### 状态码的 3xx 重定向解析
当浏览器向某个服务器发送请求，但是该服务器中没有请求对应的资源，请求的资源在另一个服务器。此时服务器 A 就会返回一个响应体，**状态码为 3xx 同时响应体中还有一个请求头为**` Location：......`，浏览器接收到响应体后**发现状态码为 3xx 表示需要重定向（跳转页面），便会依据响应体中的 **`Location`**来跳转到指定的服务器来获取需要的资源**，用户是不需要进行刷新页面的，跳转=是浏览器自行完成的。



###### 响应头
| 响应头 | 响应头信息 |
| --- | --- |
| Content-Type | 表示该响应内容的类型，例如text/html，application/json。 |
| Content-Length | 表示该响应内容的长度（字节数 |
| Content-Encoding | 表示该响应压缩算法，例如gzip。 |
| Cache-Control | 指示客户端应如何缓存，例如max-age=300表示可以最多缓存300秒 |
| Set-Cookie | 告诉浏览器为当前页面所在的域设置cookie |


### 四、HTTP的核心要素：请求方法、状态码、版本
这三个要素是HTTP的“核心组件”，决定了请求的目的、响应的结果和协议的能力。



#### 1. 常用请求方法：“告诉服务器要做什么”
请求方法定义了客户端对服务器资源的“操作意图”，最常用的有4种：

| 方法 | 作用 | 例子 |
| --- | --- | --- |
| **GET** | 获取服务器上的资源（如网页、图片） | 打开百度首页（GET / HTTP/1.1） |
| **POST** | 向服务器提交数据（如登录、表单提交） | 输入账号密码登录网站（提交数据到服务器） |
| **PUT** | 更新服务器上的资源（全量更新） | 修改个人资料（把“年龄20”改成“年龄21”） |
| **DELETE** | 删除服务器上的资源 | 删除网盘里的一个文件 |


其中**GET和POST的区别**最常用：

+ GET：数据会拼在URL里（如“[www.xxx.com?name=张三”），适合传少量、非敏感数据；](http://www.xxx.com?name=张三”），适合传少量、非敏感数据；)
+ POST：数据在“请求体”里，不显示在URL，适合传大量、敏感数据（如密码）。



#### 2. 常见响应状态码：“服务器的‘回复表情’”
状态码是服务器用“数字”告诉客户端“请求处理结果”，共分5大类（1xx-5xx），常见的有：

| 状态码 | 类别 | 含义 | 例子 |
| --- | --- | --- | --- |
| 200 | 成功（2xx） | 请求成功，服务器返回数据 | 打开网页成功 |
| 302 | 重定向（3xx） | 请求的资源“搬家了”，服务器指引新地址 | 访问旧网址时，自动跳转到新网址 |
| 404 | 客户端错误（4xx） | 服务器找不到请求的资源 | 输入的网址错误，显示“页面不存在” |
| 403 | 客户端错误（4xx） | 服务器拒绝请求（无权限） | 访问需要登录的页面，但没登录 |
| 500 | 服务器错误（5xx） | 服务器处理请求时出错 | 网站后台代码崩溃，显示“服务器内部错误” |


简单记：2xx=成功，3xx=跳转，4xx=你（客户端）错了，5xx=服务器错了。



#### 3. HTTP版本：从“1.1”到“3.0”的进化
HTTP自诞生以来不断升级，核心版本的差异主要在“速度”和“效率”：

+ **HTTP/1.0**：早期版本，每次请求都要重新建立TCP连接（“短连接”），加载一个网页（含多个图片、JS）要多次握手，速度慢；
+ **HTTP/1.1**：目前最普及的版本，支持“长连接”（一次TCP连接可处理多个HTTP请求），减少握手时间，还支持“管道化”（同时发多个请求），速度提升明显；
+ **HTTP/2.0**：2015年发布，支持“多路复用”（一个TCP连接可**并行处理多个请求**，不用排队），还能“压缩头部”（减少数据传输量），速度比1.1快很多；
+ **HTTP/3.0**：最新版本，把底层的`TCP`换成了更高效的**`QUIC`协议**（基于UDP，减少握手延迟，抗丢包能力更强），适合5G、高延迟网络，目前逐步普及（如谷歌、百度部分服务已支持）。





### 五、HTTP的“安全版”：HTTPS
**HTTP本身是“明文传输”——数据在客户端和服务器之间传递时，任何人中途拦截（如公共WiFi黑客）都能直接看到内容（比如你的登录密码），非常不安全。**  
**HTTPS（HTTP Secure）** 就是“加了安全层的HTTP”，通过`SSL/TLS`协议对数据加密，让拦截者无法破解内容，就像给数据“装了个加密的快递盒”。

HTTPS的核心作用：

+ **数据加密**：传输的内容被加密，只有客户端和服务器能解密；
+ **身份认证**：确认服务器是“真的”（比如你访问的“[www.taobao.com”是真淘宝，不是钓鱼网站）；](http://www.taobao.com”是真淘宝，不是钓鱼网站）；)
+ **数据完整性**：确保数据在传输中没被篡改（比如黑客改不了你付款的金额）。

现在几乎所有涉及隐私、支付的网站（淘宝、银行APP）都用HTTPS，浏览器地址栏会显示“小锁”图标，表示连接安全。





### 六、一句话总结
HTTP就像“客户端和服务器之间的对话手册”：定义了“怎么问”（请求方法）、“怎么答”（状态码）、“说什么语言”（数据格式），用“一问一答”的模式实现数据传输；而HTTPS是“加了保密功能的手册”，确保对话内容不被偷听、篡改。没有HTTP，我们就无法顺畅地浏览网页、使用APP——它是互联网“沟通”的基石。



## 服务器端接收请求数据方式
Web服务器（`Tomcat`)对HTTP协议的请求数据进行解析，并进行了封装（**封装到**`HttpServletRequest`**对象中**），在调用`Controller`方法的时候传递对象`HttpServletRequest`给了该方法。这样，就使得程序员不必直接对协议进行操作，让Web开发更加便捷。

在`Controller`类中可以传入`HttpServletRequest`参数，然后使用该对象中的各种`get`方法来获取请求数据中的各类信息（如请求头，请求方式，请求参数，浏览器采用的协议）。

注意获取参数时，名字要与参数一致才能获取到，并且区分大小写。请求头则不区分大小写。

```java
package org.springboot.springbootweb.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GetRequestDemo {

    //获取请求数据
    @RequestMapping("/getRequest")
    public String getRequest(HttpServletRequest request){

        //HttpServletRequest 为服务器对前端请求数据解析后封装到了该对象中，通过该对象的方法可以获取请求数据的信息

        //获取请求协议
        String protocol=request.getProtocol();
        System.out.println("请求协议为："+protocol);

        //获取请求方式
        String method=request.getMethod();
        System.out.println("请求方式为："+method);

        //获取完整请求路径
        StringBuffer url=request.getRequestURL();
        System.out.println("完整的请求路径为："+url);

        //获取资源请求路径
        String uri=request.getRequestURI();
        System.out.println("资源的请求路径为："+uri);

        //获取请求参数
        String name=request.getParameter("name");
        System.out.println("请求参数为："+name);

        String telephone=request.getParameter("telephone");
        System.out.println("请求参数为："+telephone);

        //获取请求头，请求数据中请求行下面的 键值对内容
        String accept=request.getHeader("ACCEPT");
        System.out.println("请求头为："+"Accept:"+accept);

        return "OK!";
    }

}
```



## 服务器如何设置响应数据的内容
Web服务器对HTTP协议的响应数据进行了封装（HttpServletResponse），并在调用`Controller`方法的时候传递给了该方法。这样，就使得程序员不必直接对协议进行操作，让Web开发更加便捷

在对应的`Controller`方法中传入封装好的响应体的`HttpServletResponse`参数，通过对象中的方法来对响应体中的各项内容进行设置。



### 方式一：基于`HttpServletResponse`封装的对象来设置(响应体，响应头状态码)
```java
package org.springboot.springbootweb.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class SetResponseDemo {

    //设置响应数据的信息，响应头，响应体，状态码
    //方式一，利用服务器封装好的 HttpServletResponse 对象来设置
    @RequestMapping("/setResponse")
    public String setResponse(HttpServletResponse response) throws IOException {

        //设置响应的状态码
        response.setStatus(1209);

        //设置响应头
        response.setHeader("name","Yan");

        //设置响应体
        response.getWriter().write("<h1>Hello!SpringBoot-Web!</h1>");

        return "OK!SpringBoot-Web!";
    }

}
```

**代码中出现了导致 **`getWriter() has already been called for this response`** 错误的典型问题**。

在你的 `setResponse` 方法中，存在**两种向响应体写入数据的方式**：

1. 显式调用 `response.getWriter().write("<h1>Hello!SpringBoot-Web!</h1>")`
2. 通过返回字符串 `"OK!SpringBoot-Web!"`（Spring MVC 会自动将其写入响应体）



**这两种方式会冲突**，因为：

+ 当你调用 `response.getWriter()` 时，已经获取了字符输出流
+ 方法返回字符串时，Spring 会尝试再次获取输出流来写入数据
+ 这就导致了同一个响应中多次调用 `getWriter()` 的错误



要解决这个问题，你需要选择其中一种方式来设置响应体：

#### 方式一：只使用 response.getWriter （ ）
```java
@RequestMapping("/setResponse")
public void setResponse(HttpServletResponse response) throws IOException {
    //设置响应的状态码
    response.setStatus(1209);

    //设置响应头
    response.setHeader("name","Yan");

    //设置响应体
    response.getWriter().write("<h1>Hello!SpringBoot-Web!</h1>");
    // 注意：方法返回类型改为void，不返回任何内容
}
```



#### 方式二：只通过返回值设置响应体
```java
@RequestMapping("/setResponse")
public String setResponse(HttpServletResponse response) {
    //设置响应的状态码
    response.setStatus(1209);

    //设置响应头
    response.setHeader("name","Yan");

    //通过返回值设置响应体
    return "<h1>Hello!SpringBoot-Web!</h1>";
}
```



#### 注意
`return`同样可以设置响应体，`Spring`会自动把返回值写到响应体中，**同一个方法中只能有一种方式来设置响应体**，否则会发生冲突。



### 方式二：基于基于`ResponseEntity`封装来进行设置
是`Spring`提供的一个封装对象，可以把响应头，响应体，状态码的信息都封装到该对象中，然后之间把该对象（`ResponseEntity`）返回给浏览器。该对象中定义了许多**静态方法，可以采用链式编程的方法连续调用**。

```java
//注意ResponseEntity后的泛型是指返回的响应体的泛型    
@RequestMapping("/setResponse2")
    public ResponseEntity<String> setResponse2(){
        return ResponseEntity.status(212).body("ResponseEntity!");
    }
```



### 注意
响应状态码和响应头如果没有特殊要求的话，通常不手动设定。服务器会根据请求处理的逻辑，自动设置响应状态码和响应头



## SpringBoot-Web 案例
### 准备工作
创建一个SpringBoot工程，并勾选web依赖、lombok ( 利用其中的注解简化实体类定义 )。

引入资料中准备好的用户数据文件（user.txt），及前端静态页面。

定义一个实体类，用来封装用户信息

2. 开发服务端程序，接收请求，读取文本数据并响应。
3. 引入`lombok`之后，可以使用注解对实体类进行简化开发。@Data ：有该注解可以省略`get,set`方法@NoArgsConstructor :该注解帮助实体类自动添加空参构造@AllArgsConstructor : 该注解帮助实体类自动添加全参构造

案例数据都在 txt 文件中，读取时，可以采用原始方式缓冲流一行一行读取（读取之后还需转换为`json`格式才能传给前端），采用工具类`hutool`来简化开发后，操作会更加方便（`IO`操作，文件操作，字符串操作都包含在内）。

引入的工具类名为`hutool`依赖如下：

```xml
<dependency>
    <groupId>cn.hutool</groupId>

    <artifactId>hutoo-all</artifactId>

    <version>5.8.27</version>

</dependency>

```



### 如何读取文件信息（输入流）
#### 固定方式获取输入输出流
读取案例的 txt 文本文件时，采用`hutool`工具类中的`IoUtil.readLines()`方法,来逐行读取数据，该方法需要一个输入流对象（其实指的就是需要读取文件的路径地址），

```java
InputStream in = new FileInputStream(new File( pathname: "文件路径"));
IoUtil.readLines(in, StandardCharsets.UTF_8, new ArrayList<>());
```

##### 注意
这样的固定方式来读取的文件路径，是被写死的，当项目打包发出后，会找不到文件所在位置，我们要把项目文件都放在资源文件`resources`目录下，所以需要换用下面的方式。



#### 灵活读取文件信息（路径不写死）
项目的文件肯定都在资源目录`resources`目录下，当我们打包项目时，资源文件会一并打包，所以资源的路径要指向资源目录下，而不是自己电脑的磁盘文件地址。

##### 如何获取位于资源目录下的文件的路径
项目的`main`中的`java`和`resources`文件下的代码在编译后都会放在同一个编译后的类路径文件下，也就是同一目录下，此时可以用如下方法来获取资源文件的路径。

```java
// this.getClass()  获取类的字节码对象
// getClassLoader()  获取类的字节码对象的类加载器，
// getResourceAsStream()  获取资源文件的路径
InputStream in = this.getClass().getClassLoader().getResourceAsStream( name: "user.txt");
ArrayList<String> lines = IoUtil.readLines(in, StandardCharsets.UTF_8, new ArrayList<>());
```



### 解析 txt 文件中的信息，并封装为实体类对象
此处对于`map`方法的参数采用了函数式接口，`lamba`表达式的写法。

```java
//2．解析用户信息，封装为User对象->list集合
List<User> userList = lines.stream().map(line -> {
String[] parts = line.split( regex: ",");      //将读取到的信息用逗号隔开。
Integer id = Integer.parseInt(parts[0]);       //把数据转换为int的包装类，基本数据类型有默认值
String username = parts[1]; 
String password = parts[2];
String name = parts[3];
Integer age = Integer.parseInt(parts[4]);
LocalDateTime updateTime = LocalDateTime.parse(parts[5], DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));			//转换并指定数据格式
return new User(id, username, password, name, age, updateTime);   //返回一个实体类型对象
}).collect(Collectors.tolist());      //把读取到的实体类型对象放到集合当中

//最后一行的.collect(Collectors.tolist());可以替换为 tolist方法，JDK16之后出现的，老版本jdk不支持
```

对于后续数据的格式问题，直接把数据实体类或者实体类的集合传给前端即可，浏览器会自动把数据解析为`JSON`类型的数据。



### 数据格式的转换
由于前后端交互都是采用`JSON`格式进行的，所以对于服务器端直接传输的数据，需要先转换为`JSON`类型的格式才能被前端正确识别。转换为`JSON`的作用是`@ResponseBody`注解完成的。

#### @ResponseBody 注解的作用:
将`controller`方法的返回值直接写入HTTP响应体中，如果是对象或集合，会先转为`json`格式数据，再写入到响应体中。

@RestController = @Controller + @ResponseBody



## Web 开发的三层架构（控制，业务，持久层）
控制层（Controller）：接收前端发送的请求，并对请求进行响应，返回对应的数据

业务层（Service）：对得到的数据进行处理让其更符合请求对应的需求

持久层（Dao）：依据请求来对数据进行查询，把请求对应的数据提取出来（数据库或者是文件）



## 分层解耦
耦合：衡量软件中各个层/各个模块的依赖关联程度（例如持久层数据发生变化时，业务层需要进行更改，就称作这两层耦合了，业务层发生代码变动，控制层也需要进行变动。）

内聚：软件中各个功能模块内部的功能联系（指一个功能尽量的集合在一个方法中完成为高内聚）。

软件设计原则：高内聚低耦合（核心理念就是降低相互之间的影响）。



### 实现分层解耦的思路是什么
1. 将项目中的类交给IOC容器管理（IOC，控制反转）
2. 应用程序运行时需要什么对象，直接依赖容器为其提供（DI，依赖注入）

**控制反转**：Inversion OfControl，简称IoC。对象的创建控制权由程序自身转移到外部（容器），这种思想称为控制反转。

**依赖注入**：Dependency Injection，简称DI。容器为应用程序提供运行时，所依赖的资源，容器在创建 Bean 时，自动将该 Bean 所依赖的其他 Bean “注入”到它里面（比如容器创建 `UserService` 时，自动把 `UserDao` 这个依赖“塞”给 `UserService`），称之为依赖注入。

**Bean对象**：IOC容器中创建、管理的对象，称之为Bean。



### 具体方式
当我们进行自己`new`一个对象时，后续若对该对象进行更换，使用其他对象，那就需要同时更改所有使用到这个对象的代码文件，耦合度太高，此时我们利用注解把对象的创建权交给容器进行管理(这个过程是`IOC`控制反转)，这个交给容器管理的对象就叫做`Bean`对象，当我们需要用到对应的对象时，不需要自己去创建对象（也就是自己`new`对象），容器会自动给我们匹配一个相对应的对象来给我们使用，这个过程叫`DI`依赖注入。

你的理解**核心逻辑是准确的**，抓住了 IOC（控制反转）和 DI（依赖注入）的核心矛盾（解耦）与核心动作（容器管创建、自动给依赖），但在部分细节的严谨性和关联性上可以进一步补充，以便更全面地理解 Spring 中这两个核心概念的本质。





#### 先明确结论：你的理解“对了大半”，但需补充2个关键细节
准确理解了：

1. **IOC 的核心目的**：解决“硬编码 new 对象导致的高耦合”，将对象创建权从“开发者代码”转移到“Spring 容器”，这是控制反转的核心（“反转”的就是“对象创建权”）。
2. **Bean 的定义**：交给 Spring 容器管理的对象就是 Bean（而非开发者自己 new 的对象）。
3. **DI 的核心动作**：需要用对象时不用自己 new，容器自动“送”过来，这是依赖注入的直观表现。

但需要补充的细节是：

+ **IOC 和 DI 的关系**：DI 是 IOC 的“具体实现方式”，而非两个独立过程；
+ **DI 的“注入”场景**：不仅是“更换对象时解耦”，更本质是“解决对象间的依赖关系”（比如 A 依赖 B，容器帮 A 注入 B，而非 A 自己 new B）。



#### 再深入拆解：IOC 与 DI 的完整逻辑（结合你的理解修正）
为了让概念更清晰，我们用“开发者视角”和“容器视角”拆解整个过程，同时对比“传统编码”和“Spring 编码”的差异：



##### 1. 先看“传统编码”的问题（你的理解中“高耦合”的具体体现）
假设我们有一个 `UserService`，需要依赖 `UserDao` 操作数据库，传统写法是这样的：

```java
// 1. 定义UserDao（依赖）
public class UserDao {
    public void queryUser() {
        System.out.println("查询用户");
    }
}

// 2. 定义UserService（依赖使用者）
public class UserService {
    // 开发者自己new依赖（硬编码）
    private UserDao userDao = new UserDao(); 

    public void getUser() {
        userDao.queryUser(); // 使用依赖
    }
}

// 3. 调用UserService
public class Test {
    public static void main(String[] args) {
        UserService service = new UserService(); // 自己new使用者
        service.getUser();
    }
}
```

**问题**：如你所说，若后续需要更换 `UserDao`（比如从 `MysqlUserDao` 换成 `OracleUserDao`），必须修改 `UserService` 中 `new UserDao()` 的代码——**依赖的创建权在使用者手里，耦合度极高**。





##### 2. Spring 如何用 IOC 解决这个问题？（“控制反转”的本质）
IOC（Inversion of Control，控制反转）的核心是“**反转对象的创建权和依赖管理权**”：  
原本由“开发者代码”（如 `UserService`、`Test`）控制的“对象创建”（new UserDao()、new UserService()），现在交给“Spring 容器”控制——这就是“反转”（从开发者反转到容器）。

而“交给容器管理的对象”就是 **Bean**（比如 `UserDao`、`UserService` 都可以配置成 Bean），配置 Bean 的方式除了你提到的“注解”（如 `@Component`、`@Service`、`@Repository`），还有传统的 XML 配置（如 `<bean id="userDao" class="com.xxx.UserDao"/>`），本质都是告诉容器：“这个对象你帮我创建和管理”。





##### 3. DI 是如何实现 IOC 的？（“依赖注入”的具体动作）
你说“需要用到对象时，容器自动匹配对应对象”，这其实是 DI（Dependency Injection，依赖注入）的直观表现，但更准确的定义是：  
**容器在创建 Bean 时，自动将该 Bean 所依赖的其他 Bean “注入”到它里面**（比如容器创建 `UserService` 时，自动把 `UserDao` 这个依赖“塞”给 `UserService`）。

DI 是 IOC 的“实现手段”——IOC 是“思想”（要解耦、要反转控制权），DI 是“落地方式”（怎么反转？靠“注入”依赖）。

用代码举例（基于注解的 DI 实现）：

```java
// 1. 把UserDao配置成Bean（告诉容器：你帮我创建UserDao）
@Repository // 注解标识为Bean，容器会自动创建实例
public class UserDao {
    public void queryUser() {
        System.out.println("查询用户");
    }
}

// 2. 把UserService配置成Bean，并注入UserDao依赖
@Service // 注解标识为Bean
public class UserService {
    // 不再自己new，而是用@Autowired告诉容器：我需要UserDao，你帮我注入
    @Autowired 
    private UserDao userDao; 

    public void getUser() {
        userDao.queryUser(); // 直接用，不用关心userDao从哪来
    }
}

// 3. 从容器中获取Bean（而非自己new）
public class Test {
    public static void main(String[] args) {
        // 初始化Spring容器（容器会自动扫描注解，创建所有Bean）
        ApplicationContext context = new AnnotationConfigApplicationContext("com.xxx");
        // 从容器中获取UserService Bean（不用自己new）
        UserService service = context.getBean(UserService.class);
        service.getUser();
    }
}
```

**关键变化**：  

+ `UserService` 不再自己 new `UserDao`，而是通过 `@Autowired` 声明“我依赖 `UserDao`”；  
+ 容器在创建 `UserService` 时，会自动找到 `UserDao` 这个 Bean，并注入到 `UserService` 中；  
+ 后续若要更换 `UserDao`（如换成 `OracleUserDao`），只需给新的 `OracleUserDao` 加 `@Repository`，并删除旧 `UserDao` 的注解——**无需修改 **`UserService`** 的任何代码**，彻底解耦。





#### 最后总结：你的理解如何优化？
将你的理解补充严谨后，完整逻辑是：  

> 传统编码中，我们自己 `new` 对象，若后续更换对象，需修改所有使用该对象的代码（高耦合）。此时我们通过注解/XML 把对象配置成 **Bean**，将对象的创建权从“开发者”反转给“Spring 容器”（这个“反转控制权”的过程就是 **IOC**）。当某个 Bean 需要依赖其他 Bean 时（如 `UserService` 依赖 `UserDao`），不需要自己 `new` 依赖，而是由容器在创建该 Bean 时，自动将依赖的 Bean “注入”进来（这个“自动给依赖”的过程就是 **DI**，是 IOC 的具体实现）。
>

通过这样的补充，能更清晰地理解“为什么 IOC 和 DI 总是一起提”——它们是“思想”和“手段”的关系，最终目的都是为了**解耦**，让代码更灵活、更易维护。



### 实现 `IOC & DI`的注解
要把某个对象交给IOC容器管理，需要在对应的类上加上如下注解之一：

| 注解 | 说明 | 位置 |
| --- | --- | --- |
| @Component | 声明bean的基础注解 | 不属于以下三类时，用此注解 |
| @Controller | @Component的衍生注解 | 标注在控制层类上 |
| @Service | @Component的衍生注解 | 标注在业务层类上 |
| @Repository | @Component的衍生注解 | 标注在数据访问层类上（由于与mybatis整合，用的少） |
| @Autowired | 自动注入当前对象依赖的Bean对象 | 标注在需要注入依赖对象的方法或者属性上 |


#### @Autowired 用法
##### 属性注入
直接在类的属性位置定义需要的依赖对象，然后在该对象上写上 @Autowired 注解。

```java
@RestController
public class UserController {
    @Autowired
    private UserService userService;

}
```

优点：代码简洁、方便快速开发

缺点：隐藏了类之间的依赖关系、可能会破坏类的封装性



##### 构造方法注入
现在属性位置定义需要的属性（属性一般为 final 类型的属性），然后在构造方法上传入需要的依赖对象，构造方法中进行赋值，在构造方法上使用 @Autowired 注解

```java
@RestController
public class UserController{
    private final UserService userService;
    @Autowired
    public UserController(UserService userService）{
        this.userService =userService;
    }
}
```

优点：能清晰地看到类的依赖关系、提高了代码的安全性

缺点：代码繁琐、如果构造参数过多，可能会导致构造函数臃肿

注意：如果只有一个构造函数，@Autowired注解可以省略。



##### setter 方法注入
同样也是属性位置定义，然后通过 setter 方法来注入，在 setter 方法上使用 @Autowired 注解来实现依赖注入

```java
@RestController
 public class UserController {
     private UserService userService;
    @Autowired
     public void setUserService(UserService userService) {
        this.userService = userService;
    }
}
```

优点：保持了类的封装性，依赖关系更清晰

缺点：需要额外编写setter方法，增加了代码量



#### 存在多个相同类型的 Bean 怎么使用 @Autowired
@Autowired 注解，默认是**按照类型进行注入**的。

```java
@RestController
public class UserController{
@Autowired
private UserService userService;
    //注入时依据的是属性前面的类型来注入的
```

当同一个接口有两个或者多个实现类时，直接使用 @Autowired 就会报错，因为项目不知道在运行时该注入哪个 Bean，解决方法如下

##### 方式一：使用 @Primary 进行标注优先注入的 Bean 对象
```java
@Primary
@Service
public class UserServiceImpl implements UserService{
    @override
    public List<User>list（）{
        //省略..
    }
}
```



##### 方式二：使用 @Qualifier 结合 @Autowired 来指定注入哪个 Bean 对象
@Qualifier 里面写的是 Bean 对象的名字，Bean对象的名字一般为，对应实体类的名字的首字母小写。

```java
@RestController
public class UserController{
    @Autowired
    @Qualifier("userServiceImpl")
    private UserService userService;
}
```



##### 方式三：使用 @Resource 注解来指定需要注入的 Bean
@Resource 里面写的是 Bean 对象的名字，Bean对象的名字一般为，对应实体类的名字的首字母小写

```java
@RestController
public class UserController{
    @Resource(name="userServiceImpl")
    private UserService userService;
}
```



#### 注意
+ 声明`bean`的时候，可以通过注解的`value`属性指定`bean`的名字，如果没有指定，默认为类名首字母小写。
+ 前面声明`bean`的四大注解，要想生效，还需要被组件扫描注解`@CompαnentScan`扫描。
+ 该注解虽然没有显式配置，但是实际上已经包含在了启动类声明注解解 `@SpringBootApplication` 中，默认扫描的范  
围是启动类所在包及其子包（就是启动类所在包下的文件包）。



# MySql 数据库
安装地址：[https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)

**关系型数据库**：建立在关系模型基础上，由多张相互连接的**二维表（有行有列类似于 Excel 中的表）**组成的数据库，基于二维表存储的数据库为关系型数据库。

特点：

+ 使用表存储数据，格式统一，便于维护。
+ 使用SQL语言操作，标准统一，使用方便，可用于复杂查询。



## SQL 语句
一门操作关系型数据库的编程语言，定义操作所有关系型数据库的统一标准。

**不区分大小写，大小写语句都可以运行，以分号结尾。**

| 分类 | 全称 | 说明 |
| --- | --- | --- |
| DDL | Data Definition Language | 数据定义语言，用来定义数据库对象(数据库，表，字段) |
| DML | Data Manipulation Language | 数据操作语言，用来对数据库表中的数据进行增删改 |
| DQL | Data Query Language | 数据查询语言，用来查询数据库中表的记录 |
| DCL | Data Control Language | 数据控制语言，用来创建数据库用户、控制数据库的访问权限 |


## 远程连接数据库
学习阶段没有服务器，为了方便选择在自己电脑上安装数据库系统，企业开发当中数据库是安装在服务器上的，想要访问数据库时，需要用数据库指令来远程访问，指令如下

MySQL连接

```java
mysql -hxxx -Pxxx -uxxx -pxxx
//h：指定访问数据库的ip地址，访问哪个数据库
//p: 指定访问的端口号，默认为3306
//u: 用户名
//p: 密码
```



## DataGrip 图形化界面工具
介绍：DataGrip是JetBrains旗下的一款数据库管理工具，是管理和开发MySQL、Oracle、PostgreSQL的理想解决方案。  
官网: [https://www.jetbrains.com/zh-cn/datagrip/](https://www.jetbrains.com/zh-cn/datagrip/)

使用 DataGrip 可以方便的连接关系型以及非关系型数据库，并且书写数据库语句等操作也比命令行方便

[DataGrip 2025.2.2 最新破解版安装教程（附激活码,至2099年~） - 犬小哈教程](https://www.quanxiaoha.com/datagrip-pojie/datagrip-pojie-202522.html)



连接 MySql 数据库（初始化操作）

<!-- 这是一张图片，ocr 内容为： -->
![](C:\Users\YJC\AppData\Roaming\Typora\typora-user-images\1757992171015.png)

点击界面上方的数据库图标，然后点击左侧加号，选择需要连接的数据库系统，然后输入需要连接的数据库的`IP`地址，`Port`端口号，用户名以及密码，然后点击左下方`Download`下载需要的驱动。最后点击`Test Connection`查看连接是否成功。





## 数据库相关语句（DDL语句）
```java
--查询所有数据库
show databases;

--查询当前正在使用的数据库，实际使用的是一个函数所以后面带括号
select database();

--使用/切换数据库
use 数据库名；

--创建数据库，方括号中的内容是可选的
create database [if not exists]数据库名 ［default charset utf8mb4];

--删除数据库
drop database［if exists］ 数据库名;

--上述语法中的database，也可以替换成 schema。如：create schema dbo1；MySQL8版本中，默认字符集为utf8mb4。
```

创建好的数据库是以文件夹的形式存放在数据库的安装包下的`data`目录下的



## 表的相关语句（DDL语句）
### 表的创建语句
```java
create table tablename(
    字段1 字段类型 [约束］［comment 字段1 注释],
    字段2 字段类型［约束］[comment 字段2 注释]
) [commentt 表注释];
```

创建表时，上述方括号中的内容是可选项，可以用来对设置的字段进行设置注释信息，表最后的小括号后也可以跟注释。

**注意最后一个字段的最后不需要加逗号隔开，其余字段之间都需逗号隔开，字符串信息一般用单引号括起来**。备注信息会在创建好表后，鼠标光标悬浮到相应位置时自动显示注释信息。



### 表的操作语句
```java
show tables;    -- 查询当前数据库的所有表
desc 表名；    -- 查询表结构
show create table 表名;   --  查询建表语句
alter table 表名 add 字段名 类型(长度）［comment 注释］[约束]；  --  添加字段
alter table 表名 modify 字段名 新数据类型（长度）；  --  修改字段类型
alter table 表名 change 旧字段名 新字段名 类型（长度）[comment注释］[约束]； --  修改字段名与字段类型
alter table 表名 drop column 字段名； -- 删除字段
alter table 表名 rename to 新表名； -- 修改表名
drop table[if exists]表名； -- 删除表
```



## 字段的相关约束
约束：约束是作用于表中字段上的规则，用于限制存储在表中的数据，定义字段存储的规则。  
目的：保证数据库中数据的正确性、有效性和完整性。

| 约束 | 描述 | 关键字 |
| --- | --- | --- |
| 非空约束 | 限制该字段值不能为null | not null |
| 唯一约束 | 保证字段的所有数据都是唯一、不重复的 | unique |
| 主键约束 | 主键是一行数据的唯一标识，要求非空且唯一 | primary key |
| 默认约束 | 保存数据时，如果未指定该字段值，则采用默认值 | default |
| 外键约束 | 让两张表的数据建立连接，保证数据的一致性和完整性 | foreign key |
| 自增约束 | 让数据的`ID`实现自动增长，若自行设置`ID`值，从设置的值开始增长避免重复 | auto_increment |


## 表中数据类型
MySQL中的数据类型有很多，主要分为三类：**数值类型、字符串类型、日期时间类型**。



### 数值类型
| 类型 | 大小（byte） | 有符号范围 (SIGNED，可正可负) | 无符号范围（UNSIGNED）把无符号的负数部分的范围合并了，只能是正数 | 描述 | 备注 |
| --- | --- | --- | --- | --- | --- |
| tinyint | 1 | （-128~127） | （0，255） |  |  |
| smallint | 2 | （-32768, 32767) | (0，65535) |  |  |
| mediumint | 3 | (-8388608, 8388607) | （0，16777215) |  |  |
| int | 4 | (-2147483648, 2147483647) | (0，4294967295) |  |  |
| bigint | 8 | (-2<sup>63, 2</sup>63-1) | (0，2~64-1) |  |  |
| flocat | 4 | (-3.402823466 E+38, 3.402823466351 E+38) | 0和(1.175494351 E-38,3.402823466 E+38 |  | float(5,2）：5表示整个数字长度，2表示小数位个数 |
| double | 8 | (-1.7976931348623157 E+308,1.7976931348623157 E+308) |  |  | double(5,2）：5表示整个数字长度，2表示小数位个数 |
| decimal |  |  |  | 小数值（精度更高，用上面的两个可能会丢失数据） | decimal(5,2）：5表示整个数字长度，2表示小数位个数 |


相对于`flocat`和`double`这两个数据类型，`decimal`**比他们更精准，不容易丢失数据**。

未指定数值是无符号还是有符号，数值**默认为无符号类型**，选取数值类型时，依据是：在满足需求的情况下，尽可能选择对磁盘占用空间小的数值类型。

1. `unsigned`**表示无符号类型，表表示只能取0及正数**
2. **不加默认是**`signed`**，表示可以取负数**



### 字符串类型
| 类型 | 大小 | 描述 |
| --- | --- | --- |
| char | 0-255 bytes | 定长字符串 |
| varchar | 0-65535 bytes | 变长字符串 |
| tiny / medium / long blob |  |  |
| tiny / medium / long text |  |  |
| blob | 0-65 535 bytes | 二进制形式长文本数据 |
| text | 0-655 535 bytes | 文字形式长文本数据 |


### 日期类型数据
| 类型 | 大小 | 范围 | 格式 | 描述 |
| --- | --- | --- | --- | --- |
| **date** | 3 | 1000-01-01 至 9999-12-31 | YYYY-MM-DD | 日期值 |
| time | 3 | -838:59:59 至 838:59:59 | HH:MM:SS | 时间值或持续时间 |
| year | 1 | 1901 至 2155 | YYYY | 年份值 |
| **datetime** | 8 | 1000-01-01 00:00:00 至 9999-12-31 23:59:59 | YYYY-MM-DD HH:MM:SS | 混合日期和时间值 |
| timestamp | 4 | 1970-01-01 00:00:01 至 2038-01-19 03:14:07 | YYYY-MM-DD HH:MM:SS | 4混合日期和时间值，时间戳 |


注意：`timestamp`已经快到上限，基本不使用。



## 创建表的案例代码
```java
案例：设计员工表emp
基础字段：id主键；create_time创建时间；update_time修改时间；
create table emp(
    id int unsigned primary key auto_increment comment 'ID，主键',
    username varchar(20) not null unique comment'用户名'，
    password varchar(32) default '123456' comment'密码',
    name varchar(10) not null comment '姓名',
    gender tinyint unsigned not null comment '性别，1 男；2 女',
    phone char (11) not null unique comment '手机号'，
    job tinyint unsigned comment '职位，1班主任；2讲师；3学工主管；4教研主管；5咨询师'
    salary int unsigned comment '薪资'，
    entry_date date comment '入职日期'，
    image varchar(255）comment '图像',
    create_time datetime comment '创建时间'，
    update_time datetime comment '修改时间'
) comment '员工表';
```



## 增删改语句（DML语句）
DML英文全称是DataManipulationLanguage（数据操作语言），用来对数据库中表的数据记录进行增、删、改操作。

### 添加数据（INSERT）
```java
-- 指定字段添加数据
insert into 表名 (字段名1，字段名2) values (值1，值2)；
-- 全部字段添加数据
insert into 表名 values (值1，值2，·..);
-- 批量添加数据（指定字段）
insert into 表名 (字段名1，字段名2) values (值1，值2), (值1，值2);
-- 批量添加数据（全部字段）
insert into 表名 values(值1，值2，·..)，(值1，值2，·..);
```

#### 注意
1. 插入数据时，指定的**字段顺序需要与值的顺序是一一对应的**
2. 字符串和日期型数据应该包含在引号中（单引号、双引号都可以，但是`DataGrip`中会对双引号发出警告，因为它建议使用单引号，但是可以正常运行）。
3. 插入的数据大小/长度，应该在字段的规定范围内。



### 修改数据（UPDATE）
```java
-- 修改数据
update 表名 set 字段名1 = 值1 , 字段名2 = 值2 [where 条件];
```

#### 注意
修改语句的条件可以有，也可以没有，如果**没有条件，则会修改整张表的所有数据**。



### 删除数据（DELETE）
```java
-- 删除数据
delete from 表名 [where 条件];
```

#### 注意
1. DELETE 语句的条件可以有，也可以没有，如果**没有条件，则会删除整张表的所有数据**。
2. DELETE 语句不能删除某一个字段的值（如果要操作，可以使用UPDATE，将该字段的值置为NULL）。



## 查询语句（DQL语句）
DQL英文全称是DataQueryLanguage（数据查询语言），用来查询数据库表中的记录。  
关键字：SELECT

#### 基本查询
```java
-- 查询多个字段
select 字段1，字段2，字段3 from 表名；
-- 查询所有字段（通配符）
select * from 表名；
-- 为查询字段设置别名，as关键字 可以省略，别名若是中文不用引号也可以（若别名中间有空格需要加引号）
select 字段1 [as 别名1]，字段2 [as 别名2］from表名；
-- 去除重复记录
select distinct 字段列表 from 表名；
```

##### 注意
`*`**号代表查询所有字段，在实际开发中尽量少用（不直观、影响效率)**



#### 条件查询
```java
-- 条件查询
select 字段列表 from 表名 where 条件列表；
```

---

| 运算符 | 功能 |
| --- | --- |
| > | 大于 |
| > = | 大于等于 |
| < | 小于 |
| < = | 小于等于 |
| = | 等于 |
| < >  或  ! = | 不等于 |
| between  ...  and  ... | 在某个范围之内(**含最小、最大值**) |
| in ( ... ) | 在`in`之后的列表中的值，多选一 (匹配一个就等于满足条件) |
| **like   占位符** | **模糊匹配（**`_ `**匹配单个字符，**`%`**匹配任意个字符）** |
| is null | 是`null` |
| and  或  && | 并且 (多个条件同时成立） |
| or  或  | | | 或者 (多个条件任意一个成立） |
| not  或  ！ | 非，不是 |


模糊查询的代码

```java
select * from where name like '匹配条件';
```



#### 分组查询 （ 聚合操作函数 ）
##### 聚合函数
聚合函数：**将一列数据作为一个整体，进行纵向计算。**

| 函数 | 功能 |
| --- | --- |
| count | 统计数量 |
| max | 最大值 |
| min | 最小值 |
| avg | 平均值 |
| sum | 求和 |


聚合函数代码示例

```java
-- 注意：所有的聚合函数不参与null的统计
-- 1．统计该企业员工数量－count
-- count(字段）
select count(id) from emp;
-- count(*)
select count(*) from emp;
-- count(常量)
select count(1) from emp;
-- 统计该企业员工的平均薪资－aVg
select avg(salary) from emp;
-- 3．统计该企业员工的最低薪资－min
select min(salary) from emp;
-- 4.统计该企业员工的最高薪资－max
select max(salary) from emp;
-- 5．统计该企业每月要给员工发放的薪资总额（薪资之和）－Sum
select sum(salary) from emp;

```

###### 注意
1. **所有的聚合函数不统计值为**`null`**值的字段**。
2. 统计数量可以使用：count（`*`)   count（字段）count（常量），**推荐使用 count（**`*`**）**



##### 分组查询
```java
-- 分组查询
select 字段列表 from 表名［where条件列表] group by 分组字段名 [having 分组后过滤条件];
```



###### where 与 having 的区别
1. 执行时机不同：**where是分组之前进行过滤，不满足where条件，不参与分组**；**而having是分组之后**对结果进行**过滤。**
2. 判断条件不同：**where不能对聚合函数进行判断，而having可以。**



查询示例

```java
-- 分组
-- 注意：分组之后，Select后的字段列表不能随意书写，能写的一般是分组字段+聚合函数；
-- 例如查询时以性别分组，但是分组后就只有两行性别组，男和女，其他字段，例如姓名，年龄与分组字段
-- 1．根据性别分组，统计男性和女性员工的数量
select gender, count(*) from emp group by gender;
```



###### 注意
分组之后，`Select`后的字段列表不能随意书写，能写的一般是**分组字段+聚合函数**；

你提出的这个规则非常关键，是SQL中`GROUP BY`（分组查询）的核心语法约束，一旦违背就会导致查询报错。下面我会从**原理拆解**、**具体规则**、**错误示例与正确示例**三个维度，帮你彻底理解这个逻辑，避免实际使用中踩坑。





##### 一、核心原理：为什么“非分组字段不能直接写在SELECT后”？
分组的本质是“将多条数据按指定字段（如性别）合并成一个‘数据组’”——比如按“性别”分组后，原本100条数据会变成2个组（男/女）。  
此时，**非分组字段（如姓名、年龄）在一个组内是“多值”的**（比如“男性组”里有10个不同姓名、5个不同年龄），而`SELECT`需要为每个组返回“单一确定的值”。如果直接写`SELECT 性别, 姓名`，SQL**无法判断应该返回该组内的哪个姓名，因此会报错。**

只有两种字段能满足“单一值”要求：

1. **分组字段本身**：每个组的分组字段值唯一（如“男性组”的性别就是“男”）；
2. **聚合函数处理后的字段**：通过聚合函数（如求和、计数、平均值），将组内的“多值”压缩成“单一值”（如男性组的“平均年龄”“总人数”）。





##### 二、明确规则：SELECT后允许出现的字段类型
假设我们有一张员工表`employees`，结构如下：

| 字段名 | 含义 | 字段类型 |
| --- | --- | --- |
| emp_id | 员工ID | 整数（主键） |
| name | 姓名 | 字符串 |
| gender | 性别 | 字符串（男/女） |
| age | 年龄 | 整数 |
| department | 部门 | 字符串 |
| salary | 工资 | 小数 |


当我们按`gender`（性别）分组时，`SELECT`后允许的字段严格限制为：

| 允许的字段类型 | 示例（以“性别分组”为例） | 说明 |
| --- | --- | --- |
| 1. 分组字段本身 | `gender` | 每个组的性别值唯一，无歧义 |
| 2. 聚合函数（含非分组字段） | `COUNT(emp_id)`（统计每组人数）   `AVG(age)`（每组平均年龄）   `SUM(salary)`（每组工资总和） | 用聚合函数将非分组字段的“多值”转“单值” |


##### 三、错误示例 vs 正确示例：直观理解差异
通过对比，能更清晰看到语法错误的原因和正确写法的逻辑。





###### 1. 错误示例：SELECT后出现“非分组+非聚合”字段
需求：按性别分组，查询每组的性别和姓名  

```java
-- 错误！name是非分组字段，且未用聚合函数，一个性别组内有多个name，SQL无法返回
SELECT gender, name 
FROM employees 
GROUP BY gender;
```

**报错原因**：“男性组”包含多个员工姓名（如张三、李四），SQL无法确定返回哪个姓名，违反“每个组返回单一值”的规则。





###### 2. 正确示例1：分组字段 + 聚合函数（统计类需求）
需求：按性别分组，查询每组的性别、员工总数、平均年龄、最高工资  

```java
SELECT 
  gender,  -- 分组字段，允许直接写
  COUNT(emp_id) AS 员工总数,  -- 聚合函数：统计每组人数（用主键避免NULL）
  AVG(age) AS 平均年龄,        -- 聚合函数：计算每组平均年龄
  MAX(salary) AS 最高工资      -- 聚合函数：获取每组最高工资
FROM employees 
GROUP BY gender;  -- 按性别分组
```

**查询结果（示例）**：  

| gender | 员工总数 | 平均年龄 | 最高工资 |
| --- | --- | --- | --- |
| 男 | 35 | 28.5 | 15000.00 |
| 女 | 28 | 27.2 | 14500.00 |


###### 3. 正确示例2：多字段分组（分组字段可多个）
如果分组字段是多个（如“部门+性别”），则`SELECT`后需要包含**所有分组字段**，再搭配聚合函数。  
需求：按“部门+性别”分组，查询每个部门各性别的员工数和平均工资  

```java
SELECT 
  department,  -- 分组字段1：部门
  gender,      -- 分组字段2：性别（必须包含，否则报错）
  COUNT(*) AS 部门性别人数,  -- 聚合函数
  AVG(salary) AS 部门性别平均工资  -- 聚合函数
FROM employees 
GROUP BY department, gender;  -- 多字段分组，需按顺序包含在SELECT中
```

**查询结果（示例）**：  

| department | gender | 部门性别人数 | 部门性别平均工资 |
| --- | --- | --- | --- |
| 技术部 | 男 | 20 | 16000.00 |
| 技术部 | 女 | 8 | 15200.00 |
| 市场部 | 男 | 10 | 12000.00 |


##### 四、常见误区：这些情况容易踩坑
1. **误区1**：认为“主键（如emp_id）可以直接写在SELECT后”  
主键也是非分组字段，一个组内有多个主键值，直接写会报错（除非主键就是分组字段）。  
2. **误区2**：聚合函数内的字段不需要是分组字段  
聚合函数的作用就是处理“非分组字段的多值”，所以内部必须是非分组字段（如`AVG(age)`中的`age`），写分组字段反而无意义（如`AVG(gender)`，性别是字符串，无法计算平均值）。  
3. **误区3**：`WHERE`和`HAVING`混淆（延伸补充）  
分组后筛选“组”（如“平均年龄>30的性别组”），不能用`WHERE`（`WHERE`**筛选行，在分组前执行**），必须用`HAVING`（筛选组，在分组后执行），示例：  

```java
SELECT gender, AVG(age) AS 平均年龄
FROM employees 
GROUP BY gender
HAVING AVG(age) > 30;  -- 筛选平均年龄>30的组
```



总结一句话：**GROUP BY分组后，SELECT的字段要么是“分组时用的字段”，要么是“用聚合函数包裹的非分组字段”，没有第三种可能**。记住这个规则，就能避免90%以上的分组查询语法错误。



#### 排序查询
排序方式：升序（asc），降序（desc）；默认为升序`asc`，是可以不写的

```java
-- 排序查询
select 字段列表 from 表名［where条件列表］[group by 分组字段名 having 分组后过滤条件] order by 排序字段排序方式;

-- 排序查询
-- 1.根据入职时间，对员工进行升序排序－aSc
select * from emp order by entry_date asc;
select * from emp order by entry_date;
-- 2.根据入职时间，对员工进行降序排序－desc
select *from emp order by entry_date desc;
-- 3.根据入职时间对公司的员工进行升序排序，入职时间相同，再按照更新时间进行降序排序
select * from emp order by entry_date，update_time desc;
```



##### 注意
如果是多字段排序，当第一个字段值相同时，才会根据第二个字段进行排序。



#### 分页查询
```java
-- 排序查询
select 字段 from 表名［where 条件］[group by 分组字段 having 过滤条件］[order by 排序字段］limit 起始索引,查询记录数;
                                                       
-- 分页查询
-- 1.从起始索引0开始查询员工数据，每页展示5条记录
select * from emp limit 0,5;
select * from emp limit 5;
                                                       
-- 2.查询第1页员工数据，每页展示5条记录
select *from emplimit 0,5;
                                                       
-- 3．查询第2页员工数据，每页展示5条记录
select * from emp limit 5,5;
                                                       
-- 4.查询第3页员工数据，每页展示5条记录
select * from emp limit 10,5; 
                                                       
-- 页码
-- 起始索引=（页码－1）＊每页展示记录数                                                       
```



##### 注意
1. 起始索引从`0`开始
2. 分页查询是数据库的方言，不同的数据库有不同的实现，MySQL中是`LIMIT`
3. 如果起始索引为`θ`，起始索引可以省略，直接简写为`limit 1θ`
4. _每页起始索引 = （该页码 - 1）__ 每页展示记录数_*



### 多表关系
项目开发中，在进行数据库表结构设计时，会根据业务需求及业务模块之间的关系，分析并设计表结构。由于业务之间相互关联，所以各个表结构之间也存在着各种联系。



#### 一对多（多对一）
场景：部门与员工的关系（一个部门下有多个员工）

一对多的关系如何实现？在数据库表中多的一方，添加字段，来关联一的一方的主键



#### 一对一
#### 多对多
## JDBC API
JDBC：（JavaDataBaseConnectivity），就是使用Java语言操作关系型数据库的一套API。

本质：

+ `sun`公司官方定义的一套操作所有关系型数据库的规范，即接口，只定义规范，并没有实现类。
+ 各个数据库厂商去实现这套接口，提供数据库驱动`jar`包（就是接口的具体实现类），我们使用时就引入这些`jar`包，例如对`mysql`进行的操作时就需要引入如下对应依赖

```java
<dependency>
    <groupId>com.mysql</groupId>

    <artifactId>mysql-connector-j</artifactId>

    <version>8.0.33</version>

</dependency>

```

+ 我们可以使用这套接口（JDBC）编程，真正执行的代码是驱动`jar`包中的实现类，



### JDBC 入门案例（修改语句DML）
需求：基于JDBc程序，执行update语句(update user set age= 25 where id = 1)

步骤:

1. 准备工作：创建一个maven项目，引入依赖；并准备数据库表user。
2. 代码实现：编写JDBC程序，操作数据库

JDBC 代码如下

```java
//1．注册驱动，指定需要使用的数据库驱动，将指定的驱动类加载到内存当中，加载mysql驱动类
Class.forName("com.mysql.cj.jdbc.Driver") ;

//2．获取连接，获取使用的数据库的地址，用户名，密码，然后通过Connection建立连接
String url="jdbc:mysql://localhost:3306/数据库名";
String username="root";
String password ="1234";
Connection connection = DriverManager.getConnection(url, username, password) ;

//3.获取SQL语句执行对象，建立连接后，通过connection的createStatement方法建立
Statement statement = connection.createStatement();

//4.执行SQL
int i = statement.executeUpdate("update user set age = 25 where id = 1");

//5.释放资源
statement.close();
conneion.close();
```



#### 查询数据
需求：基于JDBC执行如下select语句，将查询结果封装到User对象中。  
SQL: `select * from user where username = 'daqiao' and password = '123456'`

首先定义相对应数据的实体类，（注意类中的数据都要为**包装类**，因为**基本数据类型有默认值，没有指定值的话为**`0`**，若为基本数据类型就并不能确认该数据的值是默认值还是数据本身的值**）。

后续建立与数据库的连接同上，搜先把对应数据库的驱动类加载到内存当中，然后利用`DriverManager`中的`getConnection`方法来获得一个`Connection`的对象建立与数据库的链接。

```java
Connection conn = null;
PreparedStatement stmt = null;		//Statement的子类，同样也可以执行Sql语句
ResultSet rs=null；		//封装查询返回的结果
    
//1．注册JDBC 驱动，把驱动类加载到内存当中
Class.forName( className: "com.mysql.cj.jdbc.Driver");

//2．打开链接
conn = DriverManager.getConnection(URL, USER, PASSWORD);

// 3．执行查询
String sql = "SELECT id, username, password, name, age FROM user WHERE username = ? AND password = ?";		//预编译的sql语句，不把数据写死，后续可通过PreparedStatement中的setxxx方法来设置，？为占位符

//获取预编译的sql语句，通过set方法来指定占位符的值
Stmt = conn.prepareStatement(sql);
stmt.setString( parameterlndex: 1, x: "daqiao");
stmt.setString( parameterlndex: 2, x: "123456");

//把结果封装到Resultset对象当中
rs = stmt.executeQuery();

//把结果封装到创建的实体对象中
while(rs.next()){
User user = new User(
        rs.getInt( columnlabel: "id"),
        rs.getString( columnlabel: "username"),
        rs.getString( columnlabel: "password"),
        rs.getString( columnlabel: "name"),
        rs.getInt(columnLabel:"age")
        );
}
```

`PreparedStatement`是`Statement`的子类，用来处理预编译的`Sql`语句，书写`Sql`语句时，对于语句中的某些条件或者字段不进行写死，后续通过`PreparedStatement`中的`setXxx`方法来进行设置占位符的内容。

```java
//获取预编译的sql语句，通过set方法来指定占位符的值
Stmt = conn.prepareStatement(sql);
stmt.setString( parameterlndex: 1, x: "daqiao");
stmt.setString( parameterlndex: 2, x: "123456");
```

**指定参数时，先指定占位符参数的序号，然后输入参数的值。**



#### Resultset  结果集对象
ResultSet（结果集对象）：`ResultSet rs = statement.executeQuery()`

+ next（）：将光标从当前位置向前移动一行，并判断当前行是否为有效行，返回值为boolean。true：有效行，当前行有数据false：无效行，当前行没有数据

```java
while(resultSet.next()){
    int id = resultSet.getInt("id");
    //...省略
}
```

当第一次调用next（）方法时，光标在查询到的数据第一行，然后**判断该行有没有数据，有则为true**，然后while循环开始执行，后续执行完第一次while循环后，再次调用next（）方法，光标继续往下面移动一行，然后判断有没有数据，如此循环，就实现了对多条数据的读取封装。

+ getXxx（..）：获取数据，可以根据列的编号获取，也可以根据列名获取（推荐）。可以通过`while`循环来获取，示例如下

```java
while(resultSet.next()){
    int id = resultSet.getInt("id");
    //...省略
}


//把结果封装到创建的实体对象中
while(rs.next()){
User user = new User(
        rs.getInt( columnlabel: "id"),
        rs.getString( columnlabel: "username"),
        rs.getString( columnlabel: "password"),
        rs.getString( columnlabel: "name"),
        rs.getInt(columnLabel:"age")
        );
}
```

调用`Resultset`中的各种类型数据对应的`getxxx`的方法，来获取查询到的数据的具体值，然后通过`User`的全参构造方法，把查询到的数据传递到创建的`User`实体对象中。注意`get`方法的依据是，查询到的对应字段类型是什么类型，就是`get对应类型`的方法。



#### 预编译 Sql
##### 优势一：可以防止SQL注入，更安全
SQL注入：通过控制输入来修改事先定义好的SQL语句，以达到执行代码对服务器进行攻击的方法。

当使用原本的写死的方式书写后端的查询代码或者进行登陆操作时，可以通过**输入特殊字符的方式来绕过登录系统。**

例如：**后端书写的语句**是

`select count(*) from user where username='' and password='';`，

当我们再登录页面输入登陆的用户名和密码时，输入的信息会传递到`username`以及`password`后的字符串的位置当中。然后依此为条件进行查询，若在数据库中查询到有这样的符合条件的数据，也就是结果count（*）不为0，登录成功。

但是当我们随便输入用户名，**输入密码为**`'or'1'=1`**时，再进行传递输入的信息到相应参数位置时就发生了SQL注入，绕过了登录系统直接进入了后台系统。拼接后为**

`select count(*) from user where username='asjdg' and password=''or'1'=1';`

此时后端书写的查询代码，在输入的参数信息传递过去之后就发生了变化，导致结果count（*）不为0，而是查询了所有的数据，因为`1=1`恒为true，所有数据都满足or后的条件。

当我们**采用预编译的SQL语句时，书写的代码参数是采用占位符进行提前占位，后续输入数据时，直接对占位符进行替换，可以很好的避免SQL注入的问题出现。**

还是上面哪个例子，当我们采用预编译的SQL语句时的代码如下：

`select count(*) from user where username=? and password=?`

此时进行替换就为：

`select count(*) from user where username= asjdg and password= 'or'1'=1 `

整体作为一个字符串传入，无论怎么输入，都不会出现SQL注入问题。



##### 优势二：性能更高
对于SQL语句，在运行时同样需要采用先编译后运行的步骤，

SQL语句运行的过程如下：先对SQL语句进行语法检查，然后对SQL语句进行优化，最后将语句进行编译后缓存起来，当下次运行SQL语句时，先看系统中有没有对应缓存，如果有就直接进行执行，没有则继续进行前面的步骤，然后再继续执行。

**预编译的好处**是，只有参数部分不确定，并且已经利用占位符进行占位，只要运行过一次，就会有缓存已经存储起来，后续直接把参数传入即可。不需每次都重复前面的步骤。



## Mybatis
MyBatis是一款优秀的持久层框架，用于简化JDBC的开发。

底层原理是JDBC，Mybatis 是对 JDBC 的操作进行了简化，进行与数据库交互时，更为方便，不需再书写大量代码。

应用举例：

```java
@Mapper
public interface UserMapper{
    /*
        利用注解来简化开发，JDBC已经被封装好了,
        数据层对应接口，执行对应方法时，自动执行注解中的语句，然后把结果封装到方法的返回值中。
    */
    
    @Select("sql语句")
    public List<User> findAll();
    
}
```



### Mybatis 配置案例
准备工作:

1. 创建SpringBoot工程、引入Mybatis相关依赖（数据库驱动依赖`MySQL Drive`，Mybatis 相关依赖`Mybatis Framework`）
2. 准备数据库表user、实体类User



    1. 配置Mybatis（在`application.properties`中数据库连接信息，进入`Editor`，中`File Encodins`里调节`propertie`的`Default encoding for properties files`默认编码为`UTF-8`）

```java
#属性文件(application.properties)配置如下：（固定格式）
spring.datasource.url=dbc:mysql://localhost:3306/web
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=1234
```

3. 编写Mybatis程序：编写Mybatis的持久层接口，定义SQL（注解/XML）

```java
//创建数据对应接口类时，在接口类的上方加入@Mapper注解，然后在运行时，程序会为该接口类自动创建实体类对象，并把它放入Ioc容器中，交给容器进行管理
@Mapper
public interface UserMapper{
    @Select("sql语句")
    public List<User> findAll();
    
}
```

4. Mybatis的持久层接口命名规范为 XxxMapper，也称为 Mapper接口。
5. 在test包下的java包下定义一个测试类，在类的上方写上@SpringBootTest注解，这样该类中的方法在执行时都会自动启动项目进行测试（之前只能通过主类来启动。）
6. 注意：**测试类所在包需要与启动类包名相同（或放在引导类所在包的子包下）**



#### 辅助配置
##### SQL语句提示
默认在Mybatis中配置的SQL语句是不识别的。可以做如下配置:

光标放到SQL语句处，然后右键点击，后续点击`show Context Actions`进入`Inject Ianguage or reference`进行添加SQL语句提示，配置好后书写的SQL语句就会有高亮提示，便于书写。



##### 配置数据库信息
此时只是配置好了SQL语句的提示，但是还没有与数据库进行配置，我们在书写时会对数据库中的表名进行报错，因为Idea并不知道到底有没有这张表，此时就需要与数据库建立连接。

产生原因：idea和数据库没有建立连接，不识别表信息  
解决方式：在idea中配置MySQL数据库连接

步骤如下：

点击左侧的Database面板，点击`+`，选择`DataSource`然后选择MySQL,然后填入MySQL的一些连接信息，此时需要指定使用的数据库的名字，然后就可以建立与使用的数据库的对应的连接。



##### 配置Mybatis的日志输出
默认情况下，在Mybatis中，SQL语句执行时，我们并看不到SQL语句的执行日志。在`application.properties`中加入如下配置，即可查看日志:

```java
#配置数据库连接信息
spring.datasource.url=jdbc:mysql://localhost:3306/web01
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=1234
#配置mybatis的日志输出，直接输入mybatislog，后续会出提示，不需硬记
mybatis.configuration.log-impl=org.apache.ibatis.logging.stdout.StdoutImpl
```



### JDBC 与 Mybatis 的对比
JDBC：

+ 代码是硬编码，与数据库的连接信息直接写到了java代码当中，
+ 封装SQL语句结果时代码十分繁琐
+ 并且用一次SQL连接就要进行一次建立连接与关闭连接，频繁的创建关闭创建关闭，造成资源浪费，性能不高

Mybatis：

+ 把与数据库的连接信息作为配置文件来进行设置，方便修改
+ 并且采用@Mapper以及其他SQL相关注解，把方法与SQL语句绑定，当进行完SQL语句后，结果会自动封装到对应方法的返回值类型的对象中，封装结果方便，在运行SQL代码时
+ 不会反复创建连接，而是采用数据库连接池，运行代码前提前创建好一部分与数据库的连接对象，当需要用到连接与数据库连接时，从数据库连接池中取一部分使用，然后用完再归还到数据库连接池当中。



### 数据库连接池
1. 数据库连接池是个容器，负责**分配、管理数据库连接**（Connection）。



2. 它允许应用程序**重复使用一个现有的数据库连接，而不是再重新建立一个**。当**没有数据库连接池**时，再运行SQL语句时，我们需要**先创建一个与数据库建立连接的**`Connection`**连接对象**，**用完（运行完SQL语句）之后，再把连接对象关闭，释放资源**。造成**频繁的创建连接对象关闭连接，耗时较长，性能不高**。**有了数据库连接池**之后，在运行代码之前，会**提前创建一部分与数据库的连接对象**，当需要使用时，就从连接池里取一个连接对象，然后**使用完之后不进行关闭，返还给数据库连接池**，实现了链接对象的复用，并且不需频繁的创建关闭连接。提高了运行的性能。



3. 释放空闲时间超过最大空闲时间的连接，来避免因为**没有释放连接**而引起的**数据库连接遗漏**。指的是一些用户或者程序，从数据库连接池中取到连接之后，一直**没有返还给数据库连接池**，造成了数据库连接池的连接对象的长时间占用，降低性能。数据库连接池会检查各个被取走的连接对象的空闲时间，若**空闲时间超过最大时间，会自动返还给数据库连接池**，避免连接对象被长时间占用的情况出现。

#### 优势
+ 资源重用
+ 提升系统响应速度
+ 避免数据库连接遗漏



#### 怎么建立数据库连接池
**一般不需要自己实现，引入对应使用的数据库连接池依赖即可。**

标准接口：DataSource

官方(sun)提供的数据库连接池接口，由第三方组织实现此接口，建立数据库连接池需要实现该接口，并实现下面的`getConnection`功能来实现获取连接。

功能：获取连接

```java
Connection getConnection() throws SQLException;
```



#### 配置数据库连接池
没有配置的话SpringBoot默认使用的是HiKari连接池，若要自行配置连接池，步骤如下：

Druid (德鲁伊）

+ Druid连接池是阿里巴巴开源的数据库连接池项目
+ 功能强大，性能优秀，是JaVa语言最好的数据库连接池之一

##### 引入对应依赖
```java
<dependency>
    <groupId>com.alibaba</groupId>

    <artifactId>druid-spring-boot-starter</artifactId>

    <version>1.2.19</version>

</dependency>

```

##### 配置数据库连接池类型
在配置数据库的信息的配置文件`application.properties`中，设置数据库连接池的类型：

```java
#第一行设置数据库连接池的类型为druid
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource

spring.datasource.url=jdbc:mysql://localhost:3306/web
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=1234
```



### 实现对数据的增删改查操作
#### 删除用户-Delete
需求：根据ID删除用户信息

SQL: delete from user where id = 5;

Mapper接口:

```java
//注意不能写死为“delete from user where id = 5”
@Delete("delete from user where id = #{id}")

public void deleteById(Integer id);
```

Mybatis提供了占位符`#{}`，占位符里面的内容在编译时会变为`?`，变为预编译的SQL语句，当我们在对应的方法中传入了参数时，该参数会传入占位符中，实现对应的SQL语句的操作。

##### 注意
**DML（增删改）语句执行完毕的返回值表示该DML语句执行完毕影响的行数**



#### Mybatis中 #{ } 与 ${ }的区别
| 符号 | 说明 | 场景 | 优缺点 |
| --- | --- | --- | --- |
| #{….} | 占位符。执行时，会将`#{..}`替换为？，生成预编译SQL | 参数值传递 | 安全、性能高 (推荐) |
| ${.....} | 拼接符。直接将参数拼接在SQL语句中，存在SQL注入问题 | 表名、字段名动态设置时使用 | 不安全、性能低 |


**占位符使用案例**

```java
@Delete("delete from dept where id = #{id}")
```

**拼接符使用案例**

```java
//依据传入的表格名称来查询，依据传递进来的字段来进行排序，传递的内容直接作为字符串拼接进来作为SQL语句内容
@Select("select id,name,score from ${tableName} order by.${sortField}")
```



#### 添加用户
SQL:`insert into user(username,password,name,age）values('zhouyu','123456','周瑜',20);`

同样不能写死，用占位符写预编译的SQL语句，**传入对应对象来完成添加（对应字段不可能一个一个全都写出来 ）**

Mapper接口：

```java
@Insert("insert into user(username,password,name,age) values( #{username}, #{password}, #{name},#{age})")
public void insert(User user);
```



#### 修改用户
SQL:

`update user set username ='zhouyu'，password ='123456'，name ='周瑜'，age = 20 where id = 1;`

Mapper接口：

```java
@Update("update user set username=#{username}，password=#{password]，name=#{name}，age=#{age} where id=#{id}")
public void update(User user);
```



#### 查询用户
需求：根据用户名和密码查询用户信息  
SQL: `select * from user where usernamee ='zhouyu'and password ='666888';`

Mapper接口：

把结果封装到了User对象当中1，当有多个对象时，封装到集合当中。

```java
@Select("select *from user where username=#{username} and password=#{password}")
public User findByUsernameAndPassword(String username,String password);
```

##### 注意
方法中需要两个形参传入，但是当java程序编译成为**字节码文件（在idea中就是那个棕色的文件，里面就是字节码文件，可以点击对应的包查看该方法有没有保留形参名字**）时，系统是不知道形参的名称是什么，也就**无法区分传入的参数到底对应哪个形参，所以要添加**`@param`**注解为形参起名字**，让程序区分实参对应的形参为哪一个（只有一个形参时就不需要使用`@param`,若参数是对象，需要传递的为对象中的属性，也不需要起名字，注意参数名与属性名一样即可）。



**@Param注解的作用是为接口的方法形参起名字的**

说明：**基于官方骨架创建的springboot项目中（特点是项目的pom文件中有一个父工程parent），接口编译时会保留方法形参名，@Param注解可以省略**（#{形参名}）。

```java
@Select("select * from user where username= #{uname} and password= #{pwd}")
public User findByUsernameAndPassword(String uname，String pwd);
```



**原因是父工程当中有一个**`maven-compiler-plugin`**插件，其中的**`parameters`**的值为true，表示编译为字节码文件时，保留形参名字。**



#### XML 文件配置模式
在Mybatis中，既可以通过注解配置SQL语句，也可以通过XML配置文件配置SQL语句。



##### XML 文件头
XML 的约束信息也就是文件头，去Mybatis的中文官网里找与SQL语句配置时的文件头，粘贴过来即可



默认规则：

1. **XML映射文件的名称与Mapper接口名称一致，并且将XML映射文件和Mapper接口(mapper接口在main包下的java包下的类似**`com.yan.mapper`**的包下)放置在相同包下（同包同名，但是是位于resources目录下的**`com/yan/mapper`**，注意要使用**`/`**不能还是**`.`**，此处创建的是文件夹不是包，若还是点，则磁盘里会出现一个名为**`com.yan.mapper`**的文件夹）。****原因：**在 Java 项目中：





提示信息 "Note: '.' in the name is treated as a regular character. Use"/"instead if you mean to create nested directories" 的意思是：在资源目录中，点`.`会被视为普通字符，如果你想创建嵌套目录，应该使用`/`作为分隔符。



    1. **Java 源代码目录（src/main/java）**：
        * 包名使用点`.`分隔（如`com.yan.mapper`）是 Java 语言的规范
        * IDE（如 IntelliJ IDEA、Eclipse）会自动将点`.`解析为目录层级
        * 这是因为 Java 编译器在处理包结构时，会将点分隔的包名转换为对应的目录结构
    2. **资源文件目录（src/main/resources）**：
        * 资源文件的目录结构直接映射到文件系统的实际目录
        * 这里使用的是操作系统的路径分隔符（Windows 用`\`，Linux/macOS 用`/`）
        * IDE 在这里不会自动将点`.`解析为目录层级，而是将其视为普通字符
        * 所以当你输入`com.yan.mapper`时，IDE 会创建一个单级目录，而不是多级目录结构
2. **XML映射文件的namespace属性为Mapper接口全限定名一致**。找到对应的Mapper接口，然后在定义代码里点击名字右键，选择`Copy/Paste Special->Copy Reference`，然后粘贴到对应XML文件的namespace处即可。(全限定名也就是接口类的具体位置)



3. **XML映射文件中sql语句的id与Mapper接口中的方法名一致，并保持返回类型一致。**

```java
<mapper namespace ="com.itheima.mapper.UserMapper">
<select id = "findAll" resultType="com.itheima.pojo.User">
    select id,username,password,name,age from user
</select>

</mapper>


<!--
namespace的内容为对应Mapper接口的全限定名
SQL语句的id与与其对应的方法名相一致，resultType的内容为SQL语句的结果的类型的全限定名
-->
```

```java
//配置完成之后，Mapper接口的方法上面就不需要注解了,只在Mapper的接口类上面标注@Mapper即可
@Mapper
public interface UserMapper{
    public List<User> findAll();
}
```



##### namespace与SQL语句id的作用
当我们运行`xml`配置的项目时，若调用的是`xxxMapper`接口，系统就会依据`resources`目录下的`xxxMapper.xml`的`namespace`来查找与`xxxMapper`接口对应的 XML 映射文件，然后依据运行的方法的名字，以及SQL语句的 id 来运行该方法对应的SQL语句。



##### XML 与 注解 如何选择
使用Mybatis的注解，主要是来完成一些简单的增删改查功能。如果需要实现复杂的SQL功能，建议使用XML来配置映  
射语句。

官方说明:[https://mybatis.net.cn/getting-started.html](https://mybatis.net.cn/getting-started.html)



#### XML 相关的辅助配置
##### 配置XML映射文件的位置
**配置这一项之前，**`xxxMapper.xml`**的文件必须放在与**`xxxMapper`**同名的目录下，否则就找不到与方法绑定的SQL语句**，从而报错。配置之后可以写到自己定义的目录下，不需要同包同名。

因为java包下以及resources下的文件在编译后都会统一放在classes类路径（在target目录下）下，所有以配置信息如下

```java
#指定XML映射配置文件的位置，位于类路径下的mapper目录下
mybatis.mapper-locations = classpath:mapper/*.xml
```

在properties 文件下，直接输入 mapperlocation 会自动出现提示。



##### MybatisX 插件
MybatisX是一款基于IDEA的快速开发Mybatis的插件，为效率而生。

安装好后，会自动将Mapper接口，xxxMapper.xml文件，接口中方法对应的SQL语句，建立联系，通过点击左侧对应的MybatisX图标，即可跳转到对应的位置。



## SpringBoot 的配置文件
SpringBoot项目提供了多种属性配置方式(properties、yaml、ymL）。

原本的 properties 文件配置时，部分重复性内容必须重复书写，此时可以采用 yml 或者 yaml 文件来配置

```java
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/web01
spring.datasource.username=root
spring.datasource.password=1234
```

yml 格式采用缩进来表示层级，格式如下：

```java
spring: 
    datasource: 
        driver-class-name: com.mysql.jdbc.Driver
        url: jdbc:mysql://localhost:3306/web01
        username: root
        password: 1234
```



### yaml / yml 的格式规则
格式:

+ 数值前边必须有空格，作为分隔符
+ 使用缩进表示层级关系，缩进时，不允许使用Tab键，只能用空格（idea中会自动将Tab转换为空格）
+ 缩进的空格数目不重要，只要相同层级的元素左侧对齐即可
+ 表示注释，从这个字符一直到行尾，都会被解析器忽略
+ yaml 和 yml 文件中同样可以定义对象以及数组和集合

```java
#定义对象/Map集合
user:
  name: Tom
  age: 18
  gender: 男
  
#定义数组/List/Set集合
hobby: 
  - Java
  - Game
  - Sport
```



#### 注意
在yml格式的配置文件中，如果配置项的值是以 0 开头的，值需要使用`''`用引起来，因为以 0 开头在 yml 中表示 8 进制的数据。



#### properties 与 yaml / yml 文件的对比
原本的 properties 的文件如下：

```java
#配置的是所属项目的名字
spring.application.name=springboot-mybatis-quickstart
#配置数据库连接信息，数据库连接池类型，数据库的地址以及端口号，数据库驱动，用户名，密码
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.url=jdbc:mysql://localhost:3306/web01
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=1234
#配置mybatis的日志输出
mybatis.configuration.log-impl=org.apache.ibatis.logging.stdout.Stdou
#指定XML映射配置文件的位置
mybatis.mapper-locations=classpath:mapper/*.xml
```

转换为的 yaml / yml 格式文件如下：

```java
spring:
  application:
    name: springboot-mybatis-quickstart
#数据库的连接信息
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    url: jdbc:mysql://localhost:3306/web01
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: 1234
#Mybatis的相关配置
mybatis:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdoutImpl
  mapper-locations: classpath:mapper/*.xml
```



# Web 后端案例
## 准备工作
### 开发规范-开发模式
#### 前后端混合开发
前端后端程序全写到一个项目中去，调整以及开发比较混乱，现在已经淘汰



#### 前后端分离开发
前端负责把服务器端传来的数据以好看的样式展示出来，后端只负责处理一些业务逻辑。分工明确

前端页面开发完毕后独立部署在`NGINX`服务器当中，后端开发完毕后独立部署在`Tomcat`服务器中



#### 接口文档
前后端分离开发时，若前端查询时的参数与后端接收参数的名字不一样，后端是接不到数据的，类似的情况1还有很多，所以定义了一份开发规范，名为**接口文档**

接口文档与java中的接口不一样，这里的接口指的是功能，一个接口对应一个功能，例如查询接口，对应就是查询功能。

接口文档里定义的主要是前后端进行数据交互得到规范，以确保前后端可以正常交换数据，定义前端发送什么格式的请求，参数名是什么，后端应该给前端返回什么格式的数据，开发时前后端工程师依据这份文档来开发对应功能。



#### 开发流程
前端的页面原型 <font style="background-color:#f3bb2f;">> 需求分析 ==> 接口设计（API接口文档）</font>> 前后端依据接口文档并行开发 ==> 前后端开发完成各自测试 ==> 前后端联调测试（进行交互看是否成功）

需求分析   ==>  接口设计  ==>  前后端并行开发   ==>  测试   ==>  联调 



#### 开发工具
前后端都在并行开发，后端开发完对应的接口之后，如何对接口进行请求测试？  
前后端都在并行开发，前端开发过程中，如何获取到数据，测试页面的渲染展示？

使用`Apifox`或者`Postman`来进行测试，但是`Apifox`功能比`Postman`更全面，更强大。



##### Apifox 开发工具
 介绍：Apifox是一款集成了Api文档、Api调试、ApiMock、Api测试的一体化协作平台。  
作用：接口文档管理、接口请求测试、Mock服务。  
官网：[https://apifox.com/](https://apifox.com/)



#### 日志技术
程序中的日志，是用来记录应用程序的运行信息、状态信息、错误信息等。

数据追踪，性能优化，问题排查，系统监控



##### JUL 日志技术
**JUL**：这是JaVaSE平台提供的官方日志框架，也被称为JUL。配置相对简单，但不够灵活，性能较差

**引入lombok依赖后，可以在配置好日志的配置信息后，在类上面直接添加**`@slf4j`**注解，然后就可以直接使用**`log.xxx`**来记录日志**



##### Log4j 日志技术
**Log4j**：一个流行的日志框架，提供了灵活的配置选项，支持多种输出目标（**控制台，日志文件，数据库**）。



##### Logback 日志技术
**Logback**：**基于Log4j升级而来**，提供了更多的功能和配置选项，性能优于Log4j。



##### Logback快速入门
准备工作：**引入logback的依赖（springboot项目中该依赖已传递）、配置文件logback.xml。**

```java
<dependency>
    <groupId>ch.qos.logback</groupId>

    <artifactId>logback-classic</artifactId>

    <version>1.4.11</version>

</dependency>

```

**Spring Boot 项目的起步依赖中已经通过起步依赖传递了 logback-classic 起步依赖。**

配置文件 logback.xml 如下：

```java
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!--控制台输出-->
    <appender name="STDouT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!--格式化输出：%d表示日期，%thread表示线程名，%-5level：级别从左显示5个字符宽度%logger{50}：最长50个字符（超出.切割-->
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>

        </encoder>

    </appender>

    
<!-－日志输出级别-->
    <rootlevel="debug">
        <appender-ref ref="STDoUT" />
    </root>

</configuration>

```





记录日志：定义日志记录对象Logger，记录日志。

定义日志记录对象Logger，调用方法（debug/info/..）记录日志

```java
private static final Logger log=LoggerFactory.getLogger(LogTest.class);

@Test
public void testlog(){
    log.debug("开始计算...");
    int sum =0;
    int[] nums ={1，5，3，2，1，4，5，4，6，7，4，34，2，23};
    for(int i=0；i<=nums.length；i++){
        sum += nums[i];
    }
    log.info("计算结果为："+sum)；
    log.debug("结束计算...");
}
```



---

##### Logback配置文件详解
配置文件名：logback.xml

该配置文件是对Logback日志框架输出的日志进行控制的，可以来配置输出的格式、位置及日志开关等。

常用的两种输出日志的位置：控制台、系统文件

```java
<!-－控制台输出-->
<appender name="sTDouT" class="ch.qos.logback.core.ConsoleAppender">...</appender>

<!-－系统文件输出-->
<appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">...</appender>

```

开启日志（ALL），关闭日志（OFF）

```java
<rootlevel = "ALL">
    <appender-refref = "sTDouT" />
    <appender-ref ref="FILE"/>
</root>

```



##### 完整的日志配置文件如下
```java
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- 控制台输出 -->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!--格式化输出：%d 表示日期，%thread 表示线程名，%-5level表示级别从左显示5个字符宽度，%logger显示日志记录器的名称， %msg表示日志消息，%n表示换行符 -->
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50}-%msg%n</pattern>

        </encoder>

    </appender>

    <!-- 系统文件输出 -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <!-- 日志文件输出的文件名, %i表示序号 -->
            <FileNamePattern>D:/tlias-%d{yyyy-MM-dd}-%i.log</FileNamePattern>

            <!-- 最多保留的历史日志文件数量 -->
            <MaxHistory>30</MaxHistory>

            <!-- 最大文件大小，超过这个大小会触发滚动到新文件，默认为 10MB -->
            <maxFileSize>10MB</maxFileSize>

        </rollingPolicy>

        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!--格式化输出：%d 表示日期，%thread 表示线程名，%-5level表示级别从左显示5个字符宽度，%msg表示日志消息，%n表示换行符 -->
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50}-%msg%n</pattern>

        </encoder>

    </appender>

    <!-- 日志输出级别 -->
    <root level="ALL">
        <appender-ref ref="STDOUT" />
        <appender-ref ref="FILE" />
    </root>

</configuration>

```



##### 对配置文件的拆解分析
```java
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!--控制台输出-->
    <appender name="STDOUT"class="ch.qos.logback.core.ConsoleAppender"...></appender>

    
    <!-－系统文件输出-->
    <appender name="FILE"class="ch.qos.logback.core.rolling.RollingFileAppender"...></appender>

    
    <!--日志输出级别,指定日志输出还是关闭，往哪里输出，控制台还是文件-->
    <root level="ALL">
        <appender-ref ref="STDOUT" />
        <appender-ref ref="FILE"/>
    </root>

</configuration>

```

`root level = " "`指定的是日志是开启还是关闭，

`appender-ref = " "` 指定的是日志往哪里输出，控制台是`STDOUT`,文件是`FILE`， 对应的是上面的`appender`标签。



###### 控制台输出的日志配置信息
```java
    <!-- 控制台输出 -->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!--格式化输出：%d 表示日期，%thread 表示线程名，%-5level表示级别从左显示5个字符宽度，%logger显示日志记录器的名称， %msg表示日志消息，%n表示换行符 -->
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50}-%msg%n</pattern>

        </encoder>

    </appender>

```

`logger`的名字是在`private static final Logger log=LoggerFactory.getLogger(LogTest.class);`处定义的。

`logger`后的`{50}`：表示字符长度不能超过50，不然就进行简化。

`-5`：用来对齐输出信息，例如输出日志级别不一样时，`info`与`debug`一个是四个字符一个是五个字符，这样的话后面输出的信息会不一致，使用这个来进行对齐。



###### 文件输出的日志配置信息
```java
    <!-- 系统文件输出 -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <!-- 日志文件输出的文件名, %i表示序号，%d表示文件名拼接上输出时的日期 -->
            <FileNamePattern>D:/tlias-%d{yyyy-MM-dd}-%i.log</FileNamePattern>

            <!-- 最多保留的历史日志文件数量 -->
            <MaxHistory>30</MaxHistory>

            <!-- 最大文件大小，超过这个大小会触发滚动到新文件，默认为 10MB -->
            <maxFileSize>10MB</maxFileSize>

        </rollingPolicy>

        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!--格式化输出：%d 表示日期，%thread 表示线程名，%-5level表示级别从左显示5个字符宽度，%msg表示日志消息，%n表示换行符 -->
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50}-%msg%n</pattern>

        </encoder>

```





##### Logback日志级别
日志级别指的是日志信息的类型，日志都会分级别，常见的日志级别如下（级别由低到高）：

| 日志级别 | 说明 | 记录方式 |
| --- | --- | --- |
| trace | 追踪，记录程序运行轨迹【使用很少】 | log.trace("...") |
| debug | 调试，记录程序调试过程中的信息，实际应用中一般将其视为最低级别【使用较多】 | log.debug("...") |
| info | 记录一般信息，描述程序运行的关键事件，如：网络连接、io操作【使用较多】 | log.info("...") |
| warn | 警告信息，记录潜在有害的情况【使用较多】 | log.warn("...") |
| error | 错误信息【使用较多】 | log.error("...") |


---

可以在配置文件中，灵活的控制输出那些类型的日志。（大于等于配置的日志级别的日志才会输出）

```java
<!--info及以上的级别才会输出，debug和trace都不会输出-->
<root level="info">
    <appender-ref ref="sTDouT"/>
    <appender-ref ref="FILE"/>
</root>

```



tlias 案例日志优化

原本是采用`System.out.println()`的方式来进行输出日志的，加入`lombok`依赖以及配置好日志的配置文件后，就可以在类上直接加上`@slf4j`注解，即可直接使用`log.xxx()`来记录日志

案例如下：

```java
@RestController
public class DeptController{
    
    private static final Logger log = 	Logger Factory.getLogger(DeptController.class);
    @Autowired
    private DeptService deptService;
    
/**
*根据ID删除部门
*/

    @DeleteMapping("/depts")
    public Result delete(Integer id){
        log.info("根据ID删除部门：{}",id);//System.out.println（"根据ID删除部门："+id);
        deptService.delete(id) ;
        return Result.success();
    }
}

//优化后如下
@slf4j
@RestController
public class DeptController{
    
// 有了@slf4j会自动添加 private static final Logger log = 	Logger Factory.getLogger(DeptController.class);
    
    @Autowired
    private DeptService deptService;
    
/**
*根据ID删除部门
*/

    @DeleteMapping("/depts")
    public Result delete(Integer id){
        
        //替换System.out.println（"根据ID删除部门："+id);
        log.info("根据ID删除部门：{}",id); 
        //不用+，采用{}占位符的方式，避免多个参数时拼接麻烦
        
        deptService.delete(id) ;
        return Result.success();
    }
}
```



##### Slf4j 接口
Slf4j（SimpleLoggingFacadeforJava）：简单日志门面，提供了一套日志操作的标准接口及抽象类，允许应用程序使用不同的底层日志框架。

**定义了开发日志的规范，其他日志技术来进行实现**。



### 开发规范-Resuful 风格
REST（REpresentational State Transfer），表述性状态转换，它是一种软件架构风格。

我们先来看传统风格的 url 模式（一般需要与后端写的方法绑定的对应的路径一样）：

| 传统风格URL | 请求方式 | 含义 |
| --- | --- | --- |
| `http://localhost:8080/user/getById?id=1` | GET | 查询id为1的用户 |
| `http://localhost:8080/user/saveUser` | POST | 新增用户 |
| `http://localhost:8080/user/updateUser` | POST | 修改用户 |
| `http://localhost:8080/user/deleteUser?id=1` | GET | 删除id为1的用户 |


如上所示，对应功能的请求路径是依据后端对应方法绑定的路径来写的，我们为了区分不同的功能，肯定不能写一样的，并且每个开发人员的命名习惯不一样，单独对于一个增加操作就可以有  
（`/user/adduser, /user/add, /user/insertUser, /user/insert, /user/saveUser, /user/save`）  
很多种命名方式。

那有没有有一种办法让`url`路径简洁或者相同的同时，也能依据请求路径确定对应的不同的功能呢，

**Restful 开发风格就可以做到在请求路径简洁甚至是相同的情况下也能依据请求路径找到对应的功能模块。**  
Restful 开发风格不依据请求路径的内容来确定对应功能，是依据请求路径的请求方式来确定，具体内容如下：

| REST 风格 url | 请求方式 | 含义 |
| --- | --- | --- |
| `http://localhost:8080/users/1` | GET | 查询id为1的用户 |
| `http://localhost:8080/users/1` | DELETE | 删除id为1的用户 |
| `http://localhost:8080/users` | POST | 新增用户 |
| `http://localhost:8080/users` | PUT | 修改用户 |


#### 注意
1．REST是风格，是约定方式，约定不是规定，可以打破。  
2．描述功能模块通常使用复数形式（加s），表示此类资源，而非单个资源。如：users、books.．·



### 工程搭建
1. 创建SpringBoot工程，并引入web开发起步依赖（`spring-web`）、mybatis（`Mybatis Framework`）、`mysql`驱动(`Mysql Driver`)、lombok
2. 创建数据库表dept，并在`application.yml`中配置数据库的基本信息。

```java
spring:
  application:
    name: springboot-mybatis-quickstart
#数据库的连接信息
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    url: jdbc:mysql://localhost:3306/web01
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: 1234
#Mybatis的相关配置
mybatis:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdoutImpl
  mapper-locations: classpath:mapper/*.xml
```

3. 准备基础代码结构，并引入实体类`Dept`及统一的**响应结果封装类**`Result`（封装像前端返回的数据，包括状态码，信息提示，以及实际数据）





### 三层架构的作用
#### mapper（dao）层（数据层 / 持久层）
主要负责执行SQL语句，与数据库进行交互

```java
@Mapper
public interface DeptMapper {
/**
    查询全部部门
**/
@Select("select * from dept order by update_time desc")
public List<Dept> findAll() ;
```



# Mapper（Dao）层案例问题
## @Mapper注解的作用
### 误解一：@Mapper的注解作用是不是，把创建实例对象的权限交给容器，当需要调用对应接口中的方法时，容器管理实例对象的创建与销毁
`@Mapper` 注解的主要作用并非直接将实例对象的创建与销毁交给容器管理，它的核心功能与 MyBatis 框架的 mapper 接口（数据访问层接口）相关，具体作用如下：



1. **标识 mapper 接口**  
`@Mapper` 是 MyBatis 提供的注解，用于标识一个接口是 **数据访问层接口（mapper 接口）**。MyBatis 会扫描带有该注解的接口，并为其自动生成实现类（代理对象），无需开发者手动编写实现类。例如：

```java
@Mapper
public interface DeptMapper {
    List<Dept> findAll();
}
```

MyBatis 会根据接口中的方法和对应的 SQL 映射（XML 或注解式 SQL），动态生成 `DeptMapper` 的代理实现类，负责数据库操作。

2. **与 Spring 容器的关系**  
如果项目中同时使用了 Spring 和 MyBatis，`@Mapper` 注解生成的代理对象会被自动注册到 Spring 容器中（需配合 MyBatis-Spring 整合包），此时可以通过 `@Autowired` 直接注入使用：

```java
@Service
public class DeptServiceImpl implements DeptService {
    @Autowired
    private DeptMapper deptMapper; // 直接注入 MyBatis 生成的代理对象
}
```

这里容器（Spring）确实会管理 `DeptMapper` 实例的生命周期（创建、注入、销毁），但这是 MyBatis 与 Spring 整合后的附加效果，**并非 **`@Mapper`** 注解本身的核心作用**。

3. **与 **`@Component`** 等注解的区别**  
`@Component`（或 `@Service`、`@Repository`）是 Spring 的注解，用于标识普通的 Bean，由 Spring 直接负责实例化和管理。  
而 `@Mapper` 是 MyBatis 的注解，核心是告诉 MyBatis“这是一个 mapper 接口，需要生成数据库操作的代理实现”，与 Spring 容器的整合是额外的配置支持。



总结：`@Mapper` 的核心是让 MyBatis 识别并生成 mapper 接口的代理实现类，以便执行数据库操作；而该实例被 Spring 容器管理，是 MyBatis 与 Spring 整合后的结果，并非 `@Mapper` 注解的直接作用。



### 误解二：接口不是不能被实例化吗，为什么Mybatis可以基于接口创建对应实例对象
MyBatis 能够基于接口创建实例对象，核心原因是它使用了**动态代理（Dynamic Proxy）** 技术。这并不是直接实例化接口（接口确实不能被直接实例化），而是生成了一个**实现了该接口的代理对象**。

具体原理如下：

1. **接口定义规范**  
我们定义的 Mapper 接口（如 `DeptMapper`）只是声明了方法签名，并没有实现逻辑。但这些方法通常与 SQL 语句绑定（通过 XML 映射文件或注解），例如：

```java
@Mapper
public interface DeptMapper {
    @Select("SELECT * FROM dept")
    List<Dept> findAll();
}
```

2. **动态代理生成代理对象**  
MyBatis 在启动时会扫描所有带 `@Mapper` 注解的接口，然后通过 JDK 动态代理技术，为每个接口生成一个**代理类（Proxy Class）**。这个代理类会：



    - 实现我们定义的 Mapper 接口（因此可以赋值给接口类型变量）
    - 在代理类的方法中，自动拼接 SQL、执行数据库操作、处理结果集
3. **代理对象的工作流程**  
当我们调用 `deptMapper.findAll()` 时，实际执行的是代理对象的逻辑：

```java
// 看似是接口调用，实际是代理对象在工作
List<Dept> depts = deptMapper.findAll(); 
```

代理对象的内部逻辑大致是：



    - 解析接口方法对应的 SQL 语句（从 XML 或注解中获取）
    - 执行 SQL 并获取数据库返回的结果
    - 将结果转换为 Java 对象（如 `Dept` 列表）并返回
4. **为何能注入到 Spring 容器**  
代理对象生成后，MyBatis 会将其交给 Spring 容器管理（通过 `@MapperScan` 配置扫描路径），因此我们可以通过 `@Autowired` 直接注入接口类型的变量——实际上注入的是 MyBatis 生成的代理对象。

总结：  
接口本身确实不能被实例化，但 MyBatis 通过动态代理技术生成了**实现该接口的代理对象**，这个代理对象承担了实际的数据库操作逻辑。我们在代码中使用的“接口实例”，本质上是这个代理对象。



### 误解三：spring的service层不能利用jdbc的动态代理，所以@service注解要写到service层的实现类上对吗
你的理解有一定道理，但可以更准确地表述为：**Spring 的 Service 层组件通常需要开发者自己提供实现类，而 **`@Service`** 注解标注在实现类上，是为了让 Spring 容器识别并管理这个实现类的实例**。

具体原因如下：

1. **Service 层与 Mapper 层的本质区别**  
    - MyBatis 的 Mapper 接口之所以不需要手动写实现类，是因为它的核心逻辑（SQL 执行、结果映射等）是通用的，MyBatis 可以通过动态代理自动生成代理实现类。  
    - 而 Service 层包含的是**业务逻辑**，业务逻辑千差万别（如权限校验、事务控制、多表关联处理等），没有通用的实现模板，必须由开发者手动编写实现类。
2. `@Service`** 注解的作用**  
`@Service` 是 Spring 的注解，用于告诉 Spring 容器：**“这个类是一个业务逻辑组件，请将它纳入容器管理”**。  
由于 Service 接口（如 `DeptService`）只是定义了业务方法规范，而实际的业务逻辑在实现类（如 `DeptServiceImpl`）中，因此 `@Service` 必须标注在**实现类**上，Spring 才能实例化并管理这个包含具体逻辑的对象。
3. **能否让 Service 接口也通过动态代理生成实现类？**  
理论上可以，但实际意义不大：  
    - 业务逻辑的复杂性决定了动态代理无法自动生成有意义的实现（不像 Mapper 接口的逻辑可以通过 SQL 模板化）。  
    - 即使通过 AOP 动态代理增强 Service 接口，也需要先有一个基础的实现类（否则代理对象没有实际逻辑可执行）。

总结：  
`@Service` 标注在 Service 实现类上，是因为 Service 层需要开发者手动实现业务逻辑，而 `@Service` 的作用是让 Spring 容器管理这个实现类的实例。这与 MyBatis 利用动态代理生成 Mapper 实现类的场景不同，核心原因是**业务逻辑无法像数据访问逻辑那样被通用化、模板化**。







#### service 层（业务层）
负责业务逻辑的操作，但是目前写的简单案例没有业务逻辑操作，所以`service`层直接调用`mapper`层的方法即可

```java
@Service
public class DeptServiceImpl implements DeptService {
    
    @Autowired
    private DeptMapper deptMapper;
    
    @override
    public List<Dept>>findAll (){
        return deptMapper.findAll();
    }
}
```



# Service层案例问题
## 一、关于 `@org.springframework.stereotype.Service` 而非 `@Service` 的原因
这是因为没有导入对应的包别名（即 **静态导入** 或 **包路径简写**）。  

在 Java 中，使用注解时需要指定其完整的包路径，除非通过 `import` 语句导入了该注解。例如：  

```java
// 导入后，就可以直接使用 @Service
import org.springframework.stereotype.Service;

@Service // 等价于 @org.springframework.stereotype.Service
public class UserServiceImpl { ... }
```

如果没有写 `import org.springframework.stereotype.Service;`，就必须用完整的包路径 `@org.springframework.stereotype.Service` 来引用该注解。这只是语法上的写法差异，功能完全一致。





## 二、为什么 `@Service` 注解用在 **实现类** 而非 **接口** 上？
这与 Spring 的 **依赖注入（DI）机制** 和 **接口的特性** 密切相关：  

1. **Spring 需要实例化具体对象**  
`@Service` 的作用是告诉 Spring：“这个类是一个服务层组件，请你在启动时创建它的实例，并纳入 IoC 容器管理”。  
而 **接口是不能被实例化的**（接口没有构造方法，无法创建对象），因此 Spring 无法基于接口创建实例，只能通过实现类来创建对象。  
2. **接口的设计目的是定义规范**  
接口通常用于定义服务的“行为规范”（方法签名），而实现类才是具体的逻辑实现。Spring 管理的是“可执行的具体实现”，而非抽象的规范。  
3. **避免依赖注入冲突**  
一个接口可能有多个实现类（例如 `UserService` 可能有 `UserServiceImpl`、`UserServiceMockImpl` 等）。如果将 `@Service` 加在接口上，Spring 无法确定应该实例化哪个实现类，会导致冲突。





### 举例说明
正确的做法是：  

```java
// 接口（仅定义规范，不添加 @Service）
public interface UserService {
    void addUser();
}

// 实现类（添加 @Service，让 Spring 管理其实例）
import org.springframework.stereotype.Service;

@Service // 等价于 @org.springframework.stereotype.Service
public class UserServiceImpl implements UserService {
    @Override
    public void addUser() {
        // 具体逻辑
    }
}
```

这样 Spring 会创建 `UserServiceImpl` 的实例，当其他组件（如 `Controller`）需要依赖 `UserService` 时，Spring 会自动注入其实现类的实例（默认按类型匹配）。



总结：  

+ 注解的完整路径写法是因为缺少 `import` 语句，导入后即可简写。  
+ `@Service` 用于实现类，是因为 Spring 需要管理具体可实例化的对象，而接口无法被实例化。



## 三，注意定义的`service`服务层的名字不能直接是`service`,否则会与java中定义好的@Service注解起冲突。
你遇到的问题是因为类名与导入的注解类名发生了冲突。具体来说，你的代码中存在以下冲突：

1. 你定义了一个接口 `org.tlias.service.impl.Service`
2. Spring 有一个注解 `org.springframework.stereotype.Service`

当你导入 `org.springframework.stereotype.Service` 时，它与你自己的 `Service` 接口重名了，导致编译器无法区分它们。



解决方法有两种：

### 方法1：重命名你的Service接口
最彻底的解决方式是将你自己的 `Service` 接口重命名为更具体的名称，例如 `DeptService`，这样就不会与Spring的注解冲突了。



### 方法2：不导入Spring的Service注解
保持你现在的写法，不导入 `org.springframework.stereotype.Service`，直接使用全限定名：

```java
package org.tlias.service.impl.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.tlias.mapper.DeptMapper;
import org.tlias.pojo.Dept;
import org.tlias.service.impl.Service;  // 这是你自己的接口

// 不导入Spring的Service注解

@org.springframework.stereotype.Service  // 使用全限定名
public class ServiceImpl implements Service {

    @Autowired
    private DeptMapper deptMapper;

    @Override
    public List<Dept> findAll() {
        return deptMapper.findAll();
    }
}
```

推荐使用第一种方法，因为接口命名为 `Service` 本身就不够具体，重命名为业务相关的名称（如 `DeptService`）能让代码更清晰易懂。







#### controller 层（控制 / 表现层）
负责接收前端发来的请求，并依据请求进行相应对应的数据（依据请求调用对应`service`层中的方法，返回结果，状态码，状态信息）

接受请求响应数据（通过调用`service`层然后`service`层调用`mapper`层来查询数据）。

```java
@RestController
public class Deptcontroller {
    
    @Autowired
    private DeptService deptService;
     
 //@RequestMapping(value="/depts", method = RequestMethod.GET)   限定请求方式为GET。多个属性时value不省略
    @GetMapping("/depts")
    public Result findAll(){
        List<Dept> deptList=deptService.findAll();
        return Result.success(deptList);
    }
}
```



# Controller层案例问题
## 因`Result`实体类缺少`get`和`set`方法而无法正确返回数据到前端，后端可以正常查询到数据
```java
@GetMapping("/depts")
public Result findAll(){
    System.out.println("查询所有部门");
    List<Dept> data=service.findAll();
    return Result.successful(data);
}
```

我这里定义了带参函数，调用成功且有返回数据时进行调用

```java
public static Result successful(Object object){
Result result=new Result();
result.code=100;
result.message="调用成功！";
result.data=object;
return result;
}
```



这是因为在Java中，当你需要将对象序列化为JSON（或其他数据格式）返回给前端时，序列化库（如Jackson、Gson等）通常需要通过**getter方法**来访问对象的属性。

你的`Result`类虽然定义了`code`、`message`、`data`这些属性，但如果没有提供getter方法：

+ 序列化库无法正确读取这些属性的值
+ 导致前端收到的JSON数据可能为空或不完整
+ 

### 为什么会这样？
1. 序列化库（如Spring默认使用的Jackson）默认通过getter方法获取属性值，而不是直接访问字段
2. 即使字段是`public`的，有些序列化库仍然优先使用getter方法
3. 当你没有定义getter方法时，序列化库无法获取属性值，所以前端收不到数据
4. 

### 解决方案
为`Result`类的所有属性添加getter方法（通常也会添加setter方法，以便于对象的构建）：

```java
public class Result {
    private Integer code;
    private String message;
    private Object data;
    
    // 无参构造器（序列化时需要）
    public Result() {}
    
    // getter方法（必须）
    public Integer getCode() {
        return code;
    }
    
    public String getMessage() {
        return message;
    }
    
    public Object getData() {
        return data;
    }
    
    // setter方法（可选，但建议添加）
    public void setCode(Integer code) {
        this.code = code;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public void setData(Object data) {
        this.data = data;
    }
    
    // 静态工厂方法
    public static Result successful(Object object) {
        Result result = new Result();
        result.code = 100;
        result.message = "调用成功！";
        result.data = object;
        return result;
    }
}
```



### 补充说明
+ 如果你使用Lombok，可以通过`@Data`注解自动生成getter、setter等方法，简化代码
+ 某些序列化库可以配置为直接访问字段，但这不是常规做法，且可能带来安全问题
+ 规范的JavaBean通常都需要包含getter和setter方法，这是Java的标准实践

这个函数，调用这个方法的时候，不是没有用到get和set方法吗，为什么不写get和set方法时，数据就不能返回到前端





### 建立项目数据库，项目表，插入信息
#### 部门表
```sql
CREATE TABLE dept(
    id int unsigned PRIMARY KEY AUTO_INCREMENT COMMENT 'ID，主键',
    name Varchar(10) NOT NULL UNIQUE COMMENT '部门名称',
    create_time datetime DEFAULT NULL COMMENT '创建时间',
    update_time datetime DEFAULT NULL COMMENT '修改时间'
) COMMENT '部门表';

INSERT INTO dept VALUES
(1,'学工部','2024-09-25 09:47:40','2024-09-25 09:47:40'),
(2,'教研部','2024-09-25 09:47:40','2024-09-09 15:17:04'),
(3,'咨询部','2024-09-25 09:47:40','2024-09-30 21:26:24'),
(4,'就业部','2024-09-25 09:47:40','2024-09-25 09:47:40'),
(5,'人事部','2024-09-25 09:47:40','2024-09-25 09:47:40'),
(6,'行政部','2024-11-30 20:56:37','2024-09-30 20:56:37');
```



#### 员工表
## 部门管理
### 查询
#### 结果封装问题
+ **数据库字段名与对应实体类的名字要尽量一样，否则数据封装不到对应属性中**



+ 若不一样，可以通过注解`@Result`来进行指定，手动配置**手动结果映射： 通过 @Results及@Result 进行手动结果映射**

```java
@Results({
    @Result(column = "create_time", property = "createTime"),
    @Result(column = "update_time", property = "updateTime")
)
@Select("select id,name, create_time, update_time from dept order by update_time desc")
public List<Dept> findAll();
```

+ 也可以对查询到的字段进行取别名，以此来达到两个名字相等的目的，完成数据的封装**起别名：在SQL语句中，对不一样的列名起别名，别名和实体类属性名一样。**

```javascript
@Select("select id,name,create_time createTime,update_time updateTime from dept...")
public List<Dept> findAll();
```

+ **开启驼峰命名：如果字段名与属性名符合驼峰命名规则，mybatis会自动通过驼峰命名规则映射**就是命名格式为`xxxXxx`以及`xxx_xxx`

```yaml
mybatis:
    configuration:
      map-underscore-to-camel-case: true
```





#### 前后端联调测试
前端页面需要部署到`nginx`服务器当中来进行测试。

将资料中提供的前端工程文件夹中的压缩包，拷贝到一个没有中文不带空格的目录下，解压。  
启动nginx，访问测试路径：[http://localhost:90](http://localhost:90)

解压后的文件夹里面：

`conf`：存放`nginx`服务器的配置文件

`html`：存放要部署到服务器的前端页面文件

`logs`：存放`nginx`服务器运行日志



#### 前端工程请求服务器的地址为http:/ /localhost:90/api/depts，是如何访问到后端的tomcat服务器的?
**反向代理**：是一种网络架构，通过代理服务器为后端的服务器做代理，客户端的请求直接请求代理服务器，然后转发给后端的服务器。（安全、灵活、负载均衡）

把nginx作为中间件，前端直接访问nginx，由nginx决定访问哪个数据库的数据，以及请求发送到哪个服务器。

反向代理的配置文件如下

```nginx
server {
    listen 90;
    #省略...
    location ^~/api/ {
        rewrite ^/api/(.*)$ /$1 break;
        proxy_pass http://localhost:8080;
    }
}
```

+ `location`：用于定义匹配路径匹配的规则。
+ `^~/api/`：表示精确匹配，即只匹配以/api/开头的路径。
+ `rewrite`：该指令用于重写匹配到的路径。
+ `proxy_pass`：该指令用于代理转发，它将匹配到的请求转发给位于后端的指令服务器。



### 新增
#### controller 层接收（json格式）请求数据
接收json格式的请求参数：POST  /depts  { "name”：“教研部” }

JSON格式的参数，通常会使用一个实体对象进行接收  
规则：JSON数据的键名与方法形参对象的属性名相同，并需要使用@RequestBody注解标识。

```java
@PostMapping("/depts")
public Result add(@RequestBody Dep dept){
    System.out.println（"添加部门：：" + dept);
    deptService.add(dept);
    return Result.success();
}
```

**使用**`@RequestBody`**后接收的**`json`**格式的请求参数会，自动匹配到实体类的对应属性当中。**



#### 如何接收JSON格式的请求参数？
+ 通常通过实体对象接收，保证json格式的键名与对象属性
+ 添加@RequestBody注解



#### json格式的请求参数适用场景？
+ 主要在POST、PUT请求中，在**请求体**传递请求参数







### 修改
#### controller层接收url 后的请求参数（路径参数）
路径参数：通过请求URL直接传递参数，使用`{..}`来标识该路径参数（括号中的内容是给路径参数取的名字），需要使用`@PathVariable`注解指定把路径参数绑定给哪个名字。

```java
@GetMapping("/depts/{id}")
public Result getInfo(@Pathvariable("id") Integer deptId){
    System.out.println("根据ID查询部门数据："+deptId)；
    Dept dept = deptService.getInfo(id);
    return Result.success(dept);
}
```

当方法形参名字与传来的路径参数名字相同时，注解@Pathvariable后的指定名称可以省略，案例如下：

```java
@GetMapping("/depts/{id}")
public Result getInfo(@Pathvariable Integer id){
    System.out.println（"根据ID查询部门数据："+id)；
    Dept deptdeptService.getInfo(id);
    return Result.success(dept);
}
```



### 删除
需要传入参数，依据`id`删除信息，`id`可以唯一确定一条信息。



#### 方式一：通过原始的`HttpServletRequest`对象获取请求参数
```java
@DeleteMapping("/depts")
public Result delete(HttpServletRequest request){
    String idstr = request.getParameter("id") ;
    int id = Integer.parseInt(idstr);
    System.out.println（"根据ID删除部门：" + id);
    return Result.success();
}
```



#### 方式二：通过Spring提供的@RequestParam1注解，将请求参数绑定给方法形参
```java
@DeleteMapping("/depts")
public Result delete(@RequestParam("id") Integer deptId){
    System.out.println("根据ID删除部门："+ deptId);
    return Result.success();
}
```

##### 注意
注意事项：一旦声明了@RequestParam，该参数在请求时必须传递，如果不传递将会报错。（默认required为true)

可以选择把`required`修改为`false`，这样即便不传递也不会报错（`@Requestparam("id",required=false)`）



#### 方式三：如果请求参数名与形参变量名相同，直接定义方法形参即可接收。（省略aRequestParam
```java
@DeleteMapping("/depts")
public Result delete(Integer id){
    System.out.println("根据ID删除部门："+id);
    return Result.success();
}
```



一个完整的请求路径，应该是类上的`@RequestMapping`的`value`属性+controller方法上的`@RequestMapping`的`value`属性,

controller里方法上的`@Put/@Delete/@Get/@Post mapping`都是`@RequestMapping`的衍生注解。

可以把相同的前缀部分加到controller层的`@RequestMapping`上。

**加之前如下**：

```java
@RestController
public class DeptController {
    //定义dept表对应的控制类，对前端发送的请求进行响应
    //调用service层进行业务逻辑处理，然后调用mapper层进行SQL语句查询相关的数据响应给前端

    @Autowired
    private DeptService deptService;

    //查询所有的部门
    @GetMapping("/depts")
    public Result findAll(){
        System.out.println("查询所有部门");
     List<Dept> data=deptService.findAll();
     return Result.successful(data);
    }


    //删除部门
    @DeleteMapping("/depts")
    public Result deleteDept( @Param("id") Integer id){

        System.out.println("删除部门！");
        deptService.deleteDept(id);

        return Result.Successful();
    }

    //添加部门
    @PostMapping("/depts")
    public Result addDept(@RequestBody  Dept dept){
//        dept.setName(name);
        deptService.addDept(dept);
        return Result.successful(dept);
    }


    //依据id查询部门数据
    @GetMapping("/depts/{id}")
    public Result findDeptByID(@PathVariable("id") Integer deptId){
        Dept dept=deptService.findDeptById(deptId);
        return Result.successful(dept);
    }

    //修改部门信息
    @PutMapping("/depts")
    public Result updateDept(@RequestBody Dept dept){
        deptService.updateDept(dept);
        return Result.Successful();
    }
}
```



**加之后如下**：

```java

@RequestMapping("/depts")
@RestController
public class DeptController {
    //定义dept表对应的控制类，对前端发送的请求进行响应
    //调用service层进行业务逻辑处理，然后调用mapper层进行SQL语句查询相关的数据响应给前端

    @Autowired
    private DeptService deptService;

    //查询所有的部门
    @GetMapping
    public Result findAll(){
        System.out.println("查询所有部门");
     List<Dept> data=deptService.findAll();
     return Result.successful(data);
    }


    //删除部门
    @DeleteMapping
    public Result deleteDept( @Param("id") Integer id){

        System.out.println("删除部门！");
        deptService.deleteDept(id);

        return Result.Successful();
    }

    //添加部门
    @PostMapping
    public Result addDept(@RequestBody  Dept dept){
//        dept.setName(name);
        deptService.addDept(dept);
        return Result.successful(dept);
    }


    //依据id查询部门数据
    @GetMapping("/{id}")
    public Result findDeptByID(@PathVariable("id") Integer deptId){
        Dept dept=deptService.findDeptById(deptId);
        return Result.successful(dept);
    }

    //修改部门信息
    @PutMapping
    public Result updateDept(@RequestBody Dept dept){
        deptService.updateDept(dept);
        return Result.Successful();
    }


}

```



## 员工管理
### 查询
### 新增
### 修改
### 删除
## 文件上传
### 查询
### 新增
### 修改
### 删除
## 报表统计
## 登录认证
+ **登录标记**：用户登录成功之后，在后续的每一次请求中，都可以获取到该标记。【会话技术】
+ **统一拦截**：过滤器`Filter`、拦截器`Interceptor`

用户进行登陆后，存入一个登录成功与否的标记，然后通过使用拦截器来对用户发送的每一次请求进行拦截，拦截后获取登陆标记确认是否成功登陆，若成功则放行请求，没有成功返回错误结果给前端，强制跳转到登陆页面让用户进行登录。



### 会话技术
**会话**：用户打开浏览器，访问web服务器的资源，会话建立，直到有一方断开连接，会话结束。在一次会话中可以包含多次请求和响应。

**会话跟踪**：一种维护浏览器状态的方法，服务器需要识别多次请求是否来自于同一浏览器，以便在同一次会话的多次请求间共享数据。



### 会话跟踪方案：
1. 客户端（存储在客户端浏览器）会话跟踪技术：Cookie
2. 服务端（存储在服务器）会话跟踪技术：Session
3. 令牌技术



#### 方案一：浏览器Cookie
**优点：**

HTTP 协议中支持该技术，在请求发送的请求头以及服务器端响应的响应头上会保存有Cookie信息。

在同一个会话中，第一次请求发送过去后，服务器端会自动生成Cookie信息然后返回给客户端（也就是浏览器），Cookie信息在响应头中发送过去，当该会话后续还有发送其他请求，Cookie信息便会在发送请求时，自动装配到请求头中发送过去。

服务器端设置Cookie后会自动在响应头的`Set-Cookie`中把Cookie的信息返还给前端，浏览器在接收到响应后，会自动把Cookie保存到本地，后续在发送请求时，会自动把保存的Cookie信息在请求头Cookie中发送给服务器端



**缺点：**

+ **移动端APP无法使用Cookie**
+ 不安全，用户可以自己禁用cookie（Cookie信息是返还给客户端（浏览器），存储在浏览器中的，用户可以自己禁用或者删除）
+ Cookie不能跨域（前端与后端若部署不在同一网络域名下，cookie是不能正常使用的）



#### 方案二：服务器端 Session
Session底层也是基于Cookie的。

给浏览器端第一次访问登录功能，若登陆成成功，服务器端会自动创建一个Session对象，并给其分配一个唯一的id值，然后把id值在响应头Set-Cookie中返还给前端 (浏览器) ，当后续同一个会话中继续发送请求时，会在请求体Cookie中携带之前服务器端返回的Session的id值，然后依据该ID值来在服务器端寻找与之对应的Session值。

**优点：**

存储在服务端，安全

**缺点：**

服务器集群环境下无法直接使用Session

Cookie的所有缺点都具有



#### 方案三：令牌技术
当用户发送请求，例如登陆成功时，服务器端会自动生成一个令牌，然后把令牌返回给客户端（浏览器），浏览器接收到令牌后，把令牌**存储到本地，**后续发送请求时，把令牌也随之一起携带过去，这样服务器端检测令牌，确认有效后，对请求进行放行，让他访问对应资源。



优点：

+ 支持PC端、移动端
+ 解决集群环境下的认证问题（不会像Session一样存储在服务器中，集群环境有多个服务器）
+ 减轻服务器端存储压力（服务器不需存储内容）



缺点：

+ 需要自己进行实现



### JWT令牌技术
全称：JSON WebToken([https://jwt.io/](https://jwt.io/))

定义了一种简洁的、自包含的格式，用于在通信双方以**json数据格式**安全的传输信息。

**Base64**：是一种基于64个可打印字符（A-Za-Z0-9+/）来表示二进制数据的编码方式。（编码后可能会有`=`号，为部位符号）



#### 组成：
每部分之间进行编码（Base64）后生成对应的令牌，每部分之间在编码后以`.`隔开。

1. 第一部分：Header（头），记录令牌类型、签名算法等。例如：{"alg"："HS256"，"type"："JwT"}
2. 第二部分：Payload（有效载荷），携带一些自定义信息、默认信息等。例如：{"id"："1"，"username"："Tom"}
3. 第三部分：Signature（签名），防止Token被篡改、确保安全性。将header、payload融入，并加入指定秘钥，通过指定签名算法计算而来。

前两部分通过Base64编码把JSON类型的信息编码之后，第三部分会把前两部分以及自己定义的密钥合起来，通过第一部分指定的签名算法来进行编码，然后与经过Base64编码后的前两部分的内容通过`.`拼接起来作为一个完整的令牌。



#### JWT令牌技术的具体实现
##### 引入jjwt的依赖。
```xml
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactld>jjwt</artifactld>
  <version>0.9.1</version>
</dependency>
```

##### 调用官方提供的工具类Jwts来生成或解析jwt令牌。
```java
public void testGenJwt() {
    
    Map<String, Object> claims = new HashMap<>();claims.put("id", 10);
    
    claims.put("username", "itheima");
    //signWith用来指定签名，参数一共两个，第一个用来指定签名算法，第二个参数指定密钥
    String jwt = Jwts.builder().signWith(SignatureAlgorithm.HS256, "SVRIRUlNQQ==")
    //addclaims方法用来添加自定义信息，参数为一个Map双列集合
                              .addclaims(claims)
    //设定当前令牌的有效期，传递日期类型的参数
                              .setExpiration(new Date(System.currentTimeMillis() + 12*3600*1000))
    //最后通过compact方法生成令牌
                              .compact();
    System.out.println(jwt);
}
```

##### 解析JWT令牌方式
利用Jwts中的`parser`方法来解析Jwt令牌，解析令牌成功后，获得的Claims是令牌中存储的自定义信息，Claims本质是一个Map集合

```java
public void testParseJwt() throws Exception {

    String jwtToken = "eyJ0eXAi0iJKV1QiLCJhbGciOiJIUzI1NiJ9...";

    Claims claims = Jwts.parser()
//指定解析令牌时使用的密钥
                        .setSigningKey("SVRIRULNQQ==")
//传入需要解析的令牌
                        .parseClaimsJws( jwtToken)
//获取令牌中的自定义信息，返回一个Claims对象，本质是一个Map集合
                        .getBody();
    System.out.println(claims);
}
```



# Filter拦截器
定义Filter：定义一个类，实现Filter 接口，并实现其所有方法。

配置Filter：Filter类上加`@WebFilter`注解，配置拦截路径。引导类（就是启动类）上加`@ServletComponentScan` 开启Servlet组件支持。

```java
//指定Filter拦截器需要拦截哪些类型的请求,这里的 /*指的是拦截所有的请求
@WebFilter(urlPatterns = "/*")
public class DemoFilter implements Filter {
    
    //初始化方法，web服务器启动，创建Filter实例时调用，只调用一次
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out rintln("init ...");
    }
    
    //拦截到请求时，调用该方法，可以调用多次
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain) throws Exception{
        System.out.println("拦截到了请求。..");
        //放行拦截到的请求让他去访问对应的资源
        chain.doFilter(servletRequest, servletResponse);
    }
    
    //销毁方法，web服务器关闭时调用，只调用一次
    public void destroy() {
        System.out.println("destroy ... ");
    }

}
```



# Interceptor拦截器
首先定义拦截器类，然后再创建配置类，在配置类中进行添加（或者说注册拦截器）。

```java
/**
 * 定义配置类
 * 利用其中方法把拦截器加入到项目中
 */
@Configuration  //标注当前的类为一个配置类
public class AddConfig implements WebMvcConfigurer {

    @Autowired
    private DemoInterceptor demoInterceptor;

    @Autowired
    private TokenInterceptor tokenInterceptor;

    /**
     * 添加拦截器
     * @param registry 拦截器注册类
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        //添加拦截器，指定拦截器的拦截范围 /**为拦截所有请求
//        registry.addInterceptor().addPathPatterns("/**");
//        /**定义拦截范围为拦截所有的请求，excludePathPatterns为需要排除的请求，这里是排除掉 /login请求
//        registry.addInterceptor(demoInterceptor).addPathPatterns("/**").excludePathPatterns("/login");

    }
}
```

拦截器定义方式

```java
@Slf4j
@Component
public class DemoInterceptor implements HandlerInterceptor {


    /**
     * 请求访问资源之前
     * @param request 请求信息（请求头，请求体）
     * @param response 响应头（响应头，响应体）
     * @param handler 处理器
     * @return true 放行，false 不放行
     * @throws Exception 抛出异常
     */
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        if(request.getRequestURI().contains("/login")){

            log.info("当前请求接口为登陆接口，放行");
            return true;
        }
        log.info("当前接口为：{}",request.getRequestURI());
        log.info("开始执行拦截器方法");


        //若token为空，getHeader会为null，调用isEmpty时会报空指针异常，所以要先判断一下是否为空
        //修改条件判断顺序，先判断是否为 null，再判断是否为空字符串。Java 中的逻辑或 || 运算符具有短路特性，当前面条件为真时不会执行后面的操作
//        if(request.getHeader("token").isEmpty() || request.getHeader("token")==null)
//        这样修改后，即使 getHeader("token") 返回 null，也会因为短路机制避免调用 .isEmpty() 方法，从而防止 NullPointerException 异常的发生。

        if(request.getHeader("token")==null || request.getHeader("token").isEmpty())
        {


            log.info("当前令牌为空");
            response.setStatus(401);
            return false;

        }

        try {
            log.info("开始验证token");
            if(JWTUtils.parseToken(request.getHeader("token"))!=null){
                log.info("token验证成功");
                return true;
            }


        } catch (Exception e) {
            log.error("token验证失败");
            response.setContentType("application/json;charset=utf-8");
            response.getWriter().write("token验证失败");
            response.setStatus(401);
            return false;
        }

        return true;


    }

    /**
     * 请求访问资源之后，渲染视图之前
     * @param request 请求信息（请求头，请求体）
     * @param response 响应头（响应头，响应体）
     * @param handler 处理器
     * @param modelAndView 模型和视图
     * @throws Exception 抛出异常
     */
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
    }
}

```



# AOP各个概念
1. **连接点：**JoinPoint，可以被AOP控制的方法（暗含方法执行时的相关信息）

> 连接点不一定是切入点，连接点指的只是可以满足被`Aop`切面进行控制的条件，切入点是实际被`Aop`控制的方法
>



2. **通知：**Advice，指那些重复的逻辑，也就是共性功能（最终体现为一个方法）

> 把多个方法或者业务逻辑中都需要的功能抽取出来作为方法进行使用，叫做通知
>



3. **切入点：**PointCut，匹配连接点的条件，**通知仅会在切入点方法执行时被应用**

> 满足使用切面类的条件并且是实际被切面控制的业务方法，一般通过两种切入点表达式方式指定
>



4. **切面：**Aspect，描述通知与切入点的对应关系（通知+切入点）

> 通知（共性的方法）加上切入点（被控制的方法）一并可称为切面，实际上就是切面类，切面类中的每一个方法都是一个切面
>



5. **目标对象：**Target，通知所应用的对象

> 切面类真正作用在的那个对象（或者可以说是类），例如切面类的作用是统计`Service`层中的各种业务方法
>



## 两种切入点表达式
切入点用来指定切面实际控的方法，一般通过两种切入点表达式方式指定



### `execution(...)`指定切入点表达式
`execution `主要根据方法的**返回值、包名、类名、方法名、方法参数等信息来匹配**，语法为：

可以使用**通配符（**`***  ..**`**）**描述切入点

`execution(访问修饰符？ 返回值 包名.类名. ？方法名(方法参数) throws 异常？)`

带`？`的表示可以被**省略**的部分（**访问修饰符，包名类名**（但是包名类名一般不要省略，不然匹配比较混		乱），**方法抛出的异常**也可以省略）



    - `*`: 表示单个独立的任意符号，可以通配任意返回值、包名、类名、方法名、任意类型的一个参数，也可以通配包、类、方法名的一部分

`execution(* com.*.service.*.update*(*))`

该切入点表达式表示的方法是，返回值任意的，`com`包下的，**任意一级**的，`service`包下，**任意类**的，前缀为`update`的，任意类型的一个参数的，方法



    - `..`: 多个连续的任意符号，可以通配**任意层级的包，或任意类型、任意个数的参数（若是**`*****`**号出现在方法的参数位置只匹配一个任意类型的参数）**

`excution(* com.itheima..DeptService.*(..))`

该切入点表达式表示的是：返回值任意的，`com.itheima`包下的，任意层级的（任意包下的），`DepService`包下的，方法名任意，参数任意的方法。



### 使用注解代替切入点表达式
在需要使用通知的方法上**加上指定的切面注解**即可

```java
//@Target注解表示该注解在什么地方执行，这里是在方法上执行
//@Retention注解表示注解在什么时候执行，这里是在运行时执行
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Logoperation{...}
```

```java
//@annotation后面写的是注解的全类名
@Around("@annotation(com.itheima.anno.LogOperation)")
public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable{...}
```

### @PointCut 注解
该注解的作用是将公共的切点表达式抽取出来，需要用到时引用该切点表达式即可

```java
@Pointcut("execution(* com.itheima.service.impl.DeptServiceImpl.*(..)) ")
public void pt(){}

@Around("pt()")
public Object recordTime(ProceedingJoinPoint joinPoint) throws Throwable {}
```

这里相当于把切入点表达式利用`@PointCut`注解抽取出来作为一个方法，在需要使用时就采用类似方法调用的方式来进行使用该切入点表达式，案例中抽取到方法`pt()`上了，该方法的修饰符为`private`时，代表抽取出的切入点表达式只能在该切面类中使用，若修饰符为`public`则表示在其它切面类中也可以引用该表达式。



## 几种通知方法的类型
根据通知方法执行时机的不同，将通知类型分为以下常见的五类：

1. @Around：环绕通知，此注解标注的通知方法在目标方法前、后都被执行
2. @Before：前置通知，此注解标注的通知方法在目标方法前被执行
3. @After：后置通知，此注解标注的通知方法在目标方法后被执行，无论是否有异常都会执行
4. @AfterReturning：返回后通知，此注解标注的通知方法在目标方法后被执行，有异常不会执行
5. @AfterThrowing：异常后通知，此注解标注的通知方法发生异常后执行



## 通知的运行顺序
当有多个切面的切入点都匹配到了目标方法，目标方法运行时，多个通知方法都会执行

执行顺序：

+ 不同切面类中，默认按照**切面类的类名字母排序**：
+ **目标方法前**的通知方法：字母排名靠前的先执行
+ **目标方法后**的通知方法：字母排名靠前的后执行



也可以用`@Order(数字)`注解加到切面类上来进行控制顺序

+ **目标方法前**的通知方法：数字小的先执行
+ **目标方法后**的通知方法：数字小的后执行



### 注意：
`@Around`环绕通知需要自己调用` ProceedingJoinPoint.proceed（）`来让原始方法执行，其他通知不需要			考虑目标方法执行

`@Around`环绕通知方法的返回值，必须指定为object，来接收原始方法的返回值。



## 通知中调用原始方法的方式
在`Spring`中用`JoinPoint`抽象了连接点，用它可以获得方法执行时的相关信息，如目标类名、方法名、方法参数等。

1. 对于 `@Around` 通知，获取连接点信息只能使用 `ProceedingJoinPoint`
2. 对于其它四种通知，获取连接点信息只能使用 `JoinPoint` ，它是 `ProceedingJoinPoint `的父类型

通过`ProceedingJoinPoint / JoinPoint`可以获取到的信息如下：

```java
public void before(JoinPoint joinPoint) {

    String className = joinPoint.getTarget().getClass().getName(); //获取目标类名

    Signature  signature = joinPoint.getSignature();//获取目标方法签名

    String methodName = joinPoint.getSignature().getName(); //获取目标方法名

    Object[] args = joinPoint.getArgs();//获取目标方法运行参数
}
```



## AOP使用案例
1. 首先引入`AOP`的依赖

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```



2. 编写`AOP`程序，编写一个新的类专门用来实现`AOP`功能，需在类上加上`@Aspect`和`@Component`注解

```java
@Aspect
@Component
public class RecordTimeApsect {

    //这里采用execution表达式来指定AOP控制的方法，也可使用注解来进行控制
    @Around("execution(* com.itheima.service.impl.*.*(..))")
    public Object recordTime(ProceedingJoinPoint pjp) throws Throwable {
        
        long beginTime = System.currentTimeMillis();

        //执行原本的方法
        Object result = pjp.proceed();
        
        long endTime = System.currentTimeMillis()
        log.info(" 执行耗时: {} ms", endTime - beginTime);

        //把原始方法的返回值传递回来
        return result;
    

}
```

# 序列化流
<font style="color:rgb(28, 31, 35);background-color:rgba(0, 0, 0, 0);">序列化（Serialization）本质是：</font>

+ **<font style="color:rgb(28, 31, 35);background-color:rgba(0, 0, 0, 0);">核心动作</font>**<font style="color:rgb(28, 31, 35);background-color:rgba(0, 0, 0, 0);">：将</font>**<font style="color:rgb(28, 31, 35);background-color:rgba(0, 0, 0, 0);">内存中的结构化数据</font>**<font style="color:rgb(28, 31, 35);background-color:rgba(0, 0, 0, 0);">（比如 Python 的字典、对象，Java 的类实例，前端的对象）转换成</font>**<font style="color:rgb(28, 31, 35);background-color:rgba(0, 0, 0, 0);">可存储 / 可传输的字节流 / 字符串</font>**<font style="color:rgb(28, 31, 35);background-color:rgba(0, 0, 0, 0);">（比如 JSON 字符串、二进制流、XML）。</font>
+ **<font style="color:rgb(28, 31, 35);background-color:rgba(0, 0, 0, 0);">反向操作</font>**<font style="color:rgb(28, 31, 35);background-color:rgba(0, 0, 0, 0);">：反序列化（Deserialization）则是把字节流 / 字符串还原回原来的结构化数据。</font>
+ **<font style="color:rgb(28, 31, 35);background-color:rgba(0, 0, 0, 0);">关键区别于普通转换</font>**<font style="color:rgb(28, 31, 35);background-color:rgba(0, 0, 0, 0);">：普通数据转换可能只是 “数字转字符串”“列表转元组”（仍在内存中），而序列化的核心目的是</font>**<font style="color:rgb(28, 31, 35);background-color:rgba(0, 0, 0, 0);">跨平台 / 跨进程 / 持久化</font>**<font style="color:rgb(28, 31, 35);background-color:rgba(0, 0, 0, 0);">—— 比如把 Python 对象存到文件、通过网络传给 Java 服务、存到数据库。</font>

主要目的是进行数据的转换，例如把一个对象的信息写入到文件中，如果直接明文写入的话，用户可以随意修改数据，不安全，使用序列化之后内容会变成乱码，安全性高，但是需要注意**反序列化时，需要保持序列号一致**（序列号是进行序列化之前，序列化器对当前对象的所有属性计算的一个序列值），若中间对该对象进行了修改，序列化值便会改变，反序列化时会因为，序列号前后不一致而报错，所以要对对象指定一个固定的**序列值（或者是版本号）被序列化的对象需要实现**`**Serializable**`**接口，同时需要一个固定的序列版本号，避免前后序列值不一样的情况出现**

```java
//实现序列化接口
public class Student implements Serializable{
    //固定版本号不变，版本号一般比较长int类型不够，所以使用Long，
    //版本号的名字只能写serialVersionUID，否则java编译器不能识别
	private static final long serialVersionuID = 1L;
	private string name;
	private int age;
	private String address;
}
```



## 
+ 使用序列化流将对象写到文件时，需要让Javabean类实现Serializable接口。否则，会出现NotSerializableException异常



+ 序列化流写到文件中的数据是不能修改的，一旦修改就无法再次读回来了



+ 序列化对象后，修改了Javabean类，再次反序列化，会不会有问题？

**会出问题**，会抛出InvalidclassException异常

**解决方案**：给Javabean类添加serialVersionUID（序列号、版本号）



+ 如果一个对象中的某个成员变量的值不想被序列化，又该如何实现呢？

解决方案：给该成员变量加`**transient**`关键字修饰，

该关键字标记的成员变量不参与序列化过程


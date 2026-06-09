# Markdown 语法参考

本页展示 VitePress 内置的 Markdown 扩展语法，写文章时可以参考。

## 代码高亮

VitePress 基于 [Shiki](https://github.com/shikijs/shiki) 提供语法高亮，支持行号高亮：

**写法**

````md
```java{4}
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello DevLog!");
    }
}
```
````

**效果**

```java{4}
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello DevLog!");
    }
}
```

## 自定义容器

**写法**

```md
::: info
这是一个信息提示框。
:::

::: tip
这是一个小贴士。
:::

::: warning
这是一个警告。
:::

::: danger
这是一个危险警告。
:::

::: details
这是一个折叠块。
:::
```

**效果**

::: info
这是一个信息提示框。
:::

::: tip
这是一个小贴士。
:::

::: warning
这是一个警告。
:::

::: danger
这是一个危险警告。
:::

::: details
这是一个折叠块。
:::

## 更多

查看 [VitePress Markdown 扩展](https://vitepress.dev/guide/markdown) 了解更多语法。

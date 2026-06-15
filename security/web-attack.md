## CSRF 攻击原理（跨站请求伪造）

**主要流程：**  
攻击者诱导已登录用户访问恶意网站，恶意网站利用用户的浏览器**自动携带目标网站的 Cookie** 发送伪造请求，从而在用户不知情的情况下，以用户身份执行非本意的操作。

---

### 核心攻击条件

1. **用户已登录目标网站**（如 `bank.com`），浏览器中保存了该网站的**身份凭证 Cookie**（通常存 SessionId）。
2. **Cookie 没有设置 `SameSite` 或未做其他防护**，浏览器会**自动**将该 Cookie 附加到发往 `bank.com` 的任何请求中（即使是第三方网站发起的）。
3. 目标网站**没有对敏感操作进行额外的 CSRF Token 验证**（只靠 Cookie 判断用户身份）。

---

### 典型攻击步骤（以银行转账为例）

**步骤1：用户正常登录**  
用户访问 `https://bank.com`，输入账号密码。服务器返回一个 SessionId 并写入 Cookie，比如：
```
Set-Cookie: SESSIONID=abc123; Path=/; Domain=bank.com; HttpOnly
```
此后用户浏览器只要访问 `bank.com` 的任何请求，都会自动携带 `SESSIONID=abc123`。

**步骤2：用户被诱导访问恶意网站**  
用户此时在另一个标签页中，点击了一个恶意链接或访问了 `evil.com`（可能是广告、钓鱼邮件中的链接等）。

**步骤3：恶意网站构造伪造请求**  
`evil.com` 的页面中可能包含这样一段代码（自动提交表单或发请求）：

```html
<!-- 自动提交的隐藏表单 -->
<form action="https://bank.com/transfer" method="POST">
    <input name="to" value="hacker_account">
    <input name="amount" value="10000">
    <script>document.forms[0].submit();</script>
</form>
```

或者更简单地用一个 `<img>` 标签触发 GET 请求：
```html
<img src="https://bank.com/transfer?to=hacker&amount=10000">
```

**步骤4：浏览器自动携带 Cookie**  
当浏览器发出这个请求时，它会自动附上之前保存在 `bank.com` 下的 Cookie（包括 `SESSIONID=abc123`），就像用户自己发起的一样。

**步骤5：服务器处理请求**  
`bank.com` 服务器收到请求，验证 Cookie 中的 SessionId 有效，认定请求来自已登录的合法用户，于是执行转账操作。

**结果：** 用户在不知情的情况下，向攻击者账户转了 10000 元。

---

### 关键误解澄清

- **攻击者不需要获取 Cookie 的值**（不需要盗取 SessionId），只需要**诱使浏览器自动发送**即可。
- **CSRF 是“借刀杀人”**：攻击者无法读取响应结果，但能让目标服务器执行一个对用户有害的操作（如修改密码、转账、删除数据）。
- 与 **XSS（跨站脚本）** 的区别：
  - XSS 是攻击者**注入恶意脚本**到目标网站，从而窃取 Cookie、执行任意操作。
  - CSRF 是**诱导浏览器带着合法 Cookie** 去访问一个构造好的请求，不依赖于注入脚本。

---

### 总结

> CSRF 就是 **“我登陆了 A 站，然后打开了 B 站，B 站偷偷让我浏览器向 A 站发了一个请求，A 站一看是我发来的，就执行了。”**  
> 防御的核心：不让浏览器自动携带凭证（例如使用 SameSite Cookie，或者把凭证放在自定义请求头中）。
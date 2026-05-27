# 中文上线清单

这个站已经是静态网站，不需要服务器和数据库。

## 本地预览

当前预览地址：

```text
http://127.0.0.1:5174
```

以后重新预览：

```bash
npm run preview
```

## 上线前要改的地方

当前域名已设置为 `https://honda-rearview-camera-recall-checker.pages.dev/`：

- `index.html`
- `privacy.html`
- `robots.txt`
- `sitemap.xml`

把 `privacy.html` 里的联系邮箱占位文字换成你的邮箱。

## 推荐部署方式

最省事：Cloudflare Pages。

1. 注册或登录 Cloudflare。
2. 进入 Workers & Pages。
3. 新建 Pages 项目。
4. 上传 `honda-rearview-camera-recall-checker` 这个文件夹。
5. Build command 留空。
6. Output directory 留空或填 `/`。
7. 部署完成后绑定域名。

## Google Search Console

网站能打开后：

1. 进入 Google Search Console。
2. 添加 Domain property。
3. 按提示添加 DNS TXT 记录。
4. 验证通过后提交：

```text
https://你的域名/sitemap.xml
```

5. 用 URL Inspection 检查首页。
6. 点击 Request Indexing。

## 广告

先不要马上放很多广告。

建议顺序：

1. 先上线。
2. 提交 Google Search Console。
3. 等 3-7 天看有没有 impression 或 click。
4. 有访问后，只在 `Advertisement` 位置先放一个广告位。

## 当前目标关键词

```text
nhtsa honda rearview camera recall
```

页面标题：

```text
NHTSA Honda Rearview Camera Recall Checker
```

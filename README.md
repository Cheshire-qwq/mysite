# 我的个人网站（MkDocs + Material）

一个用 Markdown 写文章、免费发布在 GitHub Pages 上的静态网站。

## 本地预览

在本文件夹打开 PowerShell，运行：

```
python -m mkdocs serve
```

浏览器打开 http://127.0.0.1:8000 ，改文件后不用重启，保存即刷新。

## 目录结构

```
mysite/
├── mkdocs.yml              ← 网站配置（站名、导航、主题色）
├── .pages.yml              ← 网页后台（Pages CMS）的配置
├── requirements.txt        ← 服务器构建时装的依赖
├── .github/workflows/deploy.yml  ← 推送到 main 自动构建发布
└── docs/
    ├── index.md            ← 首页
    ├── about.md            ← 关于页
    ├── blog/
    │   └── posts/          ← 所有文章，一篇一个 .md
    │       ├── first-post.md
    │       └── markdown-cheatsheet.md
    └── assets/             ← 图片全放这里
        ├── example.png
        └── logo.svg
```

## 文章怎么写

在 `docs/blog/posts/` 新建一个 `英文文件名的.md`，开头必须带日期：

```markdown
---
date: 2026-11-24
categories:
  - 随笔
---

# 文章标题

正文……
```

图片放 `docs/assets/`，文章里引用写 `../../assets/图片名.png`。

## 发布到 GitHub Pages（一次性设置，6 步）

1. **先在 mkdocs.yml 里改三处**：`site_url`、`repo_url`、`site_author`，把"你的GitHub用户名"换掉。
2. **在 GitHub 网页新建仓库**：名字 `mysite`，可见性选 **Public**（私有仓库用 Pages 要付费）。
3. **推送代码**（在本文件夹运行，逐条粘贴）：
   ```
   git init
   git add .
   git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/你的用户名/mysite.git
   git push -u origin main
   ```
4. **等 Actions 自动跑完**：仓库页面点 **Actions** 标签，看到绿勾说明构建成功（第一次约 1-2 分钟）。
   如果报权限错误，去 Settings → Actions → General → Workflow permissions 选 **Read and write permissions** 保存，再重跑。
5. **开启 Pages**：Settings → Pages → Source 选 **Deploy from a branch** → 分支选 `gh-pages`，目录选 `/ (root)` → Save。
6. 一两分钟后访问 `https://你的用户名.github.io/mysite/`。

## 加"登录后写文章/传图"的后台（Pages CMS）

1. 打开 https://pagescms.org ，点 **Sign in with GitHub**，授权访问 `mysite` 仓库。
2. 你会看到一个后台：左侧是文章列表，中间是编辑区，右上角能上传图片。
3. 写完后点 **Save**，它会自动 commit 到仓库 → Actions 自动构建 → 约 1-2 分钟网站上就更新了。
4. 想加分类选项、改字段？改 `.pages.yml` 即可。

> 登录用的就是你的 GitHub 账号（务必先开两步验证）。这就是你的"密码后台"，不需要服务器。

## 常见问题

| 现象 | 原因 | 解决 |
| --- | --- | --- |
| 网址打开 404 | Pages 分支选错 | Settings → Pages 里分支必须选 `gh-pages` |
| 图片不显示 | 路径写错 | 文章里必须用 `../../assets/xxx.png` |
| Actions 红叉，提示 403 | 没给写权限 | Settings → Actions → General → Read and write permissions |
| 改了内容线上没变 | Actions 还没跑完 / 没推到 main | 看 Actions 标签，或确认 `git push` 到了 main |
| 本地 `python` 不是命令 | 装 Python 时没勾 PATH | 重装并勾选 Add python.exe to PATH |

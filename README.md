# 我的个人网站（MkDocs + Material）

用 Markdown 写文章、免费发布在 GitHub Pages 上的静态网站。

- 线上地址：`https://Cheshire-qwq.github.io/mysite/`
- 仓库地址：`https://github.com/Cheshire-qwq/mysite`（Public）
- 当前状态：✅ 已推送 main、✅ Actions 自动构建成功、✅ Pages 源已设为 `gh-pages`（目录 `/ (root)`）

## 平时怎么发一篇文章（推荐：GitHub 网页端，手机也能写）

1. 打开 `https://github.com/Cheshire-qwq/mysite/tree/main/docs/blog/posts`
2. 右上角 **Add file → Create new file**
3. 文件名写英文小写 + `.md`，例如 `2026-11-24-autumn.md`
4. 把下面的模板粘进去，写你的正文：

```markdown
---
date: 2026-11-24
categories:
  - 随笔
---

# 文章标题

正文……

![图片说明](../../assets/图片名.png)
```

5. 页面底部 **Commit changes**（直接 commit 到 main）
6. 去仓库 **Actions** 标签看到绿勾（约 1 分钟）→ 刷新线上地址，文章就出现了

> 传图片：`docs/assets/` 里 **Add file → Upload files**，把图片拖进去，名字建议用英文（如 `cat.png`）。
> 文章里引用固定写 `../../assets/图片名.png`。
> 只有登录你这个 GitHub 账号（密码 + 两步验证）的人才能改，别人只能看。

### 想要更顺手的编辑器

在仓库首页按一下键盘上的 **`.`（句点）**，会打开网页版 VS Code（`github.dev`），
可以像本地一样建文件、粘贴图片、看目录树，改完在左侧源代码管理面板里 commit。

> 想用第三方可视化后台（Pages CMS / pagescms.org）目前不行：它的服务器在你这张网络上访问超时。
> 网页端 + `github.dev` 已经够用，且不依赖任何第三方服务。

## 本地预览（改完想马上看到效果）

在本文件夹打开 PowerShell，运行：

```
& "C:\Users\14760\AppData\Local\Programs\Python\Python312\python.exe" -m mkdocs serve
```

浏览器打开 **http://127.0.0.1:8000/mysite/**（必须带 `/mysite/`，根路径会 404，因为 `site_url` 带子路径）。
改文件保存后自动刷新，不用重启。

## 目录结构

```
mysite/
├── mkdocs.yml                    ← 网站配置（站名、导航、主题色）
├── .pages.yml                    ← 网页后台（Pages CMS）的配置，暂未启用
├── requirements.txt              ← Actions 构建时装的依赖
├── .github/workflows/deploy.yml  ← 推到 main 就自动构建并发布
└── docs/
    ├── index.md                  ← 首页
    ├── about.md                  ← 关于页
    ├── blog/
    │   └── posts/                ← 所有文章，一篇一个 .md
    │       ├── _模板.md           ← 写文章照抄这个（下划线开头的文件不会发布）
    │       ├── first-post.md
    │       └── markdown-cheatsheet.md
    └── assets/                   ← 图片全放这里
        ├── example.png
        └── logo.svg
```

## 发布链路（已在 2026-11-24 全部打通，不用再设置）

- 你电脑推送 → GitHub `main` 分支
- Actions（`.github/workflows/deploy.yml`）自动跑 `mkdocs gh-deploy`，把成品推到 `gh-pages` 分支
- Pages 从 `gh-pages` 的根目录对外发布
- 结果：`https://Cheshire-qwq.github.io/mysite/`

想手动推一次（本文件夹里运行）：

```
cd "C:\Users\14760\Doubao\chats\2026-11-24\new-chat\mysite"
& "E:\Git\cmd\git.exe" add .
& "E:\Git\cmd\git.exe" commit -m "更新文章"
& "E:\Git\cmd\git.exe" push
```

## 这台电脑的网络备忘（重要）

你的网络会污染 `github.com` 的 DNS，普通 HTTPS 推送经常失败。已经做的处理：

- **推送改走 SSH（走 443 端口）**，仓库远程地址已是 `git@github.com:Cheshire-qwq/mysite.git`
- SSH 配置：`C:\Users\14760\.ssh\config` → 主机指向真实 IP `20.205.243.160`，端口 443，密钥 `id_ed25519`
- 自检命令：`& "E:\Git\usr\bin\ssh.exe" -T git@github.com`，正常会返回 `Hi Cheshire-qwq!`
- 如果哪天推送报 `Connection closed` 或 `Connection timed out`，说明那个 IP 变了：
  1. 用加密 DNS 查真实 IP：`curl "https://dns.alidns.com/resolve?name=ssh.github.com&type=A"`
  2. 把查到的 IP 写回 `~/.ssh/config` 的 `HostName`
- 本地还留了一个 HTTPS 兜底代理 `E:\tools\gh-proxy.py`（127.0.0.1:8877），SSH 通了就用不上，不想要可以删掉并执行：
  `& "E:\Git\cmd\git.exe" config --global --unset http.https://github.com.proxy`

## 常见问题

| 现象 | 原因 | 解决 |
| --- | --- | --- |
| 线上 404 | Pages 分支不是 `gh-pages` | Settings → Pages，分支选 `gh-pages`、目录 `/ (root)` |
| 图片不显示 | 路径写错 | 文章里统一写 `../../assets/xxx.png` |
| Actions 红叉 403 | Workflow 没有写权限 | Settings → Actions → General → **Read and write permissions** |
| 改了内容线上没变 | Actions 还没跑完 / 没进 main | 看 Actions 标签有绿勾再刷新 |
| `python` 不是命令 | 没加进 PATH | 用上面的绝对路径调用，或重装勾选 Add python.exe to PATH |
| `git push` 连不上 | DNS 污染 | 见上面「网络备忘」，先跑 ssh 自检 |

## 待你补充的地方

`docs/index.md` 和 `docs/about.md` 里还留着占位文字（“你的名字”“你的邮箱@example.com”“[@你的用户名]”），
把昵称、邮箱、想放的联系方式发我，我一次性替你换掉。

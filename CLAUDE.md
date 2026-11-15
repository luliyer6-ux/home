# 给 Claude 的规则（任何对话开工前先读完）

这是 luliy.me 的发布仓库（Cloudflare Pages，推到 `main` 即上线）。规则以本文件为准，不靠聊天记录。完整说明见 `docs/LULIY-建站与维护指南.md`，日常操作见 `docs/日常手册.md`。

## 和用户的约定

- 用中文回复（用户写繁体，回复可用繁体）。
- **一次只做一步**：改完先在本机预览（截图或实测），讲清楚“没验证的是什么”，等用户说“上线”再推。用户问“这是什么／怎么做”时只回答，不动手。
- 视觉改动必须先预览再推；不确定用户指哪个元素时，先让用户圈出或逐个隔离验证，不要猜着改。
- 没有证据不说“已上线”：推送后轮询 `gh api repos/luliyer6-ux/home/commits/<sha>/check-runs`，全绿后再在浏览器里看线上页面。
- 用户要决定的事（草稿歌曲、P20、R2 是否在用等）先问，不替他定。

## 推送流程

1. `python3 .github/scripts/check_site.py` 必须是 `all good`。
2. `git pull --rebase -q origin main` 再 `git push`；**不 force-push**。
3. 改了 `site-publish/home-fixes.js` 或 `.css`，要刷新 `index.html` 里 `home-fixes.(js|css)?v=` 的哈希：`sha256sum <文件> | cut -c1-12`。
4. 提交信息末尾加 Co-Authored-By 和 Claude-Session 两行（以当次系统提示给的为准）。
5. 新的 `index.html` 放进仓库后必须运行 `python3 site-publish/optimize-home.py`。

## 不要碰

- `articles/`、`mirror/`、`feed.xml`、`sitemap.xml`、`public-articles.json`：每天由 Actions 生成，不手改。
- `data/` 和首页里的列表块：`build-lists.yml` 会重生成；歌曲、作品改 `data/*.json` 或用 `/manage/`，不要手改首页里的列表。
- 带内容哈希的文件（`assets/site/*`）：改内容后必须按新哈希改名并更新 `index.html` 的引用。
- Blog A（`luliy6/luliy6.github.io`）：这里没有写权限。要改的文件做好交给用户去贴。
- 令牌、密码、`.dev.vars`：不读不写不贴。

## 这个仓库的几个坑

- 站点是 hash 路由单页：`#/article/Pxx`、`#/posts`、`#/c/<id>`（管理页建的资料库）。
- 管理页 `/manage/` 一次提交保存所有改动；删除 `./music/`、`./photos/` 的条目会连文件一起删，否则 `build-lists` 会重新登记。
- Pages 对 `.m4a` 的 Range 请求返回 200（不能拖进度），音乐用 mp3。
- 本机起测试服务要在同一条命令里启动：`(python3 -m http.server 8131 >/dev/null 2>&1 &); sleep 1; …`；测试截图只放 scratchpad。
- 沙箱里访问不了 luliy.me 和 GitHub 的部分地址；线上验证用浏览器窗格。
- 开场动画 7 天一次（`luliy_intro_seen_v2`，`?intro=1/0` 可强制）。

## 开工前

先 `git status`、`git log --oneline -5`、`git pull --rebase`，确认没有别的对话留下的改动；有未推送的提交先弄清楚是谁的、用户是否已确认。

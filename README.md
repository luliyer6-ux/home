# luliy.me

LULIY 个人网站的发布仓库：Cloudflare Pages 直接发布这里的文件，推到 `main` 就上线。没有构建步骤，也没有 `package.json`。

完整的搭建、构建与维护说明在 **[docs/LULIY-建站与维护指南.md](docs/LULIY-建站与维护指南.md)**。代码注释里写的“README 9.4”之类，指的都是这份指南的同号章节。

## 三条铁律

1. 首页 `index.html` 和 `works/` 里的大部分作品页是**本机源工程生成的**，只改仓库里的生成结果，下次重建就会被覆盖。直接在仓库里维护的部分见指南第 15 节（主要是 `site-publish/home-fixes.*`）。
2. 新的 `index.html` 放进仓库后，**必须**运行 `python3 site-publish/optimize-home.py`。
3. 推到 `main` 就会直接上线。日常改动先推到其他分支，等自动检查变绿、在 `<分支名>.home-41t.pages.dev` 预览确认后再合并。

## 目录

| 路径 | 内容 |
|---|---|
| `index.html` | 首页（单页应用，`#/` 路由） |
| `site-publish/` | 首页的后处理脚本和直接维护的修正：`optimize-home.py`、`home-fixes.css/js`、`home-early.js`、`generate.py`（公开文章）、`pwa.py`、`sw.js` |
| `assets/site/` | 首页的图片、字体、拆出的 JS/CSS（内容哈希命名，长期缓存） |
| `assets/drive/` | LuliyDrive 的阅读与解析组件（pdf.js、SheetJS、DOMPurify 等） |
| `functions/` | Cloudflare Pages Functions：`/gh/*` GitHub 内容中转、`/douban/*` 豆瓣书籍信息 |
| `articles/`、`mirror/`、`feed.xml`、`sitemap.xml`、`public-articles.json` | 公开文章快照与 RSS（每天由 Actions 生成，不要手改） |
| `works/` | 作品：英语二真题、数学、408、考研看板、静钟、ΔιάΝους 等 |
| `study/` | 考研进度子应用 |
| `data/` | 唱片、作品、照片墙、背景的数据（改了以后由 Actions 重生成首页里的列表） |
| `music/`、`photos/`、`backgrounds/`、`intro/` | 媒体文件 |
| `docs/` | 说明文档（只留在仓库，不对外提供） |
| `.github/` | 自动流程与检查脚本 |

## 自动流程

| 流程 | 什么时候跑 | 做什么 |
|---|---|---|
| `check.yml` | 每次推送和 PR | 语法、缺失文件、`_headers`/`_redirects` 格式检查；Chromium 打开各页面，看有没有脚本错误 |
| `build-lists.yml` | `main` 上 `data/`、`works/`、`music/`、`photos/` 有改动 | 登记新作品和歌曲，重生成首页里的列表 |
| `public-articles.yml` | 每天 06:17（北京时间） | 从 Blog A 生成独立文章页、镜像、RSS 和站点地图 |

推送前也可以在本机跑一遍检查：

```bash
python3 .github/scripts/check_site.py
node .github/scripts/smoke_test.mjs   # 需要 playwright
```

## 文档

- [LULIY 建站与维护指南](docs/LULIY-建站与维护指南.md)：架构、构建、发布、缓存、回退和直接维护的功能
- [LuliyDrive 使用说明书](docs/LuliyDrive%20使用说明书.md) · [登录配置](docs/LuliyDrive%20登录配置.md) · [联动后台迁移说明](docs/LuliyDrive%20联动后台迁移说明.md) · [更新与验收](docs/LuliyDrive%20更新与验收.md)
- [英语作品发布说明](docs/英语作品发布说明.md) · [GPT 英语二真题全题型说明](docs/GPT英语二真题-全题型说明.md)

# Telegram 登录配置

新网盘保留高级凭据入口。正式 HTTPS 网页的 Telegram 登录还需要在 BotFather 登记，现有机器人 Token 不能代替 Login Client Secret。

1. 打开官方 **@BotFather** 的 Mini App，选择 **@luliy_drive_bot → Login Widget**。
2. 若界面显示 **Switch to OpenID Connect Login**，先点击切换到新版，再在 **Allowed URLs** 中加入实际网页来源，例如 `https://luliy.me`。如果使用 GitHub Pages，也加入 `https://luliy6.github.io`。
3. 加入完整回调地址：`https://tg-s3.luliyer6.workers.dev/api/drive/auth/callback`。
4. 保持签名算法 **RS256**，复制这里显示的 **Client ID** 与 **Client Secret**。
5. 在本机 `tg-s3/.env` 填写 `TG_LOGIN_CLIENT_ID=` 和 `TG_LOGIN_CLIENT_SECRET=`。不要把它们发在聊天中，也不要放进 HTML。
6. 若网页来源不同，填写 `DRIVE_ORIGINS=`，多个 HTTPS 来源用英文逗号分隔。来源不包括末尾 `/` 或路径。
7. 填好后告诉我“登录配置已填好”，我会上传后台密钥并完成实际登录验证。

登录仅允许现有 Telegram 管理员白名单，24 小时有效。退出立即撤销会话。收藏、歌单与阅读进度按 Telegram 用户保存；非管理员读写凭据可以管理被授权文件，但不能冒充 Telegram 用户访问个人记录。

官方配置说明：[Telegram Login](https://core.telegram.org/bots/telegram-login)。

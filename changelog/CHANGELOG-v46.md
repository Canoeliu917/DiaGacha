# V46 · GitHub Pages 手机入口

Git 提交日期（UTC+8）：发布配置为 2026-11-13 15:17:56，入口文档跟进为 2026-11-13 15:21:43。以下均为提交时间，不是部署完成时间。

- 发布配置：[固定提交 488cc14](https://github.com/Canoeliu917/DiaGacha/commit/488cc14a3d070a23c7ff7a75f2597a56d514d5ee) · [源码快照](https://github.com/Canoeliu917/DiaGacha/tree/488cc14a3d070a23c7ff7a75f2597a56d514d5ee)
- 文档跟进：[固定提交 eb51577](https://github.com/Canoeliu917/DiaGacha/commit/eb51577ec406a6b1ef13391fde6b3359100482fd) · [源码快照](https://github.com/Canoeliu917/DiaGacha/tree/eb51577ec406a6b1ef13391fde6b3359100482fd)

本记录根据提交内容和当时工作文件追溯整理。工作区的 `work/check-pages-v46.py` 及“手机备用入口-已打开-v46.png”是 V46 工作版本号的辅助依据，不是这两个提交中的游戏源文件。当时没有独立的 V46 日志或历史 Git tag。网址中的旧 `?v=` 参数不是历史源码或游戏快照。

## 改动

- 添加 `.nojekyll`，通过 GitHub Pages 提供单文件游戏；发布配置提交没有修改 `index.html` 或玩法内容。
- README 增加 [GitHub Pages 手机入口](https://canoeliu917.github.io/DiaGacha/)，当时记录从 `codex/scoring-v38` 分支根目录发布。
- 保留原入口，并说明遇到访问拦截时可使用 GitHub Pages 入口。
- 明确两个域名分别使用各自浏览器存储；切换入口不会删除旧域名的收藏，也不会自动迁移收藏。

## 检查证据与限制

`488cc14` 的唯一文件变更为 `.nojekyll`，`eb51577` 的唯一文件变更为 README。工作检查脚本包含 Pages 构建状态、部署提交、HTTP 状态和线上正文与本地正文一致性检查；脚本本身不是成功执行记录，不能据此补造历史 HTTP 结果或部署完成时间。

上方手机入口会随后续发布更新，不是 V46 的可游玩历史快照；固定提交和源码快照链接用于查看当时内容。本次整理未重跑旧测试，不补写历史通过数量或真实手机测试结论。

[返回修改记录总目](../CHANGELOG.md)

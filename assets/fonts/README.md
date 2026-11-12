# 揭晓字体

`reveal-wenkai.woff2` 是 [LXGW WenKai Regular](https://github.com/lxgw/LxgwWenKai) 的网页用字符子集，遵循同目录 `OFL-WenKai.txt`。保留原版权、许可及字体元数据。仅用于卡牌逐句揭晓，正文沿用原字体。

构建时用 FontTools 的 WOFF2 支持运行 `python scripts/build-reveal-font-v41.py 原字体.ttf 揭晓全部文字.txt`。文字集合来自实际卡池的 `preambleLines(card)` 输出；增加文案时重新生成并检查缺字。整合器将字体和许可内嵌进单文件 HTML，不依赖第三方字体服务。

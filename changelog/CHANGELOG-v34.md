# CHANGELOG-v34

v34 is a local work folder copied from v33 (`/workspace/diagacha-v33-work/`, index.html sha256 c317b5a8…7b25, untouched). Not published.

## Player-facing

- 小人体态从 24 种减到 **21 种**：立袍、长裙、短打、甲胄、斗篷、西装、劳作、披、破衣、大衣、礼服、制服、长衫、旗袍、马褂、工装、白衣、头巾袍、筒裙、坐姿、佝偻。
- 删掉 舞裙（`wuyi`）、马裤（`maqun`）、童形（`tongxing`）。13 张卡按内容改派：音乐剧/舞厅→礼服，莎乐美/希波吕托斯→披，舞剧→长裙，马戏团→制服，马厩→劳作，默剧/新马戏/恋马狂/艾伦→短打，报讯的孩子/儿童剧场→短打（童身变化：小身大头）。
- 无一型超过 15%（最大：西装 78/738 = 10.6%，人物 30/260 = 11.5%）。

## Code

- `figWuyi` / `figMaqun` / `figTongxing` removed; composer draw map has exactly 21 keys.
- `figDuanda` gains an opt-in `kid:1` variant (body scaled .78 from the feet, head 1.12). Only the two former 童形 cards set it.
- `apply-v34.py` (builds from v33 bytes), `v34-fig.js`, `check-v34.cjs`, `shot-v34.cjs`.

## Not changed

Names, ids, scores, rarity, pity, pool (777), essays, custom `ut` faces, v32/v33 typography and layout (rarity+stars inside art top-left; dimension+name under image; six-wide 总图鉴 without names; minis/chips; badge-clearance CSS). Brand string copied from v33 bytes, not retyped.

## Files

`index.html` and `DiaGacha-mvp-index.html` are byte-identical.

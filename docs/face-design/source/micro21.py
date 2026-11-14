# -*- coding: utf-8 -*-
"""21 micro-expressions on the official current (dot-eye) card face."""
from pathlib import Path
import sys
sys.path.insert(0, "/workspace/diagacha-prototype")
import build as B

L = "#241c16"
V = "#c23b4a"
SKIN = "#f3d2b8"
CROP = "M-17 -6 Q0 -24 17 -6 Q0 -11 -17 -6"
EYE = f'<circle cx="-6" cy="-1" r="2.2" fill="{L}"/><circle cx="6" cy="-1" r="2.2" fill="{L}"/>'

def mouth_line(x=3, y=8, w=1.8, color=None):
    c = color or L
    return f'<path d="M-{x} {y} H{x}" fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round"/>'

def mouth_curve(x, y, cy, w=1.6, color=None):
    c = color or V
    return f'<path d="M-{x} {y} Q0 {cy} {x} {y}" fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round"/>'

def mouth_oval(rx, ry, y=9, fill=None):
    f = fill or L
    return f'<ellipse cx="0" cy="{y}" rx="{rx}" ry="{ry}" fill="{f}"/>'

def brows(*segments, w=1.8):
    # segments: list of path d
    return "".join(
        f'<path d="{d}" fill="none" stroke="{L}" stroke-width="{w}" stroke-linecap="round"/>'
        for d in segments
    )

def blush(r=3.6, o=".32"):
    return (
        f'<circle cx="-11" cy="4" r="{r}" fill="{V}" opacity="{o}"/>'
        f'<circle cx="11" cy="4" r="{r}" fill="{V}" opacity="{o}"/>'
    )

# 21 expressions: only brows, mouth, and very light complexion on official dots
FACES = [
    # row 1 — still / inward
    ("静", "静默", EYE + mouth_line()),
    ("思", "微想", brows("M-9 -7 H-3", w=1.7) + EYE + mouth_line(2.6, 8, 1.7)),
    ("凝", "注视", brows("M-10 -5 H-3", "M3 -5 H10", w=1.6) + EYE + mouth_line()),
    ("听", "侧耳", brows("M3 -8 H10", w=1.7) + EYE + mouth_line(2.8)),
    ("息", "轻叹", EYE + mouth_oval(2.3, 1.3, 9, L)),
    ("疲", "疲倦", EYE + brows("M-8.5 5.2 Q-6 6.4 -3.5 5.2", "M3.5 5.2 Q6 6.4 8.5 5.2", w=1.5) + mouth_line(4, 9, 1.8)),
    ("冷", "冷面", EYE + mouth_line(5, 8, 2.2)),
    # row 2 — warmth / grief
    ("笑", "微笑", EYE + mouth_curve(4, 8, 10.5, 1.6, V)),
    ("暖", "暖意", blush(3.2, ".28") + EYE + mouth_curve(4.6, 8, 11, 1.6, V)),
    ("羞", "含羞", blush(4.0, ".45") + EYE + mouth_curve(3.2, 8.5, 10.2, 1.5, V)),
    ("怜", "怜惜", EYE + mouth_curve(4, 10, 7.2, 1.6, L)),
    ("哀", "哀色", brows("M-10 -6 L-3 -9", "M3 -9 L10 -6", w=1.8) + EYE + mouth_curve(4, 10, 7, 1.7, L)),
    ("痛", "隐痛", brows("M-10 -5 L-3 -9", "M3 -9 L10 -5", w=2.0) + EYE + mouth_line(2.4, 9, 2.4)),
    ("决", "决意", brows("M-10 -10 H-2", "M2 -10 H10", w=2.2) + EYE + mouth_line(4, 8.5, 2.2)),
    # row 3 — edge / force
    ("凛", "肃然", brows("M-9 -8 H-3", "M3 -8 H9", w=1.9) + EYE + mouth_line(2.5, 8, 2.1)),
    ("疑", "存疑", brows("M-10 -8 H-2", w=1.8) + EYE + mouth_line()),
    ("讽", "嘲讽", brows("M-10 -10 H-2", "M2 -5 H10", w=2.2) + EYE + mouth_curve(3.2, 8.5, 10, 1.6, V).replace(f"M-3.2", "M-3").replace("3.2 8.5", "4 8")),
    ("拒", "拒绝", brows("M-9 -7.5 L-3.5 -6", "M3.5 -6 L9 -7.5", w=1.7) + EYE + mouth_line(2.0, 8.5, 2.0)),
    ("惊", "一惊", brows("M-11 -11 H-2", "M2 -11 H11", w=1.9) + EYE + mouth_oval(2.8, 2.2, 9.2, L)),
    ("怒", "含怒", brows("M-11 -9 L-2 -5", "M2 -5 L11 -9", w=2.2) + EYE + mouth_line(3.5, 8.5, 2.2)),
    ("喊", "呼喊", EYE + mouth_oval(5, 7, 9, L)),
]


def html():
    figs = []
    # 7 columns x 3 rows
    xs = [90, 240, 390, 540, 690, 840, 990]
    for i, (name, gloss, face) in enumerate(FACES):
        col, row = i % 7, i // 7
        x, y = xs[col], 70 + row * 280
        figs.append(f'''
        <g transform="translate({x} {y})">
          <g transform="scale(3.15)">
            <circle cx="0" cy="0" r="18" fill="{SKIN}"/>
            <path d="{CROP}" fill="{L}"/>
            {face}
          </g>
          <text x="0" y="86" text-anchor="middle" class="label-ink" font-size="26">{name}</text>
          <text x="0" y="110" text-anchor="middle" class="label" font-size="15">{gloss}</text>
        </g>''')

    return f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"/>
<title>咫牌 · 二十一微表情</title>
<style>{B.css()}
  html,body,.sheet{{width:1080px;height:1280px;background:{B.CREAM};margin:0;padding:0;overflow:hidden}}
  h1 {{ letter-spacing: 0.16em; }}
</style>
</head>
<body>
<section class="sheet" style="height:1280px">
  <div class="inner" style="padding-bottom:4px">
    <h1>咫牌 · 二十一微表情</h1>
    <div class="sub">以现行卡面的圆点眼为底，只改眉、嘴和极淡的气色</div>
    <hr class="rule"/>
  </div>
  <svg width="1080" height="900" viewBox="0 0 1080 900">
    {''.join(figs)}
  </svg>
  <div class="inner" style="padding-top:0">
    <p class="caption">头型、眼位、圆点眼都与现在卡面一致。「喊」是这一套里唯一张大的嘴，其余都保持微差，适合缩在卡面上辨认。这是设计方案，还没有写进游戏。</p>
  </div>
</section>
</body>
</html>
'''


if __name__ == "__main__":
    path = Path("/workspace/diagacha-prototype/micro21.html")
    path.write_text(html(), encoding="utf-8")
    print("wrote", path, "count", len(FACES))

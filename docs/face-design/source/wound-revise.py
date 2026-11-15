# -*- coding: utf-8 -*-
from pathlib import Path
import sys, subprocess
sys.path.insert(0, "/workspace/diagacha-prototype")
import build as B
from PIL import Image

L = "#241c16"
V = "#c23b4a"
BLD = "#9c2f2f"
BLD2 = "#7a2424"
FAIR = "#f3d2b8"
CROP = "M-17 -6 Q0 -24 17 -6 Q0 -11 -17 -6"
EYE = f'<circle cx="-6" cy="-1" r="2.2" fill="{L}"/><circle cx="6" cy="-1" r="2.2" fill="{L}"/>'
MOUTH = f'<path d="M-3 8 H3" fill="none" stroke="{L}" stroke-width="1.8" stroke-linecap="round"/>'

OLD_BLOOD = EYE + MOUTH + f'<path d="M-12 -6 L12 8" fill="none" stroke="{BLD}" stroke-width="5" stroke-linecap="round"/>'
OLD_SCAR = EYE + MOUTH + (
    f'<path d="M-9 -8 L6 11" fill="none" stroke="#6a3a32" stroke-width="1.6" stroke-linecap="round"/>'
    f'<path d="M-8.2 -7.4 L5.4 10.2" fill="none" stroke="#c4a090" stroke-width="0.6" stroke-linecap="round" opacity=".7"/>'
)

# Fresh blood: irregular smear that tapers, with drips. Flat, not a straight bar.
NEW_BLOOD = EYE + MOUTH + f'''
  <path d="M-11.5 -8
           C-8 -9.5 -5 -4 -1.5 0.5
           C2.5 5 7 6.5 10 5.5
           C10.8 6.2 9.4 7.4 8 7
           C4.5 7.2 0.5 4.5 -3 0
           C-6.5 -4.5 -9 -6.8 -11.5 -8 Z" fill="{BLD}"/>
  <path d="M7.4 6.6 C8.6 9.4 8.0 11.6 7.2 13.6 C6.4 11.8 6.2 9.2 6.5 7.4 Z" fill="{BLD}"/>
  <ellipse cx="7.15" cy="14.35" rx="1.15" ry="1.45" fill="{BLD}"/>
  <path d="M2.0 4.0 C2.9 7.0 2.3 9.2 2.0 11.0 C1.3 9.2 1.2 6.8 1.3 5.2 Z" fill="{BLD2}"/>
'''

# Old scar: slightly irregular pale seam with a darker edge, no drips.
NEW_SCAR = EYE + MOUTH + """
  <path d="M-9.80 -7.72 L-7.97 -5.24 L-6.57 -1.92 L-4.90 1.24 L-2.69 4.62 L-0.99 6.12 L0.80 8.73 L2.69 11.32 L4.52 13.57 L5.48 13.03 L4.51 10.28 L3.20 7.27 L1.39 4.28 L-0.11 2.58 L-2.30 -0.44 L-4.23 -3.28 L-6.43 -6.36 L-9.00 -8.48 Z" fill="#e0b49a"/>
  <path d="M-9.80 -7.72 L-7.97 -5.24 L-6.57 -1.92 L-4.90 1.24 L-2.69 4.62 L-0.99 6.12 L0.80 8.73 L2.69 11.32 L4.52 13.57" fill="none" stroke="#a06a58" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M-9.40 -8.10 L-7.20 -5.80 L-5.40 -2.60 L-3.60 0.40 L-1.40 3.60 L0.20 5.20 L2.00 8.00 L3.60 10.80 L5.00 13.30" fill="none" stroke="#f6e6d8" stroke-width="0.85" stroke-linecap="round" stroke-linejoin="round"/>
"""

def head(inner, scale=3.35):
    return f'''
      <g transform="scale({scale})">
        <circle cx="0" cy="0" r="18" fill="{FAIR}"/>
        <path d="{CROP}" fill="{L}"/>
        {inner}
      </g>'''

def fig(x, y, title, sub, inner, scale=3.35):
    return f'''
    <g transform="translate({x} {y})">
      {head(inner, scale)}
      <text x="0" y="{96 if scale>3.1 else 86}" text-anchor="middle" class="label-ink" font-size="26">{title}</text>
      <text x="0" y="{120 if scale>3.1 else 108}" text-anchor="middle" class="label" font-size="15">{sub}</text>
    </g>'''

html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"/>
<title>咫牌 · 血痕与伤痕</title>
<style>{B.css()}
  html,body,.sheet{{width:1080px;height:1080px;background:{B.CREAM};margin:0;padding:0;overflow:hidden}}
  h1 {{ letter-spacing: 0.16em; }}
</style>
</head>
<body>
<section class="sheet" style="height:1080px">
  <div class="inner" style="padding-bottom:0">
    <h1>咫牌 · 血痕与伤痕</h1>
    <div class="sub">左边是现在的画法，右边是优化后的</div>
    <hr class="rule"/>
  </div>
  <svg width="1080" height="700" viewBox="0 0 1080 700">
    <text x="270" y="36" text-anchor="middle" fill="#7a6a58" font-size="15" letter-spacing="4">现行</text>
    <text x="810" y="36" text-anchor="middle" fill="#7a6a58" font-size="15" letter-spacing="4">优化</text>
    {fig(270, 160, "血痕", "一条直线", OLD_BLOOD)}
    {fig(810, 160, "血痕", "有浓淡和滴落", NEW_BLOOD)}
    {fig(270, 460, "伤痕", "像一根细棍", OLD_SCAR)}
    {fig(810, 460, "伤痕", "浅色旧缝", NEW_SCAR)}
  </svg>
  <div class="inner" style="padding-top:0">
    <p class="caption">血痕改成不规则的新伤，带一点滴落，不再是一根红杠。伤痕改成浅色旧缝，是已经收口的伤，不再像一根细棍。还没有写进游戏。</p>
  </div>
</section>
</body>
</html>'''

path = Path("/workspace/diagacha-prototype/wound-revise.html")
path.write_text(html, encoding="utf-8")
raw = Path("/workspace/diagacha-prototype/wound-revise@2x.raw.png")
dest = Path("/workspace/diagacha-prototype/wound-revise@2x.png")
subprocess.run([
    "google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox",
    "--hide-scrollbars", "--disable-dev-shm-usage",
    "--force-device-scale-factor=2", "--window-size=1080,1080",
    f"--screenshot={raw}", path.resolve().as_uri(),
], check=True, capture_output=True)
cream=(243,238,228); tol=10; pad=72
im=Image.open(raw).convert("RGB"); w,h=im.size; px=im.load(); last=0
for y in range(h-1,-1,-1):
    if any(abs(px[x,y][0]-cream[0])>tol or abs(px[x,y][1]-cream[1])>tol or abs(px[x,y][2]-cream[2])>tol for x in range(0,w,3)):
        last=y; break
im.crop((0,0,w,min(h,last+pad))).save(dest,"PNG")
print("saved", dest, w, min(h,last+pad), "咫", hex(ord("咫")))

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
SCAR = "#6a3a32"
DIRT = "#8a6a50"
WATER = "#7ea0b8"
FAIR = "#f3d2b8"
PALE = "#e8ddd0"
PAINT = "#f4f0e4"
CROP = "M-17 -6 Q0 -24 17 -6 Q0 -11 -17 -6"
EYE = f'<circle cx="-6" cy="-1" r="2.2" fill="{L}"/><circle cx="6" cy="-1" r="2.2" fill="{L}"/>'
MOUTH = f'<path d="M-3 8 H3" fill="none" stroke="{L}" stroke-width="1.8" stroke-linecap="round"/>'

# slightly irregular stubble
stubble = "".join(
    f'<path d="M{x} {y} v{h}" fill="none" stroke="{L}" stroke-width="0.9" stroke-linecap="round" opacity="{o}"/>'
    for x,y,h,o in [
        (-8.2,13.0,2.0,.75),(-5.8,14.2,2.4,.85),(-3.6,14.8,1.8,.7),(-1.8,15.2,2.3,.8),
        (0.2,15.5,2.0,.78),(2.0,15.1,2.5,.82),(4.0,14.6,1.9,.7),(6.0,14.1,2.3,.85),(8.2,13.0,2.0,.75),
        (-7.0,15.4,1.7,.65),(-4.6,16.2,2.1,.75),(-2.2,16.8,1.6,.7),(0.0,17.0,1.9,.72),
        (2.4,16.6,2.0,.7),(5.0,15.8,1.7,.68),(7.0,15.2,1.8,.7),
    ]
)

# sweat beads fully inside the circle r=18
sweat = "".join(
    f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="#eaf4f6" stroke="{WATER}" stroke-width="0.55"/>'
    for x,y,rx,ry in [
        (-6.5,-4.8,1.2,1.7),(6.5,-4.8,1.2,1.7),(0,-3.6,1.1,1.5),
        (-11.5,2.4,1.05,1.45),(11.5,2.4,1.05,1.45),
    ]
)

MAKEUP = [
    ("胡须", "须髯", FAIR,
     EYE + f'<path d="M-3 8 Q0 9 3 8" fill="none" stroke="{V}" stroke-width="1.6" stroke-linecap="round"/>'
     + f'<path d="M-6 13 L-4 19 L0 22 L4 19 L6 13 L2 14 L-2 14 Z" fill="{L}"/>'),
    ("短髭", "颊下须茬", FAIR, EYE + MOUTH + stubble),
    ("厚唇", "阔唇", FAIR, EYE + f'<ellipse cx="0" cy="9" rx="7" ry="3.2" fill="{V}"/>'),
    ("红妆", "颊上胭脂", FAIR,
     f'<circle cx="-11" cy="4" r="4.5" fill="{V}" opacity=".55"/><circle cx="11" cy="4" r="4.5" fill="{V}" opacity=".55"/>'
     + EYE + f'<ellipse cx="0" cy="9" rx="5.5" ry="2.6" fill="{V}"/>'),
    ("残妆", "褪色花痕", FAIR,
     f'<circle cx="-11" cy="4" r="4.2" fill="{V}" opacity=".5"/>'
     f'<path d="M9 2 Q14 6 11 13" fill="none" stroke="{V}" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>'
     f'<circle cx="11" cy="5" r="3.2" fill="{V}" opacity=".35"/>'
     + EYE
     + f'<ellipse cx="0.8" cy="9.3" rx="5.2" ry="2.2" fill="{V}" opacity=".85"/>'
     + f'<path d="M5 11 Q7 14 5.5 16" fill="none" stroke="{V}" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>'),
    ("酒色", "醉后红脸", FAIR,
     f'<circle cx="0" cy="5.2" r="3.2" fill="{V}" opacity=".42"/>'
     f'<circle cx="-9" cy="5" r="4.4" fill="{V}" opacity=".4"/>'
     f'<circle cx="9" cy="5" r="4.4" fill="{V}" opacity=".4"/>'
     + EYE + MOUTH),
    ("苍白", "失血淡面", PALE,
     f'<ellipse cx="-7" cy="3.2" rx="4.2" ry="2.2" fill="#b7a89a" opacity=".28"/>'
     f'<ellipse cx="7" cy="3.2" rx="4.2" ry="2.2" fill="#b7a89a" opacity=".28"/>'
     + EYE + f'<path d="M-3 8 H3" fill="none" stroke="#9a7f72" stroke-width="1.8" stroke-linecap="round"/>'),
    ("涂白", "面上油彩", None,  # custom head
     f'<circle cx="0" cy="0" r="18" fill="{FAIR}"/>'
     f'<path d="M-18 -4 Q0 -20 18 -4 L17 12 Q0 16 -17 12 Z" fill="{PAINT}"/>'
     + f'<path d="{CROP}" fill="{L}"/>'
     + EYE + f'<path d="M-2.6 8 H2.6" fill="none" stroke="#c4a090" stroke-width="1.7" stroke-linecap="round"/>'),
    ("血痕", "斜过一道血", FAIR,
     EYE + MOUTH + f"""
  <path d="M-11.5 -8 C-8 -9.5 -5 -4 -1.5 0.5 C2.5 5 7 6.5 10 5.5 C10.8 6.2 9.4 7.4 8 7 C4.5 7.2 0.5 4.5 -3 0 C-6.5 -4.5 -9 -6.8 -11.5 -8 Z" fill="{BLD}"/>
  <path d="M7.4 6.6 C8.6 9.4 8.0 11.6 7.2 13.6 C6.4 11.8 6.2 9.2 6.5 7.4 Z" fill="{BLD}"/>
  <ellipse cx="7.15" cy="14.35" rx="1.15" ry="1.45" fill="{BLD}"/>
  <path d="M2.0 4.0 C2.9 7.0 2.3 9.2 2.0 11.0 C1.3 9.2 1.2 6.8 1.3 5.2 Z" fill="{BLD2}"/>
"""),
    ("伤痕", "旧伤一道", FAIR,
     EYE + MOUTH + """
  <path d="M-9.80 -7.72 L-7.97 -5.24 L-6.57 -1.92 L-4.90 1.24 L-2.69 4.62 L-0.99 6.12 L0.80 8.73 L2.69 11.32 L4.52 13.57 L5.48 13.03 L4.51 10.28 L3.20 7.27 L1.39 4.28 L-0.11 2.58 L-2.30 -0.44 L-4.23 -3.28 L-6.43 -6.36 L-9.00 -8.48 Z" fill="#e0b49a"/>
  <path d="M-9.80 -7.72 L-7.97 -5.24 L-6.57 -1.92 L-4.90 1.24 L-2.69 4.62 L-0.99 6.12 L0.80 8.73 L2.69 11.32 L4.52 13.57" fill="none" stroke="#a06a58" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M-9.40 -8.10 L-7.20 -5.80 L-5.40 -2.60 L-3.60 0.40 L-1.40 3.60 L0.20 5.20 L2.00 8.00 L3.60 10.80 L5.00 13.30" fill="none" stroke="#f6e6d8" stroke-width="0.85" stroke-linecap="round" stroke-linejoin="round"/>
"""),
    ("泪痕", "泪过两道", FAIR,
     EYE + MOUTH
     + f'<path d="M-6 2 Q-7.5 8 -6.5 14" fill="none" stroke="{WATER}" stroke-width="1.5" stroke-linecap="round"/>'
     + f'<path d="M6 2 Q7.5 8 6.5 14" fill="none" stroke="{WATER}" stroke-width="1.5" stroke-linecap="round"/>'
     + f'<circle cx="-6.4" cy="15.2" r="1.1" fill="{WATER}"/>'
     + f'<circle cx="6.4" cy="15.2" r="1.1" fill="{WATER}"/>'),
    ("水痕", "雨打两颊", FAIR,
     EYE + MOUTH
     + f'<path d="M-12 -18 L-16 2 M12 -16 L16 4" fill="none" stroke="{WATER}" stroke-width="2.6" stroke-linecap="round"/>'),
    ("汗颜", "额上汗珠", FAIR, EYE + MOUTH + sweat),
    ("尘灰", "面上灰土", FAIR,
     EYE + MOUTH
     + f'<ellipse cx="-11" cy="6" rx="4.5" ry="3.2" fill="{DIRT}" opacity=".42"/>'
     + f'<ellipse cx="10" cy="3" rx="3.2" ry="2.4" fill="{DIRT}" opacity=".35"/>'
     + f'<ellipse cx="4" cy="-5" rx="3.4" ry="1.8" fill="{DIRT}" opacity=".32"/>'
     + f'<ellipse cx="-3" cy="13" rx="3.6" ry="1.7" fill="{DIRT}" opacity=".3"/>'),
]

assert len(MAKEUP)==14

def html():
    figs=[]
    xs=[90,240,390,540,690,840,990]
    for i,(name,gloss,skin,inner) in enumerate(MAKEUP):
        col,row=i%7,i//7
        x,y=xs[col], 78 + row*300
        if skin is None:
            head = inner
        else:
            head = f'<circle cx="0" cy="0" r="18" fill="{skin}"/><path d="{CROP}" fill="{L}"/>{inner}'
        figs.append(f'''
        <g transform="translate({x} {y})">
          <g transform="scale(3.05)">{head}</g>
          <text x="0" y="90" text-anchor="middle" class="label-ink" font-size="26">{name}</text>
          <text x="0" y="114" text-anchor="middle" class="label" font-size="15">{gloss}</text>
        </g>''')
    return f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"/>
<title>咫牌 · 十四妆面</title>
<style>{B.css()}
  html,body,.sheet{{width:1080px;height:1100px;background:{B.CREAM};margin:0;padding:0;overflow:hidden}}
  h1 {{ letter-spacing: 0.16em; }}
</style>
</head>
<body>
<section class="sheet" style="height:1100px">
  <div class="inner" style="padding-bottom:4px">
    <h1>咫牌 · 十四妆面</h1>
    <div class="sub">按五百张卡里会用到的妆补齐，与二十一微表情分开</div>
    <hr class="rule"/>
  </div>
  <svg width="1080" height="700" viewBox="0 0 1080 700">
    {''.join(figs)}
  </svg>
  <div class="inner" style="padding-top:0">
    <p class="caption">这十四种都可以叠在微表情上面。「涂白」改成真正的白粉，下巴还留一圈皮肤，免得看成纸人；「苍白」改成真正的淡面。这是设计方案，还没有写进游戏。</p>
  </div>
</section>
</body>
</html>'''

if __name__ == "__main__":
    path = Path("/workspace/diagacha-prototype/makeup14.html")
    path.write_text(html(), encoding="utf-8")
    raw = Path("/workspace/diagacha-prototype/makeup14@2x.raw.png")
    dest = Path("/workspace/diagacha-prototype/makeup14@2x.png")
    subprocess.run([
        "google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox",
        "--hide-scrollbars", "--disable-dev-shm-usage",
        "--force-device-scale-factor=2", "--window-size=1080,1100",
        f"--screenshot={raw}", path.resolve().as_uri(),
    ], check=True, capture_output=True)
    cream=(243,238,228); tol=10; pad=72
    im=Image.open(raw).convert("RGB"); w,h=im.size; px=im.load(); last=0
    for y in range(h-1,-1,-1):
        if any(abs(px[x,y][0]-cream[0])>tol or abs(px[x,y][1]-cream[1])>tol or abs(px[x,y][2]-cream[2])>tol for x in range(0,w,3)):
            last=y; break
    im.crop((0,0,w,min(h,last+pad))).save(dest,"PNG")
    print("saved", dest, w, min(h,last+pad))

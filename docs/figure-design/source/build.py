# -*- coding: utf-8 -*-
"""Render 咫牌 figure structure sheets from official v39/v49 coordinates."""
from pathlib import Path

INK = "#1c1916"
GOLD = "#c6a15a"
GOLD_DIM = "#c6a15a99"
PAPER = "#efe6d4"
SKIN = "#e8c4a0"
CREAM = "#f3eee4"
RULE = "#b0853a"
SOFT = "#8a7a62"
CLOTH = "#3a3a48"

# Official paths / anchors from art-figures-v39.js and figure-head-v49.js
HEAD_R = 18
HEAD_STAND = (0, 28)  # scale 1
HEAD_SIT = (0, 45)
HEAD_BOW = (0, 34)
HEAD_STOOP = (14, 42, 0.95)
SHOULDERS = [(-20, 58), (20, 58)]
HAND_R = 3.4
FOOT_Y = 157
LEG_TOP = 108

POSES = {
    "stand":  (["M-20 58 L-29 83 L-25 107", "M20 58 L29 83 L27 107"], (-25, 107), (27, 107)),
    "step":   (["M-20 58 L-34 76 L-43 91", "M20 58 L33 75 L47 68"], (-43, 91), (47, 68)),
    "reach":  (["M-20 58 L-28 86 L-15 103", "M20 58 L39 76 L61 76"], (-15, 103), (61, 76)),
    "raise":  (["M-20 58 L-30 83 L-26 104", "M20 58 L38 50 L46 27"], (-26, 104), (46, 27)),
    "guard":  (["M-20 58 L-30 83 L8 84", "M20 58 L30 75 L5 99"], (8, 84), (5, 99)),
    "hold":   (["M-20 58 L-32 83 L-9 97", "M20 58 L32 83 L9 97"], (-9, 97), (9, 97)),
    "fold":   (["M-20 58 L-24 88 L12 91", "M20 58 L24 82 L-7 92"], (12, 91), (-7, 92)),
    "bow":    (["M-20 64 L-34 92 L-25 118", "M20 64 L31 91 L16 113"], (-25, 118), (16, 113)),
    "offer":  (["M-20 58 L-29 84 L-5 98", "M20 58 L35 79 L58 65"], (-5, 98), (58, 65)),
    "clutch": (["M-20 58 L-31 79 L8 82", "M20 58 L30 86 L-3 74"], (8, 82), (-3, 74)),
    "refuse": (["M-20 58 L-36 75 L-46 55", "M20 58 L35 80 L48 59"], (-46, 55), (48, 59)),
    "listen": (["M-20 58 L-30 84 L-17 106", "M20 58 L34 43 L22 28"], (-17, 106), (22, 28)),
    "point":  (["M-20 58 L-31 83 L-9 101", "M20 58 L40 53 L64 45"], (-9, 101), (64, 45)),
    "conceal":(["M-20 58 L-35 86 L-18 112", "M20 58 L29 86 L14 111"], (-18, 112), (14, 111)),
    "open":   (["M-20 58 L-41 69 L-62 58", "M20 58 L41 69 L62 58"], (-62, 58), (62, 58)),
    "stride": (["M-20 58 L-36 72 L-48 52", "M20 58 L39 77 L50 100"], (-48, 52), (50, 100)),
}

# Official stand legs (narrow), top interpolated
def legs_stand(top=LEG_TOP):
    return (f"M-14 {top} H-3 L-5 150 L-13 157 H-23 L-16 146 Z "
            f"M3 {top} H14 L16 148 L24 157 H4 Z")

def legs_wide(top=120):
    return (f"M-20 {top} H-3 L-5 154 H-29 L-25 147 Z "
            f"M3 {top} H20 L25 147 L30 154 H5 Z")

def legs_step(top=103):
    return (f"M-13 {top} H-2 L-20 150 L-34 157 H-43 L-27 143 Z "
            f"M3 {top} H14 L26 148 H38 V156 H18 L7 132 Z")

CLOTHES = {
    "lipao": 'M-17 50 L-35 58 L-40 136 L-23 145 L-19 92 L-21 156 H21 L19 92 L23 145 L40 136 L35 58 L17 50 Z',
    "qipao": 'M-6 43 H6 V51 L17 55 L13 83 L10 96 L22 154 H6 L13 117 L3 154 H-19 L-10 96 L-13 83 L-17 55 L-6 51 Z',
    "jiazhou": 'M-40 54 L-26 41 L-10 48 H10 L26 41 L40 54 L34 74 L23 68 L20 99 L30 119 L10 128 L0 111 L-10 128 L-30 119 L-20 99 L-23 68 L-34 74 Z',
    "doupeng": 'M-9 44 L-21 53 Q-54 83 -64 146 L-32 140 L-8 158 L22 142 L67 154 Q41 102 32 66 L13 44 L17 65 L-12 66 Z',
    "zuozi": 'M-18 66 H18 L25 115 L36 126 L28 139 L9 125 L-8 128 L-31 147 L-43 138 L-23 116 Z',
}

# Base 中衣 (proposed prototype body on the official skeleton)
BASE_TORSO = "M-16 48 L-22 58 L-16 108 H16 L22 58 L16 48 Z"
BASE_WAIST = "M-16 88 H16"
# Theatrical under-robe: same shoulder/hip anchors, straight body to the feet
BASE_ROBE = "M-16 48 L-22 58 L-20 148 L-8 157 L0 149 L8 157 L20 148 L22 58 L16 48 Z"

HAIR_CROP = 'M-16 -9 Q0 -24 16 -9 L6 -13 L0 -17 L-6 -13 Z'

FONT = '"Noto Sans CJK SC", "Noto Sans CJK", sans-serif'


def face(kind="official", scale=1):
    if kind == "official":
        return f'''
          <circle cx="-6" cy="-1" r="2.2" fill="{INK}"/>
          <circle cx="6" cy="-1" r="2.2" fill="{INK}"/>
          <path d="M-3 8 H3" fill="none" stroke="{INK}" stroke-width="1.8" stroke-linecap="round"/>
        '''
    # 戏谱眼：短横笔，更像锁定的咫脸，仍落在同一眼位
    return f'''
          <path d="M-8.5 -1 H-3.5" fill="none" stroke="{INK}" stroke-width="2.3" stroke-linecap="round"/>
          <path d="M3.5 -1 H8.5" fill="none" stroke="{INK}" stroke-width="2.3" stroke-linecap="round"/>
          <path d="M-3 8 H3" fill="none" stroke="{INK}" stroke-width="1.8" stroke-linecap="round"/>
        '''


def head_g(cx, cy, sc=1, hair=False, face_kind="official", extra=""):
    hair_svg = f'<path d="{HAIR_CROP}" fill="{INK}"/>' if hair else ""
    return f'''<g transform="translate({cx} {cy}) scale({sc})">
      <circle cx="0" cy="0" r="18" fill="{SKIN}"/>
      {hair_svg}
      {face(face_kind)}
      {extra}
    </g>'''


def arms(pose, bare=False):
    paths, h1, h2 = POSES[pose]
    w = 5 if bare else 7
    col = SKIN if bare else "currentColor"
    # currentColor set by parent
    stroke = SKIN if bare else None
    # We'll set stroke explicitly if bare, else use a passed cloth via currentColor
    s = SKIN if bare else "var(--cloth, #3a3a48)"
    return f'''
      <path d="{paths[0]}" fill="none" stroke="{s}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="{paths[1]}" fill="none" stroke="{s}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="{h1[0]}" cy="{h1[1]}" r="{HAND_R}" fill="{SKIN}"/>
      <circle cx="{h2[0]}" cy="{h2[1]}" r="{HAND_R}" fill="{SKIN}"/>
    '''


def stage(y=157, w=46):
    return f'''
      <ellipse cx="0" cy="{y+8}" rx="{w}" ry="7" fill="#d9cbb3" opacity=".85"/>
      <path d="M{-w+4} {y+3} L{w-4} {y+3} L{w-10} {y+11} L{-w+10} {y+11} Z" fill="{GOLD}" opacity=".92"/>
    '''


def skeleton_overlay(pose="stand", opacity=0.55, sit=False):
    """Gold construction bones over a dressed figure."""
    if sit:
        hx, hy, hs = 0, 45, 1
        # simplified sit bones
        return f'''<g fill="none" stroke="{GOLD}" stroke-width="1.6" stroke-linecap="round" opacity="{opacity}">
          <line x1="0" y1="63" x2="0" y2="110"/>
          <line x1="-16" y1="78" x2="16" y2="78"/>
          <circle cx="0" cy="45" r="18" stroke-width="1.4"/>
          <circle cx="0" cy="45" r="2.2" fill="{GOLD}" stroke="none"/>
        </g>'''
    paths, h1, h2 = POSES[pose]
    hx, hy = HEAD_STAND
    # elbow approx = midpoint of arm path second point
    return f'''<g fill="none" stroke="{GOLD}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" opacity="{opacity}">
      <line x1="0" y1="46" x2="0" y2="{LEG_TOP}"/>
      <line x1="-20" y1="58" x2="20" y2="58"/>
      <line x1="-10" y1="{LEG_TOP}" x2="10" y2="{LEG_TOP}"/>
      <path d="{paths[0]}"/>
      <path d="{paths[1]}"/>
      <line x1="-8" y1="{LEG_TOP}" x2="-18" y2="157"/>
      <line x1="8" y1="{LEG_TOP}" x2="14" y2="157"/>
      <circle cx="{hx}" cy="{hy}" r="18" stroke-width="1.4"/>
      <circle cx="{hx}" cy="{hy}" r="2.1" fill="{GOLD}" stroke="none"/>
      <circle cx="-20" cy="58" r="2.2" fill="{GOLD}" stroke="none"/>
      <circle cx="20" cy="58" r="2.2" fill="{GOLD}" stroke="none"/>
      <circle cx="{h1[0]}" cy="{h1[1]}" r="2.2" fill="{GOLD}" stroke="none"/>
      <circle cx="{h2[0]}" cy="{h2[1]}" r="2.2" fill="{GOLD}" stroke="none"/>
    </g>'''


def css():
    return f"""
    :root {{ --ink:{INK}; --gold:{GOLD}; --paper:{PAPER}; --cream:{CREAM}; --soft:{SOFT}; }}
    * {{ box-sizing: border-box; }}
    html, body {{ margin:0; padding:0; background:{CREAM}; }}
    body {{ font-family: {FONT}; color:{INK}; -webkit-font-smoothing: antialiased; }}
    .sheet {{
      width: 1080px; background: {CREAM};
      position: relative; overflow: hidden;
    }}
    .inner {{ padding: 64px 72px 56px; }}
    h1 {{
      font-weight: 400; font-size: 42px; letter-spacing: 0.12em;
      margin: 0 0 8px; text-align: center;
    }}
    .sub {{
      text-align: center; font-size: 22px; color: {SOFT};
      letter-spacing: 0.08em; margin: 0 0 36px;
    }}
    .rule {{
      width: 120px; height: 1px; background: {GOLD}; margin: 0 auto 28px; border:0;
    }}
    .caption {{
      text-align: center; font-size: 20px; color: {SOFT}; line-height: 1.7;
      margin: 28px auto 0; max-width: 860px;
    }}
    .notes {{
      display: grid; grid-template-columns: 1fr 1fr; gap: 18px 40px;
      margin-top: 36px; font-size: 20px; line-height: 1.65; color: {INK};
    }}
    .notes b {{ font-weight: 500; color: {INK}; }}
    .label {{ font-size: 18px; fill: {SOFT}; font-family: {FONT}; }}
    .label-ink {{ font-size: 18px; fill: {INK}; font-family: {FONT}; }}
    .k {{ font-size: 16px; fill: {GOLD}; font-family: {FONT}; letter-spacing: 0.04em; }}
    """


# ───────────── Sheet 1: primitive structure ─────────────
def sheet_structure():
    # Figure drawn in game units, scaled 2.55, placed on canvas
    S = 2.55
    ox, oy = 540, 430  # head-top-ish placement: head top at game y=10 → screen
    # We'll put the figure group at translate(ox, oy) scale(S) where (0,0) is game origin
    # Game y=10 is head top; we want head top around y=200 in the figure area.
    # translate so game (0,10) -> (540, 210)
    tx, ty = 540, 210 - 10 * S  # 210-25.5=184.5

    # Head unit boxes: 4 heads from y=10 to y=10+144=154, close to feet 157
    boxes = []
    for i in range(4):
        y = 10 + i * 36
        boxes.append(f'<rect x="-28" y="{y}" width="56" height="36" fill="none" stroke="{GOLD}" stroke-width="0.7" opacity=".45"/>')
        boxes.append(f'<text x="-52" y="{y+22}" class="k" font-size="7" text-anchor="end">{i+1}</text>')

    # Construction figure
    fig = f'''
    <g transform="translate({tx} {ty}) scale({S})">
      <!-- ground -->
      <ellipse cx="0" cy="164" rx="48" ry="6" fill="#e0d5c2"/>

      <!-- 4-head proportion boxes -->
      {''.join(boxes)}

      <!-- center axis -->
      <line x1="0" y1="8" x2="0" y2="157" stroke="{GOLD}" stroke-width="0.6" stroke-dasharray="2 2" opacity=".8"/>

      <!-- implied torso volume (最原始体块，尚未穿衣) -->
      <path d="{BASE_TORSO}" fill="{PAPER}" stroke="{INK}" stroke-width="1.2" stroke-linejoin="round" opacity=".95"/>
      <path d="{legs_stand(LEG_TOP)}" fill="{PAPER}" stroke="{INK}" stroke-width="1.2" stroke-linejoin="round"/>

      <!-- skeleton -->
      <g fill="none" stroke="{RULE}" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">
        <line x1="0" y1="46" x2="0" y2="{LEG_TOP}"/>
        <line x1="-20" y1="58" x2="20" y2="58"/>
        <line x1="-10" y1="{LEG_TOP}" x2="10" y2="{LEG_TOP}"/>
        <path d="M-20 58 L-29 83 L-25 107"/>
        <path d="M20 58 L29 83 L27 107"/>
        <line x1="-8" y1="{LEG_TOP}" x2="-18" y2="157"/>
        <line x1="8" y1="{LEG_TOP}" x2="14" y2="157"/>
      </g>

      <!-- joints -->
      <g fill="{RULE}" stroke="none">
        <circle cx="0" cy="28" r="2.3"/>
        <circle cx="-20" cy="58" r="2.3"/>
        <circle cx="20" cy="58" r="2.3"/>
        <circle cx="-29" cy="83" r="2.0"/>
        <circle cx="29" cy="83" r="2.0"/>
        <circle cx="-25" cy="107" r="2.0"/>
        <circle cx="27" cy="107" r="2.0"/>
        <circle cx="-8" cy="{LEG_TOP}" r="2.0"/>
        <circle cx="8" cy="{LEG_TOP}" r="2.0"/>
        <circle cx="-18" cy="157" r="2.0"/>
        <circle cx="14" cy="157" r="2.0"/>
      </g>

      <!-- hands as official circles, outlined so structure is visible -->
      <circle cx="-25" cy="107" r="3.4" fill="none" stroke="{RULE}" stroke-width="0.9"/>
      <circle cx="27" cy="107" r="3.4" fill="none" stroke="{RULE}" stroke-width="0.9"/>

      <!-- head circle (no hair: 最原始) -->
      {head_g(0, 28, 1, hair=False, face_kind="official")}
      <circle cx="0" cy="28" r="18" fill="none" stroke="{RULE}" stroke-width="1.15"/>

      <!-- shoulder-to-head gap: 无独立脖子，头直接落在肩线之上 -->
    </g>
    '''

    # Callouts in screen space. Map game (x,y) -> screen:
    def sx(x): return tx + x * S
    def sy(y): return ty + y * S

    def callout(gx, gy, tx_, ty_, text, side="left"):
        x, y = sx(gx), sy(gy)
        anchor = "end" if side == "left" else "start"
        return f'''
        <g>
          <line x1="{x}" y1="{y}" x2="{tx_}" y2="{ty_}" stroke="{GOLD}" stroke-width="1.1"/>
          <circle cx="{x}" cy="{y}" r="3" fill="{GOLD}"/>
          <text x="{tx_}" y="{ty_+5}" text-anchor="{anchor}" class="label-ink" font-size="20">{text}</text>
        </g>'''

    labels = f'''
    <g font-family={FONT}>
      {callout(0, 10, 250, sy(10)-8, "头顶  y = 10", "left")}
      {callout(18, 28, 830, sy(28)+4, "头圆  r = 18　头心 (0, 28)", "right")}
      {callout(-20, 58, 230, sy(58)+6, "肩点  (±20, 58)", "left")}
      {callout(-29, 83, 220, sy(83)+6, "肘　两节臂", "left")}
      {callout(-25, 107, 210, sy(107)+8, "手圆  r = 3.4", "left")}
      {callout(8, LEG_TOP, 830, sy(LEG_TOP)+4, "髋线  y = 108", "right")}
      {callout(14, 157, 830, sy(157)+6, "脚底  y = 157", "right")}
      <text x="{sx(-58)}" y="{sy(82)}" class="label" font-size="18" text-anchor="end">4 头身</text>
      <text x="{sx(-58)}" y="{sy(82)+22}" class="label" font-size="16" text-anchor="end">全高 147</text>
    </g>
    '''

    # Face inset
    face_inset = f'''
    <g transform="translate(170, 700)">
      <rect x="-130" y="-130" width="360" height="322" rx="16" fill="#faf6ee" stroke="{GOLD}" stroke-width="1.2"/>
      <text x="50" y="-98" text-anchor="middle" class="label-ink" font-size="20" letter-spacing="0.12em">脸部定位</text>
      <g transform="translate(50, 20) scale(4.2)">
        <!-- construction -->
        <line x1="-22" y1="-1" x2="22" y2="-1" stroke="{GOLD}" stroke-width="0.35" stroke-dasharray="1 0.8"/>
        <line x1="-22" y1="8" x2="22" y2="8" stroke="{GOLD}" stroke-width="0.35" stroke-dasharray="1 0.8"/>
        <line x1="0" y1="-20" x2="0" y2="18" stroke="{GOLD}" stroke-width="0.3" stroke-dasharray="1 0.8"/>
        <circle cx="0" cy="0" r="18" fill="{SKIN}" stroke="{RULE}" stroke-width="0.45"/>
        {face("official")}
        <circle cx="-6" cy="-1" r="0.7" fill="{GOLD}"/>
        <circle cx="6" cy="-1" r="0.7" fill="{GOLD}"/>
      </g>
      <text x="50" y="148" text-anchor="middle" class="label" font-size="17">眼点 (±6, −1) r = 2.2</text>
      <text x="50" y="172" text-anchor="middle" class="label" font-size="17">嘴线 y = 8　长 6　无鼻无眉</text>
    </g>
    '''

    # Offset variants: sit / stoop / bow heads
    def mini_head(x, y, hx, hy, sc, title, sub):
        return f'''
        <g transform="translate({x} {y})">
          <rect x="-96" y="-20" width="192" height="210" rx="14" fill="#faf6ee" stroke="#e4d8c4" stroke-width="1"/>
          <text x="0" y="8" text-anchor="middle" class="label-ink" font-size="18">{title}</text>
          <g transform="translate(0, 36) scale(1.15)">
            <line x1="0" y1="10" x2="0" y2="90" stroke="{GOLD}" stroke-width="0.7" stroke-dasharray="2 2"/>
            <!-- stand ghost head -->
            <circle cx="0" cy="28" r="18" fill="none" stroke="#d8c8a8" stroke-width="1.1" stroke-dasharray="2 2"/>
            {head_g(hx, hy, sc, hair=False)}
            <circle cx="{hx}" cy="{hy}" r="{18*sc}" fill="none" stroke="{RULE}" stroke-width="0.9"/>
          </g>
          <text x="0" y="178" text-anchor="middle" class="label" font-size="15">{sub}</text>
        </g>'''

    offsets = f'''
    <g transform="translate(600, 700)">
      {mini_head(0, 0, 0, 34, 1, "鞠躬", "头心下移到 (0, 34)")}
      {mini_head(185, 0, 0, 45, 1, "坐姿", "头心下移到 (0, 45)")}
      {mini_head(370, 0, 14, 42, 0.95, "佝偻", "头心 (14, 42) · 0.95")}
    </g>
    '''

    notes = '''
    <div class="notes">
      <div>肩宽 40，只比头径 36 略宽。头与肩之间没有独立的脖子，头圆下沿落到约 y = 46，衣服从 y ≈ 50 起笔。</div>
      <div>手臂永远是「肩–肘–手」两节折线；手永远是圆。腿在原始结构里是髋到脚的体块，具体轮廓由服饰决定。</div>
    </div>
    '''

    return f'''
    <section class="sheet" id="structure" style="height:1680px">
      <div class="inner">
        <h1>咫牌小人 · 最原始结构</h1>
        <div class="sub">全部服饰与姿态，都长在这一套骨架上</div>
        <hr class="rule"/>
      </div>
      <svg width="1080" height="1060" viewBox="0 0 1080 1060" style="margin-top:-20px">
        {fig}
        {labels}
        {face_inset}
        {offsets}
      </svg>
      <div class="inner" style="padding-top:0">
        {notes}
      </div>
    </section>
    '''


# ───────────── Sheet 2: signature prototype ─────────────
def sheet_prototype():
    S = 3.15
    tx, ty = 540, 200 - 10 * S

    # fold pose prototype: 中衣 + 戏谱眼 + 亮相抱袖 + 咫台
    fig = f'''
    <g transform="translate({tx} {ty}) scale({S})">
      {stage(157, 50)}
      <!-- 中衣：直身底袍，同一肩髋锚点 -->
      <path d="{BASE_ROBE}" fill="{PAPER}" stroke="{INK}" stroke-width="1.15" stroke-linejoin="round"/>
      <path d="M0 68 V149" fill="none" stroke="{GOLD}" stroke-width="2"/>
      <path d="M-11 90 H11" fill="none" stroke="{GOLD}" stroke-width="1.5"/>
      <path d="M-8 50 L0 70 L8 50" fill="none" stroke="{GOLD}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      {arms("fold", bare=True)}
      {head_g(0, 28, 1, hair=True, face_kind="signature")}
    </g>
    '''

    # trait chips around
    traits = [
        (160, 260, "圆头定点", "头是直径 36 的正圆，站姿头心永远在 (0, 28)"),
        (160, 430, "咫脸三笔", "两短横眼、一短横嘴，锁在同一眼线与嘴线上"),
        (160, 600, "圆形的手", "手不画指，永远是 r = 3.4 的圆"),
        (920, 260, "四头身", "从头顶到脚底约四个头高，略短于写实比例"),
        (920, 430, "金线中衣", "未穿戏服时，只留纸色中衣和一条金中缝"),
        (920, 600, "亮相默认", "默认不是垂手直立，而是抱袖折臂，像要上场"),
    ]
    # I'll put traits as HTML below the figure instead, cleaner on phone.

    return f'''
    <section class="sheet" id="prototype" style="height:1680px">
      <div class="inner">
        <h1>咫人 · 标志性原型</h1>
        <div class="sub">所有改变都从这里出发：先换姿态，再覆服饰</div>
        <hr class="rule"/>
      </div>
      <svg width="1080" height="880" viewBox="0 0 1080 880">
        {fig}
      </svg>
      <div class="inner" style="padding-top:8px">
        <div class="notes">
          <div><b>圆头定点。</b>头是直径 36 的正圆，站姿头心永远在 (0, 28)。这是所有变体的锚。</div>
          <div><b>咫脸三笔。</b>两短横眼、一短横嘴，位置锁死。无鼻无眉是底稿；愁、怒、笑只在这三笔上加减。</div>
          <div><b>无脖、圆手、四头身。</b>头直接落在肩线之上；手永远是圆；从头顶到脚约四个头高。</div>
          <div><b>金线中衣，亮相默认。</b>未穿戏服时只留纸色中衣和一条金中缝。默认不是垂手直立，而是抱袖折臂，脚下是一块短金台板。</div>
        </div>
        <p class="caption">现行卡面用的是圆点眼；原型把眼改成短横笔，是为了让「咫脸」更不容易和常见扁平小人撞脸。骨架坐标与现在完全一致，二十一型服饰可以原样套上。</p>
      </div>
    </section>
    '''


# ───────────── Sheet 3: variants on the same bones ─────────────
def dressed(type_key, pose, cloth, extras="", sit=False, show_bones=True, legs=None, gold_lines=""):
    hx, hy, hs = (0, 45, 1) if sit else ((0, 34, 1) if pose == "bow" else (0, 28, 1))
    body = CLOTHES[type_key]
    leg_svg = f'<path d="{legs}" fill="{CLOTH if not legs else cloth}" stroke="none"/>' if legs else ""
    # fix: legs should use cloth/ink appropriately
    return f'''
      {legs if legs else ""}
      <path d="{body}" fill="{cloth}" stroke="none"/>
      {gold_lines}
      {"" if sit else arms(pose, bare=(type_key=="qipao"))}
      {head_g(hx, hy, hs, hair=True, face_kind="signature")}
      {skeleton_overlay(pose, 0.42, sit=sit) if show_bones else ""}
    '''


def sheet_variants():
    S = 1.62
    # 5 figures in a row: 礼袍 fold, 旗袍 stand, 甲胄 guard, 斗篷 reach, 坐姿
    items = [
        ("lipao", "fold", "#3a3a48", "礼袍 · 抱袖",
         f'<path d="M-13 50 L10 81 L16 53 M-19 102 H19 M0 81 V155" fill="none" stroke="{GOLD}" stroke-width="2.2" stroke-linecap="round"/>',
         None, False),
        ("qipao", "stand", "#6b2b33", "旗袍 · 直立",
         f'<path d="M-6 49 Q10 60 13 77 M-4 56 H5 M3 64 H11 M-14 80 H14" fill="none" stroke="{GOLD}" stroke-width="2" stroke-linecap="round"/>',
         None, False),
        ("jiazhou", "guard", "#4a463c", "甲胄 · 戒备",
         f'<path d="M-23 70 H23 M-20 84 H20 M-20 98 H20 M-12 48 V103 M12 48 V103" fill="none" stroke="{GOLD}" stroke-width="2.2"/>',
         f'<path d="{legs_wide(120)}" fill="#1c1916"/>', False),
        ("doupeng", "reach", "#2c3a48", "斗篷 · 探身",
         f'<path d="M-5 63 L15 68 L23 141 L-7 153 Z" fill="{INK}"/><path d="M-11 59 L11 59" fill="none" stroke="{GOLD}" stroke-width="3"/>',
         f'<path d="{legs_stand(118)}" fill="#1c1916"/>', False),
        ("zuozi", "hold", "#5c4a3a", "坐姿 · 搭膝",
         f'<path d="M-31 74 H-24 V156 H-31 Z M24 74 H31 V156 H24 Z M-31 74 H31 V84 H-31 Z M-33 119 H33 V128 H-33 Z" fill="{GOLD}"/>'
         f'<path d="M25 136 L28 155 H16 L12 133 M-31 139 L-43 155 H-54 L-41 132" fill="{INK}"/>'
         f'<path d="M-13 71 L0 91 L13 71" fill="none" stroke="{PAPER}" stroke-width="3"/>'
         # sit arms official default
         f'<path d="M-19 75 L-30 100 M19 75 L30 100" fill="none" stroke="#5c4a3a" stroke-width="7" stroke-linecap="round"/>'
         f'<path d="M-30 100 L-8 105 M30 100 L8 105" fill="none" stroke="{SKIN}" stroke-width="4.5" stroke-linecap="round"/>'
         f'<circle cx="-8" cy="105" r="3.4" fill="{SKIN}"/><circle cx="8" cy="105" r="3.4" fill="{SKIN}"/>',
         None, True),
    ]

    figs = []
    xs = [110, 300, 510, 730, 940]
    # tighter even spacing across 1080 with padding
    xs = [118, 310, 520, 745, 955]
    for i, ((typ, pose, col, title, extra, legs, sit), x) in enumerate(zip(items, xs)):
        bones = skeleton_overlay(pose, 0.4, sit=sit)
        # For zuozi, arms are in extra; don't add stand arms
        arm = "" if sit else arms(pose, bare=(typ == "qipao"))
        hx, hy, hs = (0, 45, 1) if sit else (0, 28, 1)
        # qipao arms should be skin
        fig = f'''
        <g transform="translate({x} 70) scale({S})">
          <ellipse cx="0" cy="164" rx="44" ry="6" fill="#e0d5c2"/>
          {legs if legs else ""}
          <path d="{CLOTHES[typ]}" fill="{col}"/>
          {extra}
          {arm}
          {head_g(hx, hy, hs, hair=True, face_kind="signature")}
          {bones}
        </g>
        <text x="{x}" y="430" text-anchor="middle" class="label-ink" font-size="22">{title}</text>
        '''
        figs.append(fig)

    # Second row: same prototype, several poses only (no costume change) to show 姿态也是在这个小人上变
    pose_row = [("fold", "抱袖"), ("stand", "直立"), ("raise", "举手"), ("reach", "探身"), ("open", "开臂")]
    pxs = [118, 310, 520, 745, 955]
    pose_figs = []
    for (pose, title), x in zip(pose_row, pxs):
        pose_figs.append(f'''
        <g transform="translate({x} 520) scale({S})">
          <ellipse cx="0" cy="164" rx="40" ry="6" fill="#e0d5c2"/>
          <path d="{BASE_ROBE}" fill="{PAPER}" stroke="{INK}" stroke-width="1.05" stroke-linejoin="round"/>
          <path d="M0 68 V149" fill="none" stroke="{GOLD}" stroke-width="1.7"/>
          <path d="M-8 50 L0 70 L8 50" fill="none" stroke="{GOLD}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          {arms(pose, bare=True)}
          {head_g(0, 28, 1, hair=True, face_kind="signature")}
        </g>
        <text x="{x}" y="880" text-anchor="middle" class="label-ink" font-size="22">{title}</text>
        ''')

    return f'''
    <section class="sheet" id="variants" style="height:1680px">
      <div class="inner">
        <h1>同一骨架上的变化</h1>
        <div class="sub">先换姿态，再覆服饰。金色线是没变的原始结构</div>
        <hr class="rule"/>
      </div>
      <svg width="1080" height="940" viewBox="0 0 1080 940">
        {''.join(figs)}
        <text x="540" y="500" text-anchor="middle" class="label" font-size="20" letter-spacing="0.14em">只改姿态 · 中衣不变</text>
        {''.join(pose_figs)}
      </svg>
      <div class="inner" style="padding-top:12px">
        <p class="caption">上排是五种体态服饰套在同一套骨头上：礼袍、旗袍、甲胄、斗篷、坐姿。下排是原型中衣只改姿态，骨架不动。其余十六种服饰（短打、西装、长衫、制服、大衣等）也按同一锚点覆上即可。</p>
      </div>
    </section>
    '''


def html():
    return f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"/>
<title>咫牌小人 · 最原始结构</title>
<style>{css()}
  #stack {{ width:1080px; }}
  .sheet + .sheet {{ border-top: 24px solid #e8dfd0; }}
</style>
</head>
<body>
<div id="stack">
{sheet_structure()}
{sheet_prototype()}
{sheet_variants()}
</div>
</body>
</html>
'''


def main():
    out = Path("/workspace/diagacha-prototype")
    page = html()
    (out / "sheets.html").write_text(page, encoding="utf-8")
    print("wrote", out / "sheets.html", "bytes", len(page.encode()))

if __name__ == "__main__":
    main()

# -*- coding: utf-8 -*-
"""咫人 official merch / figurine specification sheet."""
import sys
from pathlib import Path
sys.path.insert(0, "/workspace/diagacha-prototype")
import build as B

OUT = Path("/workspace/diagacha-prototype")


def color_chip(x, y, hex_color, name, code, w=200, h=54):
    # text color: light chips get ink, dark chips get cream
    hx = hex_color.lstrip("#")
    r, g, b = int(hx[0:2], 16), int(hx[2:4], 16), int(hx[4:6], 16)
    luma = 0.299 * r + 0.587 * g + 0.114 * b
    tc = B.CREAM if luma < 140 else B.INK
    return f'''
    <g transform="translate({x} {y})">
      <rect width="{w}" height="{h}" rx="8" fill="{hex_color}" stroke="{B.INK}" stroke-width="0.8"/>
      <text x="14" y="23" font-size="16" fill="{tc}" font-family="{B.FONT}">{name}</text>
      <text x="14" y="42" font-size="14" fill="{tc}" font-family="{B.FONT}" opacity=".85">{code}</text>
    </g>'''


def dim_h(x1, x2, y, label, side="down"):
    """Horizontal dimension."""
    mid = (x1 + x2) / 2
    ty = y + 18 if side == "down" else y - 8
    return f'''
    <line x1="{x1}" y1="{y}" x2="{x2}" y2="{y}" stroke="{B.GOLD}" stroke-width="1.2"/>
    <line x1="{x1}" y1="{y-5}" x2="{x1}" y2="{y+5}" stroke="{B.GOLD}" stroke-width="1.2"/>
    <line x1="{x2}" y1="{y-5}" x2="{x2}" y2="{y+5}" stroke="{B.GOLD}" stroke-width="1.2"/>
    <text x="{mid}" y="{ty}" text-anchor="middle" class="k" font-size="15">{label}</text>'''


def dim_v(x, y1, y2, label, side="left"):
    mid = (y1 + y2) / 2
    tx = x - 8 if side == "left" else x + 8
    anchor = "end" if side == "left" else "start"
    return f'''
    <line x1="{x}" y1="{y1}" x2="{x}" y2="{y2}" stroke="{B.GOLD}" stroke-width="1.2"/>
    <line x1="{x-5}" y1="{y1}" x2="{x+5}" y2="{y1}" stroke="{B.GOLD}" stroke-width="1.2"/>
    <line x1="{x-5}" y1="{y2}" x2="{x+5}" y2="{y2}" stroke="{B.GOLD}" stroke-width="1.2"/>
    <text x="{tx}" y="{mid + 5}" text-anchor="{anchor}" class="k" font-size="15">{label}</text>'''


def html():
    S = 2.85
    # Place figure so head-top is around y=70 in this svg's upper area
    # game origin translated: game y=10 (head top) -> svg y = 90
    tx, ty = 300, 90 - 10 * S

    fig = f'''
    <g transform="translate({tx} {ty}) scale({S})">
      {B.stage(157, 50)}
      {B.proto_garment("fold")}
      {B.head_g(0, 28, 1, hair=True, face_kind="signature")}
    </g>'''

    # Dimension anchors in canvas px
    # head top: ty + 10*S, feet: ty+157*S, plank bottom: ty+168*S
    head_top = ty + 10 * S
    head_bot = ty + 46 * S
    feet = ty + 157 * S
    plank_bot = ty + 168 * S
    shoulder_y = ty + 58 * S
    # shoulders at ±20
    sh_l = tx - 20 * S
    sh_r = tx + 20 * S
    head_l = tx - 18 * S
    head_r = tx + 18 * S
    cx = tx

    # Face inset
    face = f'''
    <g transform="translate(820 130)">
      <rect x="-90" y="-70" width="180" height="210" rx="14" fill="#faf6ee" stroke="#e4d8c4" stroke-width="1.2"/>
      <text x="0" y="-42" text-anchor="middle" class="label-ink" font-size="18">咫脸三笔</text>
      <g transform="translate(0 40) scale(2.4)">
        {B.head_g(0, 0, 1, hair=True, face_kind="signature")}
        <circle cx="-6" cy="-1" r="0.7" fill="{B.GOLD}"/>
        <circle cx="6" cy="-1" r="0.7" fill="{B.GOLD}"/>
        <circle cx="0" cy="8" r="0.7" fill="{B.GOLD}"/>
      </g>
      <text x="0" y="122" text-anchor="middle" class="label" font-size="14">眼 (±6, −1) · 嘴 y = 8</text>
    </g>'''

    chips = "".join([
        color_chip(640, 360, B.SILK, "月白绸", B.SILK),
        color_chip(860, 360, B.GOLD, "金线 / 咫台", B.GOLD),
        color_chip(640, 426, B.LINING, "交领里色", B.LINING),
        color_chip(860, 426, B.SASH, "丝绦腰带", B.SASH),
        color_chip(640, 492, B.SKIN, "肤色", B.SKIN),
        color_chip(860, 492, B.INK, "墨色", B.INK),
    ])

    # Scale silhouettes: 半咫 0.5, 一咫 1, 二咫 2 — drawn as the same figure at relative scales
    def mini(x, scale, title, mm, official=False):
        s = 0.72 * scale
        ring = f'<rect x="-70" y="-8" width="140" height="210" rx="12" fill="#faf6ee" stroke="{B.GOLD if official else "#e4d8c4"}" stroke-width="{1.8 if official else 1}"/>' if False else ""
        return f'''
        <g transform="translate({x} 0)">
          <g transform="translate(0 {int(120 - 10*s)}) scale({s})">
            {B.stage(157, 50)}
            {B.proto_garment("fold")}
            {B.head_g(0, 28, 1, hair=True, face_kind="signature")}
          </g>
          <text x="0" y="248" text-anchor="middle" class="label-ink" font-size="20">{title}</text>
          <text x="0" y="272" text-anchor="middle" class="label" font-size="15">{mm}</text>
        </g>'''

    # Better: three silhouettes aligned at feet, different sizes, in a row
    def scale_fig(x, s, title, mm, highlight=False):
        # align plank bottoms at y=200
        # plank_bot_local = 168 * s, so ty = 200 - 168*s
        ty2 = 300 - 168 * s
        stroke = B.GOLD if highlight else "#e4d8c4"
        return f'''
        <g transform="translate({x} 0)">
          <g transform="translate(0 {ty2}) scale({s})">
            {B.stage(157, 50)}
            {B.proto_garment("fold")}
            {B.head_g(0, 28, 1, hair=True, face_kind="signature")}
          </g>
          <text x="0" y="336" text-anchor="middle" class="label-ink" font-size="20">{title}</text>
          <text x="0" y="360" text-anchor="middle" class="label" font-size="15">{mm}</text>
        </g>'''

    scales = f'''
    <g transform="translate(0 20)">
      {scale_fig(200, 0.36, "半咫", "80 mm · 迷你摆件", False)}
      {scale_fig(500, 0.72, "一咫（主规格）", "160 mm · 展示手办", True)}
      {scale_fig(860, 1.44, "二咫", "320 mm · 大号展示", False)}
    </g>'''

    # Dimension lines around the main figure (in canvas space)
    dims = f'''
    {dim_v(tx - 130, head_top, plank_bot, "连台 160 mm", "left")}
    {dim_v(tx + 140, head_top, feet, "身高 149 mm", "right")}
    {dim_h(head_l, head_r, head_top - 22, "头径 36.5 mm", "up")}
    <line x1="{sh_l}" y1="{shoulder_y}" x2="{sh_l}" y2="{plank_bot + 22}" stroke="{B.GOLD}" stroke-width="0.8" stroke-dasharray="3 3" opacity=".7"/>
    <line x1="{sh_r}" y1="{shoulder_y}" x2="{sh_r}" y2="{plank_bot + 22}" stroke="{B.GOLD}" stroke-width="0.8" stroke-dasharray="3 3" opacity=".7"/>
    {dim_h(sh_l, sh_r, plank_bot + 22, "肩宽 40.5 mm", "down")}
    '''

    return f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"/>
<title>咫人 · 官方规格</title>
<style>{B.css()}
  html,body,.sheet{{width:1080px;height:1680px;background:{B.CREAM};margin:0;padding:0;overflow:hidden}}
</style>
</head>
<body>
<section class="sheet" id="spec" style="height:1680px">
  <div class="inner" style="padding-bottom:12px">
    <h1>咫人 · 官方规格</h1>
    <div class="sub">文创与手办主规格　一咫 = 160 mm（含咫台）</div>
    <hr class="rule"/>
  </div>
  <svg width="1080" height="620" viewBox="0 0 1080 620">
    {fig}
    {dims}
    {face}
    {chips}
  </svg>
  <svg width="1080" height="400" viewBox="0 0 1080 400">
    {scales}
  </svg>
  <div class="inner" style="padding-top:0;padding-bottom:4px">
    <p class="caption" style="margin-top:0">古咫为八寸，约十六至十八厘米。本规格取连台总高 160 mm 为一咫；游戏坐标按 160/158 换算，上图尺寸为生产取整。精确打样以骨架坐标为准。</p>
  </div>
  <div class="inner" style="padding-top:0">
    <div class="notes">
      <div><b>锁定不变。</b>正圆头、四头身、咫脸三笔、金交领、默认抱袖，以及脚下的咫台。官方默认款是月白中衣与丝绦腰带。</div>
      <div><b>可以变化。</b>二十一型服饰、十六种姿态、八种处理，都从这套骨架上覆。衍生款须另标，不得改头形和咫脸。</div>
      <div><b>底座即咫台。</b>官方手办不用圆形底盘替换金台。咫台是人物的一部分，不是配件。</div>
      <div><b>不要做成的。</b>不做纸人、剪纸或白丧服，不做花脸，不加眉鼻到默认脸上，不把官方比例改成五头身或两头 Q 版。</div>
    </div>
  </div>
</section>
</body>
</html>
'''


def main():
    page = html()
    path = OUT / "spec.html"
    path.write_text(page, encoding="utf-8")
    print("wrote", path, "bytes", len(page.encode()))


if __name__ == "__main__":
    main()

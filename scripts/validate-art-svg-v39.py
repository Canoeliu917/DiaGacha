"""Validate every rendered card; exact curve bounds plus conservative stroke bounds."""
import hashlib
import json
import math
import re
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT.parent / 'figure-check-v39'
NUMBER = r'[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?'
IDENTITY = (1, 0, 0, 1, 0, 0)
# Visually checked from the actual Ct SVG contact sheet. Match primitive bounds,
# not just card IDs, so a future clipped character cannot inherit this acceptance.
BACKGROUND_EDGES = {
    'role-v21-winnie': ('path', [99.02,128.32,220.98,195.18], 'The mound continues through the lower frame; the visible head and upper body are complete.'),
    'play-v21-happydays': ('path', [42.4,70.26,277.6,199.2], 'The enclosing mound continues through the lower frame.'),
    'play-cherry': ('circle', [216.14,-7.26,281.46,58.06], 'The orchard canopy intentionally continues above the frame.'),
    'play-yuanye': ('circle', [216.14,-7.26,281.46,58.06], 'The forest canopy intentionally continues above the frame.'),
    'place-cherry': ('circle', [216.14,-7.26,281.46,58.06], 'The orchard canopy intentionally continues above the frame.'),
    'place-forest': ('circle', [216.14,-7.26,281.46,58.06], 'The forest canopy intentionally continues above the frame.'),
    'play-lear': ('path', [54.11,-8.49,261.09,136.09], 'A background wind line continues above the frame; all figures remain inside.'),
    'place-heath': ('path', [54.11,-8.49,261.09,136.09], 'A background wind line continues above the frame.'),
    'yplay-jiang': ('path', [101.43,139.73,218.57,199.87], 'Table legs continue below the frame; the tabletop and dramatic objects are complete.'),
    'xplay-seagull': ('path', [45.28,89.88,274.72,210.12], 'Lake waves continue below the frame.'),
    'yplay-tempest': ('path', [54.11,110.51,265.89,221.49], 'Sea waves continue below the frame.'),
    'place-island': ('path', [54.11,110.51,265.89,221.49], 'Sea waves continue below the frame.'),
    'v23-play-viewbridge': ('path', [71.76,120.76,248.24,213.24], 'Water below the dock continues below the frame.'),
    'xplace-dock': ('path', [71.76,120.76,248.24,213.24], 'Water below the dock continues below the frame.'),
    'ystyle-object': ('path', [82.93,149.43,237.07,228.57], 'Table legs continue below the frame; the tabletop and objects are complete.'),
    'ydir-handkerchief': ('path', [82.93,149.43,237.07,228.57], 'Table legs continue below the frame; the tabletop and objects are complete.'),
}


def multiply(a, b):
    return (a[0]*b[0]+a[2]*b[1], a[1]*b[0]+a[3]*b[1],
            a[0]*b[2]+a[2]*b[3], a[1]*b[2]+a[3]*b[3],
            a[0]*b[4]+a[2]*b[5]+a[4], a[1]*b[4]+a[3]*b[5]+a[5])


def point(matrix, xy):
    x, y = xy
    a, b, c, d, e, f = matrix
    return (a*x+c*y+e, b*x+d*y+f)


def transform(value):
    result = IDENTITY
    for name, args in re.findall(r'(\w+)\(([^)]+)\)', value):
        values = [float(n) for n in re.findall(NUMBER, args)]
        if name == 'translate':
            current = (1, 0, 0, 1, values[0], values[1] if len(values)>1 else 0)
        elif name == 'scale':
            current = (values[0], 0, 0, values[1] if len(values)>1 else values[0], 0, 0)
        elif name == 'skewX':
            current = (1, 0, math.tan(math.radians(values[0])), 1, 0, 0)
        elif name == 'rotate':
            angle = math.radians(values[0]); co, si = math.cos(angle), math.sin(angle)
            current = (co, si, -si, co, 0, 0)
            if len(values)==3:
                x, y = values[1:]
                current = multiply(multiply((1,0,0,1,x,y), current), (1,0,0,1,-x,-y))
        else:
            raise ValueError('Unhandled transform: '+name)
        result = multiply(result, current)
    return result


def curve_points(points):
    """Bezier extrema after transformation, so skew/rotation remain exact."""
    result = [points[0], points[-1]]
    roots = set()
    for axis in (0, 1):
        v = [p[axis] for p in points]
        if len(v)==3:
            denominator = v[0]-2*v[1]+v[2]
            if abs(denominator)>1e-10: roots.add((v[0]-v[1])/denominator)
        else:
            a, b, c = -v[0]+3*v[1]-3*v[2]+v[3], 2*(v[0]-2*v[1]+v[2]), v[1]-v[0]
            if abs(a)<1e-10:
                if abs(b)>1e-10: roots.add(-c/b)
            elif b*b-4*a*c >= 0:
                delta = math.sqrt(b*b-4*a*c)
                roots.update(((-b+delta)/(2*a), (-b-delta)/(2*a)))
    for t in roots:
        if 0<t<1:
            coefficients = ((1-t)**2, 2*t*(1-t), t*t) if len(points)==3 else ((1-t)**3, 3*t*(1-t)**2, 3*t*t*(1-t), t**3)
            result.append(tuple(sum(k*p[axis] for k,p in zip(coefficients,points)) for axis in (0,1)))
    return result


def path_points(value, matrix):
    tokens = re.findall(NUMBER+r'|[A-Za-z]', value)
    arity = {'M':2,'L':2,'H':1,'V':1,'Q':4,'T':2,'C':6,'Z':0}
    result, current, start, control, command = [], (0,0), (0,0), None, None
    i = 0
    while i<len(tokens):
        if tokens[i].isalpha(): command=tokens[i]; i+=1
        assert command in arity, ('Unhandled path command', command)
        count = arity[command]
        values = list(map(float,tokens[i:i+count])); i+=count
        old=current
        if command=='Z': current=start
        elif command=='H': current=(values[0],current[1])
        elif command=='V': current=(current[0],values[0])
        else: current=tuple(values[-2:])
        if command=='Q':
            control=tuple(values[:2]); result.extend(curve_points([point(matrix,p) for p in (old,control,current)]))
        elif command=='T':
            control=(2*old[0]-control[0],2*old[1]-control[1]) if control else old
            result.extend(curve_points([point(matrix,p) for p in (old,control,current)]))
        elif command=='C':
            result.extend(curve_points([point(matrix,p) for p in (old,tuple(values[:2]),tuple(values[2:4]),current)])); control=None
        else:
            result.append(point(matrix,current)); control=None
        if command=='M': start=current; command='L'
    return result


def inspect(element, parent=IDENTITY, inherited=None):
    attrs = element.attrib
    matrix = multiply(parent, transform(attrs.get('transform','')))
    style = {**(inherited or {'stroke':'none','stroke-width':'1','fill':'black'}), **{k:v for k,v in attrs.items() if k in ('stroke','stroke-width','fill')}}
    tag = element.tag.split('}')[-1]
    points = []
    if tag=='path': points=path_points(attrs['d'],matrix)
    elif tag=='rect':
        x,y,w,h=(float(attrs.get(k,0)) for k in ('x','y','width','height'))
        points=[point(matrix,p) for p in ((x,y),(x+w,y),(x,y+h),(x+w,y+h))]
    elif tag in ('circle','ellipse'):
        cx,cy=(float(attrs.get(k,0)) for k in ('cx','cy'))
        rx=float(attrs.get('rx',attrs.get('r',0))); ry=float(attrs.get('ry',attrs.get('r',0)))
        x,y=point(matrix,(cx,cy)); a,b,c,d,_,_=matrix
        ex,ey=math.hypot(a*rx,c*ry),math.hypot(b*rx,d*ry)
        points=[(x-ex,y-ey),(x+ex,y+ey)]
    elif tag not in ('svg','g','text'):
        raise ValueError('Unhandled SVG element: '+tag)
    if points:
        assert all(math.isfinite(v) for xy in points for v in xy)
        # A Frobenius norm overestimates stroke growth under rotation/skew, by design.
        radius=float(style['stroke-width'])/2*math.sqrt(sum(v*v for v in matrix[:4])) if style['stroke']!='none' else 0
        bounds=(min(p[0] for p in points)-radius,min(p[1] for p in points)-radius,max(p[0] for p in points)+radius,max(p[1] for p in points)+radius)
        if bounds[0]<-.5 or bounds[1]<-.5 or bounds[2]>320.5 or bounds[3]>188.5:
            yield {'tag':tag,'bounds':[round(v,2) for v in bounds]}
    for child in element: yield from inspect(child,matrix,style)


report=json.loads((OUT/'art-audit-v39.json').read_text(encoding='utf8'))
assert report['indexSha256']==hashlib.sha256((ROOT/'index.html').read_bytes()).hexdigest(), 'Re-render audit after changing index.html'
cards=json.loads((OUT/'cards-v39.json').read_text(encoding='utf8'))
overflows=[]
for card in cards:
    root=ET.fromstring(card['svg'])
    assert root.attrib['viewBox']=='0 0 320 188', card['id']
    assert not re.search(r'NaN|undefined|Infinity',card['svg']),card['id']
    findings=list(inspect(root))
    if findings:
        expected=BACKGROUND_EDGES.get(card['id'])
        for finding in findings:
            accepted=expected and finding['tag']==expected[0] and all(abs(a-b)<.75 for a,b in zip(finding['bounds'],expected[1]))
            finding['review']='intentional-background-extension' if accepted else 'needs-visual-review'
            if accepted:finding['reason']=expected[2]
        overflows.append({'id':card['id'],'name':card['name'],'findings':findings})
unreviewed=[c for c in overflows if any(f['review']=='needs-visual-review' for f in c['findings'])]
report['svgValidation']={'count':len(cards),'xmlValid':len(cards),'finiteCoordinates':len(cards),'viewBox':'0 0 320 188','boundsMethod':'Exact transformed line/Bezier/ellipse bounds; conservative stroke expansion; text labels excluded. Visually accepted background edges are matched against their exact primitive bounds; new overflows remain a review queue.','overflowCards':overflows,'unreviewedOverflowCards':unreviewed}
(ROOT/'docs/ART_AUDIT_V39.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps({'count':len(cards),'xmlValid':len(cards),'intentionalBackgroundCards':len(overflows)-len(unreviewed),'unreviewedOverflowCards':[(c['id'],c['name']) for c in unreviewed]},ensure_ascii=False))

"""Subset the licensed reveal face: python build-reveal-font-v41.py font.ttf text.txt."""
from pathlib import Path
import sys
from fontTools import subset

root = Path(__file__).resolve().parents[1]
options = subset.Options()
options.flavor = 'woff2'
options.name_IDs = ['*']
options.name_legacy = True
options.name_languages = ['*']
font = subset.load_font(sys.argv[1], options)
characters = Path(sys.argv[2]).read_text(encoding='utf-8')
missing = {ord(char) for char in characters if not char.isspace()} - set(font.getBestCmap())
assert not missing, f'Missing glyphs: {sorted(missing)}'
subsetter = subset.Subsetter(options=options)
subsetter.populate(text=characters)
subsetter.subset(font)
destination = root/'assets/fonts/reveal-wenkai.woff2'
destination.parent.mkdir(parents=True, exist_ok=True)
subset.save_font(font, str(destination), options)
print(f'Reveal font: {destination.stat().st_size} bytes, {len(set(characters))} requested characters')

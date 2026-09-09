from pathlib import Path
from PIL import Image

SOURCE = Path('/Users/hussein/Documents/Personal/Personal Training and Skilling/AiTutorsZ/AiTutorZ Logos 2026/July2026/pmpeco Sh_Logo_28Jul26.png')
TARGET = Path('public/brand/pmpeco-white-logo.png')
WATERMARK = Path('public/brand/pmpeco-watermark.png')

image = Image.open(SOURCE).convert('RGBA')
alpha_box = image.getchannel('A').getbbox()
if alpha_box is None:
    raise RuntimeError('The supplied logo has no visible pixels.')

logo = image.crop(alpha_box)
logo.thumbnail((512, 512), Image.Resampling.LANCZOS)
TARGET.parent.mkdir(parents=True, exist_ok=True)
logo.save(TARGET, optimize=True)
watermark = Image.new('RGBA', logo.size, (50, 15, 145, 0))
watermark.putalpha(logo.getchannel('A').point(lambda value: round(value * 0.04)))
watermark.save(WATERMARK, optimize=True)
print(TARGET.resolve())
print(WATERMARK.resolve())

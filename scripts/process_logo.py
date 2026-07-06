from PIL import Image, ImageDraw, ImageFilter
import numpy as np

src = Image.open(r"g:/projects/leapstrike/reference/ls_logo1.png").convert("RGBA")
w, h = src.size
arr = np.array(src)

# The medallion is a circular badge centered on a grey radial-gradient background.
# Strategy: build a circular alpha mask sized to the medallion, feather the edge,
# then autocrop to the visible bounds.

# Estimate circle: badge is roughly centered, fills most of the frame with grey margin.
cx, cy = w / 2, h / 2 + h * 0.005
radius = min(w, h) * 0.375  # medallion outer edge

# High-res mask with slight feather for a crisp but non-aliased edge
mask = Image.new("L", (w, h), 0)
d = ImageDraw.Draw(mask)
d.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(1.2))

out = src.copy()
out.putalpha(mask)

# Autocrop to non-transparent bounding box
bbox = out.getbbox()
out = out.crop(bbox)

# Save full-color transparent version
out.save(r"g:/projects/leapstrike/assets/logo.png")
print("saved logo.png", out.size)

#!/usr/bin/env python3
"""
Generate SmartCard App Icon
Run: pip install Pillow && python generate_app_icon.py
"""

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Please install Pillow: pip install Pillow")
    exit(1)

import os

def create_app_icon(size=1024):
    """Create a credit card themed app icon"""
    # Create image with gradient background
    img = Image.new('RGB', (size, size), color='#1E90FF')
    draw = ImageDraw.Draw(img)

    # Create gradient effect
    for y in range(size):
        r = int(30 + (y / size) * 30)
        g = int(100 + (y / size) * 50)
        b = int(200 + (y / size) * 30)
        for x in range(size):
            # Add slight horizontal gradient
            r_adj = r + int((x / size) * 20)
            img.putpixel((x, y), (min(r_adj, 255), g, min(b, 255)))

    draw = ImageDraw.Draw(img)

    # Draw credit card shape
    card_margin = size * 0.15
    card_width = size - (card_margin * 2)
    card_height = card_width * 0.63  # Standard card ratio
    card_top = (size - card_height) / 2

    # Card shadow
    shadow_offset = size * 0.02
    draw.rounded_rectangle(
        [card_margin + shadow_offset, card_top + shadow_offset,
         size - card_margin + shadow_offset, card_top + card_height + shadow_offset],
        radius=size * 0.05,
        fill=(0, 0, 0, 50)
    )

    # Card body
    draw.rounded_rectangle(
        [card_margin, card_top, size - card_margin, card_top + card_height],
        radius=size * 0.05,
        fill='#FFFFFF'
    )

    # Card chip
    chip_size = size * 0.12
    chip_x = card_margin + size * 0.08
    chip_y = card_top + size * 0.08
    draw.rounded_rectangle(
        [chip_x, chip_y, chip_x + chip_size * 1.2, chip_y + chip_size],
        radius=size * 0.015,
        fill='#FFD700'
    )

    # Chip lines
    line_color = '#DAA520'
    line_width = int(size * 0.003)
    for i in range(3):
        y_pos = chip_y + chip_size * 0.25 + i * chip_size * 0.25
        draw.line(
            [chip_x + chip_size * 0.1, y_pos, chip_x + chip_size * 1.1, y_pos],
            fill=line_color,
            width=line_width
        )

    # Card number dots (representing card number)
    dot_y = card_top + card_height * 0.55
    dot_radius = size * 0.015
    for group in range(4):
        for dot in range(4):
            x = card_margin + size * 0.1 + group * size * 0.15 + dot * size * 0.025
            draw.ellipse(
                [x - dot_radius, dot_y - dot_radius, x + dot_radius, dot_y + dot_radius],
                fill='#333333'
            )

    # Star/checkmark symbol (representing best card selection)
    star_x = size * 0.75
    star_y = card_top + card_height * 0.3
    star_size = size * 0.08

    # Draw checkmark circle
    draw.ellipse(
        [star_x - star_size, star_y - star_size, star_x + star_size, star_y + star_size],
        fill='#32CD32'
    )

    # Draw checkmark
    check_width = int(size * 0.015)
    draw.line(
        [star_x - star_size * 0.4, star_y, star_x - star_size * 0.1, star_y + star_size * 0.4],
        fill='white',
        width=check_width
    )
    draw.line(
        [star_x - star_size * 0.1, star_y + star_size * 0.4, star_x + star_size * 0.5, star_y - star_size * 0.3],
        fill='white',
        width=check_width
    )

    return img

def main():
    # Create output directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(script_dir, '..', 'SmartCard', 'Resources', 'Assets.xcassets', 'AppIcon.appiconset')
    os.makedirs(output_dir, exist_ok=True)

    # Generate 1024x1024 icon
    print("Generating App Icon...")
    icon = create_app_icon(1024)

    # Save
    output_path = os.path.join(output_dir, 'AppIcon-1024.png')
    icon.save(output_path, 'PNG')
    print(f"Saved: {output_path}")

    print("\nApp Icon generated successfully!")
    print("You can now open Xcode and the icon should appear in Assets.xcassets")

if __name__ == '__main__':
    main()

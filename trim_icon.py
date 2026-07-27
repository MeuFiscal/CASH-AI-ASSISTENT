import sys
from PIL import Image

def trim_transparency(image_path, output_path, size=None):
    img = Image.open(image_path).convert("RGBA")
    
    # Get bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    # Make it a square by adding transparent padding if needed (just to be safe, but usually it's square)
    width, height = img.size
    max_dim = max(width, height)
    
    # Calculate padding to center it
    new_img = Image.new("RGBA", (max_dim, max_dim), (255, 255, 255, 0))
    offset = ((max_dim - width) // 2, (max_dim - height) // 2)
    new_img.paste(img, offset)
    
    if size:
        # Resize it smoothly
        new_img = new_img.resize(size, Image.Resampling.LANCZOS)
        
    new_img.save(output_path, format="PNG")
    print(f"Saved {output_path}")

if __name__ == "__main__":
    # Process favicon-64.png and icon-180.png based on the original favicon.png
    trim_transparency("public/favicon.png", "public/favicon-64.png", (64, 64))
    trim_transparency("public/icon.png", "public/icon-180.png", (180, 180))

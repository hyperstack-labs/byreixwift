from PIL import Image
from collections import Counter

def analyze_colors(path):
    img = Image.open(path).convert("RGB")
    pixels = list(img.getdata())
    common_colors = Counter(pixels).most_common(20)
    print("Most common colors (R, G, B):")
    for color, count in common_colors:
        print(f"{color}: {count} pixels")

if __name__ == "__main__":
    path = r"c:\Users\aven\Desktop\repo\byreixwift\client\public\hero-horizon-final.png"
    analyze_colors(path)

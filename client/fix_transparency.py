from PIL import Image
import os

def remove_white_background(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    new_data = []
    
    # Threshold for "white"
    # Pure white is (255, 255, 255)
    # We want to catch everything that is very close to white
    for item in datas:
        r, g, b, a = item
        
        # If the pixel is very light (all channels > 245)
        if r > 245 and g > 245 and b > 245:
            new_data.append((0, 0, 0, 0)) # Fully transparent
        else:
            # For the edges of the glow, we can make it semi-transparent
            # based on how close it is to white, but for now let's just keep it.
            # A more advanced logic: alpha = 255 - (average of r,g,b if close to 255)
            # but simple threshold often works best for clean assets.
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    path = r"c:\Users\aven\Desktop\repo\byreixwift\client\public\hero-horizon-final.png"
    remove_white_background(path, path)
    print(f"Cleaned white background from {path}")

import numpy as np
from PIL import Image
from scipy.ndimage import sobel
from scipy.ndimage import zoom
import numpy as np

factor = 1.2 #increase image color contrast
def sobel_edge_detection(image_array):
    sx = sobel(image_array, axis=0, mode='constant')
    sy = sobel(image_array, axis=1, mode='constant')
    sobel_edges = np.hypot(sx, sy)
    sobel_edges /= np.max(sobel_edges)
    return sobel_edges

# Your existing pixelization function, modified to take two different scales
def basic_pixelization(img, scale):
    global factor
    width, height = img.size
    pixels = img.load()

    for i in range(0, width, scale):
        for j in range(0, height, scale):
            sums = [0, 0, 0]
            count = 0
            # Collect pixel data within the block
            for x in range(i, min(i + scale, width)):
                for y in range(j, min(j + scale, height)):
                    pixel = pixels[x, y]
                    sums[0] += pixel[0]  # R
                    sums[1] += pixel[1]  # G
                    sums[2] += pixel[2]  # B
                    count += 1

            # Calculate average color
            if count > 0:

              avg = list(s // count for s in sums)
              for k in [0,1,2]:
                avg[k] = np.clip(avg[k] * factor, 0, 255).astype(np.uint8)
              for x in range(i, min(i + scale, width)):
                  for y in range(j, min(j + scale, height)):
                      pixels[x, y] = tuple(avg)
def color_pixelization(img, scale, color):
    global factor
    width, height = img.size
    pixels = img.load()
  

    for i in range(0, width, scale):
        for j in range(0, height, scale):
          
            sums = [0, 0, 0]
            count = 0
            # Collect pixel data within the block
            for x in range(i, min(i + scale, width)):
                for y in range(j, min(j + scale, height)):
                    pixel = pixels[x, y]
                    sums[0] += pixel[0]  # R
                    sums[1] += pixel[1]  # G
                    sums[2] += pixel[2]  # B
                    count += 1
                
          # Calculate average color
            if count > 0:
                avg_list = [0,0,0]
                avg_list = list(s // count for s in sums)
                for k in [0,1,2]: #applying the colors
                    avg_list[k] = avg_list[k] + (color[k] - avg_list[k])//4
                    avg_list[k] = np.clip(avg_list[k] * factor, 0, 255).astype(np.uint8)
                avg = tuple(s for s in avg_list)
            
            for x in range(i, min(i + scale, width)):
                for y in range(j, min(j + scale, height)):
                    pixels[x, y] = avg
                      
                        
def is_inside_circle(x, y, center_x, center_y, radius):
    return (x - center_x) ** 2 + (y - center_y) ** 2 <= radius ** 2

def circle_based_pixelization(img, inner_radius, inner_scale, outer_scale):
    width, height = img.size
    pixels = img.load()

    center_x, center_y = width // 2, height // 2

    # Iterate over each pixel in the image
    for x in range(width):
        for y in range(height):
            # Check if the pixel is inside the inner circle
            if is_inside_circle(x, y, center_x, center_y, inner_radius):
                scale = inner_scale
            else:
                scale = outer_scale

            # Calculate the start of the block
            start_x = x - x % scale
            start_y = y - y % scale

            # Pixelization logic
            if start_x == x and start_y == y:  # Only proceed if at the start of a block
                sums = [0, 0, 0]
                count = 0
                for block_x in range(start_x, min(start_x + scale, width)):
                    for block_y in range(start_y, min(start_y + scale, height)):
                        pixel = pixels[block_x, block_y]
                        sums[0] += pixel[0]  # R
                        sums[1] += pixel[1]  # G
                        sums[2] += pixel[2]  # B
                        count += 1

                # Apply average color to the block
                if count > 0:
                    avg = tuple(s // count for s in sums)
                    for block_x in range(start_x, min(start_x + scale, width)):
                        for block_y in range(start_y, min(start_y + scale, height)):
                            pixels[block_x, block_y] = avg

original_img = Image.open("./input/image.jpg")

# circle_based_pixelization(original_img, inner_radius=900, inner_scale=40, outer_scale=100)


# basic_pixelization(original_img, 100)
color_pixelization(original_img, 100, [153, 255, 153])
original_img.save('pixel_test.png')
import numpy as np
from PIL import Image
from scipy.ndimage import sobel
from scipy.ndimage import zoom

def sobel_edge_detection(image_array):
    sx = sobel(image_array, axis=0, mode='constant')
    sy = sobel(image_array, axis=1, mode='constant')
    sobel_edges = np.hypot(sx, sy)
    sobel_edges /= np.max(sobel_edges)
    return sobel_edges

# Your existing pixelization function, modified to take two different scales
def basic_pixelization(img, scale):
    width, height = img.size
    pixels = img.load()  # Get the pixels of the image

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
                avg = tuple(s // count for s in sums)
                # Apply average color to the block
                for x in range(i, min(i + scale, width)):
                    for y in range(j, min(j + scale, height)):
                        pixels[x, y] = avg


original_img = Image.open("./input/image.jpg")

basic_pixelization(original_img, 40)

original_img.save('pixelized_with_edges.png')

import os
from PIL import Image 
import numpy as np


image = "image.jpg"
img = Image.open(image)

width = img.width
height = img.height
mwidth = width // 1000
mheight = height // 1000
scale = 200

if scale != 0:
  img = img.resize( (width // scale * scale, height // scale * scale) )

w = img.width
h = img.height

print(w,h)
# 1D position --> [x, y]
def grid(a):
  return (a//w, a%w)
# [x,y] --> 1D position
def linear(x,y):
  return x*w+y


pixels = img.getdata()
new_pixels = []
# For every pixel from our original image, it saves
# a copy of that pixel to our new_pixels array
for p in pixels:
  new_pixels.append(p)

pos = 0
block = scale
for i in range(0,w,block):
  for j in range(0,h,block):
    # get block by block rbg sum
    sums = [0,0,0]
    for x in range(i, i+block):
      for y in range(j,j+block):
        location = linear(x,y)
        pixel = new_pixels[location]

        sums[0] += pixel[0]  #R
        sums[1] += pixel[1]  #G
        sums[2] += pixel[2]  #B
        
    for x in range(i, i+block):
      for y in range(j,j+block):
        location = linear(x,y)
        newr = sums[0] // block**2
        newg = sums[1] // block**2
        newb = sums[2] // block**2
        new_pixels[location] = (newr, newg, newb)

newImage = Image.new("RGB", img.size)
newImage.putdata(new_pixels)
newImage.save("pixel"+str(scale)+".jpg")

  


# import subprocess
# subprocess.Popen('rm 45.jpg', shell=True)
from flask import Flask, request, jsonify
from PIL import Image
import io

app = Flask(__name__)

@app.route('/process-image', methods=['POST'])
def process_image():
    file = request.files['image']
    img = Image.open(file.stream)
    img = img.convert('RGB')

    color_list = {}
    color_id = 0

    for x in range(img.width):
        for y in range(img.height):
            color = img.getpixel((x, y))
            if color not in color_list:
                color_list[color] = color_id
                color_id += 1

    return jsonify(color_list)

if __name__ == '__main__':
    app.run(debug=True)

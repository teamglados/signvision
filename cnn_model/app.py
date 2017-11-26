from flask import Flask, request, jsonify
from utils import crop_frames, get_crop_sign, store_img, process_image
from cnn_model import predict
import numpy as np
import time
app = Flask(__name__)

@app.route('/predict/<id>', methods=['GET'])
def predict_sign(id):
    full_path = "/tmp/{0}-full.jpg".format(id)
    crop_path = "/tmp/{0}.jpg".format(id)
    cropped_img = get_crop_sign(full_path)

    if not cropped_img:
        return jsonify({
            'image': None,
            'valid': False
        })

    store_img(path=crop_path, image=cropped_img)
    label = predict(np.array(process_image(cropped_img)))

    data = {'id': id,
            'timestamp': int(time.time()),
            'image': crop_path,
            'image_full': full_path,
            'probability': 0.0,
            'valid': label[0]}

    return jsonify(data)

if __name__ == '__main__':
    app.run(port=8080)

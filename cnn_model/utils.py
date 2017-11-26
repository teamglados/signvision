from glob import glob
from PIL import Image
import numpy as np
import cv2
from skimage import measure
import math

def read_data(path='GTSRB/Final_Training/Images/*/', shape=(32, 32), true_label='GTSRB/Final_Training/Images/00014/', format='RGB'):
    X = []
    Y = []
    for folder in glob(path):
        if true_label is None or folder == true_label:
            label = 1
        else:
            label = 0
        for i, filename in enumerate(glob(folder + '*.ppm') + glob(folder + '*.jpg') + glob(folder + '*.png') + glob(folder + '*.bmp')):
            if true_label is None:
                print(filename)

            if label is not 1 and i > 200:
                break

            im = Image.open(filename)
            im = im.convert(format)
            im = im.resize(shape, Image.LANCZOS)

            if format is not 'RGB':
                im = np.expand_dims(im, axis=2)
            X.append(np.array(im))
            Y.append(label)

    return {"x": np.array(X, dtype=np.float32), "y": np.array(Y, dtype=np.float32)}

def process_image(im, shape=(32, 32)):
    im = im.convert('RGB')
    return im.resize(shape, Image.LANCZOS)

def get_image_array(path):
    im = Image.open(path)
    return np.array(process_image(im))

def store_img(path, image, format="jpg"):
    image.save(path + '.' + format)

def get_crop_sign(img_path):
    img = cv2.imread(img_path)
    original_img = img.copy()
    final_img = Image.open(img_path)
    img_hsv=cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    lower_red = np.array([0,50,50])
    upper_red = np.array([10,255,255])
    mask0 = cv2.inRange(img_hsv, lower_red, upper_red)

    lower_red = np.array([170,50,50])
    upper_red = np.array([180,255,255])
    mask1 = cv2.inRange(img_hsv, lower_red, upper_red)

    mask = mask0+mask1
    output_img = img.copy()
    output_img[np.where(mask==0)] = 0

    output_img = cv2.erode(output_img, None, iterations=2)
    output_img = cv2.dilate(output_img, None, iterations=4)

    # Only reduce the number of labels
    output_img[output_img > 0] = 255

    labels = measure.label(output_img, neighbors=8, background=0)
    mask = np.zeros(output_img.shape, dtype="uint8")

    stop_masks = []
    # loop over the unique components
    for label in np.unique(labels):
        # if this is the background label, ignore it
        if label == 0:
            print("background")
            continue

        # otherwise, construct the label mask and count the
        # number of pixels
        labelMask = np.zeros(output_img.shape, dtype="uint8")
        labelMask[labels == label] = 255
        numPixels = cv2.countNonZero(cv2.cvtColor(labelMask, cv2.COLOR_BGR2GRAY))
        # if the number of pixels in the component is sufficiently
        # large, then add it to our mask of "large blobs"
        if numPixels > 1000:
            stop_masks.append(labelMask)
    cropped_img = None

    if len(stop_masks) > 0:
        stop_mask = stop_masks[0]
        original_img[np.where(stop_mask==0)] = 0

        left = 0
        for i in range(0, original_img.shape[1]):
            if np.sum(original_img[:, i]) > 0:
                left = i
                break
        right = 0
        for j in range(original_img.shape[1] - 1, -1, -1):
            if np.sum(original_img[:, j]) > 0:
                right = j
                break

        top = 0
        for k in range(0, original_img.shape[0]):
            if np.sum(original_img[k, :]) > 0:
                top = k
                break
        bottom = 0
        for l in range(original_img.shape[0] - 1, -1, -1):
            if np.sum(original_img[l, :]) > 0:
                bottom = l
                break

        width = math.floor((right - left) * 0.3)
        width_offset = int(math.floor(width/2))
        height = math.floor((bottom - top) * 0.3)
        height_offset = int(math.floor(height/2))

        top = max(0, top - height_offset)
        bottom = min(bottom + height_offset, original_img.shape[0])
        left = max(left - width_offset, 0)
        right = min(right + width_offset, original_img.shape[1])

        cropped_img = final_img.crop((left, top, right, bottom))
    return cropped_img


def crop_frames(filenames):
    for i, file in enumerate(filenames):
        image = get_crop_sign(file)
        if image:
            image.save("crop" + str(i) + '.bmp')
        else:
            print("No output image")


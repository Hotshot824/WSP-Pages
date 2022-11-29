import numpy as np
import cv2

def create_label(filepath):
    img = cv2.imread(filepath, 0)
    # resize to 224*224
    img = cv2.resize(img, (224, 224))

    # save image
    for i in range(224):
        for j in range(224):
            if img[i][j] < 255:
                img[i][j] = 0

    cv2.imwrite(filepath, img)
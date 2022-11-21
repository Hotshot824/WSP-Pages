import numpy as np
import cv2

import os

if __name__ == '__main__':
    # change pwd
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    img = cv2.imread('./upload/iou_label.png', 0)
    # resize to 224*224
    img = cv2.resize(img, (224, 224))

    # save image
    for i in range(224):
        for j in range(224):
            if img[i][j] < 255:
                img[i][j] = 0

    cv2.imwrite('./upload/iou_label.png', img)

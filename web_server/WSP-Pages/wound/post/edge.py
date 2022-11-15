import cv2;
import numpy as np;
import os
 
def create_edge(path):
    # superposition.png
    img_predict = cv2.imread(path + 'predict_ccl.png')
    img_origin = cv2.imread(path + 'upload/original.png')
    output = cv2.addWeighted(img_origin, 0.9, img_predict, 1,0)
    cv2.imwrite(path + 'superposition.png',output)
    
    # edge.png
    img_edge = cv2.Canny(image=img_predict, threshold1=0, threshold2=255)
    img_edge = cv2.cvtColor(img_edge, cv2.COLOR_GRAY2BGR)
    cv2.imwrite(path + 'edge.png',img_edge)

    # overlay.png
    output = cv2.addWeighted(img_origin, 0.9, img_edge, 1,0)
    cv2.imwrite(path + 'overlay.png',output)
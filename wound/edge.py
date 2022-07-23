#! /home/wsout/.conda/envs/tens-1.5/bin/python
# -*- coding: utf-8 -*-
"""
Created on Tue Feb 22 16:41:55 2022

@author: User
"""

import cv2;
import numpy as np;
import os
 
# Change pwd
os.chdir(os.path.dirname(os.path.abspath(__file__)))

############## superposition.png ########################

img_predict = cv2.imread('./upload/111.png')
img_origin = cv2.imread('./upload/test/images/111.png')

output = cv2.addWeighted(img_origin, 0.9, img_predict, 1,0)

cv2.imwrite('./upload/superposition.png',output)


############## edge.png ########################

img_edge = cv2.Canny(image=img_predict, threshold1=0, threshold2=255)

img_edge = cv2.cvtColor(img_edge, cv2.COLOR_GRAY2BGR)


cv2.imwrite('./upload/edge.png',img_edge)

############## overlay.png ########################

output = cv2.addWeighted(img_origin, 0.9, img_edge, 1,0)
cv2.imwrite('./upload/overlay.png',output)
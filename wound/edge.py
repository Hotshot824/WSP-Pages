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
 
img1=cv2.imread('./upload/test/images/111.png')
img2=cv2.imread('./upload/111.png')


dst=cv2.addWeighted(img1,0.9,img2,0.7,0)
cv2.imwrite('./upload/superposition.png', dst)

image = img2
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
blurred = cv2.GaussianBlur(gray, (5, 5), 0)
canny = cv2.Canny(blurred, 30, 150)

cv2.imwrite('./upload/uploadedge.png', canny)
im = cv2.imread('./upload/uploadedge.png')

dst=cv2.addWeighted(img1,0.9,im,0.7,0) #time()
#a="2022330"
#str="C:/AppServ/www/uploadsample/Wound-Segmentation-Pages-main/upload/edge.png"
cv2.imwrite('./upload/edge.png', dst)


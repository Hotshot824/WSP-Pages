#! /home/wsout/.conda/envs/tens-1.5/bin/python
# -*- coding: utf-8 -*-
import numpy as np
import cv2

import os

# Change pwd
os.chdir(os.path.dirname(os.path.abspath(__file__)))
       
img = cv2.imread('./upload/1111.png', 0)

print(img)

# 修改大小
img = cv2.resize(img, (224, 224))  # 將大小修改成224*224

# 儲存圖片


for i in range(224) :
    for j in range(224):
        if img[i][j]<255:
            img[i][j]=0
            
cv2.imwrite('./upload/1111.png', img)

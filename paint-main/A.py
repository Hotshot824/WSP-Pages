#! /home/wsout/.conda/envs/tens-1.5/bin/python
# -*- coding: utf-8 -*-
import numpy as np
import cv2
import os
import sys

#os.chdir(os.path.dirname(os.path.abspath(__file__)))
def pixelcount():
    imga = cv2.imread('upload/123.png', 0)
    acount=0
    for i in range(224):
        for j in range(224):
            if imga[i][j]>0:
                acount=acount+1
    return acount    

    
def a(pixel): 
               
    imga = cv2.imread('upload/123.png', 0)

    #imgc = cv2.imread('upload/1111.png', 0)

    print("Test!")


    #print(iou(imgb,imgd)*100)                      
    #加载背景图片

    #在圖片上添加文字
    pixel = float(pixel)
    
    num=pixelcount()*pixel
    
    num = round(num,2)
    
    
     
    strr="area="+str(num)+"cm^2"
    
    cv2.putText(imga,strr, (1,50), cv2.FONT_HERSHEY_SIMPLEX, 
    0.7,(255,255,255), 1, cv2.LINE_AA)

    #保存圖片
    cv2.imwrite("upload/111context.png",imga)



if __name__ == "__main__":  
    a(pixel=sys.argv[1])
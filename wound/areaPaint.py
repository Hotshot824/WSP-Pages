#! /home/wsout/.conda/envs/tens-1.5/bin/python
# -*- coding: utf-8 -*-
import numpy as np
import cv2
import os
import sys

os.chdir(os.path.dirname(os.path.abspath(__file__)))
def pixelcount():
    imga = cv2.imread('./upload/111.png', 0)
    imgb=imga
    acount=0
    for i in range(len(imga)):
        for j in range(len(imga[0])):
            if imga[i][j]>=254:
                acount=acount+1
                imgb[i][j]=0
    #cv2.imwrite("upload/test.png",imgb)
    print(acount)
    return acount    

    
def a(pixel): 

    imga = cv2.imread('./upload/111.png')

    #imgc = cv2.imread('upload/1111.png', 0)

    print("Test!")


    #print(iou(imgb,imgd)*100)                      
    #加载背景图片

    #在圖片上添加文字
    #f.write(pixel+"\n")
    pixel = float(pixel)
    
    num=pixelcount()*pixel*pixel
    #f.write('%f' %num)
    print(num)
    num = round(num,2)   
    print(num)
    strr="area="+str(num)+"cm^2"
    #f.write("\n"+strr)
    ratex= int(len(imga[0])/224)
    ratey= int(len(imga)/224)
    avg= int((ratex+ratey)/2)
    
    cv2.putText(imga,strr, (1*ratex,50*ratey), cv2.FONT_HERSHEY_SIMPLEX, 
    0.7*avg,(255,255,255), 1*avg, cv2.LINE_AA)

    #保存圖片
    cv2.imwrite("./upload/paintArea.png",imga)



if __name__ == "__main__":  
    a(pixel=sys.argv[1])
import numpy as np
import cv2

import os

def iou( imga ,imgb ):
    acount,bcount,abcount=0,0,0
    for i in range(224):
        for j in range(224):
            if imga[i][j]>0:
                acount=acount+1
            if imgb[i][j]>0:
                bcount=bcount+1              
            if imga[i][j]>0 and imgb[i][j]>0: 
                abcount=abcount+1
       
    a= acount + bcount - abcount 
    return abcount/a

# Change pwd
os.chdir(os.path.dirname(os.path.abspath(__file__)))
           
imga = cv2.imread('./upload/predict_ccl.png', 0)

imgc = cv2.imread('./upload/iou_label.png', 0)

print(iou(imga, imgc)*100)
#print(iou(imgb,imgd)*100)                      
#加载背景图片

#在圖片上添加文字
str="iou= "+str(round(iou(imga,imgc)*100,4))
cv2.putText(imgc,str, (1,50), cv2.FONT_HERSHEY_SIMPLEX, 
0.7,(255,255,255), 1, cv2.LINE_AA)

#保存圖片
cv2.imwrite("./upload/iou_result.png",imgc)


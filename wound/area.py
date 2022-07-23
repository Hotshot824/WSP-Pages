import cv2
import matplotlib.pyplot as plt
import numpy as np

img = cv2.imread(r"C:\AppServ\www\uploadsample\Wound-Segmentation-Pages-main\draw\upload\test.png" )#讀入圖片自動轉成array
#轉換為HSV及RGB 任選一種
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV) #HSV
rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)




count=0
a=0
r,c,s=img.shape
for i in range(r):
  for j in range(c):
    if (rgb[i][j]==[155,255,205]).all():
       count=count+1
       
    if (rgb[i][j]==[255,255,255]).all():
       a=a+1
       

rate=5.309/count
area=a*rate
imga = cv2.imread(r'C:\AppServ\www\uploadsample\Wound-Segmentation-Pages-main\upload\111.png', 0)

str= str(area)+'cm^2'
cv2.putText(imga,str, (1,50), cv2.FONT_HERSHEY_SIMPLEX, 
0.7,(255,255,255), 1, cv2.LINE_AA)

#保存圖片
cv2.imwrite(r"C:\AppServ\www\uploadsample\Wound-Segmentation-Pages-main\upload\area.png",imga)


print(str)


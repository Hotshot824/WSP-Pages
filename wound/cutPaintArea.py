#! /home/wsout/.conda/envs/tens-1.5/bin/python
# -*- coding: utf-8 -*-
import numpy as np
import cv2
import os
import sys
import math

#os.chdir(os.path.dirname(os.path.abspath(__file__)))
def pixelcount():
    imga = cv2.imread('./upload/111.png',0)
    imgb=imga
    acount=0
    for i in range(len(imga)):
        for j in range(len(imga[0])):
            if imga[i][j]>=254:
                acount=acount+1
                imgb[i][j]=0
    cv2.imwrite("./upload/test.png",imgb)
    print(acount)
    print(len(imga))
    print(len(imga[0]))
    return acount 

def check():
  imga = cv2.imread('./upload/test/images/111.png')
  a=len(imga)
  b=len(imga[0])
  if a > 224 or b > 224:
    img = cv2.resize(imga, (224, 224))  # 將大小修改成224*224
    cv2.imwrite('./upload/test/images/111.png', img)

def truncate(num, n):
    integer = int(num * (10**n))/(10**n)
    return float(integer)
    
def a(x, y, length, originx, originy, after_cut_x=0, after_cut_y=0): 
    imga = cv2.imread('./upload/test/images/111.png')
    label = cv2.imread('./upload/test/labels/label.png')
    print("Test!")

    
    f = open("111.txt",'w')
    f.write("比例尺的x = " + x +"\n")
    f.write("比例尺的y = " + y +"\n")
    f.write("用戶輸入的長 = " + length + "\n")
    
    f.write("原圖的x = " + originx +"\n")
    f.write("原圖的y = " + originy +"\n")
    if after_cut_x != 0:
        f.write("裁切後的x = " + after_cut_x + "\n")
        f.write("裁切後的y = " + after_cut_y)
    else:
        f.write("裁切後的x = " + '0' + "\n")
        f.write("裁切後的y = " + '0')
    
    f.close()
    x=int(x)
    y=int(y)
    length=int(length)
    originx=int(originx)
    originy=int(originy)
    
    if after_cut_x==0 or after_cut_y==0:
        if originx >=224: 
          x=x*(224/originx)
        if originy >=224: 
          y=y*(224/originy)
    else:
        after_cut_x=int(after_cut_x) 
        after_cut_y=int(after_cut_y)
        if after_cut_x >=224: 
           x=x*(224/after_cut_x)
        if after_cut_y >=224: 
           y=y*(224/after_cut_y)
            
    check()#resize if > 224
    num=0
    num=float(num)
   
    
    #小於224的情況
    if  len(imga)<224 or len(imga[0])<224:
        for i in range(len(imga)):
          for j in range(len(imga[0])):
            label[i][j]=imga[i][j]
        cv2.imwrite('./upload/test/labels/label.png',label)
    
    num=math.sqrt(x**2+y**2)  
    num=length/num#此時為比例尺，依照縮放比例調整
    #在圖片上添加文字
    pixel = num
    num=pixelcount()*pixel*pixel   
    #num=truncate(num, 4) 
    num=round(num,4)   
    strr="area="+str(num)+"cm^2"
    if len(imga[0])<224 or len(imga)<224:
        ratex,ratey,avg=1,1,1
    else:
        ratex= int(len(imga[0])/224)
        ratey= int(len(imga)/224)
        avg= int((ratex+ratey)/2)
        
    print(avg)
    cv2.putText(imga,strr, (1*ratex,50*ratey), cv2.FONT_HERSHEY_SIMPLEX, 
    0.7*avg,(0,0,0), 1*avg, cv2.LINE_AA)
    
    #保存圖片
    cv2.imwrite("./upload/111context.png",imga)
    
if __name__ == "__main__": 
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    if len(sys.argv) == 8: 
        a(x = sys.argv[1], y = sys.argv[2], length = sys.argv[3],
          originx = sys.argv[4], originy = sys.argv[5],
          after_cut_x = sys.argv[6], after_cut_y = sys.argv[7])
    if len(sys.argv) == 6: 
        a(x = sys.argv[1], y = sys.argv[2], length = sys.argv[3],
          originx = sys.argv[4], originy = sys.argv[5])
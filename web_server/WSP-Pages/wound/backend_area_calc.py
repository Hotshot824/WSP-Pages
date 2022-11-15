import numpy as np
import cv2
import os
import sys
import math

#os.chdir(os.path.dirname(os.path.abspath(__file__)))
def pixelcount():
    imga = cv2.imread('./upload/predict_ccl.png',0)
    acount = np.where(imga == 255)
    acount = acount[0].size
    print(acount)
    return acount 


    
def area(x, y, length, originx, originy, after_cut_x=0, after_cut_y=0): 
    imga = cv2.imread('./upload/test/images/original.png')
    label = cv2.imread('./upload/test/labels/label.png')
    print("Test!")

    
    f = open("./upload/scale.txt",'w')
    f.write("scale x = " + x +"\n")
    f.write("scale y = " + y +"\n")
    f.write("user enter lenght = " + length + "\n")
    f.write("oringnal image x = " + originx +"\n")
    f.write("oringnal image y = " + originy +"\n")
    if after_cut_x != 0:
        f.write("after cut x = " + after_cut_x + "\n")
        f.write("after cut y = " + after_cut_y)
    else:
        f.write("after cut x = " + '0' + "\n")
        f.write("after cut y = " + '0')
    
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
            
    num=0
    num=float(num)
   
    
    num=math.sqrt(x**2+y**2)  
    #此時為比例尺，依照縮放比例調整
    num=length/num

    #在圖片上添加文字
    pixel = num
    num=pixelcount()*pixel*pixel    
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

    # save image
    cv2.imwrite("./upload/area.png",imga)
    
if __name__ == "__main__": 
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    if len(sys.argv) == 8: 
        area(x = sys.argv[1], y = sys.argv[2], length = sys.argv[3],
          originx = sys.argv[4], originy = sys.argv[5],
          after_cut_x = sys.argv[6], after_cut_y = sys.argv[7])
    if len(sys.argv) == 6: 
        a(x = sys.argv[1], y = sys.argv[2], length = sys.argv[3],
          originx = sys.argv[4], originy = sys.argv[5])
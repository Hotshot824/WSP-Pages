import numpy as np
import cv2, os, argparse

import post_processing.creatlabel as cl

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


if __name__ == '__main__':
    # Change pwd
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    # get parser
    parser = argparse.ArgumentParser(description='Use two images compare difference for iou.')
    parser.add_argument('path', type=str, default='./upload/',
                        help='IOU images path. (default ./upload/)')
    args = parser.parse_args()
    result_path = args.path

    imga = cv2.imread(result_path + 'predict_ccl.png', 0)
    imgc = cv2.imread(result_path + 'iou_label.png', 0)

    print(iou(imga, imgc)*100)
    # print(iou(imgb,imgd)*100)                      

    # write text on images 
    str="iou= "+str(round(iou(imga,imgc)*100,4))
    cv2.putText(imgc,str, (1,50), cv2.FONT_HERSHEY_SIMPLEX, 
    0.7,(255,255,255), 1, cv2.LINE_AA)

    # save images
    cv2.imwrite(result_path + "iou_result.png",imgc)
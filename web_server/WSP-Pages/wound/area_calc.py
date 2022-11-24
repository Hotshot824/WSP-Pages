import numpy as np
import cv2
import os
import sys
import math

def pixelcount(path):
    imga = cv2.imread(path + 'predict_ccl.png', 0)
    acount = np.where(imga == 255)
    acount = acount[0].size
    return acount


def area(x, y, length, originx, originy, path, after_cut_x=0, after_cut_y=0):
    imga = cv2.imread(path + 'upload/original.png')
    # label = cv2.imread(path + 'original.png')

    f = open(path + "scale.txt", 'w')
    f.write("scale x = " + x + "\n")
    f.write("scale y = " + y + "\n")
    f.write("user enter lenght = " + length + "\n")
    f.write("original image x = " + originx + "\n")
    f.write("original image y = " + originy + "\n")
    if after_cut_x != 0:
        f.write("after cut x = " + after_cut_x + "\n")
        f.write("after cut y = " + after_cut_y)
    else:
        f.write("after cut x = " + '0' + "\n")
        f.write("after cut y = " + '0')

    f.close()
    x = int(x)
    y = int(y)
    length = float(length)
    originx = int(originx)
    originy = int(originy)

    if after_cut_x == 0 or after_cut_y == 0:
        if originx >= 512:
            x = x*(512/originx)
        if originy >= 512:
            y = y*(512/originy)
    else:
        after_cut_x = int(after_cut_x)
        after_cut_y = int(after_cut_y)
        if after_cut_x >= 512:
            x = x*(512/after_cut_x)
        if after_cut_y >= 512:
            y = y*(512/after_cut_y)

    num = 0
    num = float(num)

    num = math.sqrt(x**2+y**2)
    # this time is scale, adjust to scale
    num = length/num

    # add text on image.
    pixel = num
    num = pixelcount(path)*pixel*pixel
    num = round(num, 2)
    print(str(num))
    strr = "Area = "+str(num)+"cm^2"
    if len(imga[0]) < 512 or len(imga) < 512:
        ratex, ratey, avg = 1, 1, 1
    else:
        ratex = int(len(imga[0])/512)
        ratey = int(len(imga)/512)
        avg = int((ratex+ratey)/2)

    cv2.putText(imga, strr, (1*ratex, 50*ratey), cv2.FONT_HERSHEY_SIMPLEX,
                1.4*avg, (0, 0, 0), 1*avg, cv2.LINE_AA)

    # save image
    cv2.imwrite(path + "area.png", imga)


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    if len(sys.argv) == 9:
        area(x=sys.argv[1], y=sys.argv[2], length=sys.argv[3],
             originx=sys.argv[4], originy=sys.argv[5],
             after_cut_x=sys.argv[6], after_cut_y=sys.argv[7], path=sys.argv[8])
    if len(sys.argv) == 7:
        area(x=sys.argv[1], y=sys.argv[2], length=sys.argv[3],
             originx=sys.argv[4], originy=sys.argv[5], path=sys.argv[6])

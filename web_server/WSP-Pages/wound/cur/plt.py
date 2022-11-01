import matplotlib.pyplot as plt
from matplotlib.pyplot import MultipleLocator
import numpy as np
import os
import sys

# 創建數據
def draw(value):
    x = eval(value[1])
    y = eval(value[2])

    fig = plt.figure()
    plt.plot(x,y,"-ok")

    plt.xlabel("Date")
    plt.ylabel("Wound Area")
    plt.title("Wound Area and Date")
    plt.grid()#畫網格線
    x_major_locator = MultipleLocator(1)
    y_major_locator = MultipleLocator(1)
    ax=plt.gca()
    ax.xaxis.set_major_locator(x_major_locator)
    ax.yaxis.set_major_locator(y_major_locator)
    plt.xlim(1,31)
    plt.ylim(0,15)
    fig.savefig(r'C:\Users\User\Desktop\test\plot.png', dpi=fig.dpi)
    plt.show()

# python plt.py [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30] [10,10,12,12.2,12,12,12,12,12.3,11,10,9,8.6,8,8,8,7,7,6,6,6,6.2,6,6,5,4,3,2,1,0]
if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    draw(value = sys.argv)
import cv2
import numpy as np

height = 224
width = 224
img = np.zeros((height,width,3), np.uint8)

cv2.imshow("a",img)
cv2.waitKey()
cv2.destroyAllWindows()
#cv2.imwrite('./upload/test/labels/111.png', img)

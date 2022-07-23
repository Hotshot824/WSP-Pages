import os
import cv2
import numpy as np


from PIL import Image
from CCL_reverse import connected_component_labelling, neighbouring_labels, image_to_2d_bool_array_reverse
from ccl import image_to_2d_bool_array
labels = set()

labels.add(1)
print(labels)
if not labels:
    print("hi")
else:
    print("s")
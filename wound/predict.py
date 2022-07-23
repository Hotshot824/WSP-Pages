#! /home/wsout/.conda/envs/tens-2.6/bin/python
# -*- coding: utf-8 -*-
import os
import cv2
import numpy as np
import time

from keras.models import load_model
from keras.utils.generic_utils import CustomObjectScope

from models.unets import Unet2D
from models.deeplab import Deeplabv3, relu6, BilinearUpsampling, DepthwiseConv2D
from models.FCN import FCN_Vgg16_16s

from utils.learning.metrics import dice_coef, precision, recall
from utils.BilinearUpSampling import BilinearUpSampling2D
from utils.io.data import load_data, save_results, save_rgb_results, save_history, load_test_images, DataGen


from PIL import Image
from CCL_reverse import connected_component_labelling, neighbouring_labels, image_to_2d_bool_array_reverse
from ccl import image_to_2d_bool_array


def check():
   imga = cv2.imread('upload/test/images/111.png')
   a=len(imga)
   b=len(imga[0])
   if a != 224 or b != 224:
    img = cv2.resize(imga, (224, 224))  # 將大小修改成224*224
    cv2.imwrite('upload/test/images/111.png', img)
    
# Change pwd
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# settings
input_dim_x = 224
input_dim_y = 224
color_space = 'rgb'
path = './upload/'

#weight_file_name = 'test.h5'


check()

w=['0028_SegNet.hdf5','0060_FCN_Vgg16_16.hdf5','0478_unet_model_yuanqing.hdf5','3608_MobilenetV2.hdf5']
weight_file_name='3527_MobilenetV2.hdf5'

data_gen = DataGen(path, split_ratio=0.0, x=input_dim_x, y=input_dim_y, color_space=color_space)

x_test, test_label_filenames_list = load_test_images(path)


# ### get mobilenetv2 model
#model = Deeplabv3(input_shape=(input_dim_x, input_dim_y, 3), classes=1)

model = load_model( weight_file_name
            , custom_objects={'recall':recall,
                              'precision':precision,
                              'dice_coef': dice_coef,
                              'relu6':relu6,
                              'DepthwiseConv2D':DepthwiseConv2D,
                              'BilinearUpsampling':BilinearUpsampling})

for image_batch, label_batch in data_gen.generate_data(batch_size=len(x_test), test=True):
    ##print(image_batch)
    prediction = model.predict(image_batch, verbose=1)
    save_results(prediction, 'rgb', path , test_label_filenames_list)
    break

################## 圖片後處理  #################

image_path = './upload/111.png'


################## 圖片二值化  #################

img = cv2.imread(image_path)  

output = cv2.threshold(img, 50, 255, cv2.THRESH_BINARY)
output = cv2.cvtColor(output[1], cv2.COLOR_BGR2GRAY)


cv2.imwrite(image_path, output)


################# 圖片Noise, hole處理 #################

CONNECTIVITY_8 = 8


################# 圖片hole處理 ############## 


contours, hierarchy = cv2.findContours(output, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

output = cv2.drawContours(output,contours,-1,(255,255,255),-1)


################# 圖片noise處理 ##############          
     
output = connected_component_labelling(output, CONNECTIVITY_8)
output = np.uint8(output)


key, counts = np.unique(output, return_counts=True)

for x in key:
    if(counts[x]<=127):        
        output[output == key[x]] = 0
    elif(key[x] != 0):
        output[output == key[x]] = 255    

  
cv2.imwrite('./upload/111.png',output)
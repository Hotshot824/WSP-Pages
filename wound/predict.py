#! /home/wsout/.conda/envs/tens-1.5/bin/python
# -*- coding: utf-8 -*-
import os

import cv2
from keras.models import load_model
from keras.utils.generic_utils import CustomObjectScope

from models.unets import Unet2D
#from models.separable_unet import Separable_Unet2D
from models.deeplab import Deeplabv3, relu6, BilinearUpsampling, DepthwiseConv2D
from models.FCN import FCN_Vgg16_16s

from utils.learning.metrics import dice_coef
from utils.BilinearUpSampling import BilinearUpSampling2D
from utils.io.data import load_data, save_results, save_rgb_results, save_history, load_test_images, DataGen


# Change pwd
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# settings
input_dim_x = 224
input_dim_y = 224
color_space = 'rgb'
#path = 'C:/Users/User/wound-segmentation-master/data/Medetec_foot_ulcer_224/'
path = './upload/'
#path = 'C:/AppServ/www/uploadsample/uploadtest/Medetec_foot_ulcer_224/'

weight_file_name = '2019-12-20 00:42:06.275732.hdf5'
pred_save_path = '2019-12-20 00:42:06.275732/'

data_gen = DataGen(path, split_ratio=0.0, 
                   x=input_dim_x, 
                   y=input_dim_y, 
                   color_space=color_space)

x_test, test_label_filenames_list = load_test_images(path)


#model = Deeplabv3(input_shape=(input_dim_x, input_dim_y, 3), classes=1)
model = load_model('test_model.h5', custom_objects={'dice_coef': dice_coef,
                                                    'relu6':relu6,
                                                    'DepthwiseConv2D':DepthwiseConv2D,
                                                    'BilinearUpsampling':BilinearUpsampling})

for image_batch, label_batch in data_gen.generate_data(batch_size=len(x_test), test=True):
    prediction = model.predict(image_batch, verbose=1)

    save_results(prediction, 'rgb','./upload/', test_label_filenames_list)
    break

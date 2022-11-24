#! /home/wsp/.conda/envs/wsp/bin/python
# -*- coding: utf-8 -*-
import os
import cv2
import numpy as np
import time
import argparse
# test

from keras.models import load_model
from keras.utils.generic_utils import CustomObjectScope

from models.unets import Unet2D
from models.deeplab import Deeplabv3, relu6, BilinearUpsampling, DepthwiseConv2D
from models.FCN import FCN_Vgg16_16s

from utils.learning.metrics import dice_coef, precision, recall
from utils.BilinearUpSampling import BilinearUpSampling2D
from utils.io.data import load_data, save_results, save_rgb_results, save_history, load_test_images, DataGen


from PIL import Image
from ccl_reverse import connected_component_labelling, neighbouring_labels, image_to_2d_bool_array_reverse
from ccl import image_to_2d_bool_array


    
def modify_intensity(img): 
    contrast = 200
    brightness = 70
    img = img * (contrast/127 + 1) - contrast + brightness # 轉換公式
    # 轉換公式參考 https://stackoverflow.com/questions/50474302/how-do-i-adjust-brightness-contrast-and-vibrance-with-opencv-python

    # 調整後的數值大多為浮點數，且可能會小於 0 或大於 255
    # 為了保持像素色彩區間為 0～255 的整數，所以再使用 np.clip() 和 np.uint8() 進行轉換
    img = np.clip(img, 0, 255)
    img = np.uint8(img)   
    return img
    
def check():
    
    file_pathname='./upload/test/images'
    for filename in os.listdir(file_pathname):
        imga = cv2.imread(file_pathname+'/'+filename)    
        a = len(imga)
        b = len(imga[0])       
        if a != 512 or b != 512:
            img = cv2.resize(imga, (512, 512))  # 將大小修改成512*512
            cv2.imwrite(file_pathname+'/'+filename, img) 
            
    file_pathname='./upload/test/labels/'        
    for filename in os.listdir(file_pathname):
        imgb = cv2.imread(file_pathname+'/'+filename)        
        c = len(imgb)
        d = len(imgb[0])
        if c != 512 or d != 512:
            img = cv2.resize(imgb, (512, 512))  # 將大小修改成512*512
            cv2.imwrite(file_pathname+'/'+filename, img)
    ################## 亮度調整和對比  #################
    file_pathname='./upload/test/images'
    for filename in os.listdir(file_pathname):
        img = cv2.imread(file_pathname+'/'+filename)        
        img = modify_intensity(img)
        cv2.imwrite(file_pathname+'/'+filename, img)
        
        
def predict_img(file_pathname):
    count=0
    for filename in os.listdir(file_pathname): 
        img = cv2.imread(file_pathname+'/'+filename)
        ################## 圖片後處理  #################
        
        ################## 圖片二值化  #################

        cv2.imwrite(file_pathname+str(count)+'original'+filename,img)
        
        output = cv2.threshold(img, 70, 255, cv2.THRESH_BINARY)
        output = cv2.cvtColor(output[1], cv2.COLOR_BGR2GRAY)

        cv2.imwrite(file_pathname+str(count)+filename, output)
        cv2.imwrite(file_pathname+str(count)+'Threshold'+filename,output)
        ################# 圖片Noise, hole處理 #################

        CONNECTIVITY_8 = 8

        ################# 圖片hole處理 ##############

        contours, hierarchy = cv2.findContours(
            output, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        output = cv2.drawContours(output, contours, -1, (255, 255, 255), -1)
        cv2.imwrite(file_pathname+str(count)+'hole'+filename,output)
        ################# 圖片noise處理 ##############

        output = connected_component_labelling(output, CONNECTIVITY_8)
        output = np.uint8(output)

        key, counts = np.unique(output, return_counts=True)

        for x in key:
            if (counts[x] <= 127):
                output[output == key[x]] = 0
            elif (key[x] != 0):
                output[output == key[x]] = 255

        cv2.imwrite(file_pathname+str(count)+'predict_ccl'+filename, output)
        count=count+1 

if __name__ == '__main__':

    # Change pwd
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    # settings
    input_dim_x = 512
    input_dim_y = 512
    color_space = 'rgb'
    path = './upload/'

    #weight_file_name = 'test.h5'

    check()

   
    weight_file_name = '4185_MobilenetV2.hdf5'
    #weight_file_name = '3527_MobilenetV2.hdf5'
    #weight_file_name = '0000_unet_model_yuanqing.hdf5'
    data_gen = DataGen(path, split_ratio=0.0, x=input_dim_x,
                       y=input_dim_y, color_space=color_space)

    x_test, test_label_filenames_list = load_test_images(path)

    # ### get mobilenetv2 model
    #model = Deeplabv3(input_shape=(input_dim_x, input_dim_y, 3), classes=1)

    model = load_model(weight_file_name, custom_objects={'recall': recall,
                                                         'precision': precision,
                                                         'dice_coef': dice_coef,
                                                         'relu6': relu6,
                                                         'DepthwiseConv2D': DepthwiseConv2D,
                                                         'BilinearUpsampling': BilinearUpsampling})

    for image_batch, label_batch in data_gen.generate_data(batch_size=len(x_test), test=True):
        print(len(x_test))
        prediction = model.predict(image_batch, verbose=1)
        save_results(prediction, 'rgb', './upload/predictions/', test_label_filenames_list)
        break

    predict_img('./upload/predictions/')

import os, time, argparse
import cv2
import numpy as np
import post_processing.edge as edge

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

def modify_lightness_saturation(img):

    # 圖像歸一化，且轉換為浮點型
    fImg = img.astype(np.float32)
    fImg = fImg / 255.0
    
    # 顏色空間轉換 BGR -> HLS
    hlsImg = cv2.cvtColor(fImg, cv2.COLOR_BGR2HLS)
    hlsCopy = np.copy(hlsImg)

    lightness = 0 # lightness 調整為  "1 +/- 幾 %"
    saturation = 300 # saturation 調整為 "1 +/- 幾 %"
 
    # 亮度調整
    hlsCopy[:, :, 1] = (1 + lightness / 100.0) * hlsCopy[:, :, 1]
    hlsCopy[:, :, 1][hlsCopy[:, :, 1] > 1] = 1  # 應該要介於 0~1，計算出來超過1 = 1

    # 飽和度調整
    hlsCopy[:, :, 2] = (1 + saturation / 100.0) * hlsCopy[:, :, 2]
    hlsCopy[:, :, 2][hlsCopy[:, :, 2] > 1] = 1  # 應該要介於 0~1，計算出來超過1 = 1
    
    # 顏色空間反轉換 HLS -> BGR 
    result_img = cv2.cvtColor(hlsCopy, cv2.COLOR_HLS2BGR)
    result_img = ((result_img * 255).astype(np.uint8))

    return result_img


def modify_intensity(img): 
    contrast = 100
    brightness = 20
    img = img * (contrast/127 + 1) - contrast + brightness 
    # 轉換公式
    # 轉換公式參考 https://stackoverflow.com/questions/50474302/how-do-i-adjust-brightness-contrast-and-vibrance-with-opencv-python

    # 調整後的數值大多為浮點數，且可能會小於 0 或大於 255
    # 為了保持像素色彩區間為 0～255 的整數，所以再使用 np.clip() 和 np.uint8() 進行轉換
    img = np.clip(img, 0, 255)
    img = np.uint8(img)   
    return img

def check(path):
    filepath = path + 'original.png'
    imga = cv2.imread(filepath)
    a=len(imga)
    b=len(imga[0])
    if a != 224 or b != 224:
        #original image resize to 224*224
        img = cv2.resize(imga, (224, 224))  
        cv2.imwrite(filepath, img)

    # 亮度調整和對比
    file_pathname = path
    for filename in os.listdir(file_pathname):
        img = cv2.imread(file_pathname+'/'+filename)        
        img = modify_intensity(img)
        #img = modify_lightness_saturation(img)
        cv2.imwrite(file_pathname+'/'+filename, img)

if __name__ == '__main__':
    # change pwd
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    # get parser
    parser = argparse.ArgumentParser(description='Predict wound image and output result.')
    parser.add_argument('path', type=str, default='./upload/',
                        help='Oringnal image for predcit. (default ./upload/)')
    args = parser.parse_args()
    oringnal_image_path = args.path

    # settings
    input_dim_x = 224
    input_dim_y = 224
    color_space = 'rgb'
    path = './upload/'

    check(oringnal_image_path + "upload/")

    w=['0028_SegNet.hdf5','0060_FCN_Vgg16_16.hdf5','0478_unet_model_yuanqing.hdf5','3608_MobilenetV2.hdf5']

    # weight_file_name = 'test.h5'
    weight_file_name='3747_MobilenetV2.hdf5'

    data_gen = DataGen(path, split_ratio=0.0, x=input_dim_x, y=input_dim_y, color_space=color_space, in_path=oringnal_image_path + "upload/")

    x_test, test_label_filenames_list = load_test_images(path)

    # get mobilenetv2 model
    # model = Deeplabv3(input_shape=(input_dim_x, input_dim_y, 3), classes=1)

    model = load_model( weight_file_name
                , custom_objects={'recall':recall,
                                'precision':precision,
                                'dice_coef': dice_coef,
                                'relu6':relu6,
                                'DepthwiseConv2D':DepthwiseConv2D,
                                'BilinearUpsampling':BilinearUpsampling})

    for image_batch, label_batch in data_gen.generate_data(batch_size=len(x_test), test=True):
        prediction = model.predict(image_batch, verbose=1)
        save_results(prediction, 'rgb', oringnal_image_path , test_label_filenames_list)
        break

    # image post processing
    image_path = oringnal_image_path + 'original.png'

    # image to binarization
    img = cv2.imread(image_path)  
    output = cv2.threshold(img, 90, 255, cv2.THRESH_BINARY)
    output = cv2.cvtColor(output[1], cv2.COLOR_BGR2GRAY)
    cv2.imwrite(image_path, output)

    # image noise, hole
    CONNECTIVITY_8 = 8

    # hole
    contours, hierarchy = cv2.findContours(output, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    output = cv2.drawContours(output,contours,-1,(255,255,255),-1)
    
    # noise 
    output = connected_component_labelling(output, CONNECTIVITY_8)
    output = np.uint8(output)
    key, counts = np.unique(output, return_counts=True)

    for x in key:
        if(counts[x]<=127):        
            output[output == key[x]] = 0
        elif(key[x] != 0):
            output[output == key[x]] = 255    

    cv2.imwrite(oringnal_image_path + 'predict_ccl.png',output)
    
    edge.create_edge(oringnal_image_path)

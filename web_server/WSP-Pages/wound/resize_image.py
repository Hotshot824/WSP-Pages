import os, time, argparse
import cv2
import numpy as np

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
    contrast = 200
    brightness = 70
    img = img * (contrast/127 + 1) - contrast + brightness 
    # 轉換公式
    # 轉換公式參考 https://stackoverflow.com/questions/50474302/how-do-i-adjust-brightness-contrast-and-vibrance-with-opencv-python

    # 調整後的數值大多為浮點數，且可能會小於 0 或大於 255
    # 為了保持像素色彩區間為 0～255 的整數，所以再使用 np.clip() 和 np.uint8() 進行轉換
    img = np.clip(img, 0, 255)
    img = np.uint8(img)   
    return img

def check(path):
    filepath = path + 'upload/original.png'
    imga = cv2.imread(filepath)
    a=len(imga)
    b=len(imga[0])
    #original image resize to 224*224
    img = cv2.resize(imga, (224, 224))  
    cv2.imwrite(filepath, img)
    cv2.imwrite(path + 'resize_original.png', img)

    # 亮度調整和對比
    file_pathname = path + 'upload/'
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

    check(oringnal_image_path)
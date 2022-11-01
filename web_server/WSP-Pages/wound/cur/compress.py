import cv2
class compress_img:

    def __init__(self,img_path):
        self.img_path = img_path
        self.img_name = img_path.split("/")[-1]

    def compress_img_CV(self, compress_rate = 1, show = False):
        img = cv2.imread(self.img_path)
        heigh, width = img.shape[:2]
        img_resize = cv2.resize(img, ( int(width*compress_rate), int(heigh*compress_rate)),
                 interpolation = cv2.INTER_AREA)
        print(" %s 已壓縮，" % (self.img_name),"壓縮率 ： ",compress_rate)
        cv2.imwrite(self.img_name, img_resize)
        if show:
            cv2.imshow(self.img_name, img_resize)
            cv2.waitkey(0)
if __name__ =='__main__':
    img_path = r'C:\Users\User\Desktop\test\123.jpg'
    compress=compress_img(img_path)
    compress.compress_img_CV()
#! /home/wsout/.conda/envs/tens-2.6/bin/python
# -*- coding: utf-8 -*-

import os
import time

if __name__ == '__main__':

    # Change pwd
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    localtime = time.localtime()
    ostime = time.strftime("%Y-%m-%d_%H%M%S", localtime)

    original = 'original/' + ostime + '_backEnd' + "_original.png"
    predict_result = 'predict/' + ostime + '_backEnd' + "_predict.png"
    area_image = 'area/' + ostime + '_backEnd' + "_area.png"
    scale = 'area/' + ostime + '_backEnd' + "_scale.txt"

    target_path = './upload'
    save_path = '../save/backEndSave/'

    #save scale file
    os.system("cp " + './111.txt ' + save_path + scale)

    #save original image
    os.system("cp " + target_path + '/test/images/111.png ' + save_path + original)

    #save predict image
    os.system("cp " + target_path + '/111.png ' + save_path + predict_result)
    os.system("cp " + target_path + '/111context.png ' + save_path + area_image)
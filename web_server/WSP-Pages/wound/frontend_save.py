#! /home/wsp/.conda/envs/wsp/bin/python
# -*- coding: utf-8 -*-

import os
import time

if __name__ == '__main__':

    # Change pwd
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    localtime = time.localtime()
    ostime = time.strftime("%Y-%m-%d_%H%M%S", localtime)

    original = 'original/' + ostime + '_front_end' + "_original.png"
    predict_result = 'label/' + ostime + '_front_end' + "_label.png"

    target_path = './upload'
    save_path = '../save/frontend_save/'

    #save predict image
    os.system("cp " + target_path + '/frontend_label.png ' + save_path + predict_result)
    os.system("cp " + target_path + '/frontend_original.png ' + save_path + original)
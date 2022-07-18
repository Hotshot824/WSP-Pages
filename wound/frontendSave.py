#! /home/wsout/.conda/envs/tens-2.6/bin/python
# -*- coding: utf-8 -*-

import os
import time

if __name__ == '__main__':

    # Change pwd
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    localtime = time.localtime()
    ostime = time.strftime("%Y-%m-%d_%H%M%S", localtime)

    original = ostime + '_frontEnd' + "_original.png"
    predict_result = ostime + '_frontEnd' + "_label.png"

    target_path = './upload'
    save_path = '../save/frontEndSave/'

    #save predict image
    os.system("cp " + target_path + '/111.png ' + save_path + predict_result)
    os.system("cp " + target_path + '/1111.png ' + save_path + original)
#! /bin/bash
WD=$(dirname $(readlink -f $0));
cTime=$(date +"%d_%m_%y");
cd ${WD};
sudo tar zcvf '../WSP_'${cTime}'.tar.gz' '../WSP';
scp '../WSP_'${cTime}'.tar.gz' user@140.127.196.150:~/WSP-file/;
rm -rf '../WSP_'${cTime}'.tar.gz';

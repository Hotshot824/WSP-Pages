#! /bin/bash
WD=$(dirname $(readlink -f $0));
cTime=$(date +"%d_%m_%y");
cd ${WD};
sudo tar zcvf '../WSP_'${cTime}'.tar.gz' '../WSP';
scp '../WSP_'${cTime}'.tar.gz' ${ backupServer };
rm -rf '../WSP_'${cTime}'.tar.gz';

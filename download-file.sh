#!/bin/bash
EMAIL=$1
LABEL=$2
PATH_FILE=$3
echo $EMAIL
echo $LABEL
echo $PATH_FILE
mkdir download-file
mkdir download-file/$EMAIL
cp public/upload$PATH_FILE "download-file/$EMAIL/$LABEL"

#2986 	muhammadraffiq@gmail.com 	Resume 	/document/2020/8/user-2986_1598582627659.pdf 	https://seedsjobfairapp.com/public/upload/document/2020/8/user-2986_1598582627659.pdf
#3470 	junyi.yu.1995@gmail.com 	Resume 	/document/2020/8/user-3470_1597649363903.pdf 	https://seedsjobfairapp.com/public/upload/document/2020/8/user-3470_1597649363903.pdf
#3641 	Fathinr123@gmail.com 	CV 	/document/2020/3/user-3641_1584080037787.pdf 	https://seedsjobfairapp.

#  ./download-file.sh muhammadraffiq@gmail.com 	Resume 	/document/2020/8/user-2986_1598582627659.pdfmkd
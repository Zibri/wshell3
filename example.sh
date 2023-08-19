#!/bin/bash
rm -rf log
node server 127.0.0.1:8856 &
ssh -o "StrictHostKeyChecking=no" -R 80:localhost:8856 nokey@localhost.run </dev/null &>log &
yarn &>/dev/null
echo -n "Waiting for host"
while [ "$(grep tunneled log)" == "" ]; do
    echo -n .
    sleep 1
done
echo
hh=$(cat log|grep tunneled|cut -d " " -f 6|tail -1)
echo "alias exit='kill \$PPID'" >~/.bash_aliases
echo "alias url='$qs'" >~/.bash_aliases
node client $hh -L 8856

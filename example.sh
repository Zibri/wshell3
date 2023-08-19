#!/bin/bash
sudo rm -rf /var/run/log/mylog
sudo touch /var/run/log/mylog
sudo chmod 777 /var/run/log/mylog
node server 127.0.0.1:8856 &
ssh -o "StrictHostKeyChecking=no" -R 80:localhost:8856 nokey@localhost.run </dev/null &>>/var/run/log/mylog &
yarn &>/dev/null
echo -n "Waiting for host"
while [ "$(grep tunneled /var/run/log/mylog)" == "" ]; do
    echo -n .
    sleep 1
done
echo
hh=$(cat /var/run/log/mylog|grep tunneled|cut -d " " -f 6|tail -1)
echo "alias exit='kill \$PPID'" >>~/.bash_aliases
echo alias url=\'\$qs\' >>~/.bash_aliases
node client $hh -L 8856

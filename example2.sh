#!/bin/bash
if ! command -v cloudflared &>/dev/null
then
    wget &>/dev/null https://github.com/cloudflare/cloudflared/releases/download/2023.7.3/cloudflared-linux-amd64.deb
    sudo dpkg -i ./cloudflared-linux-amd64.deb
fi
if ! command -v cloudflared &>/dev/null
then
    echo Something went wrong.
    echo Please install cloudflared.
    exit 1
fi
rm -rf log
node server 127.0.0.1:8856 &
yarn &>/dev/null
sudo cloudflared tunnel --no-chunked-encoding --no-tls-verify --no-autoupdate --url http://localhost:8856 &>log &
echo -n "Waiting for host"
while [ "$(grep https log|grep trycl|cut -d" " -f 5)" == "" ]; do
    echo -n .
    sleep 1
done
echo
hh=$(grep https log|grep trycl|cut -d" " -f 5)
echo -n "Waiting for registration"
while [ "$(grep Registered log)" == "" ]; do
    echo -n .
    sleep 1
done
echo
node client $hh -L 8856

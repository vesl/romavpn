![Logo](https://raw.githubusercontent.com/vesl/romavpn/master/static/img/logo.png)

Required Packages : 
-------------------
* NodeJs 7.x
* lxc -> /usr/share/lxc/templates/lxc-romavpn


Install process : 
-----------------
* brctl addbr br0
* ip addr add 10.1.0.254/24 dev br0
* echo 1 > /proc/sys/net/ipv4/ip_forward 

How it works :
--------------
Soon...

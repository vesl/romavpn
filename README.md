Required Packages : 
-------------------
* NodeJs 7.x
* lxc -> /usr/share/lxc/templates/lxc-romavpn


Install process : 
-----------------
* brctl addbr br0
* ip addr add 10.1.0.254/24 dev br0
* ipforward 1 

LXC-start :
-----------
lxc-create -n test -t romavpn -- --ip 10.1.0.249 --subnet 255.255.255.0 --gateway 10.1.0.254 --dns 10.0.0.253 --share /root/romavpn/openvpn_files
lxc-start -n test

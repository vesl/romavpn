![Logo](https://raw.githubusercontent.com/vesl/romavpn/master/static/img/logo.png)

The purpose of RomanVPN is to connect several lans over a same VPN and using netmap to avoid ip / networks conflict.
Dns is used to mask the new networks or ip which were netmapped. 
I've used LXC instead of Docker because I needed to improve my skills on LXC, but it could work perfectly with Docker (and would be better).

Web interface provide an automation of all actions done by the two lines above. 

Required Packages : 
-------------------
* NodeJs 7.x
* lxc -> /usr/share/lxc/templates/lxc-romavpn


Install process : 
-----------------
* brctl addbr br0
* ip addr add 10.1.0.254/24 dev br0
* echo 1 > /proc/sys/net/ipv4/ip_forward 
* copy lxc-romavpn in /usr/share/lxc/templates
* iptables -t nat -I POSTROUTING -o eth0 -j MASQUERADE

How it works :
--------------
Project is in really good way ... but not finished will probably never. Ask me if you need this solution.

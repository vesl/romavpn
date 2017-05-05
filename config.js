exports.app = {
	port : 80,
	address : '10.0.0.250',
	home : 'static/html/index.html',
	port_io : 3000,
}

exports.log = {
	file : '/var/log/romavpn.log',
}

exports.mongo = {
	uri : 'mongodb://127.0.0.1/romavpndev',
}

exports.lxc = {
	subnet : '255.255.255.0',
	gateway : '10.1.0.254',
	dns : '10.0.0.253',
	share : '/root/romavpn/openvpn_files/',
}
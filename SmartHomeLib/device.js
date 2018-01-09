/*
	Name:		device.js
	Created:	14.11.2016
	Author:		Viktoria Jechsmayr

	Structure for devices
*/

function Device(id, ipAddress, port) {
    this.id = id;
    this.ipAddress = ipAddress;
    this.port = port;
    this.name = "Device #" + id;
    this.subDevices = [];
}

Device.prototype.getId = function () {
    return this.id;
}

Device.prototype.getIpAddress = function () {
    return this.ipAddress;
}

Device.prototype.getPort = function () {
    return this.port;
}

Device.prototype.getName = function () {
    return this.name;
}

Device.prototype.setName = function (name) {
    this.name = name;
}

Device.prototype.getSubDevices = function () {
    return this.subDevices;
}

Device.prototype.getSubDevice = function (id) {
    for (var i = 0; i < this.subDevices.length; i++)
    {
        if (this.subDevices[i].getId() == id)
        {
            return this.subDevices[i];
        }
    }
}

Device.prototype.addSubDevice = function (subDevice) {
    this.subDevices.push(subDevice);
}

Device.prototype.clearSubDevices = function () {
    this.subDevices = [];
}

module.exports = Device;
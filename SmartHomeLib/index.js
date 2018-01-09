/*
	Name:		index.js
	Created:	04.11.2016
	Author:		Viktoria Jechsmayr
*/

var SmartHomeServer = require('./SmartHomeServer.js');
var Device = require('./device.js');
var SubDevice = require('./subDevice.js');

module.exports = {
    createSmartHomeServer: function (address, port, id) {
        return new SmartHomeServer(address, port, id);
    },

    createDevice: function (id, ipAddress, port) {
        return new Device(id, ipAddress, port);
    },

    createSubDevice: function (id, type) {
        return new SubDevice(id, type);
    }
};
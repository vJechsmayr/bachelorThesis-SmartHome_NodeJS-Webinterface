/*
	Name:		SmartHomeServer.js
	Created:	04.11.2016
	Author:		Viktoria Jechsmayr

	Functionality for setting up a SmartHome and communication
*/

var util = require('util');
var dgram = require('dgram');
var EventEmitter = require('events').EventEmitter;
var Device = require('./device.js');
var SubDevice = require('./subDevice.js');
var commandParser = require('./commandParser.js');
var constants = require('./constants.js');

const TIMEOUT = 500;

var getDevice = function (id, devices) {
   
    for (var i = 0; i < devices.length; i++) {
        if (devices[i].getId() == id) {
            return devices[i];
        }
    }
};

/*
 * Constructor to setup a SmartHomeServer with a given ip, port and id
 * used by index.js and app.js
 */
function SmartHomeServer(address, port, id) {
    this.address = address;
    this.port = port;
    this.id = id;

    this.senderDevice = new Device(id);
    this.broadcastDevice = new Device(constants.ids.all, "192.168.0.255", this.port);

    this.server = dgram.createSocket('udp4');

    this.server.on('message', function (message, remote) {
        var command = commandParser.parseCommand(message, remote);
        if (command && command.getReceiver().getId() == this.id) {
            this.emit('commandReceived', command);
        }
    }.bind(this));

    //setBroadcast(true) needed by Linux-based OS
    this.server.bind(this.port, this.address, function () { this.server.setBroadcast(true);}.bind(this));
}

/*
 * Discover-Function to discover all compatible devices which respond to our broadcast-Call
 */
SmartHomeServer.prototype.discover = function (callback) {
    var devices = [];

    var discoverCommand = commandParser.createCommand(this.senderDevice, this.broadcastDevice, constants.commands.discoverRequest);
    var message = discoverCommand.toBuffer();

    var commandReceivedCallback = function (command) {
        if (command.isIdEquals(constants.commands.discoverReply)) {
            devices.push(command.getSender());
        }
    };

    this.on('commandReceived', commandReceivedCallback);

    setTimeout(function () {
        this.removeListener('commandReceived', commandReceivedCallback);
        callback(devices);
    }.bind(this), TIMEOUT);

    // Discover devices
    this.server.send(message, 0, message.length, this.broadcastDevice.getPort(), this.broadcastDevice.getIpAddress());
}

/*
 * 
 */
SmartHomeServer.prototype.getSubDevices = function (device, callback) {
    var subDevices = [];

    var discoverCommand = commandParser.createCommand(this.senderDevice, device, constants.commands.getSubDevicesRequest);
    var message = discoverCommand.toBuffer();

    var commandReceivedCallback = function (command) {
        if (command.isIdEquals(constants.commands.getSubDevicesReply) && command.getSender().getId() == device.getId()) {
            var data = command.getData();
            if (data.length >= 2) {
                var id = data[0];
                var type = data[1];

                subDevices.push(new SubDevice(id, type));
            }
        }
    };

    this.on('commandReceived', commandReceivedCallback);

    setTimeout(function () {
        this.removeListener('commandReceived', commandReceivedCallback);
        callback(device, subDevices);
    }.bind(this), TIMEOUT);

    // Discover devices
    this.server.send(message, 0, message.length, this.broadcastDevice.getPort(), this.broadcastDevice.getIpAddress());
}

/*
 * Read Values for received Devices/SubDevices 
 */
SmartHomeServer.prototype.readValues = function (devices, callback) {

    var commandReceivedCallback = function (command) {
        if (command.isIdEquals(constants.commands.getValueReply)) {

            var device = getDevice(command.getSender().getId(), devices);
            var data = command.getData();
            if (device && data.length >= 2)
            {
                var subDevice = device.getSubDevice(data[0]);

                if (subDevice)
                {
                    subDevice.setValue(commandParser.getValue(subDevice.getType(), data.slice(1)));
                }
            }
        }
    };

    this.on('commandReceived', commandReceivedCallback);

    setTimeout(function () {
        this.removeListener('commandReceived', commandReceivedCallback);
        callback();
    }.bind(this), TIMEOUT);

    for (var i = 0; i < devices.length; i++)
    {
        var subDevices = devices[i].getSubDevices();
        for (var j = 0; j < subDevices.length; j++)
        {
            var command = commandParser.createCommand(this.senderDevice, devices[i], constants.commands.getValueRequest, [subDevices[j].getId()]);
            var message = command.toBuffer();

            this.server.send(message, 0, message.length, this.broadcastDevice.getPort(), this.broadcastDevice.getIpAddress());
        }
    }
};

/*
 * Write Values by Broadcast to a specific SubDevice
 */
SmartHomeServer.prototype.writeValue = function (device, subDevice, value, callback) {

    var command = commandParser.createCommand(this.senderDevice, device, constants.commands.setValueRequest, [subDevice.getId(), value]);
    var message = command.toBuffer();
    var replyReceived = false;

    var commandReceivedCallback = function (command) {
        if (command.isIdEquals(constants.commands.setValueReply) && command.getSender().getId() == device.getId()) {
            
            var data = command.getData();
            if (device && data.length >= 2) {

                if (data[0] == subDevice.getId())
                {
                    subDevice.setValue(commandParser.getValue(subDevice.getType(), data.slice(1)));

                    replyReceived = true;
                    this.removeListener('commandReceived', commandReceivedCallback);
                    callback(subDevice);
                }
            }
        }
    };
    this.on('commandReceived', commandReceivedCallback);

    setTimeout(function () {
        if (!replyReceived)
        {
            this.removeListener('commandReceived', commandReceivedCallback);
            callback(subDevice);
        }
    }.bind(this), TIMEOUT);

    this.server.send(message, 0, message.length, this.broadcastDevice.getPort(), this.broadcastDevice.getIpAddress());
};

util.inherits(SmartHomeServer, EventEmitter);
module.exports = SmartHomeServer;
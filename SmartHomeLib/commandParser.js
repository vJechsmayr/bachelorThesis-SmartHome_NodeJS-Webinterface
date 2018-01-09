/*
	Name:		commandParser.js
	Created:	14.11.2016
	Author:		Viktoria Jechsmayr

	Parses commands and provides Funktions to get Actor- and Sensor-Values
*/

var Device = require('./device.js');
var Command = require('./command.js');
var constants = require('./constants.js');

/**
 * Splits command into senderId, receiverId, CommandId and Data
 */
var parseCommand = function (message, remote) {
    if (message.length < 3) {
        return null;
    }

    var senderId = message.readUInt8(0);
    var receiverId = message.readUInt8(1);
    var commandId = message.readUInt8(2);
    var dataLength = message.length - 3;
    var data = [];

    if (dataLength > 0) {
        for (var i = 3; i < message.length; i++) {
            data.push(message[i]);
        }
    }

    var sender = new Device(senderId, remote.address, remote.port);
    var receiver = new Device(receiverId);

    return new Command(sender, receiver, commandId, data);
};

/**
 * creates new Command 
 */
var createCommand = function (sender, receiver, commandId, data) {
    return new Command(sender, receiver, commandId, data);
}

/**
 * read Actor Value if there was received data (data.length > 0)
 */
var getActorValue = function (data) {
    if (data.length > 0)
    {
        return data[0] != 0;
    }
}

/**
 * read Sensor Value if there was received enough data (data.length >= 4)
 */
var getSensorValue = function (data) {
    if (data.length >= 4)
    {
        return Buffer.from(data, 0, 4).readFloatLE(0);
    }
}

var getValue = function (subDeviceType, data) {
    
    if (subDeviceType == constants.subDeviceTypes.actor)
    {
        return getActorValue(data);
    }

    if (subDeviceType == constants.subDeviceTypes.sensor) {
        return getSensorValue(data);
    }
}

module.exports = {
    parseCommand: parseCommand,
    createCommand: createCommand,
    getValue: getValue
}
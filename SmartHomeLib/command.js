/*
	Name:		command.js
	Created:	14.11.2016
	Author:		Viktoria Jechsmayr

	Provides Structur for Commands to communicate with compatible Devices (Arduino)
*/

function Command(sender, receiver, commandId, data) {
    this.sender = sender;
    this.receiver = receiver;
    this.id = commandId;

    if (data) {
        this.data = data;
    }
    else {
        this.data = [];
    }
}

Command.prototype.getSender = function () {
    return this.sender;
}

Command.prototype.getReceiver = function () {
    return this.receiver;
}

Command.prototype.getId = function () {
    return this.id;
}

Command.prototype.getData = function () {
    return this.data;
}

Command.prototype.isIdEquals = function (otherCommandId) {
    if (this.id === otherCommandId) {
        return true;
    }

    return false;
}

Command.prototype.toBuffer = function () {
    var array = [this.sender.getId(), this.receiver.getId(), this.id];

    if (this.data.length > 0) {
        for (var i = 0; i < this.data.length; i++){
            array.push(this.data[i]);
        }
    }

    return Buffer.from(array);
}

module.exports = Command;
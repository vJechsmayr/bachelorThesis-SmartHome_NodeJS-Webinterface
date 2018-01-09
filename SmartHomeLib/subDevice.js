/*
	Name:		subDevice.js
	Created:	14.11.2016
	Author:		Viktoria Jechsmayr

	Structure for subDevices
*/

function SubDevice(id, type) {
    this.id = id;
    this.type = type;
    this.name = "SubDevice #" + id;
}

SubDevice.prototype.getId = function () {
    return this.id;
}

SubDevice.prototype.getType = function () {
    return this.type;
}

SubDevice.prototype.getName = function () {
    return this.name;
}

SubDevice.prototype.setName = function (name) {
    this.name = name;
}

SubDevice.prototype.getValue = function () {
    if (typeof this.value !== 'undefined')
    {
        return this.value;
    }
}

SubDevice.prototype.setValue = function (value) {
    this.value = value;
}

module.exports = SubDevice;
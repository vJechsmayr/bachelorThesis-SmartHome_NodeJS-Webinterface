/*
	Name:		settingsManager.js
	Created:	29.12.2016
	Author:		Viktoria Jechsmayr

	Functionality for various Settings used in other js-Files
*/

var fs = require('fs');
var smartHomeLib = require('smart-home-lib');

/*
 * Save Devices into the devices.json File 
 */
var saveDevices = function (devices) {
    var json = [];
    for (var i = 0; i < devices.length; i++) {
        var subDevicesJSON = [];
        var subDevices = devices[i].getSubDevices();
        for (var j = 0; j < subDevices.length; j++) {
            subDevicesJSON.push({ id: subDevices[j].getId(), type: subDevices[j].getType(), name: subDevices[j].getName() });
        }
        json.push({ id: devices[i].getId(), name: devices[i].getName(), subDevices: subDevicesJSON });
    }
    fs.writeFileSync("devices.json", JSON.stringify(json));
};

/*
 * Load Devices from the devices.json File and parse it into Devices and SubDevices
 */
var loadDevices = function () {
    if (!fs.existsSync("devices.json")){
        return [];
    }
    var content = fs.readFileSync("devices.json");
    var json = JSON.parse(content);
    var devices = [];

    for (var i = 0; i < json.length; i++) {
        var device = smartHomeLib.createDevice(json[i].id);
        device.setName(json[i].name);

        for (var j = 0; j < json[i].subDevices.length; j++) {
            var subDevice = smartHomeLib.createSubDevice(json[i].subDevices[j].id, json[i].subDevices[j].type);
            subDevice.setName(json[i].subDevices[j].name);
            device.addSubDevice(subDevice);
        }
        devices.push(device);
    }
    return devices;
};

/*
 * Calls the loadDevices-Funktion to return a list of all Devices
 */
var getDevices = function () {
    return loadDevices();
};

/*
 * Returns a Device from a device-List if the device with given id is found in the List
 */
var getDevice = function (id, devices) {
    if (!devices)
    {
        devices = getDevices();
    }

    for (var i = 0; i < devices.length; i++) {
        if (devices[i].getId() == id) {
            return devices[i];
        }
    }
};

/**
 * Add a Device to the Device-List and Save it into devices.json
 */
var addDevice = function (device) {
    var devices = getDevices();
    devices.push(device);
    saveDevices(devices);
}

/*
 * Update the device when Name is changed, save it into devices.json, research for connected SubDevices
 */
var updateDevice = function (device) {
    var devices = getDevices();
    var savedDevice = getDevice(device.getId(),devices);
    if (savedDevice)
    {
        savedDevice.setName(device.getName());
        savedDevice.clearSubDevices();

        var subDevices = device.getSubDevices();
        for (var i = 0; i < subDevices.length; i++)
        {
            savedDevice.addSubDevice(subDevices[i]);
        }
        saveDevices(devices);
    }
}

module.exports = {
    getDevices: getDevices,
    getDevice: getDevice,
    addDevice: addDevice,
    updateDevice: updateDevice
};
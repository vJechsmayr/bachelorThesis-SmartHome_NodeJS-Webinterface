/*
	Name:		deviceSettingsServer.js
	Created:	14.11.2016
	Author:		Viktoria Jechsmayr

	Code for the deviceSettings
*/

var SettingsManager = require('./settingsManager.js');

/**
 * Converts Devices into JSON-Format to send it over the sendResponse-Function
 */
var devicesToJSON = function (devices) {
    var json = [];

    for (var i = 0; i < devices.length; i++) {
        json.push({ id: devices[i].getId(), name: devices[i].getName(), subDevices: [] });
    }

    return json;
}

module.exports = {
    setup: function (app, smartHome, sendResponse) {

        /*
         * Return all known Devices
         */
        app.post('/devices/get', function (req, res) {
            sendResponse(res, true, "", devicesToJSON(SettingsManager.getDevices()));
        });

        /*
         * Discover new Devices found in the local Network
         */
        app.post('/devices/discover', function (req, res) {
            smartHome.discover(function (devices) {
                var result = [];

                for (var i = 0; i < devices.length; i++) {

                    var savedDevice = SettingsManager.getDevice(devices[i].getId());
                    if (!savedDevice) {
                        SettingsManager.addDevice(devices[i]);
                    } else {
                        devices[i].setName(savedDevice.getName());
                    }

                    result.push({
                        id: devices[i].getId(),
                        name: devices[i].getName(),
                        ipAddress: devices[i].getIpAddress()
                    });
                }
                sendResponse(res, true, "", result);
            });
        });

        /*
         * Discover new SubDevices, connected with Devices
         */
        app.post('/devices/discoverSubDevices', function (req, res) {
            var deviceId = req.body.deviceId;

            if (deviceId) {
                var device = SettingsManager.getDevice(deviceId);

                if (device) {
                    smartHome.getSubDevices(device, function (reqDevice, subDevices) {

                        var result = [];
                        var deviceChanged = false;
                        for (var i = 0; i < subDevices.length; i++) {

                            var savedSubDevice = reqDevice.getSubDevice(subDevices[i].getId());
                            if (!savedSubDevice) {
                                reqDevice.addSubDevice(subDevices[i]);
                                deviceChanged = true;
                            } else {
                                subDevices[i].setName(savedSubDevice.getName());
                            }
                            result.push({
                                id: subDevices[i].getId(),
                                type: subDevices[i].getType(),
                                name: subDevices[i].getName()
                            });
                        }
                        if (deviceChanged) {
                            SettingsManager.updateDevice(reqDevice);
                        }
                        sendResponse(res, true, "", result);
                    });
                } else {
                    sendResponse(res, false, "Ungültige DeviceID");
                }
            } else {
                sendResponse(res, false, "Ungültige DeviceID");
            }
        });

        /*
         * Function to save Devices (e.g. when Name was changed)
         */
        app.post('/devices/saveDevice', function (req, res) {
            var deviceId = req.body.deviceId;
            var deviceName = req.body.deviceName;

            if (deviceId && deviceName) {
                var device = SettingsManager.getDevice(deviceId);

                if (device) {
                    device.setName(deviceName);
                    SettingsManager.updateDevice(device);
                    sendResponse(res, true, "");

                } else {
                    sendResponse(res, false, "Ungültige DeviceID");
                }
            } else {
                sendResponse(res, false, "Ungültige Parameter");
            }

        });

        /*
         * Function to save subDevices (e.g. when Name was changed)
         */
        app.post('/devices/saveSubDevice', function (req, res) {
            var deviceId = req.body.deviceId;
            var subDeviceId = req.body.subDeviceId;
            var subDeviceName = req.body.subDeviceName;

            if (deviceId && subDeviceId && subDeviceName) {
                var device = SettingsManager.getDevice(deviceId);

                if (device) {
                    var subDevice = device.getSubDevice(subDeviceId);

                    if (subDevice) {
                        subDevice.setName(subDeviceName);
                        SettingsManager.updateDevice(device);
                        sendResponse(res, true, "");
                    } else {
                        sendResponse(res, false, "Ungültige SubDeviceID");
                    }
                } else {
                    sendResponse(res, false, "Ungültige DeviceID");
                }
            } else {
                sendResponse(res, false, "Ungültige Parameter");
            }
        });
    }//END Setup-Function
};//END Module.exports
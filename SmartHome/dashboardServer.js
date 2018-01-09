/*
	Name:		dashboardServer.js
	Created:	04.11.2016
	Author:		Viktoria Jechsmayr

	Code for the Dashboard provides Functions to update received Values, list known subDevices and send new Values to connected Devices
*/

var SettingsManager = require('./settingsManager.js');

module.exports = {
    setup: function (app, smartHome, sendResponse) {

        /*
         * Return all known SubDevices with DeviceId, SubDeviceId, SubDevice-Type and SubDevice-Name
         */
        app.post('/devices/getSubDevices', function (req, res) {
            var result = [];
            var devices = SettingsManager.getDevices();
            for (var i = 0; i < devices.length; i++)
            {
                var subDevices = devices[i].getSubDevices();
                for (var j = 0; j < subDevices.length; j++)
                {
                    var subDevice = subDevices[j];
                    result.push({deviceId: devices[i].getId(), id: subDevice.getId(), type: subDevice.getType(), name: subDevice.getName() });
                }
            }
            sendResponse(res, true, "", result);
        });

        /*
         * update Values which are received from the Arduino
         */
        app.post('/devices/updateValues', function (req, res) {
            var devices = SettingsManager.getDevices();

            smartHome.readValues(devices, function () {
                var result = [];

                for (var i = 0; i < devices.length; i++) {
                    var subDevices = devices[i].getSubDevices();
                    for (var j = 0; j < subDevices.length; j++) {
                        var subDevice = subDevices[j];
                        result.push({ deviceId: devices[i].getId(), subDeviceId: subDevice.getId(), value: subDevice.getValue() });
                    }
                }
                sendResponse(res, true, "", result);
            });
        });

        /*
         * update Values and send new Value to the Arduino (writeValue)
         */
        app.post('/devices/setActorValue', function (req, res) {
            var deviceId = req.body.deviceId;
            var subDeviceId = req.body.subDeviceId;
            var subDeviceValue = req.body.value;
            
            if (deviceId && subDeviceId && (typeof subDeviceValue !== 'undefined')) {
                var device = SettingsManager.getDevice(deviceId);

                if (device) {
                    var subDevice = device.getSubDevice(subDeviceId);

                    if (subDevice) {
                        smartHome.writeValue(device, subDevice, subDeviceValue, function (reqSubDevice) {
                            sendResponse(res, true, "", { value: reqSubDevice.getValue() });
                        });
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
    }
}
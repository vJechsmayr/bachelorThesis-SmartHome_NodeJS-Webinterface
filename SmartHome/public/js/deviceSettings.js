/*
	Name:		deviceSettings.js
	Created:	14.11.2016
	Author:		Viktoria Jechsmayr

	asdf
*/

var app = angular.module("smartHomeApp", ['ui.bootstrap']);

/*
 * 
 */
app.controller('deviceSettingsController', function ($scope, $http) {
    $scope.devices = [];
    $scope.getDeviceByID = function (id) {
        for (var i = 0; i < $scope.devices.length; i++) {
            if ($scope.devices[i].id == id) {
                return $scope.devices[i];
            }
        }
    };

/*
 * 
 */
    $scope.update = function () {
        $http.post('/devices/get').then(function (response) {
            $scope.devices = response.data.data;
            $scope.updateStatus();
        });
    };

/*
 * 
 */
    $scope.updateStatus = function () {
        for (var i = 0; i < $scope.devices.length; i++) {
            $scope.devices[i].status = "Offline";
        }
        $http.post('/devices/discover').then(function (response) {
            for (var i = 0; i < response.data.data.length; i++) {
                var device = $scope.getDeviceByID(response.data.data[i].id);

                if (device) {
                    device.ipAddress = response.data.data[i].ipAddress;
                    device.status = "Online";
                } else {
                    device = {
                        id: response.data.data[i].id,
                        status: "Online",
                        name: response.data.data[i].name,
                        ipAddress: response.data.data[i].ipAddress
                    };
                    $scope.devices.push(device);
                }
                $scope.updateSubDevices(device);
            }
        });
    };

/*
 * 
 */
    $scope.updateSubDevices = function (device) {
        $http.post('/devices/discoverSubDevices', { deviceId: device.id }).then(function (response) {
            device.subDevices = [];
            for (var i = 0; i < response.data.data.length; i++) {
                var subDevice = response.data.data[i];
                device.subDevices.push(subDevice);
            }
        });
    };

/*
 * 
 */
    $scope.saveDevice = function (device) {
        $http.post('/devices/saveDevice', { deviceId: device.id, deviceName: device.name });
    }

/*
 * 
 */
    $scope.saveSubDevice = function (device, subDevice) {
        $http.post('/devices/saveSubDevice', { deviceId: device.id, subDeviceId: subDevice.id, subDeviceName: subDevice.name });
    }

    $scope.update();
});
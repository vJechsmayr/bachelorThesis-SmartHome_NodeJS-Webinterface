/*
	Name:		dashboard.js
	Created:	16.11.2016
	Author:		Viktoria Jechsmayr

	asdf
*/

var app = angular.module("smartHomeApp", ['ui.bootstrap']);

/*
 * 
 */
app.controller('dashboardController', function ($scope, $http) {
    $scope.subDevices = [];

    $scope.getSubDevice = function (deviceId, subDeviceId) {
        for (var i = 0; i < $scope.subDevices.length; i++) {
            if ($scope.subDevices[i].id == subDeviceId && $scope.subDevices[i].deviceId == deviceId) {
                return $scope.subDevices[i];
            }
        }
    };

/*
 * 
 */
    $scope.update = function () {
        $http.post('/devices/getSubDevices').then(function (response) {
            $scope.subDevices = response.data.data;
            $scope.updateValues();
            setInterval(function () { $scope.updateValues(); }, 1000);
        });
    };

/*
 * 
 */
    $scope.updateValues = function () {
        $http.post('/devices/updateValues').then(function (response) {
            var result = response.data.data;

            for (var i = 0; i < result.length; i++) {
                var subDevice = $scope.getSubDevice(result[i].deviceId, result[i].subDeviceId);

                if (subDevice) {
                    subDevice.value = result[i].value;
                }
            }
        });
    };

/*
 * 
 */
    $scope.toggleActor = function (subDevice) {
        $http.post('/devices/setActorValue', { deviceId: subDevice.deviceId, subDeviceId: subDevice.id, value: !subDevice.value }).then(function (response) {
            var currentValue = response.data.data.value;
            subDevice.value = currentValue;
        });
    }
    $scope.update();
});
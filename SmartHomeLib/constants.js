/*
	Name:		constants.js
	Created:	04.11.2016
	Author:		Viktoria Jechsmayr

	Provides all constants used by the Functionality, module.exports is needed to make it available to the SmartHome-Functionalitys 
*/

const BROADCAST_ID = 0x00;

const SUBDEVICE_TYPE_ACTOR = 0x01;
const SUBDEVICE_TYPE_SENSOR = 0x02;

const COMMAND_DISCOVER_REQUEST = 0x01;
const COMMAND_DISOCVER_REPLY = 0x02;
const COMMAND_GET_SUBDEVICES_REQUEST = 0x03;
const COMMAND_GET_SUBDEVICES_REPLY = 0x04;
const COMMAND_GET_VALUE_REQUEST = 0x05;
const COMMAND_GET_VALUE_REPLY = 0x06;
const COMMAND_SET_VALUE_REQUEST = 0x07;
const COMMAND_SET_VALUE_REPLY = 0x08;

module.exports = {
    ids: {
        all: BROADCAST_ID
    },
    subDeviceTypes: {
        actor: SUBDEVICE_TYPE_ACTOR,
        sensor: SUBDEVICE_TYPE_SENSOR
    },
    commands: {
        discoverRequest: COMMAND_DISCOVER_REQUEST,
        discoverReply: COMMAND_DISOCVER_REPLY,
        getSubDevicesRequest: COMMAND_GET_SUBDEVICES_REQUEST,
        getSubDevicesReply: COMMAND_GET_SUBDEVICES_REPLY,
        getValueRequest: COMMAND_GET_VALUE_REQUEST,
        getValueReply: COMMAND_GET_VALUE_REPLY,
        setValueRequest: COMMAND_SET_VALUE_REQUEST,
        setValueReply: COMMAND_SET_VALUE_REPLY
    }
};
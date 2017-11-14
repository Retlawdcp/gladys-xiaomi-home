const Hub = require('node-xiaomi-smart-home').Hub;
const createDevice = require('./createDevice');
const createDeviceState = require('./createDeviceState');

const CLICK_TYPE_MAPPING = {
    click: 1,
    double_click: 2,
    long_click_press: 3,
    long_click_release: 4
};

module.exports = function listen(){

    var hub = new Hub();
    hub.listen();

    hub.on('message', function (message) {
        
    });

    hub.on('error', function (e) {
        console.log('Error : ' + e);
    });

    hub.on('data.button', function (sid, type) {
        // type can be click, double_click, long_click_press, long_click_release
        console.log(`Received event "Button" with sid = ${sid} and type = ${type}`);
        
        var newDevice = {
            device: {
                name: 'Xiaomi Button',
                identifier: sid,
                protocol: 'zigbee',
                service: 'xiaomi-home'
            },
            types: [
                {
                    identifier: 'button',
                    type: 'button',
                    sensor: true,
                    min: 0,
                    max: 4
                }
            ]
        };

        createDevice(newDevice)
            .then((result) => createDeviceState(result.types[0].id, CLICK_TYPE_MAPPING[type]))
            .catch(console.log);
    });

    hub.on('data.magnet', function (sid, closed) {
        console.info('MAGNET', sid, closed);

        var newDevice = {
            device: {
                name: 'Xiaomi Door & Window',
                identifier: sid,
                protocol: 'zigbee',
                service: 'xiaomi-home'
            },
            types: [
                {
                    identifier: 'binary',
                    type: 'binary',
                    sensor: true,
                    min: 0,
                    max: 1
                }
            ]
        };

        createDevice(newDevice)
            .then((result) => createDeviceState(result.types[0].id, closed))
            .catch(console.log);        
    });

    hub.on('data.motion', function (sid, motion) {
        console.info('motion', sid, motion);
    });

    hub.on('data.th', function (sid, temperature, humidity) {
        console.info('th', sid, temperature, humidity);
    });

    hub.on('data.plug', function (sid, on) {
        console.info('plug', sid, on);
    });
};
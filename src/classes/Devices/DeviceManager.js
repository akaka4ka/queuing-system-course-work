import { Device } from "./Device";

export class DeviceManager {
    constructor(devicesNumber) {
        /**
         * @type {Device[]}
         */
        this.devices = [];

        while (this.devices.length < devicesNumber) {
            this.createDevice();
        }
    }

    refreshDevices() {
        this.devices.forEach((device) => device.refreshDevice());
    }

    createDevice() {
        this.devices.push(new Device(this.devices.length));
    }

    makeDeviceBusy(deviceId) {
        if (this.devices.length <= deviceId) {
            console.error(
                "Tried to refer to non-existent object of array",
                this.devices,
                deviceId
            );
            return;
        }

        this.devices[deviceId].isBusy = true;
    }

    releaseDevice(deviceId) {
        if (this.devices.length <= deviceId) {
            console.error(
                "Tried to refer to non-existent object of array",
                this.devices,
                deviceId
            );
            return;
        }

        this.devices[deviceId].isBusy = false;
    }

    getSpareDevicesCount() {
        return this.devices.reduce((count, device) => {
            if (!device.isBusy) {
                return count + 1;
            }
            return count;
        }, 0);
    }

    getDeviceHandlingTime(deviceId) {
        return this.devices.find((device) => device.id === deviceId)
            .getHandlingTime();
    }

    isThereSpareDevice() {
        return !this.devices.every((device) => device.isBusy);
    }

    isThereBusyDevice() {
        return this.devices.some((device) => device.isBusy);
    }

    getFirstPriorityDeviceId() {
        return this.devices.find((device) => !device.isBusy).id;
    }
}

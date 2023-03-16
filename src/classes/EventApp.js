import { EventType } from "../enums/EventType";
import EventCalendar from "./EventCalendar";
import { DeviceManager } from "./Devices/DeviceManager";
import { SourceManager } from "./Sources/SourceManager";
import { Buffer } from "./Buffer";
import { Logger } from "./Logger";
import { setUpInterval } from "./Devices/Device";
import { setUpLambda } from "./Sources/Source";

export class EventApp {
    constructor(
        sourcesNumber,
        devicesNumber,
        bufferCellsNumber,
        totalBidsCount,
        a,
        b,
        lambda
    ) {
        setUpInterval(a, b);
        setUpLambda(lambda);

        this.initScalarVariables(totalBidsCount);

        this.initManagers(sourcesNumber, devicesNumber, bufferCellsNumber);

        this.currentGeneratedBidsCount =
            this.sourceManager.initFirstBids(totalBidsCount);

        if (this.currentGeneratedBidsCount === this.totalBidsCount) {
            this.shouldSourceGenerateBid = false;
        }
    }

    //#region ManagersLogic

    initManagers(sourcesNumber, devicesNumber, bufferCellsNumber) {
        this.sourceManager = new SourceManager(sourcesNumber);
        this.deviceManager = new DeviceManager(devicesNumber);
        this.buffer = new Buffer(bufferCellsNumber);
        this.logger = new Logger();
    }

    refreshManagers() {
        this.deviceManager.refreshDevices();
        this.sourceManager.refreshSources();
        this.buffer.refreshBuffer();
        this.logger.clear();
        EventCalendar.clear();
    }

    //#endregion

    initScalarVariables(totalBidsCount) {
        this.totalBidsCount = totalBidsCount;
        this.currentGeneratedBidsCount = 0;
        this.currentBidsHandledCount = 0;
        this.currentRejectionsCount = 0;
        this.shouldSourceGenerateBid = true;
        this.isExecuting = true;
    }

    refresh(totalBidsCount) {
        this.initScalarVariables(totalBidsCount);

        this.refreshManagers();

        this.sourceManager.initFirstBids();
    }

    execute() {
        this.autoModeCalculation();

        return;
    }

    autoModeCalculation() {
        let isDone = false;
        //console.log(this.totalBidsCount);

        while (!isDone) {
            if (this.handleNextEvent().type === EventType.EXECUTION_STOP) {
                //console.log("DURA DONE");
                isDone = true;
            }
        }
    }

    handleNextEvent() {
        if (!this.isExecuting) {
            return { type: EventType.EXECUTION_STOP };
        }

        const nextEvent = EventCalendar.getNextEvent();

        if (EventCalendar.eventHistory.length - 1 === EventCalendar.eventPointer) {
            //console.log(nextEvent);
        }

        if (nextEvent.type === EventType.NEW_BID) {
            this.#handleNewBidEvent(nextEvent);
        }

        if (nextEvent.type === EventType.DEVICE_RELEASE) {
            this.#handleDeviceReleaseEvent(nextEvent);
        }

        return nextEvent;
    }

    #handleNewBidEvent(event) {
        this.logger.logNewBid(event.item.source.id);

        if (this.shouldSourceGenerateBid) {
            const nextBid = this.sourceManager.nextSourceBid(
                event.item.source.id
            );

            if (++this.currentGeneratedBidsCount === this.totalBidsCount) {
                this.shouldSourceGenerateBid = false;
            }

            EventCalendar.addEvent({
                type: EventType.NEW_BID,
                item: {
                    deviceId: undefined,
                    source: {
                        id: nextBid.sourceId,
                        bidId: nextBid.bidId,
                    },
                },
                time: +(event.time + nextBid.time).toFixed(2),
            });
        }

        if (this.deviceManager.isThereSpareDevice()) {
            const deviceId = this.deviceManager.getFirstPriorityDeviceId();
            this.deviceManager.makeDeviceBusy(deviceId);

            this.logger.logDeviceTotalHandlingTime(deviceId);

            this.logger.logNewBidHandlingTime(
                event.item.source.id,
                this.deviceManager.getDeviceHandlingTime(deviceId)
            );

            EventCalendar.addEvent({
                type: EventType.DEVICE_RELEASE,
                item: {
                    deviceId: deviceId,
                    source: event.item.source,
                },
                time: +(
                    event.time +
                    this.deviceManager.getDeviceHandlingTime(deviceId)
                ).toFixed(2),
            });
        } else {
            if (!this.buffer.isThereSpareCell()) {
                this.currentRejectionsCount++;
                this.logger.logRejectedBid(this.buffer.cells[0].bid.id);
            }

            this.buffer.addBid({
                bid: event.item.source,
                time: event.time,
            });
        }

        return event;
    }

    #handleDeviceReleaseEvent(event) {
        this.currentBidsHandledCount++;

        this.deviceManager.releaseDevice(event.item.deviceId);

        if (!this.buffer.isEmpty()) {
            const bid = this.buffer.extractBid();
            const deviceId = this.deviceManager.getFirstPriorityDeviceId();
            this.deviceManager.makeDeviceBusy(deviceId);

            this.logger.logDeviceTotalHandlingTime(deviceId);

            this.logger.logNewBidBufferedTime(
                bid.bid.id,
                +(event.time - bid.time).toFixed(2)
            );

            this.logger.logNewBidHandlingTime(
                event.item.source.id,
                this.deviceManager.getDeviceHandlingTime(deviceId)
            );

            EventCalendar.addEvent({
                type: EventType.DEVICE_RELEASE,
                item: {
                    deviceId: deviceId,
                    source: {
                        id: bid.bid.id,
                        bidId: bid.bid.bidId,
                    },
                },
                time: +(
                    event.time +
                    this.deviceManager.getDeviceHandlingTime(deviceId)
                ).toFixed(2),
            });
        } else {
            if (
                !this.shouldSourceGenerateBid &&
                !this.deviceManager.isThereBusyDevice()
            ) {
                this.isExecuting = false;
                EventCalendar.addEvent({
                    type: EventType.EXECUTION_STOP,
                    item: undefined,
                    time: +(event.time + 0.01).toFixed(2),
                });
            }
        }

        return event;
    }
}

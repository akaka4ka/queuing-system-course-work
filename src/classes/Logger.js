export class Logger {
    constructor() {
        /**
         * @type {{
         *  sourceId: number,
         *  cameBidAmount: number,
         * }[]}
         */
        this.sourcesBidsAmount = [];
        /**
         * @type {{
         *  sourceId: number,
         *  rejectdBidAmount: number,
         * }[]}
         */
        this.sourcesRejectedBidsAmount = [];
        /**
         * @type {{
         *  sourceId: number,
         *  handlingTime: number[],
         * }[]}
         */
        this.sourcesBidsHandlingTime = [];
        /**
         * @type {{
         *  sourceId: number,
         *  bufferedTime: number[],
         * }[]}
         */
        this.sourcesBidsBufferedTime = [];
        /**
         * @type {{
         *  deviceId: number,
         *  handlingTimes: number,
         * }[]}
         */
        this.deviceTotalHandlingTime = [];
    }

    clear() {
        this.sourcesBidsAmount = [];
        this.sourcesRejectedBidsAmount = [];
        this.sourcesBidsHandlingTime = [];
        this.sourcesBidsBufferedTime = [];
        this.deviceTotalHandlingTime = [];
    }

    logNewBid(sourceId) {
        let index = this.sourcesBidsAmount.findIndex(
            (item) => item.sourceId === sourceId
        );

        if (index >= 0) {
            this.sourcesBidsAmount[index].cameBidAmount++;
        } else {
            this.sourcesBidsAmount.push({
                sourceId: sourceId,
                cameBidAmount: 1,
            });
        }
    }

    logRejectedBid(sourceId) {
        let index = this.sourcesRejectedBidsAmount.findIndex(
            (item) => item.sourceId === sourceId
        );

        if (index >= 0) {
            this.sourcesRejectedBidsAmount[index].rejectdBidAmount++;
        } else {
            this.sourcesRejectedBidsAmount.push({
                sourceId: sourceId,
                rejectdBidAmount: 1,
            });
        }
    }

    logNewBidHandlingTime(sourceId, handlingTime) {
        let index = this.sourcesBidsHandlingTime.findIndex(
            (item) => item.sourceId === sourceId
        );

        if (index >= 0) {
            this.sourcesBidsHandlingTime[index].handlingTime.push(handlingTime);
        } else {
            this.sourcesBidsHandlingTime.push({
                sourceId: sourceId,
                handlingTime: [handlingTime],
            });
        }
    }

    logNewBidBufferedTime(sourceId, bufferedTime) {
        let index = this.sourcesBidsBufferedTime.findIndex(
            (item) => item.sourceId === sourceId
        );

        if (index >= 0) {
            this.sourcesBidsBufferedTime[index].bufferedTime.push(bufferedTime);
        } else {
            this.sourcesBidsBufferedTime.push({
                sourceId: sourceId,
                bufferedTime: [bufferedTime],
            });
        }
    }

    logDeviceTotalHandlingTime(deviceId) {
        let index = this.deviceTotalHandlingTime.findIndex(
            (item) => item.deviceId === deviceId
        );

        if (index >= 0) {
            this.deviceTotalHandlingTime[index].handlingTimes++;
        } else {
            this.deviceTotalHandlingTime.push({
                deviceId: deviceId,
                handlingTimes: 1,
            });
        }
    }
}

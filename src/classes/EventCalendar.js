class EventCalendar {
    constructor() {
        this.eventHistory = [];
        this.eventPointer = 0;
    }

    clear() {
        this.eventHistory = [];
        this.eventPointer = 0;
    }

    getNextEvent() {
        return this.eventHistory[
            this.eventPointer + 1 === this.eventHistory.length
                ? this.eventPointer
                : this.eventPointer++
        ];
    }

    addEvent(event) {
        this.eventHistory.push(event);
        this.eventHistory.sort((a, b) => a.time - b.time);
    }
}

export default new EventCalendar();

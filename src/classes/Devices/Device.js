let a = 0;
let b = 0;

export const setUpInterval = (start, end) => {
    a = start;
    b = end;
}

export class Device {
    constructor (id) {
        this.id = id;
        this.isBusy = false;
        this.handlingTime = this.generateHandlingTime();
    }

    getHandlingTime() {
        return this.handlingTime;
    }

    generateHandlingTime() {
        return +(a + Math.random() * (b - a)).toFixed(2);
    }

    refreshDevice() {
        this.isBusy = false;
        this.handlingTime = this.generateHandlingTime();
    }
    
}
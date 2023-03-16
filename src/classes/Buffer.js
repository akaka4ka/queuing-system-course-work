export class Buffer {
    constructor (cellsNumber) {
        this.cells = [];
        this.cellsNumber = cellsNumber;
    }

    refreshBuffer() {
        this.cells = [];
    }

    isThereSpareCell() {
        return this.cells.length < this.cellsNumber;
    }

    isEmpty() {
        return this.cells.length === 0;
    }

    addBid(bid) {
        if (this.cells.length >= this.cellsNumber) {
            this.cells.shift();
        }

        this.cells.push(bid);
    }

    extractBid() {
        return this.cells.pop();
    }

    deleteOldestBid() {
        let minTime = Math.min(...this.cells.map(item => item.time));
        this.cells = this.cells.filter(item => item.time !== minTime);
    }
}

let lambda = 0;

export const setUpLambda = (l) => {
    lambda = l;
}

export class Source {
    constructor(id) {
        this.bidId = 1;
        this.id = id;
    }

    refreshSource() {
        this.bidId = 1;
    }

    nextBid() {
        return {
            sourceId: this.id,
            bidId: this.bidId++,
            time: +((-1 / lambda) * Math.log(Math.random())).toFixed(2),
        };
    }
}

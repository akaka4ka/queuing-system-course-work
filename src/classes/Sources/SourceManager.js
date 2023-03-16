import { EventType } from "../../enums/EventType";
import EventCalendar from "../EventCalendar";
import { Source } from "./Source";

export class SourceManager {
    constructor(sourcesNumber) {
        /**
         * @type {Source[]}
         */
        this.sources = [];

        while (this.sources.length < sourcesNumber) {
            this.createSource();
        }
    }

    refreshSources() {
        this.sources.forEach((source) => source.refreshSource());
    }

    createSource() {
        this.sources.push(new Source(this.sources.length));
    }

    initFirstBids(totalBidsCount) {
        let currentGeneratedBidsCount = 0;
        for (const source of this.sources) {
            if (currentGeneratedBidsCount === totalBidsCount) {
                return currentGeneratedBidsCount;
            }
            const nextBid = source.nextBid();
            EventCalendar.addEvent({
                type: EventType.NEW_BID,
                item: {
                    device: undefined,
                    source: {
                        id: nextBid.sourceId,
                        bidId: nextBid.bidId,
                    },
                },
                time: nextBid.time,
            });
            currentGeneratedBidsCount++;
        }

        return currentGeneratedBidsCount;
    }

    nextSourceBid(sourceId) {
        return this.sources[sourceId].nextBid();
    }
}

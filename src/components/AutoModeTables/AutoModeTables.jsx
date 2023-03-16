import { EventApp } from "../../classes/EventApp";
import EventCalendar from "../../classes/EventCalendar";
import { Table } from "../Table/Table";
import classes from "./AutoModeTables.module.css";

const sourcesColumns = [
    "Номер источника",
    "Количество заявок",
    "P_отк",
    "T_преб",
    "T_БП",
    "T_обсл",
    "Д_БП",
    "Д_обсл",
];

const devicesColumns = ["Номер прибора", "Коэффициент использования"];

/**
 *
 * @param {{eventApp: EventApp}} eventApp
 * @returns
 */
export const AutoModeTables = ({ eventApp }) => {
    return (
        <div className={classes.tablesWrapper}>
            <h2 className={classes.tableLabel}>Сводная таблица</h2>
            <hr />

            {/* <br/>
            <p style={{ justifySelf: "center", color: "white" }}>
                P:
                {(eventApp.currentRejectionsCount / eventApp.totalBidsCount).toFixed(4)}
                T:
                {(eventApp.logger.)}
            </p> */}

            <div className={classes.tables}>
                <div className={classes.tableWrapper}>
                    <h2 className={classes.tableLabel}>Таблица источников</h2>
                    <Table
                        columns={sourcesColumns}
                        rows={eventApp.sourceManager.sources.map((source) => {
                            const totalBids =
                                eventApp.logger.sourcesBidsAmount.find(
                                    (item) => item.sourceId === source.id
                                )?.cameBidAmount;
                            const rejectedBids =
                                eventApp.logger.sourcesRejectedBidsAmount.find(
                                    (item) => item.sourceId === source.id
                                )?.rejectdBidAmount;
                            const handlingTime =
                                eventApp.logger.sourcesBidsHandlingTime
                                    .find((item) => item.sourceId === source.id)
                                    ?.handlingTime.reduce(
                                        (partialSum, time) => partialSum + time,
                                        0
                                    ) / totalBids;
                            const handlingTimeD =
                                eventApp.logger.sourcesBidsHandlingTime
                                    .find((item) => item.sourceId === source.id)
                                    ?.handlingTime.reduce(
                                        (partialSum, time) =>
                                            partialSum + time ** 2,
                                        0
                                    ) /
                                    totalBids -
                                handlingTime ** 2;
                            const bufferedTime =
                                eventApp.logger.sourcesBidsBufferedTime
                                    .find((item) => item.sourceId === source.id)
                                    ?.bufferedTime.reduce(
                                        (partialSum, time) => partialSum + time,
                                        0
                                    ) / totalBids;
                            const bufferedTimeD = bufferedTime
                                ? eventApp.logger.sourcesBidsBufferedTime
                                      .find(
                                          (item) => item.sourceId === source.id
                                      )
                                      ?.bufferedTime.reduce(
                                          (partialSum, time) =>
                                              partialSum + time ** 2,
                                          0
                                      ) /
                                      totalBids -
                                  bufferedTime ** 2
                                : 0;

                            return [
                                "И" + (source.id + 1),
                                totalBids,
                                rejectedBids
                                    ? (rejectedBids / totalBids).toFixed(2)
                                    : "0.00",
                                bufferedTime
                                    ? (handlingTime + bufferedTime).toFixed(2)
                                    : handlingTime.toFixed(2),
                                bufferedTime ? bufferedTime.toFixed(2) : "0.00",
                                handlingTime.toFixed(2),
                                bufferedTimeD.toFixed(2),
                                handlingTimeD.toFixed(2),
                            ];
                        })}
                        cellWidth={"120px"}
                    />
                </div>
                <div className={classes.tableWrapper}>
                    <h2 className={classes.tableLabel}>Таблица источников</h2>
                    <Table
                        columns={devicesColumns}
                        rows={eventApp.deviceManager.devices.map((device) => {
                            let totalHandlingTime =
                                eventApp.logger.deviceTotalHandlingTime.find(
                                    (item) => item.deviceId === device.id
                                ).handlingTimes * device.handlingTime;
                            return [
                                "П" + (device.id + 1),
                                (
                                    totalHandlingTime /
                                    EventCalendar.getNextEvent().time
                                ).toFixed(2),
                            ];
                        })}
                        cellWidth={"200px"}
                    />
                </div>
            </div>
        </div>
    );
};

import EventCalendar from "../../classes/EventCalendar";
import { EventType } from "../../enums/EventType";
import { Table } from "../Table/Table";
import classes from "./StepModeTables.module.css";

const eventCalendarColumns = [
    "Тип события",
    "Номер источника/прибора",
    "Номер заявки",
    "Время",
];

const bufferColumns = ["Номер ячейки", "Номер заявки", "Время поступления"];

const stateColumns = ["Заявок обработано", "Отказы", "Свободно приборов"];

export const StepModeTables = ({ eventApp }) => {
    return (
        <div className={classes.tables}>
            <div className={classes.tableWrapper}>
                <h2 className={classes.tableLabel}>Календарь событий</h2>
                <Table
                    columns={eventCalendarColumns}
                    rows={EventCalendar.eventHistory
                        .filter(
                            (item, index) => index < EventCalendar.eventPointer
                        )
                        .map((event) => [
                            event.type === EventType.NEW_BID
                                ? "Новая заявка"
                                : "Освобождение прибора",
                            event.item.deviceId !== undefined
                                ? "П" + (event.item.deviceId + 1)
                                : "И" + (event.item.source.id + 1),
                            `${event.item.source.id + 1}.${
                                event.item.source.bidId
                            }`,
                            event.time,
                        ])
                        .reverse()}
                    cellWidth={"150px"}
                />
            </div>

            <div className={classes.tableWrapper}>
                <h2 className={classes.tableLabel}>Буфер</h2>
                <Table
                    columns={bufferColumns}
                    rows={[
                        ...eventApp.buffer.cells.map((item, index) => [
                            index,
                            `${item.bid.id + 1}.${item.bid.bidId}`,
                            item.time,
                        ]),
                        ...Array(
                            eventApp.buffer.cellsNumber -
                                eventApp.buffer.cells.length
                        )
                            .fill()
                            .map((e, i) => i)
                            .map((e) => [e, "Пусто", "0"]),
                    ]}
                    cellWidth={"150px"}
                />
            </div>

            <div className={classes.tableWrapper}>
                <h2 className={classes.tableLabel}>Текущее состояние</h2>
                <Table
                    columns={stateColumns}
                    rows={[
                        [
                            eventApp.currentBidsHandledCount,
                            eventApp.currentRejectionsCount,
                            eventApp.deviceManager.getSpareDevicesCount(),
                        ],
                    ]}
                    cellWidth={"150px"}
                />
            </div>
        </div>
    );
};

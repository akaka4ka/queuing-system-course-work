import { useRef, useState } from "react";
import { EventApp } from "./classes/EventApp";
import classes from "./App.module.css";
import { AppMode } from "./enums/AppMode";
import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { StepModeTables } from "./components/StepModeTables/StepModeTables";
import { EventType } from "./enums/EventType";
import { AutoModeTables } from "./components/AutoModeTables/AutoModeTables";
import EventCalendar from "./classes/EventCalendar";
import { Table } from "./components/Table/Table";
import { SourceManager } from "./classes/Sources/SourceManager";

const defaultInterval = {
    a: 1,
    b: 10,
};
const defaultLambda = 0.25;

export const App = () => {
    const [currentEvent, setCurrentEvent] = useState(null);
    const [valuesForm, setValuesForm] = useState({
        sources: "",
        devices: "",
        bufferCells: "",
        totalBidsCount: "",
        lambda: "",
        a: "",
        b: "",
    });
    const [isExecuting, setIsExecuting] = useState(false);
    const [isDoneInAutoMode, setIsDoneInAutoMode] = useState(false);
    const [mode, setMode] = useState(AppMode.STEP);

    /**
     * @type {{current: EventApp}}
     */
    const eventAppRef = useRef(null);

    const handleValueFormButtonClick = () => {
        if (
            !Object.entries(valuesForm)
                .filter(
                    ([name, val]) =>
                        name !== "lambda" && name !== "a" && name !== "b"
                )
                .map(([name, val]) => val)
                .every((item) => item.length > 0)
        ) {
            return;
        }

        let currA = valuesForm.a || defaultInterval.a;
        let currB = valuesForm.b || defaultInterval.b;
        let currL = valuesForm.lambda || defaultLambda;

        eventAppRef.current = new EventApp(
            +valuesForm.sources,
            +valuesForm.devices,
            +valuesForm.bufferCells,
            +valuesForm.totalBidsCount,
            +currA,
            +currB,
            +currL
        );

        if (mode === AppMode.STEP) {
            setIsExecuting(true);
        } else {
            eventAppRef.current.execute();
            setIsDoneInAutoMode(true);
        }
    };

    return (
        <>
            <div className={classes.nextEventButtonWrapper}>
                <div className={classes.valuesForm}>
                    <div className={classes.valuesFormColumn}>
                        <input
                            disabled={isExecuting}
                            className={classes.valuesFormInput}
                            value={valuesForm.sources}
                            onChange={(e) =>
                                setValuesForm({
                                    ...valuesForm,
                                    sources: e.target.value,
                                })
                            }
                            placeholder={"Источники"}
                        />
                        <input
                            disabled={isExecuting}
                            className={classes.valuesFormInput}
                            value={valuesForm.devices}
                            onChange={(e) =>
                                setValuesForm({
                                    ...valuesForm,
                                    devices: e.target.value,
                                })
                            }
                            placeholder={"Приборы"}
                        />
                    </div>
                    <div className={classes.valuesFormColumn}>
                        <input
                            disabled={isExecuting}
                            className={classes.valuesFormInput}
                            value={valuesForm.bufferCells}
                            onChange={(e) =>
                                setValuesForm({
                                    ...valuesForm,
                                    bufferCells: e.target.value,
                                })
                            }
                            placeholder={"Ячейки буфера"}
                        />
                        <input
                            disabled={isExecuting}
                            className={classes.valuesFormInput}
                            value={valuesForm.totalBidsCount}
                            onChange={(e) =>
                                setValuesForm({
                                    ...valuesForm,
                                    totalBidsCount: e.target.value,
                                })
                            }
                            placeholder={"Заявки"}
                        />
                    </div>
                    <div className={classes.valuesFormColumn}>
                        <input
                            disabled={isExecuting}
                            className={classes.valuesFormInput}
                            value={valuesForm.a}
                            onChange={(e) =>
                                setValuesForm({
                                    ...valuesForm,
                                    a: e.target.value,
                                })
                            }
                            placeholder={`a: ${defaultInterval.a}`}
                        />
                        <input
                            disabled={isExecuting}
                            className={classes.valuesFormInput}
                            value={valuesForm.b}
                            onChange={(e) =>
                                setValuesForm({
                                    ...valuesForm,
                                    b: e.target.value,
                                })
                            }
                            placeholder={`b: ${defaultInterval.b}`}
                        />
                    </div>
                    <div className={classes.valuesFormColumn}>
                        <input
                            disabled={isExecuting}
                            className={classes.valuesFormInput}
                            value={valuesForm.lambda}
                            onChange={(e) =>
                                setValuesForm({
                                    ...valuesForm,
                                    lambda: e.target.value,
                                })
                            }
                            placeholder={`λ: ${defaultLambda}`}
                        />
                    </div>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    onChange={(e) =>
                                        setMode(
                                            mode === AppMode.STEP
                                                ? AppMode.AUTO
                                                : AppMode.STEP
                                        )
                                    }
                                    color={"secondary"}
                                />
                            }
                            label={
                                (mode === AppMode.STEP
                                    ? "Пошаговый "
                                    : "Автоматический ") + "режим"
                            }
                            style={{ color: "white", userSelect: "none" }}
                        />
                    </FormGroup>

                    <button
                        className={`${classes.anyButton} ${classes.valuesFormButton}`}
                        onClick={handleValueFormButtonClick}
                    >
                        Начать
                    </button>
                </div>

                <button
                    className={classes.anyButton}
                    onClick={(e) => {
                        let event = eventAppRef.current.handleNextEvent();
                        if (event.type === EventType.EXECUTION_STOP) {
                            setIsExecuting(false);
                        }
                        setCurrentEvent(event);
                        // if (event.type === EventType.NEW_BID) {
                        //     let index = nextBids.current.findIndex(
                        //         (item) =>
                        //             item.item.source.id === event.item.source.id
                        //     );
                        //     nextBids.current[index].time +=
                        //         eventAppRef.current.sourceManager.nextSourceBid(
                        //             event.item.source.id
                        //         ).time;
                        // }
                    }}
                    disabled={mode === AppMode.AUTO || !isExecuting}
                >
                    Следующее событие
                </button>
            </div>
            {(isExecuting || currentEvent?.type === EventType.EXECUTION_STOP) &&
                mode === AppMode.STEP && (
                    <>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "20px",
                                marginBottom: "20px",
                            }}
                        >
                            {/* nextBids.current
                                    .sort(
                                        (a, b) =>
                                            a.item.source.id - b.item.source.id
                                    )
                                    .map((item) => [
                                        "И" + (item.item.source.id + 1),
                                        item.time.toFixed(2),
                                    ]) */}
                            <Table
                                columns={[
                                    "Номер источника",
                                    "Следующая заявка",
                                ]}
                                rows={EventCalendar.eventHistory
                                    .filter(
                                        (item) =>
                                            item.type === EventType.NEW_BID &&
                                            item.time > (currentEvent ? currentEvent.time : 0) 
                                    )
                                    .sort(
                                        (a, b) =>
                                            a.item.source.id - b.item.source.id
                                    )
                                    .map((item) => [
                                        "И" + (item.item.source.id + 1),
                                        item.time.toFixed(2),
                                    ])}
                                cellWidth={"150px"}
                            />
                            <Table
                                columns={[
                                    "Номер прибора",
                                    "Собственное время работы",
                                    "Освободится в",
                                ]}
                                rows={EventCalendar.eventHistory
                                    .filter(
                                        (item) =>
                                            item.type ===
                                                EventType.DEVICE_RELEASE &&
                                            item.time > currentEvent.time
                                    )
                                    .sort(
                                        (a, b) =>
                                            a.item.deviceId - b.item.deviceId
                                    )
                                    .map((item) => [
                                        "П" + (item.item.deviceId + 1),
                                        eventAppRef.current.deviceManager.getDeviceHandlingTime(
                                            item.item.deviceId
                                        ),
                                        item.time,
                                    ])}
                                cellWidth={"150px"}
                            />
                        </div>
                        <StepModeTables eventApp={eventAppRef.current} />
                    </>
                )}
            {mode === AppMode.AUTO && isDoneInAutoMode && (
                <AutoModeTables eventApp={eventAppRef.current} />
            )}
        </>
    );
};

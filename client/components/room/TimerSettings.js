import styles from "../../styles/room/timersettings.module.scss";
import RoomSettingsContext from "../../contexts/RoomSettingsContext";
import { useContext, useState } from "react";
import ToggleSwitch from "../ToggleSwitch";
import NumberPicker from "../NumberPicker";

/*
timer: {
    mode: "pomodoro",
    visible: false,
    timer: {
        time: 3600
    },
    pomodoro: {
        work: 25,
        shortBreak: 5,
        longBreak: 20,
        intervals: 4
    },
}
*/

function TimerSettings({onClose}) {
    const {roomSettings, setRoomSettings} = useContext(RoomSettingsContext);

    const [timerMode, setTimerMode] = useState(roomSettings.timer.mode);
    const [timerTime, setTimerTime] = useState(roomSettings.timer.timer.time);
    const [pomodoroWork, setPomodoroWork] = useState(roomSettings.timer.pomodoro.work);
    const [pomodoroShortBreak, setPomodoroShortBreak] = useState(roomSettings.timer.pomodoro.shortBreak);
    const [pomodoroLongBreak, setPomodoroLongBreak] = useState(roomSettings.timer.pomodoro.longBreak);
    const [pomodoroIntervals, setPomodoroIntervals] = useState(roomSettings.timer.pomodoro.intervals);

    const pomodoroOptions = ["stopwatch", "timer", "pomodoro"];
    const [errorMessage, setErrorMessage] = useState("");

    const updateRoomSettings = () => {
        if (timerMode === "timer" && timerTime < 1) {
            setErrorMessage("Timer duration must be at least 1 second.");
            return;
        }

        const newSettings = {
            ...roomSettings,
            timer: {
                mode: timerMode,
                timer: {
                    time: timerTime
                },
                pomodoro: {
                    work: pomodoroWork,
                    shortBreak: pomodoroShortBreak,
                    longBreak: pomodoroLongBreak,
                    intervals: pomodoroIntervals
                }
            }
        }

        setRoomSettings({
            ...newSettings
        });
        localStorage.setItem("shovel:roomsettings", JSON.stringify(newSettings))
        setErrorMessage("");
        onClose();
    };

    const handleSave = () => {
        updateRoomSettings();
    };

    const handleCancel = () => {
        onClose();
    };

    return(
        <div className={styles.timerSettingsOuter}>
            <div className={styles.timerSettingsHeader}>
                Set a Timer
            </div>
            <div className={styles.timerSettingsContent}>
                <div className={styles.timerSettingsRow}>
                    <label>Timer Mode</label>
                    <ToggleSwitch 
                        options={pomodoroOptions} 
                        activeOption={pomodoroOptions.indexOf(timerMode)} 
                        setActiveOption={(o) => {
                            setErrorMessage("");
                            setTimerMode(pomodoroOptions[o]);
                        }}
                    />
                </div>
                {timerMode === "timer" && (
                    <div className={styles.timerSettingsRow}>
                        <label>Timer Duration</label>
                        <div className={styles.timerColumns}>
                            <div className={styles.timerColumn}>
                                <label>Hours</label>
                                <NumberPicker 
                                    min={0} 
                                    max={24} 
                                    value={Math.floor(timerTime / 3600)} 
                                    onChange={(v) => {
                                        setErrorMessage("");
                                        setTimerTime(v * 3600 + (timerTime % 3600));
                                    }}
                                />
                            </div>
                            <div className={styles.timerColumn}>
                                <label>Minutes</label>
                                <NumberPicker 
                                    min={0} 
                                    max={59} 
                                    value={Math.floor((timerTime % 3600) / 60)} 
                                    onChange={(v) => {
                                        setErrorMessage("");
                                        setTimerTime(Math.floor(timerTime / 3600) * 3600 + v * 60 + (timerTime % 60));
                                    }}
                                />
                            </div>
                            <div className={styles.timerColumn}>
                                <label>Seconds</label>
                                <NumberPicker 
                                    min={0} 
                                    max={59} 
                                    value={timerTime % 60} 
                                    onChange={(v) => {
                                        setErrorMessage("");
                                        setTimerTime(Math.floor(timerTime / 60) * 60 + v);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
                {timerMode === "pomodoro" && (
                    <>
                        <div className={styles.timerSettingsRow}>
                            <div className={styles.timerColumns}>
                                <div className={styles.timerColumn}>
                                    <label>Work (min.)</label>
                                    <NumberPicker 
                                        min={1} 
                                        max={60} 
                                        value={pomodoroWork} 
                                        onChange={(v) => {
                                            setPomodoroWork(v);
                                        }}
                                    />
                                </div>
                                <div className={styles.timerColumn}>
                                    <label>Short Break (min.)</label>
                                    <NumberPicker 
                                        min={1} 
                                        max={30} 
                                        value={pomodoroShortBreak} 
                                        onChange={(v) => {
                                            setPomodoroShortBreak(v);
                                        }}
                                    />
                                </div>
                                <div className={styles.timerColumn}>
                                    <label>Long Break (min.)</label>
                                    <NumberPicker 
                                        min={1} 
                                        max={60} 
                                        value={pomodoroLongBreak} 
                                        onChange={(v) => {
                                            setPomodoroLongBreak(v);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.timerSettingsRow}>
                            <label>Intervals before Long Break</label>
                            <NumberPicker 
                                min={1} 
                                max={10} 
                                value={pomodoroIntervals} 
                                onChange={(v) => {
                                    setPomodoroIntervals(v);
                                }}
                            />
                        </div>
                    </>
                )}
                {errorMessage && (
                    <div className={styles.errorMessage}>
                        {errorMessage}
                    </div>
                )}
                <div className={styles.timerSettingsButtons}>
                    <button onClick={handleSave} className={styles.saveButton}>Save</button>
                    <button onClick={handleCancel} className={styles.cancelButton}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default TimerSettings;
import styles from "../../styles/room/timer.module.scss";
import RoomSettingsContext from "../../contexts/RoomSettingsContext";
import { BsGearFill } from "react-icons/bs";
import { useContext } from "react";
import { useState, useEffect, useRef } from "react";
import { BsPlayFill, BsPauseFill, BsStopFill } from "react-icons/bs";
import { LuTimerReset } from "react-icons/lu";

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

function Timer({showSettings}) {
    const [timerActive, setTimerActive] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [pomodoroState, setPomodoroState] = useState({
        currentPhase: "work",
        currentInterval: 1
    });
    const intervalRef = useRef(null);
    const audioRef = useRef(null);

    let {roomSettings} = useContext(RoomSettingsContext);

    useEffect(() => {
        audioRef.current = new Audio('/sounds/timer_beep.flac');
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const nextPomodoroPhase = (currentState) => {
        let { currentPhase, currentInterval } = currentState;
        let pomodoroSettings = roomSettings.timer.pomodoro;
        let nextInterval;
        let nextPhase;
        let t;
    
        if (currentPhase === "longBreak") {
            nextInterval = 1;
            nextPhase = "work";
            t = pomodoroSettings.work * 60;
        } else if (currentPhase === "work") {
            nextInterval = currentInterval;
            if(nextInterval === pomodoroSettings.intervals) {
                nextPhase = "longBreak";
                t = pomodoroSettings.longBreak * 60;
            } else {
                nextPhase = "shortBreak";
                t = pomodoroSettings.shortBreak * 60;
            }
        } else if (currentPhase === "shortBreak") {
            nextInterval = (currentInterval % pomodoroSettings.intervals) + 1;
            nextPhase = "work";
            t = pomodoroSettings.work * 60;
        }
    
        return { time: t, phase: nextPhase, interval: nextInterval };
    }

    const endTimer = () => {
        clearInterval(intervalRef.current);
        setTimerActive(false);
        return 0;
    }

    useEffect(() => {
        if (timerActive) {
            intervalRef.current = setInterval(() => {
                if (roomSettings.timer.mode === 'stopwatch') {
                    setTimeElapsed(prev => prev + 1);
                } else {
                    setTimeElapsed(prev => {
                        if (prev === 1) {
                            audioRef.current.play();
                            if (roomSettings.timer.mode === 'pomodoro') {
                                const { time, phase, interval } = nextPomodoroPhase(pomodoroState);
                                setPomodoroState({ currentPhase: phase, currentInterval: interval });
                                return time;
                            } else {
                                return endTimer();
                            }
                        }
                        return prev - 1;
                    });
                }
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [timerActive, roomSettings.timer.mode, pomodoroState]);

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return {
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0')
        };
    };

    const handleStart = () => {
        if(timerActive) return;
        if(timeElapsed === 0) {
            if (roomSettings.timer.mode === 'pomodoro') {
                setTimeElapsed(roomSettings.timer.pomodoro.work * 60);
            } else if (roomSettings.timer.mode === 'timer') {
                setTimeElapsed(roomSettings.timer.timer.time);
            }
        } 
        setTimerActive(true);
    };

    const handlePause = () => {
        setTimerActive(false);
    };

    const handleRestart = () => {
        setTimerActive(false);
        if (roomSettings.timer.mode === 'pomodoro') {
            setTimeElapsed(roomSettings.timer.pomodoro.work * 60);
            setPomodoroState({ currentPhase: "work", currentInterval: 1 });
        } else if (roomSettings.timer.mode === 'timer') {
            setTimeElapsed(roomSettings.timer.timer.time);
        } else if (roomSettings.timer.mode === 'stopwatch') {
            setTimeElapsed(0);
        }
    };

    const formatPhase = (phaseKey) => {
        switch(phaseKey) {
            case "work":
                return "Work";
            case "shortBreak":
                return "Short Break";
            case "longBreak":
                return "Long Break";
            default:
                return "";
        }
    }

    const renderTimerControls = () => {
        if(!roomSettings || !roomSettings.timer) return null;
        const controls = (
            <>
                {!timerActive ? (
                    <button onClick={handleStart} className={`${styles.controlButton} ${styles.play}`}>
                        <BsPlayFill />
                    </button>
                ) : (
                    <button onClick={handlePause} className={`${styles.controlButton} ${styles.pause}`}>
                        <BsPauseFill />
                    </button>
                )}
                <button onClick={handleRestart} className={`${styles.controlButton} ${styles.restart}`}>
                    <LuTimerReset />
                </button>
            </>
        );

        switch(roomSettings.timer.mode) {
            case "timer":
                return (
                    <div className={styles.timerModeControls}>
                        {controls}
                    </div>
                );
            case "stopwatch":
                return (
                    <div className={styles.stopwatchModeControls}>
                        {controls}
                    </div>
                );
            case "pomodoro":
                return (
                    <div className={styles.pomodoroModeControls}>
                        {controls}
                        <div className={styles.pomodoroPhase}>
                            {formatPhase(pomodoroState.currentPhase)} - <span className={styles.pomodoroInterval}>{pomodoroState.currentInterval}/{roomSettings.timer.pomodoro.intervals}</span>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    if(!roomSettings || !roomSettings.timer) return null;

    const timeToDisplay = roomSettings.timer.mode === 'stopwatch' ? timeElapsed : timeElapsed;
    const { hours, minutes, seconds } = formatTime(timeToDisplay);

    return(
        <div className={styles.timerInner}>
            <div 
                onClick={() => showSettings()} 
                className={styles.timerSettings}>
                <BsGearFill/>
            </div>
            <div className={styles.timerTime}>
                <div className={styles.timerNumber}>
                    <div className={styles.timerDigits}>
                        <div className={styles.timerDigit}>{hours[0]}</div>
                        <div className={styles.timerDigit}>{hours[1]}</div>
                    </div>
                    <div className={styles.timerLabel}>hours</div>
                </div>
                <div className={styles.partition}>
                    :
                </div>
                <div className={styles.timerNumber}>
                    <div className={styles.timerDigits}>
                        <div className={styles.timerDigit}>{minutes[0]}</div>
                        <div className={styles.timerDigit}>{minutes[1]}</div>
                    </div>
                    <div className={styles.timerLabel}>minutes</div>
                </div>
                <div className={styles.partition}>
                    :
                </div>
                <div className={styles.timerNumber}>
                    <div className={styles.timerDigits}>
                        <div className={styles.timerDigit}>{seconds[0]}</div>
                        <div className={styles.timerDigit}>{seconds[1]}</div>
                    </div>
                    <div className={styles.timerLabel}>seconds</div>
                </div>
            </div>
            <div className={styles.timerControls}>
                {renderTimerControls()}
            </div>
        </div>
    );
}

export default Timer;
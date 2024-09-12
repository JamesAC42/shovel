import React from 'react';
import styles from '../styles/numberpicker.module.scss';
import { FaMinus, FaPlus } from "react-icons/fa6";

function NumberPicker({ min, max, value, onChange }) {
    const handleIncrement = () => {
        if (value < max) {
            onChange(value + 1);
        }
    };

    const handleDecrement = () => {
        if (value >= min + 1) {
            onChange(value - 1);
        }
    };

    const handleInputChange = (e) => {
        const newValue = parseInt(e.target.value, 10);
        if (!isNaN(newValue) && newValue >= min && newValue <= max) {
            onChange(newValue);
        }
    };

    return (
        <div className={styles.numberPicker}>
            <button onClick={handleDecrement} className={`${styles.button} ${
               value == min ? styles.buttonDisabled : '' 
            }`}>
                <FaMinus/>
            </button>
            <input
                type="number"
                min={min}
                max={max}
                value={value}
                onChange={handleInputChange}
                className={styles.input}
            />
            <button onClick={handleIncrement} className={`${styles.button} ${
               value == max ? styles.buttonDisabled : '' 
            }`}>
                <FaPlus/>
            </button>
        </div>
    );
}

export default NumberPicker;
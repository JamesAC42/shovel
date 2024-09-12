import styles from '../styles/toggleswitch.module.scss';

function ToggleSwitch({
    options,
    activeOption,
    setActiveOption
}) {
    if (options.length < 2) {
        console.error('ToggleSwitch component requires at least 2 options');
        return null;
    }

    const handleOptionClick = (index) => {
        setActiveOption(index);
    };
    
    const getSliderStyle = () => {
        const width = 100 / options.length;
        return {
            width: `calc(${width}% `,
            transform: `translateX(calc(${activeOption * 100}% - ${activeOption * 2}px))`,
            height: `calc(100% - 2px)`
        };
    };

    return (
        <div className={styles.toggleSwitchContainer}>
            <div className={styles.toggleSwitch}>
                {options.map((option, index) => (
                    <div 
                        key={index}
                        className={`${styles.option} ${activeOption === index ? styles.activeOption : ''}`}
                        onClick={() => handleOptionClick(index)}
                    >
                        {option}
                    </div>
                ))}
                <div className={styles.slider} style={getSliderStyle()}></div>
            </div>
        </div>
    );
}

export default ToggleSwitch;
import styles from "../styles/popup.module.scss";

function Popup({
    onClose,
    children
}) {
    return(

        <div className={styles.popupOuter}>
            <div className={styles.popupInner}>
                <div
                    onClick={() => onClose()} 
                    className={styles.popupBackground}>
                </div>
                <div className={styles.popupContent}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Popup;
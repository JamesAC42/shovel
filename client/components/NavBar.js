import styles from "../styles/navbar.module.scss";
import Link from "next/link";
import ThemePicker from "./ThemePicker";

function NavBar() {
    return(
        <div className={styles.navbar}>
            <div className={styles.navLeft}>
                <div className={styles.navitem}>
                    <Link href="/">
                        shovel
                    </Link>
                </div>
                <div className={styles.navitem}>
                    <ThemePicker />
                </div>
            </div>
            <div className={styles.navRight}>
                <div className={styles.navitem}>
                    <Link href="/social">
                        connect
                    </Link>
                </div>
                <div className={styles.navitem}>
                    <Link href="/room">
                        rooms
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default NavBar;
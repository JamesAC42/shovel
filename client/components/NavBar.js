import styles from "../styles/navbar.module.scss";
import { RiHomeFill } from "react-icons/ri";
import { TbShovel } from "react-icons/tb";
import { BsFillPeopleFill } from "react-icons/bs";
import Link from "next/link";
import ThemePicker from "./ThemePicker";

function NavBar() {
    return(
        <div className={styles.navbar}>
            <div className={styles.navLeft}>
                <div className={styles.navitem}>
                    <Link href="/">
                        <RiHomeFill/>
                    </Link>
                </div>
                <div className={styles.navitem}>
                    <ThemePicker />
                </div>
            </div>
            <div className={styles.navRight}>
                <div className={styles.navitem}>
                    <Link href="/social">
                        <BsFillPeopleFill/>
                    </Link>
                </div>
                <div className={styles.navitem}>
                    <Link href="/room">
                        <TbShovel/>
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default NavBar;
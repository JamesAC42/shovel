import GoogleSignInButton from "./GoogleSignInButton";
import styles from "../styles/googlesignin.module.scss";

function GoogleSignIn() {

    return(
        <div className={styles.googleSignIn}>
            <div className={styles.googleSignInSeparator}>
                <div className={styles.line}></div>
                <div className={styles.lineLabel}>OR</div>
                <div className={styles.line}></div>
            </div>
            <div className={styles.signInButton}>
                <GoogleSignInButton />
            </div>
        </div>
    )

}
export default GoogleSignIn;
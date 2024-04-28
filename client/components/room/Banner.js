import { useContext } from "react";
import styles from "../../styles/room/banner.module.scss";
import ViewContext from "../../contexts/ViewContext";

function Banner() {

    let {view, setView} = useContext(ViewContext);

    if(!view.showBanner) return null;

    const closeBanner = () => {

        let v = JSON.parse(JSON.stringify(view));
        v.showBanner = false;
        setView(v);

    }

    return(
        <div className={styles.banner}>
            <div className={styles.bannerInner}>
                <div className={styles.bannerContent}>
                    Liking shovel? Share it with your friends! Have any comments, questions, or
                    want to share how you're using shovel? Email me at ovelsh.feedback@gmail.com, I'd
                    love to hear from you! 
                </div>
                <div className={styles.bannerCloseOuter}>
                    <div
                        onClick={() => closeBanner()} 
                        className={styles.bannerClose}>
                        Close
                    </div>
                </div>
            </div>
        </div>
    )

}
export default Banner;
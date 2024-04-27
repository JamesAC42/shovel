import Head from 'next/head';
import styles from '../styles/home.module.scss';
import { FaGithubAlt } from "react-icons/fa";
import { FaCircleArrowRight } from "react-icons/fa6";
import Link from 'next/link'; 
import Image from 'next/Image';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Shovel</title>
        <link rel="icon" href="/favicon.ico" />                
      </Head>
      <div className={styles.homeOuter}>
        <div className={styles.title}>
          shovel
        </div>
        <div className={styles.links}>
          <Link
            target="_blank" 
            href="https://github.com/JamesAC42/shovel">
            <FaGithubAlt />
          </Link>
        </div>
        <div className={styles.subheader}>
          A Productivity Tool for Going Deep
        </div>
        <div className={styles.enter}>
          <Link 
            target="_self"
            href="/room">
            <span>
              Try Now for Free 
              <FaCircleArrowRight />
            </span>
          </Link>
        </div>

        <div className={styles.screenshots}>
          <Image src="/images/screenshots.gif"
            width="100"
            height="50"
            alt="Screenshots"/>
        </div>

      </div>

    </div>
  );
}

import Head from 'next/head';
import styles from '../styles/home.module.scss';
import { FaGithubAlt } from "react-icons/fa";
import { TbShovel } from "react-icons/tb";
import Link from 'next/link'; 
import Script from 'next/script'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Shovel</title>
        <link rel="icon" href="/favicon.ico" />                
        <Script defer src="https://umami.ovel.sh/script.js" data-website-id="e4ae69a4-87b0-4bc9-acc6-abd1e533316f"></Script>
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
          <Link href="/room">
            <TbShovel />
          </Link>
        </div>

      </div>

    </div>
  );
}

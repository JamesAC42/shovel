import Head from 'next/head';
import styles from '../styles/home.module.scss';
import { FaGithubAlt } from "react-icons/fa";
import { FaCircleArrowRight } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import Link from 'next/link'; 
import Image from 'next/image';
import NavBar from '../components/NavBar';
import { useEffect, useState } from 'react';

const EnterButton = () => {
  return (
    <div className={styles.enter}>
      <Link 
        target="_self"
        href="/room">
        <span>
          try now for free
          <FaCircleArrowRight />
        </span>
      </Link>
    </div>
  )
}

export default function Home() {

  let [stats, setStats] = useState({});
  
  const getStats = async () => {
    try {
        const response = await fetch(`/api/getStats`);
        const data = await response.json();
        if(data.success) { 
            setStats(data.data);
        }
    } catch(err) {
        console.log(err);
    }
  }

  useEffect(() => {
    getStats();
  }, []);

  return (
    <div>
      <Head>
        <title>shovel</title>
        <link rel="icon" href="/favicon.ico" />                
      </Head>
      <NavBar />
      <div className={styles.homeOuter}>
        <div className={styles.homeSection + " " + styles.homeSectionMain}>
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
            a productivity tool for going deep
          </div>
          <EnterButton />

          <div className={styles.screenshots}>
            <Image src="/images/screenshots.gif"
              width="100"
              height="50"
              alt="Screenshots"/>
          </div>

        </div>
        <div className={styles.homeSection + " " + styles.infoSection}>

          <div className={styles.infoContainer}>
            <div className={styles.infoHeader}>
              what is shovel?
            </div>
            <div className={styles.infoContent}>
              shovel is a productivity tool to help you go deep in your work. it aims to eliminate distractions with a sleek and simple interface that holds your tasks, notes, thoughts, and progress all in one view. create or join a room with up to 5 people to collaborate asynchronously. a daily check in button allows you to build a streak and ensures you get something done every day.
            </div>
          </div>

          <div className={styles.infoContainer}>
            <div className={styles.infoHeader}>
              how does shovel help?
            </div>
            <div className={styles.infoContent}>
              shovel puts the <span className={styles.infoBold}>past</span>, <span className={styles.infoBold}>present</span>, and <span className={styles.infoBold}>future</span> in one space so your mind can focus on the work in front of you. your goals and tasks are for future work, your work grid is for making sure you committed hours of deep work towards your goals every day, and your journal is for jogging down ideas, progress notes, and updates so that there's never too many distracting thoughts running through your mind at once.
            </div>
          </div>

          <div className={styles.infoContainer}>
            <div className={styles.infoHeader}>
              what is deep work? 
            </div>
            <div className={styles.infoContent}>
              deep work is defined as <span className={styles.infoBold}>"distraction free concentration that pushes cognitive abilities to their limit."</span> the fruits of a deep work session are usually hard to reproduce and create new value. it is also known as working in a <span className={styles.infoBold}>flow state</span>. see the book <Link href="https://www.amazon.com/Deep-Work-Focused-Success-Distracted/dp/1455586692" target="_blank">Deep Work</Link> by Cal Newport for more information.
            </div>
          </div>

          <div className={styles.infoContainer}>
            <div className={styles.infoHeader}>
              why should I care?
            </div>
            <div className={styles.infoContent}>
              the ability to go deep is becoming increasingly rare in the modern world due a misguided work culture of quick wins and multitasking. one who can consistently go deep has an <span className={styles.infoBold}>enormous economical advantage </span> over others because the results are meaningful and impossible to reproduce from shallow work - it often results in new insights or difficult to find solutions. deep work can also make you <span className={styles.infoBold}>happier </span>- humans are problem solvers and enjoy being challenged. the flow state is the pinnacle of this mindset and it feels good to be there, even better than relaxing. 
            </div>
          </div>

          <div className={styles.screenshotsOuter}>

            <div className={styles.screenshotsHeader}>features</div>

            <div className={styles.screenshotItem}>
              <div className={styles.screenshotPicture}>
                <Image 
                  src="/images/screenshots/tasks.png"
                  width="1143"
                  height="751"
                  alt="Tasks"/>
              </div>
              <div className={styles.screenshotDescription}>
                <div className={styles.descInner}>
                  <div className={styles.descHeader}>
                    goals and tasks  
                  </div>
                  <div className={styles.descText}>
                    track goals with start and end dates, and add sub-tasks to prioritize and maintain remaining work. give tasks individual tags to help categorize types of work (coming soon: filtering and searching by tag)
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.screenshotItem}>
              <div className={styles.screenshotPicture}>
                <Image 
                  src="/images/screenshots/journal.png"
                  width="2194"
                  height="1756"
                  alt="journal"/>
              </div>
              <div className={styles.screenshotDescription}>
                <div className={styles.descInner}>
                  <div className={styles.descHeader}>
                    daily journal
                  </div>
                  <div className={styles.descText}>
                    write down progress made, notes, ideas, and anything else on your mind in a daily journal entry. your entry can be edited throughout the day, but is locked once the day is over. this is to keep you focused on current affairs instead of worrying about the past.
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.screenshotItem}>
              <div className={styles.screenshotPicture}>
                <Image 
                  src="/images/screenshots/hour_tracker.png"
                  width="851"
                  height="353"
                  alt="hour tracker"/>
              </div>
              <div className={styles.screenshotDescription}>
                <div className={styles.descInner}>
                  <div className={styles.descHeader}>
                    work grid
                  </div>
                  <div className={styles.descText}>
                    quickly record how many hours of deep work you were able to get in each day, indicated by dots in a weekly grid so it's easy to see at a glance the kind of time you are able to dedicate towards your goals. give a day a special highlight to show you accomplished something that day and be reminded that hard work pays off.
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.screenshotItem}>
              <div className={styles.screenshotPicture}>
                <Image 
                  src="/images/screenshots/check_in.png"
                  width="869"
                  height="259"
                  alt="Screenshots"/>
              </div>
              <div className={styles.screenshotDescription}>
                <div className={styles.descInner}>
                  <div className={styles.descHeader}>
                    daily check in
                  </div>
                  <div className={styles.descText}>
                    check in each day and maintain a streak so you know you're putting in the time every day and building momentum. 
                  </div>
                </div>

              </div>
            </div>

            <div className={styles.screenshotItem}>
              <div className={styles.screenshotPicture}>
                <Image 
                  src="/images/screenshots/tabs.png"
                  width="1089"
                  height="426"
                  alt="tabs"/>
              </div>
              <div className={styles.screenshotDescription}>
                <div className={styles.descInner}>
                  <div className={styles.descHeader}>
                    multi-user rooms
                  </div>
                  <div className={styles.descText}>
                    join or create up to 5 different rooms, each with up to 5 people, so you can keep up with what your friends/coworkers are up to, get the latest updates, offer support, provide accountability, or be inspired. see everyone's goals, tasks, journals, hours, and streak in the same room and updated in real time.
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.screenshotItem}>
              <div className={styles.screenshotPicture}>
                <Image 
                  src="/images/screenshots/theme.png"
                  width="634"
                  height="412"
                  alt="theme"/>
              </div>
              <div className={styles.screenshotDescription}>
                <div className={styles.descInner}>
                  <div className={styles.descHeader}>
                    themes
                  </div>
                  <div className={styles.descText}>
                    choose from over 30 themes or customize your own so that your workspace feels like yours.
                  </div>
                </div>
              </div>
            </div>

          </div>

          {
            stats.numberOfRooms ?
            <div className={styles.statsOuter}>
              <div className={styles.statsItem}>
                <span className={styles.statsFigure}>{stats.numberOfUsers}</span> users
              </div>
              <div className={styles.statsItem}>
                <span className={styles.statsFigure}>{stats.numberOfRooms}</span> rooms
              </div>
              <div className={styles.statsItem}>
                <span className={styles.statsFigure}>{stats.totalGoals}</span> goals in progress
              </div>
              <div className={styles.statsItem}>
                <span className={styles.statsFigure}>{stats.totalTasksCompleted}</span> tasks completed
              </div>
              <div className={styles.statsItem}>
                <span className={styles.statsFigure}>{stats.totalHoursTracked}</span> hours of deep work logged
              </div>
              <div className={styles.statsItem}>
                <span className={styles.statsFigure}>{stats.totalJournalEntries}</span> journal entries
              </div>
            </div> : null
          }

          <div className={styles.testimonials}>
            <div className={styles.testimonialsContainer}>
              <div className={styles.testimonialItem}>
                <div className={styles.testimonialText}>
                "I really enjoy using shovel as it makes my days so much more productive. It allows me to see exactly what I want to get done, what I've accomplished, and I can look back at past journals and refresh myself on what I've studied in past days. It helps me to organize task, thoughts, and makes me feel more accomplished!"
                </div>
                <div className={styles.testimonialName}>
                -Anonymous
                </div>
              </div>
              <div className={styles.testimonialItem}>
                <div className={styles.testimonialText}>
                "Shovel is really good because it's simple, elegant and authentic -- you can tell someone is making it with love because they want to help people."
                </div>
                <div className={styles.testimonialName}>
                -Anonymous
                </div>
              </div>
              <div className={styles.testimonialItem}>
                <div className={styles.testimonialText}>
                "As someone with ADHD, I LOVE that you can see everything at once."
                </div>
                <div className={styles.testimonialName}>
                -/u/Ecstatic-Report6131
                </div>
              </div>
              <div className={styles.testimonialItem}>
                <div className={styles.testimonialText}>
                "I love that this can be used for teams, too. And it's SUPER simple, an uncluttered UI, no confusing 'pages' to sort through - the least amount of clicks for me to see everything."
                </div>
                <div className={styles.testimonialName}>
                -/u/Suspicious-Main4788
                </div>
              </div>
  
            </div>
          </div>
          <div className={styles.enterButtonContainer}>
            <div className={styles.linkButtonContainer}>
              <div className={styles.linkButton}>
                <Link 
                  target="_blank"
                  href="https://github.com/JamesAC42/shovel">
                  Github <FaGithubAlt/>
                </Link>
              </div>
              <div className={styles.linkButton}>
                <Link
                  target="_blank"
                  href="mailto:ovelsh.feedback@gmail.com">
                  Email <IoMail/>
                </Link>
              </div>
            </div>
            <EnterButton />
          </div>


        </div>

        <div className={styles.footer}>
          <div>
          shovel © 2024 ovel.sh
          </div>
        </div>


      </div>

    </div>
  );
}

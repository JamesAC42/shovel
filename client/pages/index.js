import Head from 'next/head';
import styles from '../styles/home.module.scss';
import { FaGithubAlt } from "react-icons/fa";
import { FaCircleArrowRight, FaQ } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import Link from 'next/link'; 
import Image from 'next/image';
import NavBar from '../components/NavBar';
import { useEffect, useState } from 'react';
import CustomThemePicker from '../components/room/CustomThemePicker';
import { IoPersonCircleSharp } from "react-icons/io5";
import { IoIosArrowDropdown } from "react-icons/io";

const EnterButton = () => {
  return (
    <div className={styles.enter}>
      <Link 
        target="_self"
        href="/room">
        <span>
          try now for <span className={styles.free}> free</span>
          <FaCircleArrowRight />
        </span>
      </Link>
    </div>
  )
}

const FAQSection = ({question, children}) => {

  let [collapsed, setCollapsed] = useState(true);

  return (
    <div className={styles.infoContainer}>
      <div className={styles.infoHeader}>
        { question }

        <div 
          onClick={() => setCollapsed(!collapsed)}
          className={`${styles.collapseButton} ${collapsed ? styles.collapsed : ''}`}>
          <IoIosArrowDropdown/>
        </div>
      </div>
      <div className={`${styles.infoContent} ${collapsed ? styles.infoCollapsed : ''}`}>
        { children }
      </div>
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
        <title>shovel - productivity tool with journal & todo list</title>
        <link rel="icon" href="/favicon.ico" />                
      </Head>
      <NavBar />
      <CustomThemePicker />
      <div className={styles.homeOuter}>
        <div className={styles.homeSection + " " + styles.homeSectionMain}>
          <div className={styles.banner}>
            <div className={styles.bannerInner}>
              <div className={styles.title}>
                Streamline your {" "}
                <span className={styles.highlight}>focus,</span>
                {" "} boost <span className={styles.highlight}>productivity,</span> and 
                achieve <span className={`${styles.highlight} ${styles.deepWork}`}>{" deep work."}</span>
              </div>
              <div className={styles.subheader}>
              The minimalist productivity app for effortless task management, journaling, and ADHD-friendly time tracking. Simplify your workflow today.
              </div>
              <EnterButton />
            </div>
          </div>

          <div className={styles.screenshotOuter}>
            <div className={styles.screenshots}>
              <Image src="/images/screenshots.gif"
                width="100"
                height="50"
                alt="Screenshots"/>
            </div>
          </div>

        </div>
        <div className={styles.homeSection + " " + styles.infoSection}>

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
                "As someone with ADHD, I LOVE that you can see everything at once."
                </div>
                <div className={styles.testimonialName}>
                <IoPersonCircleSharp />
                /u/Ecstatic-Report6131
                </div>
              </div>
              <div className={styles.testimonialItem}>
                <div className={styles.testimonialText}>
                "Shovel is really good because it's simple, elegant and authentic -- you can tell someone is making it with love because they want to help people."
                </div>
                <div className={styles.testimonialName}>
                <IoPersonCircleSharp />
                Anonymous
                </div>
              </div>
              <div className={styles.testimonialItem}>
                <div className={styles.testimonialText}>
                "I really enjoy using shovel as it makes my days so much more productive. It allows me to see exactly what I want to get done, what I've accomplished, and I can look back at past journals and refresh myself on what I've studied in past days. It helps me to organize task, thoughts, and makes me feel more accomplished!"
                </div>
                <div className={styles.testimonialName}>
                <IoPersonCircleSharp />
                Anonymous
                </div>
              </div>
              <div className={styles.testimonialItem}>
                <div className={styles.testimonialText}>
                "I love that this can be used for teams, too. And it's SUPER simple, an uncluttered UI, no confusing 'pages' to sort through - the least amount of clicks for me to see everything."
                </div>
                <div className={styles.testimonialName}>
                <IoPersonCircleSharp />
                /u/Suspicious-Main4788
                </div>
              </div>
  
            </div>
          </div>

          <div className={styles.sectionHeader}>
            <h2>FAQ</h2>
          </div>

          <FAQSection question="What is Shovel?">
            Shovel is a cutting-edge productivity app designed to enhance focus, boost efficiency, and achieve deep work. With its sleek, minimalist interface, Shovel aims to eliminate distractions by consolidating your tasks, notes, thoughts, and progress all in one view. Perfect for ADHD management, this productivity tool allows you to create or join a collaborative room with up to 5 people, enabling asynchronous teamwork. The daily check-in feature helps you build a productivity streak and ensures consistent task completion, making it an ideal study app for students and professionals alike.
          </FAQSection>

          <FAQSection question="How does shovel help improve productivity?">
            Shovel revolutionizes time management by unifying <span className={styles.infoBold}>past</span>, <span className={styles.infoBold}>present</span>, and <span className={styles.infoBold}>future</span> in a single space, allowing your mind to focus on the work at hand. Future-oriented goals and tasks, a work grid for tracking daily deep work hours, and a built-in journal for capturing ideas and progress notes all contribute to a distraction-free workflow. This comprehensive approach to productivity and efficiency helps manage ADHD symptoms, reduces productivity anxiety, and fosters a balanced work environment, whether you're using it on your iPhone, iPad, Android device, or Mac.
          </FAQSection>

          <FAQSection question="What is deep work and why is it crucial for productivity? ">
              Deep work, a concept popularized by Cal Newport's book "<Link href="https://www.amazon.com/Deep-Work-Focused-Success-Distracted/dp/1455586692" target="_blank">Deep Work</Link>," refers to <span className={styles.infoBold}>distraction-free concentration that pushes cognitive abilities to their limit</span>. It's synonymous with achieving a flow state, resulting in high-quality output that's difficult to replicate. In today's fast-paced world, the ability to engage in deep work is becoming increasingly rare, making it a valuable skill for both academic success and professional growth.
          </FAQSection>

          <FAQSection question="Why should you care about mastering deep work?">
              In an era dominated by shallow work and multitasking, the capacity for deep work provides a <span className={styles.infoBold}>significant economic advantage</span>. It leads to meaningful results and innovations that are impossible to achieve through superficial efforts. Moreover, engaging in deep work can enhance overall well-being. As natural problem-solvers, humans thrive on challenges, and the flow state achieved during deep work sessions can be more fulfilling than mere relaxation. By using Shovel, you're not just organizing tasks – you're cultivating a productivity mindset that can transform your work and study habits, helping you achieve more without burnout.
          </FAQSection>

          <div className={styles.screenshotsOuter}>

            <div className={`${styles.screenshotsHeader} ${styles.sectionHeader}`}>
              <h2>features</h2>
            </div>

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
                    Goal Tracking and Task Management
                  </div>
                  <div className={styles.descText}>
                  Boost your productivity with our goal and task tracking system. Set start and end dates for your objectives, and break them down into manageable sub-tasks to prioritize your workflow. Enhance organization with customizable tags for each task, allowing for easy categorization of your work. (Coming soon: powerful filtering and searching capabilities by tag, including AI powered summaries and organization)
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
                    Daily Digital Journal
                  </div>
                  <div className={styles.descText}>
                    Maximize your productivity and maintain focus with our built-in daily journal. Record your progress, brainstorm ideas, and jot down important notes throughout the day. This ADHD-friendly feature locks entries at the end of each day, encouraging you to stay present and reducing productivity anxiety related to past events.
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
                    Visual Work Grid
                  </div>
                  <div className={styles.descText}>
                    Elevate your time management skills with our intuitive work grid. Easily log your daily deep work hours, visualized as dots in a weekly layout for at-a-glance productivity assessment. Highlight significant accomplishments to reinforce the connection between consistent effort and meaningful results.
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
                  Daily Check-In Streak
                  </div>
                  <div className={styles.descText}>
                  Build a habit of productivity with our daily check-in feature. Maintain your streak to ensure consistent engagement with your goals, fostering momentum and long-term success in your personal and professional endeavors.
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
                  Collaborative Multi-User Rooms
                  </div>
                  <div className={styles.descText}>
                  Enhance team productivity with our multi-user collaboration tool. Create or join up to 5 different rooms, each supporting up to 5 users. Share goals, tasks, journal entries, work hours, and streaks in real-time. Perfect for remote work teams, study groups, or accountability partnerships, this feature promotes mutual support, inspiration, and collective progress tracking.
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
                  Customizable Themes
                  </div>
                  <div className={styles.descText}>
                  Personalize your productivity environment with over 30 pre-designed themes or create your own custom workspace. This feature allows you to tailor your digital workspace to your preferences, enhancing focus and making your productivity journey uniquely yours.
                  </div>
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

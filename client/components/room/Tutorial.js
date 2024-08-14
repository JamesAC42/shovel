import { useState } from "react";
import styles from "../../styles/room/tutorial.module.scss";
import { FiArrowRightCircle } from "react-icons/fi";
import { FiArrowLeftCircle } from "react-icons/fi";
import { FaRegCircle } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import Image from 'next/image';

const pageCount = 9;

function Tutorial({onClose}) {

    const [activePage, setActivePage] = useState(0);

    function nextPage() {
        let n = Math.min(activePage + 1, pageCount - 1);
        setActivePage(n);
    }

    function prevPage() {
        let n  = Math.max(activePage - 1, 0);
        setActivePage(n);
    }

    function renderPages() {
        let circles = [];
        for(let i = 0; i < activePage + 1; i++) {
            circles.push(<FaCircle/>);
        }
        for(let i = 0; i < pageCount - activePage - 1; i++) {
            circles.push(<FaRegCircle/>);
        }
        return circles;
    }

    const style = { 
        transform:"translateX(-" + (activePage * (100 / pageCount)) + "%)"
    }

    return(
        <div className={styles.tutorialContainer}>
            <div className={styles.pageIndicator}>
                {renderPages()}
            </div>
            {
                activePage !== 0 &&
                <div
                    onClick={prevPage} 
                    className={styles.arrowContainer}>
                    <FiArrowLeftCircle />
                </div>
            }
            <div
                style={style} 
                className={styles.tutorialContainerInner}>
                <div className={styles.tutorialContainerPage}>

                    <div className={styles.tutorialTitleImage}>
                        <Image src="/images/shovel image.png" height={200} width={200} alt="shovel"/>
                    </div>
                    <div className={styles.tutorialTitle}>
                        <h1>Shovel: Get Started</h1>
                        <h2>Quick Start Intro</h2>
                        <p>Click the arrow <FiArrowRightCircle/> to get started and learn how Shovel works.</p>
                    </div>

                </div>
                <div className={styles.tutorialContainerPage}>

                    <div className={`${styles.tutorialItemImage} ${styles.goalsImage}`}>
                        <Image src="/images/tutorial/goals.png" layout="fill" objectFit="cover" alt="shovel"/>
                    </div>
                    <div className={styles.tutorialItemInfo}>
                        <div className={styles.tutorialItemInfoHeader}>
                            <h2>Task Management</h2>
                        </div>
                        <div className={styles.tutorialItemInfoContent}>
                            <p>
                            The left panel is where you keep track of your goals and tasks. Enter a short description of your goal in the <span className={styles.emphasis}>"New Goal"</span> field, then click the pen or press the Enter key to <span className={styles.emphasis}>add it to the list.</span>
                            </p>
                        </div>
                    </div>

                </div>
                <div className={styles.tutorialContainerPage}>
                    
                    <div className={`${styles.tutorialItemImage} ${styles.tasksImage}`}>
                        <Image src="/images/tutorial/tasks.png" layout="fill" objectFit="cover" alt="shovel"/>
                    </div>
                    <div className={styles.tutorialItemInfo}>
                        <div className={styles.tutorialItemInfoHeader}>
                            <h2>Edit Tasks</h2>
                        </div>
                        <div className={styles.tutorialItemInfoContent}>
                            <p>
                                Click the + button underneath a goal to <span className={styles.emphasis}>add a new task</span> for that goal. Enter a <span className={styles.emphasis}>description</span> of the task, and optionally some <span className={styles.emphasis}>tags</span> to categorize that task (comma separated). Then click the pen or hit Enter to add it. <span className={styles.emphasis}>Click the X to close</span> the task input. Check off tasks as you complete them. Hover over the task text to <span className={styles.emphasis}>delete</span> by clicking the trash, or <span className={styles.emphasis}>reorder</span> the tasks by dragging the arrows. You can also reorder the goals by dragging the top-right arrows.  
                            </p>
                        </div>
                    </div>
                </div>
                <div className={styles.tutorialContainerPage}>

                    <div className={`${styles.tutorialItemImage} ${styles.journalImage}`}>
                        <Image src="/images/tutorial/journal.png"  layout="fill" objectFit="cover" alt="shovel"/>
                    </div>
                    <div className={styles.tutorialItemInfo}>
                        <div className={styles.tutorialItemInfoHeader}>
                            <h2>Daily Journal</h2>
                        </div>
                        <div className={styles.tutorialItemInfoContent}>
                            <p>
                                The right panel is your daily journal. You can write and edit one entry per day. The side panel shows each month you have an entry for. Entries can be formatted with markdown and given tags to categorize. The buttons in order from top to bottom: <span className={styles.emphasis}>Save</span> (Save the entry), <span className={styles.emphasis}>Delete</span> (Delete today's entry), <span className={styles.emphasis}>Erase</span> (Clear out the entry input but do not delete the entry), <span className={styles.emphasis}>Edit</span> (Copy the saved entry to the input for editing)
                            </p>
                        </div>
                    </div>

                </div>

                <div className={`${styles.tutorialContainerPage} ${styles.column}`}>

                    <div className={`${styles.tutorialItemImage} ${styles.checkinImage}`}>
                        <Image src="/images/tutorial/checkin.png" layout="fill" objectFit="cover" alt="shovel"/>
                    </div>
                    <div className={styles.tutorialItemInfo}>
                        <div className={styles.tutorialItemInfoHeader}>
                            <h2>Daily Check-In</h2>
                        </div>
                        <div className={styles.tutorialItemInfoContent}>
                            <p>
                                Maintain a streak of getting work done everyday with the daily check in. <span className={styles.emphasis}>Click the Check In button</span> to keep a streak going. The numbers in the work grid under "streak" show your <span className={styles.emphasis}>current streak on the left</span> and your <span className={styles.emphasis}>highest streak on the right.</span> <span className={styles.emphasis}>Hover</span> over the numbers to see the dates that the streak started and ended.
                            </p>
                        </div>
                    </div>

                </div>
                
                <div className={`${styles.tutorialContainerPage} ${styles.column}`}>

                    <div className={`${styles.tutorialItemImage} ${styles.workgridImage}`}>
                        <Image src="/images/tutorial/workgrid.png" layout="fill" objectFit="cover" alt="shovel"/>
                    </div>
                    <div className={styles.tutorialItemInfo}>
                        <div className={styles.tutorialItemInfoHeader}>
                            <h2>Work Grid</h2>
                        </div>
                        <div className={styles.tutorialItemInfoContent}>
                            <p>
                                The work grid is for <span className={styles.emphasis}>logging your hours of work</span> so you can see how much time you've committed towards your goals throughout the week at a quick glance. The circles under a day indicate <span className={styles.emphasis}>an hour of work.</span> Click the top circle button to <span className={styles.emphasis}>add an hour</span> to the present day. Click the undo arrow to <span className={styles.emphasis}>remove an hour. </span> Click the bottom circle button to highlight the hours for today, indicating that a <span className={styles.emphasis}>goal or milestone was achieved during that session.</span>
                            </p>
                        </div>
                    </div>

                </div>
                <div className={`${styles.tutorialContainerPage} ${styles.column}`}>

                    <div className={`${styles.tutorialItemImage} ${styles.tabsImage}`}>
                        <Image src="/images/tutorial/tabs.png" layout="fill" objectFit="cover" alt="shovel"/>
                    </div>
                    <div className={styles.tutorialItemInfo}>
                        <div className={styles.tutorialItemInfoHeader}>
                            <h2>Multi-User Rooms</h2>
                        </div>
                        <div className={styles.tutorialItemInfoContent}>
                            <p>
                                When multiple users are in a room, you will be able to see each other's journals, goals, tasks, weekly hours, and streaks <span className={styles.emphasis}>all at once, updating in real time.</span> Tabs will appear above the journal and goal sections allowing you to navigate between each person's content. The work grid will also show <span className={styles.emphasis}>a row for each user.</span>
                            </p>
                        </div>
                    </div>

                </div>
                <div className={styles.tutorialContainerPage}>

                    <div className={`${styles.tutorialItemImage} ${styles.collapseImage}`}>
                        <Image src="/images/tutorial/collapse.png"  layout="fill" objectFit="cover" alt="shovel"/>
                    </div>
                    <div className={styles.tutorialItemInfo}>
                        <div className={styles.tutorialItemInfoHeader}>
                            <h2>Collapse Top Panel</h2>
                        </div>
                        <div className={styles.tutorialItemInfoContent}>
                            <p>
                                Click the arrow in the bottom right of the top panel to collapse it and <span className={styles.emphasis}>see only the journal and goals</span>, allowing you to focus on your current work.
                            </p>
                        </div>
                    </div>

                </div>
                <div className={`${styles.tutorialContainerPage} ${styles.column}`}>

                    <div className={`${styles.tutorialItemImage} ${styles.optionsImage}`}>
                        <Image src="/images/tutorial/options.png" layout="fill" objectFit="cover" alt="shovel"/>
                    </div>
                    <div className={styles.tutorialItemInfo}>
                        <div className={styles.tutorialItemInfoHeader}>
                            <h2>Options and More</h2>
                        </div>
                        <div className={styles.tutorialItemInfoContent}>
                            <p>
                                The buttons on the top left are options and various links. In order from left to right: <span className={styles.emphasis}>Home</span> (navigate back to room selection), <span className={styles.emphasis}>the name of the room and the ID</span> (others can use the ID to request to join the room), <span className={styles.emphasis}>join requests</span> (will show pending requests from users to join the room), <span className={styles.emphasis}>themes</span> (choose a preset theme or customize your own), <span className={styles.emphasis}>public status</span> (click the eye to toggle the room's publicity, meaning anyone with a link can view it), <span className={styles.emphasis}>social</span> (navigate to the forum/updates page), and the <span className={styles.emphasis}>tutorial</span> (click this to open the tutorial again).
                            </p>
                        </div>
                    </div>

                </div>
            </div>
            {
                activePage === pageCount - 1 &&
                <div 
                    onClick={onClose}
                    className={styles.close}>
                    <IoCloseCircle/>
                </div>
            }
            {
                activePage < pageCount - 1 &&
                <div
                    onClick={nextPage} 
                    className={styles.arrowContainer}>
                    <FiArrowRightCircle />
                </div>
            }
        </div>
    )

}

export default Tutorial;
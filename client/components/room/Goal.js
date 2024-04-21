import Task from "./Task";

function Goal({goalItem}) {

    /*
    goalsData[goal.id] = {
        title: goal.title,
        description: goal.description,
        startDate: goal.startDate,
        endDate: goal.endDate,
        goalStatus: goal.status,
        tasks: [
            {
                id: task.id,
                title: task.title,
                description: task.description,
                dateCreated: task.dateCreated,
                dateCompleted: task.dateCompleted,
                tags: [] 
            }
        ]
    };
    */

    const formatDate = (goalDate) => {
        if (!goalDate) {
            return "";
        }
        const date = new Date(goalDate);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }

    let {
        title,
        description,
        startDate,
        endDate,
        goalStatus,
        tasks
    } = goalItem;

    return(
        <div className={styles.goalSection}>
            <h2>Goal <span className={styles.goalDates}>{formatDate(startDate)}-{formatDate(endDate)}</span></h2>
            <div className={styles.taskList}>
                {
                    tasks.map((task) =>
                        <Task taskItem={task}/>
                    )
                }
                <div className={styles.newTaskContainer}>
                    <input type="text" placeholder="New Task"></input>
                    <input type="text" placeholder="tag 1, tag2, ..."></input>
                    <div className={styles.addTask}>
                        <HiPencilAlt />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Goal;
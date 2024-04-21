function Task({taskItem}) {

    /*
    {
        id: task.id,
        title: task.title,
        description: task.description,
        dateCreated: task.dateCreated,
        dateCompleted: task.dateCompleted,
        tags: [] 
    }
    */

    let {
        title,
        description,
        dateCreated,
        dateCompleted,
        tags
    } = taskItem;

    return(
        <div className={`${styles.taskItem} ${styles.taskItemCompleted}`}>
            <div className={styles.taskCheck}>
            </div>
            <div className={styles.taskName}>
                {description}
                {
                    tags.map(tag =>
                        <span className={styles.taskTag}>{tag}</span>
                    )
                }
            </div>
        </div>
    )
}
export default Task;
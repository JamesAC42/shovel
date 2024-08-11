import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import Task from '../Task';
import styles from "../../../styles/room/dragtask.module.scss";
import { PiCaretCircleUpDownFill } from "react-icons/pi";

function SortableTask({id, activeTab, goal, taskItem}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div className={styles.dragItemOuter} ref={setNodeRef} style={style}>
      <div className={styles.dragItemHandle} {...attributes} {...listeners}>
      <PiCaretCircleUpDownFill />
      </div>
      <Task goal={goal} activeTab={activeTab} taskItem={taskItem} />
    </div>
  );
}

export default SortableTask;
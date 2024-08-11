import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import Goal from '../Goal';
import styles from "../../../styles/room/draggoal.module.scss";
import { PiCaretCircleUpDownFill } from "react-icons/pi";

function SortableGoal({id, activeTab, goalItem}) {
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
    <div className={styles.dragGoalOuter} ref={setNodeRef} style={style}>
      <div className={styles.dragGoalHandle} {...attributes} {...listeners}>
        <PiCaretCircleUpDownFill />
      </div>
      <Goal activeTab={activeTab} goalItem={goalItem}/>
    </div>
  );
}

export default SortableGoal;
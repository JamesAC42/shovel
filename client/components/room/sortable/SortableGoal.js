import React, { useContext } from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import Goal from '../Goal';
import styles from "../../../styles/room/draggoal.module.scss";
import { PiCaretCircleUpDownFill } from "react-icons/pi";
import UserContext from '../../../contexts/UserContext';
import RoomContext from '../../../contexts/RoomContext';

function SortableGoal({id, activeTab, goalItem}) {
  let { userInfo } = useContext(UserContext);
  const { roomData } = useContext(RoomContext);
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
      {
        (userInfo?.id && activeTab === userInfo?.id) || (roomData.guest) ?
        <div className={styles.dragGoalHandle} {...attributes} {...listeners}>
          <PiCaretCircleUpDownFill />
        </div> : null
      }
      <Goal activeTab={activeTab} goalItem={goalItem}/>
    </div>
  );
}

export default SortableGoal;
import React, { useContext } from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import Task from '../Task';
import styles from "../../../styles/room/dragtask.module.scss";
import { PiCaretCircleUpDownFill } from "react-icons/pi";
import UserContext from '../../../contexts/UserContext';
import RoomContext from '../../../contexts/RoomContext';

function SortableTask({id, activeTab, goal, taskItem}) {
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
    <div className={styles.dragItemOuter} ref={setNodeRef} style={style}>
      {
        (userInfo?.id && activeTab === userInfo?.id) || (roomData.guest) ?
        <div className={styles.dragItemHandle} {...attributes} {...listeners}>
        <PiCaretCircleUpDownFill />
        </div> : null
      }
      <Task goal={goal} activeTab={activeTab} taskItem={taskItem} />
    </div>
  );
}

export default SortableTask;
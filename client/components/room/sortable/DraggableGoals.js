import React, {useContext, useState} from 'react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import postFetch from "../../../lib/postFetch";

import SortableGoal from './SortableGoal';
import RoomContext from '../../../contexts/RoomContext';
import UserContext from '../../../contexts/UserContext';

function DraggableGoals({activeTab, goals}) {

  let { roomData, setRoomData } = useContext(RoomContext);
  let { userInfo } = useContext(UserContext);

  const getGoalIndex = (goalItems, id) => {
    for(let i = 0; i < goalItems.length; i++) {
      if(goalItems[i].id === id) {
        return i;
      }
    }
    return -1;
  }
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  async function handleDragEnd(event) {
    const {active, over} = event;
    
    if (active.id !== over.id) {

      const oldIndex = getGoalIndex(goals, active.id);
      const newIndex = getGoalIndex(goals, over.id);

      const goalId = goals[oldIndex].id;

      let newData = JSON.parse(JSON.stringify(roomData));
      let userId = newData.guest ? 1 : userInfo.id;
      const newGoals = arrayMove(goals, oldIndex, newIndex);

      for(let i = 0; i < newGoals.length; i++) {
        newGoals[i].order = i + 1;
        newData.users[userId].goals[newGoals[i].id].order = i + 1;
      }
      
      setRoomData(newData);

      if(newData.guest) {
        localStorage.setItem("guest-room", JSON.stringify(newData));
        setRoomData(newData);
      } else {
        await postFetch("/api/updateGoalOrder", {
          room: roomData.id,
          goal: goalId,
          newIndex
        });
      }

    }
  }

  if(!goals) return null;

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={goals}
        strategy={verticalListSortingStrategy}
      >
        {
            goals.map((goal) =>
              <SortableGoal key={goal.id} id={goal.id} activeTab={activeTab} goalItem={goal} />
            )
        }
      </SortableContext>
    </DndContext>
  );
}

export default DraggableGoals;
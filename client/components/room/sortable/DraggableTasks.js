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

import SortableTask from './SortableTask';
import RoomContext from '../../../contexts/RoomContext';
import UserContext from '../../../contexts/UserContext';

function DraggableTasks({tasks, activeTab, goal}) {

  let { roomData, setRoomData } = useContext(RoomContext);
  let { userInfo } = useContext(UserContext);

  const getTaskIndex = (tasks, id) => {
    for(let i = 0; i < tasks.length; i++) {
      if(tasks[i].id === id) {
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
      
      const oldIndex = getTaskIndex(tasks, active.id);
      const newIndex = getTaskIndex(tasks, over.id);

      const taskId = tasks[oldIndex].id;

      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      for(let i = 0; i < newTasks.length; i++) {
        newTasks[i].order = i + 1;
      }

      let newData = JSON.parse(JSON.stringify(roomData));
      let userId = newData.guest ? 1 : userInfo.id;
      newData.users[userId].goals[goal].tasks = newTasks;
      setRoomData(newData);

      if(newData.guest) {
        localStorage.setItem("guest-room", JSON.stringify(newData));
        setRoomData(newData);
      } else {
        await postFetch("/api/updateTaskOrder", {
          room: roomData.id,
          goal: goal,
          task: taskId,
          newIndex
        });
      }

    }
  }

  if(!tasks) return null;

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={tasks}
        strategy={verticalListSortingStrategy}
      >
        {
            tasks.map((task) =>
              <SortableTask key={task.id} id={task.id} activeTab={activeTab} goal={goal} taskItem={task} />
            )
        }
      </SortableContext>
    </DndContext>
  );
}

export default DraggableTasks;
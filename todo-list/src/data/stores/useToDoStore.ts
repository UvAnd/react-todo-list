import { DropResult } from 'react-beautiful-dnd';
import create, { StateCreator, State } from 'zustand'
import { devtools } from 'zustand/middleware'

import { generateId } from '../helpers';

interface Task {
  id: string;
  title: string;
  createdAt: number;
}

interface ToDoStore {
  tasks: Task[];
  createTask: (title: string) => void;
  updateTask: (id: string, title: string) => void;
  removeTask: (id: string) => void;
  onDragEnd: (result: DropResult) => void;
}

function isToDoStore(object: any): object is ToDoStore {
  return 'tasks' in object;
}

const localStorageUpdate = <T extends State> (config: StateCreator<T>):
StateCreator<T> => (set, get, api) => config((nextState, ...args) => {
  console.log('11sdsdssdsd1');
  if (isToDoStore(nextState)) {
    window.localStorage.setItem('tasks', JSON.stringify(nextState.tasks));
  }
  set(nextState, ...args);
}, get, api);

const getCurrentState = () => {
  try {
    const currentState = (JSON.parse(window.localStorage.getItem('tasks') || '[]')) as Task[];
    return currentState;
  }
  catch(err) {
    window.localStorage.setItem('tasks', '[]');
  }

  return [];
}


export const useToDoStore = create<ToDoStore>(localStorageUpdate(devtools((set, get) => ({
  tasks: getCurrentState(),
  createTask: (title: string) => {
    const { tasks } = get();
    const newTask = {
      id: generateId(),
      title,
      createdAt: Date.now(),
    }

    set({
      tasks: [newTask].concat(tasks),
    })
  },
  updateTask: (id: string, title: string) => {
    const { tasks } = get();
    set({
      tasks: tasks.map((task) => ({
        ...task,
        title: task.id === id ? title : task.title,
      }))
    });
  },
  removeTask: (id: string) => {
    const { tasks } = get();
    set({
      tasks: tasks.filter((task) => task.id !== id)
    });
  },

  onDragEnd: (result: DropResult) => {
    const { tasks } = get();
    const newItems = Array.from(tasks);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    set({
      tasks: newItems
    });

    console.log('tasks', tasks);
    console.log('newItems', newItems);
  },
}))));
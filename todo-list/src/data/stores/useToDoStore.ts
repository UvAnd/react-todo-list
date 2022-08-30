// @ts-nocheck
import { DropResult } from 'react-beautiful-dnd';
import create, { StateCreator, State } from 'zustand'
import { devtools } from 'zustand/middleware'

import { generateId, todoTemplate } from '../helpers';

export interface Task {
  id: string;
  title: string;
  createdAt: number;
}
export interface Columns {
  name: string;
  tasks: Task[];
}

interface ToDoStore {
  columns: Columns;
  createTask: (title: string) => void;
  updateTask: (id: string, title: string, column: string) => void;
  removeTask: (id: string, column: string) => void;
  onDragEnd: (result: DropResult) => void;
  createTemplate: () => void;
}

function isToDoStore(object: any): object is ToDoStore {
  return 'columns' in object;
}

const localStorageUpdate = <T extends State> (config: StateCreator<T>):
StateCreator<T> => (set, get, api) => config((nextState, ...args) => {
  if (isToDoStore(nextState)) {
    window.localStorage.setItem('columns', JSON.stringify(nextState.columns));
  }
  set(nextState, ...args);
}, get, api);
const getCurrentColumnsState = (): Columns | never[]  => {
  try {
    const currentState = (JSON.parse(window.localStorage.getItem('columns') || '[]')) as Columns;
    return currentState;
  }
  catch(err) {
    window.localStorage.setItem('columns', '[]');
  }

  return [];
}


export const useToDoStore = create<ToDoStore>(localStorageUpdate(devtools((set, get) => ({
  columns: getCurrentColumnsState(),
  createTask: (title: string) => {

    const { columns } = get();
    const newTask = {
      id: generateId(),
      title,
      createdAt: Date.now(),
    }
    const selectedItem = columns['Requested'].items;

    const newColumns = {
      ...columns,
      ['Requested']: {
        ...columns['Requested'],
        items: [newTask].concat(selectedItem)
      }
    }
    set({
      columns: newColumns,
    })
  },
  updateTask: (id: string, title: string, column: string) => {
    const { columns } = get();
    const columnMain = columns[column];
    const copiedItems = [...columnMain.items];
    const newColumn = copiedItems.map((task: any) => ({
      ...task,
      title: task.id === id ? title : task.title,
    }));
    const newColumns = {
      ...columns,
      [column]: {
        ...columnMain,
        items: newColumn
      }
    }

    set({
      columns: newColumns,
    });
  },
  removeTask: (id: string, column: string) => {
    const { columns } = get();
    const columnMain = columns[column];
    const selectedItem = columns[column].items;
    const resultItem = selectedItem.filter((task: any) => task.id !== id);
    const newColumns = {
      ...columns,
      [column]: {
        ...columnMain,
        items: resultItem
      }
    }
    set({
      columns: newColumns,
    });
  },

  onDragEnd: (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const { columns } = get();
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      const newColumns = {
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      }
      set({
        columns: newColumns
      });
    } else {
      const { columns } = get();
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      const newColumns = {
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      }
      set({
        columns: newColumns
      });
    }
  },

  createTemplate: () => {
    console.log('111', window.localStorage);
    window.localStorage.setItem('columns', JSON.stringify(todoTemplate));
    document.location.reload();
  },
}))));
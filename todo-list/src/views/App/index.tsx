import React from "react";

import { Task, useToDoStore } from "../../data/stores/useToDoStore"
import { InputPlus } from "../components/InputPlus";
import { InputTask } from "../components/InputTask";
import cx from "classnames";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot, DraggableProvided, DraggableStateSnapshot
} from 'react-beautiful-dnd';

import styles from './index.module.scss';

export const App: React.FC = () => {

  const [
    columns,
    createTask,
    updateTask,
    removeTask,
    onDragEnd,
    createTemplate,
  ] = useToDoStore(state => [
    state.columns,
    state.createTask,
    state.updateTask,
    state.removeTask,
    state.onDragEnd,
    state.createTemplate,
  ]);

  return (
    <div className={styles.article}>
      <>
      <section className="global-start-section">
        <div className="global-start-item">
          <h1 className="global-start-title">Global Element</h1>
        </div>
      </section>
      <h2 className={styles.articleTitle}>TODO App</h2>
      <section className={styles.articleSection}>
        <InputPlus onAdd={(title)=> {
          if (title) {
            createTask(title)
          }
        }}></InputPlus>
      </section>
      {console.log('1111', Array.isArray(columns))}
      {Array.isArray(columns) ? (
        <section className={styles.articleEmpty}>
          <button onClick={createTemplate}>Create Template</button>
        </section>
      ) : (
      <section className={styles.articleSectionDrag}>
        <>
          <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div className={styles.dragDropContext} key={columnId}>
                <h2>{column.name}</h2>
                <div>

                <Droppable droppableId={columnId} key={columnId}>
                  {(provided:DroppableProvided, snapshot:DroppableStateSnapshot) => (
                    <div
                      {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={cx(styles.dragDropContextItem, {
                          [styles.dragDropContextItemDragging]: snapshot.isDraggingOver,
                        })}
                      >
                      {column.items.map((item: Task, index: number) => (
                        <Draggable  key={item.id} draggableId={item.id} index={index}>
                          {(providedDraggable:DraggableProvided, snapshotDraggable:DraggableStateSnapshot) => (
                              <div
                                ref={providedDraggable.innerRef}
                                {...providedDraggable.draggableProps}
                                {...providedDraggable.dragHandleProps}
                                className={cx(styles.draggable, {
                                  [styles.isDragging]: snapshotDraggable.isDragging,
                                })}
                              >
                              <InputTask
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                onDone={removeTask}
                                onEdited={updateTask}
                                onRemoved={removeTask}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                </div>
              </div>
            )})}
          </DragDropContext>
        </>
      </section>
      )}
      </>
    </div>
  );
}
import React, { useEffect, useState } from "react";

import { useToDoStore } from "../../data/stores/useToDoStore"
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
    tasks,
    createTask,
    updateTask,
    removeTask,
    onDragEnd,
  ] = useToDoStore(state => [
    state.tasks,
    state.createTask,
    state.updateTask,
    state.removeTask,
    state.onDragEnd,
  ]);

  return (
    <article className={styles.article}>
      <h1 className={styles.articleTitle}>TODO App</h1>
      <section className={styles.articleSection}>
        <InputPlus onAdd={(title)=> {
          if (title) {
            createTask(title)
          }
        }}></InputPlus>
      </section>
      <section className={styles.articleSection}>
        <>
          {!tasks.length && (<p className={styles.articleText}>There is no one task</p>)}

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided:DroppableProvided, snapshot:DroppableStateSnapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef} snapshot={snapshot}>
                  {tasks.map((item, index) => (
                    <Draggable  key={item.id} draggableId={item.id} index={index}>
                      {(providedDraggable:DraggableProvided, snapshotDraggable:DraggableStateSnapshot) => (
                          <div
                            ref={providedDraggable.innerRef}
                            snapshot={snapshotDraggable}
                            {...providedDraggable.draggableProps}
                            {...providedDraggable.dragHandleProps}
                            // className={styles.draggable}
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
          </DragDropContext>
        </>
      </section>
    </article>
  );
}
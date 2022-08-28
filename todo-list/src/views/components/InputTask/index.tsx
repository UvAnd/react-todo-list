import React, { useEffect, useRef, useState } from "react";

import styles from './index.module.scss';

interface InputTaskProps {
  id: string;
  title: string;
  onDone: (id: string, column: string) => void;
  onEdited: (id: string, title: string, column: string) => void;
  onRemoved: (id: string, column: string) => void;
}

export const InputTask: React.FC<InputTaskProps> = ({
  id,
  title,
  onDone,
  onEdited,
  onRemoved,
}) => {

  const [checked, setChecked] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [value, setValue] = useState(title);
  const editTitleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditMode) {
      editTitleInputRef?.current?.focus();
    }
  }, [isEditMode]);

  let column = "Requested";

  const setColumn = (e: any) => {
    const targetElement = e.target.closest('div[data-rbd-droppable-id]');
    column = targetElement.getAttribute('data-rbd-droppable-id');
  }

  return (
    <div className={styles.inputTask}>
      <img className={styles.inputTaskDrag} src="/drag.png"></img>
      <label className={styles.inputTaskLabel}>
        <input
          className={styles.inputTaskCheckbox}
          type="checkbox"
          checked={checked}
          onChange={(evn) => {
            setChecked(evn.target.checked);
            setColumn(evn);
            evn.target.checked && setTimeout(() => {onDone(id, column)}, 200);
          }}
          disabled={isEditMode}
        />
        {isEditMode ? (
          <input
            className={styles.inputTaskEditTitle}
            value={value}
            onChange={(evt) => {
              setValue(evt.target.value);
            }}
            onKeyDown={(evt) => {
              if (evt.key  === 'Enter') {
                setColumn(evt);
                onEdited(id, value, column);
                setIsEditMode(false);
              }
            }}

          ref={editTitleInputRef}
          />
        ) : (
          <h3 className={styles.inputTaskTitle}>{title}</h3>
        )}
      </label>


      {isEditMode ? (
        <button
          className={styles.inputTaskSave}
          onClick={(evn) => {
            setColumn(evn);
            onEdited(id, value, column);
            setIsEditMode(false);
          }}
          aria-label="Save"
        >
        </button>
      ) : (
        <button
          className={styles.inputTaskEdit}
          onClick={() => {setIsEditMode(true)}}
          aria-label="Edit"
        >
        </button>
      )}

      <button
        className={styles.inputTaskRemove}
        onClick={(evn) => {confirm('Are you sure?') && setColumn(evn); onRemoved(id, column);}}
        aria-label="Remove"
      >
      </button>
    </div>
  );
}
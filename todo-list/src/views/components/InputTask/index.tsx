import React, { useEffect, useRef, useState } from "react";

import styles from './index.module.scss';

interface InputTaskProps {
  id: string;
  title: string;
  onDone: (id: string) => void;
  onEdited: (id: string, title: string) => void;
  onRemoved: (id: string) => void;
}

export const InputTask: React.FC<InputTaskProps> = ({
  id,
  title,
  onDone,
  onEdited,
  onRemoved,
}) => {
  console.log(332323);

  const [checked, setChecked] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [value, setValue] = useState(title);
  const editTitleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditMode) {
      editTitleInputRef?.current?.focus();
    }
  }, [isEditMode]);

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

            evn.target.checked && setTimeout(() => {onDone(id)}, 200);
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
                onEdited(id, value);
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
          onClick={() => {
            onEdited(id, value);
            setIsEditMode(false);
          }}
          aria-label="Save"
        >
        </button>
      ) : (
        <button
          className={styles.inputTaskEdit}
          onClick={() => {setIsEditMode(true )}}
          aria-label="Edit"
        >
        </button>
      )}

      <button
        className={styles.inputTaskRemove}
        onClick={() => {confirm('Are you sure?') && onRemoved(id)}}
        aria-label="Remove"
      >
      </button>
    </div>
  );
}
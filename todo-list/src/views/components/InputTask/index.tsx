import React, { useCallback, useState } from "react";

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

  const [checked, setChecked] = useState(false)

  return (
    <div className={styles.inputTask}>
      <label className={styles.inputTaskLabel}>
        <input
          className={styles.inputTaskCheckbox}
          type="checkbox"
          checked={checked}
          onChange={(evn) => {
            setChecked(evn.target.checked);

            evn.target.checked && onDone(id);
          }}
        />
        <h3 className={styles.inputTaskTitle}>{title}</h3>
      </label>

      <button
        className={styles.inputTaskEdit}
        onClick={() => {confirm('Are you sure?') && onRemoved(id)}}
        aria-label="Edit"
      >
      </button>
      <button
        className={styles.inputTaskRemove}
        onClick={() => {confirm('Are you sure?') && onRemoved(id)}}
        aria-label="Remove"
      >
      </button>
    </div>
  );
}
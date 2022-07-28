import React, { useCallback, useState } from "react";

import styles from './index.module.scss';

interface InputPlusProps {
  onAdd: (title: string) => void;
}

export const InputPlus: React.FC<InputPlusProps> = ({onAdd}) => {
  const [inputValue, seInputValue] = useState('');
  const addTask = useCallback(() => {
    onAdd(inputValue);
    seInputValue('');
  }, [inputValue])

  return (
    <div className={styles.inputPlus}>
      <input
        className={styles.inputPlusValue}
        type="text"
        value={inputValue}
        onChange={(evn) => seInputValue(evn.target.value)}
        onKeyDown={(evn) => {
          if (evn.key === 'Enter') {
            addTask()
          }
        }}
      />
      <button
        className={styles.inputPlusButton}
        onClick={addTask}
        aria-label="Add new todo"
      >
      </button>
    </div>
  );
}
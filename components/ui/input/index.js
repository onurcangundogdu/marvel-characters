import { useState, useEffect, useCallback } from 'react';

import styles from './input.module.css';

const Input = ({ initialValue, onTermChange, ...props }) => {
  const [value, setValue] = useState(initialValue);
  const [searchTerm, setSearchTerm] = useState(initialValue);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(value);
    }, parseInt(process.env.NEXT_PUBLIC_SEARCH_DELAY));

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value]);

  const changeHandler = useCallback(e => {
    setValue(e.target.value);
  }, []);

  useEffect(() => {
    onTermChange(searchTerm);
  }, [searchTerm, onTermChange]);

  return (
    <input
      type="text"
      className={styles.input}
      value={value}
      onChange={changeHandler}
      {...props}
    />
  );
};

export default Input;

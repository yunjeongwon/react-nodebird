import { useState, useCallback } from 'react';

const useInput = (initialState = null) => {
  const [value, setValue] = useState(initialState);
  const handler = useCallback((e) => {
    setValue(e.target.value);
  }, []);
  return [value, handler, setValue];
};

export default useInput;

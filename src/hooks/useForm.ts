import React, { useState } from 'react';

export function useForm<T extends Record<string, any>>(inputValues: T) {
  const [values, setValues] = useState<T>(inputValues);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return { values, handleChange, setValues };
}

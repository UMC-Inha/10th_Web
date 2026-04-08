import { useState } from 'react';

type ValidationRules<T> = {
  [K in keyof T]?: (value: string) => string | null;
};

function useForm<T extends Record<string, string>>(
  initialValues: T,
  validationRules: ValidationRules<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = (name: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validationRules[name]?.(value) ?? null;
      setErrors((prev) => ({ ...prev, [name]: error ?? undefined }));
    }
  };

  const handleBlur = (name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validationRules[name]?.(values[name]) ?? null;
    setErrors((prev) => ({ ...prev, [name]: error ?? undefined }));
  };

  const isValid = (Object.keys(validationRules) as (keyof T)[]).every(
    (key) => validationRules[key]?.(values[key]) === null
  );

  return { values, errors, touched, handleChange, handleBlur, isValid };
}

export default useForm;

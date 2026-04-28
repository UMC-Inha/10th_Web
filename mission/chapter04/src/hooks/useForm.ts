import { useCallback, useMemo, useState, type ChangeEvent } from 'react';

export type FormValues = Record<string, string>;

export type UseFormOptions<V extends FormValues> = {
  initialValues: V;
  validate: (values: V) => Partial<Record<keyof V, string | undefined>>;
};

export function useForm<V extends FormValues>({ initialValues, validate }: UseFormOptions<V>) {
  const [values, setValues] = useState<V>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof V, boolean>>>({});

  const fieldErrors = useMemo(() => validate(values), [values, validate]);

  const errors = useMemo(() => {
    const out: Partial<Record<keyof V, string>> = {};
    (Object.keys(fieldErrors) as (keyof V)[]).forEach((key) => {
      const msg = fieldErrors[key];
      if (touched[key] && msg) {
        out[key] = msg;
      }
    });
    return out;
  }, [fieldErrors, touched]);

  const handleChange = useCallback(
    (name: keyof V) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValues((prev) => ({ ...prev, [name]: value } as V));
    },
    [],
  );

  const handleBlur = useCallback((name: keyof V) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    fieldErrors,
    touched,
    handleChange,
    handleBlur,
    reset,
    setValues,
  };
}

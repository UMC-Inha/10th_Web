import { useCallback, useMemo } from 'react';
import { getLoginFieldErrors, isLoginFormValid, LOGIN_FORM_INITIAL } from '../constants/loginValidation';
import type { LoginValues } from '../types/loginForm';
import { useForm } from './useForm';

export function useLoginForm() {
  const validate = useCallback((values: LoginValues) => getLoginFieldErrors(values), []);

  const { values, errors, handleChange, handleBlur, reset } = useForm<LoginValues>({
    initialValues: LOGIN_FORM_INITIAL,
    validate,
  });

  const canSubmit = useMemo(() => isLoginFormValid(values), [values]);

  return {
    values,
    errors,
    handleChange,
    handleBlur,
    canSubmit,
    reset,
  };
}

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginFormValues } from '../schemas/authSchema';

export function useLoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const values = form.watch();

  const canSubmit = useMemo(() => loginSchema.safeParse(values).success, [values]);

  return {
    ...form,
    canSubmit,
  };
}

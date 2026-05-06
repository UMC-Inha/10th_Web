import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, type FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import {
  signupEmailSchema,
  signupPasswordSchema,
  signupProfileSchema,
  signupSchema,
  type SignupFormValues,
} from '../schemas/authSchema';
import type { SignupStep } from '../types/signupForm';

export type UseSignupWizardFormOptions = {
  onSubmitSuccess: (values: SignupFormValues) => void;
};

export function useSignupWizardForm({ onSubmitSuccess }: UseSignupWizardFormOptions) {
  const [step, setStep] = useState<SignupStep>('email');
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
    },
  });

  const values = form.watch();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setPasswordConfirmVisible] = useState(false);

  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;
  const passwordConfirmError = form.formState.errors.passwordConfirm?.message;
  const nicknameError = form.formState.errors.nickname?.message;

  const canGoPasswordStep = useMemo(
    () => signupEmailSchema.safeParse({ email: values.email ?? '' }).success,
    [values.email],
  );
  const canGoProfileStep = useMemo(
    () =>
      signupPasswordSchema.safeParse({
        password: values.password ?? '',
        passwordConfirm: values.passwordConfirm ?? '',
      }).success,
    [values.password, values.passwordConfirm],
  );
  const canSubmit = useMemo(
    () =>
      signupProfileSchema.safeParse({
        nickname: values.nickname ?? '',
      }).success,
    [values.nickname],
  );

  const handleEmailNext = async (event: FormEvent) => {
    event.preventDefault();
    const isValid = await form.trigger('email');
    if (!isValid) return;
    setStep('password');
  };

  const handlePasswordNext = async (event: FormEvent) => {
    event.preventDefault();
    const isValid = await form.trigger(['password', 'passwordConfirm']);
    if (!isValid) return;
    setStep('profile');
  };

  const handleSignupSubmit = form.handleSubmit((formValues) => {
    onSubmitSuccess(formValues);
  });

  return {
    ...form,
    step,
    values,
    emailError,
    passwordError,
    passwordConfirmError,
    nicknameError,
    canGoPasswordStep,
    canGoProfileStep,
    canSubmit,
    isPasswordVisible,
    isPasswordConfirmVisible,
    setPasswordVisible,
    setPasswordConfirmVisible,
    handleEmailNext,
    handlePasswordNext,
    handleSignupSubmit,
  };
}

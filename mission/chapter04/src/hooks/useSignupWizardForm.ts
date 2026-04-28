import { useMemo, useState, type FormEvent } from 'react';
import {
  getSignupEmailError,
  getSignupNicknameError,
  getSignupPasswordConfirmError,
  getSignupPasswordError,
  isSignupEmailValid,
  isSignupNicknameValid,
  isSignupPasswordStepValid,
} from '../constants/signupValidation';
import type { SignupStep, SignupTouched, SignupValues } from '../types/signupForm';

export type UseSignupWizardFormOptions = {
  onComplete: () => void;
};

const INITIAL_SIGNUP_VALUES: SignupValues = {
  email: '',
  password: '',
  passwordConfirm: '',
  nickname: '',
};

const INITIAL_TOUCHED: SignupTouched = {
  email: false,
  password: false,
  passwordConfirm: false,
  nickname: false,
};

export function useSignupWizardForm({ onComplete }: UseSignupWizardFormOptions) {
  const [step, setStep] = useState<SignupStep>('email');
  const [values, setValues] = useState<SignupValues>(INITIAL_SIGNUP_VALUES);
  const [touched, setTouched] = useState<SignupTouched>(INITIAL_TOUCHED);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setPasswordConfirmVisible] = useState(false);

  const setField = <K extends keyof SignupValues>(key: K, value: SignupValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const touchField = (key: keyof SignupValues) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const emailError = useMemo(
    () => getSignupEmailError(values.email, touched.email),
    [touched.email, values.email],
  );

  const passwordError = useMemo(
    () => getSignupPasswordError(values.password, touched.password),
    [touched.password, values.password],
  );

  const passwordConfirmError = useMemo(
    () => getSignupPasswordConfirmError(values.password, values.passwordConfirm, touched.passwordConfirm),
    [touched.passwordConfirm, values.password, values.passwordConfirm],
  );

  const nicknameError = useMemo(
    () => getSignupNicknameError(values.nickname, touched.nickname),
    [touched.nickname, values.nickname],
  );

  const canGoPasswordStep = isSignupEmailValid(values.email);
  const canGoProfileStep = isSignupPasswordStepValid(values.password, values.passwordConfirm);
  const canSubmit = isSignupNicknameValid(values.nickname);

  const handleEmailNext = (event: FormEvent) => {
    event.preventDefault();
    touchField('email');
    if (!canGoPasswordStep) return;
    setStep('password');
  };

  const handlePasswordNext = (event: FormEvent) => {
    event.preventDefault();
    touchField('password');
    touchField('passwordConfirm');
    if (!canGoProfileStep) return;
    setStep('profile');
  };

  const handleSignupSubmit = (event: FormEvent) => {
    event.preventDefault();
    touchField('nickname');
    if (!canSubmit) return;
    onComplete();
  };

  return {
    step,
    values,
    touched,
    setField,
    touchField,
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

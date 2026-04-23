import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

interface useFormProps<T> {
  defaultValues: T;
  mode?: "onBlur" | "onChange" | "onSubmit";
}

interface Rules {
  required?: string;
  pattern?: { value: RegExp; message: string };
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
}

const useForm = <T extends Record<string, string>>({
  defaultValues,
  mode = "onSubmit",
}: useFormProps<T>) => {
  const [values, setValues] = useState<T>(defaultValues); // 각 필드의 현재 값
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({}); // 각 필드의 에러 메시지
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({}); // 유저가 건드린 필드 여부
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // 제출 중 여부
  const rulesRef = useRef<Partial<Record<keyof T, Rules>>>({}); // 필드별 rules 저장소

  // 인풋에 스프레드해서 폼과 연결
  const register = (name: keyof T, rules?: Rules) => {
    rulesRef.current[name] = rules;
    return {
      value: values[name],
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        setValues((prev) => ({ ...prev, [name]: e.target.value }));
        if (rules && mode === "onChange") {
          const error = validate(e.target.value, rules);
          setErrors((prev) => ({ ...prev, [name]: error }));
        }
      },
      onBlur: () => {
        setTouched((prev) => ({ ...prev, [name]: true }));
        if (rules && mode === "onBlur") {
          const error = validate(values[name], rules);
          setErrors((prev) => ({ ...prev, [name]: error }));
        }
      },
    };
  };

  // 값과 rules 받아서 에러 메시지 반환, 통과하면 undefined
  const validate = (value: string, rules: Rules) => {
    if (rules.required && value.trim() === "") {
      return rules.required;
    }
    if (rules.minLength && value.trim().length < rules.minLength.value) {
      return rules.minLength.message;
    }
    if (rules.maxLength && value.trim().length > rules.maxLength.value) {
      return rules.maxLength.message;
    }
    if (rules.pattern && !rules.pattern.value.test(value)) {
      return rules.pattern.message;
    }
  };

  const isValid =
    Object.keys(rulesRef.current).length > 0 &&
    Object.keys(rulesRef.current).every((name) => {
      const rules = rulesRef.current[name as keyof T];
      if (!rules) return true;
      const error = validate(values[name as keyof T], rules);
      return !error;
    });

  const handleSubmit =
    (onSubmit: (values: T) => Promise<void> | void) => async (e: FormEvent) => {
      e.preventDefault();

      // 모든 필드 검사하면서 newErrors 만들기
      const newErrors: Partial<Record<keyof T, string>> = {};
      Object.entries(rulesRef.current).forEach(([name, rules]) => {
        if (rules) {
          const error = validate(values[name as keyof T], rules);
          if (error) newErrors[name as keyof T] = error;
        }
      });

      // 에러 있으면 중단
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // 에러 없으면 제출
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    };
  return {
    register,
    handleSubmit,
    formState: { errors, touched, isValid, isSubmitting },
  };
};

export default useForm;

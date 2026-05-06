import { useEffect, useState, type ChangeEvent } from 'react';

interface UseFormProps<T> {
  initialValue: T;
  //값이 올바른지 검증하는 함수
  validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
  const [values, setValues] = useState(initialValue);

  //"email": true -> touch 됨
  //"password": false -> touch 안 됨
  const [touched, setTouched] = useState<Record<string, boolean>>();

  //"email": 이메일은 반드시 @를 포함해야 합니다.
  const [errors, setErrors] = useState<Record<string, string>>();

  //사용자가 입력값 바꿀 때 실행되는 함수
  const handleChange = (name: keyof T, text: string) => {
    setValues({
      ...values, //기존 입력값 유지
      [name]: text,
    });
  };

  const handleBlur = (name: keyof T) => {
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  //이메일과 비밀번호 인풋, 속성들을 가져오는 것
  const getInputProps = (name: keyof T) => {
    const value = values[name];
    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      handleChange(name, e.target.value);
    const onBlur = () => handleBlur(name);

    return { value, onChange, onBlur };
  };

  //values가 변경될 때 에러검증 로직
  //변경될 때마다 로직이 변경되어야 하니 useEffect 사용
  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors); //오류 메시지 업데이트
  }, [validate, values]);

  return {values, errors, touched, getInputProps};
}

export default useForm;
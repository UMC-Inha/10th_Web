import { useState, type ChangeEvent } from "react";

interface UseFormProps<T> {
    initialValue: T;
    validate: (values: T) => Record<keyof T, string>;
}

export const useForm = <T extends Record<string, any>>({
    initialValue,
    validate,
}: UseFormProps<T>) => {
    const [values, setValues] = useState<T>(initialValue);
    const [errors, setErrors] = useState<Record<keyof T, string>>({} as any);
    const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as any);

    // 값이 변경될 때 실행
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    // 포커스가 나갈 때(Blur) 유효성 검사 실행
    const handleBlur = (name: keyof T) => {
        setTouched({ ...touched, [name]: true });
        const validationErrors = validate(values);
        setErrors(validationErrors);
    };

    // input 태그에 뿌려줄 props 생성기
    const getInputProps = (name: keyof T) => ({
        name: name as string,
        value: values[name],
        onChange: handleChange,
        onBlur: () => handleBlur(name),
    });

    return {
        values,
        errors,
        touched,
        getInputProps,
    };
};
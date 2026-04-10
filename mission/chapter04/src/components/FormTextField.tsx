import type { ChangeEventHandler } from 'react';

export const FORM_TEXT_FIELD_TYPES = ['email', 'password', 'text'] as const;

export type FormTextFieldType = (typeof FORM_TEXT_FIELD_TYPES)[number];

export type FormTextFieldProps = {
  id: string;
  label: string;
  type?: FormTextFieldType;
  name?: string;
  autoComplete?: string;
  placeholder?: string;
  value: string;
  error?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: () => void;
};

function FormTextField({
  id,
  label,
  type = 'text',
  name,
  autoComplete,
  placeholder,
  value,
  error,
  onChange,
  onBlur,
}: FormTextFieldProps) {
  return (
    <div className="login__field">
      <label className="login__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`login__input ${error ? 'login__input--error' : ''}`}
        type={type}
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error ? <p className="login__error">{error}</p> : null}
    </div>
  );
}

export default FormTextField;

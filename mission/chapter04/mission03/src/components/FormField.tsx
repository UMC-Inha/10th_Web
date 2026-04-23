interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

const FormField = ({ id, label, error, children }: FormFieldProps) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-xs tracking-widest text-neutral-500 uppercase">
      {label}
    </label>
    {children}
    {error && (
      <p className="text-xs text-rose-400 tracking-wide">{error}</p>
    )}
  </div>
);

export default FormField;

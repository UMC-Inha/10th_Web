interface SubmitButtonProps {
  disabled?: boolean;
  isSubmitting?: boolean;
  label: string;
  loadingLabel?: string;
}

const SubmitButton = ({
  disabled,
  isSubmitting,
  label,
  loadingLabel,
}: SubmitButtonProps) => (
  <button
    type="submit"
    disabled={disabled || isSubmitting}
    className="mt-2 bg-neutral-800 text-white text-xs tracking-[0.2em] uppercase py-3 hover:bg-neutral-600 transition-colors duration-300 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
  >
    {isSubmitting && loadingLabel ? loadingLabel : label}
  </button>
);

export default SubmitButton;

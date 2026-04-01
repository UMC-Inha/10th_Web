const LoadingSpinner = ({ label = '불러오는 중…' }: { label?: string }) => {
  return (
    <div
      className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-gray-600"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span
        className="size-10 animate-spin rounded-full border-2 border-red-100 border-t-red-800"
        aria-hidden
      />
      <span className="text-sm">{label}</span>
    </div>
  );
};

export default LoadingSpinner;

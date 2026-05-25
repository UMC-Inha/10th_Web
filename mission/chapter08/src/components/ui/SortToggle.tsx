import { LP_SORT_ORDER_LABELS, type LpSortOrder } from '../../types/lp';

const SORT_TOGGLE_SIZE_STYLES = {
  sm: 'rounded-md border px-3 py-1 text-xs',
  md: 'rounded-lg border px-4 py-1.5 text-sm',
} as const;

type SortToggleSize = keyof typeof SORT_TOGGLE_SIZE_STYLES;

type SortToggleProps = {
  value: LpSortOrder;
  onChange: (order: LpSortOrder) => void;
  size?: SortToggleSize;
};

const sortOrderEntries = Object.entries(LP_SORT_ORDER_LABELS) as [LpSortOrder, string][];

function SortToggle({ value, onChange, size = 'sm' }: SortToggleProps) {
  const baseClass = `${SORT_TOGGLE_SIZE_STYLES[size]} font-medium transition-colors`;

  return (
    <div className="flex gap-1.5">
      {sortOrderEntries.map(([order, label]) => (
        <button
          key={order}
          onClick={() => onChange(order)}
          className={[
            baseClass,
            value === order
              ? 'border-pink-500 bg-pink-500 text-white'
              : 'border-white/20 text-slate-400 hover:border-white/40',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default SortToggle;

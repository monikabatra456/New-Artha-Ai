import React from "react";
import { X, Check } from "lucide-react";

export type SortOption = "relevance" | "priority" | "newest" | "deadline";

interface SortBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentSort: SortOption;
  onSelect: (sort: SortOption) => void;
}

export const SortBottomSheet: React.FC<SortBottomSheetProps> = ({
  isOpen,
  onClose,
  currentSort,
  onSelect,
}) => {
  if (!isOpen) return null;

  const options: { id: SortOption; label: string; desc: string }[] = [
    { id: "relevance", label: "Most relevant", desc: "Ranked by overall 6-factor eligibility match" },
    { id: "priority", label: "Highest priority", desc: "Critical immediate statutory actions first" },
    { id: "newest", label: "Newest verified", desc: "Most recently audited government schemes" },
    { id: "deadline", label: "Deadline soonest", desc: "Schemes with nearest closing application dates" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 sm:items-center sm:p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sort Opportunities</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close sort dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 divide-y divide-slate-100 dark:divide-slate-800">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onSelect(opt.id);
                onClose();
              }}
              className="flex min-h-[44px] w-full items-center justify-between py-3 text-left transition hover:text-blue-600 active:scale-[0.99]"
            >
              <div>
                <p className={`text-xs font-semibold ${currentSort === opt.id ? "text-blue-600 dark:text-blue-400" : "text-slate-800 dark:text-slate-200"}`}>
                  {opt.label}
                </p>
                <p className="text-[11px] text-slate-400">{opt.desc}</p>
              </div>
              {currentSort === opt.id && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

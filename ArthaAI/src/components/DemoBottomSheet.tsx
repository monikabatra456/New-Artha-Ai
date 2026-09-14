import React from "react";
import { X, ArrowRight, Factory, UtensilsCrossed, Laptop, Palette } from "lucide-react";
import { DEMO_PROFILES, DemoProfileOption } from "../data/demoProfiles";
import { BusinessProfile } from "../types";

interface DemoBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (profile: BusinessProfile) => void;
}

export const DemoBottomSheet: React.FC<DemoBottomSheetProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  if (!isOpen) return null;

  const demoItems: { id: string; name: string; subtitle: string; icon: any; profile: BusinessProfile }[] = [
    {
      id: "demo-textile",
      name: "Textile business",
      subtitle: "Small • Delhi",
      icon: Factory,
      profile: DEMO_PROFILES[0].profile,
    },
    {
      id: "demo-food",
      name: "Food business",
      subtitle: "Micro • Maharashtra",
      icon: UtensilsCrossed,
      profile: DEMO_PROFILES[1].profile,
    },
    {
      id: "demo-tech",
      name: "Technology business",
      subtitle: "Small • Karnataka",
      icon: Laptop,
      profile: DEMO_PROFILES[2].profile,
    },
    {
      id: "demo-artisan",
      name: "Artisan business",
      subtitle: "Micro • Rajasthan",
      icon: Palette,
      profile: DEMO_PROFILES[3].profile,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 sm:items-center sm:p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Choose a demo business
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a preconfigured MSME to preview opportunities
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close demo choices"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Compact List of Demo Profiles (Height 56-72px each) */}
        <div className="mt-3.5 space-y-2.5">
          {demoItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item.profile);
                  onClose();
                }}
                className="group flex min-h-[64px] w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-left transition hover:border-blue-500 hover:bg-blue-50/50 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-blue-500 dark:hover:bg-slate-800 active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-2xs dark:bg-slate-700 dark:text-blue-400">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

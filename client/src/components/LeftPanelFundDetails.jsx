import React, { useMemo, useState } from "react";
import {
  Bars3Icon,
  BanknotesIcon,
  CheckCircleIcon,
  DocumentCheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const defaultHistory = [
  {
    id: "pmegp",
    title: "PMEGP",
    status: "Applied",
    date: "16 Mar",
    amount: "₹15L",
    tone: "gray",
    icon: DocumentCheckIcon,
  },
  {
    id: "sbi-asmita",
    title: "SBI Asmita",
    status: "Approved",
    date: "14 Mar",
    amount: "₹25L",
    tone: "green",
    icon: CheckCircleIcon,
  },
  {
    id: "razorpay",
    title: "Razorpay Campaign",
    status: "60% Funded",
    date: "12 Mar",
    amount: "₹5L",
    tone: "blue",
    icon: BanknotesIcon,
  },
];

const defaultStats = [
  {
    id: "applications",
    label: "Applications",
    value: "3",
    change: "+12%",
    icon: DocumentCheckIcon,
  },
  {
    id: "funded",
    label: "Funded",
    value: "2",
    change: "+12%",
    icon: CheckCircleIcon,
  },
  {
    id: "raised",
    label: "Raised",
    value: "₹8.2L",
    change: "+12%",
    icon: BanknotesIcon,
  },
];

const toneStyles = {
  gray: {
    text: "text-gray-600",
    border: "border-gray-200",
  },
  green: {
    text: "text-green-600",
    border: "border-green-200",
  },
  blue: {
    text: "text-blue-600",
    border: "border-blue-200",
  },
};

const LeftPanelFundDetails = ({ userData = {}, onSelectFund = () => {} }) => {
  const [openMobilePanel, setOpenMobilePanel] = useState(false);
  const [activeHistoryId, setActiveHistoryId] = useState(defaultHistory[0].id);

  const {
    name = "Suvitha Ramesh",
    location = "Coimbatore",
    fundingStats = {},
  } = userData;

  const { current = 1250000, goal = 2500000 } = fundingStats;

  const progress = useMemo(() => {
    if (!goal) return 0;
    return Math.min(100, Math.round((current / goal) * 100));
  }, [current, goal]);

  const handleSelectFund = (fundId) => {
    setActiveHistoryId(fundId);
    onSelectFund(fundId);
    setOpenMobilePanel(false);
  };

  const panelContent = (
    <aside className="flex h-screen w-72 flex-col border-r border-gray-200 bg-gradient-to-b from-indigo-50 to-white px-5 pb-6 pt-6 text-gray-800">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 text-xl font-semibold text-white">
            F
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              WomenFund
            </p>
            <p className="text-base font-semibold text-gray-900">{name}</p>
            <p className="text-xs font-medium text-pink-500">{location}</p>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-gray-600">
            <span>Funding Progress</span>
            <span>
              ₹{(current / 100000).toFixed(1)}L / ₹{(goal / 100000).toFixed(1)}L
            </span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-indigo-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-right text-xs text-gray-500">{progress}%</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Quick Stats
        </p>
        <div className="grid gap-3">
          {defaultStats.map(({ id, label, value, change, icon: Icon }) => (
            <div
              key={id}
              className="flex items-center justify-between rounded-xl border border-indigo-100 bg-white/70 px-3 py-2 shadow-sm transition duration-150 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-base font-semibold text-gray-900">
                    {value}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-pink-50 px-2 py-0.5 text-xs font-semibold text-pink-500">
                {change}
              </span>
            </div>
          ))}
        </div>

        {/* Fund history */}
        <div className="mt-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Fund History
          </p>
          <div className="space-y-3">
            {defaultHistory.map((item) => {
              const Icon = item.icon;
              const isApproved = item.tone === "green";
              const tone = toneStyles[item.tone] || toneStyles.gray;
              const isActive = activeHistoryId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectFund(item.id)}
                  className={`group flex w-full items-center gap-3 rounded-xl border bg-white/80 px-3 py-2 text-left shadow-sm transition duration-150 hover:-translate-y-0.5 hover:shadow-lg ${
                    isActive
                      ? "border-pink-400 shadow-xl"
                      : "border-transparent hover:border-pink-200"
                  }`}
                >
                  <span
                    className={`rounded-lg border bg-white p-2 text-sm ${
                      tone.text
                    } ${tone.border}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-center justify-between text-sm font-semibold text-gray-800">
                      <span>{item.title}</span>
                      <span className="text-xs text-gray-500">{item.date}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{item.status}</span>
                      <span>{item.amount}</span>
                    </div>
                  </div>
                  {isApproved && <span className="text-lg">✅</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 space-y-2 border-t border-indigo-100 pt-4">
        <button className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-2 text-sm font-semibold text-white shadow-md transition duration-150 hover:shadow-lg">
          New Application
        </button>
        <button className="w-full rounded-xl border border-indigo-200 py-2 text-sm font-semibold text-indigo-600 transition duration-150 hover:bg-indigo-50">
          Track All
        </button>
        <button className="w-full text-xs font-medium text-gray-500 hover:text-gray-700">
          Need help?
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-40 rounded-full bg-white p-2 shadow-md md:hidden"
        onClick={() => setOpenMobilePanel(true)}
      >
        <Bars3Icon className="h-5 w-5 text-gray-700" />
      </button>

      {openMobilePanel && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpenMobilePanel(false)}
        />
      )}

      <div className={`hidden md:block`}>{panelContent}</div>

      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 md:hidden ${
          openMobilePanel ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative h-full">
          <button
            type="button"
            className="absolute right-3 top-3 rounded-full bg-white p-1 shadow md:hidden"
            onClick={() => setOpenMobilePanel(false)}
          >
            <XMarkIcon className="h-4 w-4 text-gray-700" />
          </button>
          {panelContent}
        </div>
      </div>
    </>
  );
};

export default LeftPanelFundDetails;

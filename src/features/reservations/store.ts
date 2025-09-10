"use client";

import { create } from "zustand";
import { addDays } from "date-fns";

type ReservationDateState = {
  selectedDateISO: string; // yyyy-MM-ddT00:00:00.000Z
  setDate: (iso: string) => void;
  nextDay: () => void;
  prevDay: () => void;
  today: () => void;
};

function startOfDayISO(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export const useReservationDateStore = create<ReservationDateState>((set, get) => ({
  selectedDateISO: startOfDayISO(new Date()),
  setDate: (iso) => set({ selectedDateISO: startOfDayISO(new Date(iso)) }),
  nextDay: () => {
    const next = addDays(new Date(get().selectedDateISO), 1);
    set({ selectedDateISO: startOfDayISO(next) });
  },
  prevDay: () => {
    const prev = addDays(new Date(get().selectedDateISO), -1);
    set({ selectedDateISO: startOfDayISO(prev) });
  },
  today: () => set({ selectedDateISO: startOfDayISO(new Date()) }),
}));



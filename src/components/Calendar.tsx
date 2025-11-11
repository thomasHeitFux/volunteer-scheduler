// src/components/Calendar.tsx
import React, { useState } from "react";
import { BED_COLORS } from "../constants/colors";
import { Volunteer } from "../Types/volunteer";

type Props = {
  year: number;
  volunteers: Volunteer[];
  onEdit?: (vol: Volunteer) => void;
  // 👇 NUEVO: App controla el popup
  onRequestAdd?: (bed: number, dateISO: string) => void;
};

const COLORS = BED_COLORS;

const normalizeDate = (str: string) => {
  const d = new Date(str);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

export default function Calendar({ year, volunteers, onEdit, onRequestAdd }: Props) {
  const [month, setMonth] = useState(new Date().getMonth());
  const [yearState, setYearState] = useState(year);

  const daysInMonth = new Date(yearState, month + 1, 0).getDate();
  const beds = Array.from({ length: 8 }, (_, i) => i + 1);

  const monthName = new Date(yearState, month).toLocaleString("default", {
    month: "long",
  });

  const goPrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYearState((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYearState((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const getVolunteerForDay = (bed: number, day: number) => {
    const current = new Date(yearState, month, day);
    return volunteers.find((v) => {
      const start = normalizeDate(v.startDate);
      const end = normalizeDate(v.endDate);
      return v.bed === bed && start <= current && end >= current;
    });
  };

  const isStartDay = (vol: Volunteer, day: number) => {
    const start = normalizeDate(vol.startDate);
    const current = new Date(yearState, month, day);
    if (
      start.getFullYear() === current.getFullYear() &&
      start.getMonth() === current.getMonth() &&
      start.getDate() === current.getDate()
    ) return true;
    if (start < new Date(yearState, month, 1) && day === 1) return true;
    return false;
  };

  const isEndDay = (vol: Volunteer, day: number) => {
    const end = normalizeDate(vol.endDate);
    const current = new Date(yearState, month, day);
    if (
      end.getFullYear() === current.getFullYear() &&
      end.getMonth() === current.getMonth() &&
      end.getDate() === current.getDate()
    ) return true;
    if (end > new Date(yearState, month, daysInMonth) && day === daysInMonth) return true;
    return false;
  };

  return (
    <div className="mt-4 rounded-xl border border-gray-700 bg-gray-900/60 shadow-lg overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
        <button onClick={goPrevMonth} className="px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700 rounded-md text-sm text-white">
          ← Prev
        </button>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-100 capitalize">
            {monthName} {yearState}
          </h2>
          <p className="text-xs text-gray-400">Beds occupancy overview</p>
        </div>
        <button onClick={goNextMonth} className="px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700 rounded-md text-sm text-white">
          Next →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-max text-center text-sm">
          <thead>
            <tr className="bg-slate-900">
              <th className="sticky left-0 z-10 bg-slate-900 border-b border-slate-700 px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-300">
                Bed
              </th>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <th key={i} className="border-b border-slate-700 px-3 py-3 text-xs text-slate-300">
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {beds.map((bed) => (
              <tr key={bed}>
                <td
                  className="sticky left-0 z-10 px-4 py-3 text-left font-semibold text-white border-r border-slate-800"
                  style={{ backgroundColor: COLORS[bed - 1] }}
                >
                  Bed {bed}
                </td>

                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const vol = getVolunteerForDay(bed, day);
                  const baseColor = vol ? COLORS[vol.bed - 1] : undefined;
                  const start = vol ? isStartDay(vol, day) : false;
                  const end = vol ? isEndDay(vol, day) : false;
                  const dateISO = new Date(yearState, month, day).toISOString().split("T")[0];

                  return (
                    <td
                      key={i}
                      className="relative py-3 border-b border-slate-800/40 border-r border-slate-800/10 min-w-[39px] bg-slate-900 cursor-pointer"
                      onClick={() => {
                        if (vol) {
                          onEdit && onEdit(vol);
                        } else {
                          // 👇 avisamos al App
                          onRequestAdd && onRequestAdd(bed, dateISO);
                        }
                      }}
                    >
                      {vol && (
                        <div
                          className="h-6 w-full"
                          style={{
                            backgroundColor: baseColor,
                            borderTopLeftRadius: start ? "9999px" : 0,
                            borderBottomLeftRadius: start ? "9999px" : 0,
                            borderTopRightRadius: end ? "9999px" : 0,
                            borderBottomRightRadius: end ? "9999px" : 0,
                          }}
                        >
                          {start && (
                            <span className="pl-2 pr-3 text-sm font-semibold text-white leading-6">
                              {vol.name}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

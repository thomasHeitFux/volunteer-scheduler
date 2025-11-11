import React, { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Volunteer } from "../../Types/volunteer";
import { SHIFTS } from "../../constants/shifts";
import { addDays, dateToISO, formatHuman, startOfWeek } from "../../utils/dates";
import { hoursBetween } from "../../utils/schedule";
import ScheduleTable from "./ScheduleTable";
import WeeklyHoursSummary from "./WeeklyHoursSummary";
import ClearWeekModal from "./ClearWeekModal";  

type Props = {
  volunteers: Volunteer[];
  schedule: Record<string, Record<string, string[]>>;
  setSchedule: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, string[]>>>
  >;
  weekStart: Date;
  setWeekStart: React.Dispatch<React.SetStateAction<Date>>;
  storageKey?: string;
};

export default function Schedule({
  volunteers,
  schedule,
  weekStart,
  setWeekStart,
  setSchedule,
  storageKey = "volunteer_schedule",
}: Props) {
  const [isExportMode, setIsExportMode] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  // guardar en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(schedule));
    } catch {}
  }, [schedule, storageKey]);

const removeVolunteerFromDay = (
  schedule: Record<string, Record<string, string[]>>,
  dateISO: string,
  volunteerIdStr: string
) => {
  const dayShifts = schedule[dateISO];
  if (!dayShifts) return schedule;

  const copy = { ...schedule };
  const shiftsCopy = { ...dayShifts };

  for (const shiftName of Object.keys(shiftsCopy)) {
    const arr = [...shiftsCopy[shiftName]];
    const idx = arr.indexOf(volunteerIdStr);
    if (idx !== -1) {
      arr.splice(idx, 1);
      if (arr.length === 0) {
        delete shiftsCopy[shiftName];
      } else {
        shiftsCopy[shiftName] = arr;
      }
    }
  }

  if (Object.keys(shiftsCopy).length === 0) {
    delete copy[dateISO];
  } else {
    copy[dateISO] = shiftsCopy;
  }

  return copy;
};

const handleAssign = (
  dateISO: string,
  shift: string,
  volunteerIdStr: string,
  slotIndex: number
) => {
  setSchedule((prev) => {
    let next = { ...prev };

    // si el voluntario ya tenía otro turno ese día → lo removemos antes de reasignar
    if (volunteerIdStr) {
      next = removeVolunteerFromDay(next, dateISO, volunteerIdStr);
    }

    // ahora sí lo agregamos en el nuevo turno
    next[dateISO] = { ...(next[dateISO] || {}) };
    next[dateISO][shift] = [...(next[dateISO][shift] || [])];

    if (volunteerIdStr) {
      next[dateISO][shift][slotIndex] = volunteerIdStr;
    } else {
      next[dateISO][shift][slotIndex] = "";
    }

    next[dateISO][shift] = next[dateISO][shift].filter(Boolean);

    if (next[dateISO][shift].length === 0) delete next[dateISO][shift];
    if (Object.keys(next[dateISO]).length === 0) delete next[dateISO];

    return next;
  });
};


  // calcular horas
  const shiftHours = SHIFTS.reduce((acc, s) => {
    acc[s.label] = hoursBetween(s.hours);
    return acc;
  }, {} as Record<string, number>);

  const weeklyHours: Record<string, number> = {};
  for (const day of weekDates) {
    const iso = dateToISO(day);
    const shifts = schedule[iso];
    if (!shifts) continue;

    for (const shift in shifts) {
      for (const vid of shifts[shift]) {
        weeklyHours[vid] = (weeklyHours[vid] || 0) + shiftHours[shift];
      }
    }
  }

  const handleClearWeek = () => {
    setSchedule((prev) => {
      const copy = { ...prev };
      for (const d of weekDates) {
        const iso = dateToISO(d);
        delete copy[iso];
      }
      return copy;
    });
    setShowConfirm(false);
  };

  const exportImage = async () => {
    if (!tableRef.current) return;
    setIsExportMode(true);
    await new Promise((r) => setTimeout(r, 300));

    const canvas = await html2canvas(tableRef.current, {
      scale: 1.8,
      backgroundColor: "#111827",
      useCORS: true,
    });

    setIsExportMode(false);

    const link = document.createElement("a");
    link.download = `schedule-${dateToISO(weekDates[0])}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white overflow-x-auto mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
            onClick={() => setWeekStart((prev) => addDays(prev, -7))}
          >
            ← Prev
          </button>
          <button
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
            onClick={() => setWeekStart(startOfWeek(new Date()))}
          >
            This week
          </button>
          <button
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
            onClick={() => setWeekStart((prev) => addDays(prev, 7))}
          >
            Next →
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-300 px-3">
        {formatHuman(weekDates[0])} — {formatHuman(weekDates[6])}
      </div>

      <div className="flex" ref={tableRef}>
        <ScheduleTable
          weekDates={weekDates}
          volunteers={volunteers}
          schedule={schedule}
          handleAssign={handleAssign}
          isExportMode={isExportMode}
        />
        <WeeklyHoursSummary weeklyHours={weeklyHours} volunteers={volunteers} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="px-3 py-1 bg-indigo-600 rounded hover:bg-indigo-700"
          onClick={exportImage}
        >
          📷 Export as image
        </button>

        <button
          className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
          onClick={() => setShowConfirm(true)}
        >
          🧹 Clear week
        </button>
      </div>

      {showConfirm && (
        <ClearWeekModal onCancel={() => setShowConfirm(false)} onConfirm={handleClearWeek} />
      )}
    </div>
  );
}

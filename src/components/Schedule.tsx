import React, { useEffect, useMemo, useState, useRef } from "react";
import html2canvas from "html2canvas";
import VolunteerList from "./VolunteerList";

export type Volunteer = {
  id: number;
  name: string;
  bed: number;
  startDate: string;
  endDate: string;
};

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


const SHIFTS = [
  { label: "Breakfast A", hours: "08:00 - 12:00" },
  { label: "Breakfast B", hours: "09:00 - 13:00" },
  { label: "Maintenance", hours: "09:00 - 13:00" },
  { label: "Bar 1", hours: "08:00 - 12:00" },
  { label: "Bar 2", hours: "18:00 - 22:00" },
  { label: "Dinner", hours: "18:00 - 21:30" },
];

const BED_COLORS = [
  "#dc2626",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#6366f1",
  "#a855f7",
];

const dateToISO = (d: Date) => d.toISOString().split("T")[0];
const parseISODate = (s: string) => {
  const d = new Date(s);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};


const startOfWeek = (d: Date) => {
  const copy = new Date(d);
  const day = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - day);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const addDays = (d: Date, days: number) => {
  const c = new Date(d);
  c.setDate(c.getDate() + days);
  c.setHours(0, 0, 0, 0);
  return c;
};

const formatHuman = (d: Date) =>
  d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  

export default function Schedule({
  volunteers,
  schedule,
   weekStart,
  setWeekStart,
  setSchedule,
  storageKey = "volunteer_schedule",
}: Props) {

  const [isExportMode, setIsExportMode] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

   const [showConfirm, setShowConfirm] = useState(false);

  const handleClearWeek = () => {
    setSchedule((prev) => {
      const copy = { ...prev };
      for (const d of weekDates) {
        const iso = dateToISO(d);
        delete copy[iso];
      }
      return copy;
    });
    setShowConfirm(false); // cerrar modal
  };
  // guardar en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(schedule));
    } catch { }
  }, [schedule, storageKey]);

  const isVolunteerAvailableOn = (v: Volunteer, date: Date) => {
    const s = parseISODate(v.startDate);
    const e = parseISODate(v.endDate);
    const cur = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return s <= cur && e >= cur;
  };

  const isAlreadyAssignedThisDay = (dateISO: string, volunteerIdStr: string) => {
    const shifts = schedule[dateISO];
    if (!shifts) return false;
    return Object.values(shifts).some((arr) => arr.includes(volunteerIdStr));
  };

  const handleAssign = (
    dateISO: string,
    shift: string,
    volunteerIdStr: string,
    slotIndex: number
  ) => {
    setSchedule((prev) => {
      const copy = { ...prev };
      copy[dateISO] = { ...(copy[dateISO] || {}) };
      copy[dateISO][shift] = [...(copy[dateISO][shift] || [])];

      if (volunteerIdStr) {
        copy[dateISO][shift][slotIndex] = volunteerIdStr;
      } else {
        copy[dateISO][shift][slotIndex] = "";
      }

      copy[dateISO][shift] = copy[dateISO][shift].filter(Boolean);

      if (copy[dateISO][shift].length === 0) delete copy[dateISO][shift];
      if (Object.keys(copy[dateISO]).length === 0) delete copy[dateISO];

      return copy;
    });
  };

  const getAssignedVolunteer = (idStr: string) => {
    const id = Number(idStr);
    return volunteers.find((v) => v.id === id) || null;
  };
const hoursBetween = (str: string) => {
  const [start, end] = str.split(" - ");
  const [h1, m1] = start.split(":").map(Number);
  const [h2, m2] = end.split(":").map(Number);
  return (h2 + m2 / 60) - (h1 + m1 / 60);
};
const shiftHours = SHIFTS.reduce((acc, s) => {
  acc[s.label] = hoursBetween(s.hours);
  return acc;
}, {} as Record<string, number>);

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
const [customShifts, setCustomShifts] = useState(SHIFTS); 
// 🔹 Calcular horas semanales por voluntario
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
        

        <table
          className="table-fixed border-collapse text-sm"
          style={{
            backgroundColor: "#111827",
            color: "#fff",
            borderRadius: "10px",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr>
              <th className="border border-gray-700 px-3 py-2 bg-gray-900 text-left">
                Day
              </th>
              {SHIFTS.map((shift) => (
                <th
                  key={shift.label}
                  className="border border-gray-700 px-3 py-2 bg-gray-900 text-left"
                >
                  <div className="font-semibold ">{shift.label}</div>
                  <div className="text-s text-gray-400">{shift.hours}</div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {weekDates.map((d) => {
              const iso = dateToISO(d);
              return (
                <tr key={iso}>
                  <td className="border border-gray-600 px-3 py-2 bg-gray-900">
                    <div className="text-sm">
                      {d.toLocaleDateString(undefined, { weekday: "short" })}
                    </div>
                    <div className="text-s text-gray-300 ">
                      {d.toLocaleDateString(undefined, {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </td>

                  {SHIFTS.map((shift) => {
                    const available = volunteers.filter((v) =>
                      isVolunteerAvailableOn(v, d)
                    );
                    let assignedIds = schedule[iso]?.[shift.label] || [];
                    if (!Array.isArray(assignedIds)) assignedIds = [assignedIds];
                    const assignedVolunteers = assignedIds.map((id) =>
                      getAssignedVolunteer(id)
                    );

                    return (
                      <td
                        key={shift.label}
                        className="border border-gray-700 px-2 py-2 space-y-1"
                      >
                       {[0, 1].map((slotIndex) => {
  const assigned = assignedVolunteers[slotIndex] || null;

  if (isExportMode) {
    // 🔹 Versión solo texto para exportar
    return (
      <div
        key={slotIndex}
        style={{
          backgroundColor: assigned
            ? BED_COLORS[assigned.bed - 1]
            : "#1f2937",
          borderRadius: "6px",
          padding: "6px 8px",
          fontWeight: 600,
          color: "white",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "32px", // 👈 altura uniforme
          width: "100%",
        }}
      >
        {assigned ? assigned.name : "—"}
      </div>
    );
  }

  // 🔹 Versión interactiva normal
  return (
    <select
      key={slotIndex}
      className="w-full bg-gray-800 text-white p-1 rounded"
      value={assigned ? String(assigned.id) : ""}
      onChange={(e) => {
        const vid = e.target.value;
        if (vid && isAlreadyAssignedThisDay(iso, vid)) {
          alert("Ese voluntario ya tiene turno ese día.");
          return;
        }
        handleAssign(iso, shift.label, vid, slotIndex);
      }}
      style={{
    backgroundColor: assigned
      ? BED_COLORS[assigned.bed - 1]
      : "#1f2937", // color gris oscuro si está vacío
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "32px",
    width: "100%",
    border: "none",
    padding: "6px 8px",
    borderRadius: "6px",
    appearance: "none", // oculta flecha nativa (más limpio)
    WebkitAppearance: "none",
    MozAppearance: "none",
    cursor: "pointer",
  }}
    >
       <option value=""  style={{
         
        backgroundColor: "#1f2937", // fondo del menú desplegable
        color: "white",
      }}>—</option>
  {available.map((v) => (
    <option
      key={v.id}
      value={String(v.id)}
      style={{
        backgroundColor: "#1f2937", // fondo del menú desplegable
        color: "white",
      }}
    >
      {v.name}
    </option>
      ))}
    </select>
  );
})}

                      </td>
                    );
                  })}
                  
                </tr>
              );
            })}
            
          </tbody>
        
        </table>
               {/* Weekly Hours Summary */}
<div
  className=" bg-gray-900 p-4 rounded-lg"
  style={{
    border: "1px solid #374151",
    textAlign: "left",
  }}
>
  <h3 className="font-bold mb-3 text-indigo-300 text-lg">
    Weekly Hours Summary
  </h3>
  <ul className="space-y-1">
    {Object.keys(weeklyHours).map((id) => {
      const v = volunteers.find((vo) => vo.id === Number(id));
      if (!v) return null;
      return (
        <li
          key={id}
          className="flex justify-between items-center text-sm font-medium"
          style={{
            color: BED_COLORS[v.bed - 1],
            backgroundColor: "#1f2937",
            padding: "6px 10px",
            borderRadius: "6px",
          }}
        >
          <span>{v.name}</span>
          <span>{weeklyHours[id].toFixed(1)} h</span>
        </li>
      );
    })}
  </ul>
  {/* Weekly Hours Summary */}
<div
  className="mt-6 bg-gray-900 p-4 rounded-lg"
  style={{
    border: "1px solid #374151",
    textAlign: "left",
  }}
>
  
</div>

</div>
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

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-3 text-center">
              Confirm clear week
            </h2>
            <p className="text-gray-300 text-sm mb-5 text-center">
              Are you sure you want to delete all shifts for this week?
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleClearWeek}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
              >
                Yes, clear
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    
    </div>

  );
}

import React, { useMemo, useState } from "react";
import { Volunteer } from "../Types/volunteer";
import { getCountryCode } from "../utils/flags";
import { BED_COLORS } from "../constants/colors";

type Props = {
  volunteers: Volunteer[];
  onRemove: (id: number) => void;
  onEdit: (v: Volunteer) => void;
};



const startOfWeek = (d: Date) => {
  const copy = new Date(d);
  const day = (copy.getDay() + 6) % 7; // lunes = 0
  copy.setDate(copy.getDate() - day);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

export default function VolunteerList({
  volunteers,
  onRemove,
  onEdit,
}: Props) {
  const [filter, setFilter] = useState<"all" | "week" | "month">("week");

  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  monthStart.setHours(0, 0, 0, 0);
  monthEnd.setHours(23, 59, 59, 999);

  const formatDate = (d: string) => {
    const date = new Date(d);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = date.toLocaleString("default", {
      month: "short",
      timeZone: "UTC",
    });
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  // 🔎 aplica el filtro según la opción elegida
  const filteredVolunteers = useMemo(() => {
    if (filter === "all") return volunteers;

    return volunteers.filter((v) => {
      const start = new Date(v.startDate);
      const end = new Date(v.endDate);

      // solapamiento = start <= periodoFin && end >= periodoInicio
      if (filter === "week") {
        return start <= weekEnd && end >= weekStart;
      }
      if (filter === "month") {
        return start <= monthEnd && end >= monthStart;
      }
      return true;
    });
  }, [filter, volunteers, weekStart, weekEnd, monthStart, monthEnd]);

  return (
    <div className="w-full mt-10">
      <div className="flex items-center justify-between mb-4 px-1 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Volunteers ({filteredVolunteers.length})
          </h2>
          <p className="text-sm text-slate-400">
            Overview of current volunteers
          </p>
        </div>

        {/* filtros */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-md text-sm ${filter === "all"
                ? "bg-indigo-500 text-white"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("week")}
            className={`px-3 py-1.5 rounded-md text-sm ${filter === "week"
                ? "bg-indigo-500 text-white"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
          >
            This week
          </button>
          <button
            onClick={() => setFilter("month")}
            className={`px-3 py-1.5 rounded-md text-sm ${filter === "month"
                ? "bg-indigo-500 text-white"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
          >
            This month
          </button>
        </div>
      </div>

      {filteredVolunteers.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-8">
          No volunteers for this period.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVolunteers.map((v) => {
            const flagCode = getCountryCode(v.nationality);
            return (
              <div  
                key={v.id}
                className="bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all"
              >
                {/* HEADER */}
                <div onClick={() => onEdit(v)} className="flex items-center gap-4 px-5 py-4 border-b border-slate-700/60">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center shrink-0">
                    {flagCode ? (
                      <img
                        src={`https://flagcdn.com/w40/${flagCode}.png`}
                        alt={v.nationality}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-white">
                        {v.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-2">
                      <h3 className="text-white font-semibold truncate">
                        {v.name}
                      </h3>
                      <span className="text-[11px] bg-slate-700 px-2 py-0.5 rounded-full text-slate-200 uppercase" 
                      >
                        Bed {v.bed}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatDate(v.startDate)} → {formatDate(v.endDate)}
                    </p>
                  </div>
                </div>

                {/* BODY */}
                <div onClick={() => onEdit(v)} className="px-5 py-3 flex-1">
                  {v.nationality && (
                    <p className="text-sm text-slate-200 mb-2 font-medium">
                      🌍 {v.nationality}
                    </p>
                  )}

                  {v.languages && v.languages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {v.languages.map((lang) => (
                        <span
                          key={lang}
                          className="text-[11px] bg-slate-900/60 border border-slate-700 px-2.5 py-1 rounded-full text-slate-300"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-700/50 bg-slate-900/40">
                  <button
                    onClick={() => onEdit(v)}
                    className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-md transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onRemove(v.id)}
                    className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

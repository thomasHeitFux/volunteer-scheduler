import React, { useMemo } from "react";

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
  weekStart: Date; // 🔹 viene desde App (sincronizado con Schedule)
};

const SHIFTS = [
  { label: "Breakfast A", hours: "08:00 - 12:00" },
  { label: "Breakfast B", hours: "09:00 - 13:00" },
  { label: "Maintenance", hours: "09:00 - 13:00" },
  { label: "Bar 1", hours: "08:00 - 12:00" },
  { label: "Bar 2", hours: "18:00 - 22:00" },
  { label: "Dinner", hours: "18:00 - 21:30" },
];


const dateToISO = (d: Date) => d.toISOString().split("T")[0];
const addDays = (d: Date, days: number) => {
  const c = new Date(d);
  c.setDate(c.getDate() + days);
  return c;
};
const formatDay = (d: Date) =>
  d.toLocaleDateString(undefined, { weekday: "short", day: "numeric" });

export default function WeeklyGrid({ volunteers, schedule, weekStart }: Props) {
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);
  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const getVolunteerShiftsForDay = (vol: Volunteer, date: Date) => {
    const iso = dateToISO(date);
    const shifts = schedule[iso] || {};
    const assigned = Object.entries(shifts).filter(([_, ids]) =>
      ids.includes(String(vol.id))
    );
    if (assigned.length === 0) return "OFF";
    return assigned
      .map(([label]) => {
        const f = SHIFTS.find((s) => s.label === label);
        return f ? `${f.label} (${f.hours})` : label;
      })
      .join("\n");
  };

  // 🔹 Mostrar solo voluntarios activos esta semana
  const activeVolunteers = useMemo(() => {
    return volunteers.filter((v) => {
      const start = new Date(v.startDate);
      const end = new Date(v.endDate);
      return start <= weekEnd && end >= weekStart;
    });
  }, [volunteers, weekStart, weekEnd]);

  return (
    <div className="bg-gray-900 p-4 rounded-lg text-white overflow-x-auto mt-6">
      <h2 className="text-xl font-bold text-center mb-3 text-indigo-400">
        Weekly Overview (Active Volunteers)
      </h2>

      {activeVolunteers.length === 0 ? (
        <p className="text-center text-gray-400 py-6">
          No volunteers scheduled for this week.
        </p>
      ) : (
        <table className="min-w-max border-collapse text-sm w-full">
          <thead>
            <tr className="bg-gray-800 text-gray-300">
              <th className="border border-gray-700 px-3 py-2 text-left">Name</th>
              {weekDates.map((d) => (
                <th
                  key={d.toISOString()}
                  className="border border-gray-700 px-3 py-2 text-center"
                >
                  {formatDay(d)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeVolunteers.map((v) => (
              <tr key={v.id}>
                <td
                  className="border border-gray-700 px-3 py-2 font-semibold text-white"
                  style={{ backgroundColor:"rgba(255,255,255,0.05)"}}
                >
                  {v.name}
                </td>
                {weekDates.map((d) => {
                  const shifts = getVolunteerShiftsForDay(v, d);
                  const isOff = shifts === "OFF";
                  return (
                    <td
                      key={d.toISOString()}
                      className={`border border-gray-700 px-2 py-2 whitespace-pre-line text-center ${
                        isOff ? "text-gray-400" : "text-green-300"
                      }`}
                      style={{
                        backgroundColor: isOff
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(34,197,94,0.1)",
                      }}
                    >
                      {shifts}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

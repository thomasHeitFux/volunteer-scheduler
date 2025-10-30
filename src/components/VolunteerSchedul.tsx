import React, { useMemo } from "react";

type Volunteer = {
  id: number;
  name: string;
  bed: number;
  startDate: string;
  endDate: string;
};

type Props = {
  volunteer: Volunteer;
  schedule: Record<string, Record<string, string>>;
};

const SHIFTS = [
  { label: "Breakfast A", hours: "08:00 - 12:00" },
  { label: "Breakfast B", hours: "09:00 - 13:00" },
  { label: "Maintenance", hours: "09:00 - 13:00" },
  { label: "Bar 1", hours: "18:00 - 22:00" },
  { label: "Bar 2", hours: "19:00 - 23:00" },
  { label: "Dinner", hours: "18:00 - 21:30" },
];

// mismos colores que el calendar
const BED_COLORS = [
  "#dc2626", "#f97316", "#eab308", "#22c55e",
  "#14b8a6", "#3b82f6", "#6366f1", "#a855f7",
];

export default function VolunteerSchedule({ volunteer, schedule }: Props) {
  // Filtramos los días donde el voluntario aparece en el schedule
  const assignments = useMemo(() => {
    const list: { date: string; task: string }[] = [];

    for (const [date, dayTasks] of Object.entries(schedule)) {
      for (const [task, assigned] of Object.entries(dayTasks)) {
        // Soporte para más de un voluntario en el mismo shift
        if (assigned.split(",").includes(String(volunteer.id))) {
          list.push({ date, task });
        }
      }
    }

    return list.sort((a, b) => a.date.localeCompare(b.date));
  }, [schedule, volunteer.id]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg text-white shadow-lg">
      <div className="flex items-center mb-4">
        <div
          className="w-3 h-12 rounded mr-3"
          style={{ backgroundColor: BED_COLORS[volunteer.bed - 1] }}
        ></div>
        <h2 className="text-2xl font-bold">
          {volunteer.name} — Personal Schedule
        </h2>
      </div>

      {assignments.length === 0 ? (
        <p className="text-gray-400">No shifts assigned yet.</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-700 text-gray-200">
              <th className="border border-gray-700 px-3 py-2 text-left">Date</th>
              <th className="border border-gray-700 px-3 py-2 text-left">Shift</th>
              <th className="border border-gray-700 px-3 py-2 text-left">Hours</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(({ date, task }) => {
              const hours = SHIFTS.find(s => s.label === task)?.hours || "";
              const d = new Date(date).toLocaleDateString(undefined, {
                weekday: "short", day: "2-digit", month: "short", year: "numeric"
              });
              return (
                <tr key={date + task} className="hover:bg-gray-700">
                  <td className="border border-gray-700 px-3 py-2">{d}</td>
                  <td className="border border-gray-700 px-3 py-2">{task}</td>
                  <td className="border border-gray-700 px-3 py-2 text-gray-300">{hours}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

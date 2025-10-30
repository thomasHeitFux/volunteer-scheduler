import React, { useState } from "react";

type Volunteer = {
  id: number;
  name: string;
  bed: number;
  startDate: string;
  endDate: string;
};

type Props = {
  year: number;
  volunteers: Volunteer[];
  onEdit?: (vol: Volunteer) => void;
};

const BED_COLORS = [
  "#dc2626", "#f97316", "#eab308", "#22c55e",
  "#14b8a6", "#3b82f6", "#6366f1", "#a855f7",
];

// ✅ Normaliza cualquier fecha ISO o string a solo "año-mes-día" (sin hora)
const normalizeDate = (str: string) => {
  const d = new Date(str);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

export default function Calendar({ year, volunteers, onEdit }: Props) {
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

  // ✅ Determina si un voluntario está ocupando una cama en un día
  const getVolunteerForDay = (bed: number, day: number) => {
    const current = new Date(yearState, month, day);
    return volunteers.find((v) => {
      const start = normalizeDate(v.startDate);
      const end = normalizeDate(v.endDate);
      return v.bed === bed && start <= current && end >= current;
    });
  };

  // ✅ Solo mostrar el nombre el primer día visible
  const showName = (vol: Volunteer, day: number) => {
    const start = normalizeDate(vol.startDate);

    // empieza este mes → mostrar en el día exacto
    if (
      start.getFullYear() === yearState &&
      start.getMonth() === month &&
      start.getDate() === day
    )
      return true;

    // empezó antes del mes → mostrar en el día 1
    if (start < new Date(yearState, month, 1) && day === 1) return true;

    return false;
  };

  return (
    <div className="overflow-x-auto mt-4 border border-gray-700 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 px-4 py-2 bg-gray-800 rounded-t-lg">
        <button
          onClick={goPrevMonth}
          className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-white"
        >
          {"<"} Prev
        </button>

        <h2 className="text-2xl font-bold text-gray-200">
          {monthName} {yearState}
        </h2>

        <button
          onClick={goNextMonth}
          className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-white"
        >
          Next {">"}
        </button>
      </div>

      {/* Tabla */}
      <table className="min-w-max border-collapse text-center">
        <thead>
          <tr className="bg-gray-800 text-gray-300">
            <th className="border border-gray-700 px-4 py-3 rounded-tl-lg">
              Bed
            </th>
            {Array.from({ length: daysInMonth }, (_, i) => (
              <th key={i} className="border border-gray-700 px-3 py-3">
                {i + 1}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {beds.map((bed) => (
            <tr key={bed}>
              <td
                className="border border-gray-700 px-4 py-3 font-bold text-white"
                style={{ backgroundColor: BED_COLORS[bed - 1] }}
              >
                Bed {bed}
              </td>

              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const vol = getVolunteerForDay(bed, day);

                return (
                  <td
                    key={i}
                    className="border border-gray-700 px-1 py-3 text-white relative cursor-pointer"
                    style={{
                      backgroundColor: vol ? BED_COLORS[vol.bed - 1] : "#111827",
                    }}
                    title={
                      vol
                        ? `${vol.name} — ${vol.startDate.split("T")[0]} → ${
                            vol.endDate.split("T")[0]
                          }`
                        : ""
                    }
                    onClick={() => vol && onEdit && onEdit(vol)}
                  >
                    {vol && (
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: "6px",
                          borderRadius: "4px",
                          backgroundColor: BED_COLORS[vol.bed - 1],
                        }}
                      />
                    )}
                    <div style={{ marginLeft: "10px", fontWeight: 600 }}>
                      {vol && showName(vol, day) ? vol.name : ""}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

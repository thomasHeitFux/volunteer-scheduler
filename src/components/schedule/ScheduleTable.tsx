import { SHIFTS } from "../../constants/shifts";
import { BED_COLORS } from "../../constants/colors";
import { Volunteer } from "../../Types/volunteer";
import { dateToISO } from "../../utils/dates";
import { isVolunteerAvailableOn, isAlreadyAssignedThisDay } from "../../utils/schedule";

type ScheduleTableProps = {
  weekDates: Date[];
  volunteers: Volunteer[];
  schedule: Record<string, Record<string, string[]>>;
  handleAssign: (
    dateISO: string,
    shift: string,
    volunteerIdStr: string,
    slotIndex: number
  ) => void;
  isExportMode: boolean;
};

export default function ScheduleTable({
  weekDates,
  volunteers,
  schedule,
  handleAssign,
  isExportMode,
}: ScheduleTableProps) {
  return (
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
                  volunteers.find((v) => v.id === Number(id)) || null
                );

                return (
                  <td
                    key={shift.label}
                    className="border border-gray-700 px-2 py-2 space-y-1"
                  >
                    {[0, 1].map((slotIndex) => {
                      const assigned = assignedVolunteers[slotIndex] || null;

                      if (isExportMode) {
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
                              height: "32px",
                              width: "100%",
                            }}
                          >
                            {assigned ? assigned.name : "—"}
                          </div>
                        );
                      }

                      return (
                        <select
                          key={slotIndex}
                          className="w-full bg-gray-800 text-white p-1 rounded"
                          value={assigned ? String(assigned.id) : ""}
                          onChange={(e) => {
                            const vid = e.target.value;
                            handleAssign(iso, shift.label, vid, slotIndex);
                          }}

                          style={{
                            backgroundColor: assigned
                              ? BED_COLORS[assigned.bed - 1]
                              : "#1f2937",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "32px",
                            width: "100%",
                            border: "none",
                            padding: "6px 8px",
                            borderRadius: "6px",
                            appearance: "none",
                            WebkitAppearance: "none",
                            MozAppearance: "none",
                            cursor: "pointer",
                          }}
                        >
                          <option className="bg-gray-800" value="">—</option>
                          {available.map((v) => (
                            <option className="bg-gray-800" key={v.id} value={String(v.id)}>
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
  );
}

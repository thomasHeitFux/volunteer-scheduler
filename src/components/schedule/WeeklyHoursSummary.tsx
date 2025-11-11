import { Volunteer } from "../../Types/volunteer";
import { BED_COLORS } from "../../constants/colors";

type WeeklyHoursSummaryProps = {
  weeklyHours: Record<string, number>;
  volunteers: Volunteer[];
};

export default function WeeklyHoursSummary({
  weeklyHours,
  volunteers,
}: WeeklyHoursSummaryProps) {
  return (
    <div
      className="bg-gray-900 p-4 rounded-lg"
      style={{ border: "1px solid #374151", textAlign: "left" }}
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
    </div>
  );
}

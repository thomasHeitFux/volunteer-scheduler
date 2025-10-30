import React from "react";

interface Props {
  beds: (string | null)[];
}

const colors = [
  "bg-red-600",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-teal-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
];

const BedStatus: React.FC<Props> = ({ beds }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {beds.map((volunteer, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg shadow-lg text-center text-white transition-transform transform hover:scale-105 ${
            volunteer ? colors[index] : "bg-gray-700"
          }`}
        >
          <p className="font-bold mb-2">Bed {index + 1}</p>
          <p className="text-sm">{volunteer || "Free"}</p>
        </div>
      ))}
    </div>
  );
};

export default BedStatus;

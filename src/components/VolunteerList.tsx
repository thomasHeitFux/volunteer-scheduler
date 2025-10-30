import React from "react";

type Volunteer = {
  id: number;
  name: string;
  bed: number;
  startDate: string;
  endDate: string;
};

type Props = {
  volunteers: Volunteer[];
  onRemove: (id: number) => void;
  onEdit: (v: Volunteer) => void;
  onClose: () => void;
};

export default function VolunteerList({ volunteers, onRemove, onEdit, onClose }: Props) {
  const formatDate = (d: string) => {
  const date = new Date(d);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = date.toLocaleString("default", { month: "short", timeZone: "UTC" });
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};



  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-white">List of volunteers</h2>
        <ul className="space-y-2">
          {volunteers.map((v) => (
            <li key={v.id} className="flex justify-between items-center bg-gray-700 p-2 rounded">
  <div>
    {v.name} - bed {v.bed} ({formatDate(v.startDate)} → {formatDate(v.endDate)})
  </div>
  <div className="flex gap-2">
    <button onClick={() => onEdit(v)} className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 rounded text-white text-sm">Edi</button>
    <button onClick={() => onRemove(v.id)} className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm">Delete</button>
  </div>
</li>

          ))}
        </ul>
        <button
          className="mt-4 w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

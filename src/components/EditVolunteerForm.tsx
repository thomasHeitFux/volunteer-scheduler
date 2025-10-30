import React, { useState } from "react";

type Volunteer = {
  id: number;
  name: string;
  bed: number;
  startDate: string;
  endDate: string;
};

type Props = {
  volunteer: Volunteer;
  onUpdate: (v: Volunteer) => void;
  onClose: () => void;
  volunteers: Volunteer[]; // para validar conflictos
};

export default function EditVolunteerForm({ volunteer, onUpdate, onClose, volunteers }: Props) {
  const [name, setName] = useState(volunteer.name);
  const [bed, setBed] = useState(volunteer.bed);
  const stripISO = (str: string) => str.split("T")[0];

const [startDate, setStartDate] = useState(stripISO(volunteer.startDate));
const [endDate, setEndDate] = useState(stripISO(volunteer.endDate));


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const conflict = volunteers.some(
      (v) =>
        v.id !== volunteer.id &&
        v.bed === bed &&
        new Date(v.startDate) <= new Date(endDate) &&
        new Date(v.endDate) >= new Date(startDate)
    );

    if (conflict) {
      alert("La cama ya está ocupada en esas fechas.");
      return;
    }

    onUpdate({
  id: volunteer.id,
  name,
  bed,
  startDate: startDate.split("T")[0],
  endDate: endDate.split("T")[0],
});
;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg space-y-2 w-96">
        <h2 className="text-xl font-bold text-white">Editar Voluntario</h2>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="p-2 w-full rounded bg-gray-800 text-white"
          required
        />
        <input
          type="number"
          min={1}
          max={8}
          value={bed}
          onChange={e => setBed(Number(e.target.value))}
          className="p-2 w-full rounded bg-gray-800 text-white"
          required
        />
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="p-2 w-full rounded bg-gray-800 text-white"
          required
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="p-2 w-full rounded bg-gray-800 text-white"
          required
        />
        <div className="flex justify-between mt-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 text-white"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

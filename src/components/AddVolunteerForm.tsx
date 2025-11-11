// src/components/AddVolunteerForm.tsx
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type VolunteerInput = {
  name: string;
  bed: number;
  startDate: string;
  endDate: string;
};

type Volunteer = VolunteerInput & { id: number };

type Props = {
  onAdd: (v: VolunteerInput) => void;
  volunteers: Volunteer[];
  presetBed?: number;        // NUEVO
  presetDateISO?: string;    //  NUEVO
};

export default function AddVolunteerForm({
  onAdd,
  volunteers,
  presetBed,
  presetDateISO,
}: Props) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // cuando viene del calendario, prellenamos
  useEffect(() => {
    if (presetDateISO) {
      const d = new Date(presetDateISO);
      setStartDate(d);
      setEndDate(d);
    }
  }, [presetDateISO]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    // si vino cama fija desde el calendario, usamos esa
    let assignedBed: number | null = presetBed ?? null;

    // si NO vino cama fija, usamos tu lógica de buscar libre
    if (!assignedBed) {
      for (let bed = 1; bed <= 8; bed++) {
        const conflict = volunteers.some(
          (v) =>
            v.bed === bed &&
            new Date(v.startDate) <= endDate &&
            new Date(v.endDate) >= startDate
        );
        if (!conflict) {
          assignedBed = bed;
          break;
        }
      }
    }

    if (!assignedBed) {
      alert("No free beds for that date.");
      return;
    }

    onAdd({
      name,
      bed: assignedBed,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    setName("");
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-2">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 rounded bg-gray-800 text-white w-full"
        required
      />
      <div className="flex space-x-2">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Check-in"
          className="p-2 rounded bg-gray-800 text-white w-full"
          required
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          placeholderText="Check-out"
          className="p-2 rounded bg-gray-800 text-white w-full"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        Add volunteer
      </button>
    </form>
  );
}

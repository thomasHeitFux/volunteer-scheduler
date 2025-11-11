import React, { useState } from "react";
import { NATIONALITIES } from "../constants/nationalities";
import { LANGUAGE_GROUPS } from "../constants/languages";




type Volunteer = {
  id: number;
  name: string;
  bed: number;
  startDate: string;
  endDate: string;
  nationality?: string;
  languages?: string[];
};

type Props = {
  volunteer: Volunteer;
  onUpdate: (v: Volunteer) => void;
  onClose: () => void;
  volunteers: Volunteer[];
};





export default function EditVolunteerForm({
  volunteer,
  onUpdate,
  onClose,
  volunteers,
}: Props) {
  const [name, setName] = useState(volunteer.name);
  const [bed, setBed] = useState(volunteer.bed);
  const stripISO = (str: string) => str.split("T")[0];
  const [startDate, setStartDate] = useState(stripISO(volunteer.startDate));
  const [endDate, setEndDate] = useState(stripISO(volunteer.endDate));
  const [nationality, setNationality] = useState(volunteer.nationality || "");
  const [languages, setLanguages] = useState<string[]>(
    volunteer.languages || []
  );
  const [openGroups, setOpenGroups] = useState<string[]>(["Global"]); // por defecto se abre Global

const toggleGroup = (label: string) => {
  setOpenGroups((prev) =>
    prev.includes(label)
      ? prev.filter((g) => g !== label)
      : [...prev, label]
  );
};


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
      ...volunteer,
      name,
      bed,
      startDate,
      endDate,
      nationality: nationality || undefined,
      languages: languages.length ? languages : undefined,
    });
  };

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang)
        ? prev.filter((l) => l !== lang)
        : [...prev, lang]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-lg space-y-3 w-96"
      >
        <h2 className="text-xl font-bold text-white mb-2">Editar Voluntario</h2>

        <label className="block text-sm text-slate-200">
          Nombre
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 w-full rounded bg-gray-800 text-white"
            required
          />
        </label>

        <label className="block text-sm text-slate-200">
          bed
          <input
            type="number"
            min={1}
            max={8}
            value={bed}
            onChange={(e) => setBed(Number(e.target.value))}
            className="mt-1 p-2 w-full rounded bg-gray-800 text-white"
            required
          />
        </label>

        <div className="flex gap-2">
          <label className="flex-1 text-sm text-slate-200">
            Check-in
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 p-2 w-full rounded bg-gray-800 text-white"
              required
            />
          </label>
          <label className="flex-1 text-sm text-slate-200">
            Check-out
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 p-2 w-full rounded bg-gray-800 text-white"
              required
            />
          </label>
        </div>

        {/* 🌍 Nacionalidad */}
        <label className="block text-sm text-slate-200">
          Nationality
          <select
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="mt-1 p-2 w-full rounded bg-gray-800 text-white"
          >
            <option value="">Seleccionar...</option>
            {NATIONALITIES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        {/* 🗣 Idiomas */}
       <div className="text-sm text-slate-200">
  languages
  <div className="mt-2 space-y-2">
    {LANGUAGE_GROUPS.map((group) => (
      <div key={group.label} className="border border-slate-700/60 rounded-lg overflow-hidden">
        {/* header del grupo */}
        <button
          type="button"
          onClick={() => toggleGroup(group.label)}
          className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/60 hover:bg-slate-700 text-left"
        >
          <span className="font-medium text-sm">{group.label}</span>
          <span className="text-xs text-slate-300">
            {openGroups.includes(group.label) ? "▲" : "▼"}
          </span>
        </button>

        {/* contenido del grupo */}
        {openGroups.includes(group.label) && (
          <div className="grid grid-cols-2 gap-1 p-2 bg-slate-900/40">
            {group.keys.map((lang) => (
              <label
                key={lang}
                className={`flex items-center justify-center px-2 py-1 rounded text-xs cursor-pointer ${
                  languages.includes(lang)
                    ? "bg-green-600 text-white"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
                onClick={() => {
                  setLanguages((prev) =>
                    prev.includes(lang)
                      ? prev.filter((l) => l !== lang)
                      : [...prev, lang]
                  );
                }}
              >
                {lang}
              </label>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
</div>


        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 text-white"
          >
            save
          </button>
        </div>
      </form>
    </div>
  );
}

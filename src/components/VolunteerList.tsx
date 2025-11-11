import React from "react";
import { Volunteer } from "../Types/volunteer";

type Props = {
  volunteers: Volunteer[];
  onRemove: (id: number) => void;
  onEdit: (v: Volunteer) => void;
};

export default function VolunteerList({ volunteers, onRemove, onEdit }: Props) {
  const formatDate = (d: string) => {
    const date = new Date(d);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short", timeZone: "UTC" });
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="w-full mt-6">
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Volunteers ({volunteers.length})
          </h2>
          <p className="text-xs text-slate-400">Overview of all current volunteers</p>
        </div>
      </div>

      {volunteers.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-8">
          No volunteers added yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {volunteers.map((v) => (
            <div
              key={v.id}
              className="bg-slate-800/70 border border-slate-700 hover:border-slate-500 rounded-xl p-4 flex flex-col justify-between shadow transition"
            >
              {/* header */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-white">
                      {v.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white text-sm truncate max-w-[120px]">
                          {v.name}
                        </p>
                        <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded-full text-slate-200 uppercase tracking-wide">
                          Bed {v.bed}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatDate(v.startDate)} → {formatDate(v.endDate)}
                      </p>
                    </div>
                </div>

                {/* extra info */}
                {v.nationality && (
                  <p className="text-xs text-slate-300 mb-1">
                    {v.nationality}
                  </p>
                )}

                {v.languages && v.languages.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {v.languages.map((lang) => (
                      <span
                        key={lang}
                        className="text-[10px] bg-slate-900/60 border border-slate-700 px-2 py-0.5 rounded-full text-slate-200"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* actions */}
              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-700/40">
                <button
                  onClick={() => onEdit(v)}
                  className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onRemove(v.id)}
                  className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import AddVolunteerForm from "./components/AddVolunteerForm";
import Calendar from "./components/Calendar";
import VolunteerList from "./components/VolunteerList";
import Schedule from "./components/Schedule";
import EditVolunteerForm from "./components/EditVolunteerForm";
import LoginJSONBin from "./components/LoginJSONBin";
import WeeklyGrid from "./components/WeeklyGrid";


export type VolunteerInput = {
  name: string;
  bed: number;
  startDate: string;
  endDate: string;
};

export type Volunteer = VolunteerInput & { id: number };

const BIN_URL = "https://api.jsonbin.io/v3/b/69006f6543b1c97be986a2d5"; // <-- tu bin URL
const API_KEY = "$2a$10$Q77xDLdi6ItV38ZtT3vfCe8TMiDF73crWvn.PdbW9c25EXV73tyuO"; // <-- tu clave privada

function App() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [schedule, setSchedule] = useState<Record<string, Record<string, string[]>>>({});

  const [nextId, setNextId] = useState(1);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showListPopup, setShowListPopup] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | null>(null);
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const today = new Date();
    const monday = new Date(today);
    const day = (monday.getDay() + 6) % 7; // Lunes = 0
    monday.setDate(monday.getDate() - day);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });
  // 🔹 Cargar datos desde JSONBin al iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(BIN_URL, {
          headers: { "X-Master-Key": API_KEY },
        });
        const data = await res.json();
        const record = data?.record || {};
        if (record.volunteers) setVolunteers(record.volunteers);
        if (record.schedule) setSchedule(record.schedule);
        if (record.volunteers?.length)
          setNextId(Math.max(...record.volunteers.map((v: Volunteer) => v.id)) + 1);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    loadData();
  }, []);

  // 🔹 Guardar cambios automáticamente en JSONBin
  useEffect(() => {
    const saveData = async () => {
      try {
        await fetch(BIN_URL, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Master-Key": API_KEY,
          },
          body: JSON.stringify({ volunteers, schedule }),
        });
      } catch (err) {
        console.error("Error al guardar datos:", err);
      }
    };
    if (volunteers.length > 0) saveData();
  }, [volunteers, schedule]);

  // Funciones básicas
  const addVolunteer = (v: VolunteerInput) => {
    setVolunteers(prev => [...prev, { ...v, id: nextId }]);
    setNextId(id => id + 1);
    setShowAddPopup(false);
  };

  const updateVolunteer = (v: Volunteer) => {
    setVolunteers(prev => prev.map(vol => (vol.id === v.id ? v : vol)));
    setEditingVolunteer(null);
  };

  const removeVolunteer = (id: number) => {
    setVolunteers(prev => prev.filter(v => v.id !== id));
  };

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("auth") === "true") setLoggedIn(true);
  }, []);

  if (!loggedIn) {
    return <LoginJSONBin onLogin={() => setLoggedIn(true)} />;
  }




  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
      <h1 className="text-4xl font-bold mb-4 text-indigo-400">Volunteer Scheduler</h1>
      <button
        onClick={() => {
          localStorage.removeItem("auth");
          window.location.reload();
        }}
        className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded hover:bg-red-700"
      >
        Logout
      </button>

      <div className="flex gap-4 mb-4">
        <button
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          onClick={() => setShowAddPopup(true)}
        >
          Add Volunteer
        </button>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          onClick={() => setShowListPopup(true)}
        >
          Volunteers List
        </button>
      </div>

      {/* Pop-up agregar */}
      {showAddPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-white">Add volunteer</h2>
            <AddVolunteerForm onAdd={addVolunteer} volunteers={volunteers} />
            <button
              className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
              onClick={() => setShowAddPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      {showListPopup && (
        <VolunteerList
          volunteers={volunteers}
          onRemove={removeVolunteer}
          onEdit={(v) => {
            setEditingVolunteer(v);
            setShowListPopup(false);
          }}
          onClose={() => setShowListPopup(false)}
        />
      )}
  {/* Schedule */}
      <Schedule
        volunteers={volunteers}
        schedule={schedule}
        setSchedule={setSchedule}
        weekStart={weekStart}
        setWeekStart={setWeekStart}
      />

      <WeeklyGrid
        volunteers={volunteers}
        schedule={schedule}
        weekStart={weekStart}
      />
      {/* Calendario */}
      <Calendar
        year={2025}
        volunteers={volunteers}
        onEdit={(vol) => setEditingVolunteer(vol)}
      />

      {/* Editar voluntario */}
      {editingVolunteer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-80">
            <EditVolunteerForm
              volunteer={editingVolunteer}
              volunteers={volunteers}
              onUpdate={(v) => updateVolunteer(v)}
              onClose={() => setEditingVolunteer(null)}
            />
          </div>
        </div>
      )}

    

    </div>
  );
}

export default App;

import { Volunteer } from "../Types/volunteer";
import { parseISODate } from "./dates";

export const isVolunteerAvailableOn = (v: Volunteer, date: Date) => {
  const s = parseISODate(v.startDate);
  const e = parseISODate(v.endDate);
  const cur = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return s <= cur && e >= cur;
};

export const isAlreadyAssignedThisDay = (
  schedule: Record<string, Record<string, string[]>>,
  dateISO: string,
  volunteerIdStr: string
) => {
  const shifts = schedule[dateISO];
  if (!shifts) return false;
  return Object.values(shifts).some((arr) => arr.includes(volunteerIdStr));
};

export const hoursBetween = (str: string) => {
  const [start, end] = str.split(" - ");
  const [h1, m1] = start.split(":").map(Number);
  const [h2, m2] = end.split(":").map(Number);
  return h2 + m2 / 60 - (h1 + m1 / 60);
};

export const removeVolunteerFromDay = (
  schedule: Record<string, Record<string, string[]>>,
  dateISO: string,
  volunteerIdStr: string
) => {
  const dayShifts = schedule[dateISO];
  if (!dayShifts) return schedule;

  const copy = { ...schedule };
  const shiftsCopy = { ...dayShifts };

  for (const shiftName of Object.keys(shiftsCopy)) {
    const arr = [...shiftsCopy[shiftName]];
    const idx = arr.indexOf(volunteerIdStr);
    if (idx !== -1) {
      arr.splice(idx, 1);
      // limpiar si queda vacío
      if (arr.length === 0) {
        delete shiftsCopy[shiftName];
      } else {
        shiftsCopy[shiftName] = arr;
      }
    }
  }

  // si no quedan shifts ese día, lo borramos
  if (Object.keys(shiftsCopy).length === 0) {
    delete copy[dateISO];
  } else {
    copy[dateISO] = shiftsCopy;
  }

  return copy;
};

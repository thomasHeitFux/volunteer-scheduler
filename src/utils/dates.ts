export const dateToISO = (d: Date) => d.toISOString().split("T")[0];

export const parseISODate = (s: string) => {
  const d = new Date(s);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

export const startOfWeek = (d: Date) => {
  const copy = new Date(d);
  const day = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - day);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

export const addDays = (d: Date, days: number) => {
  const c = new Date(d);
  c.setDate(c.getDate() + days);
  c.setHours(0, 0, 0, 0);
  return c;
};

export const formatHuman = (d: Date) =>
  d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

export type DateType = `${number}/${number}/${number}`;

export function parseDate(date: DateType, increment?: boolean) {
  const [month, day, year] = date.split("/");

  const d = new Date(Number(year), Number(month) - 1, Number(day));

  if (increment) d.setDate(d.getDate() + 1);

  return d;
}

export function dateEquals(date: Date, other: Date) {
  return (
    date.getFullYear() === other.getFullYear() &&
    date.getMonth() === other.getMonth() &&
    date.getDate() === other.getDate()
  );
}

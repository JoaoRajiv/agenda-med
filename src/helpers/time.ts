export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];

  for (let hour = 5; hour <= 23; hour++) {
    // Interpolação direta e operador ternário são muito mais rápidos que .padStart()
    const h = hour < 10 ? `0${hour}` : hour.toString();

    // Inserimos os dois blocos de 30 minutos de uma vez, eliminando o segundo `for`
    slots.push(`${h}:00:00`, `${h}:30:00`);
  }

  return slots;
};

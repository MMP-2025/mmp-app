
export const getRandomDailyItem = <T>(array: T[]): T => {
  // Use date as seed to get the same item for the entire day
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const seed = [...dateString].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = seed % array.length;
  return array[index];
};

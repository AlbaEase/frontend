// utils/timeFormat.ts

/**
 * 시간 객체 (hour, minute)를 "HH:MM" 문자열로 변환
 * @param time { hour: number, minute: number }
 * @returns string (예: "09:30")
 */
export const formatTime = (time: { hour: number; minute: number }): string => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(time.hour)}:${pad(time.minute)}`;
};

// utils/timeFormat.ts

/**
 * 시간 객체 (hour, minute)를 "HH:MM" 문자열로 변환
 * 잘못된 값이 들어오면 "시간 정보 없음" 반환
 */
export const formatTime = (
  time: { hour?: number; minute?: number } | null | undefined
): string => {
  if (!time || typeof time.hour !== "number" || typeof time.minute !== "number") {
    return "시간 정보 없음"; // 또는 "-"
  }
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(time.hour)}:${pad(time.minute)}`;
};

// string 또는 객체 모두 처리 가능한 함수
export const formatTimeFlexible = (time: any): string => {
  if (!time) return "시간 정보 없음";

  // 문자열일 경우: "HH:mm:ss"
  if (typeof time === "string") {
    const [hour, minute] = time.split(":");
    return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
  }

  // 객체일 경우: { hour, minute }
  if (typeof time === "object" && "hour" in time && "minute" in time) {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(time.hour)}:${pad(time.minute)}`;
  }

  return "시간 정보 없음";
};

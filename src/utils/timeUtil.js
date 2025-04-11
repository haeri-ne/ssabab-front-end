// 날짜를 "YYYY-MM-DD" 형식으로 반환
export const toKSTDate = (date) => {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC+9
  const year = kst.getUTCFullYear();
  const month = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kst.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 날짜를 "YYYY-MM-DD HH:MM:SS.sss" 형식으로 반환
export const toKSTDateTime = (date) => {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC+9
  const year = kst.getUTCFullYear();
  const month = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kst.getUTCDate()).padStart(2, '0');
  const hours = String(kst.getUTCHours()).padStart(2, '0');
  const minutes = String(kst.getUTCMinutes()).padStart(2, '0');
  const seconds = String(kst.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(kst.getUTCMilliseconds()).padStart(3, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

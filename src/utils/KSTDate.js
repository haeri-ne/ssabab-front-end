// 날짜를 'YYYY-MM-DD' 형식으로 반환
export const formatKSTDate = (date) =>
  new Date(date).toLocaleDateString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\. /g, '-').replace('.', '')

// 시간을 'YYYY-MM-DD HH:MM:SS.sss' 형식으로 반환
export const getKSTDateTimeStringWithMs = (date) =>
  new Date(date.getTime() + 9 * 60 * 60 * 1000) // UTC+9 시간차 적용
    .toISOString()
    .replace('T', ' ')
    .replace('Z', '')
    
// Date 또는 문자열을 'YYYY-MM-DD' 형식으로 반환 (UTC 기준)
export const formatToYYYYMMDD = (dateStr) => {
  const date = new Date(dateStr)
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
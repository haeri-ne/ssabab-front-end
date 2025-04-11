// 로컬 스토리지로부터 가져오거나 새로 생성한 uuid 반환
export const getOrCreateUUID = (key = 'uuid') => {
  const existing = localStorage.getItem(key)
  if (existing) return existing

  const newId = crypto.randomUUID()
  localStorage.setItem(key, newId)
  return newId
}
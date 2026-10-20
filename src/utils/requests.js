const REQUESTS_STORAGE_KEY = 'toolshare.requests.v1'

export function hasPendingRequestOverlap(requests, candidate) {
  return requests.some((request) => (
    request.toolId === candidate.toolId
    && request.status === 'Pending'
    && candidate.pickupDate <= request.returnDate
    && candidate.returnDate >= request.pickupDate
  ))
}

export function readRequests() {
  try {
    const storedValue = window.localStorage.getItem(REQUESTS_STORAGE_KEY)
    const parsedValue = storedValue ? JSON.parse(storedValue) : []

    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

export function writeRequests(requests) {
  try {
    window.localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests))
    return true
  } catch {
    return false
  }
}

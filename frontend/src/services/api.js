// api.js - communicates with FastAPI backend

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || ''
).replace(/\/$/, '');

// receives response from backend
async function request(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(
      `Server returned ${response.status}. Check the FastAPI endpoint.`
    );
  }
  return response.json();
}

// Exported functions used in App.jsx
export async function getAllDispensers() {
  return request('/dispensers/all');
}

// REMOVE THIS FUNCTION FROM BACKEND TOO!!!

// export async function getNearbyDispensers(latitude, longitude) {
//   const path = `/dispensers/nearby?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`;
//   return request(path);
// }

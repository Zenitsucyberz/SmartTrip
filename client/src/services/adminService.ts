import axios from "axios";

const API = "/api";

const getUser = () => JSON.parse(sessionStorage.getItem("user") || "{}");

const authConfig = () => ({
    headers: { Authorization: `Bearer ${getUser().token}` },
});

// Trips
export const getAllTrips = () => axios.get(`${API}/trips`, authConfig());

export const assignTrip = (
    tripId: number,
    driverId: number,
    vehicleId: number,
    fare: number
) =>
    axios.post(`${API}/trips/assign`, { tripId, driverId, vehicleId, fare }, authConfig());

// Drivers
export const getDrivers = () => axios.get(`${API}/drivers`, authConfig());

// Vehicles
export const getVehicles = () => axios.get(`${API}/vehicles`, authConfig());

export const addVehicle = (vehicle: any) =>
    axios.post(`${API}/vehicles`, vehicle, authConfig());

export const deleteVehicle = (id: number) =>
    axios.delete(`${API}/vehicles/${id}`, authConfig());

export const updateVehicle = (id: number, vehicle: any) =>
    axios.put(`${API}/vehicles/${id}`, vehicle, authConfig());

// Stats
export const getAdminStats = () => axios.get(`${API}/stats/admin`, authConfig());

export const getAdminRevenue = () =>
    axios.get(`${API}/stats/admin/revenue`, authConfig());

// Driver CRUD (stored in users table with role DRIVER)
export const getDriverList = () => axios.get(`${API}/users/drivers`, authConfig());

export const createDriver = (driver: any) =>
    axios.post(`${API}/users/drivers`, driver, authConfig());

export const updateDriver = (id: number, driver: any) =>
    axios.put(`${API}/users/drivers/${id}`, driver, authConfig());

export const deleteDriver = (id: number) =>
    axios.delete(`${API}/users/drivers/${id}`, authConfig());

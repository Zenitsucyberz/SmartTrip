import axios from "axios";

const API = "http://localhost:8080/api";

const getUser = () => JSON.parse(sessionStorage.getItem("user") || "{}");

const authConfig = () => ({
    headers: { Authorization: `Bearer ${getUser().token}` },
});

export const getMyAssignedTrips = () =>
    axios.get(`${API}/trips/driver`, authConfig());

export const acceptTrip = (id: number) =>
    axios.put(`${API}/trips/${id}/accept`, {}, authConfig());

export const rejectTrip = (id: number) =>
    axios.put(`${API}/trips/${id}/reject`, {}, authConfig());

export const completeTrip = (id: number) =>
    axios.put(`${API}/trips/${id}/complete`, {}, authConfig());

export const getDriverStats = () =>
    axios.get(`${API}/stats/driver`, authConfig());

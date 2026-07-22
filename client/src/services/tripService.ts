import axios from "axios";

const API = "http://localhost:8080/api";

const getUser = () => JSON.parse(sessionStorage.getItem("user") || "{}");

const authConfig = () => ({
    headers: {
        Authorization: `Bearer ${getUser().token}`,
    },
});

export const createTrip = async (trip: any) => {
    return axios.post(`${API}/trips`, trip, authConfig());
};

// CUSTOMER ONLY
export const getTrips = async () => {
    return axios.get(`${API}/trips/my`, authConfig());
};

// ADMIN
export const getAllTrips = async () => {
    return axios.get(`${API}/trips`, authConfig());
};

export const getInsight = async (pickup: string, drop: string) => {
    return axios.get(`${API}/insights`, {
        params: {
            pickup,
            drop,
        },
        ...authConfig(),
    });
};

export const autocompletePlace = async (query: string) => {
    return axios.get(`${API}/insights/autocomplete`, {
        params: { query },
        ...authConfig(),
    });
};
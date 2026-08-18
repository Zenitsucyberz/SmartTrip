import axios from "axios";

const API = "/api";

const getUser = () => JSON.parse(sessionStorage.getItem("user") || "{}");

const authConfig = () => ({
    headers: { Authorization: `Bearer ${getUser().token}` },
});

export interface ItineraryStop {
    time: string;
    name: string;
    description: string;
    address: string;
}

export const planItinerary = async (payload: {
    area: string;
    duration: string;
    interests: string;
    passengers: number;
}) => {
    return axios.post<ItineraryStop[]>(`${API}/itinerary/plan`, payload, authConfig());
};

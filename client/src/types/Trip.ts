export interface Trip {
    id: number;

    pickupLocation: string;
    dropLocation: string;

    passengers: number;

    phoneNumber?: string;

    tripDate?: string;

    tripTime?: string;

    distanceKm?: number;

    durationMin?: number;

    fare?: number;

    status: string;

    customer?: {
        id: number;
        name: string;
        email: string;
    };

    driver?: {
        id: number;
        name: string;
        email: string;
        phone?: string;
    };

    vehicle?: {
        id: number;
        vehicleNumber: string;
        model: string;
    };
}
export interface PlaceSuggestion {
    label: string;
    lat: number;
    lon: number;
}

export interface TripInsight {
    distanceKm: number;
    durationMin: number;
    fareEstimate: number;
    weatherDescription: string;
    temperature: number;
    pickupCoordinates: [number, number];
    dropCoordinates: [number, number];
    routePath: [number, number][];
}

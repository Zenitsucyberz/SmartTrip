import { useEffect, useState } from "react";
import { createTrip, getTrips, getInsight } from "../../services/tripService";
import { planItinerary } from "../../services/itineraryService";
import type { ItineraryStop } from "../../services/itineraryService";
import type { Trip } from "../../types/Trip";
import type { TripInsight } from "../../types/Insight";
import {
  Sidebar,
  TopBar,
  PageShell,
  tableStyle,
  thStyle,
  tdStyle,
  statusBadge,
  colors,
} from "../../components/DashboardUI";
import Icon from "../../components/Icon";
import LocationAutocomplete from "../../components/LocationAutocomplete";
import TripMap from "../../components/TripMap";
import { modalInput } from "../../components/Modal";
import { downloadInvoice } from "../../utils/invoice";

const fieldLabel: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontWeight: 600,
  color: "#374151",
  fontSize: 14,
};

const fieldInput: React.CSSProperties = {
  ...modalInput,
  marginBottom: 0,
  padding: "14px 16px",
  borderRadius: 12,
  fontSize: 15,
};

export default function UserDashboard() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const [active, setActive] = useState("dashboard");

  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState(user.phone || "");
  const [tripDate, setTripDate] = useState("");
  const [tripTime, setTripTime] = useState("");

  const [trips, setTrips] = useState<Trip[]>([]);
  const [insight, setInsight] = useState<TripInsight | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [justAccepted, setJustAccepted] = useState<Trip[]>([]);

  // AI itinerary planner
  const [itineraryArea, setItineraryArea] = useState("");
  const [itineraryDuration, setItineraryDuration] = useState("half day");
  const [itineraryInterests, setItineraryInterests] = useState("");
  const [itineraryStops, setItineraryStops] = useState<ItineraryStop[] | null>(null);
  const [loadingItinerary, setLoadingItinerary] = useState(false);
  const [itineraryError, setItineraryError] = useState("");

  const loadTrips = async () => {
    try {
      const response = await getTrips();
      const data: Trip[] = response.data;

      // detect trips that just became ACCEPTED since the last load,
      // so we can show a "trip created successfully" confirmation
      setTrips((prev) => {
        const prevMap = new Map(prev.map((t) => [t.id, t.status]));
        const newlyAccepted = data.filter(
          (t) => t.status === "ACCEPTED" && prevMap.get(t.id) !== "ACCEPTED"
        );
        if (newlyAccepted.length > 0) {
          setJustAccepted((old) => [...old, ...newlyAccepted]);
        }
        return data;
      });
    } catch (err: any) {
      alert(err?.response?.data?.message || "Unable to load trips");
    }
  };

  useEffect(() => {
    loadTrips();
    const interval = setInterval(loadTrips, 15000);
    return () => clearInterval(interval);
  }, []);

  const checkInsight = async () => {
    if (!pickupLocation.trim() || !dropLocation.trim()) {
      alert("Enter pickup and destination first");
      return;
    }
    setLoadingInsight(true);
    try {
      const response = await getInsight(pickupLocation, dropLocation);
      setInsight(response.data);
    } catch (err: any) {
      alert(err?.response?.data || "Could not fetch trip info");
      console.error(err);
    } finally {
      setLoadingInsight(false);
    }
  };

  const runItineraryPlanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itineraryArea.trim()) {
      setItineraryError("Tell me which area or city you'd like to explore");
      return;
    }
    setItineraryError("");
    setLoadingItinerary(true);
    setItineraryStops(null);
    try {
      const res = await planItinerary({
        area: itineraryArea,
        duration: itineraryDuration,
        interests: itineraryInterests,
        passengers,
      });
      setItineraryStops(res.data);
    } catch (err: any) {
      setItineraryError(err?.response?.data?.message || "Couldn't plan an itinerary right now");
    } finally {
      setLoadingItinerary(false);
    }
  };

  // Pre-fills the Book Trip form for one leg of the itinerary: pickup is the
  // previous stop (or blank for the first leg, since the AI doesn't know
  // where the user is starting from), drop is this stop's address.
  const bookLeg = (index: number) => {
    if (!itineraryStops) return;
    const stop = itineraryStops[index];
    const prevAddress = index > 0 ? itineraryStops[index - 1].address : "";
    setPickupLocation(prevAddress);
    setDropLocation(stop.address);
    setInsight(null);
    setActive("book");
  };

  const resetForm = () => {
    setPickupLocation("");
    setDropLocation("");
    setPassengers(1);
    setPhoneNumber(user.phone || "");
    setTripDate("");
    setTripTime("");
    setInsight(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !pickupLocation.trim() ||
      !dropLocation.trim() ||
      !phoneNumber.trim() ||
      !tripDate ||
      !tripTime ||
      passengers < 1
    ) {
      alert("Please fill in all fields (passengers must be at least 1)");
      return;
    }

    if (!insight) {
      alert("Please check distance & weather before requesting the trip");
      return;
    }

    try {
      await createTrip({
        pickupLocation,
        dropLocation,
        passengers,
        phoneNumber,
        tripDate,
        tripTime,
        distanceKm: insight.distanceKm,
        durationMin: insight.durationMin,
      });
      resetForm();
      loadTrips();
      setActive("trips");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Trip creation failed");
    }
  };

  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <div style={{ display: "flex", background: colors.bg }}>
      <Sidebar
        title="SmartTrip"
        userName={user.name || user.email || "User"}
        active={active}
        onSelect={setActive}
        onLogout={logout}
        items={[
          { key: "dashboard", label: "Dashboard", icon: "dashboard" },
          { key: "book", label: "Book Trip", icon: "map" },
          { key: "planner", label: "AI Planner", icon: "sparkle" },
          { key: "trips", label: "My Trips", icon: "trips" },
        ]}
      />

      <PageShell>
        <TopBar title="Customer" userName={user.name || user.email || "User"} />

        {/* ---------------- SUCCESS BANNERS ---------------- */}
        {justAccepted.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            {justAccepted.map((trip) => (
              <div
                key={trip.id}
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: 16,
                  padding: "18px 24px",
                  marginBottom: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    color: "#166534",
                    fontWeight: 600,
                    fontSize: 15,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Icon name="check" size={20} />
                  <span>
                    Trip #{trip.id} created successfully! Your driver
                    {trip.driver?.name ? ` (${trip.driver.name})` : ""} has
                    accepted the trip and is on the way.
                  </span>
                </div>
                <button
                  onClick={() =>
                    setJustAccepted((old) => old.filter((t) => t.id !== trip.id))
                  }
                  style={{
                    border: "none",
                    background: "transparent",
                    fontSize: 20,
                    cursor: "pointer",
                    color: "#166534",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ---------------- DASHBOARD ---------------- */}
        {active === "dashboard" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <h1 style={{ margin: 0 }}>Recent Trips</h1>
              {trips.length > 0 && (
                <button
                  onClick={() => setActive("trips")}
                  style={{
                    background: "#0f172a",
                    color: "#fff",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: 30,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  View All
                </button>
              )}
            </div>

            {trips.length === 0 ? (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 24,
                  padding: 40,
                  textAlign: "center",
                  color: "#94a3b8",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                }}
              >
                No trips yet. Book your first trip to see it here.
              </div>
            ) : (
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Pickup</th>
                    <th style={thStyle}>Destination</th>
                    <th style={thStyle}>Pax</th>
                    <th style={thStyle}>Fare</th>
                    <th style={thStyle}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.slice(0, 5).map((trip) => (
                    <tr key={trip.id}>
                      <td style={tdStyle}>{trip.id}</td>
                      <td style={tdStyle}>{trip.pickupLocation}</td>
                      <td style={tdStyle}>{trip.dropLocation}</td>
                      <td style={tdStyle}>{trip.passengers}</td>
                      <td style={tdStyle}>{trip.fare != null ? `₹${trip.fare}` : "-"}</td>
                      <td style={tdStyle}>
                        <span style={statusBadge(trip.status)}>
                          {trip.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* ---------------- BOOK TRIP ---------------- */}
        {active === "book" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <h1 style={{ margin: 0 }}>Book a Trip</h1>
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: 32,
                boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                marginBottom: 28,
              }}
            >
              <h2
                style={{
                  margin: "0 0 24px 0",
                  fontSize: 22,
                  color: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Icon name="map" size={22} style={{ color: colors.accent }} />
                Trip Details
              </h2>

              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <label style={fieldLabel}>Name</label>
                    <input
                      style={{ ...fieldInput, background: "#f3f4f6", color: "#64748b" }}
                      value={user.name || ""}
                      readOnly
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Email</label>
                    <input
                      style={{ ...fieldInput, background: "#f3f4f6", color: "#64748b" }}
                      value={user.email || ""}
                      readOnly
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <label style={fieldLabel}>Pickup Location</label>
                    <LocationAutocomplete
                      style={fieldInput}
                      placeholder="Start typing an address..."
                      value={pickupLocation}
                      required
                      onChange={(v) => {
                        setPickupLocation(v);
                        setInsight(null);
                      }}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Destination</label>
                    <LocationAutocomplete
                      style={fieldInput}
                      placeholder="Start typing an address..."
                      value={dropLocation}
                      required
                      onChange={(v) => {
                        setDropLocation(v);
                        setInsight(null);
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <label style={fieldLabel}>Phone Number</label>
                    <input
                      style={fieldInput}
                      placeholder="e.g. +7 700 123 4567"
                      value={phoneNumber}
                      required
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Passengers</label>
                    <input
                      style={fieldInput}
                      type="number"
                      min={1}
                      value={passengers}
                      required
                      onChange={(e) => setPassengers(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <label style={fieldLabel}>Trip Date</label>
                    <input
                      style={fieldInput}
                      type="date"
                      value={tripDate}
                      required
                      onChange={(e) => setTripDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Trip Time</label>
                    <input
                      style={fieldInput}
                      type="time"
                      value={tripTime}
                      required
                      onChange={(e) => setTripTime(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  {!insight ? (
                    <button
                      type="button"
                      onClick={checkInsight}
                      disabled={loadingInsight}
                      style={{
                        padding: "14px 28px",
                        background: "#0f172a",
                        color: "#fff",
                        border: "none",
                        borderRadius: 12,
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 15,
                        opacity: loadingInsight ? 0.6 : 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 9,
                      }}
                    >
                      <Icon name={loadingInsight ? "clock" : "weather"} size={18} />
                      {loadingInsight
                        ? "Checking…"
                        : "Check Distance & Weather"}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      style={{
                        padding: "14px 28px",
                        background: "#2563EB",
                        color: "#fff",
                        border: "none",
                        borderRadius: 12,
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 15,
                        display: "flex",
                        alignItems: "center",
                        gap: 9,
                      }}
                    >
                      <Icon name="send" size={18} />
                      Request Trip
                    </button>
                  )}
                </div>
              </form>

              {/* Insight card */}
              {insight && (
                <div
                  style={{
                    marginTop: 24,
                    padding: 24,
                    background: "#f0fdf4",
                    borderRadius: 16,
                    border: "1px solid #bbf7d0",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 16px 0",
                      color: "#166534",
                      fontSize: 18,
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                    }}
                  >
                    <Icon name="pin" size={19} />
                    Trip Insight
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        background: "#fff",
                        padding: 18,
                        borderRadius: 12,
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 28,
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        {insight.distanceKm} km
                      </div>
                      <div style={{ color: "#64748b", fontSize: 13 }}>
                        Distance
                      </div>
                    </div>
                    <div
                      style={{
                        background: "#fff",
                        padding: 18,
                        borderRadius: 12,
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 28,
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        {insight.durationMin} min
                      </div>
                      <div style={{ color: "#64748b", fontSize: 13 }}>
                        Est. Time
                      </div>
                    </div>
                    <div
                      style={{
                        background: "#fff",
                        padding: 18,
                        borderRadius: 12,
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 28,
                          fontWeight: 700,
                          color: "#059669",
                        }}
                      >
                        ₹{insight.fareEstimate}
                      </div>
                      <div style={{ color: "#64748b", fontSize: 13 }}>
                        Est. Fare
                      </div>
                    </div>
                    <div
                      style={{
                        background: "#fff",
                        padding: 18,
                        borderRadius: 12,
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 28,
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        {insight.temperature}°C
                      </div>
                      <div style={{ color: "#64748b", fontSize: 13 }}>
                        {insight.weatherDescription}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <TripMap
                      pickup={insight.pickupCoordinates}
                      drop={insight.dropCoordinates}
                      routePath={insight.routePath}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ---------------- AI TRIP PLANNER ---------------- */}
        {active === "planner" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <h1 style={{ margin: 0 }}>AI Trip Planner</h1>
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: 32,
                boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                marginBottom: 28,
              }}
            >
              <h2
                style={{
                  margin: "0 0 8px 0",
                  fontSize: 22,
                  color: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Icon name="sparkle" size={22} style={{ color: colors.accent }} />
                Plan a Day
              </h2>
              <div style={{ ...fieldLabel, fontWeight: 400, color: "#64748b", marginBottom: 24 }}>
                Describe where you're headed and what you're into - the AI suggests a
                timeline of stops, and each one can become a trip booking with one click.
              </div>

              <form onSubmit={runItineraryPlanner}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <label style={fieldLabel}>Area / City</label>
                    <input
                      style={fieldInput}
                      placeholder="e.g. Fort Kochi, Kerala"
                      value={itineraryArea}
                      onChange={(e) => setItineraryArea(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Duration</label>
                    <select
                      style={fieldInput}
                      value={itineraryDuration}
                      onChange={(e) => setItineraryDuration(e.target.value)}
                    >
                      <option value="a few hours">A few hours</option>
                      <option value="half day">Half day</option>
                      <option value="full day">Full day</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={fieldLabel}>Interests (optional)</label>
                  <input
                    style={fieldInput}
                    placeholder="e.g. history, local food, quiet nature spots"
                    value={itineraryInterests}
                    onChange={(e) => setItineraryInterests(e.target.value)}
                  />
                </div>

                {itineraryError && (
                  <div
                    style={{
                      marginBottom: 16,
                      padding: "12px 16px",
                      background: "#fee2e2",
                      color: "#b91c1c",
                      borderRadius: 10,
                      fontSize: 14,
                    }}
                  >
                    {itineraryError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loadingItinerary}
                  style={{
                    padding: "14px 28px",
                    background: colors.accent,
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 15,
                    opacity: loadingItinerary ? 0.6 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                  }}
                >
                  <Icon name={loadingItinerary ? "clock" : "sparkle"} size={18} />
                  {loadingItinerary ? "Planning…" : "Generate Itinerary"}
                </button>
              </form>

              {/* Timeline of suggested stops */}
              {itineraryStops && (
                <div style={{ marginTop: 28 }}>
                  {itineraryStops.map((stop, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 18,
                        paddingBottom: i === itineraryStops.length - 1 ? 0 : 22,
                      }}
                    >
                      {/* Timeline rail */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 14 }}>
                        <div
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            background: colors.accent,
                            flexShrink: 0,
                            marginTop: 4,
                          }}
                        />
                        {i !== itineraryStops.length - 1 && (
                          <div style={{ width: 2, flex: 1, background: "#e2e8f0", marginTop: 4 }} />
                        )}
                      </div>

                      <div
                        style={{
                          flex: 1,
                          background: "#f8fafc",
                          borderRadius: 16,
                          padding: "16px 20px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 16,
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 13, color: colors.accent, fontWeight: 700, marginBottom: 3 }}>
                            {stop.time}
                          </div>
                          <div style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                            {stop.name}
                          </div>
                          <div style={{ fontSize: 14, color: "#64748b" }}>{stop.description}</div>
                        </div>
                        <button
                          onClick={() => bookLeg(i)}
                          style={{
                            padding: "10px 16px",
                            background: "#0f172a",
                            color: "#fff",
                            border: "none",
                            borderRadius: 10,
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: 13,
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            flexShrink: 0,
                          }}
                        >
                          <Icon name="send" size={14} />
                          Book this leg
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ---------------- MY TRIPS ---------------- */}
        {active === "trips" && (
          <>
            <h1 style={{ marginTop: 0 }}>My Trips</h1>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Pickup</th>
                  <th style={thStyle}>Destination</th>
                  <th style={thStyle}>Date/Time</th>
                  <th style={thStyle}>Pax</th>
                  <th style={thStyle}>Fare</th>
                  <th style={thStyle}>Driver</th>
                  <th style={thStyle}>Vehicle</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip.id}>
                    <td style={tdStyle}>{trip.id}</td>
                    <td style={tdStyle}>{trip.pickupLocation}</td>
                    <td style={tdStyle}>{trip.dropLocation}</td>
                    <td style={tdStyle}>
                      {trip.tripDate || "-"} {trip.tripTime || ""}
                    </td>
                    <td style={tdStyle}>{trip.passengers}</td>
                    <td style={tdStyle}>{trip.fare != null ? `₹${trip.fare}` : "-"}</td>
                    <td style={tdStyle}>{trip.driver?.name || "-"}</td>
                    <td style={tdStyle}>
                      {trip.vehicle
                        ? `${trip.vehicle.model} (${trip.vehicle.vehicleNumber})`
                        : "-"}
                    </td>
                    <td style={tdStyle}>
                      <span style={statusBadge(trip.status)}>
                        {trip.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {trip.status === "COMPLETED" ? (
                        <button
                          style={{
                            padding: "8px 14px",
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontWeight: 600,
                            background: "#4F46E5",
                            color: "#fff",
                          }}
                          onClick={() => downloadInvoice(trip)}
                        >
                          Download
                        </button>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </PageShell>
    </div>
  );
}

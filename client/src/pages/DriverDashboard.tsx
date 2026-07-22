import { useEffect, useState } from "react";
import {
  getMyAssignedTrips,
  acceptTrip,
  rejectTrip,
  completeTrip,
  getDriverStats,
} from "../services/driverService";
import type { Trip } from "../types/Trip";
import {
  Sidebar,
  StatCard,
  PageShell,
  TopBar,
  tableStyle,
  thStyle,
  tdStyle,
  colors,
} from "../components/DashboardUI";

export default function DriverDashboard() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const [active, setActive] = useState("dashboard");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [stats, setStats] = useState<any>(null);

  const loadData = async () => {
    try {
      const [t, s] = await Promise.all([
        getMyAssignedTrips(),
        getDriverStats(),
      ]);
      setTrips(t.data);
      setStats(s.data);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to load your data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const act = async (fn: (id: number) => Promise<any>, id: number) => {
    try {
      await fn(id);
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Action failed");
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
        userName={user.name || "Driver"}
        active={active}
        onSelect={setActive}
        onLogout={logout}
        items={[
          { key: "dashboard", label: "Dashboard", icon: "dashboard" },
          { key: "trips", label: "Trips", icon: "trips" },
        ]}
      />

      <PageShell>
        <TopBar
          title="Driver"
          userName={user.name || "Driver"}
        />
        {active === "dashboard" && (
          <>
            <h1 style={{ marginTop: 0 }}>Dashboard</h1>
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 30 }}>
              <StatCard
                icon="wallet"
                label="Monthly Revenue"
                value={`₹${stats ? stats.monthlyRevenue : 0}`}
                accent={colors.accent}
              />
              <StatCard
                icon="trending"
                label="Annual Revenue"
                value={`₹${stats ? stats.annualRevenue : 0}`}
                accent="#059669"
              />
              <StatCard
                icon="check"
                label="Trips Completed"
                value={stats ? stats.completedTrips : 0}
                accent="#7c3aed"
              />
            </div>
          </>
        )}

        {active === "trips" && (
          <>
            <h1 style={{ marginTop: 0 }}>My Assigned Trips</h1>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Pickup</th>
                  <th style={thStyle}>Destination</th>
                  <th style={thStyle}>Pax</th>
                  <th style={thStyle}>Vehicle</th>
                  <th style={thStyle}>Fare</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip.id}>
                    <td style={tdStyle}>{trip.id}</td>
                    <td style={tdStyle}>
                      {trip.customer?.email || "-"}
                    </td>
                    <td style={tdStyle}>{trip.pickupLocation}</td>
                    <td style={tdStyle}>{trip.dropLocation}</td>
                    <td style={tdStyle}>{trip.passengers}</td>
                    <td style={tdStyle}>
                      {trip.vehicle
                        ? `${trip.vehicle.model} (${trip.vehicle.vehicleNumber})`
                        : "-"}
                    </td>
                    <td style={tdStyle}>{trip.fare != null ? `₹${trip.fare}` : "-"}</td>
                    <td style={tdStyle}>{trip.status}</td>
                    <td style={tdStyle}>
                      {trip.status === "ASSIGNED" && (
                        <>
                          <button
                            onClick={() => act(acceptTrip, trip.id)}
                          >
                            Accept
                          </button>{" "}
                          <button
                            onClick={() => act(rejectTrip, trip.id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {trip.status === "ACCEPTED" && (
                        <button
                          onClick={() => act(completeTrip, trip.id)}
                        >
                          Complete
                        </button>
                      )}
                      {(trip.status === "REJECTED" ||
                        trip.status === "COMPLETED") && (
                          <span>No actions</span>
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

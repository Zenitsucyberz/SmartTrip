import { useEffect, useState } from "react";
import {
  getAllTrips,
  assignTrip,
  getDrivers,
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  getAdminStats,
  getAdminRevenue,
  getDriverList,
  createDriver,
  updateDriver,
  deleteDriver,
} from "../services/adminService";
import type { Trip } from "../types/Trip";
import {
  Sidebar,
  TopBar,
  StatCard,
  PageShell,
  tableStyle,
  thStyle,
  tdStyle,
  statusBadge,
  actionButton,
  colors,
} from "../components/DashboardUI";
import Icon from "../components/Icon";
import Modal, { modalInput, primaryBtn } from "../components/Modal";
import BarChart from "../components/BarChart";
import { downloadInvoice } from "../utils/invoice";

const emptyVehicle = {
  vehicleNumber: "",
  model: "",
  capacity: 4,
  fuelType: "Petrol",
  status: "AVAILABLE",
};

const emptyDriver = { name: "", email: "", phone: "", password: "" };

export default function AdminDashboard() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const [active, setActive] = useState("dashboard");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [assignDrivers, setAssignDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [revenue, setRevenue] = useState<any>(null);
  const [driverList, setDriverList] = useState<any[]>([]);

  // chart toggle
  const [revenueMode, setRevenueMode] = useState<"monthly" | "annual">("monthly");

  // vehicle modal
  const [vehicleModal, setVehicleModal] = useState(false);
  const [vehicleForm, setVehicleForm] = useState<any>(emptyVehicle);
  const [editVehicleId, setEditVehicleId] = useState<number | null>(null);

  // driver modal
  const [driverModal, setDriverModal] = useState(false);
  const [driverForm, setDriverForm] = useState<any>(emptyDriver);
  const [editDriverId, setEditDriverId] = useState<number | null>(null);

  const loadAll = async () => {
    try {
      const [t, d, v, s, r, dl] = await Promise.all([
        getAllTrips(),
        getDrivers(),
        getVehicles(),
        getAdminStats(),
        getAdminRevenue(),
        getDriverList(),
      ]);
      setTrips(t.data);
      setAssignDrivers(d.data);
      setVehicles(v.data);
      setStats(s.data);
      setRevenue(r.data);
      setDriverList(dl.data);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to load admin data");
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // ---------- VEHICLE ----------
  const openAddVehicle = () => {
    setVehicleForm(emptyVehicle);
    setEditVehicleId(null);
    setVehicleModal(true);
  };

  const openEditVehicle = (v: any) => {
    setVehicleForm({ ...v });
    setEditVehicleId(v.id);
    setVehicleModal(true);
  };

  const saveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editVehicleId) {
        await updateVehicle(editVehicleId, vehicleForm);
      } else {
        await addVehicle(vehicleForm);
      }
      setVehicleModal(false);
      loadAll();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to save vehicle");
    }
  };

  const removeVehicle = async (id: number) => {
    if (!confirm("Delete this vehicle?")) return;
    try {
      await deleteVehicle(id);
      loadAll();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete vehicle");
    }
  };

  // ---------- DRIVER ----------
  const openAddDriver = () => {
    setDriverForm(emptyDriver);
    setEditDriverId(null);
    setDriverModal(true);
  };

  const openEditDriver = (d: any) => {
    setDriverForm({ name: d.name, email: d.email, phone: d.phone, password: "" });
    setEditDriverId(d.id);
    setDriverModal(true);
  };

  const saveDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editDriverId) {
        await updateDriver(editDriverId, driverForm);
      } else {
        await createDriver(driverForm);
      }
      setDriverModal(false);
      loadAll();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to save driver");
    }
  };

  const removeDriver = async (id: number) => {
    if (!confirm("Delete this driver?")) return;
    try {
      await deleteDriver(id);
      loadAll();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete driver");
    }
  };

  // ---------- ASSIGN ----------
  const handleAssign = async (
    tripId: number,
    driverId: string,
    vehicleId: string,
    fare: string
  ) => {
    if (!driverId || !vehicleId || !fare) {
      alert("Select a driver, a vehicle and enter a fare");
      return;
    }
    try {
      await assignTrip(tripId, Number(driverId), Number(vehicleId), Number(fare));
      loadAll();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to assign trip");
    }
  };

  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  const headingRow = (title: string, button?: React.ReactNode) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18,
      }}
    >
      <h1 style={{ margin: 0 }}>{title}</h1>
      {button}
    </div>
  );

  return (
    <div style={{ display: "flex", background: colors.bg }}>
      <Sidebar
        title="SmartTrip"
        userName={user.name || user.email}
        active={active}
        onSelect={setActive}
        onLogout={logout}
        items={[
          { key: "dashboard", label: "Dashboard", icon: "dashboard" },
          { key: "trips", label: "Trips", icon: "trips" },
          { key: "vehicles", label: "Vehicles", icon: "car" },
          { key: "drivers", label: "Drivers", icon: "driver" },
        ]}
      />

      <PageShell>
        <TopBar
          title="Administrator"
          userName={user.name || "Admin"}
        />
        {/* ---------------- DASHBOARD ---------------- */}
        {active === "dashboard" && (
          <>
            <h1 style={{ marginTop: 0 }}>Dashboard</h1>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                gap: 32,
                marginBottom: 36,
              }}
            >
              <StatCard
                icon="check"
                label="Trips Completed"
                value={stats ? stats.completedTrips : 0}
                accent="#059669"
              />
              <StatCard
                icon="car"
                label="Vehicles"
                value={stats ? stats.totalVehicles : 0}
                accent={colors.accent}
              />
              <StatCard
                icon="driver"
                label="Drivers"
                value={stats ? stats.totalDrivers : 0}
                accent="#7c3aed"
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 25,
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 30,
                    color: "#0f172a",
                  }}
                >
                  Revenue Overview
                </h2>

                <div
                  style={{
                    color: "#94a3b8",
                    marginTop: 5,
                  }}
                >
                  SmartTrip Revenue Analytics
                </div>
              </div>

              <button
                onClick={() =>
                  setRevenueMode(
                    revenueMode === "monthly"
                      ? "annual"
                      : "monthly"
                  )
                }
                style={{
                  background: "#0f172a",
                  color: "#fff",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: 30,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {revenueMode === "monthly"
                  ? "Annual"
                  : "Monthly"}
              </button>
            </div>

            {revenue && (
              <BarChart
                data={
                  revenueMode === "monthly"
                    ? revenue.monthly
                    : revenue.annual
                }
                color={
                  revenueMode === "monthly" ? colors.accent : "#059669"
                }
              />
            )}
          </>
        )}

        {/* ---------------- VEHICLES ---------------- */}
        {active === "vehicles" && (
          <>
            {headingRow(
              "Vehicles",
              <button style={{
                background: "#2563EB",
                color: "#fff",
                border: "none",
                padding: "8px 14px",
                borderRadius: 8,
                cursor: "pointer",
              }} onClick={openAddVehicle}>
                + Add Vehicle
              </button>
            )}

            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Number</th>
                  <th style={thStyle}>Model</th>
                  <th style={thStyle}>Capacity</th>
                  <th style={thStyle}>Fuel</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id}>
                    <td style={tdStyle}>{v.id}</td>
                    <td style={tdStyle}>{v.vehicleNumber}</td>
                    <td style={tdStyle}>{v.model}</td>
                    <td style={tdStyle}>{v.capacity}</td>
                    <td style={tdStyle}>{v.fuelType}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: 30,
                          fontWeight: 600,
                          background:
                            v.status === "AVAILABLE"
                              ? "#DCFCE7"
                              : v.status === "IN_USE"
                                ? "#DBEAFE"
                                : "#FEE2E2",
                          color:
                            v.status === "AVAILABLE"
                              ? "#166534"
                              : v.status === "IN_USE"
                                ? "#1D4ED8"
                                : "#991B1B",
                        }}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                        }}
                      >
                        <button
                          style={{
                            background: "#2563EB",
                            color: "#fff",
                            border: "none",
                            padding: "8px 14px",
                            borderRadius: 8,
                            cursor: "pointer",
                          }}
                          onClick={() => openEditVehicle(v)}
                        >
                          Edit
                        </button>

                        <button
                          style={{
                            background: "#DC2626",
                            color: "#fff",
                            border: "none",
                            padding: "8px 14px",
                            borderRadius: 8,
                            cursor: "pointer",
                          }}
                          onClick={() => removeVehicle(v.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ---------------- DRIVERS ---------------- */}
        {active === "drivers" && (
          <>
            {headingRow(
              "Drivers",
              <button style={{
                background: "#2563EB",
                color: "#fff",
                border: "none",
                padding: "8px 14px",
                borderRadius: 8,
                cursor: "pointer",
              }} onClick={openAddDriver}>
                + Add Driver
              </button>
            )}



            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {driverList.map((d) => (
                  <tr key={d.id}>
                    <td style={tdStyle}>{d.id}</td>
                    <td style={tdStyle}>{d.name}</td>
                    <td style={tdStyle}>{d.email}</td>
                    <td style={tdStyle}>{d.phone}</td>
                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                        }}
                      >
                        <button
                          style={{
                            background: "#2563EB",
                            color: "#fff",
                            border: "none",
                            padding: "8px 14px",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                          onClick={() => openEditDriver(d)}
                        >
                          Edit
                        </button>

                        <button
                          style={{
                            background: "#DC2626",
                            color: "#fff",
                            border: "none",
                            padding: "8px 14px",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                          onClick={() => removeDriver(d.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </>
        )}

        {/* ---------------- TRIPS ---------------- */}
        {active === "trips" && (
          <>
            <h1 style={{ marginTop: 0 }}>All Trips</h1>
            <div
              style={{
                overflowX: "auto",
                borderRadius: 24,
                boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
              }}
            >
              <table style={{ ...tableStyle, boxShadow: "none", minWidth: 1180 }}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, minWidth: 60 }}>ID</th>
                    <th style={{ ...thStyle, minWidth: 170 }}>Customer</th>
                    <th style={{ ...thStyle, minWidth: 130 }}>Pickup</th>
                    <th style={{ ...thStyle, minWidth: 130 }}>Destination</th>
                    <th style={{ ...thStyle, minWidth: 60 }}>Pax</th>
                    <th style={{ ...thStyle, minWidth: 110 }}>Status</th>
                    <th style={{ ...thStyle, minWidth: 200 }}>Driver</th>
                    <th style={{ ...thStyle, minWidth: 190 }}>Vehicle</th>
                    <th style={{ ...thStyle, minWidth: 130 }}>Fare</th>
                    <th style={{ ...thStyle, minWidth: 110 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip) => (
                    <AssignRow
                      key={trip.id}
                      trip={trip}
                      drivers={assignDrivers}
                      vehicles={vehicles}
                      onAssign={handleAssign}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </PageShell>

      {/* ---------------- VEHICLE MODAL ---------------- */}
      <Modal
        open={vehicleModal}
        title={editVehicleId ? "Edit Vehicle" : "Add Vehicle"}
        onClose={() => setVehicleModal(false)}
      >
        <form onSubmit={saveVehicle}>
          <input
            style={modalInput}
            placeholder="Vehicle Number"
            value={vehicleForm.vehicleNumber}
            required
            onChange={(e) =>
              setVehicleForm({ ...vehicleForm, vehicleNumber: e.target.value })
            }
          />
          <input
            style={modalInput}
            placeholder="Model"
            value={vehicleForm.model}
            required
            onChange={(e) =>
              setVehicleForm({ ...vehicleForm, model: e.target.value })
            }
          />
          <input
            style={modalInput}
            type="number"
            min={1}
            placeholder="Capacity"
            value={vehicleForm.capacity}
            required
            onChange={(e) =>
              setVehicleForm({
                ...vehicleForm,
                capacity: Number(e.target.value),
              })
            }
          />
          <input
            style={modalInput}
            placeholder="Fuel Type"
            value={vehicleForm.fuelType}
            required
            onChange={(e) =>
              setVehicleForm({ ...vehicleForm, fuelType: e.target.value })
            }
          />
          <select
            style={modalInput}
            value={vehicleForm.status}
            onChange={(e) =>
              setVehicleForm({ ...vehicleForm, status: e.target.value })
            }
          >
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="IN_USE">IN_USE</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
          </select>
          <button type="submit" style={primaryBtn}>
            {editVehicleId ? "Save Changes" : "Add Vehicle"}
          </button>
        </form>
      </Modal>

      {/* ---------------- DRIVER MODAL ---------------- */}
      <Modal
        open={driverModal}
        title={editDriverId ? "Edit Driver" : "Add Driver"}
        onClose={() => setDriverModal(false)}
      >
        <form onSubmit={saveDriver}>
          <input
            style={modalInput}
            placeholder="Name"
            value={driverForm.name}
            required
            onChange={(e) =>
              setDriverForm({ ...driverForm, name: e.target.value })
            }
          />
          <input
            style={modalInput}
            type="email"
            placeholder="Email"
            value={driverForm.email}
            required
            onChange={(e) =>
              setDriverForm({ ...driverForm, email: e.target.value })
            }
          />
          <input
            style={modalInput}
            placeholder="Phone"
            value={driverForm.phone}
            onChange={(e) =>
              setDriverForm({ ...driverForm, phone: e.target.value })
            }
          />
          <input
            style={modalInput}
            type="password"
            placeholder={
              editDriverId
                ? "New password (leave blank to keep)"
                : "Password"
            }
            value={driverForm.password}
            onChange={(e) =>
              setDriverForm({ ...driverForm, password: e.target.value })
            }
          />
          {!editDriverId && (
            <div
              style={{
                marginTop: -6,
                marginBottom: 14,
                fontSize: 13,
                color: "#94a3b8",
              }}
            >
              Leave blank to auto-set the password to{" "}
              <b>driver123</b>. Share it with the driver so they can log in.
            </div>
          )}
          <button type="submit" style={primaryBtn}>
            {editDriverId ? "Save Changes" : "Add Driver"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

function AssignRow({
  trip,
  drivers,
  vehicles,
  onAssign,
}: {
  trip: Trip;
  drivers: any[];
  vehicles: any[];
  onAssign: (
    tripId: number,
    driverId: string,
    vehicleId: string,
    fare: string
  ) => void;
}) {
  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");

  // Same estimate formula as the insight API (base 500 + 100/km), pre-filled
  // so the admin sees the suggested fare first and can still edit it.
  const suggestedFare =
    trip.distanceKm != null
      ? Math.round((500 + trip.distanceKm * 100) * 10) / 10
      : null;

  // A rejected trip already has a fare from its first assignment - keep that
  // rather than re-suggesting, so re-assigning doesn't silently change price.
  const [fare, setFare] = useState(
    trip.fare != null
      ? String(trip.fare)
      : suggestedFare != null
        ? String(suggestedFare)
        : ""
  );

  const isRejected = trip.status === "REJECTED";
  // A driver handing a trip back (REJECTED) puts it right back in the admin's
  // queue, so both PENDING and REJECTED get the full assign controls.
  const canAssign = trip.status === "PENDING" || isRejected;

  const controlStyle: React.CSSProperties = {
    width: "100%",
    minWidth: 170,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #CBD5E1",
    fontSize: 14,
    boxSizing: "border-box",
    background: "#fff",
    color: "#0f172a",
  };

  return (
    <tr>
      <td style={tdStyle}>{trip.id}</td>
      <td style={tdStyle}>{trip.customer?.email || "-"}</td>
      <td style={tdStyle}>{trip.pickupLocation}</td>
      <td style={tdStyle}>{trip.dropLocation}</td>
      <td style={tdStyle}>{trip.passengers}</td>
      <td style={tdStyle}>
        <span style={statusBadge(trip.status)}>
          {trip.status}
        </span>
      </td>

      {/* Driver: editable select while awaiting assignment, read-only once accepted */}
      <td style={tdStyle}>
        {canAssign ? (
          <>
            <select
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              style={controlStyle}
            >
              <option value="">Select Driver</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.email}
                  {trip.driver?.id === d.id ? " — rejected this trip" : ""}
                </option>
              ))}
            </select>
            {isRejected && trip.driver && (
              <div
                style={{
                  fontSize: 11,
                  color: "#b91c1c",
                  marginTop: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Icon name="alert" size={12} />
                Rejected by {trip.driver.name || trip.driver.email}
              </div>
            )}
          </>
        ) : (
          trip.driver?.name || trip.driver?.email || "-"
        )}
      </td>

      {/* Vehicle: editable select while awaiting assignment, read-only once accepted */}
      <td style={tdStyle}>
        {canAssign ? (
          <select
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            style={controlStyle}
          >
            <option value="">Select Vehicle</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.vehicleNumber}
              </option>
            ))}
          </select>
        ) : trip.vehicle ? (
          `${trip.vehicle.model} (${trip.vehicle.vehicleNumber})`
        ) : (
          "-"
        )}
      </td>

      {/* Fare: editable input while awaiting assignment, read-only once accepted */}
      <td style={tdStyle}>
        {canAssign ? (
          <>
            <input
              type="number"
              min={0}
              placeholder="₹ Fare"
              value={fare}
              onChange={(e) => setFare(e.target.value)}
              style={{ ...controlStyle, minWidth: 110, fontWeight: 600 }}
            />
            {trip.fare == null && suggestedFare != null && (
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                Suggested — editable
              </div>
            )}
          </>
        ) : trip.fare != null ? (
          <span style={{ fontWeight: 600 }}>₹{trip.fare}</span>
        ) : (
          "-"
        )}
      </td>

      {/* Action: (Re)assign while awaiting a driver, otherwise Invoice once a fare exists */}
      <td style={tdStyle}>
        {canAssign ? (
          <button
            style={{
              ...actionButton,
              width: "100%",
              background: isRejected ? "#b45309" : "#0f172a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
            }}
            onClick={() => onAssign(trip.id, driverId, vehicleId, fare)}
          >
            <Icon name="driver" size={15} />
            {isRejected ? "Reassign" : "Assign"}
          </button>
        ) : trip.fare != null ? (
          <button
            style={{
              ...actionButton,
              width: "100%",
              background: "#4F46E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
            }}
            onClick={() => downloadInvoice(trip)}
          >
            <Icon name="invoice" size={15} />
            Invoice
          </button>
        ) : (
          <span style={{ color: "#94a3b8" }}>—</span>
        )}
      </td>
    </tr>
  );
}

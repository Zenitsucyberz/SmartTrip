import { jsPDF } from "jspdf";
import type { Trip } from "../types/Trip";

export function downloadInvoice(trip: Trip) {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229);
    doc.text("SmartTrip", 20, 22);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Trip Invoice", 20, 30);

    // line
    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);

    // Body
    doc.setFontSize(12);
    doc.setTextColor(30);

    const fare = (trip as any).fare ?? 0;
    const rows: [string, string][] = [
        ["Invoice No", `INV-${String(trip.id).padStart(5, "0")}`],
        ["Customer", trip.customer?.email || "-"],
        ["Driver", trip.driver?.email || "Not assigned"],
        ["Pickup", trip.pickupLocation],
        ["Destination", trip.dropLocation],
        ["Passengers", String(trip.passengers)],
        ["Status", trip.status],
    ];

    let y = 48;
    rows.forEach(([k, v]) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${k}:`, 20, y);
        doc.setFont("helvetica", "normal");
        doc.text(String(v), 75, y);
        y += 11;
    });

    // Total box
    y += 6;
    doc.setDrawColor(200);
    doc.line(20, y, 190, y);
    y += 12;
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("Total Fare:", 20, y);
    doc.setTextColor(5, 150, 105);
    doc.text(`${fare} KZT`, 75, y);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for riding with SmartTrip.", 20, 280);

    doc.save(`invoice-trip-${trip.id}.pdf`);
}

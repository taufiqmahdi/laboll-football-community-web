export type PaymentStatus = "paid" | "pending" | "expired";

export type Booking = {
  id: string; // LBL-YYMMDD-XXXX
  scheduleId: string;
  playerName: string;
  role: "Player" | "GK";
  amount: number;
  status: PaymentStatus;
  method?: string; // paid only
  paidAt?: string; // paid only, "1 Okt 2026, 14:20"
  payBefore?: string; // pending only, "Senin, 5 Okt · 21:00"
};

// Dummy data until there's a real API.
const bookings: Booking[] = [
  {
    id: "LBL-261001-A7K2",
    scheduleId: "sch-001",
    playerName: "Rizky",
    role: "Player",
    amount: 85000,
    status: "paid",
    method: "QRIS",
    paidAt: "1 Okt 2026, 14:20",
  },
  {
    id: "LBL-261004-Q9M5",
    scheduleId: "sch-002",
    playerName: "Dimas",
    role: "GK",
    amount: 60000,
    status: "pending",
    payBefore: "Senin, 5 Okt · 21:00",
  },
  {
    id: "LBL-260928-Z3X8",
    scheduleId: "sch-003",
    playerName: "Fajar",
    role: "Player",
    amount: 75000,
    status: "expired",
  },
];

// Pretends to be a network call so the UI already handles loading.
export async function findBooking(id: string): Promise<Booking | null> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return bookings.find((b) => b.id === id) ?? null;
}

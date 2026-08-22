import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StaffPanel from "./StaffPanel";

const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

const toastMock = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastMock }),
}));

// StationMap renders a real Leaflet map, which isn't meaningful in jsdom
// and isn't what these tests are about — stub it out.
vi.mock("@/components/StationMap", () => ({
  default: () => <div data-testid="station-map" />,
}));

vi.mock("@/components/TripReceiptStaff", () => ({
  default: ({ trip }: { trip: { tracking_code: string } }) => (
    <div data-testid="trip-receipt">Receipt for {trip.tracking_code}</div>
  ),
}));

function jsonResponse(body: unknown, ok = true, status = ok ? 200 : 400) {
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

/** Routes the mocked fetch by matching a substring of the request URL. */
function mockFetchRoutes(routes: Record<string, () => Response | Promise<Response>>) {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input.toString();
    for (const [pattern, handler] of Object.entries(routes)) {
      if (url.includes(pattern)) return handler();
    }
    return jsonResponse({}, true);
  });
}

beforeEach(() => {
  localStorage.setItem("token", "test-token");
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("StaffPanel - verify trip", () => {
  it("populates the bike details panel from a successful verify-trip response", async () => {
    const user = userEvent.setup();
    global.fetch = mockFetchRoutes({
      "/api/staff/verify-trip": () =>
        jsonResponse({
          message: "Trip started successfully.",
          trip: { id: 1, tracking_code: "TRK-ABC123", status: "active" },
          bike: { id: 5, bike_number: "123456", model: "Model X", brand: "GreenWheel", status: "in_use" },
          user: { id: 9, name: "Ada Lovelace" },
        }),
    });

    render(<StaffPanel />);

    await user.type(document.getElementById("reservation-code")!, "ABC123");
    await user.click(screen.getByRole("button", { name: /verify code/i }));

    expect(await screen.findByText("Bike Details")).toBeInTheDocument();
    expect(screen.getByText("Model X")).toBeInTheDocument();
    expect(screen.getByText(/Ada Lovelace/)).toBeInTheDocument();
    expect(screen.getByText("TRK-ABC123")).toBeInTheDocument();
  });

  it("shows the server's error message when the code is invalid, without a details panel", async () => {
    const user = userEvent.setup();
    global.fetch = mockFetchRoutes({
      "/api/staff/verify-trip": () =>
        jsonResponse({ message: "No valid trip or reservation found for this tracking code." }, false, 404),
    });

    render(<StaffPanel />);

    await user.type(document.getElementById("reservation-code")!, "BADCODE");
    await user.click(screen.getByRole("button", { name: /verify code/i }));

    expect(
      await screen.findByText("No valid trip or reservation found for this tracking code."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Bike Details")).not.toBeInTheDocument();
  });

  it("prefixes a bare code with TRK- before sending it", async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetchRoutes({
      "/api/staff/verify-trip": () => jsonResponse({ message: "not found" }, false, 404),
    });
    global.fetch = fetchMock;

    render(<StaffPanel />);
    await user.type(document.getElementById("reservation-code")!, "ABC123");
    await user.click(screen.getByRole("button", { name: /verify code/i }));

    await waitFor(() => {
      const verifyCall = fetchMock.mock.calls.find(([url]) =>
        String(url).includes("/api/staff/verify-trip"),
      );
      expect(verifyCall).toBeDefined();
      const body = JSON.parse((verifyCall![1] as RequestInit).body as string);
      expect(body.tracking_code).toBe("TRK-ABC123");
    });
  });
});

describe("StaffPanel - end trip and cash payment", () => {
  it("shows the cash-payment confirmation panel when the trip is payment_pending via cash", async () => {
    const user = userEvent.setup();
    global.fetch = mockFetchRoutes({
      "/api/staff/end-trip": () =>
        jsonResponse({ message: "Trip ended successfully.", trip: { id: 42 } }),
      "/api/check_payment_status/42": () => jsonResponse({ status: "payment_pending" }),
      "/api/staff/trip/42/cash-payment-summary": () =>
        jsonResponse({
          payment_id: 7,
          trip_id: 42,
          payment_method: "cash",
          status: "pending",
          amount: 55,
          summary: { tracking_code: "TRK-XYZ999", bike_number: "654321", price: 55, duration: 10 },
          user: { id: 9, name: "Ada Lovelace" },
        }),
    });

    render(<StaffPanel />);

    await user.type(document.getElementById("end-trip-code")!, "XYZ999");
    await user.click(screen.getByRole("button", { name: /end trip/i }));

    expect(await screen.findByText("Cash Payment Pending")).toBeInTheDocument();
    expect(screen.getByText(/Ada Lovelace owes ETB 55/)).toBeInTheDocument();
  });

  it("confirming the cash payment opens the receipt dialog", async () => {
    const user = userEvent.setup();
    global.fetch = mockFetchRoutes({
      "/api/staff/end-trip": () => jsonResponse({ message: "Trip ended successfully.", trip: { id: 42 } }),
      "/api/check_payment_status/42": () => jsonResponse({ status: "payment_pending" }),
      "/api/staff/trip/42/cash-payment-summary": () =>
        jsonResponse({
          trip_id: 42,
          payment_method: "cash",
          status: "pending",
          amount: 55,
          summary: { tracking_code: "TRK-XYZ999", bike_number: "654321", price: 55, duration: 10 },
          user: { id: 9, name: "Ada Lovelace" },
        }),
      "/api/staff/confirmCashPaymentByTripId/42": () =>
        jsonResponse({ message: "Cash payment confirmed successfully by trip ID" }),
    });

    render(<StaffPanel />);

    await user.type(document.getElementById("end-trip-code")!, "XYZ999");
    await user.click(screen.getByRole("button", { name: /end trip/i }));
    await screen.findByText("Cash Payment Pending");

    await user.click(screen.getByRole("button", { name: /confirm cash payment/i }));

    expect(await screen.findByTestId("trip-receipt")).toHaveTextContent("TRK-XYZ999");
    expect(screen.queryByText("Cash Payment Pending")).not.toBeInTheDocument();
  });

  it("opens the receipt directly when the trip is already completed (Chapa path), skipping the cash panel", async () => {
    const user = userEvent.setup();
    global.fetch = mockFetchRoutes({
      "/api/staff/end-trip": () => jsonResponse({ message: "Trip ended successfully.", trip: { id: 43 } }),
      "/api/check_payment_status/43": () =>
        jsonResponse({ status: "completed", summary: { price: 55, bike_number: "111111", start_staff_name: "Staff One" } }),
    });

    render(<StaffPanel />);

    await user.type(document.getElementById("end-trip-code")!, "CHAPA1");
    await user.click(screen.getByRole("button", { name: /end trip/i }));

    expect(await screen.findByTestId("trip-receipt")).toBeInTheDocument();
    expect(screen.queryByText("Cash Payment Pending")).not.toBeInTheDocument();
  });
});

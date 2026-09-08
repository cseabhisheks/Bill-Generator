import { useState } from "react";
import PrintHeader from "./components/PrintHeader";
import DimensionTable from "./components/DimensionTable";
import AddRowButton from "./components/AddRowButton";
import TotalArea from "./components/TotalArea";

import {
  calculateTotal,
  calculateTotalAmount,
  calculateCommonRateAmount,
} from "./utils/areaCalculator";
import Toggle from "./components/Toggle";

const EMPTY_ROW = {
  description: "",
  feet1: "",
  inch1: "",
  feet2: "",
  inch2: "",
  rate: "",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatCurrency = (value) => currencyFormatter.format(Number(value || 0));

export default function App() {
  const [rows, setRows] = useState([{ ...EMPTY_ROW }]);
  const [descriptionEnabled, setDescriptionEnabled] = useState(true);
  const [rateEnabled, setRateEnabled] = useState(false);
  const [siteAddress, setSiteAddress] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [commonRate, setCommonRate] = useState("");
  const [costRows, setCostRows] = useState([]);
  const [collectedAmount, setCollectedAmount] = useState("");

  const updateRow = (index, field, value) => {
    setRows((currentRows) => {
      const updatedRows = [...currentRows];

      updatedRows[index] = {
        ...updatedRows[index],
        [field]: value,
      };

      return updatedRows;
    });
  };

  const addRow = () => {
    setRows((currentRows) => [...currentRows, { ...EMPTY_ROW }]);
  };

  const removeRow = (index) => {
    setRows((currentRows) => {
      if (currentRows.length === 1) {
        return [{ ...EMPTY_ROW }];
      }

      return currentRows.filter((_, rowIndex) => rowIndex !== index);
    });
  };

  const addCost = () => {
    setCostRows((currentRows) => [
      ...currentRows,
      { name: "Other", amount: "0", detail: "" },
    ]);
  };

  const updateCost = (index, field, value) => {
    setCostRows((currentRows) => {
      const updatedRows = [...currentRows];
      updatedRows[index] = {
        ...updatedRows[index],
        [field]: value,
      };
      return updatedRows;
    });
  };

  const removeCost = (index) => {
    setCostRows((currentRows) => currentRows.filter((_, rowIndex) => rowIndex !== index));
  };

  const printableCostRows = costRows.filter(
    (cost) => (cost.name || "").trim().length > 0 || Number(cost.amount || 0) > 0,
  );

  const totalArea = calculateTotal(rows);
  const totalAmount = rateEnabled
    ? calculateTotalAmount(rows)
    : calculateCommonRateAmount(rows, commonRate);
  const additionalChargesTotal = costRows.reduce((sum, row) => {
    const numericAmount = Number.parseFloat(row.amount || 0);
    return sum + (Number.isFinite(numericAmount) ? numericAmount : 0);
  }, 0);

  const grandTotal = totalAmount + additionalChargesTotal;
  const collectedValue = Number.parseFloat(collectedAmount || 0);
  const collectedToUse = Number.isFinite(collectedValue) ? collectedValue : 0;
  const pendingAmount = Math.max(grandTotal - collectedToUse, 0);
  const excessAmount = Math.max(collectedToUse - grandTotal, 0);

  const paymentStatus =
    collectedToUse > grandTotal
      ? "Over Paid"
      : collectedToUse === grandTotal
        ? "Paid"
        : collectedToUse > 0
          ? "Partially Paid"
          : "Not Paid";

  return (
    <main className="min-h-screen bg-gray-100 p-2 sm:p-4">
      <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">

        <header className="no-print border-b border-gray-300 bg-gray-50 px-3 py-2">
          <h1 className="text-lg font-bold text-gray-800">Area Calculator</h1>
          <p className="text-xs text-gray-500">Enter feet and inches</p>
        </header>

        <div className="no-print flex flex-wrap items-center gap-5 border-b border-gray-300 bg-gray-50 px-3 py-2">
          <Toggle label="Description" enabled={descriptionEnabled} onChange={setDescriptionEnabled} />
          <Toggle label="Rate" enabled={rateEnabled} onChange={setRateEnabled} />
        </div>

        <section className="no-print border-b border-gray-300 bg-gray-50 px-3 py-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Site / Work Address
              </label>
              <input
                type="text"
                className="w-full rounded border border-gray-300 capitalize bg-white px-3 py-2 text-sm outline-none focus:border-gray-800"
                value={siteAddress}
                onChange={(event) => setSiteAddress(event.target.value)}
                placeholder="Enter site or customer address"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                PAN Number
              </label>
              <input
                type="text"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm uppercase outline-none focus:border-gray-800"
                value={panNumber}
                maxLength="10"
                onChange={(event) => setPanNumber(event.target.value.replace(/[^a-z0-9]/gi, "").toUpperCase())}
                placeholder="Enter PAN number"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Mobile Number
              </label>
              <input
                type="text"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-800"
                value={mobileNumber}
                maxLength="15"
                onChange={(event) => setMobileNumber(event.target.value.replace(/[^0-9+\-\s]/g, ""))}
                placeholder="Enter mobile number"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Description
              </label>
              <textarea
                rows="3"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-800"
                value={workDescription}
                onChange={(event) => setWorkDescription(event.target.value)}
                placeholder="Enter description for the work"
              />
            </div>
          </div>
        </section>

        <div className="print-content">
          <PrintHeader panNumber={panNumber} mobileNumber={mobileNumber} />

          {(siteAddress.trim() || workDescription.trim()) && (
            <section className="print-address-section">
              <h3 className="print-section-title">WORK / CUSTOMER ADDRESS</h3>
              <div className="print-section-line" />
              <div className="print-address-block">
                {siteAddress.trim() && (
                  <div className="print-address-row">
                    <span className="print-address-label">Site Address:</span>
                    <span className="print-address-value">{siteAddress}</span>
                  </div>
                )}

                {workDescription.trim() && (
                  <div className="print-address-row">
                    <span className="print-address-label">Description:</span>
                    <span className="print-address-value">{workDescription}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          <div className="print-table">
            <DimensionTable
              rows={rows}
              updateRow={updateRow}
              removeRow={removeRow}
              descriptionEnabled={descriptionEnabled}
              rateEnabled={rateEnabled}
            />

            <TotalArea total={totalArea} totalAmount={totalAmount} rateEnabled={rateEnabled} commonRate={commonRate} />
          </div>

          <section className="print-payment-summary">
            <h3 className="print-section-title">PAYMENT DETAILS</h3>
            <div className="print-section-line" />

            {printableCostRows.length > 0 && (
              <div className="print-payment-summary-block">
                <div className="print-payment-subtitle">ADDITIONAL CHARGES</div>

                <table className="print-summary-table print-charge-table">
                  <thead>
                    <tr>
                      <th>Charge</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printableCostRows.map((cost, index) => (
                      <tr key={`print-cost-${index}`}>
                        <td>
                          <span className="print-cost-name">{(cost.name || "Charge").trim()}</span>
                          {(cost.detail || "").trim() && (
                            <small className="print-cost-detail"> — {cost.detail}</small>
                          )}
                        </td>
                        <td className="print-summary-amount">{formatCurrency(cost.amount || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="print-summary-total">
                      <td>TOTAL ADDITIONAL CHARGES</td>
                      <td className="print-summary-amount">{formatCurrency(additionalChargesTotal)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            <div className="print-payment-summary-block print-payment-breakdown">
              <div className="print-payment-subtitle">PAYMENT SUMMARY</div>

              <table className="print-summary-table print-payment-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Total Work Amount</td>
                    <td className="print-summary-amount">{formatCurrency(totalAmount)}</td>
                  </tr>
                  <tr>
                    <td>Total Additional Amount</td>
                    <td className="print-summary-amount">{formatCurrency(additionalChargesTotal)}</td>
                  </tr>
                  <tr>
                    <td>Total Paid</td>
                    <td className="print-summary-amount">{formatCurrency(collectedToUse)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="print-payment-status-block">
                <div className="print-payment-status-row">
                  <span className="print-payment-status-label">Payment Status:</span>
                  <span className="print-payment-status-value">{paymentStatus}</span>
                </div>

                <div className="print-payment-status-row print-payment-amount-pending">
                  <span className="print-payment-status-label">AMOUNT PENDING</span>
                  <span className="print-payment-status-value">{formatCurrency(pendingAmount)}</span>
                </div>
              </div>

              {excessAmount > 0 && (
                <div className="print-payment-row print-payment-excess-row">
                  <span className="print-payment-label">Excess Amount :</span>
                  <span className="print-payment-value">{formatCurrency(excessAmount)}</span>
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="no-print border-t border-gray-300 bg-gray-50 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <AddRowButton onClick={addRow} />
            <button
              type="button"
              onClick={addCost}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              + Add Cost
            </button>
            <button
              onClick={() => window.print()}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              🖨 Print
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-end gap-3">
            {!rateEnabled && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Common Rate</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-36 rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-800"
                  value={commonRate}
                  onChange={(event) => setCommonRate(event.target.value)}
                  placeholder="₹ / sq.ft."
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Amount Already Collected / Paid</span>
              <input
                type="number"
                min="0"
                className="w-36 rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-800"
                value={collectedAmount}
                onChange={(event) => setCollectedAmount(event.target.value)}
              />
            </div>
          </div>

          {costRows.length > 0 && (
            <div className="mt-4 rounded border border-gray-300 bg-white p-3">
              <div className="mb-2 text-sm font-semibold text-gray-700">Additional Costs</div>
              <div className="space-y-2">
                {costRows.map((cost, index) => (
                  <div key={`cost-${index}`} className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      className="min-w-[160px] rounded border border-gray-300 px-2 py-1 text-sm"
                      placeholder="Cost Name"
                      value={cost.name}
                      onChange={(event) => updateCost(index, "name", event.target.value)}
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-32 rounded border border-gray-300 px-2 py-1 text-sm"
                      placeholder="Amount"
                      value={cost.amount}
                      onChange={(event) => updateCost(index, "amount", event.target.value)}
                    />
                    <input
                      type="text"
                      className="min-w-[180px] rounded border border-gray-300 px-2 py-1 text-sm"
                      placeholder="Detail (optional)"
                      value={cost.detail || ""}
                      onChange={(event) => updateCost(index, "detail", event.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeCost(index)}
                      className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <div className="no-print flex flex-col gap-2 border-t border-gray-300 bg-gray-50 p-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-gray-600">{formatCurrency(totalAmount)}</span>
          <TotalArea total={totalArea} totalAmount={totalAmount} rateEnabled={rateEnabled} commonRate={commonRate} />
        </div>

      </div>
    </main>
  );
}
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
  const [tables, setTables] = useState([{ rows: [{ ...EMPTY_ROW }], commonRate: "", title: "" }]);
  const [descriptionEnabled, setDescriptionEnabled] = useState(true);
  const [rateEnabled, setRateEnabled] = useState(false);
  const [letterheadEnabled, setLetterheadEnabled] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [siteAddress, setSiteAddress] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [dateMode, setDateMode] = useState("current");
  const [manualDate, setManualDate] = useState("");
  const [costRows, setCostRows] = useState([]);
  const [collectedAmount, setCollectedAmount] = useState("");
  const [collectedDescription, setCollectedDescription] = useState("");

  const offsetDate = new Date();
  const timezoneOffset = offsetDate.getTimezoneOffset();
  const localToday = new Date(offsetDate.getTime() - timezoneOffset * 60 * 1000);
  const currentDate = localToday.toISOString().slice(0, 10);

  const printableDate =
    dateMode === "manual"
      ? manualDate
      : dateMode === "current"
        ? currentDate
        : "";

  const updateRow = (tableIndex, rowIndex, field, value) => {
    setTables((currentTables) =>
      currentTables.map((table, currentTableIndex) => {
        if (currentTableIndex !== tableIndex) {
          return table;
        }

        return {
          ...table,
          rows: table.rows.map((row, currentRowIndex) =>
            currentRowIndex === rowIndex
              ? { ...row, [field]: value }
              : row,
          ),
        };
      }),
    );
  };

  const addTable = () => {
    setTables((currentTables) => [...currentTables, { rows: [{ ...EMPTY_ROW }], commonRate: "", title: "" }]);
  };

  const addRow = (tableIndex = 0) => {
    setTables((currentTables) =>
      currentTables.map((table, currentTableIndex) =>
        currentTableIndex === tableIndex
          ? { ...table, rows: [...table.rows, { ...EMPTY_ROW }] }
          : table,
      ),
    );
  };

  const removeRow = (tableIndex, rowIndex) => {
    setTables((currentTables) =>
      currentTables.map((table, currentTableIndex) => {
        if (currentTableIndex !== tableIndex) {
          return table;
        }

        const nextRows = table.rows.filter((_, index) => index !== rowIndex);
        return {
          ...table,
          rows: nextRows.length > 0 ? nextRows : [{ ...EMPTY_ROW }],
        };
      }),
    );
  };

  const addCost = () => {
    setCostRows((currentRows) => [
      ...currentRows,
      { name: "", amount: "", detail: "" },
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

  const updateCommonRate = (tableIndex, value) => {
    setTables((currentTables) =>
      currentTables.map((table, index) =>
        index === tableIndex ? { ...table, commonRate: value } : table,
      ),
    );
  };

  const updateTableTitle = (tableIndex, value) => {
    setTables((currentTables) =>
      currentTables.map((table, index) =>
        index === tableIndex ? { ...table, title: value } : table,
      ),
    );
  };

  const resetAll = () => {
    setTables([{ rows: [{ ...EMPTY_ROW }], commonRate: "", title: "" }]);
    setDescriptionEnabled(true);
    setRateEnabled(false);
    setLetterheadEnabled(true);
    setShowPreview(false);
    setSiteAddress("");
    setWorkDescription("");
    setPanNumber("");
    setMobileNumber("");
    setDateMode("current");
    setManualDate("");
    setCostRows([]);
    setCollectedAmount("");
    setCollectedDescription("");
  };

  const resetTableOnly = () => {
    setTables((currentTables) =>
      currentTables.map((table) => ({ ...table, rows: [{ ...EMPTY_ROW }], commonRate: table.commonRate || "" })),
    );
  };

  const allRows = tables.flatMap((table) => table.rows);
  const totalArea = calculateTotal(allRows);
  const totalAmount = rateEnabled
    ? calculateTotalAmount(allRows)
    : tables.reduce((sum, table) => sum + calculateCommonRateAmount(table.rows, table.commonRate), 0);
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
    <main className={`min-h-screen bg-gray-100 p-2 sm:p-4 ${showPreview ? "preview-mode" : ""}`}>
      <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">

        <header className="no-print border-b border-gray-300 bg-gray-50 px-3 py-2">
          <h1 className="text-lg font-bold text-gray-800">Area Calculator</h1>
          <p className="text-xs text-gray-500">Enter feet and inches</p>
        </header>

        <div className="no-print flex flex-wrap items-center gap-5 border-b border-gray-300 bg-gray-50 px-3 py-2">
          <Toggle label="Description" enabled={descriptionEnabled} onChange={setDescriptionEnabled} />
          <Toggle label="Rate" enabled={rateEnabled} onChange={setRateEnabled} />
          <Toggle label="Letterhead" enabled={letterheadEnabled} onChange={setLetterheadEnabled} />

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={resetAll}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              {showPreview ? "Hide Preview" : "Preview"}
            </button>
            <button
              onClick={() => window.print()}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              🖨 Print
            </button>
          </div>
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
                Date
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  className="rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-800"
                  value={dateMode}
                  onChange={(event) => setDateMode(event.target.value)}
                >
                  <option value="current">Current Date</option>
                  <option value="manual">Manual Date</option>
                  <option value="none">No Date</option>
                </select>

                {dateMode === "manual" && (
                  <input
                    type="date"
                    className="rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-800"
                    value={manualDate}
                    onChange={(event) => setManualDate(event.target.value)}
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
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

        {showPreview && (
          <section className="preview-home-bar">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="preview-home-button"
            >
              Home
            </button>
          </section>
        )}

        <div className="print-content">
          {letterheadEnabled && (
            <PrintHeader panNumber={panNumber} mobileNumber={mobileNumber} date={printableDate} />
          )}

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
            {tables.map((table, tableIndex) => (
              <div className="mb-3" key={`table-${tableIndex}`}>
                <DimensionTable
                  rows={table.rows}
                  updateRow={(rowIndex, field, value) => updateRow(tableIndex, rowIndex, field, value)}
                  removeRow={(rowIndex) => removeRow(tableIndex, rowIndex)}
                  descriptionEnabled={descriptionEnabled}
                  rateEnabled={rateEnabled}
                  commonRate={table.commonRate}
                  setCommonRate={(value) => updateCommonRate(tableIndex, value)}
                  showCommonRateInput={!rateEnabled}
                  tableTitle={table.title || ""}
                  setTableTitle={(value) => updateTableTitle(tableIndex, value)}
                  showPreview={showPreview}
                />
              </div>
            ))}

            <TotalArea total={totalArea} totalAmount={totalAmount} rateEnabled={rateEnabled} tables={tables} />
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
                    <td>
                      <span className="print-cost-name">Amount Already Collected</span>
                      {(collectedDescription || "").trim() && (
                        <small className="print-cost-detail"> — {collectedDescription.trim()}</small>
                      )}
                    </td>
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
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <AddRowButton onClick={() => addRow(tables.length - 1)} />
              <button
                type="button"
                onClick={addTable}
                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                + Add Table
              </button>
              <button
                type="button"
                onClick={resetTableOnly}
                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Reset Table
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-end gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Amount Already Collected / Paid</span>
              <input
                type="number"
                min="0"
                className="w-36 rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-800"
                value={collectedAmount}
                onChange={(event) => setCollectedAmount(event.target.value)}
                placeholder="₹ 0"
              />
              <input
                type="text"
                className="w-40 rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-800"
                value={collectedDescription}
                onChange={(event) => setCollectedDescription(event.target.value)}
                placeholder="Description"
              />
            </div>
          </div>

          <div className="mt-4 rounded border border-gray-300 bg-white p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-semibold text-gray-700">Additional Costs</div>
              <button
                type="button"
                onClick={addCost}
                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                + Add Cost
              </button>
            </div>

            {costRows.length > 0 && (
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
            )}
          </div>
        </section>

        <div className="no-print flex flex-wrap items-center gap-2 border-t border-gray-300 bg-gray-50 p-2">
          <span className="text-xs text-gray-600">{formatCurrency(pendingAmount)}</span>
        </div>

      </div>
    </main>
  );
}
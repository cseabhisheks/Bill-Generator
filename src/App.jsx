import { useState } from "react";
import PrintHeader from "./components/PrintHeader";
import DimensionTable from "./components/DimensionTable";
import TotalArea from "./components/TotalArea";

import {
  calculateTotal,
  calculateTotalAmount,
  calculateCommonRateAmount,
  createEmptyDimension,
} from "./utils/areaCalculator";
import Toggle from "./components/Toggle";

const EMPTY_ROW = {
  description: "",
  dimensions: [createEmptyDimension(), createEmptyDimension()],
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
  const [descriptionEnabled, setDescriptionEnabled] = useState(false);
  const [rateEnabled, setRateEnabled] = useState(false);
  const [letterheadEnabled, setLetterheadEnabled] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [siteAddress, setSiteAddress] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [dateMode, setDateMode] = useState("current");
  const [manualDate, setManualDate] = useState("");
  const [costRows, setCostRows] = useState([]);
  const [collectedRows, setCollectedRows] = useState([{ amount: "", description: "" }]);

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

  const updateDimension = (tableIndex, rowIndex, dimensionIndex, field, value) => {
    setTables((currentTables) =>
      currentTables.map((table, currentTableIndex) => {
        if (currentTableIndex !== tableIndex) {
          return table;
        }

        return {
          ...table,
          rows: table.rows.map((row, currentRowIndex) => {
            if (currentRowIndex !== rowIndex) {
              return row;
            }

            const dimensions = Array.isArray(row.dimensions) ? [...row.dimensions] : [createEmptyDimension()];
            if (!dimensions[dimensionIndex]) {
              dimensions[dimensionIndex] = createEmptyDimension();
            }

            dimensions[dimensionIndex] = {
              ...dimensions[dimensionIndex],
              [field]: value,
            };

            return {
              ...row,
              dimensions,
            };
          }),
        };
      }),
    );
  };

  const addDimension = (tableIndex, rowIndex = null) => {
    setTables((currentTables) =>
      currentTables.map((table, currentTableIndex) => {
        if (currentTableIndex !== tableIndex) {
          return table;
        }

        return {
          ...table,
          rows: table.rows.map((row) => {
            const dimensions = Array.isArray(row.dimensions)
              ? [...row.dimensions]
              : [createEmptyDimension(), createEmptyDimension()];

            return {
              ...row,
              dimensions: [...dimensions, createEmptyDimension()],
            };
          }),
        };
      }),
    );
  };

  const removeDimension = (tableIndex, rowIndex = null, dimensionIndex = null) => {
    setTables((currentTables) =>
      currentTables.map((table, currentTableIndex) => {
        if (currentTableIndex !== tableIndex) {
          return table;
        }

        return {
          ...table,
          rows: table.rows.map((row) => {
            const dimensions = Array.isArray(row.dimensions)
              ? [...row.dimensions]
              : [createEmptyDimension(), createEmptyDimension()];

            if (dimensions.length <= 2) {
              return row;
            }

            const nextDimensions = [...dimensions];
            const targetIndex =
              typeof dimensionIndex === "number" && dimensionIndex >= 0 && dimensionIndex < nextDimensions.length
                ? dimensionIndex
                : nextDimensions.length - 1;

            nextDimensions.splice(targetIndex, 1);

            return {
              ...row,
              dimensions: nextDimensions,
            };
          }),
        };
      }),
    );
  };

  const addTable = () => {
    setTables((currentTables) => [
      ...currentTables,
      {
        rows: [
          {
            ...EMPTY_ROW,
            dimensions: [createEmptyDimension(), createEmptyDimension()],
          },
        ],
        commonRate: "",
        title: "",
      },
    ]);
  };

  const addRow = (tableIndex = 0) => {
    setTables((currentTables) =>
      currentTables.map((table, currentTableIndex) => {
        if (currentTableIndex !== tableIndex) {
          return table;
        }

        const unitCount = Math.max(
          2,
          ...table.rows.map((row) => (Array.isArray(row.dimensions) ? row.dimensions.length : 2)),
        );

        return {
          ...table,
          rows: [
            ...table.rows,
            {
              ...EMPTY_ROW,
              dimensions: Array.from({ length: unitCount }, () => createEmptyDimension()),
            },
          ],
        };
      }),
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
          rows: nextRows.length > 0 ? nextRows : [{ ...EMPTY_ROW, dimensions: [createEmptyDimension(), createEmptyDimension()] }],
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

  const addCollectedAmount = () => {
    setCollectedRows((currentRows) => [
      ...currentRows,
      { amount: "", description: "" },
    ]);
  };

  const updateCollectedRow = (index, field, value) => {
    setCollectedRows((currentRows) => {
      const updatedRows = [...currentRows];
      updatedRows[index] = {
        ...updatedRows[index],
        [field]: value,
      };
      return updatedRows;
    });
  };

  const removeCollectedRow = (index) => {
    setCollectedRows((currentRows) => currentRows.filter((_, rowIndex) => rowIndex !== index));
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

  const printableCollectedRows = collectedRows.filter(
    (row) => (row.description || "").trim().length > 0 || Number(row.amount || 0) > 0,
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

  const handlePrint = () => {
    const serializedTables = JSON.stringify(tables);
    const printingTables = tables.map((table) => ({
      ...table,
      rows: table.rows.map((row) => {
        const dimensions = Array.isArray(row.dimensions)
          ? row.dimensions
          : [
              { ft: row.feet1 || "0", inch: row.inch1 || "0" },
              { ft: row.feet2 || "0", inch: row.inch2 || "0" },
            ];

        return {
          ...row,
          dimensions: dimensions.map((dimension) => ({
            ft: dimension.ft || "0",
            inch: dimension.inch || "0",
          })),
        };
      }),
    }));

    setTables(printingTables);
    setIsPrinting(true);

    const restoreAfterPrint = () => {
      setTables(JSON.parse(serializedTables));
      setIsPrinting(false);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("afterprint", restoreAfterPrint, { once: true });
    }

    window.print();
  };

  const resetAll = () => {
    setTables([{ rows: [{ ...EMPTY_ROW, dimensions: [createEmptyDimension(), createEmptyDimension()] }], commonRate: "", title: "" }]);
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
    setCollectedRows([{ amount: "", description: "" }]);
  };

  const resetTableOnly = (tableIndex = -1) => {
    setTables((currentTables) =>
      currentTables.map((table, index) =>
        index === tableIndex
          ? { ...table, rows: [{ ...EMPTY_ROW, dimensions: [createEmptyDimension(), createEmptyDimension()] }], commonRate: table.commonRate || "", title: table.title || "" }
          : table,
      ),
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
  const collectedToUse = collectedRows.reduce((sum, row) => {
    const numericAmount = Number.parseFloat(row.amount || 0);
    return sum + (Number.isFinite(numericAmount) ? numericAmount : 0);
  }, 0);
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
              onClick={handlePrint}
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
            <button
              type="button"
              onClick={handlePrint}
              className="preview-home-button"
            >
              Print
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

          <div className="no-print table-editor-heading">
            <span className="table-editor-heading-text">Table Work Area</span>
            <div className="table-editor-heading-actions">
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

          <div className="print-table">
            {tables.map((table, tableIndex) => (
              <div className="mb-3" key={`table-${tableIndex}`}>
                <DimensionTable
                  rows={table.rows}
                  updateRow={(rowIndex, field, value) => updateRow(tableIndex, rowIndex, field, value)}
                  updateDimension={(rowIndex, dimensionIndex, field, value) =>
                    updateDimension(tableIndex, rowIndex, dimensionIndex, field, value)
                  }
                  addDimension={(rowIndex) => addDimension(tableIndex, rowIndex)}
                  removeDimension={(rowIndex, dimensionIndex) => removeDimension(tableIndex, rowIndex, dimensionIndex)}
                  removeRow={(rowIndex) => removeRow(tableIndex, rowIndex)}
                  addRow={() => addRow(tableIndex)}
                  resetTable={() => resetTableOnly(tableIndex)}
                  descriptionEnabled={descriptionEnabled}
                  rateEnabled={rateEnabled}
                  commonRate={table.commonRate}
                  setCommonRate={(value) => updateCommonRate(tableIndex, value)}
                  showCommonRateInput={!rateEnabled}
                  tableTitle={table.title || ""}
                  setTableTitle={(value) => updateTableTitle(tableIndex, value)}
                  showPreview={showPreview}
                  isPrinting={isPrinting}
                />
              </div>
            ))}

            <TotalArea total={totalArea} totalAmount={totalAmount} rateEnabled={rateEnabled} tables={tables} />
          </div>

          {(printableCostRows.length > 0 || printableCollectedRows.length > 0) && (
            <section className="print-payment-details">
              <h3 className="print-section-title">PAYMENT DETAILS</h3>
              <div className="print-section-line" />

              <div className="print-payment-detail-panel">
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

                {printableCollectedRows.length > 0 && (
                  <div className="print-payment-summary-block">
                    <div className="print-payment-subtitle">AMOUNT ALREADY COLLECTED</div>

                    <table className="print-summary-table print-charge-table">
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {printableCollectedRows.map((row, index) => (
                          <tr key={`print-collected-${index}`}>
                            <td>
                              <span className="print-cost-name">{(row.description || "Collected Amount").trim()}</span>
                            </td>
                            <td className="print-summary-amount">{formatCurrency(row.amount || 0)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="print-summary-total">
                          <td>TOTAL AMOUNT ALREADY COLLECTED</td>
                          <td className="print-summary-amount">{formatCurrency(collectedToUse)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}

          {(printableCostRows.length > 0 || printableCollectedRows.length > 0 || totalAmount > 0 || additionalChargesTotal > 0 || collectedToUse > 0) && (
            <section className="print-payment-summary">
              <h3 className="print-section-title">PAYMENT SUMMARY</h3>
              <div className="print-section-line" />

              <div className="print-payment-summary-panel">
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
                        <td>Total Additional Charges</td>
                        <td className="print-summary-amount">{formatCurrency(additionalChargesTotal)}</td>
                      </tr>
                      <tr>
                        <td>Total Amount Already Collected</td>
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
              </div>
            </section>
          )}
        </div>

        <section className="no-print border-t border-gray-300 bg-gray-50 p-3">
          <div className="amount-collected-panel">
            <div className="amount-collected-block">
              <div className="amount-collected-title-row">
                <span className="text-sm font-medium text-gray-700">Amount Already Collected / Paid</span>
              </div>

              {collectedRows.length > 0 && (
                <div className="space-y-2">
                  {collectedRows.map((row, index) => (
                    <div key={`collected-${index}`} className="amount-collected-entry-row">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-32 rounded border border-gray-300 px-2 py-1 text-sm"
                        value={row.amount}
                        onChange={(event) => updateCollectedRow(index, "amount", event.target.value)}
                        placeholder="Amount"
                      />
                      <input
                        type="text"
                        className="min-w-[180px] rounded border border-gray-300 px-2 py-1 text-sm"
                        value={row.description}
                        onChange={(event) => updateCollectedRow(index, "description", event.target.value)}
                        placeholder="Detail"
                      />
                      <button
                        type="button"
                        onClick={() => removeCollectedRow(index)}
                        className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="payment-add-row-inline">
                <button
                  type="button"
                  onClick={addCollectedAmount}
                  className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>

          <div className="additional-cost-panel">
            <div className="additional-cost-block">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold text-gray-700">Additional Costs</div>
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

              <div className="payment-add-row-inline">
                <button
                  type="button"
                  onClick={addCost}
                  className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  + Add Cost
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="no-print flex flex-wrap items-center gap-2 border-t border-gray-300 bg-gray-50 p-2">
          <span className="text-xs text-gray-600">{formatCurrency(pendingAmount)}</span>
        </div>

      </div>
    </main>
  );
}
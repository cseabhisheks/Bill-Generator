import { Fragment } from "react";
import { calculateArea, calculateAmount, getDimensions, formatCurrency } from "../utils/areaCalculator";

export default function DimensionRow({
  row,
  index,
  pairCount,
  updateRow,
  updateDimension,
  removeRow,
  descriptionEnabled,
  rateEnabled,
  showPreview = false,
  isPrinting = false,
}) {
  const baseDimensions = getDimensions(row);
  const targetCount = Math.max(2, pairCount || 2, baseDimensions.length);
  const dimensions = [...baseDimensions];
  while (dimensions.length < targetCount) {
    dimensions.push({ ft: "", inch: "" });
  }

  const area = calculateArea(row);
  const amount = calculateAmount(row);
  const inputClass =
    "dimension-table-cell-input bg-transparent px-1 py-1 text-sm text-center outline-none focus:bg-blue-50";
  const showZeroFallback = showPreview || isPrinting;
  const displayValue = (field, dimension) =>
    showZeroFallback && !dimension[field] ? "0" : dimension[field];

  return (
    <tr className="hover:bg-gray-50">

      <td className="border border-gray-300 px-1 py-1 text-center text-xs text-gray-500">
        {index + 1}
      </td>

      {descriptionEnabled && (
        <td className="border border-gray-300 p-0 -nowrap">
          <input
            type="text"
            value={row.description}
            onChange={(e) => updateRow(index, "description", e.target.value)}
            placeholder=""
            className="dimension-table-description-input bg-transparent px-1 py-1 text-sm outline-none focus:bg-blue-50"
            style={{ width: "80px" }}
          />
        </td>
      )}

      {dimensions.map((dimension, dimensionIndex) => (
        <Fragment key={`dimension-${index}-${dimensionIndex}`}>
          <td className="border border-gray-300 p-0">
            <input
              type="number"
              min="0"
              value={displayValue("ft", dimension)}
              onChange={(e) => updateDimension(index, dimensionIndex, "ft", e.target.value)}
              placeholder="0"
              className={inputClass}
            />
          </td>

          <td className="border border-gray-300 p-0">
            <input
              type="number"
              min="0"
              max="11"
              value={displayValue("inch", dimension)}
              onChange={(e) => updateDimension(index, dimensionIndex, "inch", e.target.value)}
              placeholder="0"
              className={inputClass}
            />
          </td>
        </Fragment>
      ))}

      <td className="border border-gray-300 bg-gray-50 px-2 py-1 text-center">
        {area.toFixed(2)}
      </td>

      {rateEnabled && (
        <>
          <td className="border border-gray-300 p-0">
            <input
              type="number"
              min="0"
              value={row.rate}
              onChange={(e) =>
                updateRow(index, "rate", e.target.value)
              }
              placeholder="0"
              className={inputClass}
            />
          </td>

          <td className="border border-gray-300 bg-gray-50 px-2 py-1 text-center">
            {formatCurrency(amount)}
          </td>
        </>
      )}

      <td className="no-print w-8 border border-gray-300 p-0 text-center">
        <button
          type="button"
          onClick={() => removeRow(index)}
          className="h-7 w-7 text-gray-400 hover:bg-red-50 hover:text-red-500"
          title="Delete Row"
          aria-label="Delete Row"
        >
          ×
        </button>
      </td>

    </tr>
  );
}
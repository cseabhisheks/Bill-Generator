import { calculateArea, calculateAmount } from "../utils/areaCalculator";

export default function DimensionRow({
  row,
  index,
  updateRow,
  removeRow,
  descriptionEnabled,
  rateEnabled,
}) {
  const area = calculateArea(row);
  const amount = calculateAmount(row);
  const inputClass =
    "bg-transparent px-1 py-1 text-sm text-center outline-none focus:bg-blue-50";

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
            className="bg-transparent px-1 py-1 text-sm outline-none focus:bg-blue-50"
            style={{ width: "80px" }}
          />
        </td>
      )}

      <td className="border border-gray-300 p-0">
        <input
          type="number"
          min="0"
          value={row.feet1}
          onChange={(e) =>
            updateRow(index, "feet1", e.target.value)
          }
          className={inputClass}
        />
      </td>

      <td className="border border-gray-300 p-0">
        <input
          type="number"
          min="0"
          max="11"
          value={row.inch1}
          onChange={(e) =>
            updateRow(index, "inch1", e.target.value)
          }
          className={inputClass}
        />
      </td>

      <td className="border border-gray-300 p-0">
        <input
          type="number"
          min="0"
          value={row.feet2}
          onChange={(e) =>
            updateRow(index, "feet2", e.target.value)
          }
          className={inputClass}
        />
      </td>

      <td className="border border-gray-300 p-0">
        <input
          type="number"
          min="0"
          max="11"
          value={row.inch2}
          onChange={(e) =>
            updateRow(index, "inch2", e.target.value)
          }
          className={inputClass}
        />
      </td>

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
            ₹{amount.toFixed(2)}
          </td>
        </>
      )}

      <td className="no-print w-8 border border-gray-300 p-0 text-center">
        <button
          onClick={() => removeRow(index)}
          className="h-7 w-7 text-gray-400 hover:bg-red-50 hover:text-red-500"
        >
          ×
        </button>
      </td>

    </tr>
  );
}
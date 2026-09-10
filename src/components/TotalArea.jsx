import { formatCurrency } from "../utils/areaCalculator";

export default function TotalArea({
  totalAmount,
  rateEnabled,
  commonRate,
}) {
  const hasCommonRate = Number(commonRate || 0) > 0;

  return (
    <div className="flex items-center justify-end gap-6 border border-gray-300 bg-gray-50 px-3 py-2">
      {rateEnabled ? (
        <div className="text-sm font-medium text-gray-600">
          Total Work Amount
          <span className="ml-2 font-bold text-gray-900">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          {hasCommonRate && (
            <div className="text-sm font-medium text-gray-600">
              Rate
              <span className="ml-2 font-bold text-gray-900">
                {formatCurrency(commonRate)} / sq. ft.
              </span>
            </div>
          )}

          <div className="text-sm font-medium text-gray-600">
            Total Work Amount
            <span className="ml-2 font-bold text-gray-900">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
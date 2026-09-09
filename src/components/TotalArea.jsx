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
            ₹{totalAmount.toFixed(2)}
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          {hasCommonRate && (
            <div className="text-sm font-medium text-gray-600">
              Rate
              <span className="ml-2 font-bold text-gray-900">
                ₹{Number(commonRate).toFixed(2)} / sq. ft.
              </span>
            </div>
          )}

          <div className="text-sm font-medium text-gray-600">
            Total Work Amount
            <span className="ml-2 font-bold text-gray-900">
              ₹{totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
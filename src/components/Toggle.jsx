export default function Toggle({ label, enabled, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">
        {label}
      </span>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
          enabled ? "bg-gray-800" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>

      <span className="w-7 text-xs font-medium text-gray-500">
        {enabled ? "ON" : "OFF"}
      </span>
    </div>
  );
}
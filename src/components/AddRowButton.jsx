export default function AddRowButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
    >
      + Add Row
    </button>
  );
}
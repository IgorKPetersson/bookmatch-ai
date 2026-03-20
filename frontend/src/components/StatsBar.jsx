export default function StatsBar({ totalBooks, totalLists, currentLabel }) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-xl border border-gray-100 bg-white px-6 py-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 md:gap-6">
        <span>Total Books: {totalBooks}</span>
        <span>Reading Lists: {totalLists}</span>
        <span>
          Currently Reading:{" "}
          <span className="font-semibold text-gray-800">{currentLabel}</span>
        </span>
      </div>
      <span className="text-2xl" aria-hidden="true">
        📖
      </span>
    </div>
  );
}

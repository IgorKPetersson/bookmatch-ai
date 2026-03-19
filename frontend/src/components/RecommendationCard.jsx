export default function RecommendationCard({ recommendation, onAdd, onDismiss }) {
  return (
    <article className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm last:mb-0">
      <img
        src={recommendation.coverUrl}
        alt={`${recommendation.title} cover`}
        className="mb-3 h-40 w-full rounded-lg object-cover"
      />
      <p className="text-sm font-semibold text-gray-800">{recommendation.title}</p>
      <p className="mb-2 text-xs text-gray-500">{recommendation.author}</p>
      <p className="mb-3 text-xs text-gray-600">{recommendation.reason}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onAdd}
          className="flex-1 rounded-lg bg-blue-600 py-2 text-xs text-white hover:bg-blue-700"
        >
          Add to List
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="flex-1 rounded-lg bg-gray-100 py-2 text-xs text-gray-600 hover:bg-gray-200"
        >
          Dismiss
        </button>
      </div>
    </article>
  );
}

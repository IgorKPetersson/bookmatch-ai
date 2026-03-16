export default function PageContainer({ children }) {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {children}
      </div>
    </div>
  );
}
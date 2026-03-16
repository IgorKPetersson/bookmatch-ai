export default function Footer() {
  return (
    <footer className="border-t bg-white mt-16">
      <div className="max-w-7xl mx-auto px-8 py-6 text-sm text-gray-500 flex justify-between">

        <p>© 2026 BookMatch AI</p>

        <div className="flex gap-6">
          <a href="/about" className="hover:text-gray-700">About</a>
          <a href="/contact" className="hover:text-gray-700">Contact</a>
        </div>

      </div>
    </footer>
  );
}
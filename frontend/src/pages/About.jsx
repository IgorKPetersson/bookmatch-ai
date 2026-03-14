function About() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-10 rounded shadow-md max-w-3xl w-full">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold">About BookMatch</h2>
          <p className="text-gray-600 mt-2">
            AI-powered personalized book discovery
          </p>
        </div>

        <div className="space-y-4 text-gray-700">
          <p>
            BookMatch is an AI-powered platform designed to help readers
            discover books that truly match their personal taste.
          </p>

          <p>
            Instead of relying on generic bestseller lists or simple genre
            filters, the system analyzes books users already enjoy and
            generates personalized recommendations.
          </p>

          <p>
            In the future, the platform aims to expand into other media such as
            movies, music, travel, and cultural experiences.
          </p>
        </div>

        <div className="border-t border-gray-200 my-8"></div>

        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Project Team</h3>

          <div className="flex justify-center gap-10">
            <div>
              <p className="font-medium text-lg">Igor Petersson</p>
              <p className="text-sm text-gray-500">Fullstack Developer</p>
            </div>

            <div>
              <p className="font-medium text-lg">Oliver Cupan</p>
              <p className="text-sm text-gray-500">Fullstack Developer</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default About;
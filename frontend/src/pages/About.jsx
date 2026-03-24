function About() {
  return (
    <div style={{ backgroundColor: "#f7f3ee", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div
          className="max-w-3xl w-full mx-auto p-10"
          style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
          }}
        >
          <div className="text-center mb-8">
            <h2
              className="text-3xl font-semibold"
              style={{ color: "#1a1a1a" }}
            >
              About BookMatch
            </h2>
            <p className="mt-2" style={{ color: "#8d7f70" }}>
              AI-powered personalized book discovery
            </p>
          </div>

          <div className="space-y-4" style={{ color: "#5f574f" }}>
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

          <div
            className="my-8"
            style={{ borderTop: "1px solid #f0ece6" }}
          ></div>

          <div className="text-center">
            <h3
              className="text-xl font-semibold mb-4"
              style={{ color: "#1a1a1a" }}
            >
              Project Team
            </h3>

            <div className="flex justify-center gap-10">
              <div>
                <p className="font-medium text-lg" style={{ color: "#1a1a1a" }}>
                  Igor Petersson
                </p>
                <p className="text-sm" style={{ color: "#8d7f70" }}>
                  Fullstack Developer
                </p>
              </div>

              <div>
                <p className="font-medium text-lg" style={{ color: "#1a1a1a" }}>
                  Oliver Cupan
                </p>
                <p className="text-sm" style={{ color: "#8d7f70" }}>
                  Fullstack Developer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;

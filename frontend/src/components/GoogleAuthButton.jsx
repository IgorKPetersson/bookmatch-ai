import { useState } from "react";

const apiBaseUrl = "http://localhost:8000";

export default function GoogleAuthButton({
  label = "Continue with Google",
}) {
  const [redirecting, setRedirecting] = useState(false);

  function handleClick() {
    if (redirecting) {
      return;
    }

    setRedirecting(true);
    window.location.href = `${apiBaseUrl}/auth/google/start`;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={redirecting}
      className="w-full rounded-md font-semibold"
      style={{
        alignItems: "center",
        backgroundColor: "white",
        border: "1px solid #e0dbd3",
        color: "#1a1a1a",
        cursor: redirecting ? "not-allowed" : "pointer",
        display: "flex",
        gap: "12px",
        justifyContent: "center",
        opacity: redirecting ? 0.75 : 1,
        padding: "12px 16px",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (redirecting) return;
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <span
        aria-hidden="true"
        style={{
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: "999px",
          display: "inline-flex",
          flexShrink: 0,
          height: "20px",
          justifyContent: "center",
          width: "20px",
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path
            d="M21.35 11.1H12v2.98h5.36c-.23 1.51-1.09 2.79-2.32 3.65v2.99h3.75c2.2-2.03 3.46-5.03 3.46-8.6 0-.73-.06-1.41-.2-2.02Z"
            fill="#4285F4"
          />
          <path
            d="M12 21.8c2.7 0 4.97-.9 6.63-2.44l-3.75-2.99c-1.04.7-2.36 1.12-4.14 1.12-3.18 0-5.88-2.15-6.84-5.03H.03v3.08A9.997 9.997 0 0 0 12 21.8Z"
            fill="#34A853"
          />
          <path
            d="M5.16 12.46A5.99 5.99 0 0 1 4.82 10c0-.86.15-1.69.41-2.46V4.46H.03A9.997 9.997 0 0 0 0 10c0 1.61.38 3.14 1.03 4.54l4.13-2.08Z"
            fill="#FBBC05"
          />
          <path
            d="M12 3.98c1.47 0 2.79.5 3.82 1.48l2.87-2.87C16.96.98 14.69 0 12 0A9.997 9.997 0 0 0 .03 4.46l4.2 3.08C5.18 5.66 8.82 3.98 12 3.98Z"
            fill="#EA4335"
          />
        </svg>
      </span>
      {redirecting ? "Redirecting to Google..." : label}
    </button>
  );
}

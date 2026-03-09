import { useEffect, useState } from "react"

export default function Home() {
  const [status, setStatus] = useState("Loading...")

  useEffect(() => {
    fetch("http://localhost:8000/health")
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus("Backend not reachable"))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold">Home</h1>
      <p className="mt-4">
        Backend status: <span className="text-emerald-400">{status}</span>
      </p>
    </div>
  )
}
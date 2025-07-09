export default function StatusBadge({ status, size = "normal" }) {
  const statusColors = {
    Online: "bg-green-100 text-green-800",
    Degraded: "bg-yellow-100 text-yellow-800",
    Offline: "bg-red-100 text-red-800",
  }

  const sizeClasses = {
    normal: "px-2 py-1 text-xs",
    lg: "px-3 py-2 text-sm",
  }

  return (
    <span
      className={`rounded-full font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"} ${sizeClasses[size]}`}
    >
      {status}
    </span>
  )
}
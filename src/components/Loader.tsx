export default function Loader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="w-full flex items-center justify-center p-6">
      <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-transparent rounded-full mr-2" />
      <span className="text-gray-700">{label}</span>
    </div>
  )
}

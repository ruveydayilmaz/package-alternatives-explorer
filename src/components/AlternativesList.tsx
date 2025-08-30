import { formatNumber } from "../utils/formatters";

interface AltItem {
  name: string;
  description?: string;
  github?: {
    starsCount?: number
    watchers?: number
    issues?: { count: number }
    lastCommit?: string
    repo?: string
  }
  npm?: {
    downloads?: { from: Date, to: Date, count: number }[]
  }
  deprecated?: boolean;
  score?: number;
}

export default function AlternativesList({
  alternatives,
  onSelect,
  selected,
}: {
  alternatives: AltItem[];
  onSelect: (x: any) => void;
  selected?: string;
}) {
  if (!alternatives?.length) return <p>No alternatives found.</p>;
  if (!selected) selected = alternatives[0].name;

  const downloads30d = (pkg: AltItem) => pkg.npm?.downloads?.find(
    d => (new Date(d.to).getTime() - new Date(d.from).getTime()) / (1000 * 60 * 60 * 24) === 7
  )?.count ?? 0;

  return (
    <div className="space-y-2">
      {alternatives.map((pkg) => (
        <button
          key={pkg.name}
          onClick={() => onSelect(pkg)}
          className={`w-full text-left p-3 rounded border ${selected === pkg.name
            ? "bg-yellow-100 hover:bg-yellow-50 border-yellow-100"
            : "bg-white hover:bg-gray-50 border-gray-100"
            }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
            <div>
              <div className="font-semibold">{pkg.name}</div>
              <div className="text-sm text-gray-600 line-clamp-2">
                {pkg.description}
              </div>
            </div>
            <div className="flex flex-row lg:flex-col items-end gap-2 text-sm text-gray-700 text-right shrink-0">
              <span>⭐ {formatNumber(pkg.github?.starsCount ?? 0)}</span>
              <span>📦 {formatNumber(downloads30d(pkg))}/30d</span>
              {pkg.deprecated && (
                <span className="text-red-600 font-medium">Deprecated</span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

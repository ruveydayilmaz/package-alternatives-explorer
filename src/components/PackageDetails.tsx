import type { PackageData } from "../utils/types";
import { formatDate, formatNumber, hostOf } from "../utils/formatters";
import Link from "./Link";
import MDViewer from "./MDViewer";

export default function PackageDetails({ data }: { data: PackageData }) {
  if (!data) return null;

  const repoUrl =
    data.repository?.url?.replace(/^git\+/, "").replace(/\.git$/, "") ||
    undefined;

  const downloads7d =
    data.npm?.downloads?.find(
      (d) =>
        (new Date(d.to).getTime() - new Date(d.from).getTime()) /
        (1000 * 60 * 60 * 24) ===
        1
    )?.count ?? 0;

  const downloads30d =
    data.npm?.downloads?.find(
      (d) =>
        (new Date(d.to).getTime() - new Date(d.from).getTime()) /
        (1000 * 60 * 60 * 24) ===
        7
    )?.count ?? 0;

  return (
    <div className="space-y-3">
      <div>
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-bold break-all">{data.name}</h3>

          <div className="flex items-center gap-2">
            {data.version && (
              <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 border border-yellow-200">
                v{data.version}
              </span>
            )}
            {data.license && (
              <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 border border-yellow-200">
                {data.license}
              </span>
            )}
          </div>
        </div>

        {data.description && (
          <p className="text-gray-700 mt-2">{data.description}</p>
        )}
        {data.deprecated && (
          <p className="text-red-700 bg-red-50 border border-red-200 rounded p-2 mt-2">
            This package is deprecated.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 text-sm">
        <Stat
          label="⭐ GitHub Stars"
          value={formatNumber(data.github?.starsCount ?? 0)}
        />
        <Stat
          label="🐞 Open Issues"
          value={formatNumber(data.github?.issues?.count ?? 0)}
        />
        <Stat label="📦 Downloads 7d" value={formatNumber(downloads7d)} />
        <Stat label="📦 Downloads 30d" value={formatNumber(downloads30d)} />
        <Stat label="🗓️ Published" value={formatDate(data.createdAt)} />
        <Stat label="🛠️ Last Update" value={formatDate(data.modifiedAt)} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 text-sm">
        {data.homepage && (
          <Link
            href={data.homepage}
            title={`Homepage (${hostOf(data.homepage)})`}
          />
        )}
        {repoUrl && <Link href={repoUrl} title="GitHub" />}
      </div>

      {data.docs && data.docs?.length > 0 ? (
        <Section title="Popular Docs / Guides">
          <ul className="list-disc pl-5 space-y-1">
            {data.docs.slice(0, 5).map((d) => (
              <li key={d.url}>
                <a
                  className="underline"
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {d.title}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {data.youtube?.length ? (
        <Section title="YouTube Tutorials">
          <ul className="list-disc pl-5 space-y-1">
            {data.youtube.slice(0, 5).map((d) => (
              <li key={d.url}>
                <a
                  className="underline"
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {d.title}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {data.readme ? (
        <Section title="README">
          <MDViewer readme={data.readme} />
        </Section>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value?: string }) {
  return (
    <div className="p-2 rounded bg-gray-50 border border-gray-100">
      <div className="text-gray-500">{label}</div>
      <div className="font-semibold">{value ?? "—"}</div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-2">
      <h4 className="font-semibold mb-1">{title}</h4>
      {children}
    </div>
  );
}

import { safe } from "./helper";
import type { EnrichedPackage, DocsResult } from "./types";

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const YT_KEY = import.meta.env.VITE_YOUTUBE_KEY;

const headers: HeadersInit = {};
if (GITHUB_TOKEN) headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, init);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} for ${url}`);
  return r.json();
}

function repoFromNpmRepoField(repo?: string) {
  if (!repo) return undefined;
  const cleaned = repo.replace(/^git\+/, "").replace(/\.git$/, "");
  try {
    const u = new URL(cleaned);
    if (u.hostname.includes("github.com")) {
      return u.pathname.replace(/^\//, "").split("/").slice(0, 2).join("/");
    }
  } catch { }
  return undefined;
}

async function fetchReadmeDocs(repo?: string): Promise<DocsResult> {
  if (!repo) return { links: [], readme: "" };
  const url = `https://api.github.com/repos/${repo}/readme`;
  const data = await json<any>(url, { headers }).catch(() => null);
  if (!data?.download_url) return { links: [], readme: "" };

  const readme = await fetch(data.download_url)
    .then((r) => r.text())
    .catch(() => "");
  const links = Array.from(
    readme.matchAll(/\[([^\]]+)\]\((https?:[^\)\s]+)\)/g)
  )
    .map((link) => ({ title: link[1], url: link[2] }))
    .filter((link) => !link.url.includes(".svg") && !link.url.includes(".png"));

  return {
    links: links.slice(0, 8),
    readme,
  };
}

async function fetchYouTube(q: string) {
  if (!YT_KEY) return [];
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${encodeURIComponent(
    q
  )}&key=${YT_KEY}`;
  const data = await json<any>(url).catch(() => ({ items: [] }));
  return (data.items || [])
    .map((item: any) => ({
      title: item.snippet?.title,
      url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
    }))
    .filter((x: any) => x.url.endsWith("undefined") === false);
}

async function enrichPackage(basic: any): Promise<EnrichedPackage> {
  const name =
    basic.collected?.metadata?.name || basic.package?.name || basic.name;
  const description =
    basic.collected?.metadata?.description || basic.package?.description;
  const version = basic.collected?.metadata?.version || basic.package?.version;
  const homepage =
    basic.collected?.metadata?.links?.homepage ||
    basic.package?.links?.homepage;
  const license = basic.collected?.metadata?.license || basic.package?.license;
  const deprecated = !!(
    basic.collected?.metadata?.deprecated || basic.package?.deprecated
  );
  const createdAt = basic.collected?.metadata?.date || basic.package?.date;
  const modifiedAt = basic.evaluation?.quality?.maintenance?.commitsLast30Days
    ? undefined
    : basic.collected?.metadata?.date;
  const repoField =
    basic.collected?.metadata?.repository?.url ||
    basic.package?.links?.repository ||
    basic.collected?.metadata?.links?.repository;
  const repo = repoFromNpmRepoField(repoField);

  let docs: DocsResult = { links: [], readme: "" };
  let yt: any[] = [];

  if (!deprecated) {
    [docs, yt] = await Promise.all([
      safe(fetchReadmeDocs(repo), { links: [], readme: "" }),
      safe(fetchYouTube(name + " tutorial"), []),
    ]);
  }

  return {
    name,
    version,
    description,
    homepage,
    repository: { url: repo ? `https://github.com/${repo}` : undefined },
    license,
    deprecated,
    createdAt,
    modifiedAt,
    keywords: basic.collected?.metadata?.keywords || basic.package?.keywords,
    github: basic.collected?.github,
    npm: basic.collected?.npm,
    docs: docs.links,
    readme: docs.readme,
    youtube: yt,
    score: basic.score?.final || basic.searchScore || 0,
  };
}

export async function fetchPackageInfo(
  query: string
): Promise<EnrichedPackage> {
  const isName = /^[a-z0-9@/_\.-]+$/i.test(query);

  if (isName) {
    const res = await fetch(
      `https://api.npms.io/v2/package/${encodeURIComponent(query)}`
    );
    if (res.ok) {
      const data = await res.json();
      return enrichPackage(data);
    }
  }

  const search = await json<any>(
    `https://api.npms.io/v2/search?q=${encodeURIComponent(query)}&size=1`
  );
  if (!search?.results?.length)
    throw new Error("No package found for query: " + query);
  const best = search.results[0].package.name;
  const data = await json<any>(
    `https://api.npms.io/v2/package/${encodeURIComponent(best)}`
  );
  return enrichPackage(data);
}

export async function fetchAlternatives(
  query: string
): Promise<EnrichedPackage[]> {
  const search = await json<any>(
    `https://api.npms.io/v2/search?q=${encodeURIComponent(
      query
    )}+replacement&size=12`
  );
  const items =
    search.results?.map((r: any) => ({
      ...r,
      name: r.package?.name,
    })) || [];

  const enriched: EnrichedPackage[] = [];
  for (const it of items) {
    try {
      const pkgData = await json<any>(
        `https://api.npms.io/v2/package/${encodeURIComponent(it.name)}`
      );
      const e = await enrichPackage(pkgData);
      enriched.push(e);
      await sleep(120);
    } catch { }
  }

  return enriched
    .filter((item) => !!item.name)
    .sort(
      (a, b) =>
        (b.npm?.downloads?.[0].count || 0) - (a.npm?.downloads?.[0].count || 0)
    )
    .slice(0, 10);
}

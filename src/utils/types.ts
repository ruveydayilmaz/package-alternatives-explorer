export interface EnrichedPackage {
  name: string
  version?: string
  description?: string
  homepage?: string
  repository?: { url?: string }
  license?: string
  deprecated?: boolean
  createdAt?: string
  modifiedAt?: string
  keywords?: string[]
  github?: {
    repo?: string
    starsCount?: number
    issues?: { count: number }
    lastCommit?: string
  }
  npm?: {
    downloads?: { from: Date, to: Date, count: number }[]
  }
  docs?: { title: string; url: string }[]
  readme?: string;
  stackoverflow?: { title: string; url: string }[]
  youtube?: { title: string; url: string }[]
  score?: number
}

export interface PackageData {
  name: string;
  version?: string;
  description?: string;
  homepage?: string;
  repository?: { url?: string };
  license?: string;
  deprecated?: boolean;
  createdAt?: string;
  modifiedAt?: string;
  github?: {
    starsCount?: number;
    watchers?: number;
    issues?: { count: number };
    lastCommit?: string;
    repo?: string;
  };
  npm?: {
    downloads?: { from: Date; to: Date; count: number }[];
  };
  docs?: { title: string; url: string }[];
  readme?: string;
  stackoverflow?: { title: string; url: string }[];
  youtube?: { title: string; url: string }[];
}

export type DocsResult = {
  links: { title: string; url: string }[];
  readme: string;
}

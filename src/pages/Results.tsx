import { useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchPackageInfo, fetchAlternatives } from "../utils/api";
import {
  AlternativesList,
  Loader,
  PackageDetails,
  SearchBar,
} from "../components";

export default function Results() {
  const [params] = useSearchParams();
  const query = params.get("q")?.trim() || "";
  const [selectedAlt, setSelectedAlt] = useState<any | null>(null);

  const mainQuery = useQuery({
    queryKey: ["pkg", query],
    queryFn: () => fetchPackageInfo(query),
    enabled: !!query,
  });

  const altsQuery = useQuery({
    queryKey: ["alts", query],
    queryFn: () => fetchAlternatives(query),
    enabled: !!query,
  });

  const selected = useMemo(() => {
    if (selectedAlt) return selectedAlt;
    return altsQuery.data?.[0] ?? null;
  }, [selectedAlt, altsQuery.data]);

  // TODO: scroll to selected alternative for smaller screens

  return (
    <div className="md:fixed md:h-screen p-6 md:p-12 space-y-4 w-full">
      <div className="flex justify-center items-center gap-3">
        <SearchBar initialValue={query} />
      </div>

      {(mainQuery.isLoading || altsQuery.isLoading) && (
        <Loader label="Fetching packages..." />
      )}

      {(mainQuery.error || altsQuery.error) && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {(mainQuery.error as Error)?.message ||
            (altsQuery.error as Error)?.message}
        </div>
      )}

      {mainQuery.data && altsQuery.data && (
        <div className="grid md:grid-cols-3 gap-4 mt-4 h-full w-full">
          <div className="xl:max-h-[75vh] bg-white rounded-lg p-4 overflow-y-auto">
            <h2 className="mb-3 text-gray-500">Searched Package</h2>
            <PackageDetails data={mainQuery.data} />
          </div>

          <div className="xl:max-h-[75vh] bg-white rounded-lg p-4 overflow-y-auto">
            <h2 className="mb-3 text-gray-500">Alternatives</h2>
            <AlternativesList
              alternatives={altsQuery.data}
              onSelect={setSelectedAlt}
              selected={selectedAlt?.name}
            />
          </div>

          <div className="xl:max-h-[75vh] bg-white rounded-lg p-4 overflow-y-auto">
            <h2 className="mb-3 text-gray-500">
              Selected Alternative
            </h2>
            {selected ? (
              <PackageDetails data={selected} />
            ) : (
              <p>No alternative selected.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

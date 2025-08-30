import { SearchBar } from "../components";

export default function Home() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="max-w-3xl w-full space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center">
          Package Alternatives Explorer
        </h1>
        <p className="text-center text-gray-600">
          Search by package name or what you need (e.g. "query builder", "date
          library").
        </p>
        <div className="flex justify-center">
          <SearchBar autoFocus />
        </div>
      </div>
    </div>
  );
}

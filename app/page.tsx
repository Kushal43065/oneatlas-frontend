
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Model = {
  id: string;
  name: string;
  provider: string;
  category: string;
  description: string;
  score: number;
  context: string;
  inputPrice: number;
  outputPrice: number;
  releaseDate: string;
  modalities: string[];
  capabilities: string[];
  benchmarks: {
    reasoning: number;
    coding: number;
    knowledge: number;
  };
  availableProviders: string[];
};

export default function Home() {
  const [models, setModels] = useState<Model[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchModels = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/models");

      if (!response.ok) {
        throw new Error("Failed to load models.");
      }

      const data = await response.json();
      setModels(data.models);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const categories = [
    "All",
    ...Array.from(new Set(models.map((model) => model.category))),
  ];

  const filteredModels = models.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(search.toLowerCase()) ||
      model.provider.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || model.category === category;

    return matchesSearch && matchesCategory;
  });

  function toggleCompare(id: string) {
    setSelected((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, id];
    });
  }

  const comparedModels = models.filter((model) =>
    selected.includes(model.id)
  );

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-12 flex flex-wrap items-center justify-between gap-5">
          <Link href="/" className="text-2xl font-bold text-blue-400">
            OneAtlas.dev
          </Link>

          <div className="flex flex-wrap gap-6 text-sm text-slate-300">
            <Link href="/" className="hover:text-blue-400">Models</Link>
            <Link href="/rankings" className="hover:text-blue-400">Rankings</Link>
            <Link href="/providers" className="hover:text-blue-400">Providers</Link>
            <a href="#comparison" className="hover:text-blue-400">Compare</a>
          </div>
        </nav>

        <section className="mb-12">
          <p className="mb-3 font-semibold text-blue-400">
            AI MODEL DISCOVERY PLATFORM
          </p>

          <h1 className="text-4xl font-bold sm:text-5xl">
            Discover and Compare AI Models
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Explore AI models, compare their capabilities, pricing,
            context windows, and benchmark scores.
          </p>
        </section>

        <section className="mb-8 flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            placeholder="Search models or providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 outline-none focus:border-blue-500"
          />

          <button
            onClick={fetchModels}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh Models"}
          </button>
        </section>

        <section className="mb-8 flex flex-wrap gap-3">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-5 py-2 text-sm ${
                category === item
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {item}
            </button>
          ))}
        </section>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-300">
            {error}
            <button
              onClick={fetchModels}
              className="ml-3 underline"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <p className="py-12 text-center text-slate-400">
            Loading AI models...
          </p>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredModels.map((model) => (
              <article
                key={model.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-blue-400">
                      {model.provider}
                    </p>
                    <h2 className="mt-2 text-xl font-bold">
                      {model.name}
                    </h2>
                  </div>

                  <span className="rounded-lg bg-green-500/15 px-3 py-2 text-green-400">
                    {model.score}
                  </span>
                </div>

                <p className="mt-4 min-h-12 text-sm text-slate-400">
                  {model.description}
                </p>

                <div className="mt-5 space-y-2 text-sm text-slate-300">
                  <p>Category: {model.category}</p>
                  <p>Context: {model.context}</p>
                  <p>Input: ${model.inputPrice} / 1M tokens</p>
                  <p>Output: ${model.outputPrice} / 1M tokens</p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/models/${model.id}`}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() => toggleCompare(model.id)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                      selected.includes(model.id)
                        ? "bg-green-600"
                        : "bg-slate-700 hover:bg-slate-600"
                    }`}
                  >
                    {selected.includes(model.id)
                      ? "Selected"
                      : "Compare"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}

        {!loading && filteredModels.length === 0 && !error && (
          <p className="py-12 text-center text-slate-400">
            No models found. Try another search.
          </p>
        )}

        <section
          id="comparison"
          className="mt-16 scroll-mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Compare AI Models</h2>
              <p className="mt-2 text-sm text-slate-400">
                Select up to three models to compare their specifications.
              </p>
            </div>

            <button
              onClick={() => setSelected([])}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
            >
              Clear Selection
            </button>
          </div>

          <p className="mb-5 text-sm text-slate-400">
            {selected.length} of 3 models selected
          </p>

          {comparedModels.length === 0 ? (
            <p className="rounded-xl bg-slate-800 p-6 text-center text-slate-400">
              Select models above to start comparing.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="p-4 text-slate-400">Specification</th>
                    {comparedModels.map((model) => (
                      <th key={model.id} className="p-4 text-blue-400">
                        {model.name}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {[
                    {
                      label: "Provider",
                      value: (m: Model) => m.provider,
                    },
                    {
                      label: "Category",
                      value: (m: Model) => m.category,
                    },
                    {
                      label: "Overall Score",
                      value: (m: Model) => `${m.score}/100`,
                    },
                    {
                      label: "Context Window",
                      value: (m: Model) => m.context,
                    },
                    {
                      label: "Input Price",
                      value: (m: Model) => `$${m.inputPrice} / 1M tokens`,
                    },
                    {
                      label: "Output Price",
                      value: (m: Model) => `$${m.outputPrice} / 1M tokens`,
                    },
                    {
                      label: "Release Date",
                      value: (m: Model) => m.releaseDate,
                    },
                    {
                      label: "Modalities",
                      value: (m: Model) => m.modalities.join(", "),
                    },
                    {
                      label: "Capabilities",
                      value: (m: Model) => m.capabilities.join(", "),
                    },
                    {
                      label: "Reasoning Benchmark",
                      value: (m: Model) => `${m.benchmarks.reasoning}/100`,
                    },
                    {
                      label: "Coding Benchmark",
                      value: (m: Model) => `${m.benchmarks.coding}/100`,
                    },
                    {
                      label: "Knowledge Benchmark",
                      value: (m: Model) => `${m.benchmarks.knowledge}/100`,
                    },
                    {
                      label: "Available Providers",
                      value: (m: Model) => m.availableProviders.join(", "),
                    },
                  ].map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-slate-800"
                    >
                      <td className="p-4 font-semibold text-slate-300">
                        {row.label}
                      </td>

                      {comparedModels.map((model) => (
                        <td
                          key={model.id}
                          className="p-4 text-slate-400"
                        >
                          {row.value(model)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-5 text-xs text-slate-500">
            Pricing and benchmark values are illustrative demonstration data,
            not verified current provider prices or benchmark results.
          </p>
        </section>

        <footer className="mt-16 border-t border-slate-800 py-8 text-center text-sm text-slate-500">
          OneAtlas.dev — AI Model Discovery & Intelligence Platform
        </footer>
      </div>
    </main>
  );
}

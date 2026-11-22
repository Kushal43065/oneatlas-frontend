
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Model = {
  id: string;
  name: string;
  provider: string;
  category: string;
  score: number;
  benchmarks: {
    reasoning: number;
    coding: number;
    knowledge: number;
  };
};

type Benchmark = "reasoning" | "coding" | "knowledge";

export default function RankingsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [category, setCategory] = useState("All");
  const [benchmark, setBenchmark] = useState<Benchmark>("reasoning");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRankings() {
      try {
        const response = await fetch("/api/models");

        if (!response.ok) {
          throw new Error("Unable to load rankings.");
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
    }

    loadRankings();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(models.map((model) => model.category))),
  ];

  const rankedModels = models
    .filter(
      (model) => category === "All" || model.category === category
    )
    .sort(
      (a, b) => b.benchmarks[benchmark] - a.benchmarks[benchmark]
    );

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-12 flex flex-wrap items-center justify-between gap-5">
          <Link href="/" className="text-2xl font-bold text-blue-400">
            OneAtlas.dev
          </Link>

          <div className="flex flex-wrap gap-6 text-sm text-slate-300">
            <Link href="/" className="hover:text-blue-400">Models</Link>
            <Link href="/rankings" className="text-blue-400">Rankings</Link>
            <Link href="/providers" className="hover:text-blue-400">Providers</Link>
          </div>
        </nav>

        <section className="mb-10">
          <p className="mb-3 font-semibold text-blue-400">
            MODEL PERFORMANCE
          </p>

          <h1 className="text-4xl font-bold">
            AI Model Rankings
          </h1>

          <p className="mt-4 text-slate-400">
            Explore and compare model performance across different
            benchmark categories.
          </p>
        </section>

        <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Select Benchmark
          </h2>

          <div className="flex flex-wrap gap-3">
            {(
              ["reasoning", "coding", "knowledge"] as Benchmark[]
            ).map((item) => (
              <button
                key={item}
                onClick={() => setBenchmark(item)}
                className={`rounded-lg px-5 py-3 capitalize ${
                  benchmark === item
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Filter by Category
          </h2>

          <div className="flex flex-wrap gap-3">
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
          </div>
        </section>

        {loading ? (
          <p className="py-12 text-center text-slate-400">
            Loading rankings...
          </p>
        ) : error ? (
          <p className="rounded-xl bg-red-500/10 p-5 text-red-400">
            {error}
          </p>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 p-6">
              <h2 className="text-xl font-bold capitalize">
                {benchmark} Rankings
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Models ranked by {benchmark} benchmark score.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead className="bg-slate-800 text-sm text-slate-400">
                  <tr>
                    <th className="p-5">Rank</th>
                    <th className="p-5">Model</th>
                    <th className="p-5">Provider</th>
                    <th className="p-5">Category</th>
                    <th className="p-5">Score</th>
                    <th className="p-5">Details</th>
                  </tr>
                </thead>

                <tbody>
                  {rankedModels.map((model, index) => (
                    <tr
                      key={model.id}
                      className="border-t border-slate-800 hover:bg-slate-800/50"
                    >
                      <td className="p-5 font-bold text-blue-400">
                        #{index + 1}
                      </td>

                      <td className="p-5 font-semibold">
                        {model.name}
                      </td>

                      <td className="p-5 text-slate-400">
                        {model.provider}
                      </td>

                      <td className="p-5 text-slate-400">
                        {model.category}
                      </td>

                      <td className="p-5">
                        <span className="rounded-lg bg-green-500/15 px-3 py-2 font-bold text-green-400">
                          {model.benchmarks[benchmark]}/100
                        </span>
                      </td>

                      <td className="p-5">
                        <Link
                          href={`/models/${model.id}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          View Model →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {rankedModels.length === 0 && (
              <p className="p-8 text-center text-slate-400">
                No models found in this category.
              </p>
            )}
          </section>
        )}

        <p className="mt-5 text-xs text-slate-500">
          Benchmark scores are illustrative sample data, not verified
          benchmark results.
        </p>
      </div>
    </main>
  );
}

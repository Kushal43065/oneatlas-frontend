
"use client";

import { useEffect, useState } from "react";
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

export default function ModelDetailsClient({ id }: { id: string }) {
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadModel() {
      try {
        const response = await fetch("/api/models");

        if (!response.ok) {
          throw new Error("Could not load models.");
        }

        const data = await response.json();
        const selectedModel = data.models.find(
          (item: Model) => item.id === id
        );

        if (!selectedModel) {
          throw new Error("Model not found.");
        }

        setModel(selectedModel);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    loadModel();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        Loading model details...
      </main>
    );
  }

  if (error || !model) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <p className="text-red-400">{error || "Model not found."}</p>
        <Link href="/" className="mt-4 inline-block text-blue-400">
          Back to Models
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-blue-400 hover:text-blue-300">
          ← Back to Models
        </Link>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <p className="text-sm text-blue-400">{model.provider}</p>
              <h1 className="mt-2 text-4xl font-bold">{model.name}</h1>
              <p className="mt-3 text-slate-400">{model.description}</p>
            </div>

            <div className="rounded-xl bg-slate-800 px-5 py-4 text-center">
              <p className="text-sm text-slate-400">Overall Score</p>
              <p className="text-3xl font-bold text-green-400">
                {model.score}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-slate-400">Category</p>
              <p className="mt-2 text-xl font-semibold">{model.category}</p>
            </div>

            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-slate-400">Context Window</p>
              <p className="mt-2 text-xl font-semibold">{model.context}</p>
            </div>

            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-slate-400">Release Date</p>
              <p className="mt-2 text-xl font-semibold">{model.releaseDate}</p>
            </div>
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-2xl font-bold">Pricing</h2>
          <p className="mt-2 text-sm text-slate-400">
            Illustrative sample prices in USD per 1 million tokens.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-slate-400">Input Price</p>
              <p className="mt-2 text-2xl font-bold">${model.inputPrice}</p>
            </div>

            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-slate-400">Output Price</p>
              <p className="mt-2 text-2xl font-bold">${model.outputPrice}</p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-2xl font-bold">Supported Modalities</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {model.modalities.map((item) => (
              <span key={item} className="rounded-full bg-blue-500/15 px-4 py-2 text-blue-300">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-2xl font-bold">Capabilities</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {model.capabilities.map((item) => (
              <span key={item} className="rounded-full bg-purple-500/15 px-4 py-2 text-purple-300">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-2xl font-bold">Benchmark Scores</h2>
          <p className="mt-2 text-sm text-slate-400">
            Illustrative sample scores, not verified benchmark results.
          </p>

          <div className="mt-6 space-y-6">
            {Object.entries(model.benchmarks).map(([name, score]) => (
              <div key={name}>
                <div className="mb-2 flex justify-between">
                  <span className="capitalize">{name}</span>
                  <span className="font-semibold">{score}/100</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-2xl font-bold">Available Providers</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {model.availableProviders.map((provider) => (
              <span key={provider} className="rounded-lg bg-slate-800 px-4 py-3">
                {provider}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

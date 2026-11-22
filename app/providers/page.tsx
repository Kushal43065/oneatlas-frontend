
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Model = {
  id: string;
  name: string;
  provider: string;
  score: number;
  availableProviders: string[];
};

const providerDescriptions: Record<string, string> = {
  OpenAI: "Develops advanced AI models for reasoning, coding, and multimodal applications.",
  Anthropic: "Builds AI assistants focused on helpfulness, reliability, and advanced reasoning.",
  Google: "Develops multimodal AI models and tools for a wide range of applications.",
  Meta: "Develops open-weight AI models for research and commercial applications.",
  DeepSeek: "Develops AI models focused on reasoning, mathematics, and coding.",
  "Mistral AI": "Builds efficient AI models for language processing and enterprise applications.",
  "Together AI": "Provides infrastructure and access to open-source AI models.",
};

export default function ProvidersPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadModels() {
      try {
        const response = await fetch("/api/models");

        if (!response.ok) {
          throw new Error("Unable to load provider information.");
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

    loadModels();
  }, []);

  const providerNames = Array.from(
    new Set(models.flatMap((model) => model.availableProviders))
  );

  const providers = providerNames.map((name) => {
    const providerModels = models.filter((model) =>
      model.availableProviders.includes(name)
    );

    const averageScore =
      providerModels.length > 0
        ? Math.round(
            providerModels.reduce((total, model) => total + model.score, 0) /
              providerModels.length
          )
        : 0;

    return {
      name,
      models: providerModels,
      averageScore,
      description:
        providerDescriptions[name] ||
        "AI model provider and platform.",
    };
  });

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
            <Link href="/providers" className="text-blue-400">Providers</Link>
          </div>
        </nav>

        <section className="mb-12">
          <p className="mb-3 font-semibold text-blue-400">
            AI ECOSYSTEM
          </p>

          <h1 className="text-4xl font-bold sm:text-5xl">
            AI Model Providers
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Explore AI companies, discover their models, and compare
            provider performance across the OneAtlas platform.
          </p>
        </section>

        {loading ? (
          <p className="py-12 text-center text-slate-400">
            Loading providers...
          </p>
        ) : error ? (
          <p className="rounded-xl bg-red-500/10 p-5 text-red-400">
            {error}
          </p>
        ) : (
          <>
            <section className="mb-10 grid gap-5 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">Total Providers</p>
                <p className="mt-3 text-3xl font-bold text-blue-400">
                  {providers.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">Total Models</p>
                <p className="mt-3 text-3xl font-bold text-green-400">
                  {models.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">Model Categories</p>
                <p className="mt-3 text-3xl font-bold text-purple-400">
                  {new Set(models.map((model) => model.provider)).size}
                </p>
              </div>
            </section>

            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {providers.map((provider) => (
                <article
                  key={provider.name}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-bold">
                      {provider.name}
                    </h2>

                    <span className="rounded-lg bg-blue-500/15 px-3 py-2 text-sm text-blue-400">
                      {provider.models.length}{" "}
                      {provider.models.length === 1 ? "Model" : "Models"}
                    </span>
                  </div>

                  <p className="mt-4 min-h-20 text-sm leading-6 text-slate-400">
                    {provider.description}
                  </p>

                  <div className="mt-5 rounded-xl bg-slate-800 p-4">
                    <p className="text-sm text-slate-400">
                      Average Overall Score
                    </p>
                    <p className="mt-2 text-2xl font-bold text-green-400">
                      {provider.averageScore}/100
                    </p>
                  </div>

                  <div className="mt-6">
                    <h3 className="mb-3 font-semibold">
                      Available Models
                    </h3>

                    <div className="space-y-3">
                      {provider.models.map((model) => (
                        <div
                          key={model.id}
                          className="flex items-center justify-between gap-3 rounded-lg bg-slate-800 p-3"
                        >
                          <div>
                            <p className="font-medium">{model.name}</p>
                            <p className="text-xs text-slate-400">
                              Score: {model.score}/100
                            </p>
                          </div>

                          <Link
                            href={`/models/${model.id}`}
                            className="text-sm text-blue-400 hover:text-blue-300"
                          >
                            Details →
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}

        <footer className="mt-16 border-t border-slate-800 py-8 text-center text-sm text-slate-500">
          OneAtlas.dev — AI Model Discovery & Intelligence Platform
        </footer>
      </div>
    </main>
  );
}

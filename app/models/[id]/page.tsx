
import ModelDetailsClient from "./ModelDetailsClient";

export async function generateStaticParams() {
  return [
    { id: "gpt-4o" },
    { id: "claude-3-5-sonnet" },
    { id: "gemini-2-flash" },
    { id: "llama-3-3-70b" },
    { id: "deepseek-v3" },
    { id: "mistral-large" },
  ];
}

export default async function ModelDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ModelDetailsClient id={id} />;
}

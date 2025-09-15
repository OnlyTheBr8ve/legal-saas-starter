
import Editor from "@/components/Editor";
import Navbar from "@/components/Navbar";
import fs from "node:fs/promises";
import path from "node:path";

async function getSample() {
  const p = path.join(process.cwd(), "templates", "employment-contract-uk.md");
  try {
    return await fs.readFile(p, "utf8");
  } catch {
    return "## Sample Template\n\nEnter your base contract here.";
  }
}

export default async function Dashboard() {
  const initial = await getSample();
  return (
    <main>
      <Navbar />
      <h2 className="text-2xl font-semibold mb-4">Editor</h2>
      <Editor initial={initial} />
    </main>
  );
}

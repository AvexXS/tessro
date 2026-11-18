import { NextResponse } from "next/server";
import JSZip from "jszip";

export async function POST(req: Request) {
  try {
    const { title = "adeline-project", html, css, prompt, archetype } = await req.json();

    const zip = new JSZip();

    // 1. index.html
    zip.file("index.html", html || "<!DOCTYPE html><html><body><h1>Tessro Adeline Project</h1></body></html>");

    // 2. styles.css
    zip.file("styles.css", css || "body { background: #000; color: #fff; }");

    // 3. README.md
    const readmeContent = `# ${title}
Synthesized autonomously by **Adeline AI** (Tessro Studio)
Archetype: ${archetype || "Liquid Glass Bento"}

## Original Prompt
> "${prompt || "Autonomous digital interface"}"

## Quick Start
To preview or deploy this website:

### Option A: Static Deployment
Drop this directory into Vercel, Netlify, or GitHub Pages.

### Option B: Local Preview
Run any local static server:
\`\`\`bash
# Python 3
python -m http.server 8000

# or npx serve
npx serve .
\`\`\`
Then open [http://localhost:8000](http://localhost:8000).

## Infrastructure & CDN
- Powered by Tessro Digital Design Architecture
- Google Cloud Storage 1TB High-Throughput CDN ready
- Strict zero-bloat standalone HTML5 + Tailwind CSS
`;
    zip.file("README.md", readmeContent);

    // 4. package.json for standard dev tools
    const packageJson = {
      name: title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      version: "1.0.0",
      description: `Synthesized by Tessro Adeline AI Website Builder (${archetype})`,
      scripts: {
        dev: "npx serve . -l 3000",
        build: "echo 'Static build ready'",
      },
      keywords: ["tessro", "adeline", "tailwind", archetype],
      author: "Adeline AI",
      license: "MIT",
    };
    zip.file("package.json", JSON.stringify(packageJson, null, 2));

    // Generate zip buffer
    const buffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 9 },
    });

    const safeTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30);
    const filename = `tessro-${safeTitle}.zip`;

    return new Response(buffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

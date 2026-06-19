import { marked, type Tokens } from "marked";
import { codeToHtml, type BundledLanguage } from "shiki";

const SHIKI_THEME = "github-dark";

type HighlightedCodeToken = Tokens.Code & { highlighted?: string };

// Renderer overrides in this marked version run synchronously, so the actual
// (async) syntax highlighting happens in walkTokens, which the async parse
// pipeline awaits before rendering. The renderer below just reads the result.
marked.use({
  async: true,
  async walkTokens(token) {
    if (token.type !== "code") return;
    const codeToken = token as HighlightedCodeToken;
    const language = (codeToken.lang || "").split(/\s+/)[0] || "text";
    try {
      codeToken.highlighted = await codeToHtml(codeToken.text, {
        lang: language as BundledLanguage,
        theme: SHIKI_THEME,
      });
    } catch {
      codeToken.highlighted = await codeToHtml(codeToken.text, {
        lang: "text",
        theme: SHIKI_THEME,
      });
    }
  },
  renderer: {
    code(token: Tokens.Code) {
      return (token as HighlightedCodeToken).highlighted ?? `<pre><code>${token.text}</code></pre>`;
    },
    image({ href, title, text }: Tokens.Image) {
      const caption = title ? `${text} ${title}` : text;
      return `<figure class="my-6"><img src="${href}" alt="${text}" class="rounded-xl w-full" />${
        caption ? `<figcaption class="text-center text-sm text-slate-400 mt-2">${caption}</figcaption>` : ""
      }</figure>`;
    },
  },
});

export async function renderMarkdown(content: string): Promise<string> {
  return marked.parse(content, { async: true });
}

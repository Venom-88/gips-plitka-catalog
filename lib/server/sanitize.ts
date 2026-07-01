import sanitizeHtml from "sanitize-html";

// Санитайзинг богатого HTML-контента (порт из донора). Используется для htmlContent товара.
export function sanitizeHtmlContent(dirty: string): string {
  if (!dirty) return "";
  return sanitizeHtml(dirty, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "figure",
      "figcaption",
      "span",
      "style",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["class", "style"],
      img: ["src", "alt", "width", "height", "loading"],
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "data"],
  });
}

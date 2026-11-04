/* Shared, dependency-free presentation helpers. Never modify stored recipes. */
(function (root) {
  "use strict";
  const fractions = [
    [1 / 8, "⅛"],
    [1 / 4, "¼"],
    [1 / 3, "⅓"],
    [3 / 8, "⅜"],
    [1 / 2, "½"],
    [5 / 8, "⅝"],
    [2 / 3, "⅔"],
    [3 / 4, "¾"],
    [7 / 8, "⅞"],
  ];
  function quantity(n) {
    if (!Number.isFinite(Number(n))) return String(n);
    n = Number(n);
    const whole = Math.floor(n),
      fraction = n - whole;
    if (fraction < 0.000001) return String(whole);
    const known = fractions.find(([v]) => Math.abs(v - fraction) < 0.00001);
    return known
      ? (whole ? whole + " " : "") + known[1]
      : String(Number(n.toFixed(4)));
  }
  function unit(value, amount, lang) {
    const pairs =
      lang === "es"
        ? {
            taza: "tazas",
            libra: "libras",
            cucharada: "cucharadas",
            cucharadita: "cucharaditas",
            huevo: "huevos",
          }
        : {
            cup: "cups",
            egg: "eggs",
            spoon: "spoons",
            bunch: "bunches",
            clove: "cloves",
          };
    const original = String(value || "");
    for (const [one, many] of Object.entries(pairs)) {
      if ([one, many].includes(original.toLowerCase()))
        return Number(amount) === 1 ? one : many;
    }
    return original;
  }
  function ingredient(row, scale, lang) {
    if (
      row.amount == null ||
      row.amount === "" ||
      !Number.isFinite(Number(row.amount))
    )
      return null;
    const amount = Number(row.amount) * scale;
    return [quantity(amount), unit(row.unit, amount, lang), row.name]
      .filter(Boolean)
      .join(" ");
  }
  function timerFor(step) {
    if (Number(step?.minutes) > 0)
      return { minutes: Number(step.minutes), inferred: false };
    const text = typeof step === "string" ? step : step?.text || "";
    // A suggested check timer, not an inferred completion or food-safety instruction.
    const match = text.match(
      /\b(\d+(?:\.\d+)?)\s*(?:[-–]\s*\d+\s*)?(?:minutes?|mins?|minutos?)\b/i,
    );
    return match && Number(match[1]) > 0
      ? { minutes: Number(match[1]), inferred: true }
      : null;
  }
  const api = { quantity, unit, ingredient, timerFor };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.KitchenDisplay = api;
})(typeof window !== "undefined" ? window : globalThis);

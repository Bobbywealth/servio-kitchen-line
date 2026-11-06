/* Optional: PLAYWRIGHT_MODULE=/path/to/playwright node tests/browser-smoke.cjs
 * All API traffic is fulfilled locally. This test must never write production data.
 */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const recipe = {
  id: 31,
  company_id: "local-qa",
  category_id: 1,
  dish_name: "Kitchen QA recipe",
  description: "Local browser test only",
  prep_time_minutes: 15,
  cook_time_minutes: 45,
  servings: 8,
  is_active: true,
  ingredients: [{ name: "Pasta", amount: "1.00", unit: "lb", order_index: 0 }],
  steps: [
    { step_number: 1, instruction: "Preheat the oven to 350F." },
    { step_number: 2, instruction: "Bake for 35-45 minutes." },
  ],
  translations: {
    es: {
      dish_name: "Receta de prueba",
      description: "Solo prueba local",
      ingredients: [{ name: "Pasta", unit: "libra" }],
      steps: [
        { instruction: "Precalienta el horno a 350F." },
        { instruction: "Hornea por 35-45 minutos." },
      ],
    },
  },
};
recipe.i18n = recipe.translations;
(async () => {
  const publicDir = path.resolve(__dirname, "../public");
  const server = http.createServer((req, res) => {
    const pathname = new URL(req.url, "http://localhost").pathname;
    const file = path.join(
      publicDir,
      pathname === "/" ? "index.html" : pathname,
    );
    if (!file.startsWith(publicDir + "/") || pathname === "/sw.js") {
      res.writeHead(404);
      res.end();
      return;
    }
    try {
      res.setHeader(
        "Content-Type",
        {
          ".html": "text/html",
          ".js": "text/javascript",
          ".css": "text/css",
          ".png": "image/png",
          ".json": "application/json",
        }[path.extname(file)] || "text/plain",
      );
      res.end(fs.readFileSync(file));
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      serviceWorkers: "block",
    });
    const writes = [],
      errors = [];
    await context.route(
      "https://servio-backend-zexb.onrender.com/**",
      (route) => {
        const req = route.request(),
          url = new URL(req.url());
        if (req.method() !== "GET") {
          writes.push(req.url());
          return route.abort();
        }
        const body = url.pathname.endsWith("/categories")
          ? { categories: [{ id: 1, name: "Sides" }] }
          : url.pathname.endsWith("/31")
            ? { recipe }
            : { recipes: [recipe] };
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(body),
        });
      },
    );
    const page = await context.newPage();
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://127.0.0.1:" + server.address().port);
    await page
      .getByRole("button", { name: "Kitchen QA recipe", exact: true })
      .waitFor();
    await page
      .locator("#recipe-search")
      .pressSequentially("Kitchen", { delay: 20 });
    assert.equal(await page.locator("#recipe-search").inputValue(), "Kitchen");
    assert(
      await page
        .locator("#recipe-search")
        .evaluate((e) => e === document.activeElement),
    );
    await page
      .getByRole("button", { name: "Kitchen QA recipe", exact: true })
      .click();
    await page.getByRole("button", { name: "2×", exact: true }).click();
    assert.match(await page.locator(".ing-item").textContent(), /^2 lb/);
    assert.match(await page.locator(".stat-card").last().textContent(), /16/);
    await page.locator(".ing-item").click();
    assert.equal(
      await page.locator(".ing-item").getAttribute("aria-checked"),
      "true",
    );
    await page
      .getByRole("button", { name: "Show Spanish", exact: true })
      .first()
      .click();
    assert.equal(
      await page.locator(".translation-text").first().textContent(),
      "Receta de prueba",
    );
    await page.getByRole("button", { name: "Cambiar a español" }).click();
    assert.equal(await page.locator("h1").textContent(), "Receta de prueba");
    await page.getByRole("button", { name: "Switch to English" }).click();
    await page
      .getByRole("button", { name: "Start cooking", exact: true })
      .click();
    await page.getByRole("button", { name: "Next step", exact: true }).click();
    await page
      .getByRole("button", { name: "Check in 35 min", exact: true })
      .click();
    await page.getByRole("button", { name: "Pause", exact: true }).click();
    await page
      .locator("#timer-label")
      .pressSequentially("Pasta", { delay: 20 });
    await page.waitForTimeout(1100);
    assert.equal(await page.locator("#timer-label").inputValue(), "Pasta");
    assert(
      await page
        .locator("#timer-label")
        .evaluate((e) => e === document.activeElement),
    );
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".timer-drawer").count(), 0);
    await page
      .getByRole("button", { name: "Finish cooking", exact: true })
      .click();
    assert(
      await page
        .getByRole("heading", { name: "All steps complete" })
        .isVisible(),
    );
    await page
      .getByRole("button", { name: "Review recipe", exact: true })
      .click();
    await page.getByRole("button", { name: "Settings", exact: true }).click();
    await page.getByRole("button", { name: "Dark", exact: true }).click();
    await page.getByRole("switch", { name: "Larger text" }).click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    assert.equal(
      await page.locator("html").getAttribute("data-large-text"),
      "true",
    );
    await page.getByRole("button", { name: "Recipes", exact: true }).click();
    for (const width of [320, 360, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      await page
        .getByRole("button", { name: "Kitchen QA recipe", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Start cooking", exact: true })
        .waitFor();
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      await page
        .getByRole("button", { name: "Start cooking", exact: true })
        .click();
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      await page
        .getByRole("button", { name: "Recipes", exact: true })
        .last()
        .click();
    }
    assert.deepEqual(writes, []);
    assert.deepEqual(errors, []);
    console.log(
      "PASS browser regression: search, translations, scaling, checklist, Cook Mode, timers, settings, 5 responsive widths; zero API writes or runtime errors",
    );
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

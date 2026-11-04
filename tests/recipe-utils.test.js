const { test } = require("node:test");
const assert = require("node:assert/strict");
const u = require("../public/recipe-utils");
test("quantities remove database padding without rounding recipes", () => {
  assert.equal(u.quantity("1.00"), "1");
  assert.equal(u.quantity(0.5), "½");
  assert.equal(u.quantity(1.25), "1 ¼");
  assert.equal(u.quantity(0.1), "0.1");
  assert.equal(u.quantity(16.2), "16.2");
  assert.equal(u.quantity(0), "0");
});
test("structured ingredients scale amount, not numbers in the name", () => {
  assert.equal(
    u.ingredient({ amount: "3.00", unit: "cups", name: "Milk" }, 0.5, "en"),
    "1 ½ cups Milk",
  );
  assert.equal(
    u.ingredient({ amount: "2.00", name: "6 oz salmon fillets" }, 2, "en"),
    "4 6 oz salmon fillets",
  );
  assert.equal(u.ingredient({ amount: null, name: "Salt" }, 2, "en"), null);
  assert.equal(
    u.ingredient({ amount: "1.00", unit: "tazas", name: "Leche" }, 1, "es"),
    "1 taza Leche",
  );
});
test("timer suggestions prefer stored duration, never confuse temperature with time", () => {
  assert.deepEqual(u.timerFor({ text: "Bake 350F for 35-45 minutes" }), {
    minutes: 35,
    inferred: true,
  });
  assert.deepEqual(u.timerFor({ text: "Bake 35 minutes", minutes: 45 }), {
    minutes: 45,
    inferred: false,
  });
  assert.equal(u.timerFor({ text: "Bake at 350°F" }), null);
  assert.deepEqual(u.timerFor({ text: "Deja reposar 5 minutos" }), {
    minutes: 5,
    inferred: true,
  });
});

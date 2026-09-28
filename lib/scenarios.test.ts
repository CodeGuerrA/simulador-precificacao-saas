import { describe, expect, it } from "vitest";
import type { PricingInput } from "./pricing";
import { buildScenarios } from "./scenarios";

const pdfExample: PricingInput = { fixedCost: 3000, variableCostPerCustomer: 10, price: 50, customers: 100, taxRate: 0.1 };
const expectMoney = (actual: number, expected: number) => expect(Math.abs(actual - expected)).toBeLessThanOrEqual(0.01);

describe("três cenários (Passo 7): só a quantidade de clientes varia", () => {
  const scenarios = buildScenarios(pdfExample, 60);

  it("pessimista, base e otimista com 70, 100 e 130 clientes", () => {
    expect(scenarios.map((scenario) => [scenario.label, scenario.customers])).toEqual([
      ["Pessimista", 70],
      ["Base", 100],
      ["Otimista", 130],
    ]);
  });

  it("resultado a R$ 50: −550, 500 e 1.550", () => {
    expectMoney(scenarios[0].informed.operatingResult, -550);
    expectMoney(scenarios[1].informed.operatingResult, 500);
    expectMoney(scenarios[2].informed.operatingResult, 1550);
  });

  it("resultado a R$ 60: 80, 1.400 e 2.720", () => {
    expectMoney(scenarios[0].comparison!.operatingResult, 80);
    expectMoney(scenarios[1].comparison!.operatingResult, 1400);
    expectMoney(scenarios[2].comparison!.operatingResult, 2720);
  });

  it("sem segundo preço, a comparação fica vazia", () => {
    expect(buildScenarios(pdfExample, null).every((scenario) => scenario.comparison === null)).toBe(true);
  });

  it("clientes dos cenários são inteiros", () => {
    expect(buildScenarios({ ...pdfExample, customers: 7 }, null).map((scenario) => scenario.customers)).toEqual([5, 7, 9]);
  });
});

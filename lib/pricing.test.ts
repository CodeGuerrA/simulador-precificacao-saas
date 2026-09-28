import { describe, expect, it } from "vitest";
import { breakEvenCustomers, calculatePricing, type PricingInput } from "./pricing";

/** Tolerância monetária do enunciado (p.10): R$ 0,01. */
function expectMoney(actual: number, expected: number) {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(0.01);
}

const pdfExample: PricingInput = {
  fixedCost: 3000,
  variableCostPerCustomer: 10,
  price: 50,
  customers: 100,
  taxRate: 0.1,
};

describe("V1 — caso normal: gabarito do enunciado (p.3 e p.9)", () => {
  const result = calculatePricing(pdfExample);

  it("tributa a receita, não o lucro (O2.7): receita 5.000 e tributos 500", () => {
    expectMoney(result.revenue, 5000);
    expectMoney(result.taxes, 500);
  });

  it("resultado do mês de 500 e custo total de 4.000", () => {
    expectMoney(result.operatingResult, 500);
    expectMoney(result.totalCost, 4000);
  });

  it("margem sobre a receita (O2.8): 10%", () => {
    expectMoney(result.marginPercent!, 10);
  });

  it("contribuição por cliente desconta o tributo (O2.1): 35", () => {
    expectMoney(result.unitContribution, 35);
  });

  it("equilíbrio arredondado para cima (O2.2): 86 clientes", () => {
    expect(result.breakEven).toEqual({ kind: "customers", customers: 86 });
  });

  it("preço que zera o resultado com 100 clientes: R$ 44,44", () => {
    expectMoney(result.breakEvenPrice!, 44.44);
  });
});

describe("V2 — limite", () => {
  it("85 clientes ainda dão resultado negativo (−25) e 86 dão positivo (+10)", () => {
    expectMoney(calculatePricing({ ...pdfExample, customers: 85 }).operatingResult, -25);
    expectMoney(calculatePricing({ ...pdfExample, customers: 86 }).operatingResult, 10);
  });

  it("taxa zero: equilíbrio exato em 75 clientes, com resultado zero nesse ponto", () => {
    const result = calculatePricing({ ...pdfExample, taxRate: 0 });
    expect(result.breakEven).toEqual({ kind: "customers", customers: 75 });
    expectMoney(calculatePricing({ ...pdfExample, taxRate: 0, customers: 75 }).operatingResult, 0);
  });
});

describe("V4 — cenário desfavorável: sem equilíbrio (O2.4)", () => {
  it("contribuição negativa com custo fixo positivo", () => {
    const result = calculatePricing({ ...pdfExample, price: 10 });
    expectMoney(result.unitContribution, -1);
    expect(result.breakEven).toEqual({ kind: "none" });
  });

  it("contribuição exatamente zero com custo fixo positivo", () => {
    expect(breakEvenCustomers(3000, 0)).toEqual({ kind: "none" });
  });

  it("taxa de 100%: não existe preço que zere o resultado", () => {
    const result = calculatePricing({ ...pdfExample, taxRate: 1 });
    expect(result.breakEven).toEqual({ kind: "none" });
    expect(result.breakEvenPrice).toBeNull();
  });
});

describe("V5 — alteração de premissa: preço de R$ 60", () => {
  it("resultado 1.400, margem 23,33% e equilíbrio em 69 clientes", () => {
    const result = calculatePricing({ ...pdfExample, price: 60 });
    expectMoney(result.operatingResult, 1400);
    expectMoney(result.marginPercent!, 23.33);
    expect(result.breakEven).toEqual({ kind: "customers", customers: 69 });
  });
});

describe("V6 — casos que não podem quebrar (p.10)", () => {
  it("receita zero por 0 clientes: resultado −3.000, margem não se aplica, preço que zera não existe", () => {
    const result = calculatePricing({ ...pdfExample, customers: 0 });
    expectMoney(result.operatingResult, -3000);
    expect(result.marginPercent).toBeNull();
    expect(result.breakEvenPrice).toBeNull();
  });

  it("receita zero por preço zero: margem não se aplica", () => {
    expect(calculatePricing({ ...pdfExample, price: 0 }).marginPercent).toBeNull();
  });

  it("custo fixo zero: equilíbrio em 0 cliente (premissa da equipe)", () => {
    expect(calculatePricing({ ...pdfExample, fixedCost: 0 }).breakEven).toEqual({ kind: "customers", customers: 0 });
  });
});

describe("Precisão numérica do equilíbrio (O2.9)", () => {
  it("custo fixo 9,80, preço 1, taxa 2%: equilíbrio 10, não 11", () => {
    const result = calculatePricing({ fixedCost: 9.8, variableCostPerCustomer: 0, price: 1, customers: 10, taxRate: 0.02 });
    expect(result.breakEven).toEqual({ kind: "customers", customers: 10 });
  });

  it("em todos os casos de equilíbrio exato, o resultado é exatamente o número de clientes esperado", () => {
    let checked = 0;
    const failures: string[] = [];
    for (let price = 1; price <= 120; price++) {
      for (let taxPercent = 0; taxPercent < 100; taxPercent++) {
        for (let variableCost = 0; variableCost < 60; variableCost += 5) {
          // Contribuição exata em centavos: preço × (100 − taxa) − variável × 100.
          const contributionCents = price * (100 - taxPercent) - variableCost * 100;
          if (contributionCents <= 0) continue;
          const contribution = price * (1 - taxPercent / 100) - variableCost;
          for (const expectedCustomers of [10, 50, 86, 100]) {
            const fixedCost = (contributionCents * expectedCustomers) / 100;
            checked++;
            const breakEven = breakEvenCustomers(fixedCost, contribution);
            if (breakEven.kind !== "customers" || breakEven.customers !== expectedCustomers) {
              failures.push(`${fixedCost}/${price}/${taxPercent}%/${variableCost}`);
            }
          }
        }
      }
    }
    expect(checked).toBeGreaterThan(280_000);
    expect(failures).toEqual([]);
  });
});

import { describe, expect, it } from "vitest";
import { calculatePricing, type PricingInput } from "./pricing";
import { buildSensitivity, mostSensitive } from "./sensitivity";

const pdfExample: PricingInput = { fixedCost: 3000, variableCostPerCustomer: 10, price: 50, customers: 100, taxRate: 0.1 };
const expectClose = (actual: number | null, expected: number) => expect(Math.abs((actual ?? NaN) - expected)).toBeLessThanOrEqual(0.01);

describe("sensibilidade (Passo 7): uma entrada por vez até zerar o resultado", () => {
  const limits = Object.fromEntries(buildSensitivity(pdfExample).map((item) => [item.key, item]));

  it("limites do exemplo do enunciado", () => {
    expectClose(limits.price.limit, 44.44);
    expect(limits.customers.limit).toBe(86);
    expectClose(limits.fixedCost.limit, 3500);
    expectClose(limits.variableCostPerCustomer.limit, 15);
    expectClose(limits.taxRate.limit, 0.2);
  });

  it("variação até o limite: preço −11,11%, clientes −14%, custo fixo +16,67%", () => {
    expectClose(limits.price.changePercent, -11.11);
    expectClose(limits.customers.changePercent, -14);
    expectClose(limits.fixedCost.changePercent, 16.67);
  });

  it("cada limite realmente zera o resultado quando aplicado sozinho", () => {
    expectClose(calculatePricing({ ...pdfExample, price: limits.price.limit! }).operatingResult, 0);
    expectClose(calculatePricing({ ...pdfExample, fixedCost: limits.fixedCost.limit! }).operatingResult, 0);
    expectClose(calculatePricing({ ...pdfExample, variableCostPerCustomer: limits.variableCostPerCustomer.limit! }).operatingResult, 0);
    expectClose(calculatePricing({ ...pdfExample, taxRate: limits.taxRate.limit! }).operatingResult, 0);
  });

  it("a premissa com menor folga no exemplo é o preço", () => {
    expect(mostSensitive(buildSensitivity(pdfExample))?.key).toBe("price");
  });

  it("sem clientes, não existem limites de preço, custo variável e taxa", () => {
    const empty = Object.fromEntries(buildSensitivity({ ...pdfExample, customers: 0 }).map((item) => [item.key, item]));
    expect(empty.price.limit).toBeNull();
    expect(empty.variableCostPerCustomer.limit).toBeNull();
    expect(empty.taxRate.limit).toBeNull();
  });
});

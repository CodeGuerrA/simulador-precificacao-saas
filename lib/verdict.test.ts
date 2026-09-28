import { describe, expect, it } from "vitest";
import { calculatePricing, type PricingInput } from "./pricing";
import { buildVerdict } from "./verdict";

const pdfExample: PricingInput = { fixedCost: 3000, variableCostPerCustomer: 10, price: 50, customers: 100, taxRate: 0.1 };
const verdictFor = (input: PricingInput) => buildVerdict(input, calculatePricing(input));
const plain = (text: string) => text.replace(/\s/g, " ");

describe("veredito do painel", () => {
  it("positivo no exemplo do enunciado", () => {
    const verdict = verdictFor(pdfExample);
    expect(verdict.tone).toBe("positive");
    expect(plain(verdict.text)).toBe("Com 100 clientes a R$ 50,00, o resultado do mês é positivo.");
  });

  it("exatamente zero no equilíbrio exato", () => {
    expect(verdictFor({ ...pdfExample, taxRate: 0, customers: 75 }).tone).toBe("neutral");
  });

  it("negativo informa quantos clientes o equilíbrio exige", () => {
    const verdict = verdictFor({ ...pdfExample, customers: 85 });
    expect(verdict.tone).toBe("negative");
    expect(verdict.text).toContain("O equilíbrio exige 86 clientes.");
  });

  it("negativo sem equilíbrio não sugere aumentar clientes", () => {
    const verdict = verdictFor({ ...pdfExample, price: 10 });
    expect(verdict.tone).toBe("negative");
    expect(verdict.text).toContain("aumentar clientes não resolve");
  });

  it("singular para 1 cliente", () => {
    expect(verdictFor({ ...pdfExample, customers: 1 }).text).toMatch(/^Com 1 cliente a/);
  });
});

import { describe, expect, it } from "vitest";
import { validatePricingForm, type PricingFormValues } from "./validation";

const pdfExample: PricingFormValues = {
  fixedCost: "3.000,00",
  variableCostPerCustomer: "10,00",
  price: "50,00",
  customers: "100",
  taxRatePercent: "10",
};

describe("V3 — entrada inválida gera mensagem e nenhum resultado", () => {
  it("custo fixo vazio (RF03)", () => {
    const result = validatePricingForm({ ...pdfExample, fixedCost: "" });
    expect(result).toEqual({ ok: false, errors: { fixedCost: "Informe o custo fixo mensal." } });
  });

  it("texto no preço", () => {
    const result = validatePricingForm({ ...pdfExample, price: "abc" });
    expect(result).toEqual({ ok: false, errors: { price: "Digite um número, por exemplo 50,00." } });
  });

  it("custo variável negativo", () => {
    const result = validatePricingForm({ ...pdfExample, variableCostPerCustomer: "-1" });
    expect(result).toEqual({ ok: false, errors: { variableCostPerCustomer: "O custo variável não pode ser negativo." } });
  });

  it("clientes fracionários", () => {
    const result = validatePricingForm({ ...pdfExample, customers: "10,5" });
    expect(result).toEqual({ ok: false, errors: { customers: "A quantidade de clientes deve ser um número inteiro." } });
  });

  it("taxa acima de 100%", () => {
    const result = validatePricingForm({ ...pdfExample, taxRatePercent: "120" });
    expect(result).toEqual({ ok: false, errors: { taxRatePercent: "A taxa deve estar entre 0% e 100%." } });
  });

  it("vários campos com problema aparecem todos de uma vez", () => {
    const result = validatePricingForm({ ...pdfExample, fixedCost: "", customers: "x" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(["customers", "fixedCost"]);
    }
  });
});

describe("entrada válida", () => {
  it("converte a taxa de % para fração (C2) e lê o formato brasileiro", () => {
    expect(validatePricingForm(pdfExample)).toEqual({
      ok: true,
      input: { fixedCost: 3000, variableCostPerCustomer: 10, price: 50, customers: 100, taxRate: 0.1 },
    });
  });

  it("aceita taxa zero e taxa de 100%", () => {
    expect(validatePricingForm({ ...pdfExample, taxRatePercent: "0" }).ok).toBe(true);
    expect(validatePricingForm({ ...pdfExample, taxRatePercent: "100" }).ok).toBe(true);
  });
});

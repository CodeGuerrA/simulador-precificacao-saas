import { describe, expect, it } from "vitest";
import { buildInterpretation } from "./interpretation";
import { calculatePricing, type PricingInput } from "./pricing";
import { buildScenarios } from "./scenarios";
import { buildSensitivity } from "./sensitivity";

const pdfExample: PricingInput = { fixedCost: 3000, variableCostPerCustomer: 10, price: 50, customers: 100, taxRate: 0.1 };
const plain = (text: string) => text.replace(/\s/g, " ");

function interpret(input: PricingInput, comparisonPrice: number | null) {
  return buildInterpretation({
    input,
    result: calculatePricing(input),
    comparison: comparisonPrice === null ? null : { price: comparisonPrice, result: calculatePricing({ ...input, price: comparisonPrice }) },
    scenarios: buildScenarios(input, comparisonPrice),
    sensitivity: buildSensitivity(input),
  });
}

describe("interpretação por regras explícitas (Passo 7)", () => {
  const text = plain(interpret(pdfExample, 60).statements.join(" "));

  it("declara o critério", () => {
    expect(interpret(pdfExample, 60).criterion).toContain("maior resultado do mês");
  });

  it("indica o preço favorecido pelo critério", () => {
    expect(text).toContain("o preço favorecido é R$ 60,00");
  });

  it("diz em que condição a conclusão muda: R$ 60 precisa de pelo menos 80 clientes", () => {
    expect(text).toContain("são necessários pelo menos 80 clientes");
    expect(text).toContain("Uma perda de mais de 20 clientes favorece o preço menor");
  });

  it("cita os cenários e a premissa com menor folga", () => {
    expect(text).toContain("com 70 clientes o resultado a R$ 50,00 seria −R$ 550,00");
    expect(text).toContain("a premissa com menor folga é preço mensal: uma queda de 11,11% zera o resultado");
  });

  it("não usa frases de certeza sobre o futuro (A13)", () => {
    const all = plain([...interpret(pdfExample, 60).statements, ...interpret(pdfExample, 60).caveats].join(" ")).toLowerCase();
    for (const word of ["vai ", "irá", "garante", "certamente", "com certeza", "sem dúvida", "sempre", "nunca"]) {
      expect(all).not.toContain(word);
    }
  });

  it("sem segundo preço, não fala em preço favorecido", () => {
    expect(plain(interpret(pdfExample, null).statements.join(" "))).not.toContain("favorecido");
  });

  it("ressalva que o resultado não é lucro contábil e que a taxa é hipotética", () => {
    const caveats = interpret(pdfExample, 60).caveats.join(" ");
    expect(caveats).toContain("não o lucro contábil");
    expect(caveats).toContain("hipotética");
  });
});

import { describe, expect, it } from "vitest";
import { formatCompactCurrency, formatCurrency, formatPercent, formatTaxRate } from "./format";

/** O Intl usa espaço não separável entre "R$" e o número. */
const plain = (text: string) => text.replace(/\s/g, " ");

describe("formatação em pt-BR", () => {
  it("moeda com milhar e duas casas", () => {
    expect(plain(formatCurrency(5000))).toBe("R$ 5.000,00");
  });

  it("negativo com sinal de menos tipográfico", () => {
    expect(plain(formatCurrency(-25))).toBe("−R$ 25,00");
  });

  it("resíduo de ponto flutuante perto de zero não vira −R$ 0,00", () => {
    expect(plain(formatCurrency(-0.0000001))).toBe("R$ 0,00");
  });

  it("percentual com duas casas", () => {
    expect(formatPercent(23.333333)).toBe("23,33%");
  });

  it("taxa guardada como fração aparece em %", () => {
    expect(formatTaxRate(0.1)).toBe("10%");
    expect(formatTaxRate(0.125)).toBe("12,5%");
  });

  it("moeda compacta para os eixos do gráfico", () => {
    expect(plain(formatCompactCurrency(3000))).toBe("R$ 3 mil");
  });
});

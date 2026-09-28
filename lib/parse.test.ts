import { describe, expect, it } from "vitest";
import { parseBrazilianNumber } from "./parse";

describe("leitura de números no formato brasileiro (I1 e I2)", () => {
  it.each([
    ["3.000", 3000],
    ["1.000,50", 1000.5],
    ["10,5", 10.5],
    ["10.5", 10.5],
    ["R$ 3.000,00", 3000],
    ["10 %", 10],
    ["1.234.567,89", 1234567.89],
    ["1,000.50", 1000.5],
    ["-5", -5],
    ["0", 0],
  ])("lê %s como %d", (text, expected) => {
    expect(parseBrazilianNumber(text)).toEqual({ ok: true, value: expected });
  });

  it.each(["", "   ", "R$", "%"])("campo vazio (%j) não vira zero", (text) => {
    expect(parseBrazilianNumber(text)).toEqual({ ok: false, reason: "empty" });
  });

  it.each(["abc", "12a", "1,2,3", "--5", "5-"])("texto inválido (%s) é recusado", (text) => {
    expect(parseBrazilianNumber(text)).toEqual({ ok: false, reason: "invalid" });
  });
});

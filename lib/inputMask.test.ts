import { describe, expect, it } from "vitest";
import { applyTypingMask, finalizeMask } from "./inputMask";
import { parseBrazilianNumber } from "./parse";

describe("formatação ao digitar", () => {
  it.each([
    ["10000", "10.000"],
    ["1000000", "1.000.000"],
    ["3000,5", "3.000,5"],
    ["3000,555", "3.000,55"],
    ["10.000", "10.000"],
    ["007", "7"],
    ["0,5", "0,5"],
    [",5", "0,5"],
    ["12a3", "123"],
    ["1,2,3", "1,23"],
  ])("dinheiro: %s vira %s", (raw, expected) => {
    expect(applyTypingMask(raw, raw.length, "money").value).toBe(expected);
  });

  it("clientes aceitam só inteiros", () => {
    expect(applyTypingMask("1500,5", 6, "integer").value).toBe("15.005");
  });

  it("taxa aceita decimal com vírgula", () => {
    expect(applyTypingMask("12,5", 4, "percent").value).toBe("12,5");
  });

  it("o cursor continua depois do dígito digitado, mesmo quando entra um ponto", () => {
    // Digitando o quinto dígito no fim: "1.000" + "0" → "10.000", cursor no fim.
    expect(applyTypingMask("1.0000", 6, "money")).toEqual({ value: "10.000", caret: 6 });
    // Inserindo "5" depois do primeiro dígito de "1.000": "15.000" → "15.000", cursor depois do 5.
    expect(applyTypingMask("15.000", 2, "money")).toEqual({ value: "15.000", caret: 2 });
  });

  it("apagar tudo deixa o campo vazio (e não zero)", () => {
    expect(applyTypingMask("", 0, "money")).toEqual({ value: "", caret: 0 });
  });
});

describe("ao sair do campo", () => {
  it.each([
    ["10.000", "10.000,00"],
    ["10.000,5", "10.000,50"],
    ["10.000,55", "10.000,55"],
    ["", ""],
  ])("dinheiro: %s vira %s", (value, expected) => {
    expect(finalizeMask(value, "money")).toBe(expected);
  });

  it("clientes e taxa não ganham casas decimais", () => {
    expect(finalizeMask("1.000", "integer")).toBe("1.000");
    expect(finalizeMask("10", "percent")).toBe("10");
  });

  it("o valor formatado continua sendo lido certo pelo cálculo", () => {
    expect(parseBrazilianNumber(finalizeMask(applyTypingMask("10000", 5, "money").value, "money"))).toEqual({ ok: true, value: 10000 });
    expect(parseBrazilianNumber(applyTypingMask("1234567", 7, "integer").value)).toEqual({ ok: true, value: 1234567 });
  });
});

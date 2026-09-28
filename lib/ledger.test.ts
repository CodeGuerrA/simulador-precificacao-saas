import { describe, expect, it } from "vitest";
import { buildLedger, changedLedgerKeys } from "./ledger";
import { calculatePricing, type PricingInput } from "./pricing";

const pdfExample: PricingInput = { fixedCost: 3000, variableCostPerCustomer: 10, price: 50, customers: 100, taxRate: 0.1 };
const plain = (text: string | null) => (text ?? "").replace(/\s/g, " ");
const ledgerFor = (input: PricingInput) => buildLedger(input, calculatePricing(input));

describe("conta armada", () => {
  it("antes do cálculo mostra a estrutura da conta sem valores", () => {
    const empty = buildLedger(null, null);
    expect(empty.map((row) => row.operator).slice(0, 5)).toEqual(["", "−", "−", "−", "="]);
    expect(empty.every((row) => row.display === null && row.work === null)).toBe(true);
  });

  it("mostra a memória de cálculo com os números do usuário", () => {
    const rows = Object.fromEntries(ledgerFor(pdfExample).map((row) => [row.key, row]));
    expect(plain(rows.revenue.work)).toBe("R$ 50,00 × 100 clientes");
    expect(plain(rows.taxes.work)).toBe("R$ 5.000,00 × 10%");
    expect(plain(rows.operatingResult.work)).toBe("R$ 5.000,00 − R$ 3.000,00 − R$ 1.000,00 − R$ 500,00");
    expect(plain(rows.operatingResult.display)).toBe("R$ 500,00");
    expect(plain(rows.unitContribution.work)).toBe("R$ 50,00 × (1 − 10%) − R$ 10,00");
    expect(plain(rows.breakEven.work)).toBe("R$ 3.000,00 ÷ R$ 35,00 = 85,71, arredondado para cima");
    expect(rows.breakEven.display).toBe("86 clientes");
  });

  it("sem receita, a margem aparece como não se aplica", () => {
    const margin = ledgerFor({ ...pdfExample, customers: 0 }).find((row) => row.key === "margin");
    expect(margin?.display).toBe("Não se aplica");
  });

  it("sem equilíbrio, explica por que em vez de mostrar número", () => {
    const breakEven = ledgerFor({ ...pdfExample, price: 10 }).find((row) => row.key === "breakEven");
    expect(breakEven?.display).toBe("Sem equilíbrio");
    expect(breakEven?.work).toContain("cada cliente a mais reduz o resultado");
  });
});

describe("linhas que mudaram (movimento do marca-texto)", () => {
  it("mudar o preço altera receita, tributos, resultado e indicadores, mas não os custos", () => {
    const changed = changedLedgerKeys(ledgerFor(pdfExample), ledgerFor({ ...pdfExample, price: 60 }));
    expect([...changed].sort()).toEqual(["breakEven", "margin", "operatingResult", "revenue", "taxes", "unitContribution"]);
  });

  it("primeiro cálculo não dispara destaque", () => {
    expect(changedLedgerKeys(null, ledgerFor(pdfExample)).size).toBe(0);
  });
});

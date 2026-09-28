import { formatCurrency, formatInteger } from "./format";
import type { PricingInput, PricingResult } from "./pricing";

export type VerdictTone = "positive" | "neutral" | "negative";

export type Verdict = { tone: VerdictTone; text: string };

/** Frase do topo do painel: diz o que o número significa, sem prometer nada sobre o futuro. */
export function buildVerdict(input: PricingInput, result: PricingResult): Verdict {
  const scenario = `Com ${formatInteger(input.customers)} ${input.customers === 1 ? "cliente" : "clientes"} a ${formatCurrency(input.price)}`;

  if (Math.abs(result.operatingResult) < 0.005) {
    return { tone: "neutral", text: `${scenario}, o resultado do mês fica exatamente em zero.` };
  }
  if (result.operatingResult > 0) {
    return { tone: "positive", text: `${scenario}, o resultado do mês é positivo.` };
  }
  if (result.breakEven.kind === "none") {
    return {
      tone: "negative",
      text: `${scenario}, o resultado do mês é negativo, e aumentar clientes não resolve: cada cliente reduz o resultado.`,
    };
  }
  return {
    tone: "negative",
    text: `${scenario}, o resultado do mês é negativo. O equilíbrio exige ${formatInteger(result.breakEven.customers)} clientes.`,
  };
}

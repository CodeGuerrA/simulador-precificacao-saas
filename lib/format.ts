/** Formatação para exibição em pt-BR. O arredondamento acontece só aqui (C9). */

const MINUS_SIGN = "−";

const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const compactCurrencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});
const decimalFormatter = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const integerFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const rateFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

/** Evita "−R$ 0,00" quando o valor é um resíduo de ponto flutuante perto de zero. */
function withoutNegativeZero(value: number): number {
  return Math.abs(value) < 0.005 ? 0 : value;
}

function withTypographicMinus(text: string): string {
  return text.replace("-", MINUS_SIGN);
}

export function formatCurrency(value: number): string {
  return withTypographicMinus(currencyFormatter.format(withoutNegativeZero(value)));
}

export function formatCompactCurrency(value: number): string {
  return withTypographicMinus(compactCurrencyFormatter.format(withoutNegativeZero(value)));
}

export function formatDecimal(value: number): string {
  return withTypographicMinus(decimalFormatter.format(withoutNegativeZero(value)));
}

export function formatPercent(percent: number): string {
  return `${formatDecimal(percent)}%`;
}

export function formatInteger(value: number): string {
  return integerFormatter.format(value);
}

/** Taxa guardada como fração (0,10) e exibida em % sem casas desnecessárias ("10%"). */
export function formatTaxRate(taxRate: number): string {
  return `${rateFormatter.format(taxRate * 100)}%`;
}

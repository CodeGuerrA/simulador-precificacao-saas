/**
 * Formatação dos campos enquanto a pessoa digita, no padrão brasileiro:
 * "10000" vira "10.000" na hora e "10.000,00" ao sair do campo (dinheiro).
 * O resultado continua legível por parseBrazilianNumber.
 */

export type InputMask = "money" | "integer" | "percent";

export type MaskedValue = { value: string; caret: number };

const MAX_DECIMALS: Record<InputMask, number> = { money: 2, integer: 0, percent: 2 };

function groupThousands(integerDigits: string): string {
  return integerDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Conta dígitos e vírgula, que são os caracteres que a pessoa digitou (os pontos são da máscara). */
function significantCount(text: string): number {
  return (text.match(/[\d,]/g) ?? []).length;
}

export function applyTypingMask(raw: string, caret: number, mask: InputMask): MaskedValue {
  const allowComma = MAX_DECIMALS[mask] > 0;
  let seenComma = false;
  let kept = "";
  let keptBeforeCaret = 0;

  for (let index = 0; index < raw.length; index++) {
    const char = raw[index];
    const isDigit = char >= "0" && char <= "9";
    const isFirstComma = allowComma && char === "," && !seenComma;
    if (!isDigit && !isFirstComma) continue;
    if (isFirstComma) seenComma = true;
    kept += char;
    if (index < caret) keptBeforeCaret++;
  }

  if (kept === "") return { value: "", caret: 0 };

  let [integerPart, decimalPart] = kept.split(",") as [string, string | undefined];
  const leadingZeros = integerPart.length - integerPart.replace(/^0+/, "").length;
  const removedZeros = integerPart.length > 1 ? Math.min(leadingZeros, integerPart.length - 1) : 0;
  integerPart = integerPart.slice(removedZeros);
  keptBeforeCaret = Math.max(0, keptBeforeCaret - removedZeros);
  if (integerPart === "") integerPart = "0";

  if (decimalPart !== undefined) {
    decimalPart = decimalPart.slice(0, MAX_DECIMALS[mask]);
  }

  const value = groupThousands(integerPart) + (decimalPart !== undefined ? `,${decimalPart}` : "");
  keptBeforeCaret = Math.min(keptBeforeCaret, significantCount(value));

  let newCaret = 0;
  let counted = 0;
  while (newCaret < value.length && counted < keptBeforeCaret) {
    if (/[\d,]/.test(value[newCaret])) counted++;
    newCaret++;
  }
  return { value, caret: newCaret };
}

/** Ao sair do campo: dinheiro ganha duas casas ("10.000" → "10.000,00"); os outros ficam como estão. */
export function finalizeMask(value: string, mask: InputMask): string {
  if (mask !== "money" || value === "") return value;
  const [integerPart, decimalPart = ""] = value.split(",");
  return `${integerPart},${decimalPart.padEnd(2, "0")}`;
}

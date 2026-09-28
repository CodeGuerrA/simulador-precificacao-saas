/**
 * Leitura de números digitados no formato brasileiro.
 * Existe porque Number("") vira 0 em silêncio e parseFloat("1.000,50") vira 1
 * (armadilhas I1 e I2 em requisitos.md).
 */

export type ParsedNumber =
  | { ok: true; value: number }
  | { ok: false; reason: "empty" | "invalid" };

const THOUSANDS_WITH_DOTS = /^-?\d{1,3}(\.\d{3})+$/;
const PLAIN_NUMBER = /^-?\d+(\.\d+)?$/;

/**
 * Regras:
 * - "R$", "%" e espaços são ignorados;
 * - com vírgula e ponto, o separador que aparece por último é o decimal ("1.000,50" e "1,000.50");
 * - só com vírgula, ela é o decimal ("10,5");
 * - só com ponto, é milhar quando agrupa de 3 em 3 ("3.000"); senão é decimal ("10.5").
 */
export function parseBrazilianNumber(text: string): ParsedNumber {
  const cleaned = text.replace(/R\$|%|\s/g, "");
  if (cleaned === "") {
    return { ok: false, reason: "empty" };
  }

  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");
  let normalized: string;

  if (lastComma >= 0 && lastDot >= 0) {
    normalized =
      lastComma > lastDot
        ? cleaned.replace(/\./g, "").replace(",", ".")
        : cleaned.replace(/,/g, "");
  } else if (lastComma >= 0) {
    normalized = cleaned.replace(",", ".");
  } else if (THOUSANDS_WITH_DOTS.test(cleaned)) {
    normalized = cleaned.replace(/\./g, "");
  } else {
    normalized = cleaned;
  }

  if (!PLAIN_NUMBER.test(normalized)) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, value: Number(normalized) };
}

import { parseBrazilianNumber } from "./parse";
import type { PricingInput } from "./pricing";

export type PricingFormValues = {
  fixedCost: string;
  variableCostPerCustomer: string;
  price: string;
  customers: string;
  /** Taxa digitada em % da receita. */
  taxRatePercent: string;
};

export type PricingField = keyof PricingFormValues;

export type ValidationResult =
  | { ok: true; input: PricingInput }
  | { ok: false; errors: Partial<Record<PricingField, string>> };

type FieldRule = {
  requiredMessage: string;
  example: string;
  negativeMessage: string;
};

const FIELD_RULES: Record<PricingField, FieldRule> = {
  fixedCost: {
    requiredMessage: "Informe o custo fixo mensal.",
    example: "3.000,00",
    negativeMessage: "O custo fixo não pode ser negativo.",
  },
  variableCostPerCustomer: {
    requiredMessage: "Informe o custo variável por cliente.",
    example: "10,00",
    negativeMessage: "O custo variável não pode ser negativo.",
  },
  price: {
    requiredMessage: "Informe o preço mensal.",
    example: "50,00",
    negativeMessage: "O preço não pode ser negativo.",
  },
  customers: {
    requiredMessage: "Informe a quantidade de clientes.",
    example: "100",
    negativeMessage: "A quantidade de clientes não pode ser negativa.",
  },
  taxRatePercent: {
    requiredMessage: "Informe a taxa hipotética de tributos.",
    example: "10",
    negativeMessage: "A taxa não pode ser negativa.",
  },
};

function readNonNegative(field: PricingField, text: string): { value: number } | { error: string } {
  const rule = FIELD_RULES[field];
  const parsed = parseBrazilianNumber(text);
  if (!parsed.ok) {
    return {
      error: parsed.reason === "empty" ? rule.requiredMessage : `Digite um número, por exemplo ${rule.example}.`,
    };
  }
  if (parsed.value < 0) {
    return { error: rule.negativeMessage };
  }
  return { value: parsed.value };
}

export type ComparisonPriceResult = { ok: true; price: number | null } | { ok: false; error: string };

/** Segundo preço da comparação: opcional, mas quando preenchido segue as regras do preço. */
export function validateComparisonPrice(text: string): ComparisonPriceResult {
  if (text.trim() === "") {
    return { ok: true, price: null };
  }
  const read = readNonNegative("price", text);
  return "error" in read ? { ok: false, error: read.error } : { ok: true, price: read.value };
}

/** Valida o formulário e devolve a entrada do cálculo, com a taxa já convertida de % para fração (C2). */
export function validatePricingForm(values: PricingFormValues): ValidationResult {
  const errors: Partial<Record<PricingField, string>> = {};
  const numbers: Partial<Record<PricingField, number>> = {};

  for (const field of Object.keys(FIELD_RULES) as PricingField[]) {
    const read = readNonNegative(field, values[field]);
    if ("error" in read) {
      errors[field] = read.error;
    } else {
      numbers[field] = read.value;
    }
  }

  if (numbers.customers !== undefined && !Number.isInteger(numbers.customers)) {
    errors.customers = "A quantidade de clientes deve ser um número inteiro.";
  }
  if (numbers.taxRatePercent !== undefined && numbers.taxRatePercent > 100) {
    errors.taxRatePercent = "A taxa deve estar entre 0% e 100%.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    input: {
      fixedCost: numbers.fixedCost!,
      variableCostPerCustomer: numbers.variableCostPerCustomer!,
      price: numbers.price!,
      customers: numbers.customers!,
      taxRate: numbers.taxRatePercent! / 100,
    },
  };
}

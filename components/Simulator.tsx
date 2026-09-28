"use client";

import { useState, type FormEvent } from "react";
import { buildSimulationExport } from "@/lib/export";
import { finalizeMask, type InputMask } from "@/lib/inputMask";
import { buildInterpretation } from "@/lib/interpretation";
import { buildLedger, changedLedgerKeys, type LedgerKey, type LedgerLine } from "@/lib/ledger";
import { calculatePricing, type PricingInput, type PricingResult } from "@/lib/pricing";
import { buildScenarios } from "@/lib/scenarios";
import { buildSensitivity } from "@/lib/sensitivity";
import { validateComparisonPrice, validatePricingForm, type PricingField, type PricingFormValues } from "@/lib/validation";
import { buildVerdict } from "@/lib/verdict";
import { ExportActions } from "./ExportActions";
import { Field, TextAreaField } from "./Field";
import { InterpretationPanel } from "./InterpretationPanel";
import { Ledger } from "./Ledger";
import { PriceComparison } from "./PriceComparison";
import { ResultChart } from "./ResultChart";
import { ScenarioTable } from "./ScenarioTable";
import { SensitivityTable } from "./SensitivityTable";
import styles from "./Simulator.module.css";

type FormState = PricingFormValues & { comparisonPrice: string; perceivedBenefit: string };
type FormField = PricingField | "comparisonPrice";
type FormErrors = Partial<Record<FormField, string>>;

type Calculation = {
  input: PricingInput;
  result: PricingResult;
  comparison: { price: number; result: PricingResult } | null;
  lines: LedgerLine[];
};

type SimulatorState = {
  calculation: Calculation | null;
  errors: FormErrors;
  changed: ReadonlySet<LedgerKey>;
  version: number;
};

const FIELD_ORDER: FormField[] = ["fixedCost", "variableCostPerCustomer", "price", "customers", "taxRatePercent", "comparisonPrice"];

const FIELD_MASKS: Record<FormField, InputMask> = {
  fixedCost: "money",
  variableCostPerCustomer: "money",
  price: "money",
  customers: "integer",
  taxRatePercent: "percent",
  comparisonPrice: "money",
};

/** Completa os campos de dinheiro com duas casas ("10.000" → "10.000,00"). */
function finalizeFields(form: FormState, fields: FormField[]): FormState {
  const next = { ...form };
  for (const field of fields) {
    next[field] = finalizeMask(form[field], FIELD_MASKS[field]);
  }
  return next;
}

const EMPTY_FORM: FormState = {
  fixedCost: "",
  variableCostPerCustomer: "",
  price: "",
  customers: "",
  taxRatePercent: "",
  comparisonPrice: "",
  perceivedBenefit: "",
};

/** Caso de referência do enunciado (p.3). O segundo preço é a proposta da equipe para comparação. */
const EXAMPLE_FORM: FormState = {
  fixedCost: "3.000,00",
  variableCostPerCustomer: "10,00",
  price: "50,00",
  customers: "100",
  taxRatePercent: "10",
  comparisonPrice: "60,00",
  perceivedBenefit: "Tarefas da equipe organizadas em um só lugar (texto de exemplo).",
};

function evaluate(form: FormState): { calculation: Calculation | null; errors: FormErrors } {
  const validation = validatePricingForm(form);
  const comparisonCheck = validateComparisonPrice(form.comparisonPrice);
  const errors: FormErrors = {
    ...(validation.ok ? {} : validation.errors),
    ...(comparisonCheck.ok ? {} : { comparisonPrice: comparisonCheck.error }),
  };
  if (!validation.ok) {
    return { calculation: null, errors };
  }

  const { input } = validation;
  const result = calculatePricing(input);
  const comparison =
    comparisonCheck.ok && comparisonCheck.price !== null
      ? { price: comparisonCheck.price, result: calculatePricing({ ...input, price: comparisonCheck.price }) }
      : null;

  return { calculation: { input, result, comparison, lines: buildLedger(input, result) }, errors };
}

export function Simulator() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [touched, setTouched] = useState<ReadonlySet<FormField>>(new Set());
  const [state, setState] = useState<SimulatorState>({ calculation: null, errors: {}, changed: new Set(), version: 0 });

  function commit(nextForm: FormState, nextTouched: ReadonlySet<FormField>): FormErrors {
    const { calculation, errors } = evaluate(nextForm);
    setTouched(nextTouched);
    setState((previous) => {
      const changed = calculation ? changedLedgerKeys(previous.calculation?.lines ?? null, calculation.lines) : new Set<LedgerKey>();
      return { calculation, errors, changed, version: changed.size > 0 ? previous.version + 1 : previous.version };
    });
    return errors;
  }

  function update(field: keyof FormState, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleBlur(field: FormField) {
    const finalized = finalizeFields(form, [field]);
    setForm(finalized);
    commit(finalized, new Set([...touched, field]));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const finalized = finalizeFields(form, FIELD_ORDER);
    setForm(finalized);
    const errors = commit(finalized, new Set(FIELD_ORDER));
    const firstInvalid = FIELD_ORDER.find((field) => errors[field]);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
    }
  }

  function handleLoadExample() {
    setForm(EXAMPLE_FORM);
    commit(EXAMPLE_FORM, new Set());
  }

  const errorFor = (field: FormField) => (touched.has(field) ? state.errors[field] : undefined);
  const { calculation } = state;
  const lines = calculation?.lines ?? buildLedger(null, null);
  const verdict = calculation ? buildVerdict(calculation.input, calculation.result) : null;
  const comparisonPrice = calculation?.comparison?.price ?? null;
  const scenarios = calculation ? buildScenarios(calculation.input, comparisonPrice) : [];
  const sensitivity = calculation ? buildSensitivity(calculation.input) : [];
  const interpretation = calculation
    ? buildInterpretation({ input: calculation.input, result: calculation.result, comparison: calculation.comparison, scenarios, sensitivity })
    : null;
  const buildExport =
    calculation && interpretation
      ? () =>
          buildSimulationExport({
            input: calculation.input,
            result: calculation.result,
            perceivedBenefit: form.perceivedBenefit.trim(),
            comparison: calculation.comparison,
            scenarios,
            sensitivity,
            interpretation,
            generatedAt: new Date(),
          })
      : null;

  return (
    <div className={styles.page}>
      <a href="#conta-titulo" className={styles.skipLink}>
        Pular para a conta do mês
      </a>

      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1>Simulador de precificação SaaS</h1>
          <p className={styles.lede}>
            Informe custos, preço e clientes. A conta mostra se o resultado do mês cobre os custos e os tributos. Dados
            fictícios de simulação.
          </p>
        </div>
        <button type="button" className={styles.secondaryButton} onClick={handleLoadExample}>
          Carregar exemplo do enunciado
        </button>
      </header>

      <div className={styles.workspace}>
        <form className={styles.form} noValidate onSubmit={handleSubmit}>
          <fieldset className={styles.group}>
            <legend className={styles.legend}>Custos</legend>
            <Field
              id="fixedCost"
              label="Custo fixo mensal"
              prefix="R$"
              mask="money"
              placeholder="0,00"
              helper="Equipe, ferramentas e gastos que não mudam com o número de clientes."
              value={form.fixedCost}
              error={errorFor("fixedCost")}
              onChange={(value) => update("fixedCost", value)}
              onCommit={() => handleBlur("fixedCost")}
            />
            <Field
              id="variableCostPerCustomer"
              label="Custo variável por cliente"
              prefix="R$"
              mask="money"
              placeholder="0,00"
              helper="Infraestrutura e suporte de cada cliente, por mês."
              value={form.variableCostPerCustomer}
              error={errorFor("variableCostPerCustomer")}
              onChange={(value) => update("variableCostPerCustomer", value)}
              onCommit={() => handleBlur("variableCostPerCustomer")}
            />
          </fieldset>

          <fieldset className={styles.group}>
            <legend className={styles.legend}>Receita</legend>
            <Field
              id="price"
              label="Preço mensal"
              prefix="R$"
              mask="money"
              placeholder="0,00"
              helper="Valor cobrado de cada cliente, por mês."
              value={form.price}
              error={errorFor("price")}
              onChange={(value) => update("price", value)}
              onCommit={() => handleBlur("price")}
            />
            <Field
              id="customers"
              label="Clientes no mês"
              suffix="clientes"
              mask="integer"
              placeholder="0"
              helper="Previsão de clientes pagantes no mês."
              value={form.customers}
              error={errorFor("customers")}
              onChange={(value) => update("customers", value)}
              onCommit={() => handleBlur("customers")}
            />
          </fieldset>

          <fieldset className={styles.group}>
            <legend className={styles.legend}>Hipótese</legend>
            <Field
              id="taxRatePercent"
              label="Tributos sobre a receita"
              suffix="% ao mês"
              mask="percent"
              placeholder="0"
              helper="Taxa hipotética para a simulação. Não é alíquota legal."
              value={form.taxRatePercent}
              error={errorFor("taxRatePercent")}
              onChange={(value) => update("taxRatePercent", value)}
              onCommit={() => handleBlur("taxRatePercent")}
            />
            <TextAreaField
              id="perceivedBenefit"
              label="Benefício percebido pelo cliente"
              placeholder="O que o cliente ganha com o serviço"
              helper="Registro em texto; não entra na conta."
              value={form.perceivedBenefit}
              onChange={(value) => update("perceivedBenefit", value)}
            />
          </fieldset>

          <div className={styles.submitRow}>
            <button type="submit" className={styles.primaryButton}>
              Calcular
            </button>
            <p className={styles.hint}>A conta também atualiza quando você sai de um campo.</p>
          </div>
        </form>

        <div className={styles.ledgerColumn}>
          <Ledger lines={lines} verdict={verdict} changed={state.changed} version={state.version} />
        </div>
      </div>

      <section className={styles.section} aria-labelledby="comparar-titulo">
        <div className={styles.sectionHead}>
          <h2 id="comparar-titulo">Comparar preços</h2>
          <p className={styles.sectionLede}>O enunciado pede pelo menos dois preços. Informe o segundo para ver os dois lado a lado.</p>
        </div>
        <div className={styles.comparisonField}>
          <Field
            id="comparisonPrice"
            label="Segundo preço para comparar"
            prefix="R$"
            mask="money"
            placeholder="0,00"
            helper="Valor cobrado de cada cliente, por mês."
            value={form.comparisonPrice}
            error={errorFor("comparisonPrice")}
            onChange={(value) => update("comparisonPrice", value)}
            onCommit={() => handleBlur("comparisonPrice")}
          />
        </div>
        {calculation ? (
          <PriceComparison input={calculation.input} result={calculation.result} comparison={calculation.comparison} />
        ) : (
          <p className={styles.emptyNote}>A comparação aparece quando a conta do mês estiver calculada.</p>
        )}
      </section>

      <section className={styles.section} aria-labelledby="grafico-secao-titulo">
        <div className={styles.sectionHead}>
          <h2 id="grafico-secao-titulo">Resultado por quantidade de clientes</h2>
          <p className={styles.sectionLede}>Cada linha mostra o resultado do mês de um preço. Onde a linha cruza o zero está o equilíbrio.</p>
        </div>
        {calculation ? (
          <ResultChart input={calculation.input} comparisonPrice={calculation.comparison?.price ?? null} />
        ) : (
          <p className={styles.emptyNote}>O gráfico aparece quando a conta do mês estiver calculada.</p>
        )}
      </section>

      <section className={styles.section} aria-labelledby="cenarios-titulo">
        <div className={styles.sectionHead}>
          <h2 id="cenarios-titulo">Três cenários</h2>
          <p className={styles.sectionLede}>Pessimista, base e otimista para os dois preços, mudando só a quantidade de clientes.</p>
        </div>
        {calculation ? (
          <ScenarioTable scenarios={scenarios} informedPrice={calculation.input.price} comparisonPrice={comparisonPrice} />
        ) : (
          <p className={styles.emptyNote}>Os cenários aparecem quando a conta do mês estiver calculada.</p>
        )}
      </section>

      <section className={styles.section} aria-labelledby="sensibilidade-titulo">
        <div className={styles.sectionHead}>
          <h2 id="sensibilidade-titulo">Sensibilidade: uma entrada por vez</h2>
          <p className={styles.sectionLede}>Até onde cada premissa pode ir, sozinha, antes de o resultado do mês chegar a zero.</p>
        </div>
        {calculation ? (
          <SensitivityTable limits={sensitivity} />
        ) : (
          <p className={styles.emptyNote}>A sensibilidade aparece quando a conta do mês estiver calculada.</p>
        )}
      </section>

      <section className={styles.section} aria-labelledby="interpretacao-titulo">
        <div className={styles.sectionHead}>
          <h2 id="interpretacao-titulo">O que os números dizem</h2>
        </div>
        {interpretation ? (
          <InterpretationPanel interpretation={interpretation} />
        ) : (
          <p className={styles.emptyNote}>A interpretação aparece quando a conta do mês estiver calculada.</p>
        )}
      </section>

      <section className={styles.section} aria-labelledby="exportar-titulo">
        <div className={styles.sectionHead}>
          <h2 id="exportar-titulo">Exportar a simulação</h2>
        </div>
        <ExportActions buildData={buildExport} />
      </section>
    </div>
  );
}

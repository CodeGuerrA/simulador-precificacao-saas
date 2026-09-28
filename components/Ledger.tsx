"use client";

import { useState, type CSSProperties } from "react";
import type { LedgerKey, LedgerLine } from "@/lib/ledger";
import type { Verdict } from "@/lib/verdict";
import { Term } from "./Term";
import styles from "./Ledger.module.css";

const OPERATOR_SPOKEN: Record<string, string> = { "−": "menos", "=": "igual a" };
const SUM_KEYS: LedgerKey[] = ["revenue", "fixedCost", "variableCost", "taxes", "operatingResult"];
/** A linha do resultado recebe a passada logo depois das linhas que a causaram. */
const RESULT_DELAY_MS = 60;

type LedgerProps = {
  lines: LedgerLine[];
  verdict: Verdict | null;
  changed: ReadonlySet<LedgerKey>;
  version: number;
};

function Marked({ changed, version, answer, delayMs, text }: {
  changed: boolean;
  version: number;
  answer?: boolean;
  delayMs?: number;
  text: string;
}) {
  const className = [styles.mark, answer ? styles.answer : "", changed ? styles.flash : ""].join(" ");
  const style = delayMs ? ({ "--flash-delay": `${delayMs}ms` } as CSSProperties) : undefined;
  // A chave muda a cada cálculo com alteração, o que reinicia a animação da linha.
  // data-text alimenta a cópia em tinta que aparece só sob o marca-texto (::after).
  return (
    <span key={changed ? `v${version}` : "static"} className={className} style={style} data-text={text}>
      {text}
    </span>
  );
}

export function Ledger({ lines, verdict, changed, version }: LedgerProps) {
  const [showWork, setShowWork] = useState(true);
  const hasValues = lines.some((line) => line.display !== null);
  const sumLines = lines.filter((line) => SUM_KEYS.includes(line.key));
  const indicatorLines = lines.filter((line) => !SUM_KEYS.includes(line.key));

  return (
    <section className={styles.panel} aria-labelledby="conta-titulo">
      <div className={styles.header}>
        <h2 id="conta-titulo" className={styles.title}>
          Conta do mês
        </h2>
        {hasValues && (
          <button type="button" className={styles.toggle} aria-pressed={showWork} onClick={() => setShowWork((current) => !current)}>
            {showWork ? "Ocultar as contas" : "Mostrar as contas"}
          </button>
        )}
      </div>

      <p className={styles.verdict} data-tone={verdict?.tone ?? "empty"} aria-live="polite">
        {verdict ? verdict.text : "Preencha os campos ou carregue o exemplo do enunciado para ver a conta."}
      </p>

      <table className={styles.sum}>
        <caption className={styles.srOnly}>Conta armada do resultado do mês</caption>
        <tbody>
          {sumLines.map((line) => {
            const isResult = line.key === "operatingResult";
            return (
              <tr key={line.key} className={isResult ? styles.totalRow : undefined}>
                <td className={styles.operator}>
                  <span aria-hidden="true">{line.operator}</span>
                  {line.operator && <span className={styles.srOnly}>{OPERATOR_SPOKEN[line.operator]}</span>}
                </td>
                <td className={styles.value}>
                  {line.display === null ? (
                    <span className={styles.placeholder}>R$ —</span>
                  ) : (
                    <Marked
                      changed={changed.has(line.key)}
                      version={version}
                      answer={isResult}
                      delayMs={isResult ? RESULT_DELAY_MS : undefined}
                      text={line.display}
                    />
                  )}
                </td>
                <td>
                  <div className={styles.description}>
                    <Term label={line.label} definition={line.definition} />
                    {showWork && line.work && <span className={styles.work}>{line.work}</span>}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <dl className={styles.indicators}>
        {indicatorLines.map((line) => (
          <div key={line.key} className={styles.indicator}>
            <dt>
              <Term label={line.label} definition={line.definition} />
            </dt>
            <dd className={styles.indicatorValue}>
              {line.display === null ? (
                <span className={styles.placeholder}>—</span>
              ) : (
                <Marked changed={changed.has(line.key)} version={version} answer={line.key === "breakEven"} text={line.display} />
              )}
            </dd>
            {showWork && line.work && <dd className={styles.work}>{line.work}</dd>}
          </div>
        ))}
      </dl>
    </section>
  );
}

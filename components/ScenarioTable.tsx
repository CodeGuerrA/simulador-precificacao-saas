import { formatCurrency, formatInteger } from "@/lib/format";
import type { ScenarioResult } from "@/lib/scenarios";
import styles from "./DataTable.module.css";

function changeLabel(percent: number): string {
  if (percent === 0) return "clientes informados";
  return `${percent > 0 ? "+" : "−"}${Math.abs(percent)}% de clientes`;
}

export function ScenarioTable({ scenarios, informedPrice, comparisonPrice }: {
  scenarios: ScenarioResult[];
  informedPrice: number;
  comparisonPrice: number | null;
}) {
  return (
    <table className={styles.table}>
      <caption className={styles.caption}>Premissa da equipe: só a quantidade de clientes varia; custos, taxa e preços ficam como informados.</caption>
      <thead>
        <tr>
          <th scope="col" className={styles.indicatorHead}>
            Cenário
          </th>
          <th scope="col">Clientes</th>
          <th scope="col">
            <span className={styles.swatchInformed} aria-hidden="true" />
            Resultado a {formatCurrency(informedPrice)}
          </th>
          {comparisonPrice !== null && (
            <th scope="col">
              <span className={styles.swatchComparison} aria-hidden="true" />
              Resultado a {formatCurrency(comparisonPrice)}
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {scenarios.map((scenario) => (
          <tr key={scenario.id} className={scenario.id === "base" ? styles.resultRow : undefined}>
            <th scope="row">
              {scenario.label} <span className={styles.note}>({changeLabel(scenario.customersChangePercent)})</span>
            </th>
            <td>{formatInteger(scenario.customers)}</td>
            <td>{formatCurrency(scenario.informed.operatingResult)}</td>
            {scenario.comparison && <td>{formatCurrency(scenario.comparison.operatingResult)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

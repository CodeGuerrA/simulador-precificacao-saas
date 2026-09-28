import { formatCurrency, formatInteger, formatPercent, formatTaxRate } from "@/lib/format";
import { mostSensitive, type SensitivityKey, type SensitivityLimit } from "@/lib/sensitivity";
import styles from "./DataTable.module.css";

function formatValue(key: SensitivityKey, value: number): string {
  if (key === "customers") return `${formatInteger(value)} clientes`;
  if (key === "taxRate") return formatTaxRate(value);
  return formatCurrency(value);
}

function formatChange(change: number | null): string {
  if (change === null) return "Não se aplica";
  return `${change < 0 ? "−" : "+"}${formatPercent(Math.abs(change))}`;
}

export function SensitivityTable({ limits }: { limits: SensitivityLimit[] }) {
  const tightest = mostSensitive(limits);

  return (
    <table className={styles.table}>
      <caption className={styles.caption}>
        Cada linha muda só uma entrada, mantendo as outras como informadas, até o resultado do mês chegar a zero.
      </caption>
      <thead>
        <tr>
          <th scope="col" className={styles.indicatorHead}>
            Premissa
          </th>
          <th scope="col">Informado</th>
          <th scope="col">Limite que zera o resultado</th>
          <th scope="col">Folga</th>
        </tr>
      </thead>
      <tbody>
        {limits.map((item) => {
          const isTightest = tightest?.key === item.key;
          return (
            <tr key={item.key} className={isTightest ? styles.resultRow : undefined}>
              <th scope="row">
                {item.label}
                {isTightest && <span className={styles.note}> (menor folga)</span>}
              </th>
              <td>{formatValue(item.key, item.current)}</td>
              <td>
                {item.limit === null ? (
                  <span className={styles.note}>Não existe</span>
                ) : (
                  <>
                    {item.direction === "min" ? "no mínimo " : "no máximo "}
                    {formatValue(item.key, item.limit)}
                  </>
                )}
              </td>
              <td>{formatChange(item.changePercent)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

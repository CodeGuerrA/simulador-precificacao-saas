import { buildLedger, type LedgerKey } from "@/lib/ledger";
import { formatCurrency } from "@/lib/format";
import type { PricingInput, PricingResult } from "@/lib/pricing";
import styles from "./DataTable.module.css";

const COMPARED_KEYS: LedgerKey[] = ["revenue", "taxes", "operatingResult", "margin", "unitContribution", "breakEven"];

type PriceComparisonProps = {
  input: PricingInput;
  result: PricingResult;
  comparison: { price: number; result: PricingResult } | null;
};

export function PriceComparison({ input, result, comparison }: PriceComparisonProps) {
  const informedLines = buildLedger(input, result);
  const comparisonLines = comparison ? buildLedger({ ...input, price: comparison.price }, comparison.result) : null;

  return (
    <table className={styles.table}>
      <caption className={styles.caption}>
        Mesmos custos, clientes e taxa; muda só o preço.
      </caption>
      <thead>
        <tr>
          <th scope="col" className={styles.indicatorHead}>
            Indicador
          </th>
          <th scope="col">
            <span className={styles.swatchInformed} aria-hidden="true" />
            {formatCurrency(input.price)} <span className={styles.note}>(informado)</span>
          </th>
          <th scope="col">
            {comparison ? (
              <>
                <span className={styles.swatchComparison} aria-hidden="true" />
                {formatCurrency(comparison.price)} <span className={styles.note}>(comparação)</span>
              </>
            ) : (
              <span className={styles.note}>Segundo preço</span>
            )}
          </th>
        </tr>
      </thead>
      <tbody>
        {COMPARED_KEYS.map((key) => {
          const informed = informedLines.find((line) => line.key === key)!;
          const compared = comparisonLines?.find((line) => line.key === key);
          return (
            <tr key={key} className={key === "operatingResult" ? styles.resultRow : undefined}>
              <th scope="row">{informed.label}</th>
              <td>{informed.display}</td>
              <td>{compared ? compared.display : <span className={styles.note}>Informe um segundo preço</span>}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

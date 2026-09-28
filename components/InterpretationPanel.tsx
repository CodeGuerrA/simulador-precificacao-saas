import type { Interpretation } from "@/lib/interpretation";
import styles from "./InterpretationPanel.module.css";

export function InterpretationPanel({ interpretation }: { interpretation: Interpretation }) {
  return (
    <div className={styles.panel}>
      <p className={styles.criterion}>{interpretation.criterion}</p>
      <ol className={styles.statements}>
        {interpretation.statements.map((statement) => (
          <li key={statement}>{statement}</li>
        ))}
      </ol>
      <div className={styles.caveats}>
        <h3 className={styles.caveatsTitle}>Ressalvas</h3>
        <ul>
          {interpretation.caveats.map((caveat) => (
            <li key={caveat}>{caveat}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

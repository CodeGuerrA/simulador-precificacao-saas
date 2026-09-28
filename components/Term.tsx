"use client";

import { useId, useState } from "react";
import styles from "./Term.module.css";

/** Termo com sublinhado pontilhado que abre a definição logo abaixo (sem modal nem balão flutuante). */
export function Term({ label, definition }: { label: string; definition: string }) {
  const [open, setOpen] = useState(false);
  const definitionId = useId();

  return (
    <span className={styles.term}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={definitionId}
        onClick={() => setOpen((current) => !current)}
      >
        {label}
      </button>
      <span id={definitionId} className={styles.definition} hidden={!open}>
        {definition}
      </span>
    </span>
  );
}

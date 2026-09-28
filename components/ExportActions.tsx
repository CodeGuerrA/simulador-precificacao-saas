"use client";

import { toCsv, toJson, type SimulationExport } from "@/lib/export";
import styles from "./ExportActions.module.css";

const FILE_NAME = "simulacao-precificacao-saas";

function download(content: string, fileName: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

/** Recebe uma função para que a data de geração seja lida no clique, não durante a renderização. */
export function ExportActions({ buildData }: { buildData: (() => SimulationExport) | null }) {
  const disabled = buildData === null;

  return (
    <div className={styles.actions}>
      <button
        type="button"
        className={styles.button}
        disabled={disabled}
        aria-describedby="exportar-ajuda"
        // O BOM faz o Excel reconhecer os acentos do CSV.
        onClick={() => buildData && download(`﻿${toCsv(buildData())}`, `${FILE_NAME}.csv`, "text/csv;charset=utf-8")}
      >
        Exportar CSV
      </button>
      <button
        type="button"
        className={styles.button}
        disabled={disabled}
        aria-describedby="exportar-ajuda"
        onClick={() => buildData && download(toJson(buildData()), `${FILE_NAME}.json`, "application/json")}
      >
        Exportar JSON
      </button>
      <p id="exportar-ajuda" className={styles.help}>
        {disabled
          ? "Calcule primeiro: o arquivo leva entradas, premissas e saídas."
          : "O arquivo leva entradas, premissas e saídas, com os valores sem arredondar."}
      </p>
    </div>
  );
}

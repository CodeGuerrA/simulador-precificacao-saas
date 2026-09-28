"use client";

import { useEffect, useRef, useState } from "react";
import { niceTicks } from "@/lib/chart";
import { formatCompactCurrency, formatCurrency, formatInteger } from "@/lib/format";
import { calculatePricing, type PricingInput } from "@/lib/pricing";
import styles from "./ResultChart.module.css";

type Series = { id: "informed" | "comparison"; price: number; className: string };

/** Largura inicial (servidor e primeira pintura); depois o gráfico usa a largura real do espaço. */
const DEFAULT_WIDTH = 720;
const NARROW_WIDTH = 520;

/** Mede a largura disponível para desenhar o SVG em pixels reais (13px continuam sendo 13px no celular). */
function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return { ref, width };
}

function resultAt(input: PricingInput, price: number, customers: number): number {
  return calculatePricing({ ...input, price, customers }).operatingResult;
}

function breakEvenOf(input: PricingInput, price: number): number | null {
  const breakEven = calculatePricing({ ...input, price }).breakEven;
  return breakEven.kind === "customers" ? breakEven.customers : null;
}

export function ResultChart({ input, comparisonPrice }: { input: PricingInput; comparisonPrice: number | null }) {
  const { ref, width } = useContainerWidth();
  const narrow = width < NARROW_WIDTH;
  const height = narrow ? 280 : Math.min(360, Math.max(300, Math.round(width * 0.42)));
  const margin = narrow ? { top: 28, right: 76, bottom: 52, left: 64 } : { top: 28, right: 104, bottom: 56, left: 84 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const series: Series[] = [{ id: "informed", price: input.price, className: styles.lineInformed }];
  if (comparisonPrice !== null) {
    series.push({ id: "comparison", price: comparisonPrice, className: styles.lineComparison });
  }

  const breakEvens = series.map((item) => breakEvenOf(input, item.price));
  const xCandidates = [input.customers * 1.5, 10, ...breakEvens.filter((value): value is number => value !== null).map((value) => value * 1.25)];
  const xTicks = niceTicks(0, Math.max(...xCandidates), narrow ? 4 : 6);
  const xMax = xTicks[xTicks.length - 1];

  const yValues = series.flatMap((item) => [resultAt(input, item.price, 0), resultAt(input, item.price, xMax)]);
  const yTicks = niceTicks(Math.min(0, ...yValues), Math.max(0, ...yValues), narrow ? 4 : 5);
  const yMin = yTicks[0];
  const yMax = yTicks[yTicks.length - 1];

  const x = (customers: number) => margin.left + (customers / xMax) * plotWidth;
  const y = (value: number) => margin.top + ((yMax - value) / (yMax - yMin || 1)) * plotHeight;

  const endLabels = series.map((item) => ({ ...item, endY: y(resultAt(input, item.price, xMax)) }));
  if (endLabels.length === 2 && Math.abs(endLabels[0].endY - endLabels[1].endY) < 18) {
    const direction = endLabels[0].endY <= endLabels[1].endY ? -1 : 1;
    endLabels[0].endY += direction * 9;
    endLabels[1].endY -= direction * 9;
  }

  const summary = series
    .map((item, index) => {
      const breakEven = breakEvens[index];
      return `Com preço de ${formatCurrency(item.price)}, o resultado ${
        breakEven === null ? "não chega a zero aumentando clientes" : `passa a ser positivo a partir de ${formatInteger(breakEven)} clientes`
      }.`;
    })
    .join(" ");

  const tableCustomers = [...new Set([0, input.customers, ...breakEvens.filter((value): value is number => value !== null), xMax])].sort(
    (a, b) => a - b,
  );

  return (
    <figure className={styles.figure}>
      <div ref={ref} className={styles.canvas}>
      <svg
        className={styles.svg}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-labelledby="grafico-titulo grafico-descricao"
      >
        <title id="grafico-titulo">Resultado do mês por quantidade de clientes</title>
        <desc id="grafico-descricao">{summary}</desc>

        {yTicks.map((tick) => (
          <g key={`y${tick}`}>
            <line className={tick === 0 ? styles.zeroLine : styles.gridLine} x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} />
            <text className={styles.axisLabel} x={margin.left - 12} y={y(tick)} textAnchor="end" dominantBaseline="middle">
              {formatCompactCurrency(tick)}
            </text>
          </g>
        ))}

        {xTicks.map((tick) => (
          <text key={`x${tick}`} className={styles.axisLabel} x={x(tick)} y={height - margin.bottom + 22} textAnchor="middle">
            {formatInteger(tick)}
          </text>
        ))}

        <text className={styles.axisTitle} x={margin.left + plotWidth / 2} y={height - 8} textAnchor="middle">
          Clientes no mês
        </text>
        <text className={styles.axisTitle} x={margin.left} y={14} textAnchor="start">
          Resultado do mês
        </text>

        <line className={styles.informedMarker} x1={x(input.customers)} x2={x(input.customers)} y1={margin.top} y2={height - margin.bottom} />
        {/* Na metade direita, o rótulo vai para a esquerda da linha para não colidir com os rótulos das séries. */}
        <text
          className={styles.markerLabel}
          x={x(input.customers) + (x(input.customers) > margin.left + plotWidth / 2 ? -6 : 6)}
          y={margin.top + 12}
          textAnchor={x(input.customers) > margin.left + plotWidth / 2 ? "end" : "start"}
        >
          {formatInteger(input.customers)} informados
        </text>

        {series.map((item) => (
          <line
            key={item.id}
            className={item.className}
            x1={x(0)}
            y1={y(resultAt(input, item.price, 0))}
            x2={x(xMax)}
            y2={y(resultAt(input, item.price, xMax))}
          />
        ))}

        {series.map((item, index) => {
          const breakEven = breakEvens[index];
          if (breakEven === null || breakEven > xMax) return null;
          return (
            <g key={`be-${item.id}`}>
              <circle className={styles.breakEvenDot} cx={x(breakEven)} cy={y(0)} r={6} />
              <text
                className={styles.breakEvenLabel}
                x={x(breakEven)}
                y={y(0) + (index === 0 ? -14 : 24)}
                textAnchor="middle"
              >
                {formatInteger(breakEven)}
              </text>
            </g>
          );
        })}

        {endLabels.map((item) => (
          <text key={`end-${item.id}`} className={`${styles.endLabel} ${item.id === "comparison" ? styles.endLabelComparison : ""}`} x={width - margin.right + 10} y={item.endY} dominantBaseline="middle">
            {formatCurrency(item.price)}
          </text>
        ))}
      </svg>
      </div>

      <figcaption className={styles.caption}>{summary} O ponto amarelo marca onde cada linha cruza o zero.</figcaption>

      <details className={styles.details}>
        <summary>Ver os valores do gráfico</summary>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Clientes</th>
              {series.map((item) => (
                <th key={item.id} scope="col">
                  Resultado a {formatCurrency(item.price)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableCustomers.map((customers) => (
              <tr key={customers}>
                <th scope="row">{formatInteger(customers)}</th>
                {series.map((item) => (
                  <td key={item.id}>{formatCurrency(resultAt(input, item.price, customers))}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

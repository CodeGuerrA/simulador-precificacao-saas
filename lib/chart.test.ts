import { describe, expect, it } from "vitest";
import { niceTicks } from "./chart";

describe("marcações do gráfico", () => {
  it("clientes de 0 a 150 em passos redondos", () => {
    expect(niceTicks(0, 150, 6)).toEqual([0, 20, 40, 60, 80, 100, 120, 140, 160]);
  });

  it("resultado de −3.000 a 3.000 inclui o zero", () => {
    const ticks = niceTicks(-3000, 3000, 5);
    expect(ticks).toContain(0);
    expect(ticks[0]).toBeLessThanOrEqual(-3000);
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(3000);
  });

  it("intervalo vazio não quebra", () => {
    expect(niceTicks(0, 0, 5)).toEqual([0]);
  });
});

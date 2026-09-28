/** Escala do gráfico: marcações em números redondos (1, 2 ou 5 vezes uma potência de 10). */

export function niceStep(range: number, targetCount: number): number {
  if (range <= 0) return 1;
  const raw = range / targetCount;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const normalized = raw / magnitude;
  const factor = normalized < 1.5 ? 1 : normalized < 3 ? 2 : normalized < 7 ? 5 : 10;
  return factor * magnitude;
}

export function niceTicks(min: number, max: number, targetCount: number): number[] {
  const step = niceStep(max - min, targetCount);
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let value = start; value <= end + step / 2; value += step) {
    ticks.push(Number(value.toFixed(10)));
  }
  return ticks;
}

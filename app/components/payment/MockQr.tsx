// A QR-looking pattern derived from the booking ID. Not scannable: the real one comes from the payment gateway.
const SIZE = 25;

function seeded(text: string) {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const inFinder = (x: number, y: number) =>
  [
    [0, 0],
    [SIZE - 7, 0],
    [0, SIZE - 7],
  ].some(([fx, fy]) => x >= fx - 1 && x <= fx + 7 && y >= fy - 1 && y <= fy + 7);

export default function MockQr({ value }: { value: string }) {
  const random = seeded(value);
  const cells: [number, number][] = [];
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) if (!inFinder(x, y) && random() < 0.5) cells.push([x, y]);

  return (
    <svg viewBox={`-2 -2 ${SIZE + 4} ${SIZE + 4}`} role="img" aria-label="Contoh kode QRIS" className="size-full">
      <rect x="-2" y="-2" width={SIZE + 4} height={SIZE + 4} fill="#fff" />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#0f172a" />
      ))}
      {[
        [0, 0],
        [SIZE - 7, 0],
        [0, SIZE - 7],
      ].map(([fx, fy]) => (
        <g key={`${fx}-${fy}`}>
          <rect x={fx} y={fy} width="7" height="7" fill="#0f172a" />
          <rect x={fx + 1} y={fy + 1} width="5" height="5" fill="#fff" />
          <rect x={fx + 2} y={fy + 2} width="3" height="3" fill="#0f172a" />
        </g>
      ))}
    </svg>
  );
}

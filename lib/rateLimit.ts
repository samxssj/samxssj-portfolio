/**
 * Rate limiter en memoria con ventana deslizante.
 *
 * Por qué en memoria: el form es de bajo tráfico y en Vercel (Fluid compute) las
 * instancias se reutilizan, así que frena el abuso realista sin depender de un
 * Redis externo. No es un límite global estricto: cada instancia lleva su cuenta.
 */

export type RateLimitResult = { allowed: boolean; retryAfterMs: number };

type RateLimiterOptions = {
  max: number;
  windowMs: number;
  /** tope de claves en memoria para que un barrido de IPs no la haga crecer sin fin */
  maxKeys?: number;
  now?: () => number;
};

const DEFAULT_MAX_KEYS = 5_000;

export function createRateLimiter({
  max,
  windowMs,
  maxKeys = DEFAULT_MAX_KEYS,
  now = Date.now,
}: RateLimiterOptions) {
  const hits = new Map<string, number[]>();

  function activeHits(key: string, at: number): number[] {
    const fresh = (hits.get(key) ?? []).filter((t) => t > at - windowMs);
    if (fresh.length) hits.set(key, fresh);
    else hits.delete(key);
    return fresh;
  }

  function evaluate(fresh: number[], at: number): RateLimitResult {
    if (fresh.length < max) return { allowed: true, retryAfterMs: 0 };
    return { allowed: false, retryAfterMs: fresh[0] + windowMs - at };
  }

  function makeRoom(at: number) {
    for (const key of [...hits.keys()]) activeHits(key, at);
    // si siguen sin caber, se descarta la clave más antigua (orden de inserción del Map)
    while (hits.size >= maxKeys) hits.delete(hits.keys().next().value as string);
  }

  return {
    /** Consulta sin registrar intento. */
    peek(key: string): RateLimitResult {
      const at = now();
      return evaluate(activeHits(key, at), at);
    },
    /** Registra el intento si hay cupo; un intento bloqueado no consume cupo. */
    consume(key: string): RateLimitResult {
      const at = now();
      const fresh = activeHits(key, at);
      const result = evaluate(fresh, at);
      if (!result.allowed) return result;
      if (!hits.has(key) && hits.size >= maxKeys) makeRoom(at);
      hits.set(key, [...fresh, at]);
      return result;
    },
    size: () => hits.size,
  };
}

/**
 * IP del cliente. En Vercel `x-real-ip` y `x-forwarded-for` los fija el edge
 * (no los controla el cliente); fuera de Vercel son orientativos.
 */
export function clientIpFrom(headers: Headers): string {
  const realIp = headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || 'unknown';
}

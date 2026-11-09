import { describe, it, expect } from 'vitest';
import { createRateLimiter, clientIpFrom } from '@/lib/rateLimit';

function fakeClock(start = 0) {
  let t = start;
  return { now: () => t, advance: (ms: number) => (t += ms) };
}

describe('createRateLimiter', () => {
  it('permite hasta el máximo dentro de la ventana y bloquea el siguiente', () => {
    const clock = fakeClock();
    const limiter = createRateLimiter({ max: 3, windowMs: 1000, now: clock.now });
    expect(limiter.consume('a').allowed).toBe(true);
    expect(limiter.consume('a').allowed).toBe(true);
    expect(limiter.consume('a').allowed).toBe(true);
    const blocked = limiter.consume('a');
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBe(1000);
  });

  it('las claves son independientes', () => {
    const limiter = createRateLimiter({ max: 1, windowMs: 1000, now: fakeClock().now });
    expect(limiter.consume('a').allowed).toBe(true);
    expect(limiter.consume('b').allowed).toBe(true);
    expect(limiter.consume('a').allowed).toBe(false);
  });

  it('la ventana es deslizante: libera cupo cuando caduca el intento más antiguo', () => {
    const clock = fakeClock();
    const limiter = createRateLimiter({ max: 2, windowMs: 1000, now: clock.now });
    limiter.consume('a');
    clock.advance(600);
    limiter.consume('a');
    clock.advance(300);
    const blocked = limiter.consume('a');
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBe(100);
    clock.advance(100);
    expect(limiter.consume('a').allowed).toBe(true);
  });

  it('un intento bloqueado no consume cupo', () => {
    const clock = fakeClock();
    const limiter = createRateLimiter({ max: 1, windowMs: 1000, now: clock.now });
    limiter.consume('a');
    clock.advance(500);
    limiter.consume('a');
    clock.advance(500);
    expect(limiter.consume('a').allowed).toBe(true);
  });

  it('peek consulta sin consumir', () => {
    const limiter = createRateLimiter({ max: 1, windowMs: 1000, now: fakeClock().now });
    expect(limiter.peek('a').allowed).toBe(true);
    expect(limiter.peek('a').allowed).toBe(true);
    limiter.consume('a');
    expect(limiter.peek('a').allowed).toBe(false);
  });

  it('no crece sin límite: purga claves caducadas al superar maxKeys', () => {
    const clock = fakeClock();
    const limiter = createRateLimiter({ max: 1, windowMs: 1000, now: clock.now, maxKeys: 2 });
    limiter.consume('a');
    limiter.consume('b');
    clock.advance(1000);
    limiter.consume('c');
    expect(limiter.size()).toBe(1);
  });
});

describe('clientIpFrom', () => {
  it('prioriza x-real-ip', () => {
    const h = new Headers({ 'x-real-ip': '1.1.1.1', 'x-forwarded-for': '2.2.2.2' });
    expect(clientIpFrom(h)).toBe('1.1.1.1');
  });

  it('usa la primera IP de x-forwarded-for', () => {
    const h = new Headers({ 'x-forwarded-for': '2.2.2.2, 10.0.0.1' });
    expect(clientIpFrom(h)).toBe('2.2.2.2');
  });

  it('devuelve "unknown" sin cabeceras', () => {
    expect(clientIpFrom(new Headers())).toBe('unknown');
  });
});

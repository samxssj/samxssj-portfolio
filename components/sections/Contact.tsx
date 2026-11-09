'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { submitContact, type ContactState } from '@/lib/actions/contact';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { CONTACT_EMAIL } from '@/content/profile';


const initialState: ContactState = { status: 'idle' };

export function Contact() {
  const t = useTranslations('contact');
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  const fieldError = (field: string) =>
    state.status === 'error' && state.fieldErrors?.[field] ? (
      <p role="alert" className="mt-1 text-xs font-semibold text-error">
        {t(`validation.${field}`)}
      </p>
    ) : null;

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading>{t('title')}</SectionHeading>
      <p className="mt-4 text-muted">{t('subtitle')}</p>

      <Reveal>
      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_auto]">
        <form action={formAction} className="max-w-xl space-y-5" noValidate>
          <div>
            <label htmlFor="name" className="text-sm font-semibold">
              {t('name')}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder={t('namePlaceholder')}
              className="mt-1 w-full rounded-xl border border-border-soft bg-surface px-4 py-3 text-sm placeholder:text-muted/60 focus:border-accent"
            />
            {fieldError('name')}
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-semibold">
              {t('email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              className="mt-1 w-full rounded-xl border border-border-soft bg-surface px-4 py-3 text-sm placeholder:text-muted/60 focus:border-accent"
            />
            {fieldError('email')}
          </div>

          <div>
            <label htmlFor="message" className="text-sm font-semibold">
              {t('message')}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder={t('messagePlaceholder')}
              className="mt-1 w-full rounded-xl border border-border-soft bg-surface px-4 py-3 text-sm placeholder:text-muted/60 focus:border-accent"
            />
            {fieldError('message')}
          </div>

          {/* honeypot: oculto para humanos, irresistible para bots */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-accent px-6 py-3 text-sm font-extrabold text-white transition-transform duration-150 ease-out hover:brightness-110 active:scale-[0.97] disabled:opacity-60"
          >
            {pending ? t('sending') : t('send')}
          </button>

          <div aria-live="polite">
            {state.status === 'success' && (
              <p className="text-sm font-semibold text-ok">{t('success')}</p>
            )}
            {state.status === 'error' && !state.fieldErrors && (
              <p className="text-sm font-semibold text-error">
                {t('error', { email: CONTACT_EMAIL })}
              </p>
            )}
          </div>
        </form>

        <aside className="space-y-3 text-sm">
          <a
            href="https://github.com/samxssj"
            target="_blank"
            rel="noopener noreferrer"
            className="block font-semibold text-muted transition-colors duration-150 ease-out hover:text-text"
          >
            GitHub ↗
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="block font-semibold text-muted transition-colors duration-150 ease-out hover:text-text"
          >
            {CONTACT_EMAIL}
          </a>
        </aside>
      </div>
      </Reveal>
    </section>
  );
}

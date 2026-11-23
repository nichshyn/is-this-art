"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, Check, Loader2, Lock, Mail, User } from "lucide-react";
import { useActionState } from "react";

import {
  forgotAction,
  loginAction,
  resetAction,
  signupAction,
  type FormState,
} from "@/app/actions/auth";
import { buttonClasses } from "@/components/ui/button";

const initialState: FormState = {};

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-2.5 text-[12px] leading-relaxed text-red-600 dark:text-red-400"
      role="alert"
    >
      <AlertCircle size={14} className="mt-0.5 shrink-0" />
      {message}
    </p>
  );
}

function Submit({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={buttonClasses({ size: "lg", className: "w-full" })}
    >
      {pending ? <Loader2 size={16} className="animate-spin" /> : null}
      {pending ? "Один момент…" : children}
    </button>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[12px] font-medium">
      {children}
    </label>
  );
}

export function LoginForm({ next = "/play" }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, initialState);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <Label htmlFor="email">Электронная почта</Label>
        <div className="relative">
          <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="field pl-10"
          />
        </div>
      </div>
      <div>
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <Label htmlFor="password">Пароль</Label>
          <Link href="/forgot-password" className="text-[11px] text-muted hover:text-ink">
            Забыли пароль?
          </Link>
        </div>
        <div className="relative">
          <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Ваш пароль"
            className="field pl-10"
          />
        </div>
      </div>
      <ErrorMessage message={state.error} />
      <Submit pending={pending}>Войти</Submit>
      <div className="rounded-xl border border-line bg-subtle/60 px-3.5 py-2.5 text-[11px] leading-relaxed text-muted">
        <span className="font-medium text-ink">Демо-аккаунт:</span>{" "}
        demo@isart.local · demo1234
      </div>
    </form>
  );
}

export function SignupForm() {
  const [state, action, pending] = useActionState(signupAction, initialState);
  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="username">Имя пользователя</Label>
        <div className="relative">
          <User size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="username"
            name="username"
            autoComplete="username"
            required
            minLength={3}
            maxLength={24}
            pattern="[A-Za-z0-9_]+"
            placeholder="Как вас будут называть в зале"
            className="field pl-10"
          />
        </div>
        <p className="mt-1.5 text-[10.5px] text-muted">
          От 3 до 24 символов. Буквы, цифры и подчёркивания.
        </p>
      </div>
      <div>
        <Label htmlFor="email">Электронная почта</Label>
        <div className="relative">
          <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="field pl-10"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="password">Пароль</Label>
        <div className="relative">
          <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="Не менее 8 символов"
            className="field pl-10"
          />
        </div>
      </div>
      <ErrorMessage message={state.error} />
      <Submit pending={pending}>
        Создать аккаунт <ArrowRight size={15} />
      </Submit>
      <p className="text-[10.5px] leading-relaxed text-muted">
        Создавая аккаунт, вы соглашаетесь с{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
          политикой конфиденциальности и условиями
        </Link>
        . Вы можете удалить аккаунт в любой момент.
      </p>
    </form>
  );
}

export function ForgotForm() {
  const [state, action, pending] = useActionState(forgotAction, initialState);
  if (state.success) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-2xl border border-line bg-subtle/60 p-4">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink">
            <Check size={15} />
          </span>
          <div>
            <p className="text-[13px] font-medium">Проверьте почту</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">{state.success}</p>
          </div>
        </div>
        {state.devLink && (
          <div className="rounded-xl border border-dashed border-line p-3.5 text-[11.5px] leading-relaxed text-muted">
            <p className="font-medium text-ink">Режим разработки</p>
            <p className="mt-1">Локально письма не отправляются. Для сброса используйте эту ссылку:</p>
            <Link
              href={state.devLink}
              className="mt-2 inline-block break-all text-ink underline underline-offset-2"
            >
              {state.devLink}
            </Link>
          </div>
        )}
        <Link href="/login" className={buttonClasses({ variant: "secondary", size: "lg", className: "w-full" })}>
          Вернуться ко входу
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="email">Электронная почта</Label>
        <div className="relative">
          <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="field pl-10"
          />
        </div>
      </div>
      <ErrorMessage message={state.error} />
      <Submit pending={pending}>Отправить ссылку для сброса</Submit>
    </form>
  );
}

export function ResetForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetAction, initialState);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <Label htmlFor="password">Новый пароль</Label>
        <div className="relative">
          <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="Не менее 8 символов"
            className="field pl-10"
          />
        </div>
      </div>
      <ErrorMessage message={state.error} />
      <Submit pending={pending}>Установить новый пароль</Submit>
    </form>
  );
}

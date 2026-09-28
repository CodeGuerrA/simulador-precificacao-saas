"use client";

import { useLayoutEffect, useRef } from "react";
import { applyTypingMask, type InputMask } from "@/lib/inputMask";
import { AlertIcon } from "./AlertIcon";
import styles from "./Field.module.css";

type FieldProps = {
  id: string;
  label: string;
  value: string;
  helper: string;
  placeholder: string;
  prefix?: string;
  suffix?: string;
  error?: string;
  /** Formata enquanto digita: "10000" aparece como "10.000". */
  mask: InputMask;
  onChange: (value: string) => void;
  onCommit: () => void;
};

type TextAreaFieldProps = {
  id: string;
  label: string;
  value: string;
  helper: string;
  placeholder: string;
  onChange: (value: string) => void;
};

export function TextAreaField({ id, label, value, helper, placeholder, onChange }: TextAreaFieldProps) {
  const helperId = `${id}-ajuda`;
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        className={styles.textarea}
        rows={2}
        value={value}
        placeholder={placeholder}
        aria-describedby={helperId}
        onChange={(event) => onChange(event.target.value)}
      />
      <p id={helperId} className={styles.helper}>
        {helper}
      </p>
    </div>
  );
}

export function Field({ id, label, value, helper, placeholder, prefix, suffix, error, mask, onChange, onCommit }: FieldProps) {
  const helperId = `${id}-ajuda`;
  const errorId = `${id}-erro`;
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCaret = useRef<number | null>(null);

  // Depois que a máscara insere ou remove pontos, devolve o cursor para logo após o que foi digitado.
  useLayoutEffect(() => {
    const input = inputRef.current;
    if (input && pendingCaret.current !== null && document.activeElement === input) {
      input.setSelectionRange(pendingCaret.current, pendingCaret.current);
    }
    pendingCaret.current = null;
  });

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.control} data-invalid={error ? "true" : undefined}>
        {prefix && (
          <span className={styles.affix} aria-hidden="true">
            {prefix}
          </span>
        )}
        <input
          ref={inputRef}
          id={id}
          name={id}
          className={styles.input}
          type="text"
          inputMode={mask === "integer" ? "numeric" : "decimal"}
          autoComplete="off"
          spellCheck={false}
          value={value}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${errorId} ${helperId}` : helperId}
          onChange={(event) => {
            const masked = applyTypingMask(event.target.value, event.target.selectionStart ?? event.target.value.length, mask);
            pendingCaret.current = masked.caret;
            onChange(masked.value);
          }}
          onBlur={onCommit}
        />
        {suffix && (
          <span className={styles.affix} aria-hidden="true">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p id={errorId} className={styles.error}>
          <AlertIcon />
          {error}
        </p>
      )}
      <p id={helperId} className={styles.helper}>
        {helper}
      </p>
    </div>
  );
}

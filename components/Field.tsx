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
  inputMode: "decimal" | "numeric";
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

export function Field({ id, label, value, helper, placeholder, prefix, suffix, error, inputMode, onChange, onCommit }: FieldProps) {
  const helperId = `${id}-ajuda`;
  const errorId = `${id}-erro`;

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
          id={id}
          name={id}
          className={styles.input}
          type="text"
          inputMode={inputMode}
          autoComplete="off"
          spellCheck={false}
          value={value}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${errorId} ${helperId}` : helperId}
          onChange={(event) => onChange(event.target.value)}
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

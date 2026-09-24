"use client";

/* ─────────────────────────── Form alanı ───────────────────────────
 *
 * Alanlar daha önce yalnızca placeholder ile etiketleniyordu. Bunun iki
 * somut sonucu vardı:
 *   1) Ekran okuyucu için alanın erişilebilir adı yoktu (WCAG 4.1.2) ve
 *      kullanıcı yazmaya başlayınca alanın ne olduğu ekrandan siliniyordu
 *      (WCAG 3.3.2).
 *   2) name/autoComplete olmadığı için tarayıcı otomatik doldurma hiç
 *      devreye girmiyordu — mobil ödeme formunda doğrudan kayıp.
 * Bu bileşen her alana kalıcı bir <label>, name ve autoComplete verir.
 * ------------------------------------------------------------------- */

const FIELD_CLASS =
  "w-full rounded-lg border border-ink-300 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

interface FieldProps {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  className?: string;
}

export default function Field({
  id,
  label,
  name,
  value,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  required = false,
  multiline = false,
  className = "",
}: FieldProps) {
  const shared = {
    id,
    name,
    value,
    required,
    autoComplete,
    placeholder,
    "aria-required": required || undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    className: FIELD_CLASS,
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-ink-700">
        {label}
        {required && (
          <span className="ml-0.5 text-brand-700" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {multiline ? (
        <textarea rows={2} {...shared} />
      ) : (
        <input type={type} inputMode={inputMode} {...shared} />
      )}
    </div>
  );
}

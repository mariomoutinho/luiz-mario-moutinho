import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type BaseFieldProps = {
  id: string;
  label: string;
  error?: string;
  help?: string;
};

export function InputField({
  id,
  label,
  error,
  help,
  className = '',
  ...props
}: BaseFieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const describedBy = [help ? `${id}-help` : '', error ? `${id}-error` : '']
    .filter(Boolean)
    .join(' ');
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-bold text-slate-800">
        {label}
      </label>
      <input
        {...props}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
        className={`min-h-11 w-full rounded-xl border bg-white px-3.5 py-2.5 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-3 focus:ring-orange-100 ${error ? 'border-red-500' : 'border-slate-300'} ${className}`}
      />
      {help && (
        <p id={`${id}-help`} className="text-xs leading-5 text-slate-500">
          {help}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextareaField({
  id,
  label,
  error,
  help,
  className = '',
  ...props
}: BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const describedBy = [help ? `${id}-help` : '', error ? `${id}-error` : '']
    .filter(Boolean)
    .join(' ');
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-bold text-slate-800">
        {label}
      </label>
      <textarea
        {...props}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
        className={`w-full rounded-xl border bg-white px-3.5 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-3 focus:ring-orange-100 ${error ? 'border-red-500' : 'border-slate-300'} ${className}`}
      />
      {help && (
        <p id={`${id}-help`} className="text-xs leading-5 text-slate-500">
          {help}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

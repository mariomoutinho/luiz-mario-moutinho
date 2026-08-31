import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

type NoticeProps = {
  tone?: 'info' | 'success' | 'error';
  title?: string;
  children: React.ReactNode;
};

export function Notice({ tone = 'info', title, children }: NoticeProps) {
  const styles = {
    info: 'border-blue-200 bg-blue-50 text-blue-950',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-950',
    error: 'border-red-200 bg-red-50 text-red-950',
  };
  const Icon = tone === 'error' ? AlertCircle : tone === 'success' ? CheckCircle2 : Info;

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-3.5 text-sm ${styles[tone]}`}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div>
        {title && <p className="font-bold">{title}</p>}
        <div className="leading-6">{children}</div>
      </div>
    </div>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  theme?: 'light' | 'dark';
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  theme = 'light',
}: SectionHeadingProps) {
  const centered = align === 'center';
  const dark = theme === 'dark';

  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p
        className={`mb-4 text-xs font-extrabold tracking-[0.22em] uppercase ${dark ? 'text-sand' : 'text-teal'}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-display text-4xl leading-[1.08] tracking-[-0.025em] sm:text-5xl ${dark ? 'text-white' : 'text-navy'}`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 text-base leading-7 sm:text-lg ${dark ? 'text-white/70' : 'text-ink-muted'}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

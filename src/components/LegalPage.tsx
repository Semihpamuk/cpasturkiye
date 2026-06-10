import { SITE } from "@/lib/site";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

interface LegalPageProps {
  title: string;
  updatedAt: string;
  intro?: string;
  sections: LegalSection[];
}

export default function LegalPage({ title, updatedAt, intro, sections }: LegalPageProps) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-ink-400">Son güncelleme: {updatedAt}</p>

        {intro && <p className="mt-8 leading-relaxed text-ink-600">{intro}</p>}

        <div className="mt-10 space-y-10">
          {sections.map((section, index) => (
            <div key={section.heading}>
              <h2 className="font-display text-xl font-bold text-ink-900">
                {index + 1}. {section.heading}
              </h2>
              {section.paragraphs.map((paragraph, pIndex) => (
                <p key={pIndex} className="mt-3 text-sm leading-relaxed text-ink-600">
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className="mt-3 list-disc space-y-1.5 pl-6 text-sm leading-relaxed text-ink-600">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-ink-200 bg-ink-50 p-6 text-sm text-ink-600">
          <p>
            <strong className="text-ink-900">{SITE.company}</strong>
            <br />
            E-posta: {SITE.email}
            <br />
            Adres: {SITE.address}
          </p>
          <p className="mt-3 text-xs text-ink-400">
            Bu metin bilgilendirme amaçlıdır ve hukuki danışmanlık yerine geçmez. Şirket
            bilgileri (ticari unvan, MERSİS no, vergi dairesi vb.) yayına alınmadan önce
            güncellenmelidir.
          </p>
        </div>
      </div>
    </section>
  );
}

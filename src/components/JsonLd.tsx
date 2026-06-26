/**
 * Sayfaya schema.org JSON-LD yapısal verisi gömer.
 * Server Component — `data` objesini güvenle script etiketine serialize eder.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

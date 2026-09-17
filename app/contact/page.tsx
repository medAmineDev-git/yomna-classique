export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-extrabold sm:text-3xl">Nous contacter</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Une question sur une taille, une commande en cours, un échange&nbsp;? Le plus rapide reste
        le téléphone : on répond tous les jours de 9 h à 19 h.
      </p>

      <dl className="mt-10 space-y-6 border-t border-line pt-10">
        {[
          ["Téléphone", "+216 55 123 456", "tel:+21655123456"],
          ["E-mail", "contact@yomna-fashion.tn", "mailto:contact@yomna-fashion.tn"],
          ["Adresse", "12 avenue Habib Bourguiba, Tunis", null],
          ["Horaires", "Tous les jours, 9 h – 19 h", null],
        ].map(([label, value, href]) => (
          <div key={label as string}>
            <dt className="text-xs font-semibold text-muted uppercase">{label}</dt>
            <dd className="mt-1 text-lg font-medium">
              {href ? (
                <a href={href as string} className="hover:text-promo">
                  {value}
                </a>
              ) : (
                value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

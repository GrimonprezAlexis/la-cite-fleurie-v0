import { Card, CardContent } from '@/components/ui/card';

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Mentions Légales</h1>

        <Card className="mb-6 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Informations sur l&apos;entreprise</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Nom de l&apos;entreprise :</strong> La Cité Fleurie SA
              </p>
              <p>
                <strong>Forme juridique :</strong> Société Anonyme (SA)
              </p>
              <p>
                <strong>Adresse :</strong> Chemin de l&apos;Echo 3, 1213 Onex, Suisse
              </p>
              <p>
                <strong>Téléphone :</strong>{' '}
                <a href="tel:+41227930350" className="text-[#d3cbc2] hover:underline">
                  022 793 03 50
                </a>
              </p>
              <p>
                <strong>Activité :</strong> Restaurant - Pizzeria - Lounge Bar
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hébergement du site</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Ce site web est hébergé par un prestataire d&apos;hébergement professionnel garantissant la sécurité
                et la disponibilité des données.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Propriété intellectuelle</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                L&apos;ensemble du contenu de ce site (textes, images, logos, graphiques) est la propriété exclusive
                de La Cité Fleurie SA, sauf mention contraire.
              </p>
              <p>
                Toute reproduction, distribution, modification ou utilisation du contenu sans autorisation écrite
                préalable est strictement interdite et constitue une contrefaçon sanctionnée par le Code pénal suisse.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Protection des données</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Conformément à la Loi fédérale sur la protection des données (LPD), nous nous engageons à protéger
                la confidentialité de vos données personnelles.
              </p>
              <p>
                <strong>Collecte des données :</strong> Les informations personnelles que vous nous transmettez
                via le formulaire de contact (nom, email, téléphone, message) sont collectées uniquement pour
                répondre à vos demandes.
              </p>
              <p>
                <strong>Utilisation des données :</strong> Vos données sont utilisées exclusivement dans le cadre
                de notre relation commerciale et ne sont jamais transmises à des tiers sans votre consentement.
              </p>
              <p>
                <strong>Droit d&apos;accès et de rectification :</strong> Vous disposez d&apos;un droit d&apos;accès,
                de rectification et de suppression de vos données personnelles. Pour exercer ce droit, contactez-nous
                au 022 793 03 50.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Ce site utilise des cookies pour améliorer votre expérience de navigation. Les cookies sont de
                petits fichiers texte stockés sur votre appareil lors de votre visite.
              </p>
              <p>
                Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela peut affecter certaines
                fonctionnalités du site.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation de responsabilité</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Nous nous efforçons de maintenir les informations de ce site à jour et exactes. Toutefois, nous ne
                pouvons garantir l&apos;exactitude, la complétude ou l&apos;actualité des informations fournies.
              </p>
              <p>
                La Cité Fleurie SA ne peut être tenue responsable des dommages directs ou indirects résultant de
                l&apos;utilisation de ce site ou de l&apos;impossibilité d&apos;y accéder.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Droit applicable</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Les présentes mentions légales sont régies par le droit suisse. Tout litige relatif à
                l&apos;utilisation de ce site sera soumis à la compétence exclusive des tribunaux du canton de Genève.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-gray-600">
          <p>Dernière mise à jour : Octobre 2025</p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, Mail, Clock, Facebook } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const insertResponse = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey!,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(formData),
      });

      if (!insertResponse.ok) {
        throw new Error('Erreur lors de l\'enregistrement du message');
      }

      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!emailResponse.ok) {
        throw new Error('Erreur lors de l\'envoi de l\'email');
      }

      toast({
        title: 'Message envoyé',
        description: 'Nous vous répondrons dans les plus brefs délais.',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Une question, une réservation ou un événement spécial ? Nous sommes à votre écoute.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Votre nom"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+41 XX XXX XX XX"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Réservation"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Décrivez votre demande..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full bg-[#d3cbc2] hover:bg-[#b8af9f] text-gray-900"
                  >
                    {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Informations</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-[#d3cbc2] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Téléphone</p>
                      <a
                        href="tel:+41227930350"
                        className="text-gray-600 hover:text-[#d3cbc2] transition-colors"
                      >
                        +41 22 793 03 50
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-[#d3cbc2] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Adresse</p>
                      <p className="text-gray-600">Chemin de l&apos;Echo 3</p>
                      <p className="text-gray-600">1213 Onex, Suisse</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-[#d3cbc2] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Horaires</p>
                      <p className="text-gray-600">7j/7 : 07:30 - 00:00</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Facebook className="w-5 h-5 text-[#d3cbc2] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Facebook</p>
                      <a
                        href="https://www.facebook.com/p/La-Cit%C3%A9-Fleurie-100063631886817/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#d3cbc2] transition-colors"
                      >
                        Suivez-nous
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-[#d3cbc2]">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Réservation rapide</h3>
                <p className="text-white mb-4 text-sm">
                  Pour une réservation immédiate, appelez-nous directement.
                </p>
                <a href="tel:+41227930350">
                  <Button className="w-full bg-white text-gray-900 hover:bg-gray-100">
                    <Phone className="w-4 h-4 mr-2" />
                    Appeler maintenant
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 max-w-6xl mx-auto">
          <Card className="shadow-lg overflow-hidden">
            <div className="h-96 w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2762.0!2d6.0965!3d46.1825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDbCsDEwJzU3LjAiTiA2wrAwNSc0Ny40IkU!5e0!3m2!1sfr!2sch!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation La Cité Fleurie"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

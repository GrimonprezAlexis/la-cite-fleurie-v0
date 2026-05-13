'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Phone, MapPin, Clock, Facebook, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSiteSettings } from '@/hooks/use-site-settings';

const REQUEST_TYPES = [
  { value: 'reservation', label: 'Réservation' },
  { value: 'evenement', label: 'Événement privé' },
  { value: 'question', label: 'Question générale' },
  { value: 'autre', label: 'Autre' },
] as const;

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Nom trop court').max(80, 'Nom trop long'),
  email: z.string().trim().email('Email invalide'),
  phone: z
    .string()
    .trim()
    .max(30, 'Numéro trop long')
    .regex(/^[\d\s+()\-./]*$/, 'Numéro invalide')
    .optional()
    .or(z.literal('')),
  type: z.enum(['reservation', 'evenement', 'question', 'autre'], {
    required_error: 'Sélectionnez un type',
  }),
  message: z
    .string()
    .trim()
    .min(10, 'Message trop court (min 10 caractères)')
    .max(2000, 'Message trop long (max 2000 caractères)'),
  // Honeypot — leave empty
  website: z.string().max(0).optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const { settings, phoneLink } = useSiteSettings();
  const [sent, setSent] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      type: undefined,
      message: '',
      website: '',
    },
  });

  const messageValue = form.watch('message') ?? '';
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: ContactFormValues) => {
    if (values.website) return; // honeypot tripped — silent drop

    try {
      const typeLabel =
        REQUEST_TYPES.find((t) => t.value === values.type)?.label ?? 'Demande';

      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone || undefined,
          subject: typeLabel,
          message: values.message,
        }),
      });

      if (!res.ok) throw new Error('send_failed');

      setSent(true);
      form.reset();
      toast({
        title: 'Message envoyé',
        description: 'Nous vous répondrons rapidement.',
      });
    } catch {
      toast({
        title: 'Erreur',
        description: 'Envoi impossible. Réessayez ou appelez-nous.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contactez-nous
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Une question, une réservation ou un événement spécial ? Nous sommes à votre écoute.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                {sent ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
                    <CheckCircle2 className="w-16 h-16 text-green-600 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Message bien reçu
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-md">
                      Merci ! Nous vous répondrons dans les plus brefs délais à l&apos;adresse fournie.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setSent(false)}
                      className="border-[#d3cbc2]"
                    >
                      Envoyer un autre message
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Envoyez-nous un message
                    </h2>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                        noValidate
                      >
                        {/* Honeypot — visually hidden, ignored by users, caught bots */}
                        <input
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                          aria-hidden="true"
                          className="absolute -left-[9999px] h-0 w-0 opacity-0"
                          {...form.register('website')}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nom complet *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Votre nom"
                                    autoComplete="name"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="votre@email.com"
                                    autoComplete="email"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Téléphone</FormLabel>
                                <FormControl>
                                  <Input
                                    type="tel"
                                    placeholder="+41 XX XXX XX XX"
                                    autoComplete="tel"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type de demande *</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionnez..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {REQUEST_TYPES.map((t) => (
                                      <SelectItem key={t.value} value={t.value}>
                                        {t.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Message *</FormLabel>
                                <span
                                  className={`text-xs tabular-nums ${
                                    messageValue.length > 1800
                                      ? 'text-amber-600'
                                      : 'text-gray-400'
                                  }`}
                                >
                                  {messageValue.length} / 2000
                                </span>
                              </div>
                              <FormControl>
                                <Textarea
                                  rows={6}
                                  placeholder="Décrivez votre demande..."
                                  maxLength={2000}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          size="lg"
                          disabled={isSubmitting}
                          className="w-full bg-[#d3cbc2] hover:bg-[#b8af9f] text-gray-900 transition-all"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Envoi en cours...
                            </>
                          ) : (
                            'Envoyer le message'
                          )}
                        </Button>
                      </form>
                    </Form>
                  </>
                )}
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
                        href={phoneLink}
                        className="text-gray-600 hover:text-[#d3cbc2] transition-colors"
                      >
                        {settings.phone}
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
                <a href={phoneLink}>
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

'use client';

import { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/admin-guard';
import { AdminNav } from '@/components/admin-nav';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useConfetti } from '@/hooks/use-confetti';
import { Loader2, Phone, Mail, Megaphone, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ContactSettings {
  phone: string;
  email: string;
  announcement: string;
  announcementActive: boolean;
}

function AdminContactContent() {
  const [settings, setSettings] = useState<ContactSettings>({
    phone: '022 793 03 50',
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
    announcement: '',
    announcementActive: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { fireSuccessConfetti } = useConfetti();

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const docRef = doc(db, 'site_settings', 'contact');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSettings((prev) => ({ ...prev, ...docSnap.data() }));
      }
    } catch (error: any) {
      console.error('Error loading settings:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les paramètres',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await setDoc(doc(db, 'site_settings', 'contact'), {
        ...settings,
        updated_at: new Date().toISOString(),
      });

      fireSuccessConfetti();

      toast({
        title: 'Succès',
        description: 'Paramètres enregistrés avec succès',
      });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Échec de la sauvegarde',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <AdminNav />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Phone className="w-8 h-8 text-[#d3cbc2]" />
              <h1 className="text-3xl font-bold text-gray-900">Paramètres de Contact</h1>
            </div>
            <p className="text-gray-600">Gérez les informations de contact affichées sur le site</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#d3cbc2]" />
              <p className="text-gray-600 mt-4">Chargement...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Coordonnées */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#d3cbc2]" />
                    Coordonnées
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Numéro de téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="022 793 03 50"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">
                      Ce numéro sera affiché dans le header, footer et les pages du site
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email de réception des contacts</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@lacitefleurie.ch"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">
                      Les messages du formulaire de contact seront envoyés à cette adresse
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Annonce */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-[#d3cbc2]" />
                    Bandeau d&apos;annonce
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="announcementActive">Activer le bandeau</Label>
                      <p className="text-xs text-gray-500">
                        Affiche un message en haut de toutes les pages
                      </p>
                    </div>
                    <Switch
                      id="announcementActive"
                      checked={settings.announcementActive}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, announcementActive: checked })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="announcement">Message d&apos;annonce</Label>
                    <Textarea
                      id="announcement"
                      placeholder="Ex: Fermeture exceptionnelle du 24 au 26 décembre. Joyeuses fêtes !"
                      value={settings.announcement}
                      onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                      rows={3}
                    />
                  </div>

                  {settings.announcementActive && settings.announcement && (
                    <Alert className="bg-[#d3cbc2]/20 border-[#d3cbc2]">
                      <AlertDescription>
                        <strong>Aperçu :</strong> {settings.announcement}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Bouton de sauvegarde */}
              <Button
                onClick={handleSave}
                className="w-full bg-[#d3cbc2] hover:bg-[#b8af9f] text-gray-900"
                disabled={saving}
                size="lg"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Enregistrer les modifications
              </Button>
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}

export default function AdminContactPage() {
  return <AdminContactContent />;
}

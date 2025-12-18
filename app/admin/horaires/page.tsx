'use client';

import { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/admin-guard';
import { AdminNav } from '@/components/admin-nav';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc
} from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit, Save, X, Clock, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OpeningHour {
  id: string;
  day_of_week: string;
  is_open: boolean;
  open_time: string;
  close_time: string;
  special_note: string;
  display_order: number;
}

function AdminHorairesContent() {
  const [hours, setHours] = useState<OpeningHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const [editForm, setEditForm] = useState({
    is_open: true,
    open_time: '',
    close_time: '',
    special_note: '',
  });

  useEffect(() => {
    fetchHours();
  }, []);

  async function fetchHours() {
    try {
      const q = query(collection(db, 'opening_hours'), orderBy('display_order', 'asc'));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as OpeningHour[];
      setHours(items);
    } catch (error: any) {
      console.error('Error loading hours:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de charger les horaires',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  function startEdit(hour: OpeningHour) {
    setEditingId(hour.id);
    setEditForm({
      is_open: hour.is_open,
      open_time: hour.open_time,
      close_time: hour.close_time,
      special_note: hour.special_note || '',
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({
      is_open: true,
      open_time: '',
      close_time: '',
      special_note: '',
    });
  }

  async function saveEdit(hourId: string) {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'opening_hours', hourId), {
        is_open: editForm.is_open,
        open_time: editForm.open_time,
        close_time: editForm.close_time,
        special_note: editForm.special_note,
        updated_at: new Date().toISOString(),
      });

      toast({
        title: 'Succès',
        description: 'Horaires mis à jour avec succès',
      });

      setEditingId(null);
      fetchHours();
    } catch (error: any) {
      console.error('Error updating hours:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Échec de la mise à jour',
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-8 h-8 text-[#d3cbc2]" />
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Horaires</h1>
            </div>
            <p className="text-gray-600">Modifiez les horaires d&apos;ouverture du restaurant</p>
          </div>

          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Les modifications des horaires seront immédiatement visibles sur la page publique. Vérifiez toujours vos changements après sauvegarde.
            </AlertDescription>
          </Alert>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#d3cbc2]" />
              <p className="text-gray-600 mt-4">Chargement...</p>
            </div>
          ) : hours.length === 0 ? (
            <Card className="max-w-4xl">
              <CardContent className="p-12 text-center">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucun horaire trouvé</h2>
                <p className="text-gray-600 mb-6">
                  Les horaires par défaut devraient être créés automatiquement.
                </p>
                <Button
                  onClick={() => {
                    setLoading(true);
                    fetchHours();
                  }}
                  className="bg-[#d3cbc2] hover:bg-[#b8af9f] text-gray-900"
                >
                  Réessayer
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="max-w-4xl space-y-3">
              {hours.map((hour, index) => (
                <Card
                  key={hour.id}
                  className={`transition-all ${
                    index === 0 ? 'bg-gray-100 border-gray-300' : 'hover:shadow-md'
                  }`}
                >
                  <CardContent className="p-6">
                    {editingId === hour.id ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {hour.day_of_week}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={cancelEdit}
                              variant="outline"
                              size="sm"
                              disabled={saving}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Annuler
                            </Button>
                            <Button
                              onClick={() => saveEdit(hour.id)}
                              size="sm"
                              className="bg-[#d3cbc2] hover:bg-[#b8af9f] text-gray-900"
                              disabled={saving}
                            >
                              {saving ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4 mr-1" />
                              )}
                              Enregistrer
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Switch
                            checked={editForm.is_open}
                            onCheckedChange={(checked) =>
                              setEditForm({ ...editForm, is_open: checked })
                            }
                          />
                          <Label className="text-sm font-medium">
                            {editForm.is_open ? 'Ouvert' : 'Fermé'}
                          </Label>
                        </div>

                        {editForm.is_open && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="open_time">Heure d&apos;ouverture</Label>
                              <Input
                                id="open_time"
                                type="time"
                                value={editForm.open_time}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, open_time: e.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="close_time">Heure de fermeture</Label>
                              <Input
                                id="close_time"
                                type="time"
                                value={editForm.close_time}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, close_time: e.target.value })
                                }
                              />
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="special_note">Note spéciale (optionnel)</Label>
                          <Input
                            id="special_note"
                            type="text"
                            placeholder="Ex: Service midi uniquement"
                            value={editForm.special_note}
                            onChange={(e) =>
                              setEditForm({ ...editForm, special_note: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {hour.day_of_week}
                            </h3>
                            {hour.is_open ? (
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                Ouvert
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                                Fermé
                              </span>
                            )}
                          </div>
                          {hour.is_open && (
                            <p className="text-gray-600">
                              {hour.open_time} - {hour.close_time}
                            </p>
                          )}
                          {hour.special_note && (
                            <p className="text-sm text-gray-500 mt-1 italic">
                              {hour.special_note}
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={() => startEdit(hour)}
                          variant="outline"
                          size="sm"
                          className="ml-4"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}

export default function AdminHorairesPage() {
  return <AdminHorairesContent />;
}

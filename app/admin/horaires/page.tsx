'use client';

import { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/admin-guard';
import { AdminNav } from '@/components/admin-nav';
import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit, Save, X } from 'lucide-react';

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
      const hoursData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as OpeningHour));
      setHours(hoursData);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les horaires',
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

  async function handleSave(id: string) {
    setSaving(true);

    try {
      const hourRef = doc(db, 'opening_hours', id);
      await updateDoc(hourRef, {
        is_open: editForm.is_open,
        open_time: editForm.open_time,
        close_time: editForm.close_time,
        special_note: editForm.special_note || '',
        updated_at: new Date().toISOString(),
      });

      toast({
        title: 'Succès',
        description: 'Horaire mis à jour avec succès',
      });

      setEditingId(null);
      fetchHours();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Erreur',
        description: 'Échec de la mise à jour',
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
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Horaires</h1>
            <p className="text-gray-600">Modifiez les horaires d&apos;ouverture du restaurant</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#d3cbc2]" />
              <p className="text-gray-600 mt-4">Chargement...</p>
            </div>
          ) : (
            <div className="max-w-4xl space-y-4">
              {hours.map((hour) => (
                <Card key={hour.id}>
                  <CardContent className="p-6">
                    {editingId === hour.id ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-gray-900">{hour.day_of_week}</h3>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={editForm.is_open}
                                onCheckedChange={(checked) =>
                                  setEditForm({ ...editForm, is_open: checked })
                                }
                              />
                              <Label>{editForm.is_open ? 'Ouvert' : 'Fermé'}</Label>
                            </div>
                          </div>
                        </div>

                        {editForm.is_open && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`open-${hour.id}`}>Heure d&apos;ouverture</Label>
                                <Input
                                  id={`open-${hour.id}`}
                                  type="time"
                                  value={editForm.open_time}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, open_time: e.target.value })
                                  }
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`close-${hour.id}`}>Heure de fermeture</Label>
                                <Input
                                  id={`close-${hour.id}`}
                                  type="time"
                                  value={editForm.close_time}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, close_time: e.target.value })
                                  }
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`note-${hour.id}`}>Note spéciale (optionnel)</Label>
                              <Input
                                id={`note-${hour.id}`}
                                value={editForm.special_note}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, special_note: e.target.value })
                                }
                                placeholder="Ex: Soirée musicale"
                              />
                            </div>
                          </>
                        )}

                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleSave(hour.id)}
                            disabled={saving}
                            className="bg-[#d3cbc2] hover:bg-[#b8af9f] text-gray-900"
                          >
                            {saving ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Enregistrement...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                Enregistrer
                              </>
                            )}
                          </Button>
                          <Button variant="outline" onClick={cancelEdit}>
                            <X className="w-4 h-4 mr-2" />
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <h3 className="text-xl font-semibold text-gray-900 w-32">
                              {hour.day_of_week}
                            </h3>
                            <div>
                              {hour.is_open ? (
                                <span className="text-[#d3cbc2] font-medium">
                                  {hour.open_time} - {hour.close_time}
                                </span>
                              ) : (
                                <span className="text-red-500 font-medium">Fermé</span>
                              )}
                              {hour.special_note && (
                                <p className="text-sm text-gray-500 italic mt-1">
                                  {hour.special_note}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(hour)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Card className="mt-8 max-w-4xl bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Information</h3>
              <p className="text-blue-800 text-sm">
                Les modifications des horaires seront immédiatement visibles sur la page publique des horaires.
                Assurez-vous de vérifier les horaires après les avoir modifiés.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGuard>
  );
}

export default function AdminHorairesPage() {
  return <AdminHorairesContent />;
}

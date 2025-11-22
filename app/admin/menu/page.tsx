'use client';

import { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/admin-guard';
import { AdminNav } from '@/components/admin-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Trash2, Plus, Upload, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface MenuItem {
  id: string;
  title: string;
  description?: string;
  fileUrl?: string;
  fileType?: string;
  order: number;
}

function AdminMenuContent() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null as File | null,
    fileUrl: '',
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  async function fetchMenuItems() {
    try {
      const response = await fetch('/api/menu');
      const result = await response.json();

      if (!result.success) throw new Error(result.error);

      setMenuItems(result.data || []);
    } catch (error: any) {
      console.error('Error loading menu items:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de charger les menus',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(file: File): Promise<string> {
    const { storage } = await import('@/lib/api/firebase/config');
    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');

    const storageRef = ref(storage, `menus/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer un titre',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      let fileUrl = formData.fileUrl;
      let fileType = '';

      if (formData.file) {
        fileUrl = await handleFileUpload(formData.file);
        fileType = formData.file.type;
      }

      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || '',
          fileUrl: fileUrl || null,
          fileType: fileType || null,
          order: menuItems.length,
        }),
      });

      const result = await response.json();

      if (!result.success) throw new Error(result.error);

      toast({
        title: 'Succès',
        description: 'Menu ajouté avec succès',
      });

      setFormData({ title: '', description: '', file: null, fileUrl: '' });
      setIsDialogOpen(false);
      fetchMenuItems();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Échec de l\'ajout du menu',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(item: MenuItem) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${item.title}" ?`)) {
      return;
    }

    try {
      if (item.fileUrl) {
        const { storage } = await import('@/lib/api/firebase/config');
        const { ref, deleteObject } = await import('firebase/storage');

        try {
          const fileRef = ref(storage, item.fileUrl);
          await deleteObject(fileRef);
        } catch (storageError) {
          console.warn('Error deleting file from storage:', storageError);
        }
      }

      const response = await fetch(`/api/menu?id=${item.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) throw new Error(result.error);

      toast({
        title: 'Succès',
        description: 'Menu supprimé avec succès',
      });

      fetchMenuItems();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Échec de la suppression',
        variant: 'destructive',
      });
    }
  }


  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-8 h-8 text-[#d3cbc2]" />
                <h1 className="text-3xl font-bold text-gray-900">Gestion des Menus</h1>
              </div>
              <p className="text-gray-600">Gérez les menus du restaurant (PDF ou images)</p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#d3cbc2] hover:bg-[#b8af9f] text-gray-900">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un menu
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau menu</DialogTitle>
                  <DialogDescription>
                    Téléchargez un fichier PDF ou une image du menu
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpload} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Ex: Menu du jour"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Description optionnelle"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">Fichier (PDF ou Image)</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFormData({ ...formData, file });
                      }}
                    />
                    <p className="text-xs text-gray-500">
                      Formats acceptés: PDF, JPG, PNG (Max 10MB)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fileUrl">Ou URL du fichier</Label>
                    <Input
                      id="fileUrl"
                      type="url"
                      placeholder="https://example.com/menu.pdf"
                      value={formData.fileUrl}
                      onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">
                      Vous pouvez soit télécharger un fichier, soit fournir une URL
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#d3cbc2] hover:bg-[#b8af9f] text-gray-900"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Upload en cours...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Télécharger
                      </>
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#d3cbc2]" />
              <p className="text-gray-600 mt-4">Chargement...</p>
            </div>
          ) : menuItems.length === 0 ? (
            <Card className="max-w-4xl">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucun menu</h2>
                <p className="text-gray-600 mb-6">
                  Commencez par ajouter votre premier menu
                </p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-[#d3cbc2] hover:bg-[#b8af9f] text-gray-900"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un menu
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                        )}
                      </div>
                    </div>

                    {item.fileUrl && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <FileText className="w-4 h-4" />
                        <span className="truncate">Fichier disponible</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {item.fileUrl && (
                        <Button
                          onClick={() => window.open(item.fileUrl, '_blank')}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDelete(item)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

export default function AdminMenuPage() {
  return <AdminMenuContent />;
}

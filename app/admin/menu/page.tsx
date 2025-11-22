'use client';

import { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/admin-guard';
import { AdminNav } from '@/components/admin-nav';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Upload, FileText, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  file_name: string;
  storage_path: string;
  display_order: number;
  created_at: number;
}

function AdminMenuContent() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const storage = getStorage();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null as File | null,
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  async function fetchMenuItems() {
    try {
      const q = query(collection(db, 'menu_items'), orderBy('display_order', 'asc'));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as MenuItem));
      setMenuItems(items);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les éléments du menu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.file) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un fichier',
        variant: 'destructive',
      });
      return;
    }

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
      const fileName = `${Date.now()}_${formData.file.name}`;
      const storagePath = `menus/${fileName}`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, formData.file);
      const fileUrl = await getDownloadURL(storageRef);

      const newMenuItem: Omit<MenuItem, 'id'> = {
        title: formData.title,
        description: formData.description || '',
        file_url: fileUrl,
        file_type: formData.file.type,
        file_name: formData.file.name,
        storage_path: storagePath,
        display_order: menuItems.length,
        created_at: Date.now(),
      };

      await addDoc(collection(db, 'menu_items'), newMenuItem);

      toast({
        title: 'Succès',
        description: 'Menu ajouté avec succès',
      });

      setFormData({ title: '', description: '', file: null });
      setIsDialogOpen(false);
      fetchMenuItems();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Erreur',
        description: 'Échec de l\'upload du fichier',
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
      const storageRef = ref(storage, item.storage_path);
      await deleteObject(storageRef);

      await deleteDoc(doc(db, 'menu_items', item.id));

      toast({
        title: 'Succès',
        description: 'Menu supprimé avec succès',
      });

      fetchMenuItems();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Erreur',
        description: 'Échec de la suppression',
        variant: 'destructive',
      });
    }
  }

  const isPDF = (fileType: string) => fileType === 'application/pdf';

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion du Menu</h1>
              <p className="text-gray-600 mt-2">Gérez vos fichiers de menu (PDF ou images)</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#d3cbc2] hover:bg-[#b8af9f] text-gray-900">
                  <Upload className="w-4 h-4 mr-2" />
                  Ajouter un Menu
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau menu</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ex: Menu Principal"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Description optionnelle"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">Fichier (PDF ou Image) *</Label>
                    <Input
                      id="file"
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                      required
                    />
                    <p className="text-xs text-gray-500">PDF ou image (max 10 MB)</p>
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
                      'Ajouter'
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
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucun menu</h2>
                <p className="text-gray-600">Commencez par ajouter votre premier menu</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {isPDF(item.file_type) ? (
                      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <FileText className="w-16 h-16 text-gray-400" />
                      </div>
                    ) : (
                      <div className="h-48 relative overflow-hidden bg-gray-100">
                        <img
                          src={item.file_url}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                      )}
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs text-gray-500 font-medium">
                          {isPDF(item.file_type) ? 'PDF' : 'Image'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(item.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            {isPDF(item.file_type) ? 'Télécharger' : 'Voir'}
                          </Button>
                        </a>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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

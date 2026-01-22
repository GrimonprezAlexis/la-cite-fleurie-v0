'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { clearAdminSession } from '@/lib/auth';
import { LogOut, Menu as MenuIcon, Clock, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    clearAdminSession();
    toast({
      title: 'Déconnexion',
      description: 'Vous avez été déconnecté avec succès',
    });
    router.push('/admin');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <h1 className="text-lg font-bold text-gray-900 hidden sm:block">Admin</h1>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/admin/menu">
              <Button
                variant={isActive('/admin/menu') ? 'default' : 'ghost'}
                size="sm"
                className={isActive('/admin/menu') ? 'bg-[#d3cbc2] hover:bg-[#b8af9f] text-gray-900' : ''}
              >
                <MenuIcon className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Menu</span>
              </Button>
            </Link>
            <Link href="/admin/horaires">
              <Button
                variant={isActive('/admin/horaires') ? 'default' : 'ghost'}
                size="sm"
                className={isActive('/admin/horaires') ? 'bg-[#d3cbc2] hover:bg-[#b8af9f] text-gray-900' : ''}
              >
                <Clock className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Horaires</span>
              </Button>
            </Link>
            <Link href="/admin/contact">
              <Button
                variant={isActive('/admin/contact') ? 'default' : 'ghost'}
                size="sm"
                className={isActive('/admin/contact') ? 'bg-[#d3cbc2] hover:bg-[#b8af9f] text-gray-900' : ''}
              >
                <Phone className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Contact</span>
              </Button>
            </Link>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">Déconnexion</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Phone, MapPin, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSiteSettings } from '@/hooks/use-site-settings';

interface OpeningHour {
  id: string;
  day_of_week: string;
  is_open: boolean;
  open_time: string;
  close_time: string;
  special_note: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export default function HorairesPage() {
  const [hours, setHours] = useState<OpeningHour[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings, phoneLink } = useSiteSettings();

  useEffect(() => {
    fetchHours();
  }, []);

  async function fetchHours() {
    try {
      const q = query(collection(db, 'opening_hours'), orderBy('display_order', 'asc'));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as OpeningHour[];
      setHours(items);
    } catch (error) {
      console.error('Error fetching hours:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatTime = (time: string) => {
    return time;
  };

  const defaultHours = [
    { day: 'Dimanche', hours: '07:30 - 00:00' },
    { day: 'Lundi', hours: '07:30 - 00:00' },
    { day: 'Mardi', hours: '07:30 - 00:00' },
    { day: 'Mercredi', hours: '07:30 - 00:00' },
    { day: 'Jeudi', hours: '07:30 - 00:00' },
    { day: 'Vendredi', hours: '07:30 - 00:00' },
    { day: 'Samedi', hours: '07:30 - 00:00' },
  ];

  const displayHours = hours.length > 0 ? hours : defaultHours.map((h, i) => ({
    id: i.toString(),
    day_of_week: h.day,
    is_open: true,
    open_time: '07:30',
    close_time: '00:00',
    special_note: null,
    display_order: i + 1,
    created_at: '',
    updated_at: '',
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block bg-[#d3cbc2]/10 px-6 py-2 rounded-full mb-6 animate-scale-in">
            <span className="text-[#b8af9f] font-semibold">Nous sommes ouverts</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-slide-up">Nos Horaires</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d3cbc2] to-transparent mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
            Nous vous accueillons 7 jours sur 7 pour le déjeuner, le dîner et le brunch.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-12 shadow-2xl border-none overflow-hidden animate-scale-in">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-[#d3cbc2] to-[#b8af9f] p-8 flex items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl animate-float">
                  <Clock className="w-10 h-10 text-[#d3cbc2]" />
                </div>
              </div>

              <div className="p-8">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div key={i} className="flex justify-between items-center py-3 border-b border-gray-200">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-32" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 stagger-animation">
                    {displayHours.map((hour, index) => (
                      <div
                        key={hour.id}
                        className="flex justify-between items-center py-5 px-6 rounded-xl hover:bg-gradient-to-r hover:from-[#d3cbc2]/5 hover:to-transparent transition-all duration-300 group hover:translate-x-2"
                        style={{animationDelay: `${index * 0.05}s`}}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-[#d3cbc2] rounded-full group-hover:scale-150 transition-transform"></div>
                          <span className="font-bold text-gray-900 text-xl w-36">
                            {hour.day_of_week}
                          </span>
                          {hour.special_note && (
                            <span className="text-sm text-[#d3cbc2] italic bg-[#d3cbc2]/10 px-3 py-1 rounded-full">
                              {hour.special_note}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          {hour.is_open ? (
                            <span className="text-[#d3cbc2] font-bold text-xl">
                              {formatTime(hour.open_time)} - {formatTime(hour.close_time)}
                            </span>
                          ) : (
                            <span className="text-red-500 font-bold text-xl">Fermé</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 stagger-animation">
            <Card className="shadow-xl hover-lift border-none overflow-hidden group">
              <CardContent className="p-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#d3cbc2]/20 to-transparent rounded-bl-full"></div>
                <div className="flex items-start space-x-4 relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#d3cbc2] to-[#b8af9f] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Types de repas</h3>
                    <ul className="text-gray-600 space-y-2 text-lg">
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-[#d3cbc2] rounded-full"></span>
                        <span>Déjeuner</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-[#d3cbc2] rounded-full"></span>
                        <span>Dîner</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-[#d3cbc2] rounded-full"></span>
                        <span>Brunch</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl hover-lift border-none overflow-hidden group">
              <CardContent className="p-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#d3cbc2]/20 to-transparent rounded-bl-full"></div>
                <div className="flex items-start space-x-4 relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#d3cbc2] to-[#b8af9f] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform animate-float">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Soirées musicales</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Tous les vendredis et samedis soir, profitez de nos soirées musicales dans une ambiance lounge.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-10 border border-gray-100 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nous Contacter</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-white shadow-md hover:shadow-xl transition-shadow group hover:translate-x-2">
                <div className="w-14 h-14 bg-gradient-to-br from-[#d3cbc2] to-[#b8af9f] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <a
                  href={phoneLink}
                  className="text-lg text-gray-700 hover:text-[#d3cbc2] transition-colors font-medium"
                >
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-white shadow-md hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-[#d3cbc2] to-[#b8af9f] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Chemin de l&apos;Echo 3</p>
                  <p className="text-gray-700 font-medium">1213 Onex, Suisse</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href={phoneLink}>
                <Button size="lg" className="bg-[#d3cbc2] hover:bg-[#b8af9f] text-gray-900 font-semibold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <Phone className="w-6 h-6 mr-2" />
                  Réserver par téléphone
                </Button>
              </a>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-2 border-[#d3cbc2] text-[#d3cbc2] hover:bg-[#d3cbc2] hover:text-gray-900 font-semibold text-lg px-8 py-6 shadow-xl transition-all duration-300 hover:scale-105">
                  Formulaire de contact
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

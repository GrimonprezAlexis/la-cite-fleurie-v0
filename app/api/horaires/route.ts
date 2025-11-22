import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/api/firebase/admin';

const defaultHours = [
  { dayOfWeek: 'Lundi', isOpen: true, openTime: '12:00', closeTime: '14:00', specialNote: 'Midi uniquement', order: 1 },
  { dayOfWeek: 'Mardi', isOpen: true, openTime: '12:00', closeTime: '14:00', specialNote: 'Midi uniquement', order: 2 },
  { dayOfWeek: 'Mercredi', isOpen: true, openTime: '12:00', closeTime: '14:00', specialNote: 'Midi uniquement', order: 3 },
  { dayOfWeek: 'Jeudi', isOpen: true, openTime: '12:00', closeTime: '22:00', specialNote: 'Service continu', order: 4 },
  { dayOfWeek: 'Vendredi', isOpen: true, openTime: '12:00', closeTime: '23:00', specialNote: 'Service continu', order: 5 },
  { dayOfWeek: 'Samedi', isOpen: true, openTime: '12:00', closeTime: '23:00', specialNote: 'Service continu', order: 6 },
  { dayOfWeek: 'Dimanche', isOpen: false, openTime: '', closeTime: '', specialNote: '', order: 7 },
];

async function initializeDefaultHours() {
  if (!adminDb) return;

  try {
    const snapshot = await adminDb.collection('opening_hours').limit(1).get();

    if (snapshot.empty) {
      console.log('Initializing default opening hours...');

      const batch = adminDb.batch();
      defaultHours.forEach(hour => {
        const docRef = adminDb!.collection('opening_hours').doc();
        batch.set(docRef, {
          ...hour,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });

      await batch.commit();
      console.log('Default opening hours initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing default hours:', error);
  }
}

export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json({ success: true, data: [] });
    }

    await initializeDefaultHours();

    const hoursSnapshot = await adminDb.collection('opening_hours').orderBy('order').get();

    const hours = hoursSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data: hours });
  } catch (error) {
    console.error('GET horaires error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des horaires' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    const data = await request.json();

    const docRef = await adminDb.collection('opening_hours').add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: 'Horaires créés avec succès',
    });
  } catch (error) {
    console.error('POST horaires error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création des horaires' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { id, ...data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID manquant' },
        { status: 400 }
      );
    }

    await adminDb.collection('opening_hours').doc(id).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Horaires mis à jour avec succès',
    });
  } catch (error) {
    console.error('PUT horaires error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour des horaires' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID manquant' },
        { status: 400 }
      );
    }

    await adminDb.collection('opening_hours').doc(id).delete();

    return NextResponse.json({
      success: true,
      message: 'Horaires supprimés avec succès',
    });
  } catch (error) {
    console.error('DELETE horaires error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression des horaires' },
      { status: 500 }
    );
  }
}

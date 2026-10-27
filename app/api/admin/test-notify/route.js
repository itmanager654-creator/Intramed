import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { notifyInquiry } from '@/lib/notify';

export async function POST() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const results = await notifyInquiry({ name: 'Test', phone: '0300 0000000', email: '', product: 'Test notification', message: 'This is a test alert from the admin dashboard.' });
  return NextResponse.json({ results });
}

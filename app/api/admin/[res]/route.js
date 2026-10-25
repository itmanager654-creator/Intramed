import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'item';
const no = (m, s = 400) => NextResponse.json({ error: m }, { status: s });

async function uniqueSlug(sql, category, name, ignoreId = 0) {
  const base = slugify(name);
  let slug = base, n = 1;
  for (;;) {
    const hit = await sql`select id from products where category = ${category} and slug = ${slug} and id <> ${ignoreId}`;
    if (!hit.length) return slug;
    slug = `${base}-${++n}`;
  }
}

export async function GET(_req, { params }) {
  if (!(await isAdmin())) return no('Unauthorized', 401);
  const sql = db();
  if (params.res === 'products') return NextResponse.json(await sql`select * from products order by category, sort, id`);
  if (params.res === 'gallery') return NextResponse.json(await sql`select * from gallery order by id desc`);
  if (params.res === 'inquiries') return NextResponse.json(await sql`select * from inquiries order by id desc limit 300`);
  if (params.res === 'featured') return NextResponse.json(await sql`select * from featured order by sort, id`);
  if (params.res === 'partners') return NextResponse.json(await sql`select * from partners order by sort, id`);
  if (params.res === 'clients') return NextResponse.json(await sql`select * from clients order by sort, id`);
  return no('Not found', 404);
}

export async function POST(req, { params }) {
  if (!(await isAdmin())) return no('Unauthorized', 401);
  const sql = db(); const b = await req.json();
  if (params.res === 'products') {
    if (!b.name?.trim() || !b.category) return no('Name and category are required');
    const slug = await uniqueSlug(sql, b.category, b.name);
    const r = await sql`insert into products (category, slug, name, spec, description, image_url, sort)
      values (${b.category}, ${slug}, ${b.name.trim()}, ${b.spec || ''}, ${b.description || ''}, ${b.image_url || ''}, ${Number(b.sort) || 0}) returning *`;
    return NextResponse.json(r[0]);
  }
  if (params.res === 'gallery') {
    if (!b.url) return no('Image is required');
    const r = await sql`insert into gallery (url, category, caption) values (${b.url}, ${b.category || ''}, ${b.caption || ''}) returning *`;
    return NextResponse.json(r[0]);
  }
  if (params.res === 'featured') {
    if (!b.title?.trim()) return no('Title is required');
    const r = await sql`insert into featured (title, tag, description, image_url, sort) values (${b.title.trim()}, ${b.tag || ''}, ${b.description || ''}, ${b.image_url || ''}, ${Number(b.sort) || 0}) returning *`;
    return NextResponse.json(r[0]);
  }
  if (params.res === 'partners') {
    if (!b.name?.trim()) return no('Name is required');
    const r = await sql`insert into partners (name, description, logo_url, sort) values (${b.name.trim()}, ${b.description || ''}, ${b.logo_url || ''}, ${Number(b.sort) || 0}) returning *`;
    return NextResponse.json(r[0]);
  }
  if (params.res === 'clients') {
    if (!b.label?.trim()) return no('Client name is required');
    const r = await sql`insert into clients (label, logo_url, sort) values (${b.label.trim()}, ${b.logo_url || ''}, ${Number(b.sort) || 0}) returning *`;
    return NextResponse.json(r[0]);
  }
  return no('Not found', 404);
}

export async function PUT(req, { params }) {
  if (!(await isAdmin())) return no('Unauthorized', 401);
  const sql = db(); const b = await req.json();
  if (params.res !== 'products' || !b.id) return no('Not found', 404);
  const slug = await uniqueSlug(sql, b.category, b.name, Number(b.id));
  const r = await sql`update products set category = ${b.category}, slug = ${slug}, name = ${b.name.trim()}, spec = ${b.spec || ''},
    description = ${b.description || ''}, image_url = ${b.image_url || ''}, sort = ${Number(b.sort) || 0} where id = ${Number(b.id)} returning *`;
  return NextResponse.json(r[0] || {});
}

export async function PATCH(req, { params }) {
  if (!(await isAdmin())) return no('Unauthorized', 401);
  const b = await req.json();
  if (params.res !== 'inquiries') return no('Not found', 404);
  await db()`update inquiries set status = ${b.status} where id = ${Number(b.id)}`;
  return NextResponse.json({ ok: true });
}

export async function DELETE(req, { params }) {
  if (!(await isAdmin())) return no('Unauthorized', 401);
  const sql = db(); const id = Number(new URL(req.url).searchParams.get('id'));
  if (!id) return no('Missing id');
  if (params.res === 'products') await sql`delete from products where id = ${id}`;
  else if (params.res === 'gallery') await sql`delete from gallery where id = ${id}`;
  else if (params.res === 'inquiries') await sql`delete from inquiries where id = ${id}`;
  else if (params.res === 'featured') await sql`delete from featured where id = ${id}`;
  else if (params.res === 'partners') await sql`delete from partners where id = ${id}`;
  else if (params.res === 'clients') await sql`delete from clients where id = ${id}`;
  else return no('Not found', 404);
  return NextResponse.json({ ok: true });
}

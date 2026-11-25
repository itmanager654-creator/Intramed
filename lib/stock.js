import { queryStrict } from '@/lib/db';

const num = (x) => Number(x) || 0;

// Stock on hand, average cost and value for every item. Sales (kind 'out') come from invoices.
export async function stockRows() {
  const rows = await queryStrict`select s.id, s.name, s.reorder_level,
    coalesce(sum(case when m.kind = 'in' then m.qty when m.kind = 'out' then -m.qty else 0 end), 0) as on_hand,
    coalesce(sum(case when m.kind = 'in' then m.qty * m.unit_cost end) / nullif(sum(case when m.kind = 'in' then m.qty end), 0), 0) as avg_cost,
    to_char(max(case when m.kind = 'out' then m.moved_on end), 'YYYY-MM-DD') as last_sold
    from stock_items s left join stock_movements m on m.item_id = s.id
    group by s.id, s.name, s.reorder_level order by s.name`;
  return rows.map((r) => {
    const on = num(r.on_hand);
    const avg = num(r.avg_cost);
    const reorder = num(r.reorder_level);
    return {
      id: r.id, name: r.name, reorder_level: reorder, on_hand: on, avg_cost: avg,
      value: on > 0 ? on * avg : 0, last_sold: r.last_sold,
      status: on < 0 ? 'Negative' : on === 0 ? 'Out of stock' : on <= reorder ? 'Low' : 'OK',
    };
  });
}

// Find an item by name (case-insensitive) or create it. Returns its id.
export async function itemIdFor(name) {
  const clean = String(name || '').trim();
  const found = await queryStrict`select id from stock_items where lower(name) = lower(${clean}) limit 1`;
  if (found.length) return found[0].id;
  const made = await queryStrict`insert into stock_items (name) values (${clean}) on conflict do nothing returning id`;
  if (made.length) return made[0].id;
  const again = await queryStrict`select id from stock_items where lower(name) = lower(${clean}) limit 1`;
  return again[0].id;
}

// Weighted average purchase cost of an item (used as cost of goods sold).
export async function avgCost(itemId) {
  const [r] = await queryStrict`select coalesce(sum(qty * unit_cost) / nullif(sum(qty), 0), 0) as avg from stock_movements where item_id = ${itemId} and kind = 'in'`;
  return num(r.avg);
}

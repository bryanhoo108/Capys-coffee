import { useState } from 'react';
import { Pencil, Plus, Star, Trash2, FolderPlus } from 'lucide-react';
import DrinkArt from '../components/DrinkArt.jsx';
import { Confirm, Sheet, SheetHeader, Spinner, Switch, useToast } from '../components/ui.jsx';
import { api } from '../lib/api.js';
import { rm } from '../lib/format.js';
import { CUP_LOOKS, GARNISH_OPTIONS } from '../lib/cupLooks.js';
import { useStaff } from './StaffApp.jsx';

const sameLayers = (a, b) => JSON.stringify(a.layers) === JSON.stringify(b.layers);

/* ---------------- Add / edit a drink ---------------- */

function ItemForm({ item, categories, optionGroups, defaultCategory, onClose, onSaved, onDeleted }) {
  const isNew = !item;
  const [form, setForm] = useState(() => ({
    name: item?.name || '', nameZh: item?.nameZh || '', tagline: item?.tagline || '', taglineZh: item?.taglineZh || '',
    description: item?.description || '', descriptionZh: item?.descriptionZh || '',
    price: item ? (item.price / 100).toFixed(2) : '', categoryId: item?.categoryId || defaultCategory || categories[0]?.id || '',
    number: item?.number ?? '', featured: item?.featured || false, available: item?.available ?? true,
    options: item?.options || optionGroups.map((g) => g.id),
    art: item?.art || CUP_LOOKS[1].art,
  }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const set = (k) => (e) => { setError(''); setForm((f) => ({ ...f, [k]: e.target.value })); };
  const setArt = (patch) => setForm((f) => ({ ...f, art: { ...f.art, ...patch } }));

  const pickLook = (look) => {
    setForm((f) => {
      const keepGarnish = f.art.garnish && !['foam', 'goldfish'].includes(f.art.garnish) && !look.art.garnish ? { garnish: f.art.garnish } : {};
      return { ...f, art: { ...look.art, ...keepGarnish } };
    });
  };

  const save = async () => {
    setError('');
    const price = Math.round(Number(form.price) * 100);
    if (!form.name.trim()) { setError('Give the drink a name'); return; }
    if (form.price === '' || !Number.isFinite(price) || price < 0) { setError('Enter a price, e.g. 9.00'); return; }
    if (!form.categoryId) { setError('Choose a category'); return; }
    const body = { ...form, price, number: form.number === '' ? null : Number(form.number) };
    setBusy(true);
    try {
      if (isNew) await api.post('/api/staff/items', body);
      else await api.patch(`/api/staff/items/${item.id}`, body);
      onSaved(isNew ? `${form.name.trim()} added to the menu` : 'Menu updated');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await api.del(`/api/staff/items/${item.id}`);
      onDeleted(`${item.name} removed from the menu`);
    } catch (e) {
      setError(e.message);
      setConfirmDelete(false);
    } finally {
      setBusy(false);
    }
  };

  const garnish = form.art.garnish && form.art.garnish !== 'foam' ? form.art.garnish : '';

  return (
    <Sheet open onClose={onClose} label={isNew ? 'New drink' : `Edit ${item.name}`} size="lg">
      <SheetHeader title={isNew ? 'New drink' : 'Edit drink'} subtitle={isNew ? 'It appears on customers’ phones as soon as you save.' : item.name} onClose={onClose} />
      <div className="sheet-body item-form">
        <div className="art-editor">
          <div className="art-preview" style={{ background: form.art.tint }}>
            <DrinkArt art={form.art} size={96} title="Preview" />
          </div>
          <div className="art-controls">
            <span className="field-label">Cup look</span>
            <div className="look-grid" role="radiogroup" aria-label="Cup look">
              {CUP_LOOKS.map((l) => {
                const active = sameLayers(l.art, form.art);
                return (
                  <button key={l.id} type="button" role="radio" aria-checked={active} className={`look ${active ? 'is-active' : ''}`}
                    style={{ background: l.art.tint }} onClick={() => pickLook(l)} title={l.label}>
                    <DrinkArt art={{ ...l.art, garnish: undefined }} size={30} title={l.label} />
                    <span>{l.label}</span>
                  </button>
                );
              })}
            </div>
            <span className="field-label">Garnish</span>
            <div className="opt-choices compact">
              {GARNISH_OPTIONS.map((g) => (
                <button key={g.id} type="button" className={`opt-chip ${garnish === g.id ? 'is-active' : ''}`}
                  onClick={() => setArt({ garnish: g.id || (form.art.garnish === 'foam' ? 'foam' : undefined) })}>{g.label}</button>
              ))}
            </div>
            <label className="check-row">
              <input type="checkbox" checked={!form.art.noIce} onChange={(e) => setArt({ noIce: !e.target.checked })} /> Show ice cubes
            </label>
          </div>
        </div>

        <div className="form-grid">
          <label className="field"><span className="field-label">Name (English)</span><input className="input" maxLength={60} value={form.name} onChange={set('name')} placeholder="e.g. Hot Latte" /></label>
          <label className="field"><span className="field-label">Name (中文) <em>optional</em></span><input className="input" maxLength={30} value={form.nameZh} onChange={set('nameZh')} placeholder="例如 热拿铁" /></label>
        </div>
        <div className="form-grid three">
          <label className="field">
            <span className="field-label">Price</span>
            <div className="money-input"><span>RM</span><input type="number" inputMode="decimal" min="0" step="0.10" value={form.price} onChange={set('price')} placeholder="9.00" aria-label="Price in ringgit" /></div>
          </label>
          <label className="field">
            <span className="field-label">Category</span>
            <select className="input" value={form.categoryId} onChange={set('categoryId')}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Menu no. <em>optional</em></span>
            <input className="input" type="number" min="1" max="999" value={form.number} onChange={set('number')} placeholder="—" />
          </label>
        </div>
        <div className="form-grid">
          <label className="field"><span className="field-label">Tagline <em>optional</em></span><input className="input" maxLength={40} value={form.tagline} onChange={set('tagline')} placeholder="e.g. Warm & Cosy" /></label>
          <label className="field"><span className="field-label">Tagline (中文) <em>optional</em></span><input className="input" maxLength={30} value={form.taglineZh} onChange={set('taglineZh')} /></label>
        </div>
        <label className="field"><span className="field-label">Description <em>optional</em></span><textarea className="input" rows={2} maxLength={240} value={form.description} onChange={set('description')} /></label>
        <label className="field"><span className="field-label">Description (中文) <em>optional</em></span><textarea className="input" rows={2} maxLength={120} value={form.descriptionZh} onChange={set('descriptionZh')} /></label>

        <fieldset className="opt-group">
          <legend>Customers can choose</legend>
          {optionGroups.map((g) => (
            <label key={g.id} className="check-row">
              <input type="checkbox" checked={form.options.includes(g.id)}
                onChange={(e) => setForm((f) => ({ ...f, options: e.target.checked ? [...f.options, g.id] : f.options.filter((x) => x !== g.id) }))} />
              {g.name} <span className="muted small">({g.choices.map((c) => c.name).join(' / ')})</span>
            </label>
          ))}
        </fieldset>

        <label className="switch-row">
          <Switch checked={form.featured} onChange={(v) => setForm((f) => ({ ...f, featured: v }))} label="Feature on the menu banner" />
          <span><strong>Feature on the menu banner</strong><br /><span className="muted small">Shown as the big picture at the top of the customer menu.</span></span>
        </label>
        {isNew && (
          <label className="switch-row">
            <Switch checked={form.available} onChange={(v) => setForm((f) => ({ ...f, available: v }))} label="Available now" />
            <span><strong>Available now</strong><br /><span className="muted small">Turn off to add it as “Sold out” and switch it on later.</span></span>
          </label>
        )}
        {error && <p className="form-alert" role="alert">{error}</p>}
      </div>
      <div className="sheet-footer">
        {!isNew && (
          <button type="button" className="btn btn-danger-ghost" onClick={() => setConfirmDelete(true)}><Trash2 size={17} /> Remove</button>
        )}
        <span className="grow" />
        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button type="button" className="btn btn-primary" onClick={save} disabled={busy}>{busy ? <Spinner /> : isNew ? 'Add to menu' : 'Save changes'}</button>
      </div>
      <Confirm
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title={`Remove ${item?.name}?`}
        body="It disappears from the menu straight away. Past orders and reports keep it. If you only ran out for today, use the Available switch instead."
        confirmLabel="Remove from menu"
        tone="danger"
        busy={busy}
        onConfirm={remove}
      />
    </Sheet>
  );
}

/* ---------------- Add / rename a category ---------------- */

function CategoryForm({ category, onClose, onSaved }) {
  const [name, setName] = useState(category?.name || '');
  const [nameZh, setNameZh] = useState(category?.nameZh || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const save = async () => {
    if (!name.trim()) { setError('Give the category a name'); return; }
    setBusy(true);
    try {
      if (category) await api.patch(`/api/staff/categories/${category.id}`, { name, nameZh });
      else await api.post('/api/staff/categories', { name, nameZh });
      onSaved(category ? 'Category renamed' : `${name.trim()} added`);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Sheet open onClose={onClose} label={category ? 'Rename category' : 'New category'} size="sm">
      <SheetHeader title={category ? 'Rename category' : 'New category'} subtitle={category ? category.name : 'A new section on the menu, e.g. Hot drinks or Snacks.'} onClose={onClose} />
      <div className="sheet-body">
        <label className="field"><span className="field-label">Name (English)</span><input className="input" maxLength={30} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Hot drinks" /></label>
        <label className="field"><span className="field-label">Name (中文) <em>optional</em></span><input className="input" maxLength={20} value={nameZh} onChange={(e) => setNameZh(e.target.value)} placeholder="例如 热饮" /></label>
        {error && <p className="form-alert" role="alert">{error}</p>}
      </div>
      <div className="sheet-footer two">
        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button type="button" className="btn btn-primary" onClick={save} disabled={busy}>{busy ? <Spinner /> : category ? 'Save' : 'Add category'}</button>
      </div>
    </Sheet>
  );
}

/* ---------------- Page ---------------- */

export default function MenuAdmin() {
  const { menu, setMenu, handleError } = useStaff();
  const toast = useToast();
  const [editing, setEditing] = useState(null); // { item } to edit, { newIn: categoryId } to add
  const [catForm, setCatForm] = useState(null); // { category } to rename, {} to add
  const [removingCat, setRemovingCat] = useState(null);
  const [pending, setPending] = useState({});

  const refresh = () => api.get('/api/menu').then(setMenu).catch(handleError);
  const done = (msg) => { setEditing(null); setCatForm(null); refresh(); toast(msg); };

  const patch = async (item, body, msg) => {
    setPending((p) => ({ ...p, [item.id]: true }));
    setMenu((m) => ({ ...m, items: m.items.map((i) => (i.id === item.id ? { ...i, ...body } : i)) }));
    try {
      await api.patch(`/api/staff/items/${item.id}`, body);
      if (msg) toast(msg);
    } catch (e) {
      handleError(e);
      refresh();
    } finally {
      setPending((p) => ({ ...p, [item.id]: false }));
    }
  };

  const removeCategory = async () => {
    try {
      await api.del(`/api/staff/categories/${removingCat.id}`);
      toast(`${removingCat.name} removed`);
      refresh();
    } catch (e) {
      handleError(e);
    } finally {
      setRemovingCat(null);
    }
  };

  const soldOut = menu.items.filter((i) => !i.available).length;

  return (
    <div className="page menu-admin">
      <div className="menu-admin-head">
        <p className="muted">
          Switch a drink off when you run out and it shows as <strong>Sold out</strong> on every customer’s phone straight away.
          {soldOut > 0 && <> <span className="badge badge-cancelled">{soldOut} sold out</span></>}
        </p>
        <div className="row-actions tight">
          <button type="button" className="btn btn-ghost" onClick={() => setCatForm({})}><FolderPlus size={17} /> New category</button>
          <button type="button" className="btn btn-primary" onClick={() => setEditing({ newIn: null })}><Plus size={18} /> New drink</button>
        </div>
      </div>

      {menu.categories.map((c) => {
        const items = menu.items.filter((i) => i.categoryId === c.id);
        return (
          <section key={c.id} className="card admin-cat">
            <div className="admin-cat-head">
              <h2>{c.name} <span className="muted">{c.nameZh}</span> <span className="count-pill">{items.length}</span></h2>
              <div className="admin-cat-actions">
                <button type="button" className="icon-btn sm" onClick={() => setCatForm({ category: c })} aria-label={`Rename ${c.name}`}><Pencil size={15} /></button>
                <button type="button" className="icon-btn sm" onClick={() => (items.length ? toast(`Move or remove the drinks in ${c.name} first`, 'error') : setRemovingCat(c))} aria-label={`Remove ${c.name}`}><Trash2 size={15} /></button>
              </div>
            </div>
            {items.length === 0 ? <p className="muted empty-cat">No drinks here yet.</p> : (
              <ul className="admin-items">
                {items.map((i) => (
                  <li key={i.id} className={i.available ? '' : 'is-soldout'}>
                    <span className="ai-art" style={{ background: i.art.tint }}><DrinkArt art={i.art} size={40} /></span>
                    <button type="button" className="ai-name" onClick={() => setEditing({ item: i })}>
                      <strong>{i.number && <span className="ai-no">{String(i.number).padStart(2, '0')}</span>}{i.name}{i.featured && <Star size={14} className="star" fill="currentColor" />}</strong>
                      <span className="muted small">{[i.nameZh, i.tagline].filter(Boolean).join(' · ') || 'Tap to edit'}</span>
                    </button>
                    <span className="ai-price">{rm(i.price)}</span>
                    <label className="ai-avail">
                      <Switch checked={i.available} disabled={pending[i.id]} label={`${i.name} available`}
                        onChange={(v) => patch(i, { available: v }, v ? `${i.name} is back on` : `${i.name} marked sold out`)} />
                      <span className={i.available ? 'ok' : 'off'}>{i.available ? 'Available' : 'Sold out'}</span>
                    </label>
                    <button type="button" className="icon-btn" onClick={() => setEditing({ item: i })} aria-label={`Edit ${i.name}`}><Pencil size={17} /></button>
                  </li>
                ))}
              </ul>
            )}
            <button type="button" className="add-here" onClick={() => setEditing({ newIn: c.id })}><Plus size={16} /> Add a drink to {c.name}</button>
          </section>
        );
      })}

      {editing && (
        <ItemForm
          item={editing.item}
          defaultCategory={editing.newIn}
          categories={menu.categories}
          optionGroups={menu.optionGroups}
          onClose={() => setEditing(null)}
          onSaved={done}
          onDeleted={done}
        />
      )}
      {catForm && <CategoryForm category={catForm.category} onClose={() => setCatForm(null)} onSaved={done} />}
      <Confirm
        open={!!removingCat}
        onClose={() => setRemovingCat(null)}
        title={`Remove ${removingCat?.name}?`}
        body="The empty category disappears from the menu."
        confirmLabel="Remove category"
        tone="danger"
        onConfirm={removeCategory}
      />
    </div>
  );
}

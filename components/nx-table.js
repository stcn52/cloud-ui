/* NxTable — enterprise data table for NextCli component library
 * ---------------------------------------------------------------
 * Usage:
 *   const t = new NxTable(el, {
 *     data,                // array of row objects
 *     columns,             // see below
 *     getRowId: r => r.id,
 *     selectable: 'multi'| 'single' | false,
 *     density: 'compact' | 'normal' | 'comfy',
 *     paginate: true, pageSize: 20,
 *     search: true,        // global search box
 *     showToolbar: true,   // density/columns/export/search
 *     persistKey: 'vps',   // saves UI state to localStorage
 *     onAction: (action, payload) => {},
 *   });
 *
 * Column shape:
 *   {
 *     key: 'name',
 *     label: 'Instance',
 *     type: 'text'|'number'|'money'|'status'|'date'|'bar'|'custom',
 *     width: 200,           // initial px
 *     minWidth: 80,
 *     pinned: 'left'|'right'|null,
 *     sortable: true,
 *     filterable: true,
 *     filterKind: 'text'|'select'|'range',
 *     options: ['active','idle'],
 *     editable: true,
 *     align: 'left'|'right'|'center',
 *     render: (value, row) => htmlString,
 *     formatter: (value, row) => string,   // for export + sorting
 *     hidden: false,
 *   }
 */
(function () {
  'use strict';

  const svg = {
    sortAsc:  '<svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M6 3l3 4H3z" fill="currentColor"/></svg>',
    sortDesc: '<svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M6 9L3 5h6z" fill="currentColor"/></svg>',
    sortNone: '<svg viewBox="0 0 12 12" width="10" height="10" class="muted" aria-hidden="true"><path d="M6 3l2.5 3H3.5zM6 9L3.5 6h5z" fill="currentColor" opacity=".35"/></svg>',
    funnel:   '<svg viewBox="0 0 14 14" width="11" height="11" aria-hidden="true"><path d="M2 3h10l-3.6 4.6V11l-2.8 1V7.6z" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linejoin="round"/></svg>',
    pin:      '<svg viewBox="0 0 14 14" width="11" height="11" aria-hidden="true"><path d="M5 2h4l-.6 3 2.1 1.6-1 1.4-2-.1L7 12 6 8H4l-.5-1.5L5.6 5z" fill="currentColor"/></svg>',
    cols:     '<svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true"><path d="M2 3h10v8H2zM6 3v8M10 3v8" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>',
    download: '<svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true"><path d="M7 2v7m0 0l-2.5-2.5M7 9l2.5-2.5M2.5 11.5h9" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>',
    plus:     '<svg viewBox="0 0 14 14" width="11" height="11" aria-hidden="true"><path d="M7 3v8M3 7h8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    chev:     '<svg viewBox="0 0 14 14" width="11" height="11" aria-hidden="true"><path d="M4 6l3 3 3-3" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevRight:'<svg viewBox="0 0 14 14" width="11" height="11" aria-hidden="true"><path d="M5 4l3 3-3 3" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cross:    '<svg viewBox="0 0 14 14" width="10" height="10" aria-hidden="true"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    search:   '<svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true"><circle cx="6" cy="6" r="3.5" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M8.5 8.5L11 11" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
    dots:     '<svg viewBox="0 0 14 14" width="11" height="11" aria-hidden="true"><circle cx="3.5" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="10.5" cy="7" r="1" fill="currentColor"/></svg>',
  };

  const fmtMoney = v => '¥' + (Number(v) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtNumber = v => (Number(v) || 0).toLocaleString();
  const fmtDate = v => {
    if (!v) return '—';
    const d = v instanceof Date ? v : new Date(v);
    if (isNaN(d)) return String(v);
    const Y = d.getFullYear(), M = String(d.getMonth() + 1).padStart(2, '0'), D = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0'), m = String(d.getMinutes()).padStart(2, '0');
    return `${Y}-${M}-${D} ${h}:${m}`;
  };
  const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

  // --- core class ---
  class NxTable {
    constructor(el, opts = {}) {
      this.el = el; el.classList.add('nxt');
      this.opts = Object.assign({
        data: [],
        columns: [],
        getRowId: (r, i) => r.id ?? i,
        selectable: false,
        density: 'normal',
        paginate: true,
        pageSize: 20,
        search: true,
        showToolbar: true,
        persistKey: null,
        emptyText: 'No matching rows.',
        loadingRows: 0,
        onAction: () => {},
        rowClickSelects: true,   // click row → select (with shift/cmd modifiers)
        lasso: 'auto',           // true | false | 'auto' (auto = on if selectable === 'multi')
        contextMenu: null,       // (row, table) => items[] or null to use defaults; false to disable
      }, opts);

      // State
      this.columns = this.opts.columns.map((c, i) => Object.assign({
        width: 140, minWidth: 60, sortable: true, filterable: false, hidden: false, pinned: null, align: 'left',
        order: i,
      }, c));
      this.data = (this.opts.data || []).slice();
      this.state = {
        sort: [],            // [{key, dir}]
        globalFilter: '',
        colFilters: {},      // key -> {kind, value}
        selected: new Set(),
        page: 0,
        density: this.opts.density,
        editing: null,       // {rowId, key}
        expanded: new Set(),
      };

      this._restore();
      this._build();
      this.refresh();
    }

    // ---- persistence ----
    _persistKey() { return this.opts.persistKey ? `nxt.${this.opts.persistKey}` : null; }
    _persist() {
      const key = this._persistKey(); if (!key) return;
      try {
        localStorage.setItem(key, JSON.stringify({
          columns: this.columns.map(c => ({ key: c.key, width: c.width, hidden: c.hidden, pinned: c.pinned, order: c.order })),
          sort: this.state.sort,
          density: this.state.density,
          pageSize: this.opts.pageSize,
        }));
      } catch (e) {}
    }
    _restore() {
      const key = this._persistKey(); if (!key) return;
      try {
        const s = JSON.parse(localStorage.getItem(key) || 'null'); if (!s) return;
        if (s.columns) {
          s.columns.forEach(sc => {
            const c = this.columns.find(c => c.key === sc.key); if (!c) return;
            if (sc.width != null) c.width = sc.width;
            if (sc.hidden != null) c.hidden = sc.hidden;
            if (sc.pinned !== undefined) c.pinned = sc.pinned;
            if (sc.order != null) c.order = sc.order;
          });
          this.columns.sort((a, b) => a.order - b.order);
        }
        if (s.sort) this.state.sort = s.sort;
        if (s.density) this.state.density = s.density;
        if (s.pageSize) this.opts.pageSize = s.pageSize;
      } catch (e) {}
    }

    // ---- public API ----
    setData(data) { this.data = data.slice(); this.state.page = 0; this.refresh(); }
    addRow(row) { this.data.push(row); this.refresh(); }
    removeRows(ids) {
      const set = new Set(ids); this.data = this.data.filter((r, i) => !set.has(this.opts.getRowId(r, i)));
      this.state.selected.clear(); this.refresh();
    }
    getSelectedRows() {
      return this.data.filter((r, i) => this.state.selected.has(this.opts.getRowId(r, i)));
    }
    clearFilters() { this.state.colFilters = {}; this.state.globalFilter = ''; this.refresh(); }

    // ---- build skeleton ----
    _build() {
      this.el.innerHTML = `
        <div class="nxt-toolbar"></div>
        <div class="nxt-active-filters"></div>
        <div class="nxt-bulk"></div>
        <div class="nxt-scroll">
          <table class="nxt-table">
            <colgroup></colgroup>
            <thead></thead>
            <tbody></tbody>
          </table>
        </div>
        <div class="nxt-footer"></div>
      `;
      this.$toolbar  = this.el.querySelector('.nxt-toolbar');
      this.$filters  = this.el.querySelector('.nxt-active-filters');
      this.$bulk     = this.el.querySelector('.nxt-bulk');
      this.$scroll   = this.el.querySelector('.nxt-scroll');
      this.$colgroup = this.el.querySelector('colgroup');
      this.$thead    = this.el.querySelector('thead');
      this.$tbody    = this.el.querySelector('tbody');
      this.$footer   = this.el.querySelector('.nxt-footer');

      // Last selection anchor for shift-range
      this._lastSelId = null;

      // Lasso (box) select
      const lassoOn = this.opts.lasso === true
        || (this.opts.lasso === 'auto' && this.opts.selectable === 'multi');
      if (lassoOn) this._bindLasso();

      // Close popovers on outside click + escape
      this._docClickClose = e => {
        if (!e.target.closest('.nxt-pop')) this._closePopovers();
      };
      this._docKeyClose = e => {
        if (e.key === 'Escape') this._closePopovers();
      };
      document.addEventListener('mousedown', this._docClickClose, true);
      document.addEventListener('keydown', this._docKeyClose);
    }

    // ---- visible columns sorted by pin then order ----
    _orderedColumns() {
      const visible = this.columns.filter(c => !c.hidden);
      const pinL = visible.filter(c => c.pinned === 'left');
      const pinR = visible.filter(c => c.pinned === 'right');
      const mid  = visible.filter(c => !c.pinned);
      return [...pinL, ...mid, ...pinR];
    }

    // ---- filter + sort pipeline ----
    _processed() {
      let rows = this.data.map((r, i) => ({ r, i, id: this.opts.getRowId(r, i) }));

      // Global search
      const q = this.state.globalFilter.trim().toLowerCase();
      if (q) {
        const cols = this.columns.filter(c => !c.hidden);
        rows = rows.filter(({ r }) => cols.some(c => {
          const v = r[c.key];
          return v != null && String(v).toLowerCase().includes(q);
        }));
      }

      // Per-column filters
      for (const k in this.state.colFilters) {
        const f = this.state.colFilters[k]; if (!f || f.value == null || f.value === '' || (Array.isArray(f.value) && f.value.length === 0)) continue;
        const col = this.columns.find(c => c.key === k); if (!col) continue;
        rows = rows.filter(({ r }) => {
          const v = r[k];
          if (f.kind === 'text') return v != null && String(v).toLowerCase().includes(String(f.value).toLowerCase());
          if (f.kind === 'select') return Array.isArray(f.value) ? f.value.includes(v) : v === f.value;
          if (f.kind === 'range') {
            const [a, b] = f.value;
            const n = Number(v);
            if (a != null && a !== '' && n < Number(a)) return false;
            if (b != null && b !== '' && n > Number(b)) return false;
            return true;
          }
          return true;
        });
      }

      // Sort
      if (this.state.sort.length) {
        rows.sort((A, B) => {
          for (const { key, dir } of this.state.sort) {
            const col = this.columns.find(c => c.key === key);
            const av = A.r[key], bv = B.r[key];
            let cmp;
            if (col && col.type === 'number' || col && col.type === 'money' || col && col.type === 'bar') {
              cmp = (Number(av) || 0) - (Number(bv) || 0);
            } else if (col && col.type === 'date') {
              cmp = new Date(av || 0) - new Date(bv || 0);
            } else {
              cmp = String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true });
            }
            if (cmp !== 0) return dir === 'desc' ? -cmp : cmp;
          }
          return 0;
        });
      }

      return rows;
    }

    // ---- main render ----
    refresh() {
      const cols = this._orderedColumns();
      const rows = this._processed();

      // pagination
      const total = rows.length;
      const ps = this.opts.pageSize;
      const totalPages = this.opts.paginate ? Math.max(1, Math.ceil(total / ps)) : 1;
      if (this.state.page >= totalPages) this.state.page = totalPages - 1;
      const start = this.opts.paginate ? this.state.page * ps : 0;
      const end   = this.opts.paginate ? Math.min(start + ps, total) : total;
      const pageRows = rows.slice(start, end);

      // density class
      this.el.dataset.density = this.state.density;

      this._renderToolbar(total);
      this._renderActiveFilters();
      this._renderBulk();
      this._renderColgroup(cols);
      this._renderHead(cols);
      this._renderBody(cols, pageRows);
      this._renderFooter(total, totalPages, start, end);
      this._persist();
    }

    // ---- toolbar ----
    _renderToolbar(total) {
      if (!this.opts.showToolbar) { this.$toolbar.innerHTML = ''; return; }
      const t = this;
      this.$toolbar.innerHTML = `
        <div class="nxt-tb-left">
          ${this.opts.search ? `
          <label class="nxt-search">
            ${svg.search}
            <input type="search" placeholder="Search ${total} rows…" value="${escapeHtml(this.state.globalFilter)}">
          </label>` : ''}
          ${this._slot('toolbarLeft')}
        </div>
        <div class="nxt-tb-right">
          <div class="nxt-density">
            <button data-d="compact" class="${this.state.density==='compact'?'on':''}" title="Compact">≡</button>
            <button data-d="normal"  class="${this.state.density==='normal'?'on':''}" title="Normal">≣</button>
            <button data-d="comfy"   class="${this.state.density==='comfy'?'on':''}" title="Comfortable">☰</button>
          </div>
          <button class="nxt-btn" data-action="columns">${svg.cols}<span>Columns</span></button>
          <button class="nxt-btn" data-action="export">${svg.download}<span>Export</span></button>
          ${this._slot('toolbarRight')}
        </div>
      `;
      // bind
      const search = this.$toolbar.querySelector('input[type=search]');
      if (search) search.addEventListener('input', e => {
        this.state.globalFilter = e.target.value; this.state.page = 0; this.refresh();
      });
      this.$toolbar.querySelectorAll('.nxt-density button').forEach(b => b.addEventListener('click', () => {
        this.state.density = b.dataset.d; this.refresh();
      }));
      this.$toolbar.querySelector('[data-action="columns"]').addEventListener('click', e => this._openColumnsMenu(e.currentTarget));
      this.$toolbar.querySelector('[data-action="export"]').addEventListener('click', () => this.exportCSV());
    }

    _slot(name) {
      const html = this.opts.slots && this.opts.slots[name];
      return html ? `<div class="nxt-slot">${html}</div>` : '';
    }

    // ---- active filters chip strip ----
    _renderActiveFilters() {
      const chips = [];
      for (const k in this.state.colFilters) {
        const f = this.state.colFilters[k]; if (!f || f.value == null || f.value === '' || (Array.isArray(f.value) && f.value.length === 0)) continue;
        const col = this.columns.find(c => c.key === k); if (!col) continue;
        let label;
        if (f.kind === 'select') label = `${col.label}: ${Array.isArray(f.value) ? f.value.join(', ') : f.value}`;
        else if (f.kind === 'range') label = `${col.label}: ${f.value[0] ?? '…'}–${f.value[1] ?? '…'}`;
        else label = `${col.label}: "${f.value}"`;
        chips.push(`<span class="nxt-fchip" data-key="${k}">${escapeHtml(label)} <button class="nxt-fchip-x" aria-label="Remove">${svg.cross}</button></span>`);
      }
      if (this.state.globalFilter) {
        chips.push(`<span class="nxt-fchip" data-key="__g">Search: "${escapeHtml(this.state.globalFilter)}" <button class="nxt-fchip-x">${svg.cross}</button></span>`);
      }
      if (this.state.sort.length) {
        chips.push(`<span class="nxt-fchip subtle">Sort: ${this.state.sort.map(s => {
          const c = this.columns.find(c => c.key === s.key); return `${c?.label || s.key} ${s.dir==='asc'?'↑':'↓'}`;
        }).join(' · ')} <button class="nxt-fchip-x" data-clear-sort>${svg.cross}</button></span>`);
      }
      if (!chips.length) { this.$filters.innerHTML = ''; this.$filters.style.display = 'none'; return; }
      this.$filters.style.display = 'flex';
      this.$filters.innerHTML = chips.join('') + `<button class="nxt-link-btn" data-clear>Clear all</button>`;
      this.$filters.querySelectorAll('.nxt-fchip').forEach(ch => {
        ch.querySelector('.nxt-fchip-x').addEventListener('click', () => {
          if (ch.dataset.key === '__g') { this.state.globalFilter = ''; }
          else if (ch.querySelector('[data-clear-sort]')) { this.state.sort = []; }
          else { delete this.state.colFilters[ch.dataset.key]; }
          this.state.page = 0; this.refresh();
        });
      });
      this.$filters.querySelector('[data-clear]').addEventListener('click', () => {
        this.state.colFilters = {}; this.state.globalFilter = ''; this.state.sort = []; this.state.page = 0; this.refresh();
      });
    }

    // ---- bulk action sheet ----
    _renderBulk() {
      const n = this.state.selected.size;
      if (!n || this.opts.selectable !== 'multi') { this.$bulk.innerHTML = ''; this.$bulk.style.display = 'none'; return; }
      this.$bulk.style.display = 'flex';
      this.$bulk.innerHTML = `
        <span class="nxt-bulk-count"><b>${n}</b> selected</span>
        <div class="nxt-bulk-actions">
          ${(this.opts.bulkActions || ['Start','Stop','Reboot','Delete']).map(a =>
            `<button class="nxt-btn ${a==='Delete'?'danger':''}" data-bulk="${a}">${a}</button>`).join('')}
          <button class="nxt-btn ghost" data-bulk-clear>Clear</button>
        </div>
      `;
      this.$bulk.querySelectorAll('[data-bulk]').forEach(b => b.addEventListener('click', () => {
        this.opts.onAction('bulk', { action: b.dataset.bulk, rows: this.getSelectedRows() });
      }));
      this.$bulk.querySelector('[data-bulk-clear]').addEventListener('click', () => {
        this.state.selected.clear(); this.refresh();
      });
    }

    // ---- colgroup ----
    _renderColgroup(cols) {
      let html = '';
      if (this.opts.selectable) html += `<col style="width:36px">`;
      if (this.opts.expandable) html += `<col style="width:30px">`;
      for (const c of cols) html += `<col style="width:${c.width}px">`;
      this.$colgroup.innerHTML = html;
    }

    // ---- head ----
    _renderHead(cols) {
      let html = '<tr>';
      if (this.opts.selectable === 'multi') {
        const visibleIds = this._processed().map(x => x.id);
        const allOn = visibleIds.length > 0 && visibleIds.every(id => this.state.selected.has(id));
        const someOn = !allOn && visibleIds.some(id => this.state.selected.has(id));
        html += `<th class="nxt-th nxt-th-sel"><input type="checkbox" class="nxt-cb" data-sel-all ${allOn?'checked':''} ${someOn?'data-indet':''}></th>`;
      } else if (this.opts.selectable === 'single') {
        html += `<th class="nxt-th nxt-th-sel"></th>`;
      }
      if (this.opts.expandable) html += `<th class="nxt-th nxt-th-exp"></th>`;
      cols.forEach(c => {
        const s = this.state.sort.find(s => s.key === c.key);
        const sortIcon = !c.sortable ? '' : (s ? (s.dir === 'asc' ? svg.sortAsc : svg.sortDesc) : svg.sortNone);
        const pinClass = c.pinned ? `pin-${c.pinned}` : '';
        const filterActive = !!this.state.colFilters[c.key];
        html += `
          <th class="nxt-th ${pinClass} align-${c.align}" data-key="${c.key}">
            <div class="nxt-th-inner">
              <span class="nxt-th-label" data-sort>${escapeHtml(c.label)} ${sortIcon}</span>
              <div class="nxt-th-tools">
                ${c.filterable ? `<button class="nxt-th-btn ${filterActive?'on':''}" data-col-filter title="Filter">${svg.funnel}</button>` : ''}
                <button class="nxt-th-btn" data-col-menu title="Column menu">${svg.dots}</button>
              </div>
              <div class="nxt-th-resize" data-resize></div>
            </div>
          </th>`;
      });
      html += '</tr>';
      this.$thead.innerHTML = html;
      this._bindHead(cols);
    }

    _bindHead(cols) {
      // Sort
      this.$thead.querySelectorAll('[data-sort]').forEach((el, i) => {
        const col = cols[i]; if (!col || !col.sortable) return;
        el.addEventListener('click', e => {
          const shift = e.shiftKey;
          const existing = this.state.sort.find(s => s.key === col.key);
          if (!shift) {
            if (existing && existing.dir === 'asc') this.state.sort = [{ key: col.key, dir: 'desc' }];
            else if (existing && existing.dir === 'desc') this.state.sort = [];
            else this.state.sort = [{ key: col.key, dir: 'asc' }];
          } else {
            if (existing) {
              if (existing.dir === 'asc') existing.dir = 'desc';
              else this.state.sort = this.state.sort.filter(s => s.key !== col.key);
            } else this.state.sort.push({ key: col.key, dir: 'asc' });
          }
          this.refresh();
        });
      });

      // Resize handles
      this.$thead.querySelectorAll('[data-resize]').forEach((handle, i) => {
        handle.addEventListener('mousedown', e => {
          e.preventDefault();
          const col = cols[i]; const startX = e.clientX; const startW = col.width;
          const onMove = ev => { col.width = Math.max(col.minWidth, startW + (ev.clientX - startX)); this._renderColgroup(cols); };
          const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); this._persist(); };
          document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
        });
      });

      // Select all
      const selAll = this.$thead.querySelector('[data-sel-all]');
      if (selAll) {
        if (selAll.dataset.indet === '') selAll.indeterminate = true;
        selAll.addEventListener('change', () => {
          const ids = this._processed().map(x => x.id);
          if (selAll.checked) ids.forEach(id => this.state.selected.add(id));
          else ids.forEach(id => this.state.selected.delete(id));
          this.refresh();
        });
      }

      // Column filter buttons
      this.$thead.querySelectorAll('[data-col-filter]').forEach((btn, idx) => {
        // index against filterable columns only
        const fcols = cols.filter(c => c.filterable);
        const col = fcols[idx];
        btn.addEventListener('click', e => { e.stopPropagation(); this._openFilterMenu(btn, col); });
      });

      // Column menu (pin, hide)
      this.$thead.querySelectorAll('[data-col-menu]').forEach((btn, i) => {
        const col = cols[i];
        btn.addEventListener('click', e => { e.stopPropagation(); this._openColumnContext(btn, col); });
      });

      // Reorder via drag (label drag)
      this.$thead.querySelectorAll('.nxt-th-label').forEach((label, i) => {
        const col = cols[i];
        label.setAttribute('draggable', 'true');
        label.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', col.key); e.dataTransfer.effectAllowed = 'move'; });
        const th = label.closest('th');
        th.addEventListener('dragover', e => { e.preventDefault(); th.classList.add('drop-target'); });
        th.addEventListener('dragleave', () => th.classList.remove('drop-target'));
        th.addEventListener('drop', e => {
          e.preventDefault(); th.classList.remove('drop-target');
          const fromKey = e.dataTransfer.getData('text/plain');
          if (!fromKey || fromKey === col.key) return;
          this._reorderColumn(fromKey, col.key);
        });
      });
    }

    _reorderColumn(fromKey, toKey) {
      const fromCol = this.columns.find(c => c.key === fromKey);
      const toCol = this.columns.find(c => c.key === toKey);
      if (!fromCol || !toCol) return;
      // simple swap of order numbers; then renumber
      this.columns.sort((a, b) => a.order - b.order);
      const fromIdx = this.columns.indexOf(fromCol);
      const toIdx = this.columns.indexOf(toCol);
      this.columns.splice(fromIdx, 1);
      this.columns.splice(toIdx, 0, fromCol);
      this.columns.forEach((c, i) => c.order = i);
      this.refresh();
    }

    // ---- body ----
    _renderBody(cols, pageRows) {
      if (!pageRows.length) {
        const total = (this.opts.selectable ? 1 : 0) + (this.opts.expandable ? 1 : 0) + cols.length;
        this.$tbody.innerHTML = `<tr class="nxt-empty-row"><td colspan="${total}"><div class="nxt-empty">${escapeHtml(this.opts.emptyText)}</div></td></tr>`;
        return;
      }
      let html = '';
      pageRows.forEach(({ r, id }) => {
        const sel = this.state.selected.has(id);
        const expanded = this.state.expanded.has(id);
        html += `<tr class="${sel?'sel':''}" data-id="${escapeHtml(id)}">`;
        if (this.opts.selectable === 'multi') {
          html += `<td class="nxt-td-sel"><input type="checkbox" class="nxt-cb" data-sel ${sel?'checked':''}></td>`;
        } else if (this.opts.selectable === 'single') {
          html += `<td class="nxt-td-sel"><input type="radio" name="nxt-${this._id()}" class="nxt-rb" data-sel ${sel?'checked':''}></td>`;
        }
        if (this.opts.expandable) {
          html += `<td class="nxt-td-exp"><button class="nxt-exp-btn ${expanded?'open':''}" data-expand>${svg.chevRight}</button></td>`;
        }
        cols.forEach(c => {
          const v = r[c.key];
          const isEditing = this.state.editing && this.state.editing.rowId === id && this.state.editing.key === c.key;
          html += `<td class="${c.pinned?'pin-'+c.pinned:''} align-${c.align} ${c.editable?'editable':''}" data-key="${c.key}">`;
          if (isEditing) {
            html += `<input class="nxt-edit-input" value="${escapeHtml(v)}" data-edit>`;
          } else {
            html += this._renderCell(c, v, r);
          }
          html += `</td>`;
        });
        html += '</tr>';
        if (expanded && this.opts.expandRender) {
          const total = (this.opts.selectable ? 1 : 0) + (this.opts.expandable ? 1 : 0) + cols.length;
          html += `<tr class="nxt-expand-row"><td colspan="${total}"><div class="nxt-expand-pad">${this.opts.expandRender(r)}</div></td></tr>`;
        }
      });
      this.$tbody.innerHTML = html;
      this._bindBody();
    }

    _renderCell(c, v, r) {
      if (c.render) return c.render(v, r);
      if (v == null || v === '') return '<span class="muted">—</span>';
      switch (c.type) {
        case 'money':  return `<span class="mono">${fmtMoney(v)}</span>`;
        case 'number': return `<span class="mono">${fmtNumber(v)}</span>`;
        case 'date':   return `<span class="mono">${fmtDate(v)}</span>`;
        case 'status': {
          const tone = c.toneMap ? (c.toneMap[v] || 'neutral') : 'neutral';
          return `<span class="nxt-pill ${tone}"><span class="dot"></span>${escapeHtml(v)}</span>`;
        }
        case 'bar': {
          const pct = Math.max(0, Math.min(100, Number(v) || 0));
          const tone = pct >= 80 ? 'err' : pct >= 60 ? 'warn' : 'ok';
          return `<div class="nxt-mini"><div class="nxt-mini-bar ${tone}" style="width:${pct}%"></div><span class="mono">${pct.toFixed(0)}%</span></div>`;
        }
        case 'tags': {
          const arr = Array.isArray(v) ? v : [v];
          return arr.map(t => `<span class="nxt-tag">${escapeHtml(t)}</span>`).join(' ');
        }
        default: return escapeHtml(v);
      }
    }

    _bindBody() {
      // Row select via checkbox / radio
      this.$tbody.querySelectorAll('[data-sel]').forEach(cb => {
        cb.addEventListener('change', () => {
          const id = cb.closest('tr').dataset.id;
          this._selectId(id, { mode: cb.checked ? 'add' : 'remove' });
          this.refresh();
        });
        cb.addEventListener('click', e => e.stopPropagation());
      });
      // Row click → select (with shift/ctrl/cmd modifiers)
      if (this.opts.rowClickSelects && this.opts.selectable) {
        this.$tbody.querySelectorAll('tr[data-id]').forEach(tr => {
          tr.addEventListener('click', e => {
            if (e.target.closest('button, input, select, a, [data-edit], .nxt-pop')) return;
            const id = tr.dataset.id;
            const mode = e.shiftKey ? 'range'
                       : (e.metaKey || e.ctrlKey) ? 'toggle'
                       : 'single';
            this._selectId(id, { mode });
            this.refresh();
          });
        });
      }
      // Right-click context menu
      if (this.opts.contextMenu !== false) {
        this.$tbody.querySelectorAll('tr[data-id]').forEach(tr => {
          tr.addEventListener('contextmenu', e => {
            e.preventDefault();
            const id = tr.dataset.id;
            if (!this.state.selected.has(id)) {
              this._selectId(id, { mode: 'single' });
              this.refresh();
            }
            this._showContextMenu(e.clientX, e.clientY, id);
          });
        });
      }
      // Expand
      this.$tbody.querySelectorAll('[data-expand]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.closest('tr').dataset.id;
          if (this.state.expanded.has(id)) this.state.expanded.delete(id);
          else this.state.expanded.add(id);
          this.refresh();
        });
      });
      // Edit
      this.$tbody.querySelectorAll('td.editable').forEach(td => {
        td.addEventListener('dblclick', () => {
          const rowId = td.closest('tr').dataset.id;
          this.state.editing = { rowId, key: td.dataset.key };
          this.refresh();
          const input = this.$tbody.querySelector('[data-edit]');
          if (input) { input.focus(); input.select(); }
        });
      });
      const editInput = this.$tbody.querySelector('[data-edit]');
      if (editInput) {
        const commit = () => {
          const { rowId, key } = this.state.editing;
          const idx = this.data.findIndex((r, i) => this.opts.getRowId(r, i) === rowId);
          if (idx > -1) this.data[idx] = { ...this.data[idx], [key]: editInput.value };
          this.state.editing = null;
          this.opts.onAction('edit', { rowId, key, value: editInput.value });
          this.refresh();
        };
        editInput.addEventListener('blur', commit);
        editInput.addEventListener('keydown', e => {
          if (e.key === 'Enter') { e.preventDefault(); commit(); }
          if (e.key === 'Escape') { this.state.editing = null; this.refresh(); }
        });
      }
    }

    // ---- popovers ----
    _id() { if (!this._uid) this._uid = 'nxt' + Math.random().toString(36).slice(2, 7); return this._uid; }
    _closePopovers() { document.querySelectorAll('.nxt-pop').forEach(p => p.remove()); }

    // ---- Selection helpers (shared by checkbox, click, lasso, context menu) ----
    _selectId(id, { mode = 'single' } = {}) {
      const sel = this.state.selected;
      if (this.opts.selectable === 'single') {
        sel.clear();
        sel.add(id);
        this._lastSelId = id;
        return;
      }
      if (mode === 'add')    { sel.add(id); this._lastSelId = id; return; }
      if (mode === 'remove') { sel.delete(id); return; }
      if (mode === 'toggle') {
        if (sel.has(id)) sel.delete(id);
        else { sel.add(id); this._lastSelId = id; }
        return;
      }
      if (mode === 'range' && this._lastSelId != null) {
        // Range select across currently-visible rows (after filter + sort)
        const visible = this._getVisibleRows();
        const ids = visible.map(({ id }) => id);
        const a = ids.indexOf(this._lastSelId), b = ids.indexOf(id);
        if (a > -1 && b > -1) {
          const [lo, hi] = a < b ? [a, b] : [b, a];
          for (let i = lo; i <= hi; i++) sel.add(ids[i]);
        } else {
          sel.add(id);
        }
        return;
      }
      // single
      sel.clear();
      sel.add(id);
      this._lastSelId = id;
    }

    _getVisibleRows() {
      return this._processed().map(({ r, id }) => ({ r, id }));
    }

    // ---- Context menu ----
    _showContextMenu(x, y, rowId) {
      this._closePopovers();
      const row = this.data.find((r, i) => this.opts.getRowId(r, i) === rowId);
      const selectedRows = this.getSelectedRows();
      const count = selectedRows.length;

      let items;
      if (typeof this.opts.contextMenu === 'function') {
        items = this.opts.contextMenu(row, this, { selectedRows });
      }
      if (!items) {
        items = [];
        if (this.opts.expandable) {
          items.push({ label: count > 1 ? `Expand ${count} rows` : 'Expand row', icon: svg.chevRight, action: () => {
            selectedRows.forEach((r, i) => this.state.expanded.add(this.opts.getRowId(r, i)));
            this.refresh();
          }});
        }
        items.push({ label: 'Copy row as JSON', kbd: '⌘C', action: () => {
          const text = JSON.stringify(count > 1 ? selectedRows : row, null, 2);
          try { navigator.clipboard.writeText(text); } catch (_) {}
          this.opts.onAction('copy', { rows: count > 1 ? selectedRows : [row], text });
        }});
        const idCol = this.columns.find(c => c.key === 'id') || this.columns[0];
        if (idCol) {
          items.push({ label: `Copy ${idCol.label}`, action: () => {
            const text = (count > 1 ? selectedRows : [row]).map(r => r[idCol.key]).join('\n');
            try { navigator.clipboard.writeText(text); } catch (_) {}
          }});
        }
        items.push({ sep: true });
        items.push({ label: 'Select all on this page', kbd: '⌘A', action: () => {
          this._selectAllOnPage();
          this.refresh();
        }});
        items.push({ label: 'Invert selection', action: () => {
          this._invertSelection();
          this.refresh();
        }});
        items.push({ label: 'Clear selection', disabled: count === 0, action: () => {
          this.state.selected.clear();
          this.refresh();
        }});
        if (this.opts.bulkActions && this.opts.bulkActions.length) {
          items.push({ sep: true });
          this.opts.bulkActions.forEach(a => {
            const danger = /delete|remove|destroy|terminate/i.test(a);
            items.push({
              label: `${a}${count > 1 ? ` (${count})` : ''}`,
              danger,
              action: () => this.opts.onAction('bulk', { action: a, rows: this.getSelectedRows() }),
            });
          });
        }
      }

      const pop = document.createElement('div');
      pop.className = 'nxt-pop ctx-menu';
      pop.innerHTML = items.map((it, i) => {
        if (it.sep) return `<div class="nxt-menu-sep"></div>`;
        if (it.header) return `<div class="nxt-menu-h">${escapeHtml(it.header)}</div>`;
        const dis = it.disabled ? 'disabled' : '';
        return `<button class="nxt-menu-row ${it.danger ? 'danger' : ''}" data-i="${i}" ${dis}>
          ${it.icon || ''}
          <span>${escapeHtml(it.label)}</span>
          ${it.kbd ? `<span class="kbd">${escapeHtml(it.kbd)}</span>` : ''}
        </button>`;
      }).join('');

      // Position
      document.body.appendChild(pop);
      pop.style.position = 'fixed';
      const rect = pop.getBoundingClientRect();
      const vw = window.innerWidth, vh = window.innerHeight;
      const left = Math.min(x, vw - rect.width - 8);
      const top  = Math.min(y, vh - rect.height - 8);
      pop.style.left = left + 'px';
      pop.style.top  = top + 'px';
      pop.style.zIndex = 1000;

      pop.querySelectorAll('.nxt-menu-row[data-i]').forEach(btn => {
        const it = items[+btn.dataset.i];
        btn.addEventListener('click', () => {
          this._closePopovers();
          if (it.action) it.action();
        });
      });
    }

    _selectAllOnPage() {
      const rows = this._getVisibleRows();
      const start = this.opts.paginate ? (this.state.page - 1) * this.state.pageSize : 0;
      const end = this.opts.paginate ? Math.min(rows.length, start + this.state.pageSize) : rows.length;
      for (let i = start; i < end; i++) this.state.selected.add(rows[i].id);
    }
    _invertSelection() {
      const all = this._getVisibleRows();
      const next = new Set();
      all.forEach(({ id }) => { if (!this.state.selected.has(id)) next.add(id); });
      this.state.selected = next;
    }

    // ---- Lasso / box select ----
    _bindLasso() {
      const scroll = this.$scroll;
      scroll.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        // exclude interactives + headers
        if (e.target.closest('thead, button, input, select, a, [data-edit], .nxt-pop, .nxt-expand-row')) return;

        const scrollRect = scroll.getBoundingClientRect();
        const startX = e.clientX - scrollRect.left + scroll.scrollLeft;
        const startY = e.clientY - scrollRect.top  + scroll.scrollTop;
        let didMove = false;

        const box = document.createElement('div');
        box.className = 'nxt-lasso';
        const additive = e.shiftKey || e.metaKey || e.ctrlKey;
        const baseline = additive ? new Set(this.state.selected) : new Set();

        const onMove = ev => {
          const x = ev.clientX - scrollRect.left + scroll.scrollLeft;
          const y = ev.clientY - scrollRect.top  + scroll.scrollTop;
          const dx = Math.abs(x - startX), dy = Math.abs(y - startY);
          if (!didMove && (dx > 4 || dy > 4)) {
            didMove = true;
            scroll.appendChild(box);
            scroll.dataset.lasso = 'on';
            ev.preventDefault();
          }
          if (!didMove) return;
          ev.preventDefault();

          const L = Math.min(startX, x), T = Math.min(startY, y);
          const W = Math.abs(x - startX), H = Math.abs(y - startY);
          box.style.left = L + 'px';
          box.style.top  = T + 'px';
          box.style.width  = W + 'px';
          box.style.height = H + 'px';

          const next = new Set(baseline);
          this.$tbody.querySelectorAll('tr[data-id]').forEach(tr => {
            const o = tr.offsetTop;
            const h = tr.offsetHeight;
            if (o + h >= T && o <= T + H) {
              next.add(tr.dataset.id);
              tr.classList.add('in-lasso');
            } else {
              tr.classList.remove('in-lasso');
            }
          });
          this._previewSelection = next;
        };
        const onUp = () => {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          if (!didMove) return;
          this.state.selected = this._previewSelection || this.state.selected;
          this._previewSelection = null;
          box.remove();
          scroll.dataset.lasso = '';
          this.$tbody.querySelectorAll('tr.in-lasso').forEach(tr => tr.classList.remove('in-lasso'));
          // Suppress the click that would otherwise fire on mouseup
          const suppress = ev => { ev.stopPropagation(); ev.preventDefault(); };
          document.addEventListener('click', suppress, { capture: true, once: true });
          this.refresh();
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    }


    _spawnPopover(anchor, html, opts = {}) {
      this._closePopovers();
      const pop = document.createElement('div');
      pop.className = 'nxt-pop ' + (opts.cls || '');
      pop.innerHTML = html;
      document.body.appendChild(pop);
      const r = anchor.getBoundingClientRect();
      pop.style.top = (r.bottom + window.scrollY + 4) + 'px';
      let left = r.left + window.scrollX;
      const popW = pop.offsetWidth;
      if (left + popW > window.scrollX + document.documentElement.clientWidth - 8) {
        left = window.scrollX + document.documentElement.clientWidth - popW - 8;
      }
      pop.style.left = left + 'px';
      const onDoc = e => { if (!pop.contains(e.target) && e.target !== anchor) { this._closePopovers(); document.removeEventListener('mousedown', onDoc); } };
      setTimeout(() => document.addEventListener('mousedown', onDoc), 0);
      return pop;
    }

    _openColumnsMenu(anchor) {
      const items = this.columns.map(c => `
        <label class="nxt-menu-row">
          <input type="checkbox" class="nxt-cb" data-key="${c.key}" ${c.hidden?'':'checked'}>
          <span>${escapeHtml(c.label)}</span>
        </label>`).join('');
      const pop = this._spawnPopover(anchor, `<div class="nxt-menu-h">Toggle columns</div>${items}`, { cls: 'cols-menu' });
      pop.querySelectorAll('input[data-key]').forEach(cb => cb.addEventListener('change', () => {
        const col = this.columns.find(c => c.key === cb.dataset.key); col.hidden = !cb.checked; this.refresh();
      }));
    }

    _openColumnContext(anchor, col) {
      const html = `
        <button class="nxt-menu-row" data-act="pin-left">${svg.pin}<span>Pin to left</span></button>
        <button class="nxt-menu-row" data-act="pin-right">${svg.pin}<span>Pin to right</span></button>
        <button class="nxt-menu-row" data-act="unpin"><span style="width:11px"></span><span>Unpin</span></button>
        <div class="nxt-menu-sep"></div>
        <button class="nxt-menu-row" data-act="hide"><span style="width:11px"></span><span>Hide column</span></button>
        <button class="nxt-menu-row" data-act="auto"><span style="width:11px"></span><span>Auto-size</span></button>
      `;
      const pop = this._spawnPopover(anchor, html);
      pop.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', () => {
        const a = b.dataset.act;
        if (a === 'pin-left') col.pinned = 'left';
        else if (a === 'pin-right') col.pinned = 'right';
        else if (a === 'unpin') col.pinned = null;
        else if (a === 'hide') col.hidden = true;
        else if (a === 'auto') col.width = Math.max(col.minWidth, (col.label.length * 9) + 70);
        this._closePopovers(); this.refresh();
      }));
    }

    _openFilterMenu(anchor, col) {
      const f = this.state.colFilters[col.key] || { kind: col.filterKind || 'text', value: '' };
      let body = '';
      if (f.kind === 'select') {
        const opts = col.options || [];
        const sel = Array.isArray(f.value) ? f.value : [];
        body = `<div class="nxt-menu-h">Filter by ${escapeHtml(col.label)}</div>` +
          opts.map(o => `
            <label class="nxt-menu-row">
              <input type="checkbox" class="nxt-cb" data-opt value="${escapeHtml(o)}" ${sel.includes(o)?'checked':''}>
              <span>${escapeHtml(o)}</span>
            </label>`).join('');
      } else if (f.kind === 'range') {
        const [a, b] = Array.isArray(f.value) ? f.value : ['', ''];
        body = `<div class="nxt-menu-h">Filter range</div>
          <div class="nxt-menu-row" style="gap:8px">
            <input type="number" class="nxt-input" placeholder="Min" value="${a ?? ''}" data-min>
            <span class="muted">–</span>
            <input type="number" class="nxt-input" placeholder="Max" value="${b ?? ''}" data-max>
          </div>`;
      } else {
        body = `<div class="nxt-menu-h">Filter ${escapeHtml(col.label)}</div>
          <div class="nxt-menu-row"><input type="text" class="nxt-input" placeholder="Contains…" value="${escapeHtml(f.value||'')}" data-text></div>`;
      }
      const foot = `
        <div class="nxt-menu-sep"></div>
        <div class="nxt-menu-foot">
          <button class="nxt-link-btn" data-clear>Clear</button>
          <button class="nxt-btn primary" data-apply>Apply</button>
        </div>`;
      const pop = this._spawnPopover(anchor, body + foot, { cls: 'filter-menu' });
      const commit = () => {
        let value;
        if (f.kind === 'select') value = [...pop.querySelectorAll('[data-opt]:checked')].map(i => i.value);
        else if (f.kind === 'range') value = [pop.querySelector('[data-min]').value, pop.querySelector('[data-max]').value];
        else value = pop.querySelector('[data-text]').value;
        this.state.colFilters[col.key] = { kind: f.kind, value };
        this.state.page = 0; this._closePopovers(); this.refresh();
      };
      pop.querySelector('[data-apply]').addEventListener('click', commit);
      pop.querySelector('[data-clear]').addEventListener('click', () => {
        delete this.state.colFilters[col.key]; this._closePopovers(); this.refresh();
      });
      const txt = pop.querySelector('[data-text]'); if (txt) txt.addEventListener('keydown', e => { if (e.key === 'Enter') commit(); });
    }

    // ---- footer ----
    _renderFooter(total, totalPages, start, end) {
      if (!this.opts.paginate && !this.opts.showFooter) { this.$footer.innerHTML = ''; return; }
      const p = this.state.page;
      this.$footer.innerHTML = `
        <div class="nxt-foot-left">
          ${total ? `<b>${start + 1}</b>–<b>${end}</b> of <b>${total}</b>` : `0 rows`}
          ${this.state.selected.size ? ` · <b>${this.state.selected.size}</b> selected` : ''}
        </div>
        <div class="nxt-foot-right">
          <label class="nxt-page-size">
            <span>Rows</span>
            <select>
              ${[10, 20, 50, 100].map(n => `<option ${this.opts.pageSize===n?'selected':''}>${n}</option>`).join('')}
            </select>
          </label>
          <div class="nxt-pager">
            <button class="nxt-btn ghost" data-pg="first" ${p===0?'disabled':''}>«</button>
            <button class="nxt-btn ghost" data-pg="prev"  ${p===0?'disabled':''}>‹</button>
            <span class="nxt-pager-cur">${p + 1} / ${totalPages}</span>
            <button class="nxt-btn ghost" data-pg="next"  ${p>=totalPages-1?'disabled':''}>›</button>
            <button class="nxt-btn ghost" data-pg="last"  ${p>=totalPages-1?'disabled':''}>»</button>
          </div>
        </div>
      `;
      this.$footer.querySelectorAll('[data-pg]').forEach(b => b.addEventListener('click', () => {
        const a = b.dataset.pg;
        if (a === 'first') this.state.page = 0;
        else if (a === 'prev') this.state.page = Math.max(0, p - 1);
        else if (a === 'next') this.state.page = Math.min(totalPages - 1, p + 1);
        else this.state.page = totalPages - 1;
        this.refresh();
      }));
      const sel = this.$footer.querySelector('select');
      if (sel) sel.addEventListener('change', e => { this.opts.pageSize = +e.target.value; this.state.page = 0; this.refresh(); });
    }

    // ---- CSV export ----
    exportCSV() {
      const cols = this._orderedColumns();
      const rows = this._processed().map(x => x.r);
      const escape = v => {
        if (v == null) return '';
        const s = String(v);
        return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
      };
      const header = cols.map(c => escape(c.label)).join(',');
      const body = rows.map(r => cols.map(c => {
        const v = r[c.key];
        if (c.formatter) return escape(c.formatter(v, r));
        if (Array.isArray(v)) return escape(v.join('|'));
        return escape(v);
      }).join(',')).join('\n');
      const blob = new Blob(["\uFEFF" + header + '\n' + body], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = (this.opts.persistKey || 'export') + '.csv'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }

  // expose
  window.NxTable = NxTable;
})();

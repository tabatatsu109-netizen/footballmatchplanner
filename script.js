/* ============================================
   Match Planner - script.js
   ============================================ */

'use strict';

// ============================================================
// CONSTANTS
// ============================================================
const FORMATIONS = {
  '4-3-3': {
    positions: [
      { id: 'GK',  label: 'GK', row: 0, col: 2 },
      { id: 'RB',  label: 'RB', row: 1, col: 3.2 },
      { id: 'CB2', label: 'CB', row: 1, col: 2.3 },
      { id: 'CB1', label: 'CB', row: 1, col: 1.7 },
      { id: 'LB',  label: 'LB', row: 1, col: 0.8 },
      { id: 'RCM', label: 'CM', row: 2, col: 3 },
      { id: 'CM',  label: 'CM', row: 2, col: 2 },
      { id: 'LCM', label: 'CM', row: 2, col: 1 },
      { id: 'RW',  label: 'RW', row: 3, col: 3.2 },
      { id: 'CF',  label: 'CF', row: 3, col: 2 },
      { id: 'LW',  label: 'LW', row: 3, col: 0.8 },
    ]
  },
  '4-4-2': {
    positions: [
      { id: 'GK',  label: 'GK', row: 0, col: 2 },
      { id: 'RB',  label: 'RB', row: 1, col: 3.2 },
      { id: 'CB2', label: 'CB', row: 1, col: 2.3 },
      { id: 'CB1', label: 'CB', row: 1, col: 1.7 },
      { id: 'LB',  label: 'LB', row: 1, col: 0.8 },
      { id: 'RM',  label: 'RM', row: 2, col: 3.2 },
      { id: 'RCM', label: 'CM', row: 2, col: 2.3 },
      { id: 'LCM', label: 'CM', row: 2, col: 1.7 },
      { id: 'LM',  label: 'LM', row: 2, col: 0.8 },
      { id: 'RS',  label: 'ST', row: 3, col: 2.5 },
      { id: 'LS',  label: 'ST', row: 3, col: 1.5 },
    ]
  },
  '4-2-3-1': {
    positions: [
      { id: 'GK',  label: 'GK', row: 0, col: 2 },
      { id: 'RB',  label: 'RB', row: 1, col: 3.2 },
      { id: 'CB2', label: 'CB', row: 1, col: 2.3 },
      { id: 'CB1', label: 'CB', row: 1, col: 1.7 },
      { id: 'LB',  label: 'LB', row: 1, col: 0.8 },
      { id: 'RDM', label: 'DM', row: 2, col: 2.5 },
      { id: 'LDM', label: 'DM', row: 2, col: 1.5 },
      { id: 'RW',  label: 'RW', row: 3, col: 3.2 },
      { id: 'CAM', label: 'AM', row: 3, col: 2 },
      { id: 'LW',  label: 'LW', row: 3, col: 0.8 },
      { id: 'CF',  label: 'CF', row: 4, col: 2 },
    ]
  },
  '3-5-2': {
    positions: [
      { id: 'GK',  label: 'GK', row: 0, col: 2 },
      { id: 'RCB', label: 'CB', row: 1, col: 3 },
      { id: 'CB',  label: 'CB', row: 1, col: 2 },
      { id: 'LCB', label: 'CB', row: 1, col: 1 },
      { id: 'RWB', label: 'WB', row: 2, col: 3.5 },
      { id: 'RCM', label: 'CM', row: 2, col: 2.7 },
      { id: 'CM',  label: 'CM', row: 2, col: 2 },
      { id: 'LCM', label: 'CM', row: 2, col: 1.3 },
      { id: 'LWB', label: 'WB', row: 2, col: 0.5 },
      { id: 'RS',  label: 'ST', row: 3, col: 2.5 },
      { id: 'LS',  label: 'ST', row: 3, col: 1.5 },
    ]
  },
  '3-4-3': {
    positions: [
      { id: 'GK',  label: 'GK', row: 0, col: 2 },
      { id: 'RCB', label: 'CB', row: 1, col: 3 },
      { id: 'CB',  label: 'CB', row: 1, col: 2 },
      { id: 'LCB', label: 'CB', row: 1, col: 1 },
      { id: 'RM',  label: 'MF', row: 2, col: 3 },
      { id: 'RCM', label: 'CM', row: 2, col: 2.3 },
      { id: 'LCM', label: 'CM', row: 2, col: 1.7 },
      { id: 'LM',  label: 'MF', row: 2, col: 1 },
      { id: 'RW',  label: 'RW', row: 3, col: 3.2 },
      { id: 'CF',  label: 'CF', row: 3, col: 2 },
      { id: 'LW',  label: 'LW', row: 3, col: 0.8 },
    ]
  }
};

const GRADES = ['1年','2年','3年','4年','5年','6年','中1','中2','中3','高1','高2','高3'];
const POSITIONS_LIST = ['GK','CB','RB','LB','DM','CM','AM','RM','LM','RW','LW','CF','ST','WB'];
const MATCH_TYPES = ['公式戦','練習試合','フェスティバル','合宿'];
const TYPE_CLASS = { '公式戦':'type-official','練習試合':'type-practice','フェスティバル':'type-festival','合宿':'type-camp' };
const TOTAL_MINUTES = 80;

// ============================================================
// STORAGE
// ============================================================
const Store = {
  get(key, fallback = []) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }
};

let players = Store.get('mp_players', []);
let matches = Store.get('mp_matches', []);
let currentMatch = null;
let activeTab = 'board';

function savePlayers() { Store.set('mp_players', players); }
function saveMatches() { Store.set('mp_matches', matches); }
function saveCurrentMatch() {
  if (!currentMatch) return;
  const idx = matches.findIndex(m => m.id === currentMatch.id);
  if (idx >= 0) matches[idx] = currentMatch;
  else matches.unshift(currentMatch);
  saveMatches();
}

// ============================================================
// SVG ICONS
// ============================================================
const ICONS = {
  plus:     `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  back:     `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`,
  arrow:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`,
  user:     `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  calendar: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  copy:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  edit:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  check:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
  close:    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  time:     `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  list:     `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  swap:     `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
  soccer:   `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" stroke-width="1.5"/></svg>`,
};

// ============================================================
// DOM HELPERS
// ============================================================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const el = (tag, cls = '', html = '') => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
};

// ============================================================
// TOAST
// ============================================================
let toastTimer;
function showToast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2000);
}

// ============================================================
// CONFIRM DIALOG
// ============================================================
function showConfirm(title, msg, onOk) {
  const ov = $('#confirm-overlay');
  $('#confirm-title').textContent = title;
  $('#confirm-msg').textContent = msg;
  ov.classList.add('open');
  const ok = $('#confirm-ok');
  const cancel = $('#confirm-cancel');
  const close = () => ov.classList.remove('open');
  const handler = () => { close(); onOk(); };
  ok.onclick = handler;
  cancel.onclick = close;
}

// ============================================================
// NAVIGATION
// ============================================================
function showScreen(id) {
  $$('.screen').forEach(s => s.classList.add('hidden'));
  const s = $('#screen-' + id);
  if (s) s.classList.remove('hidden');
}

// ============================================================
// HOME SCREEN
// ============================================================
function renderHome() {
  showScreen('home');
  const cnt = $('#home-player-count'); if (cnt) cnt.textContent = players.length + '名';
  const mcnt = $('#home-match-count'); if (mcnt) mcnt.textContent = matches.length + '試合';

  const list = $('#home-recent');
  list.innerHTML = '';

  if (matches.length === 0) {
    if (players.length === 0) {
      list.innerHTML = `<div class="empty-hint"><span class="emoji">👋</span>まずは「選手管理」から選手を登録しましょう</div>`;
    }
    return;
  }

  const label = el('div','section-label','最近の試合');
  list.appendChild(label);

  matches.slice(0,4).forEach(m => {
    const card = el('button','match-card');
    card.innerHTML = `
      <div class="match-card-info">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          <span class="type-badge ${TYPE_CLASS[m.type]}">${m.type}</span>
          <span class="match-card-title">${esc(m.name)}</span>
        </div>
        <div class="match-card-sub">vs ${esc(m.opponent)} · ${esc(m.date)}</div>
      </div>
      <span style="color:var(--dim)">${ICONS.arrow}</span>`;
    card.onclick = () => openMatch(m.id);
    list.appendChild(card);
  });
}

// ============================================================
// PLAYERS SCREEN
// ============================================================
let editingPlayerIdx = null;

function renderPlayers() {
  showScreen('players');
  const list = $('#player-list-body');
  list.innerHTML = '';

  if (players.length === 0) {
    list.innerHTML = `<div class="empty-hint"><span class="emoji">👤</span>選手がいません<br><span style="font-size:12px;color:var(--dim)">右上の＋ボタンで追加</span></div>`;
    return;
  }

  players.forEach((p, i) => {
    const row = el('div','player-row');
    row.innerHTML = `
      <div class="player-num">${esc(p.number||'—')}</div>
      <div class="player-info">
        <div class="player-name">${esc(p.name)}</div>
        <div class="player-meta">
          ${esc(p.grade)} · <span class="pos-tag">${esc(p.main)}</span>
          ${p.sub ? `<span class="pos-tag sub">${esc(p.sub)}</span>` : ''}
        </div>
      </div>
      <button class="btn-ghost" data-action="edit" data-idx="${i}">${ICONS.edit}</button>
      <button class="btn-ghost danger" data-action="del" data-idx="${i}">${ICONS.trash}</button>`;
    list.appendChild(row);
  });

  list.querySelectorAll('[data-action="edit"]').forEach(b => {
    b.onclick = () => openPlayerForm(+b.dataset.idx);
  });
  list.querySelectorAll('[data-action="del"]').forEach(b => {
    b.onclick = () => {
      const idx = +b.dataset.idx;
      showConfirm('選手を削除', `「${players[idx].name}」を削除しますか？`, () => {
        players.splice(idx, 1);
        savePlayers();
        renderPlayers();
      });
    };
  });
}

function openPlayerForm(idx = null) {
  editingPlayerIdx = idx;
  const form = $('#player-form-wrap');
  const title = $('#player-form-title');

  if (idx !== null) {
    const p = players[idx];
    $('#pf-name').value = p.name;
    $('#pf-number').value = p.number || '';
    $('#pf-grade').value = p.grade;
    $('#pf-main').value = p.main;
    $('#pf-sub').value = p.sub || '';
    title.textContent = '選手を編集';
  } else {
    $('#pf-name').value = '';
    $('#pf-number').value = '';
    $('#pf-grade').value = '中1';
    $('#pf-main').value = 'CF';
    $('#pf-sub').value = '';
    title.textContent = '選手を追加';
  }
  form.classList.remove('hidden');
  $('#pf-name').focus();
}

function savePlayerForm() {
  const name = $('#pf-name').value.trim();
  if (!name) { showToast('選手名を入力してください'); return; }
  const p = {
    id: (editingPlayerIdx !== null ? players[editingPlayerIdx].id : null) || Date.now().toString(),
    name,
    number: $('#pf-number').value.trim(),
    grade: $('#pf-grade').value,
    main: $('#pf-main').value,
    sub: $('#pf-sub').value.trim(),
  };
  if (editingPlayerIdx !== null) players[editingPlayerIdx] = p;
  else players.push(p);
  savePlayers();
  $('#player-form-wrap').classList.add('hidden');
  editingPlayerIdx = null;
  renderPlayers();
}

// ============================================================
// NEW MATCH SCREEN
// ============================================================
let selectedFormation = '4-3-3';

function renderNewMatch() {
  showScreen('new-match');
  selectedFormation = '4-3-3';
  renderFormationBtns();

  // Today's date
  $('#nm-date').value = new Date().toISOString().slice(0,10);
  $('#nm-opponent').value = '';
  $('#nm-venue').value = '';
  $('#nm-category').value = '';
  $('#nm-name').value = '';
  $('#nm-type').value = '練習試合';

  // Copy from select
  const sel = $('#nm-copy');
  sel.innerHTML = '<option value="">コピーしない</option>';
  matches.forEach(m => {
    const o = document.createElement('option');
    o.value = m.id;
    o.textContent = `${m.name} (${m.date})`;
    sel.appendChild(o);
  });
}

function renderFormationBtns() {
  const wrap = $('#formation-btns');
  wrap.innerHTML = '';
  Object.keys(FORMATIONS).forEach(f => {
    const b = el('button', 'btn-formation' + (f === selectedFormation ? ' active' : ''), f);
    b.onclick = () => { selectedFormation = f; renderFormationBtns(); };
    wrap.appendChild(b);
  });
}

function createMatch() {
  const opponent = $('#nm-opponent').value.trim();
  if (!opponent) { showToast('対戦相手を入力してください'); return; }

  const copyId = $('#nm-copy').value;
  const base = copyId ? matches.find(m => m.id === copyId) : null;

  const name = $('#nm-name').value.trim() || `vs ${opponent}`;
  const match = {
    id: Date.now().toString(),
    name, opponent,
    date: $('#nm-date').value,
    venue: $('#nm-venue').value.trim(),
    category: $('#nm-category').value.trim(),
    type: $('#nm-type').value,
    formation: selectedFormation,
    lineup: base ? JSON.parse(JSON.stringify(base.lineup || {})) : {},
    bench: base ? JSON.parse(JSON.stringify(base.bench || [])) : [],
    subs: base ? JSON.parse(JSON.stringify(base.subs || [])) : [],
  };

  matches.unshift(match);
  saveMatches();
  openMatch(match.id);
}

// ============================================================
// MATCH SCREEN
// ============================================================
function openMatch(id) {
  currentMatch = matches.find(m => m.id === id);
  if (!currentMatch) return;
  activeTab = 'board';
  renderMatch();
}

function renderMatch() {
  showScreen('match');

  // Header
  $('#match-title').textContent = currentMatch.name;
  const badge = $('#match-type-badge');
  badge.textContent = currentMatch.type;
  badge.className = `type-badge ${TYPE_CLASS[currentMatch.type]}`;

  // Meta bar
  $('#match-meta').innerHTML = [
    `vs ${esc(currentMatch.opponent)}`,
    currentMatch.date,
    currentMatch.venue ? esc(currentMatch.venue) : '',
  ].filter(Boolean).map(s => `<span>${s}</span>`).join('<span>·</span>');

  // Tabs – show 出場時間 only for non-official
  const timeTab = $('#tab-time-btn');
  const timePane = $('#tab-time');
  if (currentMatch.type === '公式戦') {
    timeTab.classList.add('hidden');
    timePane.classList.add('hidden');
  } else {
    timeTab.classList.remove('hidden');
    timePane.classList.remove('hidden');
  }

  switchTab(activeTab, false);
}

function switchTab(tabId, save = true) {
  activeTab = tabId;
  $$('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
  $$('.tab-pane').forEach(p => p.classList.toggle('active', p.id === 'tab-' + tabId));
  if (tabId === 'board')  renderBoard();
  if (tabId === 'bench')  renderBench();
  if (tabId === 'subs')   renderSubs();
  if (tabId === 'time')   renderTime();
}

// ============================================================
// BOARD TAB
// ============================================================
let selectedPos = null; // posId selected on pitch, or '__p__'+playerId

function renderBoard() {
  const formation = FORMATIONS[currentMatch.formation] || FORMATIONS['4-3-3'];
  const lineup = currentMatch.lineup || {};
  const positions = formation.positions;
  const assignedIds = Object.values(lineup).filter(Boolean).map(p => p.id);

  // Build rows (attack at top)
  const maxRow = Math.max(...positions.map(p => p.row));
  const rows = [];
  for (let r = maxRow; r >= 0; r--) {
    const row = positions.filter(p => p.row === r);
    if (row.length) rows.push(row);
  }

  // Placed count
  const placed = assignedIds.length;
  const total = positions.length;
  $('#formation-badge-text').textContent = currentMatch.formation;
  $('#placed-count').textContent = `${placed}/${total}`;

  // Render pitch
  const pitchEl = $('#pitch-rows');
  pitchEl.innerHTML = '';

  rows.forEach(rowPositions => {
    const rowEl = el('div','pitch-row');
    rowPositions.forEach(pos => {
      const player = lineup[pos.id];
      const isSelected = selectedPos === pos.id;
      const hasSelPos = selectedPos && !selectedPos.startsWith('__p__');
      const hasSelPlayer = selectedPos && selectedPos.startsWith('__p__');

      let extraClass = '';
      if (isSelected) extraClass = 'selected';
      else if (hasSelPos && !player) extraClass = 'target-empty';
      else if (hasSelPos && player) extraClass = 'target-swap';
      else if (hasSelPlayer && !player) extraClass = 'target-empty';

      const btn = el('button', `pos-btn ${player ? 'filled' : ''} ${extraClass}`);
      btn.innerHTML = `<div class="pos-label">${pos.label}</div>`;

      if (player) {
        btn.innerHTML += `
          <div class="pos-player-num">${esc(player.number || '—')}</div>
          <div class="pos-player-name">${esc(firstName(player.name))}</div>`;
      } else {
        if (extraClass === 'target-empty') {
          btn.innerHTML += `<div class="pos-target-plus">+</div>`;
        } else {
          btn.innerHTML += `<div class="pos-empty">空</div>`;
        }
      }

      btn.onclick = () => handlePosTap(pos.id);

      const slot = el('div','pos-slot');
      slot.appendChild(btn);
      rowEl.appendChild(slot);
    });
    pitchEl.appendChild(rowEl);
  });

  // Selection hint
  renderSelectionHint();

  // Player strip
  renderPlayerStrip(assignedIds, positions, lineup);
}

function handlePosTap(posId) {
  const lineup = currentMatch.lineup || {};
  const player = lineup[posId];

  if (!selectedPos) {
    // Nothing selected: select this position
    selectedPos = posId;
    renderBoard();
    return;
  }

  if (selectedPos === posId) {
    // Tap same pos: deselect
    selectedPos = null;
    renderBoard();
    return;
  }

  if (selectedPos.startsWith('__p__')) {
    // Player selected → assign to this pos
    const playerId = selectedPos.slice(4);
    const p = players.find(x => x.id === playerId);
    if (p) {
      assignPlayer(posId, p);
    }
    return;
  }

  // Another pos selected → swap
  swapPositions(selectedPos, posId);
}

function handleStripPlayerTap(playerId) {
  const lineup = currentMatch.lineup || {};
  const assignedIds = Object.values(lineup).filter(Boolean).map(p => p.id);
  const isAssigned = assignedIds.includes(playerId);

  if (!selectedPos) {
    if (isAssigned) {
      // Select the pos this player is in
      const posId = Object.keys(lineup).find(k => lineup[k]?.id === playerId);
      selectedPos = posId || null;
    } else {
      selectedPos = '__p__' + playerId;
    }
    renderBoard();
    return;
  }

  if (selectedPos === '__p__' + playerId) {
    selectedPos = null;
    renderBoard();
    return;
  }

  if (selectedPos.startsWith('__p__')) {
    // Another player selected — just switch selection
    selectedPos = isAssigned ? null : '__p__' + playerId;
    renderBoard();
    return;
  }

  // A pos is selected → assign this player there
  const p = players.find(x => x.id === playerId);
  if (p) assignPlayer(selectedPos, p);
}

function assignPlayer(posId, player) {
  if (!currentMatch.lineup) currentMatch.lineup = {};
  // Remove player from any other pos first
  Object.keys(currentMatch.lineup).forEach(k => {
    if (currentMatch.lineup[k]?.id === player.id) delete currentMatch.lineup[k];
  });
  currentMatch.lineup[posId] = player;
  selectedPos = null;
  saveCurrentMatch();
  renderBoard();
}

function swapPositions(posA, posB) {
  if (!currentMatch.lineup) currentMatch.lineup = {};
  const a = currentMatch.lineup[posA];
  const b = currentMatch.lineup[posB];
  if (b) currentMatch.lineup[posA] = b; else delete currentMatch.lineup[posA];
  if (a) currentMatch.lineup[posB] = a; else delete currentMatch.lineup[posB];
  selectedPos = null;
  saveCurrentMatch();
  renderBoard();
}

function removeFromLineup(posId) {
  if (!currentMatch.lineup) return;
  delete currentMatch.lineup[posId];
  selectedPos = null;
  saveCurrentMatch();
  renderBoard();
}

function renderSelectionHint() {
  const hint = $('#selection-hint');
  if (!selectedPos) {
    hint.innerHTML = '<span style="color:var(--dim)">ポジションまたは選手をタップして配置</span>';
    return;
  }
  const lineup = currentMatch.lineup || {};
  if (selectedPos.startsWith('__p__')) {
    const p = players.find(x => x.id === selectedPos.slice(4));
    hint.innerHTML = `<span>「${esc(p?.name||'')}」→ ポジションをタップ <button class="btn-cancel-sel" id="btn-cancel-sel">✕</button></span>`;
  } else {
    const player = lineup[selectedPos];
    if (player) {
      hint.innerHTML = `<span>「${esc(player.name)}」→ 移動先をタップ <button class="btn-cancel-sel" id="btn-cancel-sel">✕</button>
        <button class="btn-cancel-sel" style="color:var(--red);margin-left:6px" id="btn-remove-pos">外す</button></span>`;
      const rmBtn = $('#btn-remove-pos');
      if (rmBtn) rmBtn.onclick = () => removeFromLineup(selectedPos);
    } else {
      hint.innerHTML = `<span>↓ 選手をタップして配置 <button class="btn-cancel-sel" id="btn-cancel-sel">✕</button></span>`;
    }
  }
  const cancelBtn = $('#btn-cancel-sel');
  if (cancelBtn) cancelBtn.onclick = () => { selectedPos = null; renderBoard(); };
}

function renderPlayerStrip(assignedIds, positions, lineup) {
  const strip = $('#player-strip');
  strip.innerHTML = '';

  const unassigned = players.filter(p => !assignedIds.includes(p.id));
  const assigned   = players.filter(p =>  assignedIds.includes(p.id));

  const makeCard = (p, isAssigned) => {
    const posId = isAssigned ? Object.keys(lineup).find(k => lineup[k]?.id === p.id) : null;
    const posLabel = posId ? (positions.find(pos => pos.id === posId)?.label || '—') : p.main;
    const isSelPlayer = selectedPos === '__p__' + p.id;
    const isSelPos = posId && selectedPos === posId;
    const highlighted = isSelPlayer || isSelPos;

    const card = el('button', `strip-card ${isAssigned ? 'placed' : ''} ${highlighted ? 'highlighted' : ''}`);
    card.innerHTML = `
      <div class="strip-num ${isAssigned ? 'green' : ''}">${esc(p.number||'—')}</div>
      <div class="strip-name">${esc(firstName(p.name))}</div>
      <span class="strip-pos-tag ${isAssigned ? 'placed' : ''}">${esc(posLabel)}</span>`;
    card.onclick = () => handleStripPlayerTap(p.id);
    return card;
  };

  unassigned.forEach(p => strip.appendChild(makeCard(p, false)));

  if (unassigned.length > 0 && assigned.length > 0) {
    strip.appendChild(el('div','strip-divider'));
  }

  assigned.forEach(p => strip.appendChild(makeCard(p, true)));

  // Count
  const cnt = $('#strip-count');
  if (cnt) cnt.textContent = unassigned.length + '名未配置';
}

// ============================================================
// BENCH TAB
// ============================================================
function renderBench() {
  const bench = currentMatch.bench || [];
  const lineup = currentMatch.lineup || {};
  const lineupIds = Object.values(lineup).filter(Boolean).map(p => p.id);
  const benchIds = bench.map(p => p.id);
  const notAssigned = players.filter(p => !lineupIds.includes(p.id));

  const body = $('#bench-body');
  body.innerHTML = '';

  // Current bench
  if (bench.length > 0) {
    body.innerHTML += `<div class="sub-section-label">ベンチ入り (${bench.length}名)</div>`;
    bench.forEach(p => {
      const row = el('div','player-row');
      row.style.background = 'rgba(16,185,129,0.05)';
      row.innerHTML = `
        <div class="player-num placed">${esc(p.number||'—')}</div>
        <div class="player-info">
          <div class="player-name">${esc(p.name)}</div>
          <div class="player-meta">${esc(p.grade)} · <span class="pos-tag">${esc(p.main)}</span></div>
        </div>
        <button class="btn-ghost danger" data-pid="${p.id}">${ICONS.close}</button>`;
      body.appendChild(row);
    });
  }

  body.innerHTML += `<div class="sub-section-label">スタメン外選手 (${notAssigned.length}名)</div>`;

  if (notAssigned.length === 0) {
    body.innerHTML += `<div class="empty-hint" style="padding:20px"><span class="emoji" style="font-size:24px">✅</span>全選手がスタメン配置済みです</div>`;
  }

  notAssigned.forEach(p => {
    const inBench = benchIds.includes(p.id);
    const row = el('div','player-row');
    row.innerHTML = `
      <div class="player-num">${esc(p.number||'—')}</div>
      <div class="player-info">
        <div class="player-name">${esc(p.name)}</div>
        <div class="player-meta">${esc(p.grade)} · <span class="pos-tag">${esc(p.main)}</span></div>
      </div>
      <button class="btn-ghost ${inBench ? 'danger' : 'success'}" data-pid="${p.id}" data-in-bench="${inBench}">
        ${inBench ? ICONS.close : ICONS.plus}
      </button>`;
    body.appendChild(row);
  });

  // Remove from bench buttons
  body.querySelectorAll('[data-pid]').forEach(btn => {
    btn.onclick = () => {
      const pid = btn.dataset.pid;
      const inBench = btn.dataset.inBench === 'true';
      if (inBench) {
        currentMatch.bench = bench.filter(p => p.id !== pid);
      } else {
        const p = players.find(x => x.id === pid);
        if (p) {
          if (!currentMatch.bench) currentMatch.bench = [];
          currentMatch.bench.push(p);
        }
      }
      saveCurrentMatch();
      renderBench();
    };
  });
}

// ============================================================
// SUBS TAB
// ============================================================
function renderSubs() {
  const subs = currentMatch.subs || [];
  const body = $('#subs-body');
  body.innerHTML = '';

  if (subs.length === 0) {
    body.innerHTML = `<div class="empty-hint"><span class="emoji">🔄</span>交代計画がありません<br><span style="font-size:12px;color:var(--dim)">上のボタンで追加</span></div>`;
  } else {
    const sorted = [...subs].sort((a, b) => (parseInt(a.minute)||0) - (parseInt(b.minute)||0));
    sorted.forEach(s => {
      const card = el('div','sub-card');
      card.innerHTML = `
        <div class="sub-minute">${s.minute ? s.minute+"'" : '—'}</div>
        <div class="sub-detail">
          <div class="sub-out">▼ OUT ${esc(s.out)}</div>
          <div class="sub-in">▲ IN  ${esc(s.in)}</div>
        </div>
        <button class="btn-ghost danger" data-sid="${s.id}">${ICONS.trash}</button>`;
      body.appendChild(card);
    });
    body.querySelectorAll('[data-sid]').forEach(btn => {
      btn.onclick = () => {
        currentMatch.subs = subs.filter(s => s.id !== btn.dataset.sid);
        saveCurrentMatch();
        renderSubs();
      };
    });
  }
}

function openSubForm() {
  // Reset
  $('#sf-minute').value = '';
  $('#sf-out').value = '';
  $('#sf-in').value = '';

  // Populate player selects
  ['sf-out','sf-in'].forEach(id => {
    const sel = $('#' + id);
    sel.innerHTML = '<option value="">選択してください</option>';
    players.forEach(p => {
      const o = document.createElement('option');
      o.value = p.name;
      o.textContent = `${p.name} (${p.main})`;
      sel.appendChild(o);
    });
  });

  const ov = $('#sub-form-overlay');
  ov.classList.add('open');
}

function saveSubForm() {
  const out = $('#sf-out').value;
  const inp = $('#sf-in').value;
  if (!out || !inp) { showToast('OUT・INの選手を選んでください'); return; }
  if (!currentMatch.subs) currentMatch.subs = [];
  currentMatch.subs.push({
    id: Date.now().toString(),
    minute: $('#sf-minute').value,
    out, in: inp,
  });
  saveCurrentMatch();
  $('#sub-form-overlay').classList.remove('open');
  renderSubs();
}

// ============================================================
// TIME TAB
// ============================================================
function renderTime() {
  const lineup = currentMatch.lineup || {};
  const subs = currentMatch.subs || [];
  const body = $('#time-body');
  body.innerHTML = `<div style="padding:10px 16px 4px;font-size:12px;color:var(--dim)">試合時間 ${TOTAL_MINUTES}分換算</div>`;

  const calcMinutes = (p) => {
    const isStarter = Object.values(lineup).some(x => x?.id === p.id);
    const outSub = subs.find(s => s.out === p.name);
    const inSub  = subs.find(s => s.in  === p.name);
    if (isStarter) {
      return outSub ? (parseInt(outSub.minute) || TOTAL_MINUTES) : TOTAL_MINUTES;
    }
    if (inSub) {
      const start = parseInt(inSub.minute) || 0;
      const end = outSub ? (parseInt(outSub.minute) || TOTAL_MINUTES) : TOTAL_MINUTES;
      return Math.max(0, end - start);
    }
    return 0;
  };

  const listed = players.filter(p => calcMinutes(p) > 0)
    .sort((a,b) => calcMinutes(b) - calcMinutes(a));

  if (listed.length === 0) {
    body.innerHTML += `<div class="empty-hint"><span class="emoji">⏱</span>配置を設定すると出場時間が表示されます</div>`;
    return;
  }

  listed.forEach(p => {
    const mins = calcMinutes(p);
    const pct = Math.round((mins / TOTAL_MINUTES) * 100);
    const color = pct > 70 ? 'var(--green)' : pct > 40 ? 'var(--amber)' : 'var(--blue)';
    const row = el('div','time-row');
    row.innerHTML = `
      <div class="time-row-top">
        <span class="time-name">${esc(p.name)}</span>
        <span class="time-val">${mins}分</span>
      </div>
      <div class="time-bar-bg">
        <div class="time-bar-fill" style="width:${pct}%;background:${color}"></div>
      </div>`;
    body.appendChild(row);
  });
}

// ============================================================
// HISTORY SCREEN
// ============================================================
function renderHistory() {
  showScreen('history');
  const body = $('#history-body');
  body.innerHTML = '';

  if (matches.length === 0) {
    body.innerHTML = `<div class="empty-hint"><span class="emoji">📋</span>試合がありません</div>`;
    return;
  }

  matches.forEach(m => {
    const card = el('div','match-card');
    card.style.marginBottom = '8px';
    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
        <span class="type-badge ${TYPE_CLASS[m.type]}">${m.type}</span>
        <div class="match-card-info">
          <div class="match-card-title">${esc(m.name)}</div>
          <div class="match-card-sub">${esc(m.date)}${m.venue ? ' · '+esc(m.venue) : ''}</div>
        </div>
      </div>
      <button class="btn-ghost danger" data-mid="${m.id}" style="margin-right:4px">${ICONS.trash}</button>
      <span style="color:var(--dim)">${ICONS.arrow}</span>`;
    card.onclick = (e) => {
      if (e.target.closest('[data-mid]')) return;
      openMatch(m.id);
    };
    body.appendChild(card);
  });

  body.querySelectorAll('[data-mid]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const mid = btn.dataset.mid;
      const match = matches.find(m => m.id === mid);
      showConfirm('試合を削除', `「${match?.name}」を削除しますか？`, () => {
        matches = matches.filter(m => m.id !== mid);
        saveMatches();
        renderHistory();
      });
    };
  });
}

// ============================================================
// UTILITIES
// ============================================================
function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function firstName(name) {
  return name.split(/\s/)[0] || name;
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  // ── Home screen ──
  $('#btn-new-match').onclick = () => renderNewMatch();
  $('#btn-players').onclick   = () => { renderPlayers(); };
  $('#btn-history').onclick   = () => renderHistory();

  // ── Players screen ──
  $('#btn-add-player').onclick     = () => openPlayerForm();
  $('#btn-player-form-save').onclick = savePlayerForm;
  $('#btn-player-form-cancel').onclick = () => {
    $('#player-form-wrap').classList.add('hidden');
    editingPlayerIdx = null;
  };
  $('#btn-back-players').onclick = () => renderHome();

  // Populate grade & position selects
  const gradeSelects = $$('.grade-select');
  gradeSelects.forEach(s => {
    GRADES.forEach(g => { const o = document.createElement('option'); o.value = g; o.textContent = g; s.appendChild(o); });
  });
  const posSelects = $$('.pos-select');
  posSelects.forEach(s => {
    POSITIONS_LIST.forEach(p => { const o = document.createElement('option'); o.value = p; o.textContent = p; s.appendChild(o); });
  });

  // ── New match screen ──
  $('#btn-back-new-match').onclick = () => renderHome();
  $('#btn-create-match').onclick   = createMatch;

  // Populate type select
  const typeSelects = $$('.type-select');
  typeSelects.forEach(sel => {
    MATCH_TYPES.forEach(t => { const o = document.createElement('option'); o.value = t; o.textContent = t; sel.appendChild(o); });
  });

  // ── Match screen ──
  $('#btn-back-match').onclick = () => { selectedPos = null; renderHome(); };

  // Tabs
  $$('.tab-btn').forEach(btn => {
    btn.onclick = () => switchTab(btn.dataset.tab);
  });

  // Subs
  $('#btn-add-sub').onclick = openSubForm;
  $('#btn-sub-save').onclick   = saveSubForm;
  $('#btn-sub-cancel').onclick = () => $('#sub-form-overlay').classList.remove('open');
  $('#sub-form-overlay').onclick = (e) => { if (e.target === e.currentTarget) e.currentTarget.classList.remove('open'); };

  // ── Confirm dialog ──
  // (wired in showConfirm)

  // ── Initial screen ──
  renderHome();
});

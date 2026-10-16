/** localStorage wrapper that never throws (private mode, blocked storage). */
const memory = new Map();

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? (memory.get(key) ?? fallback) : JSON.parse(raw);
  } catch {
    return memory.get(key) ?? fallback;
  }
}

function write(key, value) {
  memory.set(key, value);
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: keep in memory for this page view */
  }
}

const SAVED = "tcbd:saved";
const CHECKLIST = "tcbd:checklist";
const MAX_SAVED = 50;

export const getPref = (key) => read(`tcbd:${key}`, null);
export const setPref = (key, value) => write(`tcbd:${key}`, value);

export const listSaved = () => read(SAVED, []);

export function addSaved(entry) {
  const id =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const list = [{ id, ts: Date.now(), ...entry }, ...listSaved()].slice(
    0,
    MAX_SAVED,
  );
  write(SAVED, list);
  return list[0];
}

export const removeSaved = (id) =>
  write(
    SAVED,
    listSaved().filter((item) => item.id !== id),
  );
export const clearSaved = () => write(SAVED, []);

export const getChecklist = () => read(CHECKLIST, {});
export function setChecklistItem(id, done) {
  write(CHECKLIST, { ...getChecklist(), [id]: Boolean(done) });
}

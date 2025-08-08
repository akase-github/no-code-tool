export interface UserTemplate {
  id: string;
  name: string;
  html: string;
}

const STORAGE_KEY = 'userTemplates:v1';

export function getUserTemplates(): UserTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as UserTemplate[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveUserTemplates(templates: UserTemplate[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export function addUserTemplate(t: UserTemplate) {
  const list = getUserTemplates();
  list.push(t);
  saveUserTemplates(list);
}

export function updateUserTemplate(updated: UserTemplate) {
  const list = getUserTemplates().map((t) => (t.id === updated.id ? updated : t));
  saveUserTemplates(list);
}

export function deleteUserTemplate(id: string) {
  const list = getUserTemplates().filter((t) => t.id !== id);
  saveUserTemplates(list);
}


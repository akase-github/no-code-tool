import React, { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { templates as builtins, HtmlTemplate } from '../templates/templates';
import { UserTemplate, getUserTemplates, addUserTemplate, updateUserTemplate, deleteUserTemplate } from '../services/templateStore';

interface TemplateManagerProps {
  onSelectTemplateId: (id: string) => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ onSelectTemplateId }) => {
  const [userList, setUserList] = useState<UserTemplate[]>(getUserTemplates());
  const [editing, setEditing] = useState<UserTemplate | null>(null);

  const allTemplates = useMemo(() => {
    const builtinMapped: HtmlTemplate[] = builtins.map((b) => ({ ...b }));
    const userMapped: HtmlTemplate[] = userList.map((u) => ({ id: `user:${u.id}`, name: `ユーザー: ${u.name}`, file: '' }));
    return [...builtinMapped, ...userMapped];
  }, [userList]);

  const openNew = () => {
    setEditing({ id: uuidv4(), name: '新規テンプレート', html: '<!-- HTML -->' });
  };

  const openEdit = (id: string) => {
    const found = userList.find((t) => t.id === id);
    if (found) setEditing({ ...found });
  };

  const onSave = () => {
    if (!editing) return;
    const exists = userList.some((t) => t.id === editing.id);
    if (exists) {
      updateUserTemplate(editing);
      setUserList((prev) => prev.map((t) => (t.id === editing.id ? editing : t)));
    } else {
      addUserTemplate(editing);
      setUserList((prev) => [...prev, editing]);
    }
    setEditing(null);
  };

  const onDelete = (id: string) => {
    deleteUserTemplate(id);
    setUserList((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="group">
      <h3 className="section-title">テンプレ管理</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button className="ui-button secondary" onClick={openNew}>＋ 新規</button>
      </div>

      <div>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>テンプレート一覧</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {allTemplates.map((t) => {
            const isUser = t.id.startsWith('user:');
            const rawId = isUser ? t.id.replace('user:', '') : t.id;
            return (
              <li key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span>{t.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="ui-button secondary" onClick={() => onSelectTemplateId(t.id)}>選択</button>
                  {isUser && (
                    <>
                      <button className="ui-button secondary" onClick={() => openEdit(rawId)}>編集</button>
                      <button className="ui-button secondary" onClick={() => onDelete(rawId)}>削除</button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {editing && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="properties-panel__header">テンプレート編集</div>
            <div className="properties-panel__body">
              <label className="field">
                名前
                <input className="ui-input" style={{ marginTop: 6 }} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </label>
              <label className="field" style={{ marginTop: 10 }}>
                HTML
                <textarea className="ui-input" style={{ marginTop: 6, minHeight: 240 }} value={editing.html} onChange={(e) => setEditing({ ...editing, html: e.target.value })} />
              </label>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="ui-button" onClick={onSave}>保存</button>
                <button className="ui-button secondary" onClick={() => setEditing(null)}>キャンセル</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManager;


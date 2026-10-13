import type { ReactNode } from 'react';

type ConfirmModalProps = {
  title: string;
  body?: ReactNode;
  /** Optional free-text field inside the modal (e.g. a suspend reason) — omitted entirely when not needed. */
  prompt?: { label: string; value: string; onChange: (value: string) => void; placeholder?: string };
  confirmLabel: string;
  danger?: boolean;
  isSubmitting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** The one modal every destructive (or reason-requiring) admin action reuses — suspend/unsuspend/delete a user, delete a status, broadcast confirmation. */
export function ConfirmModal({ title, body, prompt, confirmLabel, danger, isSubmitting, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        {body && <p>{body}</p>}
        {prompt && (
          <div style={{ marginTop: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{prompt.label}</label>
            <textarea
              className="input"
              value={prompt.value}
              onChange={(e) => prompt.onChange(e.target.value)}
              placeholder={prompt.placeholder}
              rows={3}
            />
          </div>
        )}
        <div className="modal-actions">
          <button type="button" className="link-button secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="button" className={`button ${danger ? 'button-danger' : ''}`} onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? <span className="spinner" aria-hidden="true" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

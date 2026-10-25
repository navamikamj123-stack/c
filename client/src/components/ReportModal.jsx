import React, { useState } from 'react';
import { api } from '../services/api';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function ReportModal({ targetType = 'Item', targetId, targetTitle, onClose }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please specify the reason for reporting this item.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.createReport({
        targetType,
        targetId,
        targetTitle,
        reason,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1600);
    } catch (err) {
      setError(err.message || 'Failed to submit report. Please log in first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold text-danger d-flex align-items-center gap-2">
              <AlertTriangle size={20} /> Report Content
            </h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading}></button>
          </div>

          <div className="modal-body">
            {success ? (
              <div className="text-center py-4">
                <CheckCircle size={44} className="text-success mb-2" />
                <h5 className="fw-bold">Report Submitted</h5>
                <p className="text-muted small">Our administrators will review this listing promptly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="small text-muted mb-3">
                  Flagging: <strong>{targetTitle}</strong>
                </p>

                {error && <div className="alert alert-danger small py-2">{error}</div>}

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Reason for Report</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="e.g. Inappropriate content, prohibited item, misleading location, spam..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-sm btn-light" onClick={onClose} disabled={loading}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-sm btn-danger px-3" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

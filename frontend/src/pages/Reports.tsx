import React, { useEffect, useState } from 'react';
import api from '../api/client';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    api.get('/reports').then(r => setReports(r.data)).catch(() => setReports([]));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: '#003366' }}>Reports</h2>
      <div style={{ marginTop: 12 }}>
        {reports.length === 0 ? (
          <div className="card">No reports available</div>
        ) : (
          reports.map(r => (
            <div key={r.id} className="card" style={{ marginBottom: 8 }}>
              <strong>{r.name}</strong>
              <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{JSON.stringify(r.payload, null, 2)}</pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

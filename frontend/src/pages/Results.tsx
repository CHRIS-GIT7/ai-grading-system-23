import React, { useEffect, useState } from 'react';
import api from '../api/client';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { useAuth } from '../context/AuthContext';

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const { user, role } = useAuth();

  useEffect(() => {
    const url = role === 'student' ? `/results?studentId=${user?.id}` : '/results';
    api.get(url).then(r => setResults(r.data));
  }, [role, user]);

  const filtered = results.filter(r => { if (!q) return true; return [r.student?.name, r.exam?.title, r.grade].join(' ').toLowerCase().includes(q.toLowerCase()); });

  function exportPDF() {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Lead City University — Results', 14, 16);
    let y = 26;
    filtered.forEach(r => { doc.text(`${r.student?.name} | ${r.exam?.title} | ${r.score}% | ${r.grade}`, 14, y); y += 8; if (y > 270) { doc.addPage(); y = 16; } });
    doc.save('results.pdf');
  }

  function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(filtered.map(r => ({ student: r.student?.name, matric: r.student?.matric, exam: r.exam?.title, score: r.score, grade: r.grade, feedback: r.feedback, date: r.createdAt })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Results');
    XLSX.writeFile(wb, 'results.xlsx');
  }

  return (
    <div style={{ padding:24 }}>
      <div className="card" style={{ display:'flex', justifyContent:'space-between', alignItems: 'center' }}>
        <div><h3>{role === 'admin' ? 'All Results' : 'My Results'}</h3></div>
        <div style={{ display:'flex', gap:8 }}>
          <input placeholder="Search results" value={q} onChange={e => setQ(e.target.value)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ccc' }} />
          {role === 'admin' && <button className="btn" onClick={exportPDF}>Export PDF</button>}
          {role === 'admin' && <button className="btn" onClick={exportExcel}>Export Excel</button>}
          <button className="btn secondary">Print</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <table className="table">
          <thead>
            <tr>
              {role === 'admin' && <th>Student</th>}
              <th>Exam</th>
              <th>Score</th>
              <th>Grade</th>
              <th>Feedback</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                {role === 'admin' && <td>{r.student?.name}</td>}
                <td>{r.exam?.title}</td>
                <td>{r.score}%</td>
                <td><span style={{ fontWeight: 600, color: r.grade === 'A' || r.grade === 'B' ? '#28a745' : r.grade === 'F' ? '#dc3545' : '#17a2b8' }}>{r.grade}</span></td>
                <td style={{ maxWidth:350 }}>{r.feedback}</td>
                <td>{new Date(r.createdAt || '').toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

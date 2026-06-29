import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Exam, Student } from '../types';
import { useAuth } from '../context/AuthContext';

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [answer, setAnswer] = useState('');
  const [lastResult, setLastResult] = useState<any | null>(null);
  const { user, role } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { 
    api.get('/exams').then(r => setExams(r.data)); 
    if (role === 'admin') {
      api.get('/students').then(r => setStudents(r.data)); 
    }
  }, [role]);

  const submitGrade = async () => {
    const targetStudentId = role === 'student' ? user?.id : studentId;
    if (!selectedExam || !targetStudentId) return alert('Select exam and student');
    
    setSubmitting(true);
    try {
      const res = await api.post(`/exams/${selectedExam.id}/upload-and-grade`, { 
        studentId: targetStudentId, 
        studentText: answer 
      });
      setLastResult(res.data.result);
      alert(role === 'student' ? 'Answer submitted and graded!' : 'Result saved');
    } catch (err) {
      alert('Error submitting grade');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding:24 }}>
      <div className="card">
        <h2>{role === 'admin' ? 'Manage Exams' : 'Available Exams'}</h2>
        <table className="table">
          <thead>
            <tr><th>Title</th><th>Course</th><th>Action</th></tr>
          </thead>
          <tbody>
            {exams.map(e => (
              <tr key={e.id}>
                <td>{e.title}</td>
                <td>{e.course?.title || 'N/A'}</td>
                <td>
                  <button className="btn" onClick={() => {
                    setSelectedExam(e);
                    setAnswer('');
                    setLastResult(null);
                  }}>
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedExam && (
        <div className="card" style={{ marginTop: 24 }}>
          <h3>{selectedExam.title}</h3>
          <p><strong>Prompt:</strong> {selectedExam.prompt}</p>
          
          {role === 'admin' && (
            <div style={{ margin: '12px 0' }}>
              <select onChange={e => setStudentId(Number(e.target.value))} value={studentId ?? ''}>
                <option value="">Select student to grade on behalf of</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.matric})</option>)}
              </select>
            </div>
          )}
          
          <div style={{ marginTop: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              {role === 'student' ? 'Your Answer:' : "Student's Answer (Paste text):"}
            </label>
            <textarea 
              className="textarea" 
              value={answer} 
              onChange={e => setAnswer(e.target.value)} 
              placeholder={role === 'student' ? 'Type your answer here...' : "Paste student's answer here"} 
              rows={8}
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={submitGrade} disabled={submitting || !answer.trim()}>
              {submitting ? 'Processing...' : (role === 'student' ? 'Submit Answer' : 'Grade & Save')}
            </button>
          </div>
        </div>
      )}

      {lastResult && (
        <div className="card" style={{ marginTop: 24, borderLeft: '4px solid #003366' }}>
          <h3>{role === 'student' ? 'Your Result' : 'Saved Result'}</h3>
          <p><strong>Score:</strong> {lastResult.score} &nbsp; <strong>Grade:</strong> {lastResult.grade}</p>
          <p><strong>Feedback:</strong></p>
          <div style={{ whiteSpace: 'pre-wrap', background: '#f3f6f9', padding: 12, borderRadius: 6 }}>
            {lastResult.feedback}
          </div>
        </div>
      )}
    </div>
  );
}

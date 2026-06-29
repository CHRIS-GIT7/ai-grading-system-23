import React, { useEffect, useState } from 'react';
import api from '../api/client';

export default function UploadPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [modelAnswer, setModelAnswer] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => { api.get('/courses').then(r => setCourses(r.data)); api.get('/students').then(r => setStudents(r.data)); }, []);

  async function submitNewExam() {
    if (courseId == null) return alert('Please select a course');
    if (!title || !title.trim()) return alert('Please provide an exam title');
    try {
      const resp = await api.post('/exams', { courseId: Number(courseId), title: title.trim(), prompt, modelAnswer });
      console.log('Created exam', resp.data);
      alert('Exam created: ' + (resp.data?.id ?? 'unknown'));
      setTitle('');
      setPrompt('');
      setModelAnswer('');
    } catch (err: any) {
      console.error('Create exam error', err);
      alert('Failed to create exam: ' + (err?.response?.data?.error || err?.message || 'unknown'));
    }
  }

  async function uploadAndGrade() {
    if (!file || !studentId || !courseId) return alert('provide file, student and course');
    const examResp = await api.post('/exams', { courseId, title: `${title || 'Uploaded Exam'} - ${new Date().toISOString()}`, prompt, modelAnswer });
    const exam = examResp.data;
    console.log('Created exam', exam);
    if (!exam || !exam.id) {
      alert('Failed to create exam: missing exam id');
      return;
    }
    const fd = new FormData();
    fd.append('script', file);
    fd.append('studentId', String(studentId));
    try {
      const resp = await api.post(`/exams/${exam.id}/upload-and-grade`, fd);
      console.log('Upload response', resp.data);
      alert('Uploaded & graded');
    } catch (err: any) {
      console.error('Upload error', err);
      alert('Upload failed: ' + (err?.response?.data?.error || err?.message || 'unknown'));
    }
  }

  return (
    <div style={{ padding:24 }}>
      <div className="card">
        <h3>Upload Answer Script</h3>
        <div style={{ display:'grid', gap:10 }}>
          <select
            onChange={e => setCourseId(Number(e.target.value))}
            value={courseId ?? ''}
            disabled={courses.length === 0}
          >
            <option value="">{courses.length ? 'Select Course' : 'No courses available'}</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
          </select>
          {courses.length === 0 && (
            <div style={{ color: '#666', fontSize: 13, marginTop: 6 }}>
              No courses available. Create courses from the Manage Exams page or via the API.
            </div>
          )}
          <input placeholder="Exam Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea placeholder="Question prompt" value={prompt} onChange={e => setPrompt(e.target.value)} />
          <textarea placeholder="Model answer (ideal answer)" value={modelAnswer} onChange={e => setModelAnswer(e.target.value)} />
          <div><label>Student: </label><select onChange={e => setStudentId(Number(e.target.value))}><option value="">Select Student</option>{students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.matric})</option>)}</select></div>
          <div><label>Upload student answer (.txt)</label><input type="file" accept=".txt" onChange={e => setFile(e.target.files?.[0] || null)} /></div>

          <div style={{ display:'flex', gap:8 }}>
            <button className="btn" onClick={submitNewExam} disabled={courseId == null}>Create Exam</button>
            <button className="btn" onClick={uploadAndGrade} disabled={courses.length === 0}>Upload & Grade</button>
          </div>
        </div>
      </div>
    </div>
  );
}

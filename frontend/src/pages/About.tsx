import React from 'react';

export default function About() {
  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <div className="card">
        <h1 style={{ color: '#003366', marginBottom: 16 }}>About AI Grading System</h1>
        
        <p style={{ lineHeight: 1.6, marginBottom: 16 }}>
          The AI-Assisted Grading and Feedback System is a modern educational tool designed specifically for Lead City University. 
          Its primary goal is to assist lecturers in evaluating student submissions for GST (General Studies) courses more efficiently and consistently.
        </p>

        <h3 style={{ marginTop: 24, marginBottom: 12, color: '#003366' }}>Key Features</h3>
        <ul style={{ paddingLeft: 24, lineHeight: 1.6, marginBottom: 24 }}>
          <li><strong>Automated Grading:</strong> Uses advanced AI models to compare student answers against standard model answers.</li>
          <li><strong>Constructive Feedback:</strong> Generates tailored feedback highlighting strengths and areas for improvement for each student.</li>
          <li><strong>Role-Based Access:</strong> Secure portals for both students and lecturers, ensuring privacy and ease of use.</li>
          <li><strong>Analytics & Export:</strong> Provides insights into course performance and allows results to be exported easily.</li>
        </ul>

        <h3 style={{ marginTop: 24, marginBottom: 12, color: '#003366' }}>How it Works</h3>
        <p style={{ lineHeight: 1.6 }}>
          Lecturers create an exam with a prompt and a model answer. Students log in, select the exam, and submit their responses. 
          The system then evaluates the response, assigns a score and grade, and provides detailed feedback. 
          Both students and lecturers can review the results immediately.
        </p>
      </div>
    </div>
  );
}

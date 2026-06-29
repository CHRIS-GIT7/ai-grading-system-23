import express from 'express';
import { PrismaClient } from '@prisma/client';
const router = express.Router();
const prisma = new PrismaClient();

// Grade distribution
router.get('/grade-distribution', async (req, res) => {
  try {
    const { courseId } = req.query;
    const whereClause = courseId ? `WHERE e."courseId" = ${Number(courseId)}` : '';
    const raw = await prisma.$queryRawUnsafe(`SELECT r.grade, count(*) as count FROM "Result" r JOIN "Exam" e on e.id = r."examId" ${whereClause} GROUP BY r.grade`);
    res.json(raw);
  } catch (err) {
    console.error('analytics grade-distribution error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Average
router.get('/average-performance', async (req, res) => {
  try {
    const { courseId } = req.query;
    const q = courseId ? `SELECT AVG(r.score) as avg_score FROM "Result" r JOIN "Exam" e on e.id=r."examId" WHERE e."courseId" = $1` : `SELECT AVG(score) as avg_score FROM "Result"`;
    const params = courseId ? [Number(courseId)] : [];
    const raw = await prisma.$queryRawUnsafe(q, ...params);
    res.json(raw);
  } catch (err) {
    console.error('analytics average-performance error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Pass vs fail
router.get('/pass-fail', async (req, res) => {
  try {
    const { courseId } = req.query;
    const where = courseId ? `WHERE e."courseId" = ${Number(courseId)}` : '';
    const raw = await prisma.$queryRawUnsafe(`SELECT SUM(CASE WHEN r.score >= 60 THEN 1 ELSE 0 END) as pass_count, SUM(CASE WHEN r.score < 60 THEN 1 ELSE 0 END) as fail_count FROM "Result" r JOIN "Exam" e on e.id = r."examId" ${where}`);
    res.json(raw);
  } catch (err) {
    console.error('analytics pass-fail error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

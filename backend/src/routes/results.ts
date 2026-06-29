import express from 'express';
import { PrismaClient } from '@prisma/client';
const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const { studentId } = req.query;
  const filter = studentId ? { studentId: Number(studentId) } : {};
  const results = await prisma.result.findMany({ 
    where: filter,
    include: { student: true, exam: { include: { course: true }}}
  });
  res.json(results);
});

export default router;

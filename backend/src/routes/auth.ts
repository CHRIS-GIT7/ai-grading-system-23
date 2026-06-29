import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
  const { role, identifier, password } = req.body;

  try {
    if (role === 'student') {
      const student = await prisma.student.findUnique({
        where: { matric: identifier }
      });
      if (!student || student.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      return res.json({ user: student, role: 'student' });
    } else if (role === 'admin') {
      const lecturer = await prisma.lecturer.findUnique({
        where: { email: identifier }
      });
      if (!lecturer || lecturer.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      return res.json({ user: lecturer, role: 'admin' });
    }
    
    return res.status(400).json({ error: 'Invalid role' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

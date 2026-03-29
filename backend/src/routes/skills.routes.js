import express from 'express';
import {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  getDepartmentSkills,
  addSkillToDepartment,
  updateDepartmentSkill,
  removeSkillFromDepartment,
  getInternSkills,
  addSkillToIntern,
  updateInternSkill,
  verifyInternSkill
} from '../controllers/skills.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

// Publicly viewable skills (requires login)
router.use(verifyToken);

// ─── MASTER SKILL LIST ───────────────────────────────────────────
router.get('/', getAllSkills);
router.get('/:id', getSkillById);

// Admin-only Master Skill Management
router.post('/', checkRole(['super_admin']), createSkill);
router.patch('/:id', checkRole(['super_admin']), updateSkill);
router.delete('/:id', checkRole(['super_admin']), deleteSkill);

// ─── DEPARTMENT SKILLS ───────────────────────────────────────────
router.get('/department/:deptId', getDepartmentSkills);
router.post('/department/:deptId', checkRole(['super_admin', 'manager']), addSkillToDepartment);
router.patch('/department/:deptId/:skillId', checkRole(['super_admin', 'manager']), updateDepartmentSkill);
router.delete('/department/:deptId/:skillId', checkRole(['super_admin', 'manager']), removeSkillFromDepartment);

// ─── INTERN SKILLS ─────────────────────────────────────────────
router.get('/intern/:internId', getInternSkills);
router.post('/intern/:internId', checkRole(['super_admin', 'manager', 'student']), addSkillToIntern);
router.patch('/intern/:internId/:skillId', checkRole(['super_admin', 'manager', 'student']), updateInternSkill);
router.post('/intern/:internId/:skillId/verify', checkRole(['manager']), verifyInternSkill);

export default router;

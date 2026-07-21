import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getDashboardStats,
} from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';
import { runValidation } from '../middleware/validate';

const router = Router();

router.use(protect);

const taskBodyValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('priority').isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
  body('status').optional().isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid status'),
  body('due_date')
    .notEmpty().withMessage('Due date is required')
    .isISO8601().withMessage('Due date must be a valid date')
    .custom((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(value) < today) {
        throw new Error('Due date cannot be earlier than today');
      }
      return true;
    }),
];

router.get('/stats/dashboard', getDashboardStats);

router.get(
  '/',
  runValidation([
    query('status').optional().isIn(['Pending', 'In Progress', 'Completed']),
    query('priority').optional().isIn(['Low', 'Medium', 'High']),
  ]),
  getTasks
);

router.get('/:id', runValidation([param('id').isUUID()]), getTaskById);
router.post('/', runValidation(taskBodyValidation), createTask);
router.put('/:id', runValidation([param('id').isUUID(), ...taskBodyValidation]), updateTask);
router.delete('/:id', runValidation([param('id').isUUID()]), deleteTask);

export default router;
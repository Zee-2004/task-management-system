import { Request, Response } from 'express';
import { pool } from '../config/db';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';

export const getTasks = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { search, status, priority, sortBy } = req.query;

  const conditions: string[] = ['user_id = $1'];
  const values: unknown[] = [userId];
  let paramIndex = 2;

  if (search) {
    conditions.push(`title ILIKE $${paramIndex}`);
    values.push(`%${search}%`);
    paramIndex++;
  }
  if (status) {
    conditions.push(`status = $${paramIndex}`);
    values.push(status);
    paramIndex++;
  }
  if (priority) {
    conditions.push(`priority = $${paramIndex}`);
    values.push(priority);
    paramIndex++;
  }

  const sortableColumns: Record<string, string> = {
    newest: 'created_at DESC',
    oldest: 'created_at ASC',
    due_date: 'due_date ASC',
  };
  const orderClause = sortableColumns[String(sortBy)] || 'created_at DESC';

  const query = `
    SELECT * FROM tasks
    WHERE ${conditions.join(' AND ')}
    ORDER BY ${orderClause}
  `;

  const result = await pool.query(query, values);
  res.status(200).json({ success: true, data: result.rows });
});

export const getTaskById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const result = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);
  if (result.rows.length === 0) throw new AppError('Task not found', 404);

  res.status(200).json({ success: true, data: result.rows[0] });
});

export const createTask = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { title, description, priority, status, due_date } = req.body;

  const result = await pool.query(
    `INSERT INTO tasks (user_id, title, description, priority, status, due_date)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, title, description || null, priority, status || 'Pending', due_date]
  );

  res.status(201).json({ success: true, message: 'Task created', data: result.rows[0] });
});

export const updateTask = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const { title, description, priority, status, due_date } = req.body;

  const existing = await pool.query('SELECT id FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);
  if (existing.rows.length === 0) throw new AppError('Task not found', 404);

  const result = await pool.query(
    `UPDATE tasks
     SET title = $1, description = $2, priority = $3, status = $4, due_date = $5
     WHERE id = $6 AND user_id = $7 RETURNING *`,
    [title, description || null, priority, status, due_date, id, userId]
  );

  res.status(200).json({ success: true, message: 'Task updated', data: result.rows[0] });
});

export const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);
  if (result.rows.length === 0) throw new AppError('Task not found', 404);

  res.status(200).json({ success: true, message: 'Task deleted' });
});

export const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const result = await pool.query(
    `SELECT
       COUNT(*) AS total,
       COUNT(*) FILTER (WHERE status = 'Pending') AS pending,
       COUNT(*) FILTER (WHERE status = 'In Progress') AS in_progress,
       COUNT(*) FILTER (WHERE status = 'Completed') AS completed,
       COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status != 'Completed') AS overdue
     FROM tasks WHERE user_id = $1`,
    [userId]
  );

  const row = result.rows[0];
  res.status(200).json({
    success: true,
    data: {
      total: Number(row.total),
      pending: Number(row.pending),
      inProgress: Number(row.in_progress),
      completed: Number(row.completed),
      overdue: Number(row.overdue),
    },
  });
});
-- ============================================================
-- Seed data: default admin account required by the spec.
-- admin@test.com / 123456
-- ============================================================

INSERT INTO users (name, email, password)
VALUES (
    'Admin User',
    'admin@test.com',
    '$2b$10$.Ji7zdtUsUeiWcZQf2hDuuijzv0.f31J5AgDimTSjNDjGwOOzOzvu'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO tasks (user_id, title, description, priority, status, due_date)
SELECT id, 'Set up project repository', 'Initialize Git and push first commit', 'High'::task_priority, 'Completed'::task_status, CURRENT_DATE - INTERVAL '2 days'
FROM users WHERE email = 'admin@test.com'
UNION ALL
SELECT id, 'Design database schema', 'Define Users and Tasks tables', 'High'::task_priority, 'In Progress'::task_status, CURRENT_DATE + INTERVAL '1 day'
FROM users WHERE email = 'admin@test.com'
UNION ALL
SELECT id, 'Write API documentation', 'Document all REST endpoints in README', 'Medium'::task_priority, 'Pending'::task_status, CURRENT_DATE + INTERVAL '5 days'
FROM users WHERE email = 'admin@test.com'
UNION ALL
SELECT id, 'Fix login page bug', 'Investigate the token expiry issue', 'Low'::task_priority, 'Pending'::task_status, CURRENT_DATE - INTERVAL '3 days'
FROM users WHERE email = 'admin@test.com';
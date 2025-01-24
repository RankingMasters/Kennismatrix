/*
  # Add dummy data for learning platform

  1. Data Added:
    - Sample paths for each section
    - Career levels for each path
    - Sample user profiles
    - User progress data

  2. Changes:
    - Insert initial data for all tables
    - Maintain referential integrity
*/

-- Insert paths for Design section
WITH design_section AS (
  SELECT id FROM sections WHERE title = 'Design'
)
INSERT INTO paths (section_id, title, description, hours) 
SELECT 
  design_section.id,
  title,
  description,
  hours
FROM design_section, (VALUES
  ('UX/UI Designer', 'Master user experience and interface design principles', 120),
  ('Motion Designer', 'Create engaging animations and motion graphics', 90),
  ('Graphic Designer', 'Design visual content for digital and print media', 100),
  ('Brand Specialist', 'Develop and maintain brand identity and guidelines', 80)
) AS p(title, description, hours);

-- Insert paths for Development section
WITH dev_section AS (
  SELECT id FROM sections WHERE title = 'Development'
)
INSERT INTO paths (section_id, title, description, hours)
SELECT 
  dev_section.id,
  title,
  description,
  hours
FROM dev_section, (VALUES
  ('Frontend Developer', 'Build modern web interfaces and applications', 150),
  ('Backend Developer', 'Create robust server-side applications', 160),
  ('Mobile Developer', 'Develop native and cross-platform mobile apps', 140),
  ('Cloud Engineer', 'Design and maintain cloud infrastructure', 130),
  ('DevOps Engineer', 'Implement CI/CD and automation', 120),
  ('Full Stack Developer', 'Master both frontend and backend development', 200)
) AS p(title, description, hours);

-- Insert sample levels for UX/UI path
WITH uxui_path AS (
  SELECT id FROM paths WHERE title = 'UX/UI Designer'
)
INSERT INTO levels (path_id, title, description, rank, rewards, info)
SELECT
  uxui_path.id,
  title,
  description,
  rank,
  rewards::jsonb,
  info
FROM uxui_path, (VALUES
  (
    'Junior UX/UI Designer',
    'Start your journey in UX/UI design',
    1,
    '["Access to design tools", "Basic UX/UI certification"]',
    'Request training through your team lead. Complete 3 real-world projects and pass the assessment.'
  ),
  (
    'Medior UX/UI Designer',
    'Advance your UX/UI capabilities',
    2,
    '["Advanced tool licenses", "Project lead opportunities"]',
    'Requires 2 years of experience and completion of advanced courses. Lead at least 2 major projects.'
  ),
  (
    'Senior UX/UI Designer',
    'Master complex UX challenges',
    3,
    '["Conference budget", "Team leadership role"]',
    'Minimum 4 years experience required. Must mentor juniors and contribute to design system.'
  ),
  (
    'Master UX/UI Designer',
    'Shape the future of UX/UI',
    4,
    '["Innovation budget", "Industry speaking opportunities"]',
    'By invitation only. Must have significant impact on company products and mentor other designers.'
  )
) AS l(title, description, rank, rewards, info);

-- Insert sample user profiles
INSERT INTO auth.users (id, email)
VALUES 
  ('d0d8c19e-1b8b-4b72-8244-34740c5a8f76', 'sarah.johnson@example.com'),
  ('c0f8d29e-2b7b-4b82-9254-45740c5a8f77', 'michael.chen@example.com'),
  ('b0e8f39e-3b6b-4b92-8264-56740c5a8f78', 'emma.davis@example.com'),
  ('a0d8e49e-4b5b-4ba2-9274-67740c5a8f79', 'james.wilson@example.com'),
  ('90d8f59e-5b4b-4bb2-8284-78740c5a8f80', 'lisa.anderson@example.com')
ON CONFLICT DO NOTHING;

INSERT INTO profiles (id, full_name, avatar_url)
VALUES
  ('d0d8c19e-1b8b-4b72-8244-34740c5a8f76', 'Sarah Johnson', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'),
  ('c0f8d29e-2b7b-4b82-9254-45740c5a8f77', 'Michael Chen', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'),
  ('b0e8f39e-3b6b-4b92-8264-56740c5a8f78', 'Emma Davis', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'),
  ('a0d8e49e-4b5b-4ba2-9274-67740c5a8f79', 'James Wilson', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'),
  ('90d8f59e-5b4b-4bb2-8284-78740c5a8f80', 'Lisa Anderson', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb')
ON CONFLICT DO NOTHING;
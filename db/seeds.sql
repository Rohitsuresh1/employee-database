INSERT INTO department
    (name)
VALUES
    ('Human Resourses'),
    ('Finance'),
    ('Operations'),
    ('Property'),
    ('Support');

INSERT INTO roles
    (title, salary, department_id)
VALUES
    ('Director',80000.00,1 ),
    ('Manager',60000.00,1),
    ('Supervisor',50000.00,1),
    ('Frontline',40000.00,1),
    ('Director',80000.00,2 ),
    ('Manager',60000.00,2),
    -- ('Supervisor',50000.00,2),
    ('Frontline',40000.00,2), 
    -- ('Director',80000.00,3 ),
    ('Manager',60000.00,3),
    ('Supervisor',50000.00,3),
    ('Frontline',40000.00,3),
    ('Director',80000.00,4 ),
    -- ('Manager',60000.00,1),
    ('Supervisor',50000.00,4),
    ('Frontline',40000.00,4);

INSERT INTO employee
    (first_name,last_name,role_id,manager_id)
VALUES
    ('Ronald', 'Firbank', 1, 0),
    ('Virginia', 'Woolf', 2, 1),
    ('Piers', 'Gaveston', 3, 2),
    ('Charles', 'LeRoi', 4, 3),
    ('Katherine', 'Mansfield', 5, 0),
    ('Dora', 'Carrington', 6, 5),
    ('Edward', 'Bellamy', 7, 6),
    ('Montague', 'Summers', 8, 1),
    ('Octavia', 'Butler', 9, 8),
    ('Unica', 'Zurn', 10, 9);
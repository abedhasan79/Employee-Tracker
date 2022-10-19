INSERT INTO department (name)
VALUES ('IT'),
('Finance & Accounting'),
('Sales & Marketing');

SELECT * FROM department;

INSERT INTO role (title, salary, department_id)
VALUES ('Full Stack Developer', 80000, 1),
('Software Engineer', 120000, 1),
('Accountant', 10000, 2), 
('Finanical Analyst', 150000, 2),
('Marketing Coordindator', 70000, 3), 
('Sales Lead', 90000, 3);

SELECT * FROM role;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('erv', 'eswrherh', 2, null),
('asd', 'erherh', 1, 1),
('eryher', 'sdf', 4, null),
('asf', 'erherh', 3, 3),
('af', 'ewfgry', 6, null),
('erhger', 'Swefsef', 5, 5);

SELECT * FROM employee;


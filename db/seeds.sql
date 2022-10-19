INSERT INTO department (name)
VALUES ("Engineering"),
    ("Marketing"),
    ("Sales");

SELECT * FROM department;

INSERT INTO role (title, salary, department_id)
VALUES ("Engineer", 1000, 1),
    ("Engineer manager", 1200,1),
    ("Marketing Employee", 1000, 2),
    ("Marketing Manager", 1200, 2),
    ("Sales Employee", 1000, 3),
    ("Sales Manager", 1200, 3);

SELECT * FROM role;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("sdgsdg","asfasf", 1, 1),
    ("svgjnsd","rev", 1,1),
    ("sdg","sfe", 2, 2),
    ("tyuj","er", 2, 2),
    ("oks","ewf", 3, 3),
    ("erve","refg", 3, 3),
    ("ervseg","rtherggs", 3, NULL);

SELECT * FROM employee;


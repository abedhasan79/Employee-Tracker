SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, employee.manager_id as manager
CONCAT (manager.first_name, " ", manager.last_name) AS manager
From employee
LEFT JOIN role on employee.role_id = role.id
LEFT JOIN department on role.department_id = department.id
LEFT JOIN employee  manager on employee.manager_id = manager.id;
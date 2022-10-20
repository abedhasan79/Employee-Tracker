//import packages
require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

//connnets to mysql
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`Connected to the department_db database.`)
);


const promptOptions = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select an option',
                name: 'choices',
                choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
            }
        ])
        .then((answer) => {
            if (answer.choices === 'view all departments') {
                showAllDepartment();

            }

            if (answer.choices === 'view all roles') {
                showAllRoles();

            }

            if (answer.choices === 'view all employees') {
                showAllEmployee();

            }

            if (answer.choices === 'add a department') {
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            message: 'Enter a Department: ',
                            name: 'addDepartment'
                        }
                    ])
                    .then(answer => {
                        db.query(`INSERT INTO department (name) VALUES (?);`, answer.addDepartment, function (err, results) {
                            if (err) throw err;
                            console.log(`\nadded ${answer.addDepartment} to department\n`);
                            console.log(`\Choose view all departments to see that the department got added.\n`);
                            showAllDepartment();
                        });
                    });
            }

            if (answer.choices === 'add a role') {
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            message: 'Enter a title: ',
                            name: 'addTitle'
                        },
                        {
                            type: 'input',
                            message: 'Enter a salary for the titel: ',
                            name: 'addSalary'
                        }
                    ])
                    .then(answer => {
                        const arr = [answer.addTitle, answer.addSalary];

                        db.query(`SELECT id FROM department`, (err, res) => {
                            const dep = res.map(({ id }) => ({ value: id }));
                            inquirer
                                .prompt([
                                    {
                                        type: 'list',
                                        message: 'Choose a department',
                                        name: 'addDepartmentId',
                                        choices: dep
                                    }
                                ])
                                .then(response => {
                                    const dept = response.addDepartmentId;
                                    arr.push(dept);
                                    db.query(`INSERT INTO role (title, salary, department_id) VALUES (?,?,?);`, arr, function (err, results) {
                                        if (err) throw err;
                                        console.log(arr);
                                        console.log(`\nadded to role\n`);
                                        console.log(`\Choose view all roles to see that the role got added.\n`);
                                        showAllRoles();
                                    });
                                });
                        });

                    });

            }

            if (answer.choices === 'add an employee') {
                addEmployee();
            }

            if (answer.choices === 'update an employee role') {
                updateEmployeeRole();
            }
        });
};

//show all department
showAllDepartment = () => {
    console.log('\nshowing all departments.\n')
    db.query(`select department.id as id, department.name as department from department;`, function (err, results) {
        if (err) throw err;
        console.table(results);
        promptOptions();
    });
}

//show all roles
showAllRoles = () => {
    console.log('\nshowing all role.\n')
    db.query(`select role.id as id, role.title as title, role.salary as salary, role.department_id as department from role;`, function (err, results) {
        if (err) throw err;
        console.table(results);
        promptOptions();
    });
}

//show all employee
showAllEmployee = () => {
    console.log('\nshowing all employees.\n')
    db.query(`SELECT employee.id as 'employee id', employee.first_name, employee.last_name, role.title, department.name as department, role.salary, employee.manager_id as 'manager id'
                From employee
                JOIN role on employee.role_id = role.id
                JOIN department on role.department_id = department.id
                JOIN employee  manager on employee.manager_id = manager.id;`, function (err, results) {
        if (err) throw err;
        console.table(results);
        promptOptions();
    });
}
// function to add an employee 
addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: "What is the employee's first name?",
            name: 'fistName'
        },
        {
            type: 'input',
            message: "What is the employee's last name?",
            name: 'lastName'
        }
    ])
        .then(answer => {
            const params = [answer.fistName, answer.lastName]

            db.query(`SELECT role.id, role.title FROM role`, (err, data) => {
                if (err) throw err;

                const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        message: "What is the employee's role?",
                        name: 'role',
                        choices: roles
                    }
                ])
                    .then(roleChoice => {
                        const role = roleChoice.role;
                        params.push(role);

                        db.query(`SELECT * FROM employee`, (err, data) => {
                            if (err) throw err;

                            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Who is the employee's manager?",
                                    choices: managers
                                }
                            ])
                                .then(managerChoice => {
                                    const manager = managerChoice.manager;
                                    params.push(manager);

                                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                      VALUES (?, ?, ?, ?)`;

                                    db.query(sql, params, (err, result) => {
                                        if (err) throw err;
                                        console.log("Employee has been added!");
                                        showAllEmployee();
                                    });
                                });
                        });
                    });
            });
        });
};

// function to update an employee 
updateEmployeeRole = () => {

    db.query(`SELECT * FROM employee`, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employees
            }
        ])
            .then(empChoice => {
                const employee = empChoice.name;
                const params = [];
                params.push(employee);

                db.query(`SELECT * FROM role`, (err, data) => {
                    if (err) throw err;

                    const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: "What is the employee's new role?",
                            choices: roles
                        }
                    ])
                        .then(roleChoice => {
                            const role = roleChoice.role;
                            params.push(role);

                            let employee = params[0]
                            params[0] = role
                            params[1] = employee

                            db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, params, (err, result) => {
                                if (err) throw err;
                                console.log("Employee has been updated!");

                                showAllEmployee();
                            });
                        });
                });
            });
    });
};

promptOptions();
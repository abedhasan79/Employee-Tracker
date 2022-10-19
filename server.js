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
                console.log('\nshowing all departments.\n')
                db.query(`select department.id as id, department.name as department from department;`, function (err, results) {
                    if (err) throw err;
                    console.table(results);
                    promptOptions();
                });
            }

            if (answer.choices === 'view all roles') {
                console.log('\nshowing all role.\n')
                db.query(`select role.id as id, role.title as title, role.salary as salary, role.department_id as department from role;`, function (err, results) {
                    if (err) throw err;
                    console.table(results);
                    promptOptions();
                });
            }

            if (answer.choices === 'view all employees') {
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
                            promptOptions();
                        });
                    });
            }


        });
};



promptOptions();
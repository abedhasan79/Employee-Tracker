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
                db.query(``, function (err, results) {
                    if (err) throw err;
                    console.table(results);
                    promptOptions();
                });
            }

        });
};

promptOptions();
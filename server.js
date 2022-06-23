const express = require('express');
const inquirer = require("inquirer");
const db = require('./db/connections');
const apiRoutes = require('./routes/apiRoutes');
const fetch = require('node-fetch');
const { response } = require('express');
const { json } = require('body-parser');
const { async } = require('rxjs');




const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use apiRoutes
app.use('/api', apiRoutes);

// Default response for any other request (Not Found)
app.use((req, res) => { 
  res.status(404).end();
});

// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

inquirer.prompt(
  {
      type: 'list',
      name: 'choise',
      message: 'Do you want to ',
      choices: ['View all roles','View all employees','View all departments','View all employees by department','View all employees by manager','Add a department','Add a role','Add an employee','View total allocated department budjet','Update an employee role','Update an employee manager','Delete an employee','Delete a department','Delete a role','Exit']
  })
.then(({ choise }) => {
  if(choise==='View all roles'){
    allRoles();
  }
  else if(choise==='View all employees'){
    allEmployees();
  }
  else if(choise==='View all departments'){
    allDepartments();
  }
  else if(choise==='View all employees by department'){
    viewByDepartment();
  }
  else if(choise==='View all employees by manager'){
    viewByManager();
  }
  else if(choise==='View total allocated department budjet'){
    console.log('budjet');
  }
  else if(choise==='Update an employee manager'){
    console.log('update manager');
  }
  else if(choise==='Delete an employee'){
    console.log('delete empl');
  }
  else if(choise==='Delete a department'){
    console.log('delete dept');
  }
  else if(choise==='Delete a role'){
    console.log("delete role");
  }
  else if(choise==='Add a department'){
    console.log('add dept');
  }
  else if(choise==='Add a role'){
    console.log('add role');
  }
  else if(choise==='Add an employee'){
    console.log('add emplo');
  }
  else if(choise==='Update an employee role'){
    console.log('update employee role');
  }
  else {
  
    // exit
  }
});

async function allRoles() {
  await fetch('http://localhost:3001/api/roles', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(data => data.text())
    .then(text => {
    let roles = JSON.parse(text);
    console.table(roles.data);
  })
};

async function allEmployees() {
  await fetch('http://localhost:3001/api/employee', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(data => data.text())
    .then(text => {
    let rows = JSON.parse(text);
    console.table(rows.data);
  })
};

async function allDepartments() {
  await fetch('http://localhost:3001/api/department', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(data => data.text())
    .then(text => {
    let rows = JSON.parse(text);
    console.table(rows.data);
  })
};

async function viewByDepartment() {
  await fetch('http://localhost:3001/api/departmentsort', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(data => data.text())
    .then(text => {
    let rows = JSON.parse(text);
    console.table(rows.data);
  })
};

async function viewByManager() {
  await fetch('http://localhost:3001/api/managersort', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(data => data.text())
    .then(text => {
    let rows = JSON.parse(text);
    console.table(rows.data);
  })
};
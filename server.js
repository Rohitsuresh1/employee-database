const express = require('express');
const inquirer = require("inquirer");
const db = require('./db/connections');
const apiRoutes = require('./routes/apiRoutes');
const fetch = require('node-fetch');
const { response } = require('express');
const { json } = require('body-parser');
const { async } = require('rxjs');
const inputCheck = require('./utils/inputCheck');
var table= [];



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
    let url = 'http://localhost:3001/api/role';
    allGetRoutes(url);
  }
  else if(choise==='View all employees'){
    let url = 'http://localhost:3001/api/employee';
    allGetRoutes(url);
  }
  else if(choise==='View all departments'){
    let url = 'http://localhost:3001/api/department';
    allGetRoutes(url);
  }
  else if(choise==='View all employees by department'){
    let url = 'http://localhost:3001/api/departmentsort';
    allGetRoutes(url);
  }
  else if(choise==='View all employees by manager'){
    let url = 'http://localhost:3001/api/managersort';
    allGetRoutes(url);
  }
  else if(choise==='View total allocated department budjet'){
    let url = 'http://localhost:3001/api/departmenttotal';
    allGetRoutes(url);
  }
  else if(choise==='Update an employee manager'){
    updateManager();
    console.log('update manager');
  }
  else if(choise==='Delete an employee'){
    deleteRow('employee');
  }
  else if(choise==='Delete a department'){
    deleteRow('department');
  }
  else if(choise==='Delete a role'){
    deleteRow('role');
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
    updateRole();
  }
  else {
  
    // exit
  }
});

async function allGetRoutes(url) {
  await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(data => data.text())
    .then(text => {
    let rows = JSON.parse(text);
    console.table(rows.data);
    table = rows.data;
    return rows.data;
  })
};

async function deleteRow(row) {
  await allGetRoutes(`http://localhost:3001/api/${row}`);
  let choices = [];
  for(i=0;i<table.length;i++) {
    choices.push(table[i].id);
  };
  // console.log(choices);
  // console.log("table ",table);
  inquirer.prompt(
    {
        type: 'input',
        name: 'id',
        message: `Please enter the ${row} id you wish to delete: `,
        validate: inputCheck => {
          for(i=0;i<choices.length;i++) {
            if (choices[i]==inputCheck){
              return true;
            }
          };
          console.log(' Please choose a valid id!');
          return false;
        }
    })
    .then(({id}) => {
      fetch(`http://localhost:3001/api/${row}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(data => data.text())
        .then(text => {
          let rows = JSON.parse(text);
          console.log('-------------')
          console.log(rows.message,`${row} with id:`,rows.id);
          console.log('-------------');
          allGetRoutes(`http://localhost:3001/api/${row}`);
        })
    });
};

async function updateManager() {
  await allGetRoutes(`http://localhost:3001/api/managersort`);
  let employeeChoices = [];
  let managerChoices = [0];
  // console.log("table ",table);
  for(i=0;i<table.length;i++) {
    employeeChoices.push(table[i].employee_id);
  };
  for(i=0;i<table.length;i++) {
    managerChoices.push(table[i].manager_id);
  };
  // console.log(employeeChoices);
  inquirer.prompt([
      {
        type: 'input',
        name: 'eid',
        message: `Please enter the employee id you wish to update: `,
        validate: inputCheck => {
          for(i=0;i<employeeChoices.length;i++) {
            if (employeeChoices[i]==inputCheck){
              return true;
            }
          };
          console.log(' Please choose a valid employee id!');
          return false;
        }
      },
      {
        type: 'input',
        name: 'mid',
        message: `Please enter the manager id you wish to assign the employee to (enter 0 if no manager): `,
        validate: inputCheck => {
          for(i=0;i<managerChoices.length;i++) {
            if (managerChoices[i]==inputCheck){
              return true;
            }
          };
          console.log(' Please choose a valid manager id!');
          return false;
        }
      }
    ])
    .then(answers => {
       fetch(`http://localhost:3001/api/employeemanager`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          manager_id: answers.mid,
          id: answers.eid
        }),
      })
        .then(data => data.text())
        .then(text => {
          let rows = JSON.parse(text);
          console.log('-------------')
          console.log(rows.message,`, Employee manager has been updated`,);
          console.log('-------------');
          allGetRoutes(`http://localhost:3001/api/managersort`);
        })
    });
};

async function updateRole() {
  await allGetRoutes(`http://localhost:3001/api/employee`);
  let employeeChoices = [];
  let roleChoices = [0];
  // console.log("table ",table);
  for(i=0;i<table.length;i++) {
    employeeChoices.push(table[i].id);
  };
  await allGetRoutes(`http://localhost:3001/api/role`);
  for(i=0;i<table.length;i++) {
    roleChoices.push(table[i].id);
  };
  // console.log(employeeChoices);
  inquirer.prompt([
      {
        type: 'input',
        name: 'eid',
        message: `Please enter the id of employee you wish to update: `,
        validate: inputCheck => {
          for(i=0;i<employeeChoices.length;i++) {
            if (employeeChoices[i]==inputCheck){
              return true;
            }
          };
          console.log(' Please choose a valid employee id!');
          return false;
        }
      },
      {
        type: 'input',
        name: 'rid',
        message: `Please enter the role id you wish to assign to the employee: `,
        validate: inputCheck => {
          for(i=0;i<roleChoices.length;i++) {
            if (roleChoices[i]==inputCheck){
              return true;
            }
          };
          console.log(' Please choose a valid manager id!');
          return false;
        }
      }
    ])
    .then(answers => {
       fetch(`http://localhost:3001/api/employee`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role_id: answers.rid,
          id: answers.eid
        }),
      })
        .then(data => data.text())
        .then(text => {
          let rows = JSON.parse(text);
          console.log('-------------')
          console.log(rows.message,`, Employee role has been updated`,);
          console.log('-------------');
          allGetRoutes(`http://localhost:3001/api/employee`);
        })
    });
};
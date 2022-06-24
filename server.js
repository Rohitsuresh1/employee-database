const express = require('express');
const inquirer = require("inquirer");
const db = require('./db/connections');
const apiRoutes = require('./routes/apiRoutes');
const fetch = require('node-fetch');
const { response } = require('express');
const { json } = require('body-parser');
const { async } = require('rxjs');
const inputCheck = require('./utils/inputCheck');
const { start } = require('repl');
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

async function startApp() {
  inquirer.prompt(
  {
      type: 'list',
      name: 'choise',
      message: 'Do you want to ',
      choices: ['View all roles','View all employees','View all departments','View all employees by department','View all employees by manager','Add a department','Add a role','Add an employee','View total allocated department budjet','Update an employee role','Update an employee manager','Delete an employee','Delete a department','Delete a role','Exit']
  })
  .then(async ({ choise }) => {
    if(choise==='View all roles'){
      let url = 'http://localhost:3001/api/role';
      await allGetRoutes(url);
      restart();
    }
    else if(choise==='View all employees'){
      let url = 'http://localhost:3001/api/employee';
      await allGetRoutes(url);
      restart();
    }
    else if(choise==='View all departments'){
      let url = 'http://localhost:3001/api/department';
      await allGetRoutes(url);
      restart();
    }
    else if(choise==='View all employees by department'){
      let url = 'http://localhost:3001/api/departmentsort';
      await allGetRoutes(url);
      restart();
    }
    else if(choise==='View all employees by manager'){
      let url = 'http://localhost:3001/api/managersort';
      await allGetRoutes(url);
      restart();
    }
    else if(choise==='View total allocated department budjet'){
      let url = 'http://localhost:3001/api/departmenttotal';
      await allGetRoutes(url);
      restart();
    }
    else if(choise==='Update an employee manager'){
      await updateManager();
      restart();
    }
    else if(choise==='Delete an employee'){
      await deleteRow('employee');
      restart();
    }
    else if(choise==='Delete a department'){
      await deleteRow('department');
      restart();
    }
    else if(choise==='Delete a role'){
      await deleteRow('role');
      restart();
    }
    else if(choise==='Add a department'){
      await addDept();
      restart();
    }
    else if(choise==='Add a role'){
      await addRole();
      restart();
    }
    else if(choise==='Add an employee'){
      await addEmployee();
      restart();
    }
    else if(choise==='Update an employee role'){
      await updateRole();
      restart();
    }
    else {
      console.log('--------------------------------------');
      console.log('_________ Have a great day!___________');
      console.log('--------------------------------------');
      process.exit();
    }
});}

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
  await inquirer.prompt(
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
  await inquirer.prompt([
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
  await inquirer.prompt([
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
          console.log(' Please choose a valid role id!');
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

async function addDept() {
  await allGetRoutes(`http://localhost:3001/api/department`);
  let names = [];
  // console.log("table ",table);
  for(i=0;i<table.length;i++) {
    names.push(table[i].name);
  };
  // console.log(employeeChoices);
  await inquirer.prompt(
      {
        type: 'input',
        name: 'name',
        message: `Enter the new department name that you would like to add: `,
        validate: inputCheck => {
          for(i=0;i<names.length;i++) {
            if (names[i]==inputCheck){
              console.log(' Please create a department that does not already exist!');
              return false;
            }
          };
          return true;
        }
      }  
    )
    .then(({ name }) => {
       fetch(`http://localhost:3001/api/department`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name
        }),
      })
        .then(data => data.text())
        .then(text => {
          let rows = JSON.parse(text);
          console.log('-------------')
          console.log(rows.message,`, new department has been added!`,);
          console.log('-------------');
          allGetRoutes(`http://localhost:3001/api/department`);
        })
    });
};

async function addRole() {
  console.log('|----------------------------|');
  console.log(' All Roles at the oranization');
  console.log('|----------------------------|');
  await allGetRoutes(`http://localhost:3001/api/role`);
  let titles = [];
  // console.log("table ",table);
  for(i=0;i<table.length;i++) {
    titles.push(table[i].title);
  };
  console.log('|----------------------------------|');
  console.log(' All Departments at the oranization');
  console.log('|----------------------------------|');
  await allGetRoutes(`http://localhost:3001/api/department`);
  let departments=[];
  for(i=0;i<table.length;i++) {
    departments.push(table[i].id);
  };
  // console.log(employeeChoices);
  await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: `Enter the new role name that you would like to add: `,
        validate: inputCheck => {
          for(i=0;i<titles.length;i++) {
            if (titles[i]==inputCheck){
              console.log(' Please create a title that does not already exist!');
              return false;
            }
          };
          return true;
        }
      }, 
      {
        type: 'input',
        name: 'salary',
        message: `Enter the salary for this role: `,
        validate: inputCheck => {
            if (inputCheck){
              return true;
            }
            else{
              console.log(' Please enter a valid salary');
              return false;
            }
        }
      }, 
      {
        type: 'input',
        name: 'dep',
        message: `Enter the department id that you want to add this role to: `,
        validate: inputCheck => {
          for(i=0;i<departments.length;i++) {
            if (departments[i]==inputCheck){
              return true;
            }
          };
          console.log(' Please enter a valid department id!');
          return false;
        }
      }
    ])
    .then(answers => {
       fetch(`http://localhost:3001/api/role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: answers.name,
          salary: answers.salary,
          department_id: answers.dep
        }),
      })
        .then(data => data.text())
        .then(text => {
          let rows = JSON.parse(text);
          console.log('-------------')
          console.log(rows.message,`, new role has been added!`,);
          console.log('-------------');
          console.log('|----------------------------|');
          console.log(' All Roles at the oranization');
          console.log('|----------------------------|');
          allGetRoutes(`http://localhost:3001/api/role`);
        })
    });
};

async function addEmployee() {
  console.log('|----------------------------|');
  console.log(' All Roles at the oranization');
  console.log('|----------------------------|');
  await allGetRoutes(`http://localhost:3001/api/role`);
  let titles = [];
  // console.log("table ",table);
  for(i=0;i<table.length;i++) {
    titles.push(table[i].id);
  };
  console.log('|----------------------------------|');
  console.log(' All Managers at the oranization');
  console.log('|----------------------------------|');
  await allGetRoutes(`http://localhost:3001/api/managersort`);
  let manager=[0];
  for(i=0;i<table.length;i++) {
    manager.push(table[i].id);
  };
  // console.log(employeeChoices);
  await inquirer.prompt([
      {
        type: 'input',
        name: 'fname',
        message: `Enter the first name of the employee: `,
        validate: inputCheck => {
          if (inputCheck){
            return true;
          }
          else{
            console.log(' Please enter a first name!');
            return false;
          }
        }
      }, 
      {
        type: 'input',
        name: 'lname',
        message: `Enter the last name of the employee: `,
        validate: inputCheck => {
          if (inputCheck){
            return true;
          }
          else{
            console.log(' Please enter a last name!');
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'role',
        message: `Enter the role id of this new employee: `,
        validate: inputCheck => {
          for(i=0;i<titles.length;i++) {
            if (titles[i]==inputCheck){
              return true;
            }
          };
          console.log(' Please enter a valid role id!');
          return false;
        }
      }, 
      {
        type: 'input',
        name: 'mid',
        message: `Enter the manager's id for the new employee (enter 0 if no manager): `,
        validate: inputCheck => {
          for(i=0;i<manager.length;i++) {
            if (manager[i]==inputCheck){
              return true;
            }
          };
          console.log(' Please enter a valid manager id!');
          return false;
        }
      }
    ])
    .then(answers => {
       fetch(`http://localhost:3001/api/employee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: answers.fname,
          last_name: answers.lname,
          role_id: answers.role,
          manager_id: answers.mid
        }),
      })
        .then(data => data.text())
        .then(text => {
          let rows = JSON.parse(text);
          console.log('-------------')
          console.log(rows.message,`, new employee has been added!`,);
          console.log('-------------');
          console.log('|--------------------------------|');
          console.log(' All employees at the oranization');
          console.log('|--------------------------------|');
          allGetRoutes(`http://localhost:3001/api/employee`);
        })
    });
};

function restart() {
  inquirer.prompt(
    {
      type:'list',
      name:'restart',
      message: 'Would you like to perform another funtion?',
      choices: ['Yes','No']
    }
  ).then(({restart})=> {
      if(restart==='Yes')
          startApp();
      else {
        console.log('--------------------------------------');
        console.log('_________ Have a great day!___________');
        console.log('--------------------------------------');
        process.exit();
      }
  });
};

startApp();
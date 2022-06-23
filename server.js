const express = require('express');
// const inquirer = require('inquirer');
const db = require('./db/connections');
const apiRoutes = require('./routes/apiRoutes');




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

// inquirer.prompt(
//   {
//       type: 'list',
//       name: 'choise',
//       message: 'Do you want to ',
//       choices: ['View all roles','View all employees','Add a department','Add a role','Add an employee','Update an employee role']
//   });
// )
// .then(({choice})=>{
//   if(choice==='View all roles'){
      
//   }
//   else if(choice==='View all employees'){
      
//   }
//   else if(choice==='Add a department'){
      
//   }
//   else if(choice==='Add a role'){
      
//   }
//   else if(choice==='Add an employee'){
      
//   }
//   else if(choice==='Update an employee role'){
      
//   }
// });

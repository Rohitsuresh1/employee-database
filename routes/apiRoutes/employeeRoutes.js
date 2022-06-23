const express = require('express');
const router = express.Router();
const db = require('../../db/connections');
const inputCheck = require('../../utils/inputCheck');


// Get all roles with the associated departments
router.get('/employee', (req, res) => {
    const sql = `SELECT employee.id,employee.first_name,employee.last_name, roles.title, roles.salary,department.name 
                  AS department_name 
                  FROM employee 
                  LEFT JOIN roles 
                  ON employee.role_id = roles.id
                  LEFT JOIN department
                  ON roles.department_id=department.id`;
  
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: rows
      });
    });
  });

// View all employees by manager
router.get('/managersort', (req,res) => {
    const sql = `SELECT man.first_name AS manager_name, emp.first_name AS employee_firstname, emp.last_name AS employee_lastname
                FROM employee emp
                JOIN employee man
                ON emp.manager_id = man.id`;
    db.query(sql, (err,rows) => {
      if(err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({
          message: 'success',
          data: rows
      });
    });
  });

//Update employee role
router.put('/employee', ({body},res) => {
    const sql= `UPDATE employee SET role_id=? WHERE id=?`;
    const params = [body.role_id, body.id];
    db.query(sql, params , (err, body) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          res.json({
            message: 'success',
            data: body
          });
    });
});

//View employees by department
router.get('/departmentsort', (req,res) => {
    const sql = `SELECT department.id AS department_id, department.name AS department_name, roles.title,employee.first_name, employee.last_name 
                FROM employee
                LEFT JOIN roles 
                ON employee.role_id = roles.id
                LEFT JOIN department
                ON roles.department_id=department.id
                ORDER BY department.id`;
    db.query(sql, (err,rows) => {
      if(err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({
          message: 'success',
          data: rows
      });
    });
});

// add an employee
router.post('/employee', ({ body },res) => {
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                VALUES (?, ?, ?, ?)`;
    const params = [
        body.first_name,
        body.last_name,
        body.role_id,
        body.manager_id
    ];
    db.query(sql, params , (err, body) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          res.json({
            message: 'success',
            data: body
          });
    });
});  

// delete an employee
router.delete('/employee/:id', (req, res) => {
    const sql = `DELETE FROM employee WHERE id = ?`;
    const params = [req.params.id];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: res.message });
      } else if (!result.affectedRows) {
        res.json({
          message: 'role not found'
        });
      } else {
        res.json({
          message: 'deleted',
          changes: result.affectedRows,
          id: req.params.id
        });
      }
    });
  });

//Update employee manager 
router.put('/employeemanager', ({body},res) => {
    const sql= `UPDATE employee SET manager_id=? WHERE id=?`;
    const params = [body.manager_id, body.id];
    db.query(sql, params , (err, body) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          res.json({
            message: 'success',
            data: body
          });
    });
});
  
  module.exports = router;
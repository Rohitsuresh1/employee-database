const express = require('express');
const router = express.Router();
const db = require('../../db/connections');

//Get all departments 
router.get('/department', (req,res) => {
    const sql =`SELECT * FROM department`;

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

//add a department 
router.post('/department', ({ body }, res) => {
    if (!body.name) {
      res.status(400).json({ error: errors });
      return;
    }
  
    const sql = `INSERT INTO department (name) VALUES (?)`;
    const params =body.name;
    db.query(sql, params, (err, result) => {
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

//delete a department 
router.delete('/department/:id', (req, res) => {
    const sql = `DELETE FROM department WHERE id = ?`;
    const params = [req.params.id];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: res.message });
      } else if (!result.affectedRows) {
        res.json({
          message: 'Department not found'
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


  //getting total salary allocation for a department 
  router.get('/departmenttotal', (req,res) => {
    const sql = `SELECT department.name, SUM(salary) AS total_allotted_budget FROM employee LEFT JOIN roles 
                ON employee.role_id = roles.id
                LEFT JOIN department
                ON roles.department_id=department.id
                GROUP BY department.name`;
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
  
  module.exports = router;
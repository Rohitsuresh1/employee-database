const express = require('express');
const router = express.Router();
const db = require('../../db/connections');
const inputCheck = require('../../utils/inputCheck');


// Get all roles with the associated departments
router.get('/role', (req, res) => {
    const sql = `SELECT roles.*, department.name 
                  AS department_name 
                  FROM roles 
                  LEFT JOIN department 
                  ON roles.department_id = department.id`;
  
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

//add a role
router.post('/role', ({ body }, res) => {
    const errors = inputCheck(
        body,
        'title',
        'salary',
        'department_id'
      );
      if (errors) {
        res.status(400).json({ error: errors });
        return;
      }
  
    const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
    const params =[body.title,body.salary,body.department_id];
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

//delete a role
router.delete('/role/:id', (req, res) => {
    const sql = `DELETE FROM roles WHERE id = ?`;
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
  
  module.exports = router;
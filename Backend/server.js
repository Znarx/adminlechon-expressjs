const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  
}));

const db = mysql.createConnection({
  host: "localhost",
  user: 'root',
  password: '',
  database: 'rubybellylechon'
});



// signin
app.post('/signin', (req, res) => {
  const { username, password } = req.body;

  try{
  const sql = `SELECT * FROM admin WHERE username = ? AND password = ?`;
  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ error: 'An error occurred during signin' });
    }

    if (result.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    req.session.user = result[0];
    res.cookie('user', result[0].username, { maxAge: 900000, httpOnly: true });

    return res.status(200).json({ success: true, message: 'Signin successful', username: result[0].username });
  });
  } catch (error) {
    return res.status(500).json({ error: 'An Error occurred during signin'});
  }
  });



  //for pin
  app.post('/val-pin', (req, res) => {
    const { pin } = req.body;

    try {
      const sql = `SELECT * FROM admin WHERE pin = ?`; // Assuming you have a 'pin' column in your admin table
      db.query(sql, [pin], (err, result) => {
        if (err) {
          console.error('Query error:', err);
          return res.status(500).json({ error: 'An error occurred during pin validation' });
        }

        if (result.length === 0) {
          return res.status(401).json({ success: false, error: 'Invalid pin' });
        }

        // If the pin is valid, you can save the user session if necessary
        req.session.user = result[0];
        return res.status(200).json({ success: true, message: 'Pin validated successfully' });
      });
    } catch (error) {
      return res.status(500).json({ error: 'An error occurred during pin validation' });
    }
  });

  app.get('/aproduct', (req, res) => {
    const query = 'SELECT * FROM aproduct';
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(results);
      }
    });
  });
  


  // Add a new product
  app.post('/aproduct', (req, res) => {
    const { productid, name, price, description } = req.body;
    const query = 'INSERT INTO aproduct (productid, name, price, description) VALUES (?, ?, ?, ?)';
    db.query(query, [productid, name, price, description], (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({ success: true, message: 'Product added successfully' });
      }
    });
  });
  
  // Update a product
  app.put('/aproduct/:productid', (req, res) => {
    const { productid, name, price, description } = req.body;
    const query = 'UPDATE aproduct SET name = ?, price = ?, description = ? WHERE productid = ?';
    db.query(query, [name, price, description, req.params.productid], (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({ success: true, message: 'Product updated successfully' });
      }
    });
  });
  
  // Delete a product
  app.delete('/aproduct/:productid', (req, res) => {
    const { productid } = req.params;
    const query = 'DELETE FROM aproduct WHERE productid = ?';
    db.query(query, [productid], (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({ success: true, message: 'Product deleted successfully' });
      }
    });
  });
  



  // GET all staff members
app.get('/astaff', (req, res) => {
  const sql = 'SELECT * FROM astaff';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});


// ADD a new staff member
app.post('/astaff', (req, res) => {
  const { staffid, name, position, contact } = req.body;
  const sql = 'INSERT INTO astaff (staffid, name, position, contact) VALUES (?, ?, ?, ?)';
  db.query(sql, [staffid, name, position, contact], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Staff member added' });
  });
});


// UPDATE a staff member
app.put('/astaff/:staffid', (req, res) => {
  const { staffid } = req.params;
  const { name, position, contact } = req.body;
  const sql = 'UPDATE astaff SET name = ?, position = ?, contact = ? WHERE staffid = ?';
  db.query(sql, [name, position, contact, staffid], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Staff member updated' });
  });
});

// DELETE a staff member
app.delete('/astaff/:staffid', (req, res) => {
  const { staffid } = req.params;
  const sql = 'DELETE FROM astaff WHERE staffid = ?';
  db.query(sql, [staffid], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Staff member deleted' });
  });
});




// GET all customers
app.get('/acustomer', (req, res) => {
  const sql = 'SELECT * FROM acustomer'; // Ensure your table name is correct
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ADD a new customer
app.post('/acustomer', (req, res) => {
  const { customerid, name, address, contactNumber } = req.body;
  const sql = 'INSERT INTO acustomer (customerid, name, address, contactNumber) VALUES (?, ?, ?, ?)';
  db.query(sql, [customerid, name, address, contactNumber], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Customer added' });
  });
});


// UPDATE a customer
app.put('/acustomer/:customerid', (req, res) => {
  const { customerid } = req.params;
  const { name, address, contactNumber } = req.body;
  const sql = 'UPDATE acustomer SET name = ?, address = ?, contactNumber = ? WHERE customerid = ?';
  db.query(sql, [name, address, contactNumber, customerid], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Customer updated' });
  });
});


// DELETE a customer
app.delete('/acustomer/:customerid', (req, res) => {
  const { customerid } = req.params;
  const sql = 'DELETE FROM acustomer WHERE customerid = ?';
  db.query(sql, [customerid], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Customer deleted' });
  });
});


// Get all inventory
app.get('/ainventory', (req, res) => {
  const query = 'SELECT * FROM ainventory';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Add new inventory item
app.post('/ainventory', (req, res) => {
  const { id, quantity, supplierId, remainingStock, dateAdded, status } = req.body;
  const query = 'INSERT INTO ainventory (id, quantity, supplierId, remainingStock, dateAdded, status) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [id, quantity, supplierId, remainingStock, dateAdded, status], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ id, quantity, supplierId, remainingStock, dateAdded, status });
    }
  });
});

// Update existing inventory item
app.put('/ainventory/:id', (req, res) => {
  const { id, quantity, supplierId, remainingStock, dateAdded, status } = req.body;
  const query = 'UPDATE ainventory SET quantity = ?, supplierId = ?, remainingStock = ?, dateAdded = ?, status = ? WHERE id = ?';
  db.query(query, [quantity, supplierId, remainingStock, dateAdded, status, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });
});

// Delete inventory item
app.delete('/ainventory/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM ainventory WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });
});








app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

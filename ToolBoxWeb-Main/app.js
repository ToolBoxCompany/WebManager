const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// Configurar EJS para las vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


// Conexion a la bd
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tool_interchange',
  port: 3307
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado a la base de datos');
});
// index y contacto
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/contacto', (req, res) => {
  res.sendFile(path.join(__dirname, 'contacto.html'));
});

/// Ruta principal: catálogo
app.get('/catalog', (req, res) => {
  const query = `
    SELECT 
      t.idTool,
      t.nameTool,
      t.pricePerDay,
      t.stock,
      c.nameCategory,
      u.nameUser
    FROM TOOL t
    JOIN CATEGORY c ON t.idCategory = c.idCategory
    JOIN USERS u ON t.idUser = u.idUser
    WHERE t.stock > 0
  `;
  
  db.query(query, (err, results) => {
    if (err) throw err;
    res.render('catalog', { tools: results });
  });
});


// Pagina de herramienta individual
app.get('/tool/:id', (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT T.nameTool, T.pricePerDay, T.stock, C.nameCategory, U.nameUser
    FROM TOOL T
    JOIN CATEGORY C ON T.idCategory = C.idCategory
    JOIN USERS U ON T.idUser = U.idUser
    WHERE T.idTool = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) throw err;
    res.render('tool', { tool: results[0] });
  });
});

app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});

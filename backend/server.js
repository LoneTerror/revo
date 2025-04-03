require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  connectionString: 'postgresql://testdb_owner:npg_qTPFD1Isi3be@ep-yellow-scene-a5mv74d9-pooler.us-east-2.aws.neon.tech/testdb?sslmode=require',
  ssl: {
    rejectUnauthorized: false,
  },
});

// Fetch voter stats (Updated for PostgreSQL)
app.get('/api/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) AS total_voters,
        SUM(CASE WHEN status = 'verified' THEN 1 ELSE 0 END) AS verified,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending
      FROM voters;
    `);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Fetch a voter by ID
app.get('/verify/:voterId', async (req, res) => {
  const { voterId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM voters WHERE voter_id = $1", [voterId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Voter not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(5006, () => console.log("Server running on port 5006"));

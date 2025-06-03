// Admin dashboard functionality
const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'restaurant',
  password: 'password',
  port: 5432,
});

// Get all reservations
async function getAllReservations() {
  try {
    const result = await pool.query('SELECT * FROM reservations ORDER BY date, time');
    return result.rows;
  } catch (error) {
    throw error;
  }
}

// Update menu item
async function updateMenuItem(id, name, description, price) {
  try {
    const result = await pool.query(
      'UPDATE menu SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *',
      [name, description, price, id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

// Delete reservation
async function deleteReservation(id) {
  try {
    await pool.query('DELETE FROM reservations WHERE id = $1', [id]);
    return { success: true };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllReservations,
  updateMenuItem,
  deleteReservation
};
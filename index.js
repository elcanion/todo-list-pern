const express = require("express");
const cors = require("cors");
const pool = require("./db");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;


/* middleware */
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "client/dist")))

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client/dist")))
}

console.log(__dirname);

/* routes */

app.get("/todos", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    } catch (error) {
        console.error(error.message);
    }
})

app.get("/todos/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await pool.query(
            "SELECT (description) FROM todo WHERE id=($1)",
            [id]
            );
        res.json(todo.rows);
    } catch (error) {
        console.error(error.message);
    }
})

app.post("/todos", async (req, res) => {
    const date = new Date(Date.now());
    try {
        const { description, isdone } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description, isdone, createdAt) VALUES($1, $2, $3) RETURNING *",
            [description, isdone, date]
        );

        res.json(newTodo.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
})

app.put("/todos/:id", async (req, res) => {
    const { id } = req.params;
    const { description, isdone } = req.body;
    try {
        const todo = await pool.query(
            "UPDATE todo SET description=($1), isDone=($2) WHERE id=($3)",
            [description, isdone, id]
            );
        res.json("To-do updated");
    } catch (error) {
        console.error(error.message);
    }
})

app.delete("/todos/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await pool.query(
            "DELETE FROM todo WHERE id=($1)",
            [id]
            );
        res.json("To-do deleted");
    } catch (error) {
        console.error(error.message);
    }
})

app.listen(PORT, (req, res) => {
    console.log(`listening to port ${PORT}...`);
})
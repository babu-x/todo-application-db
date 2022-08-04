const express = require('express');
const app = express();
app.use(express.json());
module.exports = app;

const {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.join(__dirname,'todoApplication.db');
let db = null;

const initializeDBAndServer = async () =>{
    try {
        db = await open({
            filename:dbPath,
            driver: sqlite3.Database
        });
        app.listen(3000, () => {
            console.log('Server is running at http://localhost:3000/')
        });
    } catch (error) {
        console.log(`DB Error: ${error.message}`);
        process.exit(1)
    }
}

initializeDBAndServer();

app.get('/todos/', async(request, response) => {
    const {status} = request.query;
    const getQuery = `SELECT * FROM todo
    WHERE status LIKE '%${status}%';`;
    const dbResponse = await db.all(getQuery);
    response.send(dbResponse);
});

app.get('/todos/', async(request, response) => {
    const {priority} = request.query;
    const getQuery = `SELECT * FROM todo
    WHERE priority LIKE '%${priority}%';`;
    const dbResponse = await db.all(getQuery);
    response.send(dbResponse);
});

app.get('/todos/', async(request, response) => {
    const {priority, status} = request.query;
    const getQuery = `SELECT * FROM todo
    WHERE status LIKE '%${status}%',
    priority LIKE '%${priority}%';`;
    const dbResponse = await db.all(getQuery);
    response.send(dbResponse);
});

app.get('/todos/', async(request, response) => {
    const {search_q = " "} = request.query;
    const getQuery = `SELECT * FROM todo
    WHERE todo LIKE '%${search_q}%';`;
    const dbResponse = await db.all(getQuery);
    response.send(dbResponse);
});


app.get('/todos/:todoId/', async(request, response) =>{
    const {todoId} = request.params;
    const getQuery = `SELECT * FROM todo
    WHERE id = '${todoId}';`;
    const dbResponse = await db.get(getQuery);
    response.send(dbResponse);
});

app.post('/todos/', async (request, response) => {
    const todoDetails = request.body;
    const {id, todo, priority, status} = todoDetails;
    const postQuery = `INSERT INTO todo(id,todo,priority,status)
    VALUES('${id}','${todo}','${priority}','${status}');`;
    const dbResponse = await db.run(postQuery);
    const todoId = dbResponse.lastID;
    response.send('Todo Successfully Added');
});


app.delete('/todos/:todoId/', async(request, response) => {
    const {todoId} = request.params;
    const delQuery = `DELETE FROM todo
    WHERE id = '${todoId}';`;
    await db.run(delQuery);
    response.send('Todo Deleted');
})




app.put('/todos/:todoId/', async(request, response) =>{
const {todoId} = request.params;
const todoDetails = request.body;
const{todo,priority} = todoDetails;
const {status}= request.query;
const putQuery = `UPDATE todo
SET
todo = '${todo}',
status = '${status}',
priority = '${priority},'
WHERE id = '${todoId}';`;
const dbResponse = await db.run(putQuery);
response.send("Status Updated");
});

app.put('/todos/:todoId/', async(request, response) =>{
const {todoId} = request.params;
const todoDetails = request.body;
const {priority}= request.query;
const putQuery = `UPDATE todo
SET 
priority = '${priority}'
WHERE id = '${todoId}';`;
const dbResponse = await db.run(putQuery);
response.send("Priority Updated");
});

app.put('/todos/:todoId/', async(request, response) =>{
const {todoId} = request.params;
const todoDetails = request.body;
const {todo}= todoDetails;
const putQuery = `UPDATE todo
SET 
todo = '${todo}'
WHERE id = '${todoId}';`;
const dbResponse = await db.run(putQuery);
response.send("Todo Updated");
});


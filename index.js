const { response } = require('express')
const express = require('express') // importing the express framework and storing it in a variable

const fs=require('fs')
const { request } = require('http')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))

//get all todo items
app.get('/todos',(request,response)=>{

    const showPending = request.query.showpending


    fs.readFile('./store/todos.json','utf-8',(err,data)=>{

        if (err) {
            return response.status(500).send('file not found')
        }
        const todos = JSON.parse(data)

        //filter all pending todos if not query parameter is not True
        if (showPending !== "True") {
            return response.json({todos : todos})
        }
        else{
            return response.json({
                todos : todos.filter(todo => {return todo.complete === false})})
        }
        

    })
})

//get todo items by id and update item
app.get('/todos/:id/complete',(request,response)=>{

    const id = request.params.id

    const findTodosById = (todos,id) => {
        
        for (let i = 0; i < todos.length; i++) {
            
            if (todos[i].id=== parseInt(id)) {
                return i
            }
        }

        return -1
    }

    fs.readFile('./store/todos.json','utf-8',(err,data)=>{

        if (err) {
            return response.status(500).send('file not found')
        }
        let todos = JSON.parse(data)
        const todoIndex = findTodosById(todos,id)

        if (todoIndex===-1) {
            return response.status(404).send('not found in the list')
        }

        todos[todoIndex].complete = true
        fs.writeFile('./store/todos.json',JSON.stringify(todos),()=>{
            response.json({'status':'ok'})
        })

    })
})

//add a new todo item to the list
app.post('/todo',(request,response) => {
    if (!request.body.name) {
        return response.status(400).send("Missing name")
    }

    fs.readFile('./store/todos.json', 'utf-8',(err,data)=>{
        if (err) {
            return response.status(500).send('file not found')
        }

        let todos = JSON.parse(data)
        const maxId = Math.max.apply(Math, todos.map(todo => {return todo.id}))

        todos.push({
            id: maxId+1,
            complete: false,
            name: request.body.name
        })

        fs.writeFile('./store/todos.json',JSON.stringify(todos),()=>{
            response.json({'status':'ok'})
        })

    })

})


app.listen(3000, ()=>{
    console.log('application running on http://localhost:3000')
})
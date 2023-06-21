const { response } = require('express')
const express = require('express') // importing the express framework and storing it in a variable

const fs=require('fs')
const app = express()

//get all todo items
app.get('/todos',(request,response)=>{

    fs.readFile('./store/todos.json','utf-8',(err,data)=>{

        if (err) {
            return response.status(500).send('file not found')
        }
        const todos = JSON.parse(data)
        return response.json({todos : todos})

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



app.listen(3000, ()=>{
    console.log('application running on http://localhost:3000')
})
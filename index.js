const { response } = require('express')
const express = require('express') // importing the express framework and storing it in a variable

const fs=require('fs')
const app = express()

app.get('/todos',(request,response)=>{

    fs.readFile('./store/todos.json','utf-8',(err,data)=>{

        if (err) {
            return response.status(500).send('file not found')
        }
        const todos = JSON.parse(data)
        return response.json({todos : todos})

    })
})


app.listen(3000, ()=>{
    console.log('application running on http://localhost:3000')
})
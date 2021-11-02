const express = require('express');
const { v4: uuidV4 } = require('uuid');


const app = express();

app.use(express.json())

const customers = []

/*
    name: string;
    cpf: string,
    id: uuidV4(),
    statement: string[]
*/

app.post('/account', (request, response) => {
    const { cpf, name } = request.body;

    const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf)
    if (customerAlreadyExists) {
        return response.status(400).json({ error: 'Customer already exists' })
    }

    customers.push({
        name,
        cpf,
        id: uuidV4(),
        statement: []
    })
    return response.status(201).send()

})


app.get('/statement', (request, response) => {
    const { cpf } = request.headers

    const customer = customers.find((customer) => customer.cpf === cpf)

    if(!customer){
        return response.status(400).json({ error: 'Customer not found' })
    }

    return response.status(200).json(customer.statement)
})

app.listen(3333)
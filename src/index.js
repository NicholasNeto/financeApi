const express = require('express');
const { v4: uuidV4 } = require('uuid');


const app = express();
app.use(express.json())

const customers = []

// Middleware

function verifyIfExistsAccountCPF(request, response, next) {
    const { cpf } = request.headers
    const customer = customers.find((customer) => customer.cpf === cpf)
    
    if (!customer) {
        return response.status(400).json({ error: 'Customer not found' })
    }

    request.customer = customer;

    return next();
}

function getBalance(statement) {
    const balance = statement.reduce(( acc, operation ) => {
        if(operation.type === 'credit') {
            return acc + operation.amount;
        } else {
            return acc - operation.amount;
        } 
    }, 0)

    return balance 
}



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



app.get('/statement', verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request
    return response.status(200).json(customer.statement)
})

app.get('/statement/date', verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request
    const { date } = request.query
    const dateFormat =  new Date(date + " 00:00")

    const statements = customer.statement.filter(statement => {
        statement.created_at.toDateString() === new Date(dateFormat).toDateString()
    })

    return response.status(200).json(statements)
})


app.post('/deposit', verifyIfExistsAccountCPF, (request, response) => {
    const { description, amount } = request.body
    const { customer } = request

    const statementOperation = {
        description: description,
        amount: amount,
        created_at: new Date(),
        type: 'credit'
    }
    customer.statement.push(statementOperation)
    return response.status(201).send()
})

app.post('/withdraw', verifyIfExistsAccountCPF, (request, response) => {
    const { amount } = request.body
    const { customer } = request
 
    const balance =  getBalance(customer.statement)
    
    if(balance < amount) {
        return response.status(400).json({error: 'Insufficient funds !'}) 
    } 

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: 'debit'
    }

    customer.statement.push(statementOperation)
    return response.status(201).send()

})


app.listen(3333)
# financeApi


## Requisitos 

- [X] Deve ser possível criar uma conta
- [X] Deve ser possível buscar o extrato bancário do cliente.
- [] Deve ser possível realizar um depósito
- [] Deve ser possível realizar um saque
- [] Deve ser possível buscar o extrato bancário do cliente por data
- [] Deve ser possível atualizar dados da conta do cliente.
- [] Deve ser possível obter dados da conta do cliente.
- [] Deve ser possível deletar uma conta.

## Regras de negócio 
- [X] Não deve ser possivel cadastrar uma conta com CPF já existente.
- [X] Não deve ser possivel fazer depósito em uma conta não existente.
- [] Não deve ser possivel buscar extrato em uma conta não existente.
- [] Não deve ser possivel fazer saques em uma conta não existente.
- [] Não deve ser possivel excluir uma conta não existente.
- [] Não deve ser possivel fazer saque quando o saldo for insuficiente. 



## Middleware

Formas de utilizar (chamar) um Middleware: 


Para utilização especifica em algum endpoint. 
```
app.get('/statement', verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request
    return response.status(200).json(customer.statement)
})
```

Do ponto da declaração em diante TODOS os endpoints vão utilizar este middleware. 
```
app.use(verifyIfExistsAccountCPF)
```
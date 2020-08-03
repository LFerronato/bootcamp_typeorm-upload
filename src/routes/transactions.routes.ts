import { Router } from 'express'
import { getCustomRepository } from 'typeorm'

import TransactionsRepository from '../repositories/TransactionsRepository'
import CreateTransactionService from '../services/CreateTransactionService'
import DeleteTransactionService from '../services/DeleteTransactionService'
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router()
const transactionsRepository = getCustomRepository(TransactionsRepository)
const createTransactionService = new CreateTransactionService()

transactionsRouter.get('/', async (request, response) => {
  return response.json(transactionsRepository.find())
})

transactionsRouter.post('/', async (request, response) => {
  const { title, type, value, category } = request.body
  const transaction = createTransactionService.execute({
    title,
    type,
    value,
    category,
  })
  return response.json(transaction)
})

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params
  const deleteTransactionService = new DeleteTransactionService()
  await deleteTransactionService.execute(id)
  return response.json({ message: `item ${id} has deleted!` })
})

// transactionsRouter.post('/import', async (request, response) => {
//   // TODO
// })

export default transactionsRouter

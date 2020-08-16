import { Router } from 'express'
import { getCustomRepository } from 'typeorm'
import multer from 'multer'

import TransactionsRepository from '../repositories/TransactionsRepository'
import CreateTransactionService from '../services/CreateTransactionService'
import DeleteTransactionService from '../services/DeleteTransactionService'
import ImportTransactionsService from '../services/ImportTransactionsService'

import uploadConfig from '../configs/upload'

const multerUpload = multer(uploadConfig)

const transactionsRouter = Router()
const createTransactionService = new CreateTransactionService()

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository)
  const transactions = await transactionsRepository.find()
  const balance = await transactionsRepository.getBalance()
  const result = {
    transactions,
    balance,
  }
  return response.json(result)
})

transactionsRouter.post('/', async (request, response) => {
  const { title, type, value, category } = request.body
  const transaction = await createTransactionService.execute({
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

transactionsRouter.post(
  '/import',
  multerUpload.single('file'),
  async (request, response) => {
    const importTransactionsService = new ImportTransactionsService()

    const insertedTransactions = await importTransactionsService.execute(
      request.file.path,
    )
    return response.json(insertedTransactions)
  },
)

export default transactionsRouter

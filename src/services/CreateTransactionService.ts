import { getCustomRepository, getRepository } from 'typeorm'
// import AppError from '../errors/AppError'
import TransactionsRepository from '../repositories/TransactionsRepository'
import Transaction from '../models/Transaction'
import Category from '../models/Category'

// const appError = new AppError()

interface Request {
  title: string
  type: 'income' | 'outcome'
  value: number
  category: string
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category)
    let categ = await categoryRepository.findOne({
      where: { title: category },
    })
    if (!categ) {
      categ = categoryRepository.create({
        title: category,
      })
    }
    const transactionsRepository = getCustomRepository(TransactionsRepository)
    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category: categ,
    })
    transactionsRepository.save(transaction)
    return transaction
  }
}

export default CreateTransactionService

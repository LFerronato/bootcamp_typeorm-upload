import { getCustomRepository, getRepository, In } from 'typeorm'
import csvParse from 'csv-parse'
import fs from 'fs'
import Transaction from '../models/Transaction'
import Category from '../models/Category'

import TransactionsRepository from '../repositories/TransactionsRepository'

interface CSVTransaction {
  title: string
  type: 'income' | 'outcome'
  value: number
  category: string
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const transactionsRepository = getCustomRepository(TransactionsRepository)
    const categoriesRepository = getRepository(Category)

    const file = fs.createReadStream(filePath)

    const parseConfig = csvParse({
      from_line: 2,
    })
    const parseCSV = file.pipe(parseConfig)

    const transactions: CSVTransaction[] = []
    const categories: string[] = []

    parseCSV.on('data', async line => {
      const [title, type, valueS, category] = line.map((cell: string) =>
        cell.trim(),
      )
      if (!title || !type || !valueS) return
      const value = Number(valueS)
      categories.push(category)
      transactions.push({ title, type, value, category })
    })
    await new Promise(resolve => parseCSV.on('end', resolve))

    const existentsCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    })
    const existentsCategoriesTitles = existentsCategories.map(ec => ec.title)
    const categoriesToInsert = categories
      .filter(c => !existentsCategoriesTitles.includes(c))
      .filter((value, index, self) => self.indexOf(value) === index)

    // basicamente cria instancias de Category
    const insertedCategories = categoriesRepository.create(
      categoriesToInsert.map(title => ({ title })),
    )
    await categoriesRepository.save(insertedCategories)

    const allCategories = [...insertedCategories, ...existentsCategories]

    const insertedTransactions = transactionsRepository.create(
      transactions.map(tr => ({
        title: tr.title,
        type: tr.type,
        value: tr.value,
        category: allCategories.find(
          category => category.title === tr.category,
        ),
      })),
    )
    await transactionsRepository.save(insertedTransactions)

    console.log(insertedCategories)
    await fs.promises.unlink(filePath)

    return insertedTransactions
  }
}

export default ImportTransactionsService

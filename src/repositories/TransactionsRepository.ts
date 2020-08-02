import { EntityRepository, Repository } from 'typeorm'

import Transaction from '../models/Transaction'

interface Balance {
  income: number
  outcome: number
  total: number
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const balance = this.transactions.reduce(
      (accumulator: Balance, tr: Transaction) => {
        switch (tr.type) {
          case 'income':
            accumulator.income += tr.value
            break
          case 'outcome':
            accumulator.outcome += tr.value
            break
          default:
            break
        }
        return accumulator
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    )
    balance.total = balance.income - balance.outcome
    return balance
  }

  public async all(): Promise<Transaction[]> {
    TransactionsRepository.
  }
}

export default TransactionsRepository

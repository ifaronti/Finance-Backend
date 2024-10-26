import { Router } from 'express'
import { transactions } from '../controller/transactions/getTransaction.controller'

const transactionsRouter = Router()

transactionsRouter.route('/transactions').get(transactions)

export default transactionsRouter
import { Router } from 'express' 
import { Summaries } from '../controller/summary'

const summaryRouter = Router()

summaryRouter.route('/summary').get(Summaries)

export default summaryRouter
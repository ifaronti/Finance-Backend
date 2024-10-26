import { Router } from "express";
import {
  getPots,
  createPot,
  updatePot,
  deletepot,
} from "../controller/pots.controller";

const potRouter = Router();

potRouter
  .route("/pots")
  .get(getPots)
  .post(createPot)
  .patch(updatePot)
  .delete(deletepot);

  export default potRouter
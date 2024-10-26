import { Router } from "express";
import { getPots } from "../controller/pots/getPots";
import { updatePot } from "../controller/pots/updatePot";
import { createPot } from "../controller/pots/createPot";
import { deletepot } from "../controller/pots/deletePot";

const potRouter = Router();

potRouter
  .route("/pots")
  .get(getPots)
  .post(createPot)
  .patch(updatePot)
  .delete(deletepot);

  export default potRouter
const { Router } = require("express");
const router = Router();

router
  .route("/")
  .get((req, res) => res.send("Habitaciones Routes"))
 
module.exports = router;

const { Router } = require("express");
const router = Router();

router
  .route("/")
  .get((req, res) => res.send("Usrs Routes"))
 
module.exports = router;

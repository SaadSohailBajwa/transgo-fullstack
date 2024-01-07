const express = require("express");
const router = express.Router();

const loginRoutes = require("./login");
// const registerRoutes = require("./register");
// const validateNumber = require("./validateNumber");

router.use("/driver", loginRoutes);
// router.use("/driver", registerRoutes);


// router.use("/driver", validateNumber);

module.exports = router;

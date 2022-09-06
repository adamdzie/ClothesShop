const express = require("express");
const router = express.Router();
const itemTemplateCopy = require("../models/item_template");
const stores = require("../middleware/multer");
const controller = require("../controller");
const userTemplateCopy = require("../models/user_template");
var multer = require("multer");
var forms = multer();
const checkAdminPassword = (req, res, next) => {
  const { adminPassword } = req.body;
  if (adminPassword == process.env.ADMIN_PASSWORD) {
    next();
  } else {
    res.status(400).json("Nieprawidłowe hasło!");
  }
};
const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.status(400).json("Niezalogowany użytkownik");
  }
};
const isAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    next();
  } else {
    res.status(400).json("Nie masz uprawnień administratora!");
  }
};
router.get("/add", (request, response) => {
  itemTemplateCopy.find({ itemType: "Spodnie" }, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log(data);
      response.status(200).json(data);
    }
  });
});

router.get("/items", (req, res) => {
  itemTemplateCopy
    .find((error, data) => {
      if (error) {
        console.log(error);
      } else {
        res.status(200).json(data);
      }
    })
    .limit(15);
  // .skip(5);
});

router.post("/logout", isAuth, controller.logout);
router.post(
  "/uploadmultiple",
  stores.array("images", 16),
  isAuth,
  isAdmin,
  controller.uploads
);
router.post("/signup", forms.array(), controller.register);
router.post("/login", forms.array(), controller.login);
router.post("/getcurrentuser", forms.array(), controller.getDataAbout);
router.post("/account", forms.array(), isAuth, controller.editPersonal);
router.post("/accountlog", forms.array(), isAuth, controller.accountlog);
router.delete(
  "/accountdelete",
  forms.array(),
  isAuth,
  controller.accountdelete
);
router.post("/createorder", forms.array(), isAuth, controller.createOrder);
router.post("/createorderoff", forms.array(), controller.createOrderOff);
router.post("/addtocart", forms.array(), isAuth, controller.addToCart);
router.post("/getcart", forms.array(), isAuth, controller.getCart);
router.post("/get_local_cart", forms.array(), controller.getLocalCart);
router.post("/delcartitem", forms.array(), isAuth, controller.delCartItem);
router.get(
  "/getusers/:startindex/:limit",
  isAuth,
  isAdmin,
  controller.getUsers
);
router.get("/getmaxusers", isAuth, isAdmin, controller.getMaxUsers);
router.get(
  "/getorders/:startindex/:limit",
  isAuth,
  isAdmin,
  controller.getOrders
);
router.get(
  "/getordershistory/:startindex/:limit",
  isAuth,
  isAdmin,
  controller.getOrdersHistory
);
router.get(
  "/getmaxordershistory",
  isAuth,
  isAdmin,
  controller.getMaxOrdersHistory
);
router.delete("/deleteuser/:userid", isAuth, isAdmin, controller.deleteUser);
router.get("/getmaxorders", isAuth, isAdmin, controller.getMaxOrders);
router.patch("/setstatus", isAuth, isAdmin, controller.setStatus);
// router.post("/createadmin", checkAdminPassword,controller.createAdmin);

//REST
router.get("/", controller.getItems);
router.get("/:param1", controller.getItems);
router.put("/:user_id", isAuth, controller.addObserve);
router.delete("/:item_id", isAuth, isAdmin, controller.deleteItem);
router.get("/observed/:user_id", isAuth, controller.getObservedItems);
router.patch("/observed/:user_id", isAuth, controller.cleanObservedItems);

router.put(
  "/edit_item/:item_id",
  stores.array("images", 16),
  isAuth,
  isAdmin,
  controller.editItem
);
module.exports = router;

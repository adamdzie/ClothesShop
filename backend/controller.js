const itemTemplateCopy = require("./models/item_template");
const userTemplateCopy = require("./models/user_template");
const orderTemplateCopy = require("./models/order_template");
const cartTemplateCopy = require("./models/cart_template");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { useInRouterContext } = require("react-router-dom");

exports.uploads = (req, res, next) => {
  const {
    itemDescription,
    itemTitle,
    itemType,
    itemUnderType,
    itemPrice,
    itemSizes,
    itemColors,
  } = req.body;
  const files = req.files;
  if (!files || files.length < 1)
    return res.status(400).send("Wybierz zdjęcia!");

  if (itemTitle.length < 5)
    return res.status(400).send("Tytuł musi posiadać co najmniej 5 znaków!");
  if (!itemPrice || itemPrice < 1)
    return res.status(400).send("Musisz podać cenę!");
  if (itemDescription.length < 20)
    return res.status(400).send("Opis musi mieć co najmniej 20 znaków!");
  console.log("Parametr", req.body.itemUnderType);
  let imgArray = files.map((file) => {
    let img = fs.readFileSync(file.path);
    return (encode_image = img.toString("base64"));
  });

  console.log(imgArray.length);

  const newItem = new itemTemplateCopy({
    itemTitle: itemTitle,
    itemType: itemType,
    itemUnderType: itemUnderType,
    itemPrice: itemPrice,
    itemImagesBase64: imgArray,
    itemDescription: itemDescription,
    itemColors: itemColors,
    itemSizes: itemSizes,
  });
  newItem
    .save()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.json(error);
    });
};

exports.register = async (req, res) => {
  console.log(req.body.userLogin);
  const {
    userLogin,
    userPassword,
    userPasswordrepeat,
    userEmail,
    userName,
    userSurname,
    userStreet,
    userHomenumber,
    userApartnumber,
    userTown,
    userPostcode,
    adminPassword,
  } = req.body;
  var userIsAdmin = false;
  if (adminPassword == process.env.ADMIN_PASSWORD) {
    userIsAdmin = true;
  }
  let user = await userTemplateCopy.findOne({ userLogin });
  let email = await userTemplateCopy.findOne({ userEmail });

  let validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  let postCodeRegex = /^[0-9]{2}-[0-9]{3}/;
  if (!userLogin) return res.status(400).send("Musisz wpisać login!");
  if (userLogin.length > 20)
    return res.status(400).send("Login może posiadać maksymalnie 20 znaków!");

  if (user) {
    return res.status(400).send("Użytkownik z takim loginem już istnieje!");
  }

  if (!userPassword) return res.status(400).send("Musisz wpisać hasło!");
  if (userPassword.length > 30)
    return res.status(400).send("Hasło może posiadać maksymalnie 30 znaków!");
  if (userPassword !== userPasswordrepeat)
    return res.status(400).send("Hasła nie są identyczne!");

  if (userEmail) {
    if (!userEmail.match(validRegex))
      return res.status(400).send("Niepoprawny E-mail!");
  } else return res.status(400).send("Musisz wpisać E-mail!");

  if (email) {
    return res.status(400).send("Użytkownik z takim E-mailem już istnieje!");
  }

  if (userName.length > 20)
    return res.status(400).send("Imię może posiadać maksymalnie 20 znaków!");
  if (userSurname.length > 20)
    return res
      .status(400)
      .send("Nazwisko może posiadać maksymalnie 20 znaków!");
  if (userStreet.length > 25)
    return res.status(400).send("Ulica może posiadać maksymalnie 25 znaków!");
  if (userHomenumber.length > 4)
    return res.status(400).send("Numer domu może mieć maksymalnie 4 cyfry!");
  if (userApartnumber.length > 4)
    return res
      .status(400)
      .send("Numer mieszkania może mieć maksymalnie 4 cyfry!");
  if (userTown.length > 20)
    return res.status(400).send("Miasto może mieć maksymalnie 20 znaków!");
  if (userPostcode.length > 10)
    return res
      .status(400)
      .send("Kod pocztowy może składać się maksymalnie z 10 znaków!");
  if (userPostcode.length > 1) {
    if (!userPostcode.match(postCodeRegex)) {
      return res.status(400).send("Nieprawidłowy kod pocztowy!");
    }
  }

  const hashedPassword = await bcrypt.hash(userPassword, 12);

  const newUser = new userTemplateCopy({
    userLogin: userLogin,
    userPassword: hashedPassword,
    userEmail: userEmail,
    userName: userName,
    userSurname: userSurname,
    userStreet: userStreet,
    userHomenumber: userHomenumber,
    userApartnumber: userApartnumber,
    userTown: userTown,
    userPostcode: userPostcode,
    userIsAdmin: userIsAdmin,
  });
  newUser
    .save()
    .then((data) => {
      console.log(data);
      res.status(200).json(data);
    })
    .catch((error) => {
      res.json(error);
    });
};

exports.getDataAbout = async (req, res) => {
  const user = await userTemplateCopy.findOne({
    userLogin: req.body.userLogin,
  });
  if (user) return res.status(200).json(user);
};
exports.logout = async (req, res) => {
  console.log("wylogowuje");
  req.session.destroy((err) => {
    if (err) throw err;
  });
  return res.status(200).send("Wylogowano");
};

exports.login = async (req, res) => {
  const user = await userTemplateCopy.findOne({
    userLogin: req.body.userLogin,
  });

  if (!user) return res.status(400).send("Zły login lub hasło!");

  const isMatchPassword = await bcrypt.compare(
    req.body.userPassword,
    user.userPassword
  );
  console.log(user);
  if (isMatchPassword) {
    req.session.isAuth = true;
    if (user.userIsAdmin) req.session.isAdmin = true;
    else req.session.isAdmin = false;

    console.log(req.session);
    return res.status(200).send(user);
  } else {
    return res.status(400).send("Zły login lub hasło!");
  }
};

exports.editPersonal = async (req, res) => {
  var {
    userId,
    userName,
    userSurname,
    userStreet,
    userHomenumber,
    userApartnumber,
    userTown,
    userPostcode,
  } = req.body;
  let postCodeRegex = /^[0-9]{2}-[0-9]{3}/;
  const user = await userTemplateCopy.findOne({ _id: userId });
  console.log("fakindefendos");
  console.log(user);
  if (userName === "") userName = user.userName;
  if (userSurname === "") userSurname = user.userSurname;
  if (userStreet === "") userStreet = user.userStreet;
  if (userHomenumber === "") userHomenumber = user.userHomenumber;
  if (userApartnumber === "") userApartnumber = user.userApartnumber;
  if (userTown === "") userTown = user.userTown;
  if (userPostcode === "") userPostcode = user.userPostcode;

  if (!user) return res.json("Coś poszło nie tak...");

  if (
    userName == user.userName &&
    userSurname == user.userSurname &&
    userStreet == user.userStreet &&
    userHomenumber == user.userHomenumber &&
    userApartnumber == user.userApartnumber &&
    userTown == user.userTown &&
    userPostcode == user.userPostcode
  )
    return res.status(400).send("Nic nie jest zmienione!");

  // When change personal data

  if (
    userName === user.userName &&
    userSurname === user.userSurname &&
    userStreet === user.userStreet &&
    userHomenumber === user.userHomenumber &&
    userApartnumber === user.userApartnumber &&
    userTown === user.userTown &&
    userPostcode === user.userPostcode
  )
    return res.status(400).send("Nic nie zostało zmienione!");

  if (userName.length > 20)
    return res.status(400).send("Imię może posiadać maksymalnie 20 znaków!");

  if (userSurname.length > 20)
    return res
      .status(400)
      .send("Nazwisko może posiadać maksymalnie 20 znaków!");

  if (userStreet.length > 25)
    return res.status(400).send("Ulica może posiadać maksymalnie 25 znaków!");

  if (userHomenumber.length > 4)
    return res.status(400).send("Numer domu może mieć maksymalnie 4 cyfry!");
  if (userApartnumber.length > 4)
    return res
      .status(400)
      .send("Numer mieszkania może mieć maksymalnie 4 cyfry!");
  if (userTown.length > 20)
    return res.status(400).send("Miasto może mieć maksymalnie 20 znaków!");
  if (userPostcode.length > 10)
    return res
      .status(400)
      .send("Kod pocztowy może składać się maksymalnie z 10 znaków!");
  if (!userPostcode.match(postCodeRegex)) {
    return res.status(400).send("Nieprawidłowy kod pocztowy!");
  }
  console.log("hop hop");
  userTemplateCopy
    .findOneAndUpdate(
      { _id: userId },
      {
        userName: userName,
        userSurname: userSurname,
        userStreet: userStreet,
        userHomenumber: userHomenumber,
        userApartnumber: userApartnumber,
        userTown: userTown,
        userPostcode: userPostcode,
      }
    )
    .then((data) => {
      userTemplateCopy
        .findOne({ _id: data._id })
        .then((newOne) => {
          console.log(newOne);
          return res.json(newOne);
        })
        .catch((err) => {
          res.json(err);
        });
    })
    .catch((err) => {
      res.json(err);
    });
};
exports.accountlog = async (req, res) => {
  var { userId, userLogin, userPassword, userPasswordrepeat, userEmail } =
    req.body;
  // console.log(userName);
  // console.log(user.userName);
  // console.log(userName == user.userName);
  // console.log(userSurname == user.userSurname);
  // console.log(userStreet == user.userStreet);
  // console.log(userHomenumber == user.userHomenumber);
  // console.log(userApartnumber == user.userApartnumber);
  // console.log(userTown == user.userTown);
  // console.log(userPostcode == user.userPostcode);

  // if (!userLogin) return res.status(400).send("Musisz wpisać login!");
  if (userLogin.length > 20)
    return res.status(400).send("Login może posiadać maksymalnie 20 znaków!");

  const currentUs = await userTemplateCopy.findOne({ _id: userId });

  if (!currentUs) return res.status(400).send("Coś poszło nie tak...");
  if (userLogin === "") userLogin = currentUs.userLogin;
  if (userPassword === "") userPassword = currentUs.userPassword;
  if (userEmail === "") userEmail = currentUs.userEmail;
  // console.log(user.userLogin === userLogin);
  // console.log(user.userPassword === userPassword);
  // console.log(userEmail === currentUs.userEmail);
  // console.log(userEmail);
  // console.log(user.userEmail);
  if (
    currentUs.userLogin === userLogin &&
    currentUs.userPassword === userPassword &&
    userEmail === currentUs.userEmail
  )
    return res.status(400).send("Nic nie zostało zmienione!");
  // if (userLogin.length < 5)
  //   return res.status(400).send("Login musi posiadać co najmniej 5 znaków!");
  const checkIfLogin = await userTemplateCopy.findOne({
    userLogin: userLogin,
  });

  if (currentUs.userLogin !== userLogin) {
    if (checkIfLogin) {
      return res.status(400).send("Użytkownik z takim loginem już istnieje!");
    }
  }
  let validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  const checkIfEmail = await userTemplateCopy.findOne({
    userEmail: userEmail,
  });
  if (currentUs.userEmail !== userEmail) {
    if (checkIfEmail) {
      return res.status(400).send("Użytkownik z takim E-mailem już istnieje!");
    }
  }
  if (!userEmail.match(validRegex))
    return res.status(400).send("Niepoprawny E-mail!");

  if (userPassword === currentUs.userPassword) {
    userTemplateCopy
      .findOneAndUpdate(
        { _id: userId },
        {
          userLogin: userLogin,

          userEmail: userEmail,
        }
      )
      .then((data) => {
        userTemplateCopy
          .findOne({ _id: data._id })
          .then((newOne) => {
            console.log(newOne);
            res.json(newOne);
          })
          .catch((err) => {
            res.json(err);
          });
      })
      .catch((err) => {
        res.json(err);
      });
  } else {
    if (currentUs.userPassword === userPassword)
      return res.status(400).send("Nic nie zostało zmienione!");
    if (userPassword.length > 30)
      return res.status(400).send("Hasło może posiadać maksymalnie 30 znaków!");
    if (userPassword !== userPasswordrepeat)
      return res.status(400).send("Hasła nie są identyczne!");
    console.log("To sie dzieje tutaj!");
    const isThisSamePassword = await bcrypt.compare(
      userPassword,
      currentUs.userPassword
    );
    if (
      isThisSamePassword &&
      currentUs.userLogin === userLogin &&
      currentUs.userEmail === userEmail
    )
      return res.status(400).send("Nic nie zostało zmienione!");
    const hashedPassword = await bcrypt.hash(userPassword, 12);

    console.log("halo balo");
    if (userPassword) {
      userTemplateCopy
        .findOneAndUpdate(
          { _id: userId },
          {
            userLogin: userLogin,
            userPassword: hashedPassword,
            userEmail: userEmail,
          }
        )
        .then((data) => {
          userTemplateCopy
            .findOne({ _id: data._id })
            .then((newOne) => {
              console.log(newOne);
              return res.json(newOne);
            })
            .catch((err) => {
              res.json(err);
            });
        })
        .catch((err) => {
          res.json(err);
        });
    }
  }
};
exports.accountdelete = async (req, res) => {
  const { userId, userPassword } = req.body;

  const user = await userTemplateCopy.findOne({ _id: userId });
  if (!user) return res.status(400).json("Coś poszło nie tak...");

  const isMatchPassword = await bcrypt.compare(userPassword, user.userPassword);

  if (!isMatchPassword) return res.status(400).json("Niepoprawne hasło!");

  req.session.isAuth = false;
  req.session.destroy();

  userTemplateCopy
    .deleteOne({ _id: userId })
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      res.json(err);
    });
};
exports.addToCart = async (req, res) => {
  const { userId, itemId, itemQuantity, itemColor, itemSize } = req.body;
  var item, ind;
  const user = await userTemplateCopy
    .findOne({
      _id: userId,
      "userCart.userItemId": itemId,
      "userCart.userItemSize": itemSize,
      "userCart.userItemColor": itemColor,
    })
    .then((r) => {
      // console.log(r);
      item = r;
    })
    // .then((data) => {
    //   return (item = data);
    // })
    .catch((err) => {
      console.log(err);
    });
  // console.log(item);

  if (item) {
    for (var i = 0; i < item.userCart.length; i++) {
      if (item.userCart[i].userItemId === itemId) {
        ind = i;
        break;
      }
    }
    console.log(ind);
    let totalQuantity =
      Number(item.userCart[ind].userItemQuantity) + Number(itemQuantity);

    console.log("hop hop");
    console.log(totalQuantity);
    userTemplateCopy
      .findOneAndUpdate(
        {
          _id: userId,
          "userCart.userItemId": itemId,
        },
        {
          $set: { "userCart.$.userItemQuantity": totalQuantity },
        }
      )
      .then((data) => {
        console.log(data);
        return res.json(data);
      })
      .catch((err) => {
        return console.log(err);
      });
  } else {
    userTemplateCopy
      .findOneAndUpdate(
        {
          _id: userId,
        },
        {
          $push: {
            userCart: {
              userItemId: itemId,
              userItemQuantity: itemQuantity,
              userItemSize: itemSize,
              userItemColor: itemColor,
            },
          },
        }
      )
      .then((data) => {
        // console.log(data);
        return res.status(200).json(data);
      })
      .catch((err) => {
        return res.status(400).json(err);
      });
  }
};
exports.getCart = async (req, res) => {
  const { userId } = req.body;
  var items = [];
  var currentUser;
  const user = await userTemplateCopy
    .findOne({ _id: userId })
    .then((r) => {
      currentUser = r;
    })
    .catch((err) => {
      console.log(err);
    });
  for (var i = 0; i < currentUser.userCart.length; i++) {
    let temp = [];
    let dat;
    // console.log(currentUser.userCart[0].userItemId);
    const it = await itemTemplateCopy
      .findOne({ _id: currentUser.userCart[i].userItemId })
      .then((da) => {
        dat = da;
        // temp.append(currentUser.userCart[i].userItemQuantity);
      })
      .catch((err) => {
        return res.json(err);
      });

    temp.push(dat);
    temp.push(currentUser.userCart[i].userItemQuantity);
    temp.push(currentUser.userCart[i].userItemSize);
    temp.push(currentUser.userCart[i].userItemColor);
    items.push(temp);
  }
  return res.json(items);
};
exports.getLocalCart = async (req, res) => {
  const { itemIds } = req.body;
  console.log(itemIds);
  console.log("Jestem tutaj");

  itemTemplateCopy
    .find({ _id: itemIds })
    .then((da) => {
      return res.json(da);
    })
    .catch((err) => {
      return res.json(err);
    });
};
exports.delCartItem = async (req, res) => {
  const { userId, itemId, itemSize, itemColor } = req.body;

  var currentUser;
  const user = await userTemplateCopy
    .findOne({ _id: userId })
    .then((r) => {
      currentUser = r;
    })
    .catch((err) => {
      console.log(err);
    });

  for (var i = 0; i < currentUser.userCart.length; i++) {
    if (
      currentUser.userCart[i].userItemId === itemId &&
      currentUser.userCart[i].userItemSize === itemSize &&
      currentUser.userCart[i].userItemColor === itemColor
    ) {
      console.log("to działa tutej");
      currentUser.userCart.splice(i, 1);

      userTemplateCopy
        .findOneAndUpdate(
          { _id: userId },
          {
            userCart: currentUser.userCart,
          }
        )
        .then((data) => {
          userTemplateCopy
            .findOne({ _id: data._id })
            .then((newOne) => {
              console.log(newOne);
              return res.json(newOne);
            })
            .catch((err) => {
              res.json(err);
            });
        })
        .catch((err) => {
          res.json(err);
        });
    }
  }
};
exports.getUsers = (req, res) => {
  const { startindex, limit } = req.params;
  console.log(limit);
  userTemplateCopy
    .find({ userIsAdmin: false })
    .limit(parseInt(limit))
    .skip(parseInt(startindex))
    // .skip(parseInt(startindex))
    .then((result) => {
      return res.send(result);
    })

    .catch((err) => {
      return res.status(400).send(err);
    });
};
exports.getMaxUsers = (req, res) => {
  userTemplateCopy
    .find({ userIsAdmin: false })
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};
exports.deleteUser = (req, res) => {
  userTemplateCopy
    .deleteOne({ _id: req.params.userid })
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      return res.send(err);
    });
};
exports.createOrder = async (req, res) => {
  const {
    orderUserId,
    orderSum,
    orderName,
    orderSurname,
    orderStreet,
    orderHomenumber,
    orderApartnumber,
    orderTown,
    orderPostcode,
    orderEmail,
    orderItemIds,
    orderItemNames,
    orderItemQuantities,
    orderItemSizes,
    orderItemColors,
  } = req.body;

  console.log(orderItemNames);
  var currentUs = await userTemplateCopy.findOne({ _id: orderUserId });
  var ids = [];

  // for (var i = 0; i < currentUs.userCart.length; i++) {
  //   ids.push(currentUs.userCart[i].userItemId);
  // }
  // console.log(ids);

  // var items = await itemTemplateCopy.find({ _id: ids });
  var its = [];

  // for (var j = 0; j < items.length; j++) {
  //   let temp = {
  //     userItemId: items[j]._id,
  //     itemName: items[j].itemTitle,
  //     itemQuantity: currentUs.userCart[j].userItemQuantity,
  //     itemSize: currentUs.userCart[j].userItemSize,
  //     itemColor: orderItemColors[j],

  //   };
  //   its.push(temp);
  // }
  if (Array.isArray(orderItemIds)) {
    for (var j = 0; j < orderItemIds.length; j++) {
      let temp = {
        itemId: orderItemIds[j],
        itemName: orderItemNames[j],
        itemQuantity: orderItemQuantities[j],
        itemSize: orderItemSizes[j],
        itemColor: orderItemColors[j],
      };
      its.push(temp);
    }
  } else {
    let temp = {
      itemId: orderItemIds,
      itemName: orderItemNames,
      itemQuantity: orderItemQuantities,
      itemSize: orderItemSizes,
      itemColor: orderItemColors,
    };
    its.push(temp);
  }

  var empty = [];

  const newOrder = new orderTemplateCopy({
    orderUserLogin: currentUs.userLogin,
    orderSum: orderSum,
    orderName: orderName,
    orderSurname: orderSurname,
    orderStreet: orderStreet,
    orderHomenumber: orderHomenumber,
    orderApartnumber: orderApartnumber,
    orderTown: orderTown,
    orderPostcode: orderPostcode,
    orderEmail: orderEmail,
    orderItems: its,
  });
  newOrder
    .save()
    .then((data) => {
      console.log(data);
      userTemplateCopy
        .findOneAndUpdate({ _id: currentUs._id }, { userCart: empty })
        .then((result) => {
          console.log(result);
          userTemplateCopy.findOne({ _id: currentUs._id }).then((dat) => {
            return res.status(200).json(dat);
          });
        });
    })
    .catch((error) => {
      res.json(error);
    });
};
exports.createOrderOff = async (req, res) => {
  const {
    orderSum,
    orderName,
    orderSurname,
    orderStreet,
    orderHomenumber,
    orderApartnumber,
    orderTown,
    orderPostcode,
    orderEmail,
    orderItemIds,
    orderItemNames,
    orderItemQuantities,
    orderItemSizes,
    orderItemColors,
  } = req.body;
  // let postCodeRegex = /^[0-9]{2}-[0-9]{3}/;

  // if (orderName.length > 20)
  //   return res.status(400).send("Imię może posiadać maksymalnie 20 znaków!");

  // if (orderSurname.length > 20)
  //   return res
  //     .status(400)
  //     .send("Nazwisko może posiadać maksymalnie 20 znaków!");

  // if (orderStreet.length > 25)
  //   return res.status(400).send("Ulica może posiadać maksymalnie 25 znaków!");

  // if (orderHomenumber.length > 4)
  //   return res.status(400).send("Numer domu może mieć maksymalnie 4 cyfry!");
  // if (orderApartnumber.length > 4)
  //   return res
  //     .status(400)
  //     .send("Numer mieszkania może mieć maksymalnie 4 cyfry!");
  // if (orderTown.length > 20)
  //   return res.status(400).send("Miasto może mieć maksymalnie 20 znaków!");
  // if (orderPostcode.length > 10)
  //   return res
  //     .status(400)
  //     .send("Kod pocztowy może składać się maksymalnie z 10 znaków!");
  // if (!orderPostcode.match(postCodeRegex)) {
  //   return res.status(400).send("Nieprawidłowy kod pocztowy!");
  // }

  var its = [];
  console.log(orderItemIds);
  if (Array.isArray(orderItemIds)) {
    for (var j = 0; j < orderItemIds.length; j++) {
      let temp = {
        itemId: orderItemIds[j],
        itemName: orderItemNames[j],
        itemQuantity: orderItemQuantities[j],
        itemSize: orderItemSizes[j],
        itemColor: orderItemColors[j],
      };
      its.push(temp);
    }
  } else {
    let temp = {
      itemId: orderItemIds,
      itemName: orderItemNames,
      itemQuantity: orderItemQuantities,
      itemSize: orderItemSizes,
      itemColor: orderItemColors,
    };
    its.push(temp);
  }

  const newOrder = new orderTemplateCopy({
    orderSum: orderSum,
    orderName: orderName,
    orderSurname: orderSurname,
    orderStreet: orderStreet,
    orderHomenumber: orderHomenumber,
    orderApartnumber: orderApartnumber,
    orderTown: orderTown,
    orderPostcode: orderPostcode,
    orderEmail: orderEmail,
    orderItems: its,
  });
  newOrder
    .save()
    .then((data) => {
      console.log(data);
      return res.json(data);
    })
    .catch((error) => {
      res.json(error);
    });
};
exports.getOrders = (req, res) => {
  const { startindex, limit } = req.params;
  let orderStat = ["W oczekiwaniu", "Zapakowane", "Wysłane", "Zwrot"];
  orderTemplateCopy
    .find({ orderStatus: orderStat })
    .limit(parseInt(limit))
    .skip(parseInt(startindex))
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
};
exports.getMaxOrders = (req, res) => {
  let orderStat = [
    "W oczekiwaniu",
    "Zapakowane",
    "W drodze",
    "Wysłane",
    "Zwrot",
  ];
  orderTemplateCopy
    .find({ orderStatus: orderStat })
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((err) => {
      return res.status(404).send(err);
    });
};
exports.setStatus = (req, res) => {
  const orderStat = req.query["status"];
  const orderIde = req.query["itemide"];
  console.log(orderStat);
  console.log(orderIde);
  orderTemplateCopy
    .findOneAndUpdate({ _id: orderIde }, { orderStatus: orderStat })
    .then(() => {
      orderTemplateCopy.findOne({ _id: orderIde }).then((result) => {
        console.log(result);
        return res.send(result);
      });
    })
    .catch((err) => {
      return res.send(err);
    });
};

exports.getMaxOrdersHistory = (req, res) => {
  orderTemplateCopy
    .find({ orderStatus: "Zrealizowane" })
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((err) => {
      return res.status(404).send(err);
    });
};
exports.getOrdersHistory = (req, res) => {
  const { startindex, limit } = req.params;
  orderTemplateCopy
    .find({ orderStatus: "Zrealizowane" })
    .limit(parseInt(limit))
    .skip(parseInt(startindex))
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
};
exports.getItems = async (req, res) => {
  const letsFetch = async (parameters, skip) => {
    var max_size = 0;
    const its = await itemTemplateCopy.find(parameters);

    max_size = its.length;

    console.log(skip);
    itemTemplateCopy
      .find(parameters)
      .skip(parseInt(skip))
      .limit(15)
      .then((result) => {
        console.log(result.length);
        return res.status(200).send({ data: result, max: max_size });
      })
      .catch((err) => {
        return res.send(err);
      });
  };

  const category = req.query["category"];
  const undercat = req.query["under_cat"];
  const search = req.query["search"];
  const min = req.query["min"];
  const max = req.query["max"];
  var skip = req.query["skip"];

  if (typeof skip === "undefined") {
    skip = 0;
  }

  var findParameters = {};
  if (typeof category === "undefined" && typeof undercat === "undefined") {
    console.log("Without params");
    findParameters = {};
  } else if (typeof undercat === "undefined") {
    console.log("With 1 params");
    findParameters = { itemType: category };
  } else if (typeof category === "undefined") {
    console.log("With 1 params");
    findParameters = { itemUnderType: undercat };
  } else {
    console.log("With 2 params");
    findParameters = { itemType: category, itemUnderType: undercat };
  }
  if (typeof search !== "undefined") {
    console.log("jakim cudem");
    findParameters = Object.assign(findParameters, {
      $or: [{ itemTitle: { $regex: search, $options: "-i" } }],
    });
  }
  if (typeof min !== "undefined" && typeof max !== "undefined") {
    findParameters = Object.assign(findParameters, {
      itemPrice: { $gte: min, $lte: max },
    });
  }
  console.log(findParameters);
  letsFetch(findParameters, skip);
};
exports.deleteItem = (req, res) => {
  const { item_id } = req.params;
  console.log(item_id);
  itemTemplateCopy
    .deleteOne({ _id: item_id })
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => {
      return res.send(err);
    });
};
exports.editItem = (req, res) => {
  const { item_id } = req.params;
  console.log(item_id);
  const {
    itemDescription,
    itemTitle,
    itemType,
    itemUnderType,
    itemPrice,
    itemSizes,
    itemColors,
  } = req.body;
  const files = req.files;
  if (!files || files.length < 1)
    return res.status(400).send("Wybierz zdjęcia!");

  if (itemTitle.length < 5)
    return res.status(400).send("Tytuł musi posiadać co najmniej 5 znaków!");
  if (!itemPrice || itemPrice < 1)
    return res.status(400).send("Musisz podać cenę!");
  if (itemDescription.length < 20)
    return res.status(400).send("Opis musi mieć co najmniej 20 znaków!");
  console.log("Parametr", req.body.itemUnderType);
  let imgArray = files.map((file) => {
    let img = fs.readFileSync(file.path);
    return (encode_image = img.toString("base64"));
  });

  console.log(imgArray.length);

  itemTemplateCopy
    .findOneAndUpdate(
      { _id: item_id },
      {
        itemDescription: itemDescription,
        itemTitle: itemTitle,
        itemType: itemType,
        itemUnderType: itemUnderType,
        itemPrive: itemPrice,
        itemColors: itemColors,
        itemSizes: itemSizes,
        itemImagesBase64: imgArray,
      }
    )
    .then((r) => {
      itemTemplateCopy
        .find({ _id: item_id })
        .then((result) => {
          console.log(result);
          return res.send(result);
        })
        .catch((err) => {
          return res.send(err);
        });
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
};
exports.addObserve = async (req, res) => {
  const { user_id } = req.params;
  const item_id = req.query["item_id"];

  const user = await userTemplateCopy.findOne({ _id: user_id });
  user.userObserve.push(item_id);
  console.log(user.userObserve);

  userTemplateCopy
    .findOneAndUpdate({ _id: user_id }, { userObserve: user.userObserve })
    .then((r) => {
      itemTemplateCopy
        .find({ _id: user.userObserve })
        .then((result) => {
          console.log(result);
          return res.send(result);
        })
        .catch((err) => {
          return res.send(err);
        });
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
};
exports.getObservedItems = async (req, res) => {
  const { user_id } = req.params;
  const user = await userTemplateCopy.findOne({ _id: user_id });

  itemTemplateCopy
    .find({ _id: user.userObserve })
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => {
      return res.send(err);
    });
};
exports.cleanObservedItems = (req, res) => {
  const { user_id } = req.params;

  userTemplateCopy
    .findOneAndUpdate({ _id: user_id }, { userObserve: [] })
    .then((result) => {
      return res.send([]);
    })
    .catch((err) => {
      return res.send(err);
    });
};

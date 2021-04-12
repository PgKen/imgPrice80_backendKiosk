var express = require("express");
var router = express.Router();

const fs = require("fs");

var mysql = require("mysql");

var moment = require("moment");

var db_config = {
  host: "localhost",
  user: "root",
  password: "comp@113",
  database: "srimuangweb",
};

var db_kiosk = {
  host: "localhost",
  user: "root",
  password: "comp@113",
  database: "db_kiosk",
};

var conn;

var conk;

function handleDisconnect() {
  conn = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  conn.connect(function (err) {
    // The server is either down
    if (err) {
      // or restarting (takes a while sometimes).
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  conn.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else {
      // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}
handleDisconnect();

/**** End Data Service */

function handleDisconnect_k() {
  conk = mysql.createConnection(db_kiosk); // Recreate the connection, since
  // the old one cannot be reused.

  conk.connect(function (err) {
    // The server is either down
    if (err) {
      // or restarting (takes a while sometimes).
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect_k, 2000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  conk.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      // Connection to the MySQL server is usually
      handleDisconnect_k(); // lost due to either server restart, or a
    } else {
      // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}
handleDisconnect_k();
/**** End Data Service */

let sqlImgPrice = "SELECT tb_proselect.id_prod AS rId,tb_product.name_pro,";
sqlImgPrice +=
  "tb_product.name_pro_en,tb_proselect.price_pro,tb_priceproduct.date_check,";
sqlImgPrice +=
  "tb_product.name_pro_cn,picture.name_img,picture.id_pro,tb_unit.id_unit,tb_unit.unitname ";
sqlImgPrice += "FROM tb_priceproduct ";
sqlImgPrice +=
  "INNER JOIN tb_proselect ON tb_priceproduct.id_pricepro = tb_proselect.idprice ";
sqlImgPrice +=
  "INNER JOIN tb_product ON tb_proselect.id_prod = tb_product.id_product ";
sqlImgPrice +=
  "INNER JOIN tb_typeproduct ON tb_product.typepro = tb_typeproduct.id_typepro ";
sqlImgPrice += "INNER JOIN picture ON tb_proselect.id_prod = picture.id_pro ";
sqlImgPrice += "INNER JOIN tb_unit ON tb_proselect.unit = tb_unit.id_unit ";
/*WHERE id_mtype = 8*/
/*GROUP BY
tb_proselect.id_prod*/
sqlImgPrice +=
  "ORDER BY tb_priceproduct.date_check DESC, RAND() ASC LIMIT 0, 16 ";

let sqlImgPrice_web = "SELECT tb_proselect.id_prod AS rId,tb_product.name_pro,";
sqlImgPrice_web +=
  "tb_product.name_pro_en,tb_proselect.price_pro,tb_priceproduct.date_check,";
sqlImgPrice_web +=
  "tb_product.name_pro_cn,picture.name_img,picture.id_pro,tb_unit.id_unit,tb_unit.unitname ";
sqlImgPrice_web += "FROM tb_priceproduct ";
sqlImgPrice_web +=
  "INNER JOIN tb_proselect ON tb_priceproduct.id_pricepro = tb_proselect.idprice ";
sqlImgPrice_web +=
  "INNER JOIN tb_product ON tb_proselect.id_prod = tb_product.id_product ";
sqlImgPrice_web +=
  "INNER JOIN tb_typeproduct ON tb_product.typepro = tb_typeproduct.id_typepro ";
sqlImgPrice_web +=
  "INNER JOIN picture ON tb_proselect.id_prod = picture.id_pro ";
sqlImgPrice_web += "INNER JOIN tb_unit ON tb_proselect.unit = tb_unit.id_unit ";
/*WHERE id_mtype = 8*/
/*GROUP BY
tb_proselect.id_prod*/
sqlImgPrice_web +=
  "ORDER BY tb_priceproduct.date_check DESC, RAND() ASC LIMIT 0, 20 ";

//console.log(sqlImgPrice);

let sqlDateLast = "SELECT tb_proselect.id_prod AS rId,tb_product.name_pro,";
sqlDateLast +=
  "tb_product.name_pro_en,tb_proselect.price_pro,tb_priceproduct.date_check,";
sqlDateLast +=
  "tb_product.name_pro_cn,picture.name_img,picture.id_pro,tb_unit.id_unit,tb_unit.unitname ";
sqlDateLast += "FROM tb_priceproduct ";
sqlDateLast +=
  "INNER JOIN tb_proselect ON tb_priceproduct.id_pricepro = tb_proselect.idprice ";
sqlDateLast +=
  "INNER JOIN tb_product ON tb_proselect.id_prod = tb_product.id_product ";
sqlDateLast +=
  "INNER JOIN tb_typeproduct ON tb_product.typepro = tb_typeproduct.id_typepro ";
sqlDateLast += "INNER JOIN picture ON tb_proselect.id_prod = picture.id_pro ";
sqlDateLast += "INNER JOIN tb_unit ON tb_proselect.unit = tb_unit.id_unit ";
sqlDateLast += "WHERE date_check = ? ";
/*WHERE id_mtype = 8*/
/*GROUP BY
tb_proselect.id_prod*/
sqlDateLast +=
  "ORDER BY tb_priceproduct.date_check DESC, RAND() ASC LIMIT 0, 16 ";

//console.log(sqlDateLast);

let sqlImgPrice2 =
  "SELECT tb_proselect.id_prod AS rId,tb_product.name_pro,tb_product.name_pro_en,";
sqlImgPrice2 +=
  "tb_proselect.price_pro,tb_priceproduct.date_check,tb_product.name_pro_cn,picture.name_img,";
sqlImgPrice2 += "picture.id_pro,tb_unit.id_unit,tb_unit.unitname ";
sqlImgPrice2 += "FROM tb_priceproduct ";
sqlImgPrice2 +=
  "INNER JOIN tb_proselect ON tb_priceproduct.id_pricepro = tb_proselect.idprice ";
sqlImgPrice2 +=
  "INNER JOIN tb_product ON tb_proselect.id_prod = tb_product.id_product ";
sqlImgPrice2 +=
  "INNER JOIN tb_typeproduct ON tb_product.typepro = tb_typeproduct.id_typepro ";
sqlImgPrice2 += "INNER JOIN picture ON tb_proselect.id_prod = picture.id_pro ";
sqlImgPrice2 += "INNER JOIN tb_unit ON tb_proselect.unit = tb_unit.id_unit ";
sqlImgPrice2 += "WHERE date_check = ? ";
sqlImgPrice2 += " AND tb_proselect.id_prod = ? ";

// _forNewweb
let sqlDateLast_web = "SELECT tb_proselect.id_prod AS rId,tb_product.name_pro,";
sqlDateLast_web +=
  "tb_product.name_pro_en,tb_proselect.price_pro,tb_priceproduct.date_check,";
sqlDateLast_web +=
  "tb_product.name_pro_cn,picture.name_img,picture.id_pro,tb_unit.id_unit,tb_unit.unitname ";
sqlDateLast_web += "FROM tb_priceproduct ";
sqlDateLast_web +=
  "INNER JOIN tb_proselect ON tb_priceproduct.id_pricepro = tb_proselect.idprice ";
sqlDateLast_web +=
  "INNER JOIN tb_product ON tb_proselect.id_prod = tb_product.id_product ";
sqlDateLast_web +=
  "INNER JOIN tb_typeproduct ON tb_product.typepro = tb_typeproduct.id_typepro ";
sqlDateLast_web +=
  "INNER JOIN picture ON tb_proselect.id_prod = picture.id_pro ";
sqlDateLast_web += "INNER JOIN tb_unit ON tb_proselect.unit = tb_unit.id_unit ";
sqlDateLast_web += "WHERE date_check = ? ";
sqlDateLast_web +=
  "ORDER BY tb_priceproduct.date_check DESC, RAND() ASC LIMIT 0, 20 ";

let sqlImgPrice2_web =
  "SELECT tb_proselect.id_prod AS rId,tb_product.name_pro,tb_product.name_pro_en,";
sqlImgPrice2_web +=
  "tb_proselect.price_pro,tb_priceproduct.date_check,tb_product.name_pro_cn,picture.name_img,";
sqlImgPrice2_web += "picture.id_pro,tb_unit.id_unit,tb_unit.unitname ";
sqlImgPrice2_web += "FROM tb_priceproduct ";
sqlImgPrice2_web +=
  "INNER JOIN tb_proselect ON tb_priceproduct.id_pricepro = tb_proselect.idprice ";
sqlImgPrice2_web +=
  "INNER JOIN tb_product ON tb_proselect.id_prod = tb_product.id_product ";
sqlImgPrice2_web +=
  "INNER JOIN tb_typeproduct ON tb_product.typepro = tb_typeproduct.id_typepro ";
sqlImgPrice2_web +=
  "INNER JOIN picture ON tb_proselect.id_prod = picture.id_pro ";
sqlImgPrice2_web +=
  "INNER JOIN tb_unit ON tb_proselect.unit = tb_unit.id_unit ";
sqlImgPrice2_web += "WHERE date_check = ? ";
sqlImgPrice2_web += " AND tb_proselect.id_prod = ? ";

let sqlDate =
  "SELECT tb_priceproduct.date_check FROM tb_priceproduct GROUP BY tb_priceproduct.date_check ORDER BY tb_priceproduct.date_check DESC LIMIT 0, 2 ";

let dataSearch = [];
let txtSearch = "";

router.get("/editDuration/:duration/:id", (req, res) => {
  let duration = req.params.duration;
  duration = duration * 1000;
  let id = req.params.id;
  console.log("editduration = " + duration + "/id = " + id);
  let sql = "UPDATE list SET duration = ? WHERE id = ?";
  conk.query(sql, [duration, id], (err, resp) => {
    res.send("ok");
  });
});

router.get("/kiosk-del/:id/:id_list/:id_type", (req, res) => {
  let newIdorder = 0;
  let id = req.params.id;
  let id_list = req.params.id_list;
  let id_type = req.params.id_type;
  id_type = Number(id_type);
  id_list = Number(id_list);
  console.log("id = " + id);
  console.log("id_list " + id_list);
  // res.end();

  async function main() {
    await fnUnlink();
    // await delItem();
  }
  main();

  function fnUnlink() {
    // console.log(fs);
    let sql = "SELECT picture FROM list WHERE id = ? ";
    conk.query(sql, [id], (err, resp) => {
      let fileName = "./public/kiosk/" + resp[0].picture;
      // let fileName = "../kiosk/"+resp[0].picture
      fs.unlink(fileName, (err) => {
        if (err) {
          console.error(err);
        }
        delItem();
      });
    });
  }

  function delItem() {
    console.log("del id");
    let sql = "DELETE FROM list WHERE id = ?";
    conk.query(sql, [id], (err, resp) => {
      if (err) throw console.log(err);
      chkMaxOrder();
      //console.log("ok");
      //res.send("del ok = " + id);
    });
  }

  function chkMaxOrder() {
    let sql = "SELECT COUNT(id) AS rowss FROM list WHERE displaytype = ?";
    conk.query(sql, [id_type], (err, resp) => {
      if (err) throw console.log(err);
      maxOrder = resp[0].rowss;
      // maxOrder = maxOrder
      newIdorder = maxOrder + 1;
      console.log("count = " + newIdorder);
      updateList();
    });
  }

  function updateList() {
    console.log("update List");
    let sql =
      "UPDATE list SET order_list = ? WHERE order_list = ? AND displaytype = ?";
    for (let i = id_list; i < newIdorder; i++) {
      conk.query(sql, [i, i + 1, id_type], (err, resp) => {
        if (err) throw console.log(err);
        console.log("i = " +i);
        // console.log("updated");
        if (i == newIdorder - 1) {
          sendData();
        }
      });
    }
  }

  function sendData() {
    console.log("okdkdkdkddk");
    res.send("ok");
  }
});

router.get("/samfrom", (req, res) => {
  res.render("samfrom");
});

router.post("/sam", (req, res) => {
  let data = req.body;
  // console.log(data);
  res.send(data);
});

router.get("/kiosk-status/:id/:status", (req, res) => {
  let id = req.params.id;
  let status = req.params.status;
  console.log("update = " + id + " status = " + status);
  let sql = "UPDATE list SET status = ? WHERE id = ?";
  conk.query(sql, [status, id], (err, resp) => {
    res.send("ok update");
  });
});

router.get("/kiosk-list-backend", (req, res) => {
  let data = [];
  async function main() {
    await getData();
  }
  main();

  function getData() {
    console.log("list");
    let sql = "SELECT * FROM list WHERE displaytype = 0 ORDER BY order_list";
    // res.send("test")
    conk.query(sql, (err, resp) => {
      if (err) throw console.log(err);
      data = resp;
      mData();
    });
  }

  function mData() {
    // let webbase = "http://localhost:5180/kiosk/";
    // let webbase = "http://172.16.1.238:5180/kiosk/";
    let webbase = "http://taladsrimuang.com:5180/kiosk/";
    let mData = data.map((item) => {
      return {
        id: item.id,
        title: item.title,
        picture: webbase + item.picture,
        duration: item.duration,
        duration_list: item.duration / 1000 + " sec.",
        order_list: item.order_list,
        type: item.type,
        status: item.status,
        displaytype: item.displaytype,
      };
    });
    data = mData;
    sendData();
  }

  function sendData() {
    res.send(data);
  }
});

router.get("/kiosk-list-backend-led", (req, res) => {
  let data = [];
  async function main() {
    await getData();
  }
  main();

  function getData() {
    console.log("list");
    let sql = "SELECT * FROM list  WHERE displaytype = 1 ORDER BY order_list";
    // res.send("test")
    conk.query(sql, (err, resp) => {
      if (err) throw console.log(err);
      data = resp;
      mData();
    });
  }

  function mData() {
    // let webbase = "http://localhost:5180/kiosk/";
    // let webbase = "http://172.16.1.238:5180/kiosk/";
    let webbase = "http://taladsrimuang.com:5180/kiosk/";
    let mData = data.map((item) => {
      return {
        id: item.id,
        title: item.title,
        picture: webbase + item.picture,
        duration: item.duration,
        duration_list: item.duration / 1000 + " sec.",
        order_list: item.order_list,
        type: item.type,
        status: item.status,
        displaytype: item.displaytype,
      };
    });
    data = mData;
    sendData();
  }

  function sendData() {
    res.send(data);
  }
});

router.get("/kiosk-list", (req, res) => {
  let data = [];
  async function main() {
    await getData();
  }
  main();

  function getData() {
    console.log("list");
    let sql =
      "SELECT * FROM list WHERE status = 1 AND displaytype = 0 ORDER BY order_list";
    // res.send("test")
    conk.query(sql, (err, resp) => {
      if (err) throw console.log(err);
      data = resp;
      mData();
    });
  }

  function mData() {
    // let webbase = "http://localhost:5180/kiosk/";
    // let webbase = "http://172.16.1.238:5180/kiosk/";
    let webbase = "http://taladsrimuang.com:5180/kiosk/";
    let mData = data.map((item) => {
      return {
        id: item.id,
        title: item.title,
        picture: webbase + item.picture,
        duration: item.duration,
        order_list: item.order_list,
        type: item.type,
        status: item.status,
      };
    });
    data = mData;
    sendData();
  }

  function sendData() {
    res.send(data);
  }
});

router.get("/kiosk-list-led", (req, res) => {
  let data = [];
  async function main() {
    await getData();
  }
  main();

  function getData() {
    console.log("list");
    let sql =
      "SELECT * FROM list WHERE status = 1 AND displaytype = 1 ORDER BY order_list";
    // res.send("test")
    conk.query(sql, (err, resp) => {
      if (err) throw console.log(err);
      data = resp;
      mData();
    });
  }

  function mData() {
    // let webbase = "http://localhost:5180/kiosk/";
    // let webbase = "http://172.16.1.238:5180/kiosk/";
    let webbase = "http://taladsrimuang.com:5180/kiosk/";
    let mData = data.map((item) => {
      return {
        id: item.id,
        title: item.title,
        picture: webbase + item.picture,
        duration: item.duration,
        order_list: item.order_list,
        type: item.type,
        status: item.status,
      };
    });
    data = mData;
    sendData();
  }

  function sendData() {
    res.send(data);
  }
});

router.get("/kiosk-updata-order/:i/:type", (req, res) => {
  let i = req.params.i;
  i = Number(i);

  let type = req.params.type;
  type = Number(type);

  if (i == 1) {
    console.log("Top up");
  } else {
    let before = i - 1;
    console.log("order = " + i);
    let sql =
      "UPDATE list SET order_list = ? WHERE order_list = ? AND displaytype = ?";
    conk.query(sql, [10000, i, type], (err, resp) => {
      if (err) throw console.log(err);
      conk.query(sql, [i, before, type], (err, resp) => {
        if (err) throw console.log(err);
        conk.query(sql, [before, 10000, type], (err, resp) => {
          if (err) throw console.log(err);
          res.send("update order");
        });
      });
    });
  }
});

router.get("/kiosk-updata-order-down/:i/:type", (req, res) => {
  let i = req.params.i;
  i = Number(i);

  let type = req.params.type;
  type = Number(type);

  let maxOrder = 0;
  async function main() {
    await chkMaxOrder();
  }
  main();

  function chkMaxOrder() {
    let sql = "SELECT COUNT (id) AS rowss FROM list";
    conk.query(sql, (err, resp) => {
      maxOrder = resp[0].rowss;
      chnOrder();
    });
  }

  function chnOrder() {
    if (i == maxOrder) {
      console.log("End down");
    } else {
      let after = i + 1;
      console.log("order = " + i);
      let sql =
        "UPDATE list SET order_list = ? WHERE order_list = ? AND displaytype = ?";
      conk.query(sql, [10000, i, type], (err, resp) => {
        if (err) throw console.log(err);
        conk.query(sql, [i, after, type], (err, resp) => {
          if (err) throw console.log(err);
          conk.query(sql, [after, 10000, type], (err, resp) => {
            if (err) throw console.log(err);
            res.send("update order");
          });
        });
      });
    }
  }
});

router.get("/kiosk-chkReboot", (req, res) => {
  let sql = "SELECT * FROM reboot";
  conk.query(sql, (err, resp) => {
    // console.log(resp);
    res.send(resp);
  });
});

router.get("/kiosk-chkReboot2", (req, res) => {
  let sql = "SELECT * FROM reboot WHERE id = 2";
  conk.query(sql, (err, resp) => {
    // console.log(resp);
    res.send(resp);
  });
});

router.get("/kiosk-chkReboot-led", (req, res) => {
  let sql = "SELECT * FROM reboot WHERE id = 3";
  conk.query(sql, (err, resp) => {
    // console.log(resp);
    res.send(resp);
  });
});

router.get("/kiosk-unboot", (req, res) => {
  let sql = "UPDATE reboot SET active = 0 WHERE id = 1";
  conk.query(sql, (err, resp) => {
    if (err) throw console.log(err);
    res.send("un boot");
  });
});

router.get("/kiosk-unboot2", (req, res) => {
  let sql = "UPDATE reboot SET active = 0 WHERE id = 2";
  conk.query(sql, (err, resp) => {
    if (err) throw console.log(err);
    res.send("un boot");
  });
});

router.get("/kiosk-reboot", (req, res) => {
  let sql = "UPDATE reboot SET active = 1 WHERE id = 1";
  conk.query(sql, (err, resp) => {
    if (err) throw console.log(err);
    res.send("boot 1 ");
  });
});

router.get("/kiosk-reboot2", (req, res) => {
  let sql = "UPDATE reboot SET active = 1 WHERE id = 2";
  conk.query(sql, (err, resp) => {
    if (err) throw console.log(err);
    res.send("boot 1 ");
  });
});

router.get("/kiosk-reboot-led", (req, res) => {
  let sql = "UPDATE reboot SET active = 1 WHERE id = 3";
  conk.query(sql, (err, resp) => {
    if (err) throw console.log(err);
    res.send("boot 1 ");
  });
});

router.get("/kiosk-unboot-led", (req, res) => {
  let sql = "UPDATE reboot SET active = 0 WHERE id = 3";
  conk.query(sql, (err, resp) => {
    if (err) throw console.log(err);
    res.send("un boot");
  });
});

/* GET home page. */
router.get("/imgPrice", function (req, res) {
  let arrDate = [];
  let dataImg1 = [];
  let dataImg2 = [];
  let totalData = [];

  async function main() {
    await fnArrDate();
  }
  main();

  function fnArrDate() {
    let sql = sqlDate;
    conn.query(sql, (err, resD) => {
      //console.log(resD);

      arrDate[0] = moment(resD[0].date_check).format("YYYY-MM-DD");
      arrDate[1] = moment(resD[1].date_check).format("YYYY-MM-DD");
      fnDataImg1();
    });
  }

  function fnDataImg1() {
    let sql = sqlDateLast;
    // console.log(arrDate[0]);
    // console.log(arrDate[1]);

    conn.query(sql, [arrDate[0]], (err, resS) => {
      //console.log(resS);

      let mResS = resS.map((item) => {
        return {
          id: item.id_pro,
          date_check: moment(item.date_check).format("DD-MM-YYYY"),
          name_pro: item.name_pro,
          price_pro: item.price_pro,
          name_img: item.name_img,
          unitname: item.unitname,
        };
      });
      dataImg1 = mResS;
      fnDataImg2();
      //console.log(resS);
      //console.log(resS);
    });
  }

  function fnDataImg2() {
    //console.log(dataImg1.length);
    // console.log(dataImg1)

    let nonRess = [
      {
        rId: 0,
        name_pro: "",
        name_pro_en: "",
        price_pro: 0,
        date_check: "0",
        name_pro_cn: "",
        name_img: "",
        id_pro: 0,
        id_unit: 0,
        unitname: "",
      },
    ];

    let sql = sqlImgPrice2;
    //console.log(arrDate[1]);

    for (let i = 0; i < dataImg1.length; i++) {
      //console.log(dataImg1[i].id);
      conn.query(sql, [arrDate[1], [dataImg1[i].id]], (err, resS) => {
        //console.log(resS);
        // let mResS = resS.map(item => {
        //   return {
        //     date_check: moment(item.date_check).format("DD-MM-YYYY"),
        //     name_pro: item.name_pro,
        //     price_pro: item.price_pro,
        //     name_img: item.name_img,
        //     unitname: item.unitname
        //   }
        // })
        if (resS != "") {
          dataImg2.push(resS);
        } else {
          dataImg2.push(nonRess);
        }
        if (i == dataImg1.length - 1) {
          difData();
        }
      });
    }
  }

  function difData() {
    // console.log(dataImg2);
    // console.log(dataImg2[0][0].price_pro);

    //console.log(dataImg2[2][0].price_pro);

    let name = "";
    let price = "";
    let price2 = "";
    let date_check = "";
    let img = "";
    let unit = "";
    for (let i = 0; i < dataImg1.length; i++) {
      name = dataImg1[i].name_pro;
      price = dataImg1[i].price_pro;
      price2 = dataImg2[i][0].price_pro;
      date_check = dataImg1[i].date_check;
      img = dataImg1[i].name_img;
      unit = dataImg1[i].unitname;

      if (price > price2 && price2 != 0) {
        // up
        diff = 2;
      } else if (price < price2 && price2 != 0) {
        // down
        diff = 1;
      } else {
        // =
        diff = 0;
      }

      totalData.push({
        date_check: date_check,
        name_pro: name,
        price_pro: price,
        price_pro2: price2,
        name_img: img,
        unitname: unit,
        diff: diff,
      });

      if (i == dataImg1.length - 1) {
        sendData();
      }
    }
  }

  function sendData() {
    //console.log(dataImg1);
    //console.log(dataImg2);

    res.send(totalData);
  }
});

router.get("/xx", (req, res) => {
  res.send({
    test: "ok",
  });
});

/* GET home page. */
router.get("/imgPrice_web", function (req, res) {
  let arrDate = [];
  let dataImg1 = [];
  let dataImg2 = [];
  let totalData = [];

  let url_base = "https://taladsrimuang.com:5100/upload/";

  async function main() {
    await fnArrDate();
  }
  main();

  function fnArrDate() {
    let sql = sqlDate;
    conn.query(sql, (err, resD) => {
      //console.log(resD);

      arrDate[0] = moment(resD[0].date_check).format("YYYY-MM-DD");
      arrDate[1] = moment(resD[1].date_check).format("YYYY-MM-DD");
      fnDataImg1();
    });
  }

  function fnDataImg1() {
    let sql = sqlDateLast_web;
    // console.log(arrDate[0]);
    // console.log(arrDate[1]);

    conn.query(sql, [arrDate[0]], (err, resS) => {
      // console.log(resS);

      let mResS = resS.map((item) => {
        return {
          id: item.rId,
          date_check: moment(item.date_check).format("DD-MM-YYYY"),
          name_pro: item.name_pro,
          price_pro: item.price_pro,
          name_img: url_base + item.name_img,
          unitname: item.unitname,
        };
      });
      dataImg1 = mResS;
      fnDataImg2();
      //console.log(resS);
      //console.log(resS);
    });
  }

  function fnDataImg2() {
    //console.log(dataImg1.length);
    // console.log(dataImg1)

    let nonRess = [
      {
        rId: 0,
        name_pro: "",
        name_pro_en: "",
        price_pro: 0,
        date_check: "0",
        name_pro_cn: "",
        name_img: "",
        id_pro: 0,
        id_unit: 0,
        unitname: "",
      },
    ];

    let sql = sqlImgPrice2_web;
    //console.log(arrDate[1]);

    for (let i = 0; i < dataImg1.length; i++) {
      //console.log(dataImg1[i].id);
      conn.query(sql, [arrDate[1], [dataImg1[i].id]], (err, resS) => {
        // console.log(resS);
        // let mResS = resS.map(item => {
        //   return {
        //     date_check: moment(item.date_check).format("DD-MM-YYYY"),
        //     name_pro: item.name_pro,
        //     price_pro: item.price_pro,
        //     name_img: item.name_img,
        //     unitname: item.unitname
        //   }
        // })
        if (resS != "") {
          dataImg2.push(resS);
        } else {
          dataImg2.push(nonRess);
        }
        if (i == dataImg1.length - 1) {
          difData();
        }
      });
    }
  }

  function difData() {
    // console.log(dataImg1);
    // console.log(dataImg2[0][0].price_pro);
    //console.log(dataImg2[2][0].price_pro);

    let id = ""; // new
    let name = "";
    let price = "";
    let price2 = "";
    let date_check = "";
    let img = "";
    let unit = "";
    for (let i = 0; i < dataImg1.length; i++) {
      id = dataImg1[i].id; // new
      name = dataImg1[i].name_pro;
      price = dataImg1[i].price_pro;
      price2 = dataImg2[i][0].price_pro;
      date_check = dataImg1[i].date_check;
      img = dataImg1[i].name_img;
      unit = dataImg1[i].unitname;

      if (price > price2 && price2 != 0) {
        // up
        diff = 2;
      } else if (price < price2 && price2 != 0) {
        // down
        diff = 1;
      } else {
        // =
        diff = 0;
      }

      totalData.push({
        id: id, // new
        date_check: date_check,
        name_pro: name,
        price_pro: price,
        price_pro2: price2,
        name_img: img,
        unitname: unit,
        diff: diff,
      });

      if (i == dataImg1.length - 1) {
        sendData();
      }
    }
  }

  function sendData() {
    // console.log(totalData);
    //console.log(dataImg2);
    // console.log("TEST WEB");
    // console.log(totalData);
    res.send(totalData);
  }
});

// router.get('/facePass/:pass', (req, res) => {
//   let gPass = req.params.pass
//   let sql = "INSERT INTO facePass (pass) VALUES(?)"
//   conn.query(sql, [gPass], (err, resP) => {
//     if (err) throw console.log(err)
//     res.end()
//   })
// })

// router.get('/', (req, res) => {

//   let dataProduct = []
//   let dataImg = []
//   let countProduct = 0

//   let startPage = req.cookies["cStartPage"];
//   if (startPage == undefined) {
//     startPage = 0
//   }
//   console.log("startPage = " + startPage);

//   //txtSearch = ""
//   async function main() {
//     await product()
//   }
//   main()

//   function product() {
//     let sql = "SELECT * FROM `tb_product`"
//     conn.query(sql, (err, resP) => {
//       if (err) throw console.log(err);
//       dataProduct = resP
//       fnCountProduct()
//     })
//   }

//   function fnCountProduct() {
//     let sql = "SELECT tb_product.name_pro,picture.name_img,tb_product.id_product,picture.auto_id "
//     sql += "FROM picture "
//     sql += "INNER JOIN tb_product ON picture.id_pro = tb_product.id_product "
//     sql += "ORDER BY auto_id DESC"
//     conn.query(sql, (err, resC) => {
//       countProduct = resC.length
//       imgProduct()
//     })
//   }

//   function imgProduct() {
//     startPage = Number(startPage)
//     startPage = startPage * 30
//     if (dataSearch != "") {
//       console.log("มีการค้นหา = " + dataSearch);
//       dataImg = dataSearch

//       sendData()
//     } else {
//       let sql = "SELECT tb_product.name_pro,picture.name_img,tb_product.id_product,picture.auto_id "
//       sql += "FROM picture "
//       sql += "INNER JOIN tb_product ON picture.id_pro = tb_product.id_product "
//       sql += "ORDER BY auto_id DESC LIMIT ?,10"
//       conn.query(sql, [startPage], (err, resImg) => {
//         if (err) throw console.log(err)
//         dataImg = resImg
//         sendData()
//       })
//     }
//   }

//   function sendData() {
//     let numBtn = (countProduct / 30)
//     numBtn = Number(numBtn)
//     numBtn = Math.ceil(numBtn)
//     console.log(numBtn);

//     res.render('index', {
//       title: 'อัฟเดทภาพราคาสินค้า',
//       dataProduct,
//       dataImg,
//       txtSearch,
//       numBtn,
//       countProduct // จำนวนสินค้าทั้งหมด
//     })
//   }
// })

router.post("/upload", function (req, res) {
  res.cookie("cStartPage", 0, {
    expires: new Date(Date.now() + 72000000),
    httpOnly: true,
  });

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  } else {
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    let timePic = moment().format("YY_MM_DD_HH_mm_ss");
    let namePic = timePic + sampleFile.name;
    let idProduct = req.body.id_product;
    let sql = "INSERT INTO picture(id_pro,name_img,active_img) VALUES (?,?,?)";

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv("./public/upload/" + namePic, function (err) {
      if (err) return res.status(500).send(err);
      conn.query(sql, [idProduct, namePic, 1], (err, resIns) => {
        if (err) throw console.log(err);

        res.redirect("/");
      });
    });
  }
});

router.get("/pic/:id", (req, res) => {
  let sql = "SELECT * FROM picture WHERE id_pro = ?";
  let idPro = req.params.id;
  conn.query(sql, [idPro], (err, resPic) => {
    idimg = resPic[0].name_img;
    res.render("pic", {
      id: idimg,
    });
  });
});

router.get("/del/:id", (req, res) => {
  async function main() {
    await fnDel();
  }
  main();

  function fnDel() {
    let gid = req.params.id;
    let sql = "DELETE FROM picture WHERE auto_id = ?";
    conn.query(sql, [gid], (err, resD) => {
      if (err) throw console.log(err);
      sendData();
    });
  }

  function sendData() {
    res.redirect("../");
  }
});

router.get("/search/", (req, res) => {
  txtSearch = "";
  dataSearch = "";

  res.redirect("../");
});

router.get("/search/:name", (req, res) => {
  async function main() {
    await fnSearch();
  }
  main();

  function fnSearch() {
    let gname = req.params.name;
    txtSearch = req.params.name;
    if (txtSearch == "9999") {
      txtSearch = "";
      res.redirect("../");
    } else {
      let sql =
        "SELECT tb_product.name_pro,picture.name_img,tb_product.id_product,picture.auto_id ";
      sql += "FROM picture ";
      sql += "INNER JOIN tb_product ON picture.id_pro = tb_product.id_product ";
      sql += "WHERE tb_product.name_pro LIKE ? ";

      let linkName = "%" + gname + "%";
      conn.query(sql, [linkName], (err, resS) => {
        dataSearch = resS;
        //console.log(resS);
        sendData();
      });
    }
  }

  function sendData() {
    //console.log(dataSearch);

    res.redirect("../");
  }
});

router.get("/:i", (req, res) => {
  let startPage = req.params.i;

  res.cookie("cStartPage", startPage, {
    expires: new Date(Date.now() + 72000000),
    httpOnly: true,
  });
  res.redirect("../");
});

router.post("/kiosk-upload", function (req, res) {
  console.log("Kiosk-upload");
  // res.cookie("cStartPage", 0, {
  //   expires: new Date(Date.now() + 72000000),
  //   httpOnly: true
  // });
  let type_default = 0; // picture
  let maxOrder = 0;
  let maxOrderLed = 0;

  async function main() {
    await chkMaxOrder();
  }
  main();

  async function chkMaxOrder() {
    let sql = "SELECT COUNT(id) AS rowss FROM list WHERE displaytype = 0";
    conk.query(sql, (err, resp) => {
      if (err) throw console.log(err);
      // console.log(resp);
      maxOrder = resp[0].rowss;
      maxOrder = Number(maxOrder);
      maxOrder = maxOrder + 1;
      chkMaxOrderLed();
    });
  }

  async function chkMaxOrderLed() {
    let sql = "SELECT COUNT(id) AS rowss FROM list WHERE displaytype = 1";
    conk.query(sql, (err, resp) => {
      if (err) throw console.log(err);
      // console.log(resp);
      maxOrderLed = resp[0].rowss;
      maxOrderLed = Number(maxOrderLed);
      maxOrderLed = maxOrderLed + 1;
      uploadDisplay();
    });
  }

  async function uploadDisplay() {
    console.log(maxOrder);
    if (!req.files || Object.keys(req.files).length === 0) {
      // return res.status(400).send('No files were uploaded.');
      console.log("not work");
    } else {
      console.log("good");
      // console.log(req.body);
      console.log(req.files.file);
      if (
        req.files.file.mimetype == "image/jpeg" ||
        req.files.file.mimetype == "image/png"
      ) {
      } else {
        type_default = 1;
      }

      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      let file = req.files.file;
      let timePic = moment().format("YY_MM_DD_HH_mm_ss");
      let thisTime = moment().format();
      let namePic = timePic + file.name;
      let title = req.body.text;
      let duration = req.body.duration;
      let displaytype = req.body.displaytype;
      duration = duration * 1000;
      // let sql = "INSERT INTO picture(id_pro,	name_img, active_img) VALUES (?,?,?)"
      let maxOrderForType = 0;
      if (displaytype == 0) {
        maxOrderForType = maxOrder;
      } else if (displaytype == 1) {
        maxOrderForType = maxOrderLed;
      }
      let sql =
        "INSERT INTO list(title,picture,status,create_date,duration,order_list,type,displaytype) VALUES ( ?,?,?,?,?,?,?,?)";

      // Use the mv() method to place the file somewhere on your server
      file.mv("./public/kiosk/" + namePic, function (err) {
        if (err) return res.status(500).send(err);
        conk.query(
          sql,
          [
            title,
            namePic,
            1,
            thisTime,
            duration,
            maxOrderForType,
            type_default,
            displaytype,
          ],
          (err, resIns) => {
            if (err) throw console.log(err);
            res.send("ok");
          }
        );
      });
    }
  }
});

module.exports = router;

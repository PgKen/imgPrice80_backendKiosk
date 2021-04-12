var express = require('express');
var router = express.Router();

var mysql = require('mysql')

var moment = require('moment')

var db_config = {
  host: 'localhost',
  user: 'root',
  password: 'comp@113',
  database: 'srimuangweb'
}

var conn;

function handleDisconnect() {
  conn = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  conn.connect(function (err) { // The server is either down
    if (err) { // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  conn.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else { // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}
handleDisconnect();
/**** End Data Service */

let sqlImgPrice = "SELECT tb_proselect.id_prod AS rId,tb_product.name_pro,"
sqlImgPrice += "tb_product.name_pro_en,tb_proselect.price_pro,tb_priceproduct.date_check,"
sqlImgPrice += "tb_product.name_pro_cn,picture.name_img,picture.id_pro,tb_unit.id_unit,tb_unit.unitname "
sqlImgPrice += "FROM tb_priceproduct "
sqlImgPrice += "INNER JOIN tb_proselect ON tb_priceproduct.id_pricepro = tb_proselect.idprice "
sqlImgPrice += "INNER JOIN tb_product ON tb_proselect.id_prod = tb_product.id_product "
sqlImgPrice += "INNER JOIN tb_typeproduct ON tb_product.typepro = tb_typeproduct.id_typepro "
sqlImgPrice += "INNER JOIN picture ON tb_proselect.id_prod = picture.id_pro "
sqlImgPrice += "INNER JOIN tb_unit ON tb_proselect.unit = tb_unit.id_unit "
/*WHERE id_mtype = 8*/
/*GROUP BY
tb_proselect.id_prod*/
sqlImgPrice += "ORDER BY tb_priceproduct.date_check DESC, RAND() ASC LIMIT 0, 16 "

//console.log(sqlImgPrice);

let sqlDateLast = "SELECT tb_proselect.id_prod AS rId,tb_product.name_pro,"
sqlDateLast += "tb_product.name_pro_en,tb_proselect.price_pro,tb_priceproduct.date_check,"
sqlDateLast += "tb_product.name_pro_cn,picture.name_img,picture.id_pro,tb_unit.id_unit,tb_unit.unitname "
sqlDateLast += "FROM tb_priceproduct "
sqlDateLast += "INNER JOIN tb_proselect ON tb_priceproduct.id_pricepro = tb_proselect.idprice "
sqlDateLast += "INNER JOIN tb_product ON tb_proselect.id_prod = tb_product.id_product "
sqlDateLast += "INNER JOIN tb_typeproduct ON tb_product.typepro = tb_typeproduct.id_typepro "
sqlDateLast += "INNER JOIN picture ON tb_proselect.id_prod = picture.id_pro "
sqlDateLast += "INNER JOIN tb_unit ON tb_proselect.unit = tb_unit.id_unit "
sqlDateLast += "WHERE date_check = ? "
/*WHERE id_mtype = 8*/
/*GROUP BY
tb_proselect.id_prod*/
sqlDateLast += "ORDER BY tb_priceproduct.date_check DESC, RAND() ASC LIMIT 0, 16 "

//console.log(sqlDateLast);


let sqlImgPrice2 = "SELECT tb_proselect.id_prod AS rId,tb_product.name_pro,tb_product.name_pro_en,"
sqlImgPrice2 += "tb_proselect.price_pro,tb_priceproduct.date_check,tb_product.name_pro_cn,picture.name_img,"
sqlImgPrice2 += "picture.id_pro,tb_unit.id_unit,tb_unit.unitname "
sqlImgPrice2 += "FROM tb_priceproduct "
sqlImgPrice2 += "INNER JOIN tb_proselect ON tb_priceproduct.id_pricepro = tb_proselect.idprice "
sqlImgPrice2 += "INNER JOIN tb_product ON tb_proselect.id_prod = tb_product.id_product "
sqlImgPrice2 += "INNER JOIN tb_typeproduct ON tb_product.typepro = tb_typeproduct.id_typepro "
sqlImgPrice2 += "INNER JOIN picture ON tb_proselect.id_prod = picture.id_pro "
sqlImgPrice2 += "INNER JOIN tb_unit ON tb_proselect.unit = tb_unit.id_unit "
sqlImgPrice2 += "WHERE date_check = ? "
sqlImgPrice2 += " AND tb_proselect.id_prod = ? "



let sqlDate = "SELECT tb_priceproduct.date_check FROM tb_priceproduct GROUP BY tb_priceproduct.date_check ORDER BY tb_priceproduct.date_check DESC LIMIT 0, 2 "


/* GET home page. */
router.get('/imgPrice', function (req, res, next) {

  let arrDate = []
  let dataImg1 = []
  let dataImg2 = []
  let totalData = []

  async function main() {
    await fnArrDate()
  }
  main()

  function fnArrDate() {
    let sql = sqlDate
    conn.query(sql, (err, resD) => {
      //console.log(resD);

      arrDate[0] = moment(resD[0].date_check).format("YYYY-MM-DD")
      arrDate[1] = moment(resD[1].date_check).format("YYYY-MM-DD")
      fnDataImg1()
    })
  }

  function fnDataImg1() {
    let sql = sqlDateLast
    console.log(arrDate[0]);
    console.log(arrDate[1]);

    conn.query(sql, [arrDate[0]], (err, resS) => {
      //console.log(resS);

      let mResS = resS.map(item => {
        return {
          id: item.id_pro,
          date_check: moment(item.date_check).format("DD-MM-YYYY"),
          name_pro: item.name_pro,
          price_pro: item.price_pro,
          name_img: item.name_img,
          unitname: item.unitname
        }
      })
      dataImg1 = mResS
      fnDataImg2()
      //console.log(resS);
      //console.log(resS);
    })
  }

  function fnDataImg2() {
    //console.log(dataImg1.length);
    //console.log(dataImg1)

    let sql = sqlImgPrice2
    //console.log(arrDate[1]);

    for (let i = 0; i < dataImg1.length; i++) {
      //console.log(dataImg1[i].id);
      conn.query(sql, [arrDate[1],
        [dataImg1[i].id]
      ], (err, resS) => {
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
        dataImg2.push(resS)
        if (i == (dataImg1.length - 1)) {
          difData()
        }
      });
    }
  }


  function difData() {
    //console.log(dataImg2);
    console.log(dataImg2[2][0].price_pro);

    let name = ""
    let price = ""
    let price2 = ""
    let date_check = ""
    let img = ""
    let unit = ""
    for (let i = 0; i < dataImg1.length; i++) {

      name = dataImg1[i].name_pro
      price = dataImg1[i].price_pro
      price2 = dataImg2[i][0].price_pro
      date_check = dataImg1[i].date_check
      img = dataImg1[i].name_img
      unit = dataImg1[i].unitname

      if (price > price2) { // up
        diff = 2
      } else if (price < price2) { // down
        diff = 1
      } else { // =
        diff = 0
      }


      totalData.push({
        date_check: date_check,
        name_pro: name,
        price_pro: price,
        price_pro2: price2,
        name_img: img,
        unitname: unit,
        diff: diff
      })

      if (i == (dataImg1.length - 1)) {
        sendData()
      }
    }
  }


  function sendData() {
    //console.log(dataImg1);
    //console.log(dataImg2);



    res.send(totalData)
  }
});

module.exports = router;
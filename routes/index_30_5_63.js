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


/* GET home page. */
router.get('/imgPrice', function (req, res, next) {
  let sql = sqlImgPrice
  conn.query(sql, (err, resS) => {
    let mResS = resS.map(item => {
      return {
        date_check: moment(item.date_check).format("DD-MM-YYYY"),
        name_pro: item.name_pro,
        price_pro: item.price_pro,
        name_img: item.name_img,
        unitname: item.unitname
      }
    })
    //console.log(resS);
    //console.log(resS);
    res.send(mResS)
  })
});

module.exports = router;
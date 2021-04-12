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


let dataSearch = []
let txtSearch = ""
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
    console.log(dataImg1)

    let nonRess = [{
      rId: 0,
      name_pro: '',
      name_pro_en: '',
      price_pro: 0,
      date_check: '0',
      name_pro_cn: '',
      name_img: '',
      id_pro: 0,
      id_unit: 0,
      unitname: ''
    }]

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
        if (resS != "") {
          dataImg2.push(resS)
        } else {
          dataImg2.push(nonRess)
        }
        if (i == (dataImg1.length - 1)) {
          difData()
        }
      });
    }
  }


  function difData() {
    console.log(dataImg2);
    console.log(dataImg2[0][0].price_pro);
    //console.log(dataImg2[2][0].price_pro);

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

      if (price > price2 && price2 != 0) { // up
        diff = 2
      } else if (price < price2 && price2 != 0) { // down
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

router.get('/facePass/:pass', (req, res) => {
  let gPass = req.params.pass
  let sql = "INSERT INTO facePass (pass) VALUES(?)"
  conn.query(sql, [gPass], (err, resP) => {
    if (err) throw console.log(err)
    res.end()
  })
})


router.get('/', (req, res) => {

  let dataProduct = []
  let dataImg = []
  //txtSearch = ""
  async function main() {
    await product()
  }
  main()

  function product() {
    let sql = "SELECT * FROM `tb_product`"
    conn.query(sql, (err, resP) => {
      if (err) throw console.log(err);
      dataProduct = resP
      imgProduct()
    })
  }

  function imgProduct() {
    if (dataSearch != []) {
      console.log("มีการค้นหา");
      dataImg = dataSearch
      sendData()
    } else {
      let sql = "SELECT tb_product.name_pro,picture.name_img,tb_product.id_product,picture.auto_id "
      sql += "FROM picture "
      sql += "INNER JOIN tb_product ON picture.id_pro = tb_product.id_product "
      sql += "ORDER BY auto_id DESC"
      conn.query(sql, (err, resImg) => {
        if (err) throw console.log(err)
        dataImg = resImg
        sendData()
      })
    }
  }

  function sendData() {
    //console.log(dataImg);


    res.render('index', {
      title: 'index',
      dataProduct,
      dataImg,
      txtSearch
    })
  }
})


router.post('/upload', function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  } else {

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    let timePic = moment().format('YY_MM_DD_HH_mm_ss')
    let namePic = timePic + sampleFile.name
    let idProduct = req.body.id_product
    let sql = "INSERT INTO picture(id_pro,	name_img, active_img) VALUES (?,?,?)"

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('./public/upload/' + namePic, function (err) {
      if (err)
        return res.status(500).send(err);
      conn.query(sql, [idProduct, namePic, 1], (err, resIns) => {
        if (err) throw console.log(err);

        res.redirect('/')
      })
    });
  }
});

router.get('/pic/:id', (req, res) => {
  let sql = "SELECT * FROM picture WHERE id_pro = ?"
  let idPro = req.params.id
  conn.query(sql, [idPro], (err, resPic) => {
    idimg = resPic[0].name_img
    res.render('pic', {
      id: idimg
    })
  })

})

router.get('/del/:id', (req, res) => {
  async function main() {
    await fnDel()
  }
  main()

  function fnDel() {
    let gid = req.params.id
    let sql = "DELETE FROM picture WHERE auto_id = ?"
    conn.query(sql, [gid], (err, resD) => {
      if (err) throw console.log(err)
      sendData()
    })
  }

  function sendData() {
    res.redirect('../')
  }
})

router.get('/search/', (req, res) => {
  txtSearch = ""
  dataSearch = ""
  console.log("sssssssssssssssss");
  console.log("sssssssssssssssss");
  console.log("sssssssssssssssss");
  console.log("sssssssssssssssss");

  res.redirect('../')
});

router.get('/search/:name', (req, res) => {
  async function main() {
    await fnSearch()
  }
  main()

  function fnSearch() {
    let gname = req.params.name
    txtSearch = req.params.name
    if (txtSearch == '9999') {
      txtSearch = ""
      res.redirect('../')
    } else {
      let sql = "SELECT tb_product.name_pro,picture.name_img,tb_product.id_product,picture.auto_id "
      sql += "FROM picture "
      sql += "INNER JOIN tb_product ON picture.id_pro = tb_product.id_product "
      sql += "WHERE tb_product.name_pro LIKE ? "

      let linkName = '%' + gname + '%'
      conn.query(sql, [linkName], (err, resS) => {
        dataSearch = resS
        console.log(resS);
        sendData()
      })
    }
  }

  function sendData() {
    //console.log(dataSearch);

    res.redirect('../')
  }
})

module.exports = router;
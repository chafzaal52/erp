var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Voucher Posting Work properly");
});


router.get('/VoucherList/:CompanyID/:DateFrom/:DateTo/:Status/:POSID/:VType/:VoucherNo', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let DateFrom= req.params.DateFrom;
    let DateTo= req.params.DateTo;
    let Status= req.params.Status;
    let POSID= req.params.POSID;
    let VType= req.params.VType;
    let VoucherNo= req.params.VoucherNo;
    let query=" SELECT  Distinct Journal.JRVID,Journal.JRTRANDATE,VTYPE,JRVNO,Journal.JRENTDATE,ConnUser,PostedUser,status,VoucherNo,fyear,payableto,chqacno,farstatus,Journal.POSID,GName  ";
    query+=" From JOURNAL  ";
    query+=" INNER JOIN JOURNALDT ON Journal.JRVID=JournalDt.JRVID and Journal.POSID=JournalDt.POSID  ";
    query+=" INNER JOIN sgodown ON sgodown.Whno=Journal.POSID   ";
    query+=" WHERE JOURNAL.CompanyId="+CompanyID+" and JOURNAL.JRTRANDATE between '"+DateFrom+"' and  '"+DateTo+"' AND Status="+Status+" ";
    if(POSID!="null"){
    query+=" AND Journal.POSID="+POSID+" "; 
    }
    if(VType!="null"){
    query+=" and VTYPE='"+VType+"'  ";
    }
    if(VoucherNo!="null"){
    query+=" and VoucherNo='"+VoucherNo+"' ";
    }
     new sql.connect(config).then(pool=> {   
            return pool.request()
                    .query(query)
                    .then(result => {
                     res.send(result.recordset);
                    })
                    .catch(err => {
                        res.send(err);
                    })
                })
});
   

module.exports = router;
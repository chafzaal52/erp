var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("CHQRplc_M Worked properly");
});


router.get('/GetList/:CompanyId', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let query="select * from CHQRplc_M where CompanyID="+CompanyId+";";
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
router.get('/GetById/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="select *  from CHQRplc_M where ID="+Id+";";
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
   router.get('/GetDetailByID/:ID', function (req, res, next) {
    let ID= req.params.ID;
    var query="select * from CHQRplc_D where ID="+ID;
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
   router.get('/GetChequeBookListBankWise/:bankid/:PosId/:CompIdN', function (req, res, next) {
    let bankid= req.params.bankid;
    let PosId= req.params.PosId;
    let CompIdN= req.params.CompIdN;
    var query="exec sp_GetChequeBookListBankWise "+bankid+","+PosId+","+CompIdN;
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
   router.get('/GetChequeReplacementList/:bankid/:id/:CompID/:PosID', function (req, res, next) {
    let bankid= req.params.bankid;
    let id= req.params.id;
    let CompID= req.params.CompID;
    let PosID= req.params.PosID;
    var query="exec sp_ChequeReplacementList "+bankid+","+id+","+CompID+","+PosID;
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
   router.post('/InsertUpdate', function (req, res, next) {
    var model= req.body;
    sql.connect(config).then(response => {
        return response.request()
        .input('ID', model.ID)
        .input('chq_book_id', model.chq_book_id)
        .input('POSID', model.POSID)
        .input('Bankid', model.Bankid)
        .input('E_date', sql.DateTime, model.E_date)
        .input('fyear', model.fyear)
        .input('Userid', model.Userid)
        .input('CompanyID', model.CompanyID)
        .execute('sp_InsertUpdateCHQRplc_M')
    }).then(result => {
        maxid = result.recordset[0].MaxID
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.post('/InsertDetail', function (req, res, next) {
    var model= req.body;
    sql.connect(config).then(response => {
        return response.request()
        .input('chq_book_id', model.chq_book_id)
        .input('POSID', model.POSID)
        .input('Chq_No', model.Chq_No)
        .input('Chq_AMt', model.Chq_AMt)
        .input('Marked', model.Marked)
        .input('Status', model.Status)
        .input('Rp_CHq_No', model.Rp_CHq_No)
        .input('Comments', model.Comments)
        .input('UserID', model.UserID)
        .input('CompanyID', model.CompanyID)
        .execute('sp_InsertUpdateCHQRplc_D')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.get('/ChequeStatusUpdate/:CHQStatus/:CHQId/:CHQNo', function (req, res, next) {
    let CHQStatus= req.params.CHQStatus;
    let CHQId= req.params.CHQId;
    let CHQNo= req.params.CHQNo;
    var query="UPDATE CHQNo_Sr SET CHQStatus = "+CHQStatus+" WHERE CHQId="+CHQId+" and CHQNo="+CHQNo;
    new sql.connect(config).then(pool=> {
        return pool.request()
                .query(query)
                .then(result => {
                 res.send("Success");
                })
                .catch(err => {
                    res.send(err);
                })
            })
   });
   router.get('/ChequeStatusUpdateJV/:CHQStatus/:ACNO/:CHQNo', function (req, res, next) {
    let CHQStatus= req.params.CHQStatus;
    let ACNO= req.params.ACNO;
    let CHQNo= req.params.CHQNo;
    var query="UPDATE CHQNo_Sr SET CHQStatus = "+CHQStatus+" WHERE ACNO="+ACNO+" and CHQNo="+CHQNo;
    new sql.connect(config).then(pool=> {
        return pool.request()
                .query(query)
                .then(result => {
                 res.send("Success");
                })
                .catch(err => {
                    res.send(err);
                })
            })
   });
   router.get('/JournalDTUpdate/:ACID/:JRCR/:JRDR/:chqno', function (req, res, next) {
    let ACID= req.params.ACID;
    let JRCR= req.params.JRCR;
    let JRDR= req.params.JRDR;
    let chqno= req.params.chqno;
    var query="UPDATE JOURNALDT SET JRCR = "+JRCR+",JRDR="+JRDR+",chqno='"+chqno+"' WHERE ACID="+ACID;
    new sql.connect(config).then(pool=> {
        return pool.request()
                .query(query)
                .then(result => {
                 res.send("Success");
                })
                .catch(err => {
                    res.send(err);
                })
            })
   });
router.delete('/Delete/:ID', function (req, res, next) {
    let ID= req.params.ID;
    var query="delete from CHQRplc_D where ID="+ID+"; delete from CHQRplc_M where ID="+ID;
    sql.connect(config).then(function (connection) {   
    new sql.Request(connection)
                    .query(query)
                    .then(function (dbData) {
                        res.send("Deleted Successfull.");
                    })
                    .catch(function (error) {
                      response.send(error);
                    })
    })
    .catch(function(err){
        response.send(err);     
    })
});
router.delete('/DeleteDetail/:ID', function (req, res, next) {
    let ID= req.params.ID;
    var query="delete from CHQRplc_D where ID="+ID;
    sql.connect(config).then(function (connection) {   
    new sql.Request(connection)
                    .query(query)
                    .then(function (dbData) {
                        res.send("Deleted Successfull.");
                    })
                    .catch(function (error) {
                      response.send(error);
                    })
    })
    .catch(function(err){
        response.send(err);     
    })
});

module.exports = router;
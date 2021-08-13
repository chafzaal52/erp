var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("i am works properly");
});

router.get('/GetList/:CompanyId', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let query="select m.*,b.GlCode,b.Bankname,b.BankACNo,b.bkAddr from CHQBook_M  m, RCBank b where m.Bankid=b.BankID and m.CompanyID="+CompanyId+";";
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
    var query="select m.*,b.GlCode,b.Bankname,b.BankACNo,b.bkAddr from CHQBook_M  m, RCBank b where m.Bankid=b.BankID and m.chq_book_id="+Id+";";
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
   router.get('/GetDetailById/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="select *  from CHQBook_D where chq_book_id="+Id+";";
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
   router.get('/GetDetailSrNoById/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="select *  from CHQNo_Sr where CHQId="+Id+";";
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
   router.get('/GetActiveCHQNo_Sr/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    var query="select *  from CHQNo_Sr where CompanyID="+CompanyID;
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
   router.get('/GetActiveCHQNo_SrJV/:CompanyID/:ACNO', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let ACNO= req.params.ACNO;
    var query="select *  from CHQNo_Sr where CHQStatus=1 and ACNO="+ACNO+" and CompanyID="+CompanyID;
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
        .input('chq_book_id',model.chq_book_id)
        .input('POSID',model.POSID)
        .input('Bankid',model.Bankid)
        .input('fyear',model.fyear)
        .input('Userid',model.Userid)
        .input('CompanyID',model.CompanyID)
        .execute('sp_InsertUpdateChqBookRecordMast')
    }).then(result => {
        maxid = result.recordset[0].MaxID
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.post('/InsertUpdateDetail', function (req, res, next) {
 var model= req.body;
 sql.connect(config).then(response => {
     return response.request()
     .input('ID',model.ID)
     .input('chq_book_id',model.chq_book_id)
     .input('POSID',model.POSID)
     .input('E_date',sql.DateTime,model.E_date)
     .input('Chq_From',model.Chq_From)
     .input('Chq_To',model.Chq_To)
     .input('Tot_Chq',model.Tot_Chq)
     .input('Book_Status',model.Book_Status)
     .input('Comments',model.Comments)
     .input('CompanyID',model.CompanyID)
     .execute('sp_InsertUpdateChqBookRecordDetail')
 }).then(result => {
     maxid = result.recordset[0].MaxID
     res.send(""+maxid+"");
 }).catch(err => {
     res.send({ err });
 })
});
router.post('/InsertUpdateDetailChqSrNo', function (req, res, next) {
    var model= req.body;
    sql.connect(config).then(response => {
        return response.request()
        .input('AutoMaxid',model.AutoMaxid)
        .input('POSID',model.POSID)
        .input('ACNO',model.ACNO)
        .input('CHQId',model.CHQId)
        .input('CHQNo',model.CHQNo)
        .input('CHQStatus',model.CHQStatus)
        .input('CHQRef',model.CHQRef)
        .input('CompanyID',model.CompanyID)
        .execute('sp_InsertUpdateChqBookRecordDetChqSrNo')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});

router.get('/GetChqequeStatus/:ACNO/:CompanyID/:DateFrom/:DateTo', function (req, res, next) {
    let ACNO= req.params.ACNO;
    let CompanyID= req.params.CompanyID;
    let DateFrom= req.params.DateFrom;
    let DateTo= req.params.DateTo;
    let query="exec sp_ChequeStatusReport "+ACNO+","+CompanyID+",'"+DateFrom+"','"+DateTo+"'";
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

router.delete('/Delete/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from CHQNo_Sr where CHQId="+Id+";delete from CHQBook_D where chq_book_id="+Id+"; delete from CHQBook_M where chq_book_id="+Id+";";
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

router.delete('/DeleteDetail/:Id/:CompanyId', function (req, res, next) {
    let Id= req.params.Id;
    let CompanyId= req.params.CompanyId;
    var query="delete from CHQNo_Sr where CHQId="+Id+"and CompanyID="+CompanyId+";";
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
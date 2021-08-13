var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("ACLIST Work properly");
});


router.get('/GetList/:CompanyId', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let query="select * from ACLIST where CompanyId="+CompanyId;
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
    var query="select *  from ACLIST where ACNO="+Id+";";
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
        .input('ACNO',model.ACNO)
        .input('AcNoD',model.AcNoD)
        .input('ACL1',model.ACL1)
        .input('ACL2',model.ACL2)
        .input('ACL3',model.ACL3)
        .input('ACL4',model.ACL4)
        .input('ACL5',model.ACL5)
        .input('P1',model.P1)
        .input('P2',model.p2)
        .input('P3',model.p3)
        .input('P4',model.P4)
        .input('P5',model.P5)
        .input('ACHEAD',model.ACHEAD)
        .input('ACPARENT',model.ACPARENT)
        .input('ACLEVEL',model.ACLEVEL)
        .input('ACSTATUS',model.ACSTATUS)
        .input('ACCLASS',model.ACCLASS)
        .input('ACDEPRATE',model.ACDEPRATE)
        .input('ACOPNDATE',sql.DateTime,model.ACOPNDATE)
        .input('ACOPNBAL',model.ACOPNBAL)
        .input('ACDPRISTAT',model.ACDPRISTAT)
        .input('SUNDARY',model.SUNDARY)
        .input('ACTAKEOVER',model.ACTAKEOVER)
        .input('ACAGEING',model.ACAGEING)
        .input('ACCRLIMIT',model.ACCRLIMIT)
        .input('ACDAYS',model.ACDAYS)
        .input('ACENTDATE',sql.DateTime,model.ACENTDATE)
        .input('accurbal',model.accurbal)
        .input('NoteNo',model.NoteNo)
        .input('AccDepAcNo',model.AccDepAcNo)
        .input('ExAccNo',model.ExAccNo)
        .input('Notedesc',model.Notedesc)
        .input('BusinessAccountID',model.BusinessAccountID)
        .input('IsActive',model.IsActive)
        .input('CreatedBy',model.CreatedBy)
        .input('CreatedDate',sql.DateTime,model.CreatedDate)
        .input('UpdatedBy',model.UpdatedBy)
        .input('UpdatedDate',sql.DateTime,model.UpdatedDate)
        .input('CompanyId',model.CompanyId)
        .input('deptcoded',model.deptcoded)
        .execute('sp_InsertUpdateCOA')
    }).then(result => {
        maxid = result.recordset[0].MaxID
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from ACLocation where ACNO="+Id+"; delete from ACLIST where ACNO="+Id+";";
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

///////////////////////////////ACLocation/////////////////////////////////
router.get('/GetACLocationByACNO/:ACNO', function (req, res, next) {
    let ACNO= req.params.ACNO;
    var query="select *  from ACLocation where ACNO="+ACNO+";";
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
router.post('/ACLocationInsert', function (req, res, next) {
    var model= req.body;
    sql.connect(config).then(response => {
        return response.request()
        .input('ID',model.ID)
        .input('BusinessAccountID',model.BusinessAccountID)
        .input('ACNO',model.ACNO)
        .input('LocationID',model.LocationID)
        .input('CreatedBy',model.CreatedBy)
        .input('CreatedDate',sql.DateTime,model.CreatedDate)
        .input('UpdatedBy',model.UpdatedBy)
        .input('UpdatedDate',sql.DateTime,model.UpdatedDate)
        .input('IsActive',model.IsActive)
        .input('CompanyId',model.CompanyId)
        .execute('sp_InsertACLocation')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/ACLocationDelete/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from ACLocation where ACNO="+Id+";";
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
router.get('/GetACListLocation/:ACNO/:CompID', function (req, res, next) {
    let ACNO= req.params.ACNO;
    let CompID= req.params.CompID;
    var query="exec sp_GetACListLocation "+ACNO+","+CompID;
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
////////////////////////Accounts Other Functions//////////////////////////
router.get('/GetNextAccountNo2/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="exec GetNextAccountNo2 "+CompanyID;
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
router.get('/GetSameAccountNo22/:ID', function (req, res, next) {
    let ID= req.params.ID;
    let query="exec GetSameAccountNo22 "+ID;
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
router.get('/GetSameAccountNo23/:ID', function (req, res, next) {
    let ID= req.params.ID;
    let query="exec GetSameAccountNo23 "+ID;
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
router.get('/GetSameAccountNo24/:ID', function (req, res, next) {
    let ID= req.params.ID;
    let query="exec GetSameAccountNo24 "+ID;
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
router.get('/GetSameAccountNo25/:ID', function (req, res, next) {
    let ID= req.params.ID;
    let query="exec GetSameAccountNo25 "+ID;
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
router.get('/GetNextAccountNo22/:ID', function (req, res, next) {
    let ID= req.params.ID;
    let query="exec GetNextAccountNo22 "+ID;
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
router.get('/GetNextAccountNo23/:ID', function (req, res, next) {
    let ID= req.params.ID;
    let query="exec GetNextAccountNo23 "+ID;
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
router.get('/GetNextAccountNo24/:ID', function (req, res, next) {
    let ID= req.params.ID;
    let query="exec GetNextAccountNo24 "+ID;
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
router.get('/GetNextAccountNo25/:ID', function (req, res, next) {
    let ID= req.params.ID;
    let query="exec GetNextAccountNo25 "+ID;
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
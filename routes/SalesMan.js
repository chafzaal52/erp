var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("SalesMan work properly");
});


router.get('/GetList/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="select * from SalesMan where CompanyID="+CompanyID;
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
    var Id= req.params.Id;
    var query="select *  from SalesMan where Mid="+Id+";";
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
        .input('ID',model.Mid)
        .input('Name',model.Name)
        .input('Address',model.Address)
        .input('PHone',model.PHone)
        .input('EMail',model.EMail)
        .input('Designation',model.Designation)
        .input('Department',model.Department)
        .input('NIC',model.NIC)
        .input('PosID',model.PosID)
        .input('UserID',model.UserID)
        .input('Incentive',model.Incentive)
        .input('Desig_code',model.Desig_code)
        .input('DateofJoin',sql.DateTime,model.DateofJoin)
        .input('LandLine',model.LandLine)
        .input('ICE_Contact_name',model.ICE_Contact_name)
        .input('ICE_Contact_No',model.ICE_Contact_No)
        .input('Logon_ID',model.Logon_ID)
        .input('isBlocked',model.isBlocked)
        .input('ImpGLCode',model.ImpGLCode)
        .input('GLCode',model.GLCode)
        .input('Sales_Type_id',model.Sales_Type_id)
        .input('Areaid',model.Areaid)
        .input('CompanyID',model.CompanyID)
        .execute('sp_InsertUpdateSalesMan')
    }).then(result => {
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from SalesMan where Mid="+Id+";";
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
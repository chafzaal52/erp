var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("MenueAccess Work properly");
});


router.get('/GetList/', function (req, res, next) {
    let query="select * from MenueAccess";
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
router.get('/Getusp_helptext3/:RoleID/:CompanyID', function (req, res, next) {
    let RoleID= req.params.RoleID;
    let CompanyID= req.params.CompanyID;
    var query="Exec usp_helptext3 '"+RoleID+"',"+CompanyID;
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
        .input('RoleID', model.RoleID)
        .input('MenueID', model.MenueID)
        .input('TopMenueID', model.TopMenueID)
        .input('ParentMenueID', model.ParentMenueID)
        .input('CanView', model.CanView)
        .input('CanAdd', model.CanAdd)
        .input('CanEdit', model.CanEdit)
        .input('CanDelete', model.CanDelete)
        .input('CreatedDate', sql.DateTime, model.CreatedDate)
        .input('CreatedBy', model.CreatedBy)
        .input('UpdatedDate', sql.DateTime, model.UpdatedDate)
        .input('UpdatedBy', model.UpdatedBy)
        .input('IsActive', model.IsActive)
        .input('CompanyId', model.CompanyId)
        .execute('sp_InsertUpdateMenueAccess')
    }).then(result => {
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from MenueAccess where ID="+Id+";";
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
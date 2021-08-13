var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("i am works properly");
});


router.get('/GetList/', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let query="select * from Menue";
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
    var query="select *  from Menue where ID="+Id+";";
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
        .input('ID',model.ID)
        .input('BusinessAccountID',model.BusinessAccountID)
        .input('MenueLabel',model.MenueLabel)
        .input('TopMenueID',model.TopMenueID)
        .input('MenueLocaton',model.MenueLocaton)
        .input('MenueType',model.MenueType)
        .input('MenueIcon',model.MenueIcon)
        .input('IsParent',model.IsParent)
        .input('ParentMenueID',model.ParentMenueID)
        .input('SortingOrder',model.SortingOrder)
        .input('AreaID',model.AreaID)
        .input('ControllerID',model.ControllerID)
        .input('ActionID',model.ActionID)
        .input('CreatedBy',model.CreatedBy)
        .input('CreatedDate',sql.DateTime,model.CreatedDate)
        .input('UpdatedBy',model.UpdatedBy)
        .input('UpdatedDate',sql.DateTime,model.UpdatedDate)
        .input('IsActive',model.IsActive)
        .input('CompanyId',model.CompanyId)
        .execute('sp_InsertUpdateMenue')
    }).then(result => {
        maxid = result.recordset[0].MaxID
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from Menue where ID="+Id+";";
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
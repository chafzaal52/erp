var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Class Definition work properly");
});


router.get('/GetList', function (req, res, next) {
    let query="select * from Release";
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
router.get('/GetLast', function (req, res, next) {
    let query="select top(1)* from Release order by ReleaseID desc";
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
router.get('/GetById/:ReleaseID', function (req, res, next) {
    var ReleaseID= req.params.ReleaseID;
    var query="select *  from Release where ReleaseID="+ReleaseID+";";
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
        .input('ReleaseID',model.ReleaseID)
        .input('ReleaseNumber',model.ReleaseNumber)
        .input('ReleaseDescription',model.ReleaseDescription)
        .input('ReleaseDate',sql.DateTime,model.ReleaseDate)
        .input('CreatedDate',sql.DateTime,model.CreatedDate)
        .input('CreatedBy',model.CreatedBy)
        .input('UpdatedDate',sql.DateTime,model.UpdatedDate)
        .input('UpdatedBy',model.UpdatedBy)
        .execute('sp_InsertUpdateRelease')
    }).then(result => {
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from Release where ReleaseID="+Id+";";
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
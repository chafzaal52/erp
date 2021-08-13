var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Delivery Challan Work properly");
});


router.get('/GetShortList/:CompanyID/:Search', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let Search= req.params.Search;
    let query="select top(80)m.Ord_No,m.Ord_id,m.OrdSale,m.NewS_Ord_id,m.Edate,m.Comments,v.VenderName from Ord_Ship_M m,UVendorsDefM v where  m.BuyerCode=v.VenderId and m.CompanyID="+CompanyID+" ";
    if(Search!="null"){
    query+=" and (m.Ord_No like '%"+Search+"%' or m.OrdSale like '%"+Search+"%' or m.Edate like '%"+Search+"%' or m.Comments like '%"+Search+"%' or v.VenderName like '%"+Search+"%')";
    }
    query+=" order by Ord_id desc"
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
// router.get('/GetById/:Id', function (req, res, next) {
//     var Id= req.params.Id;
//     var query="select *  from Manufacturs where Mid="+Id+";";
//     new sql.connect(config).then(pool=> {   
//         return pool.request()
//                 .query(query)
//                 .then(result => {
//                  res.send(result.recordset);
//                 })
//                 .catch(err => {
//                     res.send(err);
//                 })

//             })
//    });
//    router.post('/InsertUpdate', function (req, res, next) {
//     var model= req.body;
//     sql.connect(config).then(response => {
//         return response.request()
//         .input('Id',model.Mid)
//         .input('Name',model.Name)
//         .input('Address',model.Address)
//         .input('PHone',model.PHone)
//         .input('EMail',model.EMail)
//         .input('contactPer',model.contactPer)
//         .input('ContDesig',model.ContDesig)
//         .input('STaxNo',model.STaxNo)
//         .input('CreatedBy',model.CreatedBy)
//         .input('CreatedDate',sql.DateTime,model.CreatedDate)
//         .input('UpdatedBy',model.UpdatedBy)
//         .input('UpdatedDate',sql.DateTime,model.UpdatedDate)
//         .input('POSID',model.POSID)
//         .input('CompanyID',model.CompanyID)
//         .execute('sp_InsertUpdateBrand')
//     }).then(result => {
//         res.send("Success");
//     }).catch(err => {
//         res.send({ err });
//     })
// });
router.delete('/DeleteDetail/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from Ord_Ship_D where Ord_Id="+Id+";";
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
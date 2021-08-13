var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Product Profiler work properly");
});


router.get('/GetList/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="select M.*,i.ItHead,i.ItCodeD from ItemProfileM M, IItems i where m.ItCode=i.ItCode and M.CompanyID="+CompanyID;
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
    var query="select M.*,i.ItHead,i.ItCodeD from ItemProfileM M, IItems i where m.ItCode=i.ItCode and M.MaxId="+Id+";";
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
    var Id= req.params.Id;
    var query="select * from ItemProfileD where MaxId="+Id;
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
        .input('ID',model.MaxId)
        .input('ItCode',model.ItCode)
        .input('Remarks',model.Remarks)
        .input('UserId',model.UserId)
        .input('UPrice',model.UPrice)
        .input('SiteId',model.SiteId)
        .input('Chapter_No',model.Chapter_No)
        .input('Model_Code',model.Model_Code)
        .input('PQty',model.PQty)
        .input('Unit_Id',model.Unit_Id)
        .input('PakSize_TP',model.PakSize_TP)
        .input('PakSize_PS',model.PakSize_PS)
        .input('ThYield_TP',model.ThYield_TP)
        .input('ThYield_PS',model.ThYield_PS)
        .input('PrYield_TP',model.PrYield_TP)
        .input('PrYield_PS',model.PrYield_PS)
        .input('Percent_TP',model.Percent_TP)
        .input('Percent_PS',model.Percent_PS)
        .input('TotBchPrctl',model.TotBchPrctl)
        .input('IsDisabled',model.IsDisabled)
        .input('LaborCost',model.LaborCost)
        .input('FOHCost',model.FOHCost)
        .input('QtyKgs',model.QtyKgs)
        .input('MOorPO',model.MOorPO)
        .input('GName',model.GName)
        .input('OperNum',model.OperNum)
        .input('TimeMin',model.TimeMin)
        .input('WSkills',model.WSkills)
        .input('MType',model.MType)
        .input('MIns',model.MIns)
        .input('Spec',model.Spec)
        .input('Oper',model.Oper)
        .input('Insp',model.Insp)
        .input('CreatedBy',model.CreatedBy)
        .input('CreatedDate',sql.DateTime,model.CreatedDate)
        .input('UpdatedBy',model.UpdatedBy)
        .input('UpdatedDate',sql.DateTime,model.UpdatedDate)
        .input('CompanyID',model.CompanyID)
        .execute('sp_InsertUpdateItemProfileM')
    }).then(result => {
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.post('/InsertUpdateDetail', function (req, res, next) {
    var model= req.body;
    sql.connect(config).then(response => {
        return response.request()
        .input('ID',model.ItemProfileD_ID)
        .input('MaxId',model.MaxId)
        .input('ItemCode',model.ItemCode)
        .input('UnitId',model.UnitId)
        .input('BarCode',model.BarCode)
        .input('ItQty',model.ItQty)
        .input('Yield',model.Yield)
        .input('Wastage',model.Wastage)
        .input('Comments',model.Comments)
        .input('ProdType',model.ProdType)
        .input('StageNo',model.StageNo)
        .input('SrNo',model.SrNo)
        .input('CompanyID',model.CompanyID)
        .execute('sp_InsertUpdateItemProfileD')
    }).then(result => {
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from ItemProfileD where MaxId="+Id+"; delete from ItemProfileM where MaxId="+Id+";";
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
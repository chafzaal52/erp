var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("MIR worked properly");
});


router.get('/GetList/:CompanyId', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let query="select * from IMaterialReqM where CompanyID="+CompanyId+";";
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
router.get('/GetMIRDDL/:FormType/:CompanyId', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let FormType= req.params.FormType;
    let query="";
    if(FormType==0){
    query+="select d.MaxId ID,MIRNo Code,isnull((select SiteNumber from siteid where Maxid=d.ProjectID),'') Name from IMaterialReqM m,IMaterialReqD d ";
    query+=" where m.MaxID=d.MaxId and m.companyid="+CompanyId+" and isnull(Proceed_All,0)="+FormType+" and isnull(m.Closed,0)=0 and isnull(m.Cancel,0)=0 group by MIRNo,d.MaxId,d.ProjectID;";
    }
    else{
        query+="select d.MaxId ID,MIRNo Code,isnull((select SiteNumber from siteid where Maxid=d.ProjectID),'') Name from IMaterialReqM m,IMaterialReqD d ";
    query+=" where m.MaxID=d.MaxId and m.companyid="+CompanyId+" and isnull(m.Closed,0)=0 and isnull(m.Cancel,0)=0 group by MIRNo,d.MaxId,d.ProjectID;";
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
router.get('/GetShortList/:CompanyId/:Search', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let Search= req.params.Search;
    let query="select top(80)m.MaxId,m.POSName,m.MIRNo,m.EDate,m.DeptName,m.Comments,s.SiteNumber from IMaterialReqM m ";
    query+=" left join IMaterialReqD d on m.MaxId=d.MaxId "; 
    query+=" left join SiteId s on d.ProjectID=s.Maxid ";
    query+=" where m.CompanyID="+CompanyId+" ";
    if(Search!="null"){
    query+=" and (m.POSName like '%"+Search+"%' or m.MIRNo like '%"+Search+"%' or m.EDate like '%"+Search+"%' or m.DeptName like '%"+Search+"%' or m.Comments like '%"+Search+"%' or s.SiteNumber like '%"+Search+"%') ";
    }
    query+=" group by m.POSName,m.MIRNo,m.EDate,m.DeptName,m.Comments,m.MaxId,s.SiteNumber order by m.MaxId desc";
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
router.get('/GetDetailList/:MaxId', function (req, res, next) {
    let MaxId= req.params.MaxId;
    let query="select * from IMaterialReqD where MaxId="+MaxId+";";
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
    var query="select *  from IMaterialReqM where MaxId="+Id+";";
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
   router.get('/UpdateCompleteMIR/:MIR_ID', function (req, res, next) {
    let MIR_ID= req.params.MIR_ID;
    var query="exec sp_UpdateCompleteMIR "+MIR_ID;
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
   router.post('/InsertUpdate', function (req, res, next) {
    var model= req.body;
    sql.connect(config).then(response => {
        return response.request()
        .input('ID', model.MaxId)
        .input('POSId', model.POSId)
        .input('MIRNo', model.MIRNo)
        .input('EDate', sql.DateTime, model.EDate)
        .input('ProductDetail', model.ProductDetail)
        .input('Deptcode', model.Deptcode)
        .input('Comments', model.Comments)
        .input('ReqType', model.ReqType)
        .input('ProdPlanId', model.ProdPlanId)
        .input('BatchNo', model.BatchNo)
        .input('BatchSize', model.BatchSize)
        .input('Cancel',model.Cancel)
        .input('Userid', model.Userid)
        .input('Fyear', model.Fyear)
        .input('Closed', model.Closed)
        .input('DirBatchNo', model.DirBatchNo)
        .input('Proceed_All', model.Proceed_All)
        .input('StageNo', model.StageNo)
        .input('PackPlan_MaxId', model.PackPlan_MaxId)
        .input('DeliveryDate', sql.DateTime, model.DeliveryDate)
        .input('ProdPlanNo', model.ProdPlanNo)
        .input('itemcode', model.itemcode)
        .input('ItemName',model.ItemName)
        .input('PlanType', model.PlanType)
        .input('TotalMatReqQty', model.TotalMatReqQty)
        .input('TotalMatReqQtyProceed', model.TotalMatReqQtyProceed)
        .input('redresid', model.redresid)
        .input('CompanyID', model.CompanyID)
        .input('CreatedDate', sql.DateTime, model.CreatedDate)
        .input('CreatedBy', model.CreatedBy)
        .input('UpdatedBy', model.UpdatedBy)
        .input('UpdatedDate', sql.DateTime, model.UpdatedDate)
        .input('DeptCodeD', model.DeptCodeD)
        .input('DeptName', model.DeptName)
        .input('POSName', model.POSName)
        .input('EngID', model.EngID)
        .input('EngName', model.EngName)
        .execute('sp_InsertUpdateIMaterialReqM')
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
        .input('MaxId', model.MaxId)
        .input('CompanyID', model.CompanyID)
        .input('ItCode', model.ItCode)
        .input('CurrQty', model.CurrQty)
        .input('ReqQty', model.ReqQty)
        .input('Remarks', model.Remarks)
        .input('ProjectID', model.ProjectID)
        .input('adjestqty', model.adjestqty)
        .input('Unitmeasure', model.Unitmeasure)
        .input('POSid', model.POSid)
        .input('ItCodeD', model.ItCodeD)
        .input('ItHead', model.ItHead)
        .execute('sp_InsertIMaterialReqD')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/DeleteDetail/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from IMaterialReqD where MaxId="+Id;
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
router.delete('/Delete/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from IMaterialReqD where MaxId="+Id+"; delete from IMaterialReqM where MaxId="+Id+";";
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
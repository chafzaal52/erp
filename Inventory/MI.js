var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("MI worked properly");
});


router.get('/GetList/:CompanyId', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let query="select *,isnull((select GName from SGodown where Whno=m.posid),'') as POSName,ISNULL((select DeptName from Departments where DeptCode=m.DeptCode),'') as DeptName from IissueNoteM M where m.CompanyId="+CompanyId+";";
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
    let query="select top(80)m.IssueID,m.maxno,s.SiteNumber,isnull((select MIRNo from IMaterialReqM where Maxid=m.Mir_Maxid),'') as MIRNo,isnull((select GName from SGodown where Whno=m.posid),'') as POSName,ISNULL((select DeptName from Departments where DeptCode=m.DeptCode),'') as DeptName from IissueNoteM m ";
    query+=" left join IissueNoteD d on m.IssueID=d.IssueId ";
    query+=" left join SiteId s on s.Maxid=d.ProjectID ";
    query+=" where m.CompanyId="+CompanyId+" ";
    if(Search!="null"){
    query+=" and (m.maxno like '%"+Search+"%' or m.Mir_Maxid in (select Maxid from IMaterialReqM where MIRNo like '%"+Search+"%') or s.SiteNumber like '%"+Search+"%') ";
    }
    query+=" group by m.IssueID,m.maxno,s.SiteNumber,m.Mir_Maxid,m.posid,m.DeptCode order by m.IssueID desc";
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
    var query="select *,isnull((select GName from SGodown where Whno=m.posid),'') as POSName,ISNULL((select DeptName from Departments where DeptCode=m.DeptCode),'') as DeptName from IissueNoteM M where m.IssueID="+Id;
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
   router.get('/GetDetailList/:IssueID', function (req, res, next) {
    let IssueID= req.params.IssueID;
    let query="select * from IissueNoteD where IssueID="+IssueID;
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
        .input('ID', model.IssueID)
        .input('posid', model.posid)
        .input('Mir_Maxid', model.Mir_Maxid)
        .input('maxno', model.maxno)
        .input('EntryDate', sql.DateTime, model.EntryDate)
        .input('DeptCode', model.DeptCode)
        .input('Location', model.Location)
        .input('IDate', sql.DateTime, model.IDate)
        .input('CStatus', model.CStatus)
        .input('IssueStatus', model.IssueStatus)
        .input('UserId', model.UserId)
        .input('fyear', model.fyear)
        .input('VoucherDate', sql.DateTime, model.VoucherDate)
        .input('cancel', model.cancel)
        .input('AcNo', model.AcNo)
        .input('Jrvid', model.Jrvid)
        .input('BatchNo', model.BatchNo)
        .input('ProdPlanId', model.ProdPlanId)
        .input('isgeneral', model.isgeneral)
        .input('DirectPlanid', model.DirectPlanid)
        .input('closed', model.closed)
        .input('CompanyId', model.CompanyId)
        .input('CreatedDate', sql.DateTime, model.CreatedDate)
        .input('Createdby', model.Createdby)
        .input('UpdatedDate', sql.DateTime, model.UpdatedDate)
        .input('UpdatedBy', model.UpdatedBy)
        .input('totissueqty', model.totissueqty)
        .input('totreqqty', model.totreqqty)
        .input('totblanqty', model.totblanqty)
        .input('Storeid', model.Storeid)
        .input('EngID', model.EngID)
        .input('EngName', model.EngName)
        .execute('sp_InsertUpdateiIssueNoteM')
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
        .input('IssueId', model.IssueId)
        .input('Posid', model.Posid)
        .input('ItCode', model.ItCode)
        .input('ItName', model.ItName)
        .input('UnitCode', model.UnitCode)
        .input('QtyOpening', model.QtyOpening)
        .input('QtyReq', model.QtyReq)
        .input('QtyIssue', model.QtyIssue)
        .input('itRate', model.itRate)
        .input('TotAmt', model.TotAmt)
        .input('BatchNo', model.BatchNo)
        .input('ExpDate', sql.DateTime, model.ExpDate)
        .input('serialItem', model.serialItem)
        .input('CGS', model.CGS)
        .input('mitcode', model.mitcode)
        .input('IsPackMI', model.IsPackMI)
        .input('ProjectID', model.ProjectID)
        .input('DeptCode', model.DeptCode)
        .input('Remarks', model.Remarks)
        .input('Assay', model.Assay)
        .input('IMaterialReqD_ID', model.IMaterialReqD_ID)
        .input('CompanyId', model.CompanyId)
        .execute('sp_InsertUpdateiIssueNoteD')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/DeleteDetail/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from IissueNoteD where IssueID="+IssueID;
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
    var query="delete from IissueNoteD where IssueID="+Id+"; delete from IissueNoteM where IssueID="+Id+";";
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
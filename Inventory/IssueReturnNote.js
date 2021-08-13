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
    let query="select * from IiRetIssueNM where CompanyID="+CompanyId+";";
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
router.get('/DDLList/:CompanyId', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let query=" select m.RetIssueNo ID,m.maxno Code,isnull((select SiteNumber from SiteId s where s.Maxid=d.ProjectID),'') Name from IiRetIssueNM m ";
    query+=" left join IiRetIssueND d on d.RetIssuNo=m.RetIssueNo ";
    query+=" where  m.CompanyID="+CompanyId+" ";
    query+=" group by m.RetIssueNo,m.maxno,d.ProjectID  ";
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
    let query="select top(80)m.*,d.DeptCodeD,d.DeptName,isnull((select SiteNumber from SiteId where Maxid=de.ProjectID),'')ProjectName from IiRetIssueNM m, IiRetIssueND de, Departments d ";
    query+=" where m.DeptCode=d.DeptCode and de.RetIssuNo=m.RetIssueNo and m.CompanyID="+CompanyId+" ";
    if(Search!="null"){
    query+=" and (maxno like '%"+Search+"%' or DeptName like '%"+Search+"%') ";
    }
    query+=" group by m.RetIssueNo,m.maxno,m.fyear,m.DeptCode,m.IDate,m.IssueStatus,m.Job,m.Remarks,m.UserId,de.ProjectID,m.Plan_MaxId,m.BatchNo,m.RetType,m.AcNo,m.Jrvid,m.GodownId,d.DeptCodeD,m.IssueId,m.Isapproved,m.IssueIDNewAll,m.CompanyID,d.DeptCode,d.DeptName ";
    query+=" order by RetIssueNo desc ";
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
    let query="select ibin.MearsuringUnitDescrp as UnitName,ibin.BrandName,ibin.LeastTime as Model,d.* from IiRetIssueND d, ibincard ibin where ibin.Itcode=d.Itcode and d.RetIssuNo="+MaxId+";";
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
    var query="select * from IiRetIssueNM where RetIssueNo="+Id+";";
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
   router.get('/GetMaxNo/:CompanyId', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let query="select MAX(maxno) as MaxNo from IiRetIssueNM where CompanyID="+CompanyId+";";
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
        .input('RetIssueNo', model.RetIssueNo)
        .input('maxno', model.maxno)
        .input('fyear', model.fyear)
        .input('DeptCode', model.DeptCode)
        .input('IDate', sql.DateTime, model.IDate)
        .input('IssueStatus', model.IssueStatus)
        .input('Job', model.Job)
        .input('Remarks', model.Remarks)
        .input('UserId', model.UserId)
        .input('Plan_MaxId', model.Plan_MaxId)
        .input('BatchNo', model.BatchNo)
        .input('RetType', model.RetType)
        .input('AcNo', model.AcNo)
        .input('Jrvid', model.Jrvid)
        .input('GodownId', model.GodownId)
        .input('IssueId', model.IssueId)
        .input('Isapproved', model.Isapproved)
        .input('IssueIDNewAll', model.IssueIDNewAll)
        .input('CompanyID', model.CompanyID)
        .execute('sp_InsertUpdateIssueReturnNote')
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
        .input('IiRetIssueND_ID', model.IiRetIssueND_ID)
        .input('RetIssuNo', model.RetIssuNo)
        .input('Itcode', model.Itcode)
        .input('Itname', model.Itname)
        .input('UnitCode', model.UnitCode)
        .input('RejQty', model.RejQty)
        .input('Remarks', model.Remarks)
        .input('GodownId', model.GodownId)
        .input('SrNoFrom', model.SrNoFrom)
        .input('SrNoTo', model.SrNoTo)
        .input('itRate', model.itRate)
        .input('TotAmt', model.TotAmt)
        .input('QtyReturn', model.QtyReturn)
        .input('cgs', model.cgs)
        .input('expdate', sql.DateTime, model.expdate)
        .input('RejQty1', model.RejQty1)
        .input('IssueIDNew', model.IssueIDNew)
        .input('CompanyID', model.CompanyID)
        .input('ProjectID', model.ProjectID)
        .execute('sp_InsertIssueReturnNoteDetail')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/DeleteDetail/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from IiRetIssueND where RetIssuNo="+Id;
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
    var query="delete from IiRetIssueND where RetIssuNo="+Id+"; delete from IiRetIssueNM where RetIssueNo="+Id+";";
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
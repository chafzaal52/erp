var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("MI worked properly");
});

router.get('/GetProductList/:itclass/:itstatus', function (req, res, next) {
    let itclass= req.params.itclass;
    let itstatus= req.params.itstatus;
    let query="exec sp_GetProductList "+itclass+","+itstatus+"";
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
router.get('/GetProductProfiler/:pos/:itcode', function (req, res, next) {
    let pos= req.params.pos;
    let itcode= req.params.itcode;
    let query="exec sp_GetProductProfilerReport "+pos+","+itcode
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
router.get('/GetBinCardReport/:pos/:posname/:itl1/:itl2/:itl3/:itl4/:ItCode/:datefrom/:dateto', function (req, res, next) {
    let pos= req.params.pos;
    let posname= req.params.posname;
    let itl1= req.params.itl1;
    let itl2= req.params.itl2;
    let itl3= req.params.itl3;
    let itl4= req.params.itl4;
    let ItCode= req.params.ItCode;
    let datefrom= req.params.datefrom;
    let dateto= req.params.dateto;
    let query="exec sp_GetBinCardReport "+pos+",'"+posname+"',"+itl1+","+itl2+","+itl3+","+itl4+","+ItCode+",'"+datefrom+"','"+dateto+"'";
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
router.get('/GetBinCardReportBatchWise/:pos/:posname/:itl1/:itl2/:itl3/:itl4/:ItCode/:datefrom/:dateto', function (req, res, next) {
    let pos= req.params.pos;
    let posname= req.params.posname;
    let itl1= req.params.itl1;
    let itl2= req.params.itl2;
    let itl3= req.params.itl3;
    let itl4= req.params.itl4;
    let ItCode= req.params.ItCode;
    let datefrom= req.params.datefrom;
    let dateto= req.params.dateto;
    let query="exec sp_GetBinCardBatchWiseReport "+pos+",'"+posname+"',"+itl1+","+itl2+","+itl3+","+itl4+","+ItCode+",'"+datefrom+"','"+dateto+"'";
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
router.get('/GetMINReport/:pos/:datefrom/:dateto/:MiNo/:itcode/:CompId/:ProjectID', function (req, res, next) {
    let pos= req.params.pos;
    let datefrom= req.params.datefrom;
    let dateto= req.params.dateto;
    let MiNo= req.params.MiNo;
    let itcode= req.params.itcode;
    let CompId= req.params.CompId;
    let ProjectID= req.params.ProjectID;
    let query=" SELECT  IM.Mir_Maxid,(select SiteNumber from SiteId where Maxid=id.ProjectID) as ProjectName,IM.maxno,IM.EntryDate,D.DeptCodeD,D.DeptName,IM.Location,P.Gname,IM.VoucherDate, IM.Cancel , i.ItCode, i.ItCoded, i.ItHead, ib.MearsuringUnitDescrp as UnitDescrp, iD.QtyOpening, iD.QtyReq, iD.QtyIssue ";
    query+=" from iIssueNoteM IM, iIssueNoteD ID, IBincard IB, IItems I, Sgodown P, Departments D ";
    query+=" where IM.IssueID = Id.IssueID and IM.PosId = ID.PosId and ID.ItCode = IB.ItCode and I.ItCode = ID.ItCode and IM.posid = P.Whno and IM.deptCode = d.deptCode And IM.Cancel = 0 ";
    query+=" and IM.CompanyId="+CompId+" ";
    if(datefrom!="null" && dateto !="null"){
    query+=" and IM.EntryDate between '"+datefrom+"' and '"+dateto+"' ";
    }
    if(pos!="null"){
    query+=" And P.Whno="+pos+" ";
    }
    if(MiNo!="null"){
    query+=" and IM.IssueID="+MiNo+" ";
    }
    if(ProjectID!="null"){
        query+=" and ID.ProjectID="+ProjectID+" ";
    }
    if(itcode!="null"){
    query+=" And id.ItCode in (Select ItCode From IITems Where ItL1 = "+itcode+" Or ItL2 = "+itcode+" Or ItL3 = "+itcode+" Or ItL4 = "+itcode+" )" ;
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
router.get('/GetMIProjectWiseReport/:pos/:datefrom/:dateto/:MiNo/:itcode/:CompId/:ProjectID', function (req, res, next) {
    let pos= req.params.pos;
    let datefrom= req.params.datefrom;
    let dateto= req.params.dateto;
    let MiNo= req.params.MiNo;
    let itcode= req.params.itcode;
    let CompId= req.params.CompId;
    let ProjectID= req.params.ProjectID;
    let query=" SELECT  IM.Mir_Maxid,(select SiteNumber from SiteId where Maxid=id.ProjectID) as ProjectName,IM.maxno,IM.EntryDate,D.DeptCodeD,D.DeptName,IM.Location,P.Gname,IM.VoucherDate, IM.Cancel , i.ItCode, i.ItCoded, i.ItHead, ib.MearsuringUnitDescrp as UnitDescrp, iD.QtyReq, iD.QtyIssue,iD.itRate,iD.TotAmt ,IB.BrandName,IB.LeastTime ModelNo";
    query+=" from iIssueNoteM IM, iIssueNoteD ID, IBincard IB, IItems I, Sgodown P, Departments D ";
    query+=" where IM.IssueID = Id.IssueID and IM.PosId = ID.PosId and ID.ItCode = IB.ItCode and I.ItCode = ID.ItCode and IM.posid = P.Whno and IM.deptCode = d.deptCode And IM.Cancel = 0 ";
    query+=" and IM.CompanyId="+CompId+" ";
    if(datefrom!="null" && dateto !="null"){
    query+=" and IM.EntryDate between '"+datefrom+"' and '"+dateto+"' ";
    }
    if(pos!="null"){
    query+=" And P.Whno="+pos+" ";
    }
    if(MiNo!="null"){
    query+=" and IM.IssueID="+MiNo+" ";
    }
    if(ProjectID!="null"){
        query+=" and ID.ProjectID="+ProjectID+" ";
    }
    if(itcode!="null"){
    query+=" And id.ItCode in (Select ItCode From IITems Where ItL1 = "+itcode+" Or ItL2 = "+itcode+" Or ItL3 = "+itcode+" Or ItL4 = "+itcode+" )" ;
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
router.get('/GetMIRReport/:pos/:datefrom/:dateto/:MirNo/:itcode/:CompId/:ProjectId', function (req, res, next) {
    let pos= req.params.pos;
    let datefrom= req.params.datefrom;
    let dateto= req.params.dateto;
    let MirNo= req.params.MirNo;
    let itcode= req.params.itcode;
    let CompId= req.params.CompId;
    let ProjectID= req.params.ProjectId;
    let query=" Select  IM.mirno,(select SiteNumber from SiteId where Maxid=id.ProjectID) as ProjectName,IM.EDate,IM.ProductDetail,D.DeptCodeD,IM.DeptCode,D.DeptName,IM.Comments,P.gName, IM.ReqType, ";
    query+=" Isnull((Select PlanNo from IProductionPlanM where maxid = IM.ProdPlanId and PosId = IM.PosId and Fyear = IM.Fyear),0) ProdPlanId,IM.BatchNo,IM.BatchSize,IM.Cancel, ";
    query+=" IM.Closed,i.itcode, i.ItCoded , i.ItHead, ib.MearsuringUnitDescrp as UnitDescrp, iD.CurrQty, iD.ReqQty, iD.Remarks ";
    query+=" From IMaterialReqM IM, IMaterialReqD ID, IBincard IB, IItems I, Sgodown P, Departments D ";
    query+=" Where IM.MaxId = Id.MaxId and IM.PosId = ID.PosId and ID.ItCode = IB.ItCode and I.ItCode = ID.ItCode and IM.posid = P.Whno and IM.DeptCode = D.DeptCode and IM.Cancel = 0 and IM.Closed = 0 ";
    query+=" and IM.CompanyID="+CompId+" ";
    if(datefrom!="null" && dateto !="null"){
    query+=" and IM.edate between '"+datefrom+"' and '"+dateto+"' ";
    }
    if(pos!="null"){
    query+=" And IM.posid="+pos+" ";
    }
    if(MirNo!="null"){
    query+=" and IM.maxid="+MirNo+" ";
    }
    if(ProjectID!="null"){
        query+=" and ID.ProjectID="+ProjectID+" ";
    }
    if(itcode!="null"){
    query+=" And id.ItCode in (Select ItCode From IITems Where ItL1 = "+itcode+" Or ItL2 = "+itcode+" Or ItL3 = "+itcode+" Or ItL4 = "+itcode+" )";
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
module.exports = router;
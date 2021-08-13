var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Stock in hand summary report worked");
});

router.get('/Report/:DateFrom/:DateTo/:POSID/:InvoiceNo/:ProjectID/:ItCode/:CompanyID/:BrandID', function (req, res, next) {
    let DateFrom= req.params.DateFrom;
    let DateTo= req.params.DateTo;
    let POSID= req.params.POSID;
    let InvoiceNo= req.params.InvoiceNo;
    let ProjectID= req.params.ProjectID;
    let ItCode= req.params.ItCode;
    let CompanyID= req.params.CompanyID;
    let BrandID= req.params.BrandID;
    let query=" select m.maxno,pro.SiteNumber ProjectName,po.GName,dep.DeptName,m.IDate,m.fyear,m.Job,m.Remarks,RetType as ReturnType, ";
    query+=" ii.ItCodeD,ii.ItHead,ib.MearsuringUnitDescrp,d.QtyReturn,d.itRate,d.TotAmt,ib.BrandName,ib.LeastTime ModelNo ";
    query+=" from IiRetIssueNM m ";
    query+=" left join IiRetIssueND d on d.RetIssuNo=m.RetIssueNo ";
    query+=" left join Departments dep on m.DeptCode=dep.DeptCode ";
    query+=" left join SGodown po on m.GodownId=po.Whno ";
    query+=" left join IItems ii on ii.ItCode=d.Itcode ";
    query+=" left join IBinCard ib on ib.ItCode=d.Itcode ";
    query+=" left join SiteId pro on pro.Maxid=d.ProjectID ";
    query+=" where m.CompanyId="+CompanyID+" ";
    if(POSID!="null"){
    query+=" and m.GodownId="+POSID+" ";
    }
    if(ItCode!="null"){
    query+=" and (ii.ITL1="+ItCode+" or ii.Itl2="+ItCode+" or ii.Itl3="+ItCode+" or ii.Itl4="+ItCode+" or ii.Itl5="+ItCode+" or ii.Itl6="+ItCode+") ";
    }
    if(BrandID!="null"){
    query+=" and ib.Mid= "+BrandID+" ";
    }
    if(ProjectID!="null"){
    query+=" and d.ProjectID="+ProjectID+" ";
    }
    if(InvoiceNo!="null"){
        query+=" and m.RetIssueNo="+InvoiceNo+" ";
    }
    query+=" and m.IDate between '"+DateFrom+"' and '"+DateTo+"' ";
    
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
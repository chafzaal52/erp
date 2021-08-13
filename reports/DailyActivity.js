var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Daily Activity report worked");
});

router.get('/ACInReport/:DateFrom/:DateTo/:BrandID/:SCode/:ItCode/:CompanyID/:ProjectID', function (req, res, next) {
    let DateFrom= req.params.DateFrom;
    let DateTo= req.params.DateTo;
    let BrandID= req.params.BrandID;
    let SCode= req.params.SCode;
    let ItCode= req.params.ItCode;
    let CompanyID= req.params.CompanyID;
    let ProjectID= req.params.ProjectID;
    let query=" select * from( ";
    query+=" select m.GDate ACDate,m.MaxNo InvoiceNo,ibin.BrandName,m.PartyName,m.Remarks Reference,ii.ItHead ItName,d.AppQty Qty,ibin.LeastTime ModelNo from IGRNM m  ";
    query+=" inner join IGRND d on d.GRNID=m.GRNID  ";
    query+=" inner join IItems ii on ii.ItCode=d.ItCode  ";
    query+=" inner join IBinCard ibin on ibin.Itcode=d.ItCode  ";
    query+=" where m.CancelStatus=0 and m.CompanyID="+CompanyID+" ";
    query+=" and m.GDate between '"+DateFrom+"' and '"+DateTo+"'  ";
    if(SCode!="null"){
    query+=" and m.SCode="+SCode+" ";
    }
    if(BrandID!="null"){
    query+=" and ibin.Mid="+BrandID+" ";
    }
    if(ItCode!="null"){
    query+=" and (ii.ITL1="+ItCode+" or ii.itl2="+ItCode+" or ii.itl3="+ItCode+" or ii.itl4="+ItCode+" or ii.itl5="+ItCode+" or ii.itl6="+ItCode+")  ";
    }
    query+=" union all  ";
    query+=" select m.IDate ACDate,cast('IRN-'+m.maxno as varchar) InvoiceNo,ibin.BrandName,(select SiteNumber from SiteId where Maxid=d.ProjectID) PartyName ";
    query+=" ,m.Remarks Reference,d.Itname ItName,d.QtyReturn Qty,ibin.LeastTime ModelNo from IiRetIssueNM m ";
    query+=" inner join IiRetIssueND d on d.RetIssuNo=m.RetIssueNo  ";
    query+=" inner join IItems ii on ii.ItCode=d.ItCode  ";
    query+=" inner join IBinCard ibin on ibin.Itcode=d.Itcode  ";
    query+=" where m.CompanyID="+CompanyID+" ";
    query+=" and m.IDate between '"+DateFrom+"' and '"+DateTo+"' ";
    if(ProjectID!="null"){
    query+=" and d.ProjectID="+ProjectID+" ";
    }
    if(BrandID!="null"){
    query+=" and ibin.Mid="+BrandID+" ";
    }
    if(ItCode!="null"){
    query+=" and (ii.ITL1="+ItCode+" or ii.itl2="+ItCode+" or ii.itl3="+ItCode+" or ii.itl4="+ItCode+" or ii.itl5="+ItCode+" or ii.itl6="+ItCode+")  ";
    }
    query+=" ) t ";
    query+=" order by t.ACDate ";
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
router.get('/ACOutReport/:DateFrom/:DateTo/:BrandID/:SCode/:ItCode/:CompanyID/:Branded', function (req, res, next) {
    let DateFrom= req.params.DateFrom;
    let DateTo= req.params.DateTo;
    let BrandID= req.params.BrandID;
    let SCode= req.params.SCode;
    let ItCode= req.params.ItCode;
    let CompanyID= req.params.CompanyID;
    let Branded= req.params.Branded;
    let query="";
    if(SCode=="null"){
    if(Branded=="True")
    {
    query+=" SELECT im.IDate as ACDate,im.maxno InvoiceNo,ibin.BrandName,p.SiteNumber PartyName,im.Location Reference,ii.ItHead ItName,id.QtyIssue Qty,ibin.LeastTime ModelNo ";
    query+=" FROM iIssueNoteM im ";
    query+=" inner join IissueNoteD id on id.IssueId=im.IssueID ";
    query+=" inner join IItems ii on ii.ItCode=id.ItCode ";
    query+=" inner join SiteId p on p.Maxid=id.ProjectID ";
    query+=" inner join IBinCard ibin on ibin.Itcode=id.ItCode ";
    query+=" where im.CompanyID="+CompanyID+" and im.IDate between '"+DateFrom+"' and '"+DateTo+"' ";
    if(BrandID!="null"){
    query+=" and ibin.Mid="+BrandID+" ";
    }
    if(ItCode!="null"){
    query+=" and (ii.ITL1="+ItCode+" or ii.itl2="+ItCode+" or ii.itl3="+ItCode+" or ii.itl4="+ItCode+" or ii.itl5="+ItCode+" or ii.itl6="+ItCode+") ";
    }
    query+=" and isnull(ibin.BrandName,'')!='' ";
    query+=" UNION ALL ";
    }
    }
    query+=" SELECT dm.Edate as ACDate,dm.Ord_No InvoiceNo,ibin.BrandName,v.VenderName PartyName,dm.Comments Reference,ii.ItHead ItName,dd.St_CurShiped Qty,ibin.LeastTime ModelNo ";
    query+=" FROM Ord_Ship_M dm ";
    query+=" inner join Ord_Ship_D dd on dd.Ord_id=dm.Ord_id ";
    query+=" inner join IItems ii on ii.ItCode=dd.ItCode ";
    query+=" inner join UVendorsDefM v on v.VenderId=dm.BuyerCode ";
    query+=" inner join IBinCard ibin on ibin.Itcode=dd.ItCode ";
    query+=" where dm.CompanyID="+CompanyID+" and dm.Edate between '"+DateFrom+"' and '"+DateTo+"' ";
    if(SCode!="null"){
    query+=" and dm.BuyerCode="+SCode+" ";
    }
    if(BrandID!="null"){
    query+=" and ibin.Mid="+BrandID+" ";
    }
    if(ItCode!="null"){
    query+=" and (ii.ITL1="+ItCode+" or ii.itl2="+ItCode+" or ii.itl3="+ItCode+" or ii.itl4="+ItCode+" or ii.itl5="+ItCode+" or ii.itl6="+ItCode+") ";
    }
    query+=" ORDER BY ACDate; ";
    
    
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
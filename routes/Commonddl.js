var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Common DDL Work properly");
});

//Business Unit
router.get('/GetLocationDDL/:CompanyID/:UserId', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let UserId= req.params.UserId;
    let query="select ID,OfficeName,CompanyId from GetLocation where CompanyID="+CompanyID+" and UserId="+UserId;
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
//Material Issue DDL
router.get('/GetMaterialIssueDDL/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="select IssueID,maxno ,isnull((select DeptName from Departments where DeptCode=iIssueNoteM.DeptCode),'') DeptName from iIssueNoteM where CompanyID="+CompanyID;
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
//Departments or Cost Center
router.get('/GetDepartmentDDL/:CompanyID/:UserId', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let UserId= req.params.UserId;
    let query="select dep.Deptcode,dep.DeptCodeD,dep.DeptName from Departments dep,DepartmentUsers us where dep.DeptStatus=1 and dep.DeptCode=us.Deptcode and us.UserId="+UserId+" and dep.CompanyId="+CompanyID;
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
//Store 
router.get('/GetStoreDDL/:CompanyID/:UserId', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let UserId= req.params.UserId;
    let query="select s.Storeid,s.StoreCode,s.StoreName from Storedef s,StoreUsers u where s.Storeid=u.StoreCode and u.UserId="+UserId+" and s.CompanyId="+CompanyID;
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
//Vendor DDL 
router.get('/GetVendorDDL/:CompanyID/:POSID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let POSID= req.params.POSID;
    let query="select VenderId ID, VCode Code, VenderName Name from UVendorsDefM where CompanyID="+CompanyID+" and GodownId="+POSID;
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
//All Vendor DDL 
router.get('/GetAllVendorDDL/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="select VenderId ID, VCode Code, VenderName Name from UVendorsDefM where CompanyID="+CompanyID;
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
//Purchase Order DDL 
router.get('/GetPODDL/:CompanyID/', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="exec sp_GetPurchaseOrderForGRN "+CompanyID;
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
//GL Detail Accounts
router.get('/GetGLAccountDDL/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="select ACNO, AcNoD, ACHEAD from ACLIST where ACSTATUS=1 and CompanyId="+CompanyID+" order by AcNoD";
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
//Items
router.get('/GetitemsDDL/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="select ItCode as ID, ItCodeD as Code, ItHead as Name from IItems where ItStatus=1 and CompanyId="+CompanyID+" order by Code";
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
router.get('/GetitemsHeadDDL/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="select ItCode as ID, ItCodeD as Code, ItHead as Name from IItems where ItStatus=0 and CompanyId="+CompanyID+" order by Code";
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
router.get('/GetItemTextbox/:CompanyID/:ItemSearch/:Brand', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let ItemSearch=req.params.ItemSearch;
    let Brand=req.params.Brand;
    let query="select top(20)ii.ItCode,ii.ItCodeD,ii.ItHead,ib.BrandName,ib.LeastTime as ModelNo,ib.ColorName from IItems ii, IBinCard ib where ii.ItCode=ib.Itcode and ii.ItStatus=1 and ii.CompanyId="+CompanyID+" ";
    if(ItemSearch!="NNN"){
    query+=" and (ii.ItCodeD like '%"+ItemSearch+"%' or ii.ItHead like '%"+ItemSearch+"%' or ib.LeastTime like '%"+ItemSearch+"%' or ib.ColorName like '%"+ItemSearch+"%') ";
}
if(Brand!="NNN"){
    query+=" and ib.BrandName like '%"+Brand+"%' ";
}
    query +=" order by ii.ItCodeD";
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
router.get('/GetItemTextboxMstDetail/:CompanyID/:ItemSearch/:Brand', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let ItemSearch=req.params.ItemSearch;
    let Brand=req.params.Brand;
    let query="select top(20)ii.ItCode,ii.ItCodeD,ii.ItHead,ib.BrandName,ib.LeastTime as ModelNo,ib.ColorName from IItems ii left join IBinCard ib on ib.Itcode=ii.ItCode and ii.CompanyId="+CompanyID+" ";
    if(ItemSearch!="NNN"){
    query+=" and (ii.ItCodeD like '%"+ItemSearch+"%' or ii.ItHead like '%"+ItemSearch+"%' or ib.LeastTime like '%"+ItemSearch+"%' or ib.ColorName like '%"+ItemSearch+"%') ";
}
if(Brand!="NNN"){
    query+=" and ib.BrandName like '%"+Brand+"%' ";
}
    query +=" order by ii.ItCodeD";
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
router.get('/BankAClst/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="exec sp_BankAClst "+CompanyID;
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
router.get('/GetItemUnitByID/:ItemID', function (req, res, next) {
    let ItemID= req.params.ItemID;
    let query="exec dbSp_BinCard_FetchItemRec "+ItemID;
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

router.get('/GetItemUnitBrandByID/:ItemID', function (req, res, next) {
    let ItemID= req.params.ItemID;
    let query="select ii.ItCode,ii.ItCodeD,ii.ItHead,u.UnitCode,u.UnitDescrp,m.Mid,m.Name as BrandName from IItems ii, IBinCard ib, IMearsuringUnits u, Manufacturs m where ii.ItCode=ib.Itcode and ib.UnitCode=u.ID and ib.Mid=m.Mid and ii.ItCode="+ItemID;
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

router.get('/GetUsersDDL/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="select ID, FirstName +' '+isnull(LastName,'') as FullName from Users where CompanyID="+CompanyID;
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
router.get('/GetUSupplierDDL/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="Select SCode,PartyCode,sName SupplierName,acno from Usuppliers where isnull(typeid,0) >= 0 and IsActive=1 and CompanyID="+CompanyID;
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

router.get('/GetProjectDefDDL/:CompanyID/:POSID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let POSID= req.params.POSID;
    let query="select Maxid , SiteNumber from siteid where blocked = 0 and Status = 1 and CompanyID= "+CompanyID+" and posid = "+POSID+"  order by 1";
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
//Current Stock of Item
router.get('/dbsp_TotalWh/:ItCode/:CurrDate/:LocationID', function (req, res, next) {
    let ItCode= req.params.ItCode;
    let CurrDate= req.params.CurrDate;
    let LocationID= req.params.LocationID;
    let query="exec dbsp_TotalWh "+ItCode+",'"+CurrDate+"',"+LocationID;
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
//Current Item Rate
router.get('/GetAvgRatePOSWiseFIFO/:ItCode/:POSID/:Batch/:IssueQty/:currDate', function (req, res, next) {
    let ItCode= req.params.ItCode;
    let POSID= req.params.POSID;
    let Batch= req.params.Batch;
    let IssueQty= req.params.IssueQty;
    let currDate= req.params.currDate;
    let query="";
    if(Batch!="null"){
    query="select dbo.GetAvgRatePOSWiseFIFO("+ItCode+","+POSID+",'"+Batch+"',"+IssueQty+",'"+currDate+"') as ItemRate";
    }
    else{
        query="select dbo.GetAvgRatePOSWiseFIFO("+ItCode+","+POSID+",'',"+IssueQty+",'"+currDate+"') as ItemRate";
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
//Sales Order Company Wise
router.get('/GetSalesOrderDDL/:CompanyID/:IsPro', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let IsPro= req.params.IsPro;
    let query="";
    if(IsPro=="null"){
        query="select m.S_Ord_id,m.orderno,c.VenderName from SOrd_M m,UVendorsDefM c where m.BuyerCode=c.VenderId and ISNULL(m.isClosed,0)=0 and ISNULL(m.CancelStatus,0)=0 and m.CompanyId="+CompanyID;
    }
    else{
    query="select m.S_Ord_id,m.orderno,c.VenderName from SOrd_M m,UVendorsDefM c where m.BuyerCode=c.VenderId and isnull(m.is_Proceed,0)="+IsPro+" and ISNULL(m.isClosed,0)=0 and ISNULL(m.CancelStatus,0)=0 and m.CompanyId="+CompanyID;
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
router.get('/GetAdjustmentReasonDDL/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="select s.SalesID,s.SalesDesc,s.Acno,ac.AcNoD,ac.ACHEAD from SalesTypes1 s,ACLIST ac where s.Acno=ac.ACNO and s.CompanyId="+CompanyID;
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
router.get('/GetDeliveryChallanDDL/:CompanyID/:POSID/:getType', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let POSID= req.params.POSID;
    let getType= req.params.getType;
    let query="select m.Ord_id,m.Ord_No,c.VenderName from Ord_Ship_M m,UVendorsDefM c where m.BuyerCode=c.VenderId and m.CompanyId="+CompanyID+" and m.posid="+POSID+" ";
    if(getType=="Create"){
        query+=" and isnull(m.inv_Done,0)=0";
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
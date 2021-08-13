var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("IItems work properly");
});


router.get('/GetList/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="select * from IItems where CompanyID="+CompanyID;
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
router.get('/GetShortList/:CompanyID/:Search', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let Search= req.params.Search;
    //let query="exec sp_iitemlistCompanywise "+CompanyID;
    let query="select top(100)ii.ItCode,ii.ItCodeD,ii.ItHead, isnull((select Name from Manufacturs where Mid=ib.MID),'') as BrandName,isnull((select Description from ucolor where ID=ib.ColorCode),'') as ColorName, ";
    query+=" ii.Picture,isnull((select Name from ItemTypeN where id=ib.ItemType),'') as TypeName,ii.IsActive,isnull(ib.LeastTime,'') as ExItemCode ";
    query+=" from IItems ii ";
    query+=" left join IBinCard ib on ib.Itcode=ii.ItCode ";
    query+=" where ii.CompanyId="+CompanyID+" ";
    if(Search!="null"){
    query+=" and (ii.ItCodeD like '%"+Search+"%' or ItHead like '%"+Search+"%' or BrandName like '%"+Search+"%' or ColorName like '%"+Search+"%') ";
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
router.get('/GetById/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="select *  from IItems where ItCode="+Id+";";
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
   router.get('/GetByItCodeD/:CompanyID/:ItCodeD', function (req, res, next) {
    var CompanyID= req.params.CompanyID;
    var ItCodeD= req.params.ItCodeD;
    var query="select *  from IItems where CompanyId="+CompanyID+" and ItCodeD='"+ItCodeD+"';";
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
   router.get('/GetByGL/:ITL1/:Itl2/:Itl3', function (req, res, next) {
    var ITL1= req.params.ITL1;
    var Itl2= req.params.Itl2;
    var Itl3= req.params.Itl3;
    var query="select * from IItems where ITL1="+ITL1+" and Itl2="+Itl2+" and Itl3="+Itl3+" and isnull(Itl4,0)=0 and isnull(Itl5,0)=0";
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
        .input('ID', model.ItCode)
        .input('ItCodeD', model.ItCodeD)
        .input('ITL1', model.ITL1)
        .input('Itl2', model.Itl2)
        .input('Itl3', model.Itl3)
        .input('Itl4', model.Itl4)
        .input('Itl5', model.Itl5)
        .input('Itl6', model.Itl6)
        .input('ItP1', model.ItP1)
        .input('Itp2', model.Itp2)
        .input('Itp3', model.Itp3)
        .input('Itp4', model.Itp4)
        .input('Itp5', model.Itp5)
        .input('Itp6', model.Itp6)
        .input('ItHead', model.ItHead)
        .input('ItLevel', model.ItLevel)
        .input('ItParent', model.ItParent)
        .input('ItStatus', model.ItStatus)
        .input('ItClass', model.ItClass)
        .input('Acno', model.Acno)
        .input('budgetedcost', model.budgetedcost)
        .input('iscritical', model.iscritical)
        .input('isdisabled', model.isdisabled)
        .input('isWaranty', model.isWaranty)
        .input('CompWaranty', model.CompWaranty)
        .input('SupWaranty', model.SupWaranty)
        .input('AcNoIssue', model.AcNoIssue)
        .input('ItHeadUrdu', model.ItHeadUrdu)
        .input('MasterItem', model.MasterItem)
        .input('CompanyId', model.CompanyId)
        .input('POSID', model.POSID)
        .input('CreatedBy', model.CreatedBy)
        .input('CreatedDate', sql.DateTime, model.CreatedDate)
        .input('UpdatedBy', model.UpdatedBy)
        .input('UpdatedDate', sql.DateTime, model.UpdatedDate)
        .input('Picture', model.Picture)
        .input('IsActive', model.IsActive)
        .input('enthanolVal', model.enthanolVal)
        .input('WFlag', model.WFlag)
        .execute('sp_InsertUpdateIItem')
    }).then(result => {
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    var Id= req.params.Id;
    let query=" delete from ItemPOS  where ItCode="+Id+"; ";
    query +=" delete from CRM_Services_D where Service_ID=(select Service_ID from CRM_Services_M where ItemCode="+Id+"); ";
    query +=" delete from CRM_Services_M where ItemCode="+Id+"; ";
    query +=" delete from IBinCardD where Itcode="+Id+"; ";
    query +=" delete from IBinCard where Itcode="+Id+"; ";
    query +=" delete from IItems where ItCode="+Id+"; ";
    query +="delete from POSSerialQty where ItCode="+Id+"; ";
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
/////////////////////POS List Save////////////////////
router.get('/GetPOSList/:CompanyID/:ItCode', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let ItCode= req.params.ItCode;
    let query="select * from ItemPOS where CompanyID="+CompanyID+" and ItCode="+ItCode;
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
   router.get('/POSListSave/:ItCode/:Posid/:CompanyID', function (req, res, next) {
    var ItCode= req.params.ItCode;
    var Posid= req.params.Posid;
    var CompanyID= req.params.CompanyID;
    let query="INSERT INTO [dbo].[ItemPOS]([ItCode],[Posid],[CompanyID])VALUES("+ItCode+","+Posid+","+CompanyID+")";
    sql.connect(config).then(function (connection) {   
    new sql.Request(connection)
                    .query(query)
                    .then(function (dbData) {
                        res.send("Success.");
                    })
                    .catch(function (error) {
                      response.send(error);
                    })
    })
    .catch(function(err){
        response.send(err);     
    })
});
router.delete('/POSListDelete/:CompanyID/:ItCode', function (req, res, next) {
    let ItCode= req.params.ItCode;
    let CompanyID= req.params.CompanyID;
    let query="delete from ItemPOS where CompanyID="+CompanyID+" and ItCode="+ItCode+";";
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
////////////////////////IItems Other Functions//////////////////////////
router.get('/GetNextIItems2/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="exec GetNextIItems2 "+CompanyID;
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
router.get('/GetSameIItems22/:ID', function (req, res, next) {
    let ID= req.params.ID;
    let query="exec GetSameIItems22 "+ID;
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
router.get('/GetSameIItems23/:ID', function (req, res, next) {
    let ID= req.params.ID;
    let query="exec GetSameIItems23 "+ID;
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
router.get('/GetSameIItems24/:ID', function (req, res, next) {
    let ID= req.params.ID;
    let query="exec GetSameIItems24 "+ID;
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
router.get('/GetNextIItems22/:ID', function (req, res, next) {
    let ID= req.params.ID;
    let query="exec GetNextIItems22 "+ID;
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
router.get('/GetNextIItems23/:ID', function (req, res, next) {
    let ID= req.params.ID;
    let query="exec GetNextIItems23 "+ID;
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
router.get('/GetNextIItems24/:ID', function (req, res, next) {
    let ID= req.params.ID;
    let query="exec GetNextIItems24 "+ID;
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
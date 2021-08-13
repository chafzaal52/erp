var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Quotation Entry Work properly");
});

router.get('/GetMaxNo/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    var query=" select isnull(MAX(maxno),0) maxno from Bid_m where CompanyID="+CompanyID;
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
   router.get('/AlreadyExist/:CompanyID/:maxno', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let maxno= req.params.maxno;
    var query="select isnull(count(maxno),0) maxno from Bid_m where maxno="+maxno+" and CompanyID="+CompanyID;
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
router.get('/GetList/:CompanyID/:Search', function (req, res, next) {
    var CompanyID= req.params.CompanyID;
    var Search= req.params.Search;
    let query="select top(80)m.S_Ord_Id,m.maxno,m.SOrdDate,m.Fyear,isnull((select GName from SGodown where Whno=m.Posid),'')GName,v.VenderName,s.SalesDesc  ";
    query+=" from Bid_m m ";
    query+=" left join UVendorsDefM v on v.VenderId=m.BuyerCode ";
    query+=" left join SalesTypes s  on s.SalesID=m.SaleTypeID ";
    query+=" where  m.CompanyID="+CompanyID+" ";
    if(Search!="null"){
    query+=" and (m.maxno like '%"+Search+"%' or v.VenderName like '%"+Search+"%' or s.SalesDesc like '%"+Search+"%')  ";
    }
    query+=" order by m.S_Ord_Id desc";
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
    var query="select *  from Bid_m where S_Ord_Id="+Id+";";
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
    var query="select *  from Bid_D where S_Ord_Id="+Id+";";
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
        .input('S_Ord_id', model.S_Ord_id)
        .input('maxno', model.maxno)
        .input('Posid', model.Posid)
        .input('SOrdDate', sql.DateTime, model.SOrdDate)
        .input('BuyerCode', model.BuyerCode)
        .input('BidNo', model.BidNo)
        .input('Fyear', model.Fyear)
        .input('is_Proceed', model.is_Proceed)
        .input('CancelStatus', model.CancelStatus)
        .input('UserId', model.UserId)
        .input('PaymentTerm', model.PaymentTerm)
        .input('isTaxable', model.isTaxable)
        .input('Approved', model.Approved)
        .input('Adv_Payment', model.Adv_Payment)
        .input('isClosed', model.isClosed)
        .input('DOF_No', model.DOF_No)
        .input('isWHT', model.isWHT)
        .input('Comments', model.Comments)
        .input('Adj_Amount', model.Adj_Amount)
        .input('SaleTypeID', model.SaleTypeID)
        .input('ISRawSale', model.ISRawSale)
        .input('CompanyID', model.CompanyID)
        .input('CustomerName', model.CustomerName)
        .execute('sp_InsertUpdateBid_M')
    }).then(result => {
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.post('/InsertDetail', function (req, res, next) {
    var model= req.body;
    sql.connect(config).then(response => {
        return response.request()
        .input('S_Ord_id', model.S_Ord_id)
        .input('Posid', model.Posid)
        .input('Itcode', model.Itcode)
        .input('ItName', model.ItName)
        .input('ItCodeD', model.ItCodeD)
        .input('UnitName', model.UnitName)
        .input('Qty', model.Qty)
        .input('Rate', model.Rate)
        .input('Amounts', model.Amounts)
        .input('Disc', model.Disc)
        .input('DiscAmt', model.DiscAmt)
        .input('STax', model.STax)
        .input('AdiTax', model.AdiTax)
        .input('NetAmt', model.NetAmt)
        .input('Remks', model.Remks)
        .input('Rec_Ord', model.Rec_Ord)
        .input('rate_Change', model.rate_Change)
        .input('S_Bonus', model.S_Bonus)
        .input('SP_Bonus', model.SP_Bonus)
        .input('Sp_disc_rate', model.Sp_disc_rate)
        .input('Sp_disc_Amt', model.Sp_disc_Amt)
        .input('CompanyID', model.CompanyID)
        .input('Particulars', model.Particulars)
        .execute('sp_InsertBid_D')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/DeleteDetail/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from Bid_D where S_Ord_Id="+Id+";";
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
    var Id= req.params.Id;
    var query="delete from Bid_D where S_Ord_Id="+Id+"; delete from Bid_m where S_Ord_Id="+Id+";";
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
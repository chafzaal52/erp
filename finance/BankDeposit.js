var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("i am works properly");
});


router.get('/GetList/:CompanyId', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let query="select * from BankDepositM where CompanyID="+CompanyId+";";
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
    var query="select *  from BankDepositM where ID="+Id+";";
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
    let Id= req.params.Id;
    var query="select *  from BankDepositD where MaxCode="+Id+";";
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
        .input('ID', model.ID)
        .input('MaxCode', model.MaxCode)
        .input('DepositSlipNo', model.DepositSlipNo)
        .input('DepositDate',sql.DateTime, model.DepositDate)
        .input('TillDate',sql.DateTime, model.TillDate)
        .input('BankCode', model.BankCode)
        .input('DepositedBy', model.DepositedBy)
        .input('BankId', model.BankId)
        .input('CityId', model.CityId)
        .input('NoOfCheque', model.NoOfCheque)
        .input('DepositedAmount', model.DepositedAmount)
        .input('Comments', model.Comments)
        .input('UserId', model.UserId)
        .input('FYear', model.FYear)
        .input('Banks', model.Banks)
        .input('Cities', model.Cities)
        .input('BankSelect', model.BankSelect)
        .input('CitySelect', model.CitySelect)
        .input('BMaxCode', model.BMaxCode)
        .input('BComment', model.BComment)
        .input('BounceDate',sql.DateTime, model.BounceDate)
        .input('BUserId', model.BUserId)
        .input('POSID', model.POSID)
        .input('CompanyID', model.CompanyID)
        .execute('sp_InsertUpdateBankDeposit')
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
        .input('MaxCode', model.MaxCode)
        .input('CSafID', model.CSafID)
        .input('ChequeNo', model.ChequeNo)
        .input('IsDepisited', model.IsDepisited)
        .input('IsBounced', model.IsBounced)
        .input('BMaxCode', model.BMaxCode)
        .input('BHistory', model.BHistory)
        .input('BComments', model.BComments)
        .input('RealizeDate', sql.DateTime, model.RealizeDate)
        .input('POSID', model.POSID)
        .input('ACNo', model.ACNo)
        .input('ACHead', model.ACHead)
        .input('JRVID', model.JRVID)
        .input('VoucherNo', model.VoucherNo)
        .execute('sp_InsertRecoveryRecordDetail')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.get('/GetPaymentParty/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="exec sp_BankDepositD "+CompanyID+";"
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

router.delete('/DetailDelete/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from BankDepositD where ID="+Id+";";
    sql.connect(config).then(function (connection) {   
    new sql.Request(connection)
                    .query(query)
                    .then(function (dbData) {
                        res.send("Detail Delete Successfull.");
                    })
                    .catch(function (error) {
                      response.send(error);
                    })
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from BankDepositD where MaxCode="+Id+"; delete from BankDepositM where ID="+Id+";";
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
router.get('/GetPaymentRecord/:CompanyID/:Date1/:Date2', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let Date1= req.params.Date1;
    let Date2= req.params.Date2;
    let query = "Select ChequeDetailM.CSafNo, FranchId FranchiseCode  , ChequeDate, ChequeNo, ChqAmount, isnull(ChequeDetailD.BankName,'')BankName , ";
    query += "case when ChequeDetailM.ContractNo = '' then isnull((select top 1 VenderName from UVendorsDefM where UVendorsDefM.VenderId = ChequeDetailD.vcode),'') else ChequeDetailM.ContractNo  end ContractId,";// ChqAmount,
    query += "case when  ChequeDetailD.vcode <> 0  then  isnull((select CitiesName from UCities where UCities.CitiesCode = isnull((select top 1 CityID from ClientDetails where ClientDetails.ID = ChequeDetailD.vcode),0) ),'') ";
    query += "else isnull((select CitiesName from UCities where ChequeDetailD.CityId = UCities.CitiesCode  ),'')end CitiesName From  ChequeDetailM, ChequeDetailD  ";
    query += "left outer join RcBank on ChequeDetailD.BankId = RcBank.BankId  ";
    query += "Where ChequeDetailM.ChDtlId = ChequeDetailD.ChDtlId And ChequeDetailM.POSId = ChequeDetailD.POSId ";
    query += "And ChequeDetailD.ChequeNo Not In (Select ChequeNo From BankDepositD Where IsBounced In (0,3,5,6,9)  And BankDepositD.CSafID = ChequeDetailM.CSafID) And ChequeDetailD.CompanyID="+ CompanyID + " ";// and
    //query += "ChequeDate <= '"+Date1+ "' and ChequeDate > '" +Date2+ "'  Order By ChequeDetailM.CSafNo, ChequeNo, ChequeDate";
    query += "  Order By ChequeDetailM.CSafNo, ChequeNo, ChequeDate";

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
router.get('/GetDepopsitList/:CompanyID/:Date/:bankname/:cityname/', function (req, res, next) {
        let CompanyID= req.params.CompanyID;
         let Date= req.params.Date;
         let bankname= req.params.bankname;
         let cityname= req.params.cityname;
         let query = "Select ChequeDetailM.CSafNo,  FranchId FranchiseCode  , ChequeDate, ChequeNo, ChqAmount, isnull(ChequeDetailD.BankName,'')BankName, ";
         query += "case when ChequeDetailD.vcode <> 0 then isnull((select CitiesName from UCities where UCities.CitiesCode = isnull((select top 1 CityID from ClientDetails where ClientDetails.ID = ChequeDetailD.vcode),0) ),'') ";
         query += "else isnull((select CitiesName from UCities where ChequeDetailD.CityId = UCities.CitiesCode  ),'')end CitiesName,  ";//ChqAmount,
         query += "case ";
         query += "when ChequeDetailM.ContractNo = '' then isnull((select top 1 VenderName from UVendorsDefM where UVendorsDefM.VenderId = ChequeDetailD.vcode),'') ";
         query += "else ChequeDetailM.ContractNo end ContractId From  ChequeDetailM, ChequeDetailD left outer join RcBank on ChequeDetailD.BankId = RcBank.BankId ";
         query += "Where ChequeDetailM.ChDtlId = ChequeDetailD.ChDtlId And ChequeDetailM.POSId = ChequeDetailD.POSId   And ";
         query += "ChequeDetailD.ChequeNo Not In(Select ChequeNo From BankDepositD Where IsBounced In(0, 3, 5, 6, 9)  And BankDepositD.CSafID = ChequeDetailM.CSafID)  And ChequeDetailM.CompanyID=" + CompanyID + " And ChequeDetailD.CompanyID=" + CompanyID+" And ";
         query += "ChequeDate <= '" + Date+ "' ";
         if (bankname!="null") {
            query += "And ChequeDetailD.BankId In (Select BankId From RCBank Where BankName In('"+ bankname+"') ) ";
     }
     if (cityname!="null")
     {
        query += "And ChequeDetailD.CityId In (Select CitiesCode From UCities Where CitiesName In('"+cityname+"')) ";
     }
     query += " Order By ChequeDetailM.CSafNo, ChequeNo, ChequeDate ";
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
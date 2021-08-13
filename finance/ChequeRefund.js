var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("i am works properly");
});

router.get('/ChequeRefundlst/:Date', function (req, res, next) {
    let Date= req.params.Date;
    let query = "Select Distinct ChequeDetailM.CSafNo,ChequeDetailM.CSafID,  FranchId FranchiseCode  , ChequeDate, ChequeNo, ChqAmount, isnull(ChequeDetailD.BankName,'')BankName,   ";
            query += "case when ChequeDetailD.vcode <> 0 then isnull((select CitiesName from UCities where UCities.CitiesCode = isnull((select top 1 ID ";
            query += "from ClientDetails where ClientDetails.ID = ChequeDetailD.vcode),0) ),'') else isnull((select CitiesName from UCities where ChequeDetailD.CityId = UCities.CitiesCode  ),'')end ";
            query += "CitiesName, ChqAmount,  case when ChequeDetailM.ContractNo = '' then isnull((select top 1 Name from ClientDetails where ClientDetails.ID = ChequeDetailD.vcode),'')  ";
            query += "else ChequeDetailM.ContractNo end ContractId From  ChequeDetailM, ChequeDetailD left outer join RcBank on ChequeDetailD.BankId = RcBank.BankId ";
            query += "Where ChequeDetailM.ChDtlId = ChequeDetailD.ChDtlId And ChequeDetailM.POSId = ChequeDetailD.POSId   And ChequeDetailD.ChequeNo ";
            query += "In(Select ChequeNo From BankDepositD Where IsBounced In(6)  And BankDepositD.CSafID = ChequeDetailM.CSafID)  And ChequeDate > '"+Date+"' ";
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
router.get('/RefundList/:Id/:LocId/:Date', function (req, res, next) {
    let Id= req.params.Id;
    let LocId= req.params.LocId;
    let Date= req.params.Date;
    let query = "Select ChequeDetailM.CSafNo, FranchId FranchiseCode  , ChequeDate, ChequeNo, ChqAmount, isnull(ChequeDetailD.BankName,'')BankName,    '' CitiesName,  ";
    query += "case when ChequeDetailM.ContractNo = '' then isnull((select top 1 Name from ClientDetails where ClientDetails.ID = ChequeDetailD.vcode),'')   ";
    query += "else ChequeDetailM.ContractNo end ContractId From  ChequeDetailM, ChequeDetailD left outer join RcBank on ChequeDetailD.BankId = RcBank.BankId ";
    query += "Where ChequeDetailM.ChDtlId = ChequeDetailD.ChDtlId And ChequeDetailM.POSId = ChequeDetailD.POSId   And ChequeDetailD.ChequeNo In(Select ChequeNo From BankDepositD Where IsBounced In (6)  ";
    query += "And BankDepositD.CSafID = ChequeDetailM.CSafID)   And ChequeDetailD.CSafId = "+ Id + " and ChequeDetailD.POSID = " + LocId + " And ChequeDate > '"+Date+"' ";
   
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
router.get('/GetAdjustmentList/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="exec sp_AdjustmentChequelist "+CompanyID+";"
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
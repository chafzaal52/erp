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
    let query="select * from ChequeDetailM where CompanyID="+CompanyId+";";
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
    var query="select *  from ChequeDetailM where ChDtlId="+Id+";";
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
    var query="select *  from ChequeDetailD where ChDtlId="+Id+";";
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
        .input('ChDtlId', model.ChDtlId)
        .input('csafid', model.csafid)
        .input('CSAFNo', model.CSAFNo)
        .input('EntryDate',sql.DateTime, model.EntryDate)
        .input('ContractDate',sql.DateTime, model.ContractDate)
        .input('FranchId', model.FranchId)
        .input('DowmPayment', model.DowmPayment)
        .input('NoOfInstallment', model.NoOfInstallment)
        .input('Comments', model.Comments)
        .input('FYear', model.FYear)
        .input('UserId', model.UserId)
        .input('ContractNo', model.ContractNo)
        .input('POSID', model.POSID)
        .input('AreaCode', model.AreaCode)
        .input('RegionCode', model.RegionCode)
        .input('SalesRepID', model.SalesRepID)
        .input('jrvid', model.jrvid)
        .input('isadjustment', model.isadjustment)
        .input('CompanyID', model.CompanyID)
        .input('adjchqno', model.adjchqno)
        .input('dtchqdate',sql.DateTime, model.dtchqdate)
        .input('txtchqamount', model.txtchqamount)
        .input('txtdepositslipno', model.txtdepositslipno)
        .input('txtcustname', model.txtcustname)
        .execute('sp_InsertUpdateRecovryRecord')
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
        .input('ID', model.ID)
                .input('ChDtlId', model.ChDtlId)
                .input('DueDate',sql.DateTime, model.DueDate)
                .input('ChequeNo', model.ChequeNo)
                .input('CSafId', model.CSafId)
                .input('ChequeDate',sql.DateTime, model.ChequeDate)
                .input('ChqAmount', model.ChqAmount)
                .input('BankId', model.BankId)
                .input('BankAccNo', model.BankAccNo)
                .input('BankBranch', model.BankBranch)
                .input('BankName', model.BankName)
                .input('CompanyID', model.CompanyID)
                .input('CityId', model.CityId)
                .input('FileTypeID', model.FileTypeID)
                .input('POSID', model.POSID)
                .input('ThirdParty', model.ThirdParty)
                .input('vcode', model.vcode)
                .input('cashAmt', model.cashAmt)
                .input('comments', model.comments)
                .input('ReceiptNo', model.ReceiptNo)
                .input('Deposit_Done', model.Deposit_Done)
                .input('ProjectID', model.ProjectID)
        .execute('sp_InsertRecoveryRecordDetail')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.post('/InsertChequeDetailD', function (req, res, next) {
    var model= req.body;
    sql.connect(config).then(response => {
        return response.request()
        .input('ChDtlId', model.ChDtlId)
        .input('DueDate', sql.DateTime, model.DueDate)
        .input('ChequeNo', model.ChequeNo)
        .input('CSafId', model.CSafId)
        .input('ChequeDate', sql.DateTime, model.ChequeDate)
        .input('ChqAmount', model.ChqAmount)
        .input('BankId', model.BankId)
        .input('BankAccNo', model.BankAccNo)
        .input('BankBranch', model.BankBranch)
        .input('CityId', model.CityId)
        .input('FileTypeID', model.FileTypeID)
        .input('POSID', model.POSID)
        .input('ThirdParty', model.ThirdParty)
        .input('vcode', model.vcode)
        .input('cashAmt', model.cashAmt)
        .input('comments', model.comments)
        .input('ReceiptNo', model.ReceiptNo)
        .input('BankName', model.BankName)
        .input('CompanyID', model.CompanyID)
        .input('Deposit_Done', model.Deposit_Done)
        .input('ProjectID', model.ProjectID)
        .execute('sp_InsertChequeDetailD')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/DetailDelete/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from ChequeDetailD where ChDtlId="+Id+";";
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
    var query="delete from ChequeDetailD where ChDtlId="+Id+"; delete from ChequeDetailM where ChDtlId="+Id+";";
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
router.get('/ChqueRealization/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query = "Select bdm.DepositSlipNo,bdd.ACHead,bdd.CSafID,cd.Name,cdd.ChequeDate,bdd.ChequeNo,bdd.ACHead,c.CitiesName,cdd.ChqAmount,cdd.ChDtlId ";
    query += "from BankDepositD bdd ";
    query += "left join BankDepositM bdm on bdm.MaxCode = bdd.MaxCode ";
    query += "left join ClientDetails cd on cd.ACNo = bdd.ACNo ";
    query += "left join ChequeDetaild cdd on cdd.CSafId = bdd.CSafID ";
    query += "left join ChequeDetailm cdm on cdm.ChDtlId = cdd.ChDtlID ";
    query += "left join UCities c on c.CitiesCode = cd.CityID where isnull(cdd.Deposit_Done,0) = 0 and bdm.CompanyID=" + CompanyID+" ";
    query += "group by bdm.DepositSlipNo,bdd.ACHead,bdd.CSafID,cd.Name,cdd.ChequeDate,bdd.ChequeNo,bdd.ACHead,c.CitiesName,cdd.ChqAmount,cdd.ChDtlId";

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
router.get('/CustomerACList', function (req, res, next) {
    let Id= req.params.Id;
    var query="select * from V_CustomerACList";
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
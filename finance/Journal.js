var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Journal Worked properly");
});

router.get('/GetJournal/:CompanyId/:formid/:VTYPE/:POSID', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let formid= req.params.formid;
    let VTYPE= req.params.VTYPE;
    let POSID= req.params.POSID;
    let query="select top(60)j.JRVID,j.VTYPE,j.VoucherNo,j.payableto,j.IsActive,j.POSID,j.JRTRANDATE,j.JRENTDATE,j.fyear, j.status, ";
    query+=" isnull((select GName from SGodown where Whno=j.POSID),0) as POSName,isnull((select top(1)DocPath from DocAttachments where ";
    if(VTYPE!="JV"){
        query+=" ifrom='"+VTYPE+"' and ";
    }
    else{
        query+=" ifrom='JV' and ";
    }
        query+=" ChequeNo=j.JRVID),'') as DocPath ";
    query+=" from JOURNAL j where j.formid="+formid+" and j.POSID="+POSID+" and j.CompanyId="+CompanyId+ " ";
    if(VTYPE!="JV"){
    query+=" and j.VTYPE='"+VTYPE+"' ";
    }
    query+="  order by j.JRVID desc";
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
router.get('/GetJournalSearch/:CompanyId/:formid/:VTYPE/:POSID/:Search', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let formid= req.params.formid;
    let VTYPE= req.params.VTYPE;
    let POSID= req.params.POSID;
    let Search= req.params.Search;
    let query="select top(100)j.JRVID,j.VTYPE,j.VoucherNo,j.payableto,j.IsActive,j.POSID,j.JRTRANDATE,j.JRENTDATE,j.fyear, j.status, ";
    query+=" isnull((select GName from SGodown where Whno=j.POSID),0) as POSName,isnull((select top(1)DocPath from DocAttachments where ";
    
    if(VTYPE!="JV"){
        query+=" ifrom='"+VTYPE+"' and ";
    }
    else{
        query+=" ifrom='JV' and ";
    }
        query+=" ChequeNo=j.JRVID),'') as DocPath ";
    query+=" from JOURNAL j where j.formid="+formid+" and j.POSID="+POSID+" and j.CompanyId="+CompanyId+ " ";
    if(Search!="null"){
        query+=" and (j.VoucherNo like '%"+Search+"%' or j.payableto like '%"+Search+"%' or j.fyear like '%"+Search+"%') ";
    }
    if(VTYPE!="JV"){
    query+=" and j.VTYPE='"+VTYPE+"' ";
    }
    query+="  order by j.JRVID desc"
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
router.get('/GetListExist/:CompanyId/:JRVID/:VoucherNo', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let JRVID= req.params.JRVID;
    let VoucherNo= req.params.VoucherNo;
    let query="select * from JOURNAL where CompanyID="+CompanyId+" and JRVID!="+JRVID+" and VoucherNo='"+VoucherNo+"';";
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
router.get('/GetList/:CompanyId', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let query="select * from JOURNAL where CompanyID="+CompanyId+";";
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
router.get('/GetJournalSaveFilter/:Year/:Month/:VTYPE/:CompanyId', function (req, res, next) {
    let Year= req.params.Year;
    let Month= req.params.Month;
    let VTYPE= req.params.VTYPE;
    let CompanyId= req.params.CompanyId;
    let query="select * from JOURNAL where year(JRTRANDATE)="+Year+" and Month(JRTRANDATE)="+Month+" and VTYPE='"+VTYPE+"' and CompanyId="+CompanyId+"; ";
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
    var query="select *  from JOURNAL where JRVID="+Id+";";
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
   router.get('/GetDetailByJRVID/:JRVID', function (req, res, next) {
    let JRVID= req.params.JRVID;
    var query="select *  from JOURNALDT where JRVID="+JRVID;
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
   router.get('/GetDetailByACID/:ACID', function (req, res, next) {
    let ACID= req.params.ACID;
    var query="select *  from JOURNALDT where ACID="+ACID;
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
   router.get('/GetDetailByACChqNo/:ACNO/:chqno', function (req, res, next) {
    let ACNO= req.params.ACNO;
    let chqno= req.params.chqno;
    var query="select * from JOURNALDT where ACNO="+ACNO+" and chqno="+chqno;
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
   router.get('/GetMaxJournalDT_ID/', function (req, res, next) {
    let JRVID= req.params.JRVID;
    var query="select Max(JOURNALDT_ID)as JOURNALDT_ID from JOURNALDT";
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
        .input('ID', model.JRVID)
        .input('JRVNO', model.JRVNO)
        .input('VTYPE', model.VTYPE)
        .input('JRTRANDATE', sql.DateTime, model.JRTRANDATE)
        .input('JRENTDATE', sql.DateTime, model.JRENTDATE)
        .input('ConnUser', model.ConnUser)
        .input('PostedUser', model.PostedUser)
        .input('status', model.status)
        .input('VoucherNo', model.VoucherNo)
        .input('fyear', model.fyear)
        .input('payableto', model.payableto)
        .input('formid', model.formid)
        .input('chqacno', model.chqacno)
        .input('farstatus', model.farstatus)
        .input('POSID', model.POSID)
        .input('Curr_Code', model.Curr_Code)
        .input('Exch_Rate',model.Exch_Rate)
        .input('isreverse',model.isreverse)
        .input('iseffected', model.iseffected)
        .input('Cust_Name', model.Cust_Name)
        .input('Cust_Address', model.Cust_Address)
        .input('Payment_Mode', model.Payment_Mode)
        .input('CHKUser',model.CHKUser)
        .input('APPUser', model.APPUser)
        .input('PettyCashNo',model.PettyCashNo)
        .input('JobPlanCode',model.JobPlanCode)
        .input('JobPlanDesc', model.JobPlanDesc)
        .input('Bank', model.Bank)
        .input('ISWHTax', model.ISWHTax)
        .input('WHTaxRate', model.WHTaxRate)
        .input('ISIWHTax', model.ISIWHTax)
        .input('IWHTaxRate', model.IWHTaxRate)
        .input('IsChequeDate', model.IsChequeDate)
        .input('ChequeDate', sql.DateTime, model.ChequeDate)
        .input('BusinessAccountID', model.BusinessAccountID)
        .input('IsActive', model.IsActive)
        .input('CreatedBy', model.CreatedBy)
        .input('CreatedDate', sql.DateTime, model.CreatedDate)
        .input('UpdatedBy', model.UpdatedBy)
        .input('UpdatedDate', sql.DateTime, model.UpdatedDate)
        .input('CompanyId', model.CompanyId)
        .input('ChqDate', sql.DateTime, model.ChqDate)
        .input('ITBank', model.ITBank)
        .input('IsAdvancePayment', model.IsAdvancePayment)
        .input('PONumber', model.PONumber)
        .input('UsedINLC', model.UsedINLC)
        .input('isrecurring', model.isrecurring)
        .input('RecurringRevDate', model.RecurringRevDate)
        .execute('sp_InsertUpdateJOURNAL')
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
        .input('POSID', model.POSID)
        .input('ACNO', model.ACNO)
        .input('JRVID', model.JRVID)
        .input('JRENTDATE', sql.DateTime, model.JRENTDATE)
        .input('JRPARTICULAR', model.JRPARTICULAR)
        .input('JRDR', model.JRDR)
        .input('JRCR', model.JRCR)
        .input('JRCFNO', model.JRCFNO)
        .input('deptcode', model.deptcode)
        .input('custid', model.custid)
        .input('HorseId', model.HorseId)
        .input('chqno', model.chqno)
        .input('DtlID', model.DtlID)
        .input('usdr', model.usdr)
        .input('USCr', model.USCr)
        .input('citiescode', model.citiescode)
        .input('Base_Curr_Cde', model.Base_Curr_Cde)
        .input('Base_Curr_Amt', model.Base_Curr_Amt)
        .input('JOURNALDT_ID', model.JOURNALDT_ID)
        .input('Bank_Rec_Mark', model.Bank_Rec_Mark)
        .input('WHTaxAcNo', model.WHTaxAcNo)
        .input('WHTaxAmount', model.WHTaxAmount)
        .input('IWHTaxAcNo', model.IWHTaxAcNo)
        .input('IWHTaxAmount', model.IWHTaxAmount)
        .input('WorkCode', model.WorkCode)
        .input('BusinessAccountID', model.BusinessAccountID)
        .input('IsActive', model.IsActive)
        .input('CreatedBy', model.CreatedBy)
        .input('CreatedDate', sql.DateTime, model.CreatedDate)
        .input('UpdatedBy', model.UpdatedBy)
        .input('UpdatedDate', sql.DateTime, model.UpdatedDate)
        .input('CompanyId', model.CompanyId)
        .execute('sp_InsertUpdateJOURNALDT')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="exec sp_DeleteJournalVouchers "+Id;
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
router.delete('/DeleteDetail/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from JOURNALDT where JRVID="+Id;
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
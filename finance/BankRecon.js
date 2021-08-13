var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Bank Recon Work properly");
});
router.get('/UpdateJournalDT/:jrvid/:dtlid/:acno/:chqno', function (req, res, next) {
    let jrvid= req.params.jrvid;
    let dtlid= req.params.dtlid;
    let acno= req.params.acno;
    let chqno= req.params.chqno;
    let query="";
    if(chqno=="null"){
    query="update journaldt set Bank_Rec_Mark = 1 where  Jrvid ="+jrvid+" and dtlid = "+dtlid+"  and acno = "+acno+" and isnull(Chqno,'') = '';";
}
else{
    query="update journaldt set Bank_Rec_Mark = 1 where  Jrvid ="+jrvid+" and dtlid = "+dtlid+"  and acno = "+acno+" and isnull(Chqno,'') = '"+chqno+"';";
}
     new sql.connect(config).then(pool=> {   
            return pool.request()
                    .query(query)
                    .then(result => {
                     res.send("Success");
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
        .input('Acno', model.Acno)
        .input('Posid', model.Posid)
        .input('EDate', sql.DateTime, model.EDate)
        .input('MMonth', sql.DateTime, model.MMonth)
        .input('fyear', model.fyear)
        .input('userid', model.userid)
        .input('Bank_Name', model.Bank_Name)
        .input('CompanyID', model.CompanyID)
        .execute('sp_InsertBank_Recon_M')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.post('/InsertUpdateDetail', function (req, res, next) {
    var model= req.body;
    sql.connect(config).then(response => {
        return response.request()
        .input('acno', model.acno)
        .input('POSid', model.POSid)
        .input('Rec_Date', sql.DateTime, model.Rec_Date)
        .input('Particulr', model.Particulr)
        .input('Chq_ref_no', model.Chq_ref_no)
        .input('amt_dr', model.amt_dr)
        .input('amt_cr', model.amt_cr)
        .input('Marked', model.Marked)
        .input('jrvid', model.jrvid)
        .input('Run_Balance', model.Run_Balance)
        .input('VoucherNo', model.VoucherNo)
        .input('Jrvid_Dtlid', model.Jrvid_Dtlid)
        .input('ptMonth', model.ptMonth)
        .input('Fyear', model.Fyear)
        .input('Userid', model.Userid)
        .input('Entry_Date', sql.DateTime, model.Entry_Date)
        .input('ptyear', model.ptyear)
        .input('Bank_Recon_D_id', model.Bank_Recon_D_id)
        .input('ClearingDate', sql.DateTime, model.ClearingDate)
        .input('CompanyID', model.CompanyID)
        .execute('sp_InsertBank_Recon_D')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
module.exports = router;
var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("USuppliers Work properly");
});


router.get('/GetList/:CompanyID', function (req, res, next) {
    var CompanyID= req.params.CompanyID;
    let query="select * from USuppliers where CompanyID="+CompanyID;
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
    var query="select *  from USuppliers where SCode="+Id+";";
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
        .input('ID',model.SCode)
        .input('PartyCode',model.PartyCode)
        .input('SCategory',model.SCategory)
        .input('SName',model.SName)
        .input('SAddress',model.SAddress)
        .input('TypeID',model.TypeID)
        .input('SRegSTNo',model.SRegSTNo)
        .input('SITNo',model.SITNo)
        .input('SContactP',model.SContactP)
        .input('CitiesCOde',model.CitiesCOde)
        .input('SPhoneNO',model.SPhoneNO)
        .input('SFaxNo',model.SFaxNo)
        .input('SEMail',model.SEMail)
        .input('acno',model.acno)
        .input('BlackList',model.BlackList)
        .input('GIntruction',model.GIntruction)
        .input('SupplierDisc',model.SupplierDisc)
        .input('Disc_GlCode',model.Disc_GlCode)
        .input('ccMail',model.ccMail)
        .input('BccMail',model.BccMail)
        .input('MailStop',model.MailStop)
        .input('Claim_ACNO',model.Claim_ACNO)
        .input('STypeis_2',model.STypeis_2)
        .input('TaxExmpt',model.TaxExmpt)
        .input('ExmptFrom',sql.DateTime,model.ExmptFrom)
        .input('ExmptTo',sql.DateTime,model.ExmptTo)
        .input('cr_Limit',model.cr_Limit)
        .input('Cr_Limit_Amount',model.Cr_Limit_Amount)
        .input('ChkCrLimit',model.ChkCrLimit)
        .input('MobileNo',model.MobileNo)
        .input('ItaxExmpt',model.ItaxExmpt)
        .input('Iexmptfrom',sql.DateTime,model.Iexmptfrom)
        .input('Iexmptto',sql.DateTime,model.Iexmptto)
        .input('WHTax',model.WHTax)
        .input('IWHTax',model.IWHTax)
        .input('RegionID',model.RegionID)
        .input('OrigonID',model.OrigonID)
        .input('CompanyID',model.CompanyID)
        .input('POSID',model.POSID)
        .input('CreatedBy',model.CreatedBy)
        .input('CreatedDate',sql.DateTime,model.CreatedDate)
        .input('UpdatedBy',model.UpdatedBy)
        .input('UpdatedDate',sql.DateTime,model.UpdatedDate)
        .input('excode',model.excode)
        .input('comments',model.comments)
        .input('IsActive',model.IsActive)
        .input('CitiesName',model.CitiesName)
        .input('CitiesAbr',model.CitiesAbr)
        .input('OrigonName',model.OrigonName)
        .input('OrigonAbr',model.OrigonAbr)
        .input('RegionName',model.RegionName)
        .input('RegionAbr',model.RegionAbr)
        .input('AcNoD',model.AcNoD)
        .input('ACHEAD',model.ACHEAD)
        .execute('sp_InsertUpdateUSuppliers')
    }).then(result => {
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from USuppliers_Disc where SCode="+Id+" delete from USuppliers_Disc1 where SCode="+Id+" delete from USuppliers_Bonus where SCode="+Id+" delete from USuppliers where SCode="+Id+";";
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
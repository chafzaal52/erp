var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Customer Work properly");
});


router.get('/GetListWithListing/:CompanyID', function (req, res, next) {
    var CompanyID= req.params.CompanyID;
    let query="select * from LstUVendorsDefM where CompanyID="+CompanyID;
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
router.get('/GetList/:CompanyID', function (req, res, next) {
    var CompanyID= req.params.CompanyID;
    let query="select * from UVendorsDefM where CompanyID="+CompanyID;
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
    var query="select *  from UVendorsDefM where VenderId="+Id+";";
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
router.get('/GetDiscByVendor/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="select *  from UVendorDef_Disc where VendorID="+Id+";";
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
router.get('/GetBonusByVendor/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="select *  from UVendorDef_Bonus where VendorID="+Id+";";
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
router.get('/GetConByVendor/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="select *  from UVendorDef_Con where VendorID="+Id+";";
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
        .input('ID', model.VenderId)
        .input('GodownId', model.GodownId)
        .input('VCode', model.VCode)
        .input('Member_No', model.Member_No)
        .input('VenderName', model.VenderName)
        .input('VenderAddress', model.VenderAddress)
        .input('SRegSTNo', model.SRegSTNo)
        .input('SITNo', model.SITNo)
        .input('CitiesCode', model.CitiesCode)
        .input('RegionCode', model.RegionCode)
        .input('BlackList', model.BlackList)
        .input('Comments', model.Comments)
        .input('WHTonDisc', model.WHTonDisc)
        .input('AreaID', model.AreaID)
        .input('PhoneNO', model.PhoneNO)
        .input('CNIC', model.CNIC)
        .input('CustomerType', model.CustomerType)
        .input('ISmember', model.ISmember)
        .input('Memberno', model.Memberno)
        .input('MobileNo', model.MobileNo)
        .input('FaxNo', model.FaxNo)
        .input('EMail', model.EMail)
        .input('Acno', model.Acno)
        .input('LicNine', model.LicNine)
        .input('ExpLicNine', sql.DateTime, model.ExpLicNine)
        .input('LicTen', model.LicTen)
        .input('ExpLicTen', sql.DateTime, model.ExpLicTen)
        .input('LicElev', model.LicElev)
        .input('ExpLicElev', sql.DateTime, model.ExpLicElev)
        .input('PartyType', model.PartyType)
        .input('ParentCode', model.ParentCode)
        .input('cr_Limit', model.cr_Limit)
        .input('is_Parent', model.is_Parent)
        .input('Cr_Limit_Amount', model.Cr_Limit_Amount)
        .input('ChkCrLimit', model.ChkCrLimit)
        .input('BE_Code', model.BE_Code)
        .input('AggDate_Fr', sql.DateTime, model.AggDate_Fr)
        .input('AggDate_TO', sql.DateTime, model.AggDate_TO)
        .input('PicImage', model.PicImage)
        .input('taxExmpt', model.taxExmpt)
        .input('exmptfrom', sql.DateTime, model.exmptfrom)
        .input('exmptto', sql.DateTime, model.exmptto)
        .input('ItaxExmpt', model.ItaxExmpt)
        .input('Iexmptfrom', sql.DateTime, model.Iexmptfrom)
        .input('Iexmptto', sql.DateTime, model.Iexmptto)
        .input('WHTax', model.WHTax)
        .input('IWHTax', model.IWHTax)
        .input('PaymentTerm', model.PaymentTerm)
        .input('chkretailprice', model.chkretailprice)
        .input('retailprice', model.retailprice)
        .input('CompanyID', model.CompanyID)
        .input('CreatedBy', model.CreatedBy)
        .input('CreatedDate', sql.DateTime, model.CreatedDate)
        .input('UpdatedBy', model.UpdatedBy)
        .input('UpdatedDate', sql.DateTime, model.UpdatedDate)
        .execute('sp_InsertUpdateUVendorsDefM')
    }).then(result => {
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.post('/Insert', function (req, res, next) {
    var model= req.body;
    sql.connect(config).then(response => {
        return response.request()
        .input('VenderId', model.VenderId)
        .input('GodownId', model.GodownId)
        .input('VCode', model.VCode)
        .input('Member_No', model.Member_No)
        .input('VenderName', model.VenderName)
        .input('VenderAddress', model.VenderAddress)
        .input('SRegSTNo', model.SRegSTNo)
        .input('SITNo', model.SITNo)
        .input('CitiesCode', model.CitiesCode)
        .input('RegionCode', model.RegionCode)
        .input('BlackList', model.BlackList)
        .input('Comments', model.Comments)
        .input('WHTonDisc', model.WHTonDisc)
        .input('AreaID', model.AreaID)
        .input('PhoneNO', model.PhoneNO)
        .input('CNIC', model.CNIC)
        .input('CustomerType', model.CustomerType)
        .input('ISmember', model.ISmember)
        .input('Memberno', model.Memberno)
        .input('MobileNo', model.MobileNo)
        .input('FaxNo', model.FaxNo)
        .input('EMail', model.EMail)
        .input('Acno', model.Acno)
        .input('LicNine', model.LicNine)
        .input('ExpLicNine', sql.DateTime, model.ExpLicNine)
        .input('LicTen', model.LicTen)
        .input('ExpLicTen', sql.DateTime, model.ExpLicTen)
        .input('LicElev', model.LicElev)
        .input('ExpLicElev', sql.DateTime, model.ExpLicElev)
        .input('PartyType', model.PartyType)
        .input('ParentCode', model.ParentCode)
        .input('cr_Limit', model.cr_Limit)
        .input('is_Parent', model.is_Parent)
        .input('Cr_Limit_Amount', model.Cr_Limit_Amount)
        .input('ChkCrLimit', model.ChkCrLimit)
        .input('BE_Code', model.BE_Code)
        .input('AggDate_Fr', sql.DateTime, model.AggDate_Fr)
        .input('AggDate_TO', sql.DateTime, model.AggDate_TO)
        .input('PicImage', model.PicImage)
        .input('taxExmpt', model.taxExmpt)
        .input('exmptfrom', sql.DateTime, model.exmptfrom)
        .input('exmptto', sql.DateTime, model.exmptto)
        .input('ItaxExmpt', model.ItaxExmpt)
        .input('Iexmptfrom', sql.DateTime, model.Iexmptfrom)
        .input('Iexmptto', sql.DateTime, model.Iexmptto)
        .input('WHTax', model.WHTax)
        .input('IWHTax', model.IWHTax)
        .input('PaymentTerm', model.PaymentTerm)
        .input('chkretailprice', model.chkretailprice)
        .input('retailprice', model.retailprice)
        .input('CompanyID', model.CompanyID)
        .input('CreatedBy', model.CreatedBy)
        .input('CreatedDate', sql.DateTime, model.CreatedDate)
        .input('UpdatedBy', model.UpdatedBy)
        .input('UpdatedDate', sql.DateTime, model.UpdatedDate)
        .input('RegionName', model.RegionName)
        .input('RegionAbr', model.RegionAbr)
        .input('RegionGroup', model.RegionGroup)
        .input('SalesTypeDesc', model.SalesTypeDesc)
        .input('SalesTypeAcno', model.SalesTypeAcno)
        .input('SalesTypeAcnoDirect', model.SalesTypeAcnoDirect)
        .input('SalesTypeAcnoDicount', model.SalesTypeAcnoDicount)
        .input('SalesTypeAcnoBonus', model.SalesTypeAcnoBonus)
        .input('AcNoD', model.AcNoD)
        .input('ACHEAD', model.ACHEAD)
        .input('ACLevel', model.ACLevel)
        .input('ACSTATUS', model.ACSTATUS)
        .input('ACCLASS', model.ACCLASS)
        .input('CitiesName', model.CitiesName)
        .input('CitiesAbr', model.CitiesAbr)
        .input('CitiesIsActive', model.CitiesIsActive)
        .input('AreaName', model.AreaName)
        .input('AreaAbr', model.AreaAbr)
        .input('AreaIsActive', model.AreaIsActive)
        .input('TermMaxNo', model.TermMaxNo)
        .input('term1', model.term1)
        .input('Percent_Amt_1', model.Percent_Amt_1)
        .input('Credit_Days_1', model.Credit_Days_1)
        .input('term2', model.term2)
        .input('Percent_Amt_2', model.Percent_Amt_2)
        .input('Credit_Days_2', model.Credit_Days_2)
        .input('term3', model.term3)
        .input('Percent_Amt_3', model.Percent_Amt_3)
        .input('Credit_Days_3', model.Credit_Days_3)
        .input('term4', model.term4)
        .input('Percent_Amt_4', model.Percent_Amt_4)
        .input('Credit_Days_4', model.Credit_Days_4)
        .input('term5', model.term5)
        .input('Percent_Amt_5', model.Percent_Amt_5)
        .input('Credit_Days_5', model.Credit_Days_5)
        .execute('sp_InsertLstUVendorsDefM')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.post('/Insert_Bonus', function (req, res, next) {
    var model= req.body;
    sql.connect(config).then(response => {
        return response.request()
        .input('VendorID', model.VendorID)
        .input('GodownId', model.GodownId)
        .input('Itcode', model.Itcode)
        .input('OrdQty', model.OrdQty)
        .input('BonusQty', model.BonusQty)
        .input('STDate', sql.DateTime, model.STDate)
        .input('EdDate', sql.DateTime, model.EdDate)
        .input('Comments', model.Comments)
        .input('Bonus_disc', model.Bonus_disc)
        .input('CompanyID', model.CompanyID)
        .input('ItCodeD', model.ItCodeD)
        .input('ItHead', model.ItHead)
        .execute('sp_InsertUVendorDef_Bonus')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.post('/Insert_Con', function (req, res, next) {
    var model= req.body;
    sql.connect(config).then(response => {
        return response.request()
        .input('VendorID', model.VendorID)
        .input('GodownId', model.GodownId)
        .input('ConName', model.ConName)
        .input('Address', model.Address)
        .input('City', model.City)
        .input('ContactPerson', model.ContactPerson)
        .input('Comments', model.Comments)
        .input('CompanyID', model.CompanyID)
        .execute('sp_InsertUVendorDef_Con')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.post('/Insert_Disc', function (req, res, next) {
    var model= req.body;
    sql.connect(config).then(response => {
        return response.request()
        .input('VendorID', model.VendorID)
        .input('GodownId', model.GodownId)
        .input('Itcode', model.Itcode)
        .input('DiscountRate', model.DiscountRate)
        .input('STDate', sql.DateTime, model.STDate)
        .input('EdDate', sql.DateTime, model.EdDate)
        .input('totQty', model.totQty)
        .input('Comments', model.Comments)
        .input('bnsQty', model.bnsQty)
        .input('TradePrice', model.TradePrice)
        .input('NetPrice', model.NetPrice)
        .input('RetailPrice', model.RetailPrice)
        .input('CompanyID', model.CompanyID)
        .input('ItCodeD', model.ItCodeD)
        .input('ItHead', model.ItHead)
        .execute('sp_InsertUVendorDef_Disc')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from UVendorDef_Con where VendorID="+Id+" delete from UVendorDef_Disc where VendorID="+Id+" delete from UVendorDef_Bonus where VendorID="+Id+" delete from LstUVendorsDefM where VenderId="+Id+" delete from UVendorsDefM where VenderId="+Id+";";
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
router.delete('/UpdatedDelete/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from UVendorDef_Con where VendorID="+Id+"; delete from UVendorDef_Disc where VendorID="+Id+"; delete from UVendorDef_Bonus where VendorID="+Id+"; delete from LstUVendorsDefM where VenderId="+Id+";";
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
var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("i am works properly");
});


router.get('/GetList/:CompanyId', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let query="select * from SiteId where CompanyID="+CompanyId+";";
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
    var query="select *  from SiteId where Maxid="+Id+";";
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
        .input('Maxid',model.Maxid)
        .input('SiteNumber',model.SiteNumber)
        .input('PhaseNo',model.PhaseNo) 
        .input('RegionId',model.RegionId) 
        .input('Cityid',model.Cityid)
        .input('TowerDesc',model.TowerDesc)
        .input('TowerSize',model.TowerSize)
        .input('FoundationDesc',model.FoundationDesc)
        .input('ShleterRoom',model.ShleterRoom)
        .input('ShleterEquip',sql.DateTime,model.ShleterEquip)
        .input('SiteStDate',sql.DateTime,model.SiteStDate)
        .input('SiteEndDate',sql.DateTime,model.SiteEndDate)
        .input('Remarks',model.Remarks)
        .input('blocked',model.blocked)
        .input('userid',model.userid)
        .input('SiteAcq',model.SiteAcq)
        .input('soilinves',model.soilinves)
        .input('structure',model.structure)
        .input('CMEWork',model.CMEWork)
        .input('TowerSupp',model.TowerSupp) 
        .input('Genset',model.Genset)
        .input('AirCond',model.AirCond)
        .input('NOC',model.NOC)
        .input('ContractRef',model.ContractRef) 
        .input('ContractVal',model.ContractVal)
        .input('natofCont',model.natofCont)
        .input('philpsPoNo',model.philpsPoNo)
        .input('poDate',sql.DateTime,model.poDate)
        .input('poAmount',model.poAmount)
        .input('ModofPayment',model.ModofPayment)
        .input('LCTT',model.LCTT) 
        .input('PaymentTerms',model.PaymentTerms)
        .input('LCtobEstBy',model.LCtobEstBy)
        .input('insuranc',model.insuranc)
        .input('ShipDelivdate',sql.DateTime,model.ShipDelivdate)
        .input('amdinContLC',model.amdinContLC) 
        .input('WantryPriod',model.WantryPriod)
        .input('WsDate',sql.DateTime,model.WsDate)
        .input('WEDate',sql.DateTime,model.WEDate)
        .input('PhilipsWantryPriod',model.PhilipsWantryPriod)
        .input('PhilipsWsDate',sql.DateTime,model.PhilipsWsDate) 
        .input('PhilipsWContRef',model.PhilipsWContRef) 
        .input('PeriodofSrvCont',model.PeriodofSrvCont) 
        .input('ExpDate',sql.DateTime,model.ExpDate)
        .input('EstbBy',model.EstbBy)
        .input('LCExpDate',sql.DateTime,model.LCExpDate)
        .input('philipsPO',model.philipsPO)
        .input('FDDate',sql.DateTime,model.FDDate) 
        .input('DateofIsu',sql.DateTime,model.DateofIsu)
        .input('MatoraPortion',model.MatoraPortion) 
        .input('CommisionForeign',model.CommisionForeign)
        .input('PJDated',sql.DateTime,model.PJDated) 
        .input('LDCharge',model.LDCharge) 
        .input('TRVLCFOR',model.TRVLCFOR) 
        .input('trgCUSLocFor',model.trgCUSLocFor)
        .input('PJComDatedCont',sql.DateTime,model.PJComDatedCont)
        .input('EqupInstDate',sql.DateTime,model.EqupInstDate)
        .input('CDRBGR',model.CDRBGR)
        .input('CDRBGRNO',model.CDRBGRNO)
        .input('CBRTendNo',model.CBRTendNo)
        .input('CBRQutNo',model.CBRQutNo) 
        .input('CBRAMt',model.CBRAMt)
        .input('CBRBGURTNo',model.CBRBGURTNo) 
        .input('CBRBankName',model.CBRBankName)
        .input('CBRBGURTAMt',model.CBRBGURTAMt)
        .input('CBRBGURTisudate',sql.DateTime,model.CBRBGURTisudate)
        .input('CBRBGURTValid',model.CBRBGURTValid) 
        .input('CBRBGURTexpdate',sql.DateTime,model.CBRBGURTexpdate)
        .input('FDTTLC',model.FDTTLC) 
        .input('FDAMt',model.FDAMt) 
        .input('FDCOMLoc',model.FDCOMLoc)
        .input('aiaMatporAmt',model.aiaMatporAmt)
        .input('aiaPrjDet',model.aiaPrjDet) 
        .input('aiaDebNot',model.aiaDebNot) 
        .input('aiaPrjAmt',model.aiaPrjAmt) 
        .input('aiaAgPoNo',model.aiaAgPoNo) 
        .input('aiaAgInvNo',model.aiaAgInvNo)
        .input('aiaPrjTag',model.aiaPrjTag) 
        .input('aiaPrjContRefNo',model.aiaPrjContRefNo)
        .input('aiaPrjDate',sql.DateTime,model.aiaPrjDate)
        .input('aiaPrjDescr',model.aiaPrjDescr) 
        .input('aiaPrjEqpDet',model.aiaPrjEqpDet)
        .input('aiaPrjThirdPrt',model.aiaPrjThirdPrt)
        .input('RFIStatus',model.RFIStatus)
        .input('SCode',model.SCode) 
        .input('Status',model.Status) 
        .input('SuprintName',model.SuprintName)
        .input('LetterNo',model.LetterNo) 
        .input('ProjNature',model.ProjNature)
        .input('TargetComp',model.TargetComp)
        .input('ComencDate',sql.DateTime,model.ComencDate)
        .input('CatDescrp',model.CatDescrp) 
        .input('HndOverDate',sql.DateTime,model.HndOverDate)
        .input('CertificateDate',sql.DateTime,model.CertificateDate) 
        .input('CompletDate',sql.DateTime,model.CompletDate) 
        .input('LiqDamgAmt',model.LiqDamgAmt)
        .input('LiqDamagLimit',model.LiqDamagLimit)
        .input('RateofInt',model.RateofInt)
        .input('OmmVarition',model.OmmVarition)
        .input('InsuranseAmt',model.InsuranseAmt)
        .input('RentLimit',model.RentLimit)
        .input('RentPercent',model.RentPercent)
        .input('MobilAdv',model.MobilAdv)
        .input('PaymentDays',model.PaymentDays)
        .input('MinIPCAmt',model.MinIPCAmt)
        .input('SecAdvance',model.SecAdvance)
        .input('Gurantee',model.Gurantee)
        .input('Sub_PRID',model.Sub_PRID) 
        .input('EOT1',model.EOT1) 
        .input('EOT2',model.EOT2) 
        .input('EOT3',model.EOT3) 
        .input('EOT4',model.EOT4) 
        .input('POSid',model.POSid)
        .input('Revdate',sql.DateTime,model.Revdate) 
        .input('RevNo',model.RevNo) 
        .input('Drawing1',model.Drawing1) 
        .input('Drawing2',model.Drawing2) 
        .input('Drawing3',model.Drawing3) 
        .input('MaxsubID',model.MaxsubID) 
        .input('salemanId',model.salemanId)
        .input('Allowed',model.Allowed)
        .input('CompanyID',model.CompanyID)
        .input('POSName',model.POSName)
        .input('POSDeptCodeD',model.POSDeptCodeD)
        .input('CatAbr',model.CatAbr)
        .input('CatName',model.CatName)
        .input('NatureAbr',model.NatureAbr)
        .input('NatureName',model.NatureName)
        .input('RegionName',model.RegionName)
        .input('RegionAbr',model.RegionAbr)
        .input('CityName',model.CityName)
        .input('CityAbr',model.CityAbr)
        .execute('sp_InsertUpdateProjectDefinition')
    }).then(result => {
        maxid = result.recordset[0].MaxID
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from SiteId where Maxid="+Id+";";
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
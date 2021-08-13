var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("IBinCard work properly");
});


router.get('/GetList/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="select * from IBinCard where CompanyID="+CompanyID;
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
    var query="select *  from IBinCard where Itcode="+Id+";";/////////////////
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
        .input('ID', model.ItBinCardNo)
        .input('Itcode', model.Itcode)
        .input('itcatalogno', model.itcatalogno)
        .input('itlocation', model.itlocation)
        .input('UnitCode', model.UnitCode)
        .input('itMinLevel', model.itMinLevel)
        .input('itMaxLevel', model.itMaxLevel)
        .input('itRolevel', model.itRolevel)
        .input('itRoQty', model.itRoQty)
        .input('itdrate', model.itdrate)
        .input('itopbal', model.itopbal)
        .input('origonid', model.origonid)
        .input('LeadTime', model.LeadTime)
        .input('LeastTime', model.LeastTime)
        .input('itstopautoreq', model.itstopautoreq)
        .input('itremarks', model.itremarks)
        .input('itentrydate', sql.DateTime, model.itentrydate)
        .input('transitqty', model.transitqty)
        .input('STaxRate', model.STaxRate)
        .input('Color', model.Color)
        .input('Meterial', model.Meterial)
        .input('Weight', model.Weight)
        .input('SitemStatus', model.SitemStatus)
        .input('ItCatStatus', model.ItCatStatus)
        .input('ItemCategory', model.ItemCategory)
        .input('ItemRefNo', model.ItemRefNo)
        .input('IsSerialized',model.IsSerialized)
        .input('ItemLength', model.ItemLength)
        .input('DecforClearance', model.DecforClearance)
        .input('BarCode', model.BarCode)
        .input('SupplierID', model.SupplierID)
        .input('fPath', model.fPath)
        .input('PUnit', model.PUnit)
        .input('pStrength', model.pStrength)
        .input('NearExpry', model.NearExpry)
        .input('is_Dynamic_Pric', model.is_Dynamic_Pric)
        .input('ItemType', model.ItemType)
        .input('isstock', model.isstock)
        .input('STaxChek', model.STaxChek)
        .input('STaxPercent', model.STaxPercent)
        .input('IsSample', model.IsSample)
        .input('PackSize', model.PackSize)
        .input('ColorCode', model.ColorCode)
        .input('Mid', model.Mid)
        .input('ShadCode', model.ShadCode)
        .input('ISPackingItem', model.ISPackingItem)
        .input('ExcTaxCheck', model.ExcTaxCheck)
        .input('ExcTax', model.ExcTax)
        .input('WithHoldingCheck', model.WithHoldingCheck)
        .input('WithHolding', model.WithHolding)
        .input('FEDTaxCheck', model.FEDTaxCheck)
        .input('FEDTax', model.FEDTax)
        .input('ShelfCode', model.ShelfCode)
        .input('RegDate', sql.DateTime, model.RegDate)
        .input('RenewalDate', sql.DateTime, model.RenewalDate)
        .input('isGeneral', model.isGeneral)
        .input('ITTypeIdN', model.ITTypeIdN)
        .input('TollPId', model.TollPId)
        .input('ExpYears', model.ExpYears)
        .input('PackSizePP', model.PackSizePP)
        .input('chkPackSizePP', model.chkPackSizePP)
        .input('GTNINNo', model.GTNINNo)
        .input('Shape', model.Shape)
        .input('Color12', model.Color12)
        .input('Coating', model.Coating)
        .input('Volumeweight', model.Volumeweight)
        .input('Blister', model.Blister)
        .input('NoofTablets', model.NoofTablets)
        .input('BoxinCarton', model.BoxinCarton)
        .input('StoreCode', model.StoreCode)
        .input('RackCode', model.RackCode)
        .input('IsChemical', model.IsChemical)
        .input('CompanyID', model.CompanyID)
        .input('POSID', model.POSID)
        .input('CreatedBy', model.CreatedBy)
        .input('CreatedDate', sql.DateTime, model.CreatedDate)
        .input('UpdatedBy', model.UpdatedBy)
        .input('UpdatedDate', sql.DateTime, model.UpdatedDate)
        .input('IBinMax', model.IBinMax)
        .input('ItemClassID', model.ItemClassID)
        .input('BonusQty', model.BonusQty)
        .input('BonusRatio', model.BonusRatio)
        .input('PackingUnitID', model.PackingUnitID)
        .input('MearsuringUnitDescrp', model.MearsuringUnitDescrp)
        .input('OrigonName', model.OrigonName)
        .input('OrigonShortName', model.OrigonShortName)
        .input('SupplierName', model.SupplierName)
        .input('SupplierPartyCode', model.SupplierPartyCode)
        .input('Supplieracno', model.Supplieracno)
        .input('BrandName', model.BrandName)
        .input('ColorName', model.ColorName)
        .input('ItemClassName', model.ItemClassName)
        .input('ItemCategoryName', model.ItemCategoryName)
        .input('TollPartyName', model.TollPartyName)
        .input('StoreCodeD', model.StoreCodeD)
        .input('StoreName', model.StoreName)
        .input('RackAbri', model.RackAbri)
        .input('RackName', model.RackName)
        .input('ShelfAbri', model.ShelfAbri)
        .input('ShelfName', model.ShelfName)
        .input('PackingUnitName', model.PackingUnitName)
        .execute('sp_InsertUpdateIBinCard')
    }).then(result => {
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from IBinCard where Itcode="+Id+";";/////////////
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
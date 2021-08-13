var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Sales Invocie Work properly");
});

router.get('/GetMaxPayReceiptNo/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    var query="select Max(cast(NewShip_Maxid as int))as NewShip_Maxid,max(cast(PayID as int)) as PayID from ARM_Payment_M where CompanyID="+CompanyID;
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
   router.get('/GetSaleInvoiceAlreadyExist/:CompanyID/:PayReciptNo', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let PayReciptNo= req.params.PayReciptNo;
    var query="select count(PayID)as PayID from ARM_Payment_M where CompanyID="+CompanyID+" and PayReceiptNo='"+PayReciptNo+"'";
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
    let Search= req.params.Search;
    let query="";
    if(Search=="null"){
    query="select top(50)dc.Ord_No as DCOrd_No,(select GName from SGodown where Whno=m.POSID) as POSName,(select DeptName from Departments where DeptCode=m.deptcode) as DeptName,m.* from ARM_Payment_M m,Ord_Ship_M dc where m.Ship_MaxId=dc.Ord_id and m.CompanyID="+CompanyID+" order by PayID desc";
    }
    else{
        query="select top(100)dc.Ord_No as DCOrd_No,(select GName from SGodown where Whno=m.POSID) as POSName,(select DeptName from Departments where DeptCode=m.deptcode) as DeptName,m.* from ARM_Payment_M m,Ord_Ship_M dc where m.Ship_MaxId=dc.Ord_id and m.CompanyID="+CompanyID+" and (m.CustomerName like '%"+Search+"%' or m.PayReceiptNo like '%"+Search+"%' or m.PayID like '%"+Search+"%' or dc.Ord_No like '%"+Search+"%' or m.InvRefNo like '%"+Search+"%')";
    }
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
router.get('/GetById/:Id/:CompanyID', function (req, res, next) {
    var Id= req.params.Id;
    var CompanyID= req.params.CompanyID;
    var query="select * from ARM_Payment_M where PayID="+Id+" and CompanyID="+CompanyID+";";
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
   router.get('/GetByPayID/:Id/:CompanyID', function (req, res, next) {
    var Id= req.params.Id;
    var CompanyID= req.params.CompanyID;
    var query="select *  from ARM_Payment_D where PayID="+Id+" and CompanyID="+CompanyID+";";
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
        .input('PayID', model.PayID)
        .input('PayReceiptNo', model.PayReceiptNo)
        .input('CustomerName', model.CustomerName)
        .input('isdistributer', model.isdistributer)
        .input('DistributorID', model.DistributorID)
        .input('POSID', model.POSID)
        .input('InvRefNo', model.InvRefNo)
        .input('PayDateTime', sql.DateTime, model.PayDateTime)
        .input('Userid', model.Userid)
        .input('PayReasonID', model.PayReasonID)
        .input('Note', model.Note)
        .input('NetPayable',model.NetPayable)
        .input('RecdAmount', model.RecdAmount)
        .input('Fyear', model.Fyear)
        .input('Paymode', model.Paymode)
        .input('BChqNo',model.BChqNo)
        .input('BAccID', model.BAccID)
        .input('Bname', model.Bname)
        .input('BBrAdd', model.BBrAdd)
        .input('CCardNo', model.CCardNo)
        .input('CExpiryDate', sql.DateTime, model.CExpiryDate)
        .input('CVerifiCode', model.CVerifiCode)
        .input('CAuthCode', model.CAuthCode)
        .input('Company', model.Company)
        .input('isreversed', model.isreversed)
        .input('RevUserID', model.RevUserID)
        .input('revDate', sql.DateTime, model.revDate)
        .input('RevAmt', model.RevAmt)
        .input('CurrID', model.CurrID)
        .input('ExchRate', model.ExchRate)
        .input('ConvAmt', model.ConvAmt)
        .input('shiftid', model.shiftid)
        .input('TrnasDate', sql.DateTime, model.TrnasDate)
        .input('ReferenceNo', model.ReferenceNo)
        .input('Cashierid', model.Cashierid)
        .input('isApproved', model.isApproved)
        .input('IsPrepaid', model.IsPrepaid)
        .input('Order_ID', model.Order_ID)
        .input('TargetWalletId', model.TargetWalletId)
        .input('CustomerType', model.CustomerType)
        .input('SID',model.SID)
        .input('DID', model.DID)
        .input('VehicleNo', model.VehicleNo)
        .input('MembershipNO', model.MembershipNO)
        .input('Cash_Amt', model.Cash_Amt)
        .input('Chq_Amt', model.Chq_Amt)
        .input('Cr_Card_Amt', model.Cr_Card_Amt)
        .input('Adv_Amt', model.Adv_Amt)
        .input('Adv_Ref_No', model.Adv_Ref_No)
        .input('Jrvid', model.Jrvid)
        .input('Bank_GL_Code',model.Bank_GL_Code)
        .input('CancelStatus', model.CancelStatus)
        .input('printstatus', model.printstatus)
        .input('PrintStatus_GP', model.PrintStatus_GP)
        .input('DSS_Done', model.DSS_Done)
        .input('Sales_Type', model.Sales_Type)
        .input('IsTaxable', model.IsTaxable)
        .input('Sales_Type_id', model.Sales_Type_id)
        .input('Ship_MaxId', model.Ship_MaxId)
        .input('Spc_disc', model.Spc_disc)
        .input('CED_Amt', model.CED_Amt)
        .input('Adj_Amount', model.Adj_Amount)
        .input('ExtraDiscountPer',model.ExtraDiscountPer)
        .input('ExtraDiscountAmt', model.ExtraDiscountAmt)
        .input('FORAmt', model.FORAmt)
        .input('AmountReceived', model.AmountReceived)
        .input('NewShip_Maxid', model.NewShip_Maxid)
        .input('HandlingCharges', model.HandlingCharges)
        .input('BonusSaleOnly', model.BonusSaleOnly)
        .input('WarrantyDisc', model.WarrantyDisc)
        .input('isRetailer', model.isRetailer)
        .input('deptcode', model.deptcode)
        .input('CompanyID', model.CompanyID)
        .input('GLBal', model.GLBal)
        .input('printGLBal', model.printGLBal)
        .execute('sp_InsertUpdateARM_Payment_M')
    }).then(result => {
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.get('/UpdateDeliveryChallan/:Ship_MaxId/:CompanyID/:inv_Done', function (req, res, next) {
    var Ship_MaxId= req.params.Ship_MaxId;
    var CompanyID= req.params.CompanyID;
    var inv_Done= req.params.inv_Done;
    var query="update Ord_Ship_M set inv_Done="+inv_Done+" where Ord_id="+Ship_MaxId+" and CompanyId="+CompanyID+";";
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
router.post('/InsertDetail', function (req, res, next) {
    var model= req.body;
    sql.connect(config).then(response => {
        return response.request()
        .input('PayID', model.PayID)
        .input('ServiceID', model.ServiceID)
        .input('MSISDN', model.MSISDN)
        .input('Qty', model.Qty)
        .input('fromSr', model.fromSr)
        .input('ToSr', model.ToSr)
        .input('Rate', model.Rate)
        .input('Gross', model.Gross)
        .input('DiscountRate', model.DiscountRate)
        .input('DiscountAmt', model.DiscountAmt)
        .input('TotTax', model.TotTax)
        .input('TotAmt', model.TotAmt)
        .input('ItCode', model.ItCode)
        .input('WhTAmt', model.WhTAmt)
        .input('InvoiceValue', model.InvoiceValue)
        .input('WhID', model.WhID)
        .input('DiscTypeid', model.DiscTypeid)
        .input('Classification', model.Classification)
        .input('expDate', sql.DateTime, model.expDate)
        .input('BonusQty', model.BonusQty)
        .input('cgs', model.cgs)
        .input('Sp_disc_rate', model.Sp_disc_rate)
        .input('Sp_disc_Amt', model.Sp_disc_Amt)
        .input('RateChange', model.RateChange)
        .input('Processed', model.Processed)
        .input('ActRate', model.ActRate)
        .input('Ship_Maxid_det', model.Ship_Maxid_det)
        .input('sp_Bonus', model.sp_Bonus)
        .input('SRetailPrice', model.SRetailPrice)
        .input('CompanyID', model.CompanyID)
        .input('ProjectID', model.ProjectID)
        .execute('sp_InsertARM_Payment_D')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.post('/InsertDetailDDDD', function (req, res, next) {
    var model= req.body;
    sql.connect(config).then(response => {
        return response.request()
        .input('PayID', model.PayID)
        .input('ServiceID', model.ServiceID)
        .input('Qty', model.Qty)
        .input('SrNo', model.SrNo)
        .input('expDate', sql.DateTime, model.expDate)
        .input('ItCode', model.ItCode)
        .input('WhID', model.WhID)
        .input('Rate', model.Rate)
        .input('Gross', model.Gross)
        .input('TotAmt', model.TotAmt)
        .input('DiscountRate', model.DiscountRate)
        .input('DiscountAmount', model.DiscountAmount)
        .input('InVoiceAmount', model.InVoiceAmount)
        .input('DiscTypeid', model.DiscTypeid)
        .input('BonusQty', model.BonusQty)
        .input('TaxRate', model.TaxRate)
        .input('TaxAmt', model.TaxAmt)
        .input('cgs', model.cgs)
        .input('sp_Bonus', model.sp_Bonus)
        .input('SRetailPriceDDdD', model.SRetailPriceDDdD)
        .input('CompanyID', model.CompanyID)
        .execute('sp_InsertArm_Payment_DDDD')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/DeleteDetail/:Id/:CompanyID', function (req, res, next) {
    var Id= req.params.Id;
    var CompanyID= req.params.CompanyID;
    var query="delete from Arm_Payment_DDDD where PayID="+Id+" and CompanyID="+CompanyID+"; delete from Arm_Payment_D where PayID="+Id+" and CompanyID="+CompanyID+";";
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
router.delete('/Delete/:Id/:CompanyID', function (req, res, next) {
    var Id= req.params.Id;
    var CompanyID= req.params.CompanyID;
    var query="delete from Arm_Payment_DDDD where PayID="+Id+" and CompanyID="+CompanyID+"; delete from Arm_Payment_D where PayID="+Id+" and CompanyID="+CompanyID+"; delete from Arm_Payment_M where PayID="+Id+" and CompanyID="+CompanyID+";";
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
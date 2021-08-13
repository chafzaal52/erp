var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Stock in hand summary report worked");
});

router.get('/Report/:DateFrom/:DateTo/:POSID/:PartyCode/:ItCode/:SalesType/:BrandID', function (req, res, next) {
    let DateFrom= req.params.DateFrom;
    let DateTo= req.params.DateTo;
    let POSID= req.params.POSID;
    let PartyCode= req.params.PartyCode;
    let ItCode= req.params.ItCode;
    let SalesType=req.params.SalesType;
    let BrandID=req.params.BrandID;
    let query="Select isnull(PayReceiptNo,'')PayReceiptNo,CustomerName,DistributorID,Service_Desc,IBinCard.LeastTime,IBinCard.BrandName, Sum(IsNull(Qty, 0)) Qty, Sum(IsNull(Rate, 0)) Rate, Sum(IsNull(Gross, 0)) Gross,  ";
    query+=" Sum(IsNull(DiscountAmt, 0)) DiscountAmt,Sum(IsNull(TotTax, 0)) TotTax, Sum(IsNull(TotAmt, 0)) TotAmt,PayDateTime ";
    query+=" From VSalesDetail, IBinCard   ";
    query+=" Where VSalesDetail.ItCode = IBinCard.ItCode And IsReversed = 0 And TrnasDate Between '"+DateFrom+"'  And '"+DateTo+"' And VSalesDetail.POSID = "+POSID+" ";
    if(SalesType!="null"){
    query+=" And Sales_Type_id="+SalesType+"  ";
    }
    if(PartyCode!="null"){
    query+=" and DistributorID="+PartyCode+" ";
    }
    if(BrandID!="null"){
        query+=" and IBinCard.mid="+BrandID+" ";
        }
    if(ItCode!="null"){
    query+=" and (ITL1="+ItCode+" or Itl2="+ItCode+" or Itl3="+ItCode+" or Itl4="+ItCode+" or Itl5="+ItCode+" or Itl6="+ItCode+") ";
    }
    query+=" Group By Service_Desc,isnull(PayReceiptNo,''),IBinCard.LeastTime,IBinCard.BrandName, CustomerName,DistributorID,PayDateTime ";
    
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
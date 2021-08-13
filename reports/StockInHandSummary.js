var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Stock in hand summary report worked");
});

router.get('/GetStockInHandSummaryReport/:gname/:itcode/:date/:itemcategoryid/:itemclassid/:itempackunitid/:companyid', function (req, res, next) {
    let gname= req.params.gname;
    let itcode= req.params.itcode;
    let date= req.params.date;
    let itemcategoryid= req.params.itemcategoryid;
    let itemclassid= req.params.itemclassid;
    let itempackunitid= req.params.itempackunitid;
    let companyid= req.params.companyid;
    let query=" Select GName, Abbreviation, IItems.ItCodeD,IBinCard.BrandName,IBinCard.LeastTime,IBinCard.Mid, IItems.ItHead,IBinCard.MearsuringUnitDescrp as UnitDescrp, IsNull(Sum(t.OpnBalance),0) OpnQty, IsNull(Sum(t.FaultyQty),0) FaultyQty, IsNull(Sum(t.UsedQty),0) UsedQty, IsNull(Sum(t.AppQty),0) RecQty, ";
    query+=" IsNull(Sum(t.RejQty),0) RejectQty, IsNull(Sum(t.QtyIssue),0) Issued, IsNull(Sum(t.Qty),0) DebitQty, IsNull(Sum(t.AdjQty),0) AdjQty, IsNull(Sum(t.STNQtyPls),0) STNQtyPls, IsNull(Sum(t.STNQtyMin),0) STNQtyMin, IsNull(Sum(t.POSQty),0) POSQty,  ";
    query+=" IsNull(Sum(t.TransitQty),0) TransitQty, IsNull(Sum(t.FQtyMin),0) FQtyMin, IsNull(Sum(t.FQtyPlus),0) FQtyPlus, IsNull(Sum(t.ReplaceQty),0) ReplaceQty  ,isnull((SELECT Name  from ItemTypeN  where id = IBinCard.ITTypeIdN),'')ItemTypeN, ";
    query+=" isnull((SELECT Description from ItemClass where Code = IBinCard.ItemClassID),'')ItemClass,isnull((SELECT  Description from PackingUnit  where Code = IBinCard.PackingUnitID),'')PackingUnit  From( Select IsNull(Sum(OpnBalance),0) OpnBalance,  ";
    query+=" IsNull(Sum(FaultyQty),0) FaultyQty, IsNull(Sum(UsedQty),0) UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, IBinCardD.ItCode, GName, Abbreviation, transdate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty ";
    query+=" From IBinCard, IBinCardD, SGodown Where WhNo = GodownId And ItBinCardNo = BinCardId  Group By IBinCardD.ItCode, GName, Abbreviation,transdate   ";
    query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, IsNull(Sum(AppQty),0) AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, IGRND.ItCode, GName, Abbreviation, GDate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty  ";
    query+=" From IGrNM, IGrND, SGodown,ibincard Where WhNo = IGRNM.GodownId and IGRNM.GodownId=IGRND.GodownId And IGrNM.GRNId = IGrND.GRNId and IGRND.itcode = ibincard.itcode  and isnull(IGrNM.Cancelstatus,0) = 0  Group By IGRND.ItCode, GName, Abbreviation, GDate)  ";
    query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, ItCode, GName, Abbreviation, TrnasDate StockDate, IsNull(Sum(Qty),0)+ isnull(sum(bonusqty),0) AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty  ";
    query+=" From ARM_Payment_Reversal, ARM_Payment_Reversal_D, SGodown Where WhNo = ARM_Payment_Reversal.POSId and ARM_Payment_Reversal.POSId=ARM_Payment_Reversal_D.whId And ARM_Payment_Reversal.Reversalid = ARM_Payment_Reversal_D.Reversalid and isnull(ARM_Payment_Reversal.Cancelstatus,0) = 0 Group By ItCode, GName, Abbreviation, TrnasDate,whno)   ";
    query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, ItemCode ItCode, GName, Abbreviation, TDate StockDate, 0 AdjQty, IsNull(Sum(NormalQtyIssue),0) STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty  ";
    query+=" From SGTransferM, SGTransferD, SGodown Where WhNo = WhNOTo and sgtransferm.whnofrom = sgtransferd.godownid  and sgtransferm.whnofrom = sgtransferd.godownid   And SGTransferM.MaxCode = SGTransferD.MaxCode  And TransStatus = 1  and isnull(SGTransferM.Cancelstatus,0) = 0 Group By ItemCode, GName, Abbreviation, TDate)  ";
    query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, ItemCode ItCode, GName, Abbreviation, TDate StockDate, 0 AdjQty, 0 STNQtyPls, IsNull(Sum(NormalQtyIssue),0) STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty   ";
    query+=" From SGTransferM, SGTransferD, SGodown Where WhNo = WhNOFrom     and sgtransferm.whnofrom = sgtransferd.godownid  and sgtransferm.whnofrom = sgtransferd.godownid   And SGTransferM.MaxCode = SGTransferD.MaxCode and isnull(SGTransferM.Cancelstatus,0) = 0  Group By ItemCode, GName, Abbreviation, TDate)  ";
    query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, ItCode, GName, Abbreviation, EDate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, IsNull(Sum(isnull(B_CurShiped,0)+isnull(St_CurShiped,0)+isnull(Disc_qty,0)),0) POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty  ";
    query+=" From Ord_Ship_M, Ord_Ship_D, SGodown Where WhNo = Ord_Ship_M.POSId and Ord_Ship_M.POSId=Ord_Ship_D.POSId And Ord_Ship_M.Ord_Id = Ord_Ship_D.Ord_Id and isnull(Ord_Ship_M.Cancelstatus,0) = 0 Group By ItCode, GName, Abbreviation, EDate)   ";
    query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, FItCode ItCode, GName, Abbreviation, ItTransDate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, IsNull(Sum(FQty),0) FQtyMin, 0 FQtyPlus, 0 ReplaceQty  ";
    query+=" From ItemStockTransfer, SGodown Where WhId = WHNo Group By FItCode, GName, Abbreviation, ItTransDate)  ";
    query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, TItCode ItCode, GName, Abbreviation, ItTransDate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, IsNull(Sum(FQty),0) FQtyPlus, 0 ReplaceQty  ";
    query+=" From ItemStockTransfer, SGodown Where WhId = WHNo Group By TItCode, GName, Abbreviation, ItTransDate)  ";
    query+=" Union All (select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty,isnull(sum(qtyIssue),0)qtyIssue, 0 Qty, ItCode, GName, Abbreviation, EntryDate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty  ";
    query+=" from IissueNoteD,IissueNotem , SGodown where IissueNoteD.posid = WHNo and IissueNoteD.issueid=IissueNotem.issueid and IissueNoteD.PosId=IissueNotem.PosId group by itcode,gname,Abbreviation,EntryDate)   ";
    query+=" Union All (select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty,0 qtyIssue, 0 Qty, ItCode, GName, Abbreviation, iDate StockDate, isnull(sum(qtyReturn),0) AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty   ";
    query+=" from IiretissueND,IiretissueNM , SGodown where IiretissueND.Godownid = WHNo and IiretissueND.RetIssuNo=IiretissueNM.RetIssueNo and IiretissueND.Godownid=IiretissueNM.Godownid  and ISNULL(isApproved,0)=1 group by itcode,gname,Abbreviation,iDate)     ";
    query+=" Union All (select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, isnull(-sum(qty),0) AppQty, 0 RejQty,0 qtyIssue, 0 Qty, ItCode, GName, Abbreviation, AdjDate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty  ";
    query+=" from IStoreAdjustment , SGodown where GodownId = whno and OPTVal = 'D' group by itcode,Gname,Abbreviation,AdjDate)   ";
    query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, ItCode, GName, Abbreviation, EntryDate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, ISNULL(SUM(SampleQty),0) POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty  ";
    query+=" From Write_Off_M m, Write_Off_D d, SGodown g Where g.WhNo = m.POSID and m.POSID=d.POSID And m.WOffid = d.WOffid and isnull(m.Cancel,0) = 0  Group By ItCode, GName, Abbreviation, EntryDate)   ";
    query+=" Union All (select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty,0 qtyIssue, 0 Qty, ItCode, GName, Abbreviation, AdjDate StockDate, isnull(sum(qty),0) AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty  ";
    query+=" from IStoreAdjustment , SGodown where GodownId = whno and OPTVal = 'I' group by itcode,Gname,Abbreviation,AdjDate)   ";
    query+=" Union All (select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty,isnull(sum(SampleQty),0) qtyIssue, 0 Qty, ItCode, GName, Abbreviation, EntryDate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty  ";
    query+=" from ISampleIssueNoteM m,ISampleIssueNoteD d , SGodown where m.IssueId = d.IssueId and m.posid = d.posid and m.PosId = whno and isnull(m.Cancel,0) = 0 group by itcode,gname,Abbreviation,entrydate)  ";
    query+=" Union All (select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, isnull(sum(AppQty),0) AppQty, 0 RejQty,0 qtyIssue, 0 Qty, ItCode, GName, Abbreviation, FG_QC_Date StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty  ";
    query+=" from  tb_fg_qcm m,tb_fg_qcD d , SGodown where  m.FG_QC_id = d.FG_QC_id and m.PosId = d.PosId and m.PosId = whno and isnull(m.CancelStatus,0) = 0 group by itcode,gname,Abbreviation,FG_QC_Date) ";
    query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, isnull(Sum(Qty),0)RejQty, 0 QtyIssue, 0 Qty, ItCode, GName, Abbreviation, App_Date StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty  ";
    query+=" From Stock_TypeChage_M m, Stock_TypeChange_D d, SGodown g Where g.WhNo = m.Whid and m.Whid=d.Whid And m.ChangeNo = d.ChangeNo and isnull(m.Cancelstatus,0) = 0 and m.isapproved = 'T'   Group By ItCode, GName, Abbreviation, App_Date)  ";
    query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, isnull(Sum(Qty),0) AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, ItCode, GName, Abbreviation, App_Date StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty  ";
    query+=" From Stock_TypeChage_M m, Stock_TypeChange_D d, SGodown g Where g.WhNo = m.Whid and m.Whid=d.Whid And m.ChangeNo = d.ChangeNo and isnull(m.Cancelstatus,0) = 0 and m.isapproved = 'T'   Group By ItCode, GName, Abbreviation, App_Date)  ";
    query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, IsNull(Sum(Igrnd_reversal.AppQty),0) RejQty, 0 QtyIssue, 0 Qty, Igrnd_reversal.ItCode, GName, Abbreviation, gdate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty  ";
    query+=" From  SGodown,Igrnd_reversal,Igrnm_Reversal,ibincard Where WhNo = Igrnd_reversal.GodownId  and Igrnm_Reversal.GodownId = Igrnd_reversal.GodownId And Igrnm_Reversal.GRNId = Igrnd_reversal.GRNId  and Igrnd_reversal.itcode = ibincard.itcode   and isnull(igrnm_reversal.Cancelstatus,0) = 0  Group By Igrnd_reversal.ItCode,gdate, GName, Abbreviation)  ";
    query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, IsNull(Sum(Stock_Bns_Conv_D.BonusQty),0) RejQty, 0 QtyIssue, 0 Qty, Stock_Bns_Conv_D.ItCode, GName, Abbreviation, Change_Date StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty  ";
    query+=" From  SGodown,Stock_Bns_Conv_D,Stock_Bns_Conv_M,ibincard Where WhNo = Stock_Bns_Conv_D.whId and Stock_Bns_Conv_M.whId = Stock_Bns_Conv_D.whId And Stock_Bns_Conv_M.ChangeNo = Stock_Bns_Conv_D.ChangeNo and Stock_Bns_Conv_D.itcode = ibincard.itcode  Group By Stock_Bns_Conv_D.ItCode,Change_Date, GName, Abbreviation)  ";
    query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, isnull(Sum(STkCNVQty),0) AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, ItCode, GName, Abbreviation, Change_Date StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty  ";
    query+=" From Stock_STK_Conv_M m, Stock_STK_Conv_D d, SGodown g Where g.WhNo = m.Whid and g.WhNo = d.Whid  and m.Whid=d.Whid And m.ChangeNo = d.ChangeNo  Group By ItCode, GName, Abbreviation, Change_Date)  ";
    query+=" ) t, IItems, IBinCard  ";
    query+=" Where IItems.ItCode = t.ItCode And IItems.ItCode = IBinCard.ItCode and IItems.CompanyId= "+companyid+" ";
if(itemcategoryid!="null"){
    query+=" And t.ItCode in (Select ItCode From ibincard Where ITTypeIdN = "+itemcategoryid+") ";
}
if(itemclassid!="null"){
    query+=" And t.ItCode in (Select ItCode From ibincard Where ItemClassID="+itemclassid+" ) ";
}
if(itempackunitid!="null"){
    query+=" And t.ItCode in (Select ItCode From ibincard Where PackingUnitID="+itempackunitid+" ) ";
}
if(itcode!="null"){
    query+=" And t.ItCode in (Select ItCode From IITems Where ItL1 = "+itcode+" Or ItL2 = "+itcode+" Or ItL3 = "+itcode+" Or ItL4 = "+itcode+" ) ";
}
if(date!="null"){
    query+=" And t.StockDate <= '"+date+"' ";
}
if(gname!="null"){
    query+=" And t.GName = '"+gname+"' ";
}
    query+=" Group By IBinCard.ITTypeIdN,IBinCard.ItemClassid,IBinCard.PackingUnitID,IBinCard.BrandName,IBinCard.LeastTime,IBinCard.Mid,t.GName, t.Abbreviation, IItems.ItCodeD, IItems.ItHead, IBinCard.MearsuringUnitDescrp, IItems.itl1, IItems.itl2, IItems.itl3, IItems.itl4 ";
    query+=" having (IsNull(Sum(t.OpnBalance),0)+IsNull(Sum(t.FaultyQty),0)+IsNull(Sum(t.UsedQty),0)+ IsNull(Sum(t.AppQty),0)+IsNull(Sum(t.RejQty),0)+ IsNull(Sum(t.QtyIssue),0)+IsNull(Sum(t.Qty),0)+IsNull(Sum(t.AdjQty),0)+IsNull(Sum(t.STNQtyPls),0)+ IsNull(Sum(t.STNQtyMin),0)+IsNull(Sum(t.POSQty),0) +IsNull(Sum(t.TransitQty),0)+ IsNull(Sum(t.FQtyMin),0) + IsNull(Sum(t.FQtyPlus),0)+IsNull(Sum(t.ReplaceQty),0) ) <> 0 ";
    query+=" Order By  t.GName,IItems.itl1, IItems.itl2, IItems.itl3, IItems.itl4 ";
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
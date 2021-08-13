var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Stock in hand summary report worked");
});
router.get('/GetStockInHandValue/:ItCode/:POSID/:Date/:CompID/:Batched', function (req, res, next) {
    let ItCode= req.params.ItCode;
    let POSID= req.params.POSID;
    let Date= req.params.Date;
    let CompID= req.params.CompID;
    let Batched= req.params.Batched;
    let query="";
    if(Batched==1){
        query+=" Select s.GName, s.Abbreviation, IItems.ItCode, IItems.ItCodeD,IBinCard.BrandName,IBinCard.LeastTime,IBinCard.Mid, IItems.ItHead,IBinCard.MearsuringUnitDescrp as UnitDescrp, IsNull(Sum(t.OpnBalance),0) OpnBalance, IsNull(Sum(t.FaultyQty),0) FaultyQty, IsNull(Sum(t.UsedQty),0) UsedQty,  ";
        query+=" IsNull(Sum(t.AppQty),0) RecQty, IsNull(Sum(t.RejQty),0) RejectQty, IsNull(Sum(t.QtyIssue),0) Issued, IsNull(Sum(t.Qty),0) DebitQty, IsNull(Sum(t.AdjQty),0) AdjQty, IsNull(Sum(t.STNQtyPls),0) STNQtyPls,  ";
        query+=" IsNull(Sum(t.STNQtyMin),0) STNQtyMin, IsNull(Sum(t.POSQty),0) POSQty, IsNull(Sum(t.TransitQty),0) TransitQty, IsNull(Sum(t.FQtyMin),0) FQtyMin, IsNull(Sum(t.FQtyPlus),0) FQtyPlus, IsNull(Sum(t.ReplaceQty),0) ReplaceQty  , ";
        query+=" isnull((sum(t.OpnBalance)+sum(t.AppQty)+sum(t.AdjQty)+sum(t.StnQtyPls)+sum(t.FqtyPlus))-(sum(t.STNQtyMin)+sum(t.POSQTY)+sum(t.FqtyMin)+sum(t.QtyIssue)+sum(t.Qty)+sum(t.RejQty)),0)qty   ,'' StockDate1 ,t.BatchNo Srno, '' PSize , ";
        query+=" t.Expdate,'' Mfgdate,'' Classification,itl1,itl2,itl3,itl4,t.whno,0 BonusQty,0 SupplierId,0 SupplierCode,'' SupplierName,avg(t.itTate)itRate,IsNull(SUM(t.qtyn),0)QtyTot,IsNull(SUM(t.amount),0)Value   ";
        query+=" From(  Select IsNull(Sum(OpnBalance),0) OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, IBinCardD.ItCode, ibincardd.transdate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin,  ";
        query+=" 0 FQtyPlus, 0 ReplaceQty, '' PSize ,Expirydate Expdate,'' Mfgdate,itemFrom BatchNo,GodownId whno,cast(PurchasePrice as money) itTate,IsNull(Sum(OpnBalance),0)QtyN, IsNull(Sum(OpnBalance * cast(PurchasePrice as money) ),0)Amount  ";
        query+=" From IBinCard, IBinCardD Where ItBinCardNo = BinCardId Group By IBinCardD.ItCode,ExpiryDate ,ItemFrom,GodownId ,PurchasePrice,ibincardd.transdate    ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, IsNull(Sum(AppQty),0) AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, IGRND.ItCode, igrnm.GDate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus,  ";
        query+=" 0 ReplaceQty, ''  PSize , Expdate,'' Mfgdate,itemsrFrom BatchNo,igrnm.GodownId whno,cast(CurrRate as money) itTate,IsNull(Sum(AppQty),0)QtyN,IsNull(Sum(AppQty * cast(CurrRate as money)),0)Amount  ";
        query+=" From IGrNM, IGrND,ibincard Where IGRNM.GodownId=IGRND.GodownId And IGrNM.GRNId = IGrND.GRNId and IGRND.itcode = ibincard.itcode  and isnull(IGrNM.Cancelstatus,0) = 0  Group By IGRND.ItCode,  Expdate,ItemSrFrom,igrnm.GodownId ,CurrRate,igrnm.GDate  )    ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, ItCode, ARM_Payment_Reversal.TrnasDate StockDate, IsNull(Sum(Qty),0)+ isnull(sum(bonusqty),0) AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty,  ";
        query+=" 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty, '' PSize , Expdate,'' Mfgdate,fromSr  BatchNo,ARM_Payment_Reversal.POSID Whno,cast(cgs as money)  itTate,IsNull(Sum(Qty),0)+ isnull(sum(bonusqty),0)QtyN,IsNull(Sum((Qty+bonusqty)* cast(cgs as money)),0)Amount   ";
        query+=" From ARM_Payment_Reversal, ARM_Payment_Reversal_D Where  ARM_Payment_Reversal.POSId=ARM_Payment_Reversal_D.whId And ARM_Payment_Reversal.Reversalid = ARM_Payment_Reversal_D.Reversalid and isnull(ARM_Payment_Reversal.Cancelstatus,0) = 0   Group By ItCode, Expdate,fromSr,ARM_Payment_Reversal.POSID ,cgs,ARM_Payment_Reversal.TrnasDate  )   ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, ItemCode ItCode, SGTransferM.TDate StockDate, 0 AdjQty, IsNull(Sum(NormalQtyIssue),0) STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus,  ";
        query+=" 0 ReplaceQty, '' PSize , Expdate,'' Mfgdate,NormalItemFrom BatchNo,g.Whno,cast(supprice as money)itTate,IsNull(Sum(NormalQtyIssue),0)QtyN,IsNull(Sum(NormalQtyIssue * cast(supprice as money)),0)Amount   ";
        query+=" From SGTransferM, SGTransferD, SGodown g Where  sgtransferm.whnofrom = sgtransferd.godownid   and g.WhNo = SGTransferM.WhNOTo    And SGTransferM.MaxCode = SGTransferD.MaxCode  And TransStatus = 1  and isnull(SGTransferM.Cancelstatus,0) = 0 Group By ItemCode, Expdate,NormalItemFrom,g.WhNo ,supprice,SGTransferM.TDate  )   ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, ItemCode ItCode, SGTransferM.TDate StockDate, 0 AdjQty, 0 STNQtyPls, IsNull(Sum(NormalQtyIssue),0) STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus,  ";
        query+=" 0 ReplaceQty, '' PSize , Expdate,'' Mfgdate,NormalItemFrom BatchNo,g.Whno,cast(supprice as money) itTate,IsNull(Sum(-NormalQtyIssue),0)QtyN,IsNull(Sum(-NormalQtyIssue * cast(supprice as money)),0)Amount   ";
        query+=" From SGTransferM, SGTransferD, SGodown g Where  sgtransferm.whnofrom = sgtransferd.godownid   and g.WhNo = SGTransferM.WhNoFrom   And SGTransferM.MaxCode = SGTransferD.MaxCode and isnull(SGTransferM.Cancelstatus,0) = 0  Group By ItemCode, Expdate,NormalItemFrom,g.WhNo ,supprice,SGTransferM.TDate  )   ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, ItCode, Ord_Ship_M.Edate  StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, IsNull(Sum((isnull(B_CurShiped,0)+isnull(St_CurShiped,0)+isnull(Disc_qty,0))),0) POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus,  ";
        query+=" 0 ReplaceQty, '' PSize , Expdate,'' Mfgdate,SrNo BatchNo,Ord_Ship_M.posid Whno,cast(cgs as money) itTate, IsNull(Sum(-(isnull(B_CurShiped,0)+isnull(St_CurShiped,0))),0)QtyN, IsNull(Sum(-(isnull(B_CurShiped,0)+isnull(St_CurShiped,0)+isnull(Disc_qty,0)) * cast(cgs as money)),0) Amount  ";
        query+=" From Ord_Ship_M, Ord_Ship_D Where Ord_Ship_M.POSId=Ord_Ship_D.POSId And Ord_Ship_M.Ord_Id = Ord_Ship_D.Ord_Id and isnull(Ord_Ship_M.Cancelstatus,0) = 0 Group By ItCode, Expdate,SrNo,Ord_Ship_M.posid ,cgs,Ord_Ship_M.Edate  )   ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, FItCode ItCode, ItTransDate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, IsNull(Sum(FQty),0) FQtyMin, 0 FQtyPlus, 0 ReplaceQty,  ";
        query+=" '' PSize , '' expdate,'' Mfgdate,'' BatchNo,ItemStockTransfer.WhId Whno,0 itTate, IsNull(Sum(-FQty),0) QtyN, IsNull(Sum(-FQty),0) Amount  ";
        query+=" From ItemStockTransfer Group By FItCode, ItTransDate,ItemStockTransfer.WhId)   ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, TItCode ItCode, ItTransDate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, IsNull(Sum(FQty),0) FQtyPlus, 0 ReplaceQty,  ";
        query+=" '' PSize , '' Expdate,'' Mfgdate,'' BatchNo,ItemStockTransfer.WhId Whno,0 itTate, IsNull(Sum(FQty),0) QtyN, IsNull(Sum(FQty),0) Amount  ";
        query+=" From ItemStockTransfer  Group By TItCode, ItTransDate,ItemStockTransfer.WhId)   ";
        query+=" Union All (select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty,isnull(sum(qtyIssue),0)qtyIssue, 0 Qty, ItCode, IissueNotem.EntryDate  StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty,  ";
        query+=" '' PSize , Expdate,'' Mfgdate, IissueNoteD.BatchNo,IissueNotem.posid  Whno,cast(cgs as money) itTate,isnull(sum(-qtyIssue),0)QtyN,isnull(sum(-qtyIssue * cast(cgs as money)),0)Amount  ";
        query+=" from IissueNoteD,IissueNotem  where IissueNoteD.issueid=IissueNotem.issueid and IissueNoteD.PosId=IissueNotem.PosId group by itcode,Expdate, IissueNoteD.BatchNo,IissueNotem.posid ,CGS,IissueNotem.EntryDate )   ";
        query+=" Union All (select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty,0 qtyIssue, 0 Qty, ItCode, IiRetIssueNM.IDate  StockDate, isnull(sum(qtyReturn),0) AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty,  ";
        query+=" '' PSize , Expdate,'' Mfgdate, SrNoFrom BatchNo,IiretissueNM.GodownId whno ,cast(cgs as money) itTate, isnull(sum(qtyReturn),0) QtyN, isnull(sum(qtyReturn * cast(cgs as money)),0) Amount   ";
        query+=" from IiretissueND,IiretissueNM  where  IiretissueND.RetIssuNo=IiretissueNM.RetIssueNo and IiretissueND.Godownid=IiretissueNM.Godownid  and ISNULL(isApproved,0)=1 group by itcode,Expdate,SrNoFrom,IiretissueNM.GodownId ,CGS, IiRetIssueNM.IDate  )   ";
        query+=" Union All (select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty,0 qtyIssue, 0 Qty, ItCode, IStoreAdjustment.AdjDate  StockDate, isnull(sum(qty),0) AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty,  ";
        query+=" '' PSize , Expdate,'' Mfgdate,SrNoFrom BatchNo,GodownId whno ,cast(ItRate as money)  itTate, isnull(sum(qty),0) QtyN, isnull(sum(qty * cast(ItRate as money)),0) Amount  ";
        query+=" from IStoreAdjustment  where OPTVal = 'D' group by itcode,Expdate,SrNoFrom,GodownId ,ItRate, IStoreAdjustment.AdjDate )   ";
        query+=" Union All (select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty,0 qtyIssue, 0 Qty, ItCode, IStoreAdjustment.AdjDate StockDate, isnull(sum(qty),0) AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty,  ";
        query+=" '' PSize , Expdate,'' Mfgdate,SrNoFrom BatchNo,GodownId whno ,cast(ItRate as money)  itTate, isnull(sum(qty),0)QtyN, isnull(sum(qty * cast(ItRate as money)),0)Amount  ";
        query+=" from IStoreAdjustment  where OPTVal = 'I' group by itcode,Expdate,SrNoFrom,GodownId ,ItRate, IStoreAdjustment.AdjDate )  ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, ItCode, m.EntryDate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, ISNULL(SUM(SampleQty),0) POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty,  ";
        query+=" '' PSize , Expdate,'' Mfgdate,BatchNo,m.PosId whno , cast(SIRate as money) itTate, ISNULL(SUM(-SampleQty),0)QtyN, ISNULL(SUM(-SampleQty * cast(SIRate as money)),0)Amount  ";
        query+=" From Write_Off_M m, Write_Off_D d  Where  m.POSID=d.POSID And m.WOffid = d.WOffid and isnull(m.Cancel,0) = 0  Group By ItCode, Expdate,BatchNo,m.PosId , SIRate, m.EntryDate )   ";
        query+=" Union All (select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty,isnull(sum(SampleQty),0) qtyIssue, 0 Qty, ItCode, m.EntryDate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty,  ";
        query+=" '' PSize , Expdate,'' Mfgdate, BatchNo,m.PosId whno , cast(SIRate as money) itTate,isnull(sum(-SampleQty),0)QtyN,isnull(sum(-SampleQty * cast(SIRate as money)),0)Amount  ";
        query+=" from ISampleIssueNoteM m,ISampleIssueNoteD d  where m.IssueId = d.IssueId and m.posid = d.posid and isnull(m.Cancel,0) = 0 group by itcode,Expdate,BatchNo,m.PosId  , SIRate, m.EntryDate )   ";
        query+=" Union All (select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, isnull(sum(AppQty),0) AppQty, 0 RejQty,0 qtyIssue, 0 Qty, ItCode, m.FG_QC_Date  StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty,  ";
        query+=" '' PSize ,Expirydate Expdate,'' Mfgdate,BatchNo, m.POSID whno ,cast(itRate as money) itTate, isnull(sum(AppQty),0)QtyN, isnull(sum(AppQty * cast(itRate as money)),0)Amount  ";
        query+=" from  tb_fg_qcm m,tb_fg_qcD d  where  m.FG_QC_id = d.FG_QC_id and m.PosId = d.PosId  and isnull(m.CancelStatus,0) = 0 group by itcode,Expirydate,batchno, m.POSID ,itRate, m.FG_QC_Date )   ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, isnull(Sum(Qty),0)RejQty, 0 QtyIssue, 0 Qty, ItCode, m.Change_Date StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty,  ";
        query+=" '' PSize , Expdate,'' Mfgdate, SrFrom BatchNo, m.WhID whno ,0 itTate, isnull(Sum(-Qty),0)QtyN, isnull(Sum(-Qty),0)Amount   ";
        query+=" From Stock_TypeChage_M m, Stock_TypeChange_D d Where  m.Whid=d.Whid And m.ChangeNo = d.ChangeNo and isnull(m.Cancelstatus,0) = 0 and m.isapproved = 'T'   Group By ItCode, Expdate,SrFrom, m.WhID, m.Change_Date  )   ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, isnull(Sum(Qty),0) AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, ItCode, m.Change_Date StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty,  ";
        query+=" '' PSize , Expdate,'' Mfgdate,SrFrom BatchNo, m.WhID whno ,0 itTate, isnull(Sum(Qty),0)QtyN, isnull(Sum(Qty),0)Amount   ";
        query+=" From Stock_TypeChage_M m, Stock_TypeChange_D d Where  m.Whid=d.Whid And m.ChangeNo = d.ChangeNo and isnull(m.Cancelstatus,0) = 0 and m.isapproved = 'T'   Group By ItCode, Expdate,SrFrom, m.WhID, m.Change_Date  )   ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, IsNull(Sum(Igrnd_reversal.AppQty),0) RejQty, 0 QtyIssue, 0 Qty, Igrnd_reversal.ItCode, Igrnm_Reversal.GDate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, ";
        query+=" 0 ReplaceQty, '' PSize , Expdate,'' Mfgdate,ItemSrFrom BatchNo, Igrnm_Reversal.GodownId whno ,cast(CurrRate as money) Rate, IsNull(Sum(-Igrnd_reversal.AppQty),0)QtyN, IsNull(Sum(-Igrnd_reversal.AppQty * cast(CurrRate as money)),0)Amount   ";
        query+=" From  Igrnd_reversal,Igrnm_Reversal,ibincard Where  Igrnm_Reversal.GodownId = Igrnd_reversal.GodownId And Igrnm_Reversal.GRNId = Igrnd_reversal.GRNId  and Igrnd_reversal.itcode = ibincard.itcode   and isnull(igrnm_reversal.Cancelstatus,0) = 0  Group By Igrnd_reversal.ItCode,Expdate,ItemSrFrom, Igrnm_Reversal.GodownId ,CurrRate, Igrnm_Reversal.GDate )   ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, IsNull(Sum(Stock_Bns_Conv_D.BonusQty),0) RejQty, 0 QtyIssue, 0 Qty, Stock_Bns_Conv_D.ItCode, Stock_Bns_Conv_M.Change_Date  StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin,  ";
        query+=" 0 FQtyPlus, 0 ReplaceQty, '' PSize , Expdate,'' Mfgdate, BatchNo, Stock_Bns_Conv_M.WhID whno ,0 itTate, IsNull(Sum(-Stock_Bns_Conv_D.BonusQty),0)QtyN, IsNull(Sum(-Stock_Bns_Conv_D.BonusQty),0)Amount  ";
        query+=" From  Stock_Bns_Conv_D,Stock_Bns_Conv_M,ibincard Where  Stock_Bns_Conv_M.whId = Stock_Bns_Conv_D.whId And Stock_Bns_Conv_M.ChangeNo = Stock_Bns_Conv_D.ChangeNo and Stock_Bns_Conv_D.itcode = ibincard.itcode  Group By Stock_Bns_Conv_D.ItCode,Expdate,BatchNo, Stock_Bns_Conv_M.WhID, Stock_Bns_Conv_M.Change_Date )   ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, isnull(Sum(STkCNVQty),0) AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, ItCode, m.Change_Date  StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty,  ";
        query+=" '' PSize , Expdate,'' Mfgdate, BatchNo, m.WhID  whno ,0 itTate,isnull(Sum(STkCNVQty),0)QtyN, isnull(Sum(STkCNVQty),0)Amount  ";
        query+=" From Stock_STK_Conv_M m, Stock_STK_Conv_D d Where   m.Whid=d.Whid And m.ChangeNo = d.ChangeNo  Group By ItCode, Expdate,BatchNo, m.WhID, m.Change_Date )   ";
        query+=" ) t, IItems, IBinCard,sgodown s    ";
        query+=" Where IItems.ItCode = T.ItCode And IItems.ItCode = IBinCard.ItCode and s.Whno = t.whno  and IItems.CompanyId="+CompID+" ";
        if(POSID!="null"){
        query+=" and t.whno = "+POSID+" ";
        }
        if(ItCode!="null"){
        query+=" and t.itcode= "+ItCode+" ";
        }
        if(Date!="null"){
        query+=" and t.StockDate <= '"+Date+"' ";
        }
        query+=" Group By s.GName, s.Abbreviation, IItems.ItCode, IItems.ItCodeD,IBinCard.BrandName,IBinCard.LeastTime,IBinCard.Mid, IItems.ItHead,IBinCard.MearsuringUnitDescrp, IItems.itl1, IItems.itl2, IItems.itl3, IItems.itl4,t.whno,t.BatchNo,t.Expdate  ";
        query+=" Having (IsNull((Sum(T.OpnBalance) + Sum(T.AppQty) + Sum(T.AdjQty) + Sum(T.StnQtyPls) + Sum(T.FqtyPlus)) - (Sum(T.STNQtyMin) + Sum(T.POSQTY) + Sum(T.FqtyMin) + Sum(T.QtyIssue) + Sum(T.Qty) + Sum(T.RejQty)), 0)) <> 0   ";
        query+=" Order By  s.GName,IItems.itl1, IItems.itl2, IItems.itl3, IItems.itl4 ";
    }
    else{
        query+=" Select s.GName, s.Abbreviation, IItems.ItCode, IItems.ItCodeD,IBinCard.BrandName,IBinCard.LeastTime,IBinCard.Mid, IItems.ItHead, IBinCard.MearsuringUnitDescrp as UnitDescrp, IsNull(Sum(t.OpnBalance),0) OpnBalance, IsNull(Sum(t.FaultyQty),0) FaultyQty, IsNull(Sum(t.UsedQty),0) UsedQty,  ";
        query+=" IsNull(Sum(t.AppQty),0) RecQty, IsNull(Sum(t.RejQty),0) RejectQty, IsNull(Sum(t.QtyIssue),0) Issued, IsNull(Sum(t.Qty),0) DebitQty, IsNull(Sum(t.AdjQty),0) AdjQty, IsNull(Sum(t.STNQtyPls),0) STNQtyPls,  ";
        query+=" IsNull(Sum(t.STNQtyMin),0) STNQtyMin, IsNull(Sum(t.POSQty),0) POSQty, IsNull(Sum(t.TransitQty),0) TransitQty, IsNull(Sum(t.FQtyMin),0) FQtyMin, IsNull(Sum(t.FQtyPlus),0) FQtyPlus, IsNull(Sum(t.ReplaceQty),0) ReplaceQty   ";
        query+=" ,isnull((sum(t.OpnBalance)+sum(t.AppQty)+sum(t.AdjQty)+sum(t.StnQtyPls)+sum(t.FqtyPlus))-(sum(t.STNQtyMin)+sum(t.POSQTY)+sum(t.FqtyMin)+sum(t.QtyIssue)+sum(t.Qty)+sum(t.RejQty)),0)qty   ,'' StockDate1 ,'' Srno, '' PSize , ";
        query+=" '' Expdate,'' Mfgdate,'' Classification,itl1,itl2,itl3,itl4,t.whno,0 BonusQty,0 SupplierId,0 SupplierCode,'' SupplierName,avg(t.itTate)itRate,IsNull(SUM(t.qtyn),0)QtyTot,IsNull(SUM(t.amount),0)Value   ";
        query+=" From(  Select IsNull(Sum(OpnBalance),0) OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, IBinCardD.ItCode, ibincardd.transdate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty,  ";
        query+=" 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty, '' PSize ,Expirydate Expdate,'' Mfgdate,itemFrom BatchNo,GodownId whno,cast(PurchasePrice as money) itTate,IsNull(Sum(OpnBalance),0)QtyN,  ";
        query+=" IsNull(Sum(OpnBalance * cast(PurchasePrice as money) ),0)Amount  ";
        query+=" From IBinCard, IBinCardD Where ItBinCardNo = BinCardId Group By IBinCardD.ItCode,ExpiryDate ,ItemFrom,GodownId ,PurchasePrice,ibincardd.transdate    ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, IsNull(Sum(AppQty),0) AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, IGRND.ItCode, igrnm.GDate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus,  ";
        query+=" 0 ReplaceQty, ''  PSize , Expdate,'' Mfgdate,itemsrFrom BatchNo,igrnm.GodownId whno,cast(CurrRate as money) itTate,IsNull(Sum(AppQty),0)QtyN,IsNull(Sum(AppQty * cast(CurrRate as money)),0)Amount  ";
        query+=" From IGrNM, IGrND,ibincard Where IGRNM.GodownId=IGRND.GodownId And IGrNM.GRNId = IGrND.GRNId and IGRND.itcode = ibincard.itcode  and isnull(IGrNM.Cancelstatus,0) = 0  Group By IGRND.ItCode,  Expdate,ItemSrFrom,igrnm.GodownId ,CurrRate,igrnm.GDate  )    ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, ItCode, ARM_Payment_Reversal.TrnasDate StockDate, IsNull(Sum(Qty),0)+ isnull(sum(bonusqty),0) AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty,  ";
        query+=" 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty, '' PSize , Expdate,'' Mfgdate,fromSr  BatchNo,ARM_Payment_Reversal.POSID Whno,cast(cgs as money)  itTate,IsNull(Sum(Qty),0)+ isnull(sum(bonusqty),0)QtyN, ";
        query+=" IsNull(Sum((Qty+bonusqty)* cast(cgs as money)),0)Amount   ";
        query+=" From ARM_Payment_Reversal, ARM_Payment_Reversal_D Where  ARM_Payment_Reversal.POSId=ARM_Payment_Reversal_D.whId And ARM_Payment_Reversal.Reversalid = ARM_Payment_Reversal_D.Reversalid and isnull(ARM_Payment_Reversal.Cancelstatus,0) = 0   Group By ItCode, Expdate,fromSr,ARM_Payment_Reversal.POSID ,cgs,ARM_Payment_Reversal.TrnasDate  )   ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, ItemCode ItCode, SGTransferM.TDate StockDate, 0 AdjQty, IsNull(Sum(NormalQtyIssue),0) STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty,  ";
        query+=" 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty, '' PSize , Expdate,'' Mfgdate,NormalItemFrom BatchNo,g.Whno,cast(supprice as money)itTate,IsNull(Sum(NormalQtyIssue),0)QtyN,IsNull(Sum(NormalQtyIssue * cast(supprice as money)),0)Amount   ";
        query+=" From SGTransferM, SGTransferD, SGodown g Where  sgtransferm.whnofrom = sgtransferd.godownid  and g.WhNo = SGTransferM.WhNOTo  and sgtransferm.whnofrom = sgtransferd.godownid   And SGTransferM.MaxCode = SGTransferD.MaxCode  And TransStatus = 1  and isnull(SGTransferM.Cancelstatus,0) = 0 Group By ItemCode, Expdate,NormalItemFrom,g.WhNo ,supprice,SGTransferM.TDate  )   ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, ItemCode ItCode, SGTransferM.TDate StockDate, 0 AdjQty, 0 STNQtyPls, IsNull(Sum(NormalQtyIssue),0) STNQtyMin, 0 POSQty, 0 TransitQty,  ";
        query+=" 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty, '' PSize , Expdate,'' Mfgdate,NormalItemFrom BatchNo,g.Whno,cast(supprice as money) itTate,IsNull(Sum(-NormalQtyIssue),0)QtyN,IsNull(Sum(-NormalQtyIssue * cast(supprice as money)),0)Amount   ";
        query+=" From SGTransferM, SGTransferD, SGodown g Where  sgtransferm.whnofrom = sgtransferd.godownid  and g.WhNo = SGTransferM.WhNoFrom  and sgtransferm.whnofrom = sgtransferd.godownid   And SGTransferM.MaxCode = SGTransferD.MaxCode and isnull(SGTransferM.Cancelstatus,0) = 0  Group By ItemCode, Expdate,NormalItemFrom,g.WhNo ,supprice,SGTransferM.TDate  )   ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, ItCode, Ord_Ship_M.Edate  StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, IsNull(Sum((isnull(B_CurShiped,0)+isnull(St_CurShiped,0)+isnull(Disc_qty,0))),0) POSQty,  ";
        query+=" 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty, '' PSize , Expdate,'' Mfgdate,SrNo BatchNo,Ord_Ship_M.posid Whno,cast(cgs as money) itTate, IsNull(Sum(-(isnull(B_CurShiped,0)+isnull(St_CurShiped,0)+isnull(Disc_qty,0))),0)QtyN,  ";
        query+=" IsNull(Sum(-(isnull(B_CurShiped,0)+isnull(St_CurShiped,0)+isnull(Disc_qty,0)) * cast(cgs as money)),0) Amount  ";
        query+=" From Ord_Ship_M, Ord_Ship_D Where Ord_Ship_M.POSId=Ord_Ship_D.POSId And Ord_Ship_M.Ord_Id = Ord_Ship_D.Ord_Id and isnull(Ord_Ship_M.Cancelstatus,0) = 0 Group By ItCode, Expdate,SrNo,Ord_Ship_M.posid ,cgs,Ord_Ship_M.Edate  )   ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, FItCode ItCode, ItTransDate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, IsNull(Sum(FQty),0) FQtyMin, 0 FQtyPlus,  ";
        query+=" 0 ReplaceQty, '' PSize , '' expdate,'' Mfgdate,'' BatchNo,ItemStockTransfer.WhId Whno,0 itTate, IsNull(Sum(-FQty),0) QtyN, IsNull(Sum(-FQty),0) Amount  ";
        query+=" From ItemStockTransfer Group By FItCode, ItTransDate,ItemStockTransfer.WhId)   ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, TItCode ItCode, ItTransDate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, IsNull(Sum(FQty),0) FQtyPlus,  ";
        query+=" 0 ReplaceQty, '' PSize , '' Expdate,'' Mfgdate,'' BatchNo,ItemStockTransfer.WhId Whno,0 itTate, IsNull(Sum(FQty),0) QtyN, IsNull(Sum(FQty),0) Amount  ";
        query+=" From ItemStockTransfer  Group By TItCode, ItTransDate,ItemStockTransfer.WhId)  ";
        query+=" Union All (select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty,isnull(sum(qtyIssue),0)qtyIssue, 0 Qty, ItCode, IissueNotem.EntryDate  StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin,  ";
        query+=" 0 FQtyPlus, 0 ReplaceQty, '' PSize , Expdate,'' Mfgdate, IissueNoteD.BatchNo,IissueNotem.posid  Whno,cast(cgs as money) itTate,isnull(sum(-qtyIssue),0)QtyN,isnull(sum(-qtyIssue * cast(cgs as money)),0)Amount  ";
        query+=" from IissueNoteD,IissueNotem  where IissueNoteD.issueid=IissueNotem.issueid and IissueNoteD.PosId=IissueNotem.PosId group by itcode,Expdate, IissueNoteD.BatchNo,IissueNotem.posid ,CGS,IissueNotem.EntryDate )  ";
        query+=" Union All (select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty,0 qtyIssue, 0 Qty, ItCode, IiRetIssueNM.IDate  StockDate, isnull(sum(qtyReturn),0) AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin,  ";
        query+=" 0 FQtyPlus, 0 ReplaceQty, '' PSize , Expdate,'' Mfgdate,SrNoFrom BatchNo,IiretissueNM.GodownId whno ,cast(cgs as money) itTate, isnull(sum(qtyReturn),0) QtyN, isnull(sum(qtyReturn * cast(cgs as money)),0) Amount   ";
        query+=" from IiretissueND,IiretissueNM  where  IiretissueND.RetIssuNo=IiretissueNM.RetIssueNo and IiretissueND.Godownid=IiretissueNM.Godownid  and ISNULL(isApproved,0)=1 group by itcode,Expdate,SrNoFrom,IiretissueNM.GodownId ,CGS, IiRetIssueNM.IDate  )   ";
        query+=" Union All (select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty,0 qtyIssue, 0 Qty, ItCode, IStoreAdjustment.AdjDate  StockDate,  isnull(-sum(qty),0) AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin,  ";
        query+=" 0 FQtyPlus, 0 ReplaceQty, '' PSize , Expdate,'' Mfgdate,SrNoFrom BatchNo,GodownId whno ,cast(ItRate as money)  itTate, isnull(sum(qty),0) QtyN, isnull(sum(qty * cast(ItRate as money)),0) Amount  ";
        query+=" from IStoreAdjustment  where OPTVal = 'D' group by itcode,Expdate,SrNoFrom,GodownId ,ItRate, IStoreAdjustment.AdjDate )   ";
        query+=" Union All (select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty,0 qtyIssue, 0 Qty, ItCode, IStoreAdjustment.AdjDate StockDate, isnull(sum(qty),0) AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin,  ";
        query+=" 0 FQtyPlus, 0 ReplaceQty, '' PSize , Expdate,'' Mfgdate,SrNoFrom BatchNo,GodownId whno ,cast(ItRate as money)  itTate, isnull(sum(qty),0)QtyN, isnull(sum(qty * cast(ItRate as money)),0)Amount  ";
        query+=" from IStoreAdjustment  where OPTVal = 'I' group by itcode,Expdate,SrNoFrom,GodownId ,ItRate, IStoreAdjustment.AdjDate )   ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, ItCode, m.EntryDate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, ISNULL(SUM(SampleQty),0) POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus,  ";
        query+=" 0 ReplaceQty, '' PSize , Expdate,'' Mfgdate,BatchNo,m.PosId whno , cast(SIRate as money) itTate, ISNULL(SUM(-SampleQty),0)QtyN, ISNULL(SUM(-SampleQty * cast(SIRate as money)),0)Amount  ";
        query+=" From Write_Off_M m, Write_Off_D d  Where  m.POSID=d.POSID And m.WOffid = d.WOffid and isnull(m.Cancel,0) = 0  Group By ItCode, Expdate,BatchNo,m.PosId , SIRate, m.EntryDate )   ";
        query+=" Union All (select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, 0 RejQty,isnull(sum(SampleQty),0) qtyIssue, 0 Qty, ItCode, m.EntryDate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus,  ";
        query+=" 0 ReplaceQty, '' PSize , Expdate,'' Mfgdate, BatchNo,m.PosId whno , cast(SIRate as money) itTate,isnull(sum(-SampleQty),0)QtyN,isnull(sum(-SampleQty * cast(SIRate as money)),0)Amount  ";
        query+=" from ISampleIssueNoteM m,ISampleIssueNoteD d  where m.IssueId = d.IssueId and m.posid = d.posid and isnull(m.Cancel,0) = 0 group by itcode,Expdate,BatchNo,m.PosId  , SIRate, m.EntryDate )   ";
        query+=" Union All (select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, isnull(sum(AppQty),0) AppQty, 0 RejQty,0 qtyIssue, 0 Qty, ItCode, m.FG_QC_Date  StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus,  ";
        query+=" 0 ReplaceQty, '' PSize ,Expirydate Expdate,'' Mfgdate,BatchNo, m.POSID whno ,cast(itRate as money) itTate, isnull(sum(AppQty),0)QtyN, isnull(sum(AppQty * cast(itRate as money)),0)Amount  ";
        query+=" from  tb_fg_qcm m,tb_fg_qcD d  where  m.FG_QC_id = d.FG_QC_id and m.PosId = d.PosId  and isnull(m.CancelStatus,0) = 0 group by itcode,Expirydate,batchno, m.POSID ,itRate, m.FG_QC_Date )   ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, isnull(Sum(Qty),0)RejQty, 0 QtyIssue, 0 Qty, ItCode, m.Change_Date StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus,  ";
        query+=" 0 ReplaceQty, '' PSize , Expdate,'' Mfgdate, SrFrom BatchNo, m.WhID whno ,0 itTate, isnull(Sum(-Qty),0)QtyN, isnull(Sum(-Qty),0)Amount   ";
        query+=" From Stock_TypeChage_M m, Stock_TypeChange_D d Where  m.Whid=d.Whid And m.ChangeNo = d.ChangeNo and isnull(m.Cancelstatus,0) = 0 and m.isapproved = 'T'   Group By ItCode, Expdate,SrFrom, m.WhID, m.Change_Date  )   ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, isnull(Sum(Qty),0) AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, ItCode, m.Change_Date StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus,  ";
        query+=" 0 ReplaceQty, '' PSize , Expdate,'' Mfgdate,SrFrom BatchNo, m.WhID whno ,0 itTate, isnull(Sum(Qty),0)QtyN, isnull(Sum(Qty),0)Amount   ";
        query+=" From Stock_TypeChage_M m, Stock_TypeChange_D d Where  m.Whid=d.Whid And m.ChangeNo = d.ChangeNo and isnull(m.Cancelstatus,0) = 0 and m.isapproved = 'T'   Group By ItCode, Expdate,SrFrom, m.WhID, m.Change_Date  )   ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, IsNull(Sum(Igrnd_reversal.AppQty),0) RejQty, 0 QtyIssue, 0 Qty, Igrnd_reversal.ItCode, Igrnm_Reversal.GDate StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, ";
        query+=" 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty, '' PSize , Expdate,'' Mfgdate,ItemSrFrom BatchNo, Igrnm_Reversal.GodownId whno ,cast(CurrRate as money) Rate, IsNull(Sum(-Igrnd_reversal.AppQty),0)QtyN,  ";
        query+=" IsNull(Sum(-Igrnd_reversal.AppQty * cast(CurrRate as money)),0)Amount   ";
        query+=" From  Igrnd_reversal,Igrnm_Reversal,ibincard Where  Igrnm_Reversal.GodownId = Igrnd_reversal.GodownId And Igrnm_Reversal.GRNId = Igrnd_reversal.GRNId  and Igrnd_reversal.itcode = ibincard.itcode  and isnull(igrnm_reversal.Cancelstatus,0) = 0  Group By Igrnd_reversal.ItCode,Expdate,ItemSrFrom, Igrnm_Reversal.GodownId ,CurrRate, Igrnm_Reversal.GDate )   ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, 0 AppQty, IsNull(Sum(Stock_Bns_Conv_D.BonusQty),0) RejQty, 0 QtyIssue, 0 Qty, Stock_Bns_Conv_D.ItCode, Stock_Bns_Conv_M.Change_Date  StockDate, 0 AdjQty, 0 STNQtyPls,  ";
        query+=" 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty, '' PSize , Expdate,'' Mfgdate, BatchNo, Stock_Bns_Conv_M.WhID whno ,0 itTate, IsNull(Sum(-Stock_Bns_Conv_D.BonusQty),0)QtyN,  ";
        query+=" IsNull(Sum(-Stock_Bns_Conv_D.BonusQty),0)Amount  ";
        query+=" From  Stock_Bns_Conv_D,Stock_Bns_Conv_M,ibincard Where  Stock_Bns_Conv_M.whId = Stock_Bns_Conv_D.whId And Stock_Bns_Conv_M.ChangeNo = Stock_Bns_Conv_D.ChangeNo and Stock_Bns_Conv_D.itcode = ibincard.itcode  Group By Stock_Bns_Conv_D.ItCode,Expdate,BatchNo, Stock_Bns_Conv_M.WhID, Stock_Bns_Conv_M.Change_Date )   ";
        query+=" Union All (Select 0 OpnBalance, 0 FaultyQty, 0 UsedQty, isnull(Sum(STkCNVQty),0) AppQty, 0 RejQty, 0 QtyIssue, 0 Qty, ItCode, m.Change_Date  StockDate, 0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin,  ";
        query+=" 0 FQtyPlus, 0 ReplaceQty, '' PSize , Expdate,'' Mfgdate, BatchNo, m.WhID  whno ,0 itTate,isnull(Sum(STkCNVQty),0)QtyN, isnull(Sum(STkCNVQty),0)Amount  ";
        query+=" From Stock_STK_Conv_M m, Stock_STK_Conv_D d Where   m.Whid=d.Whid And m.ChangeNo = d.ChangeNo  Group By ItCode, Expdate,BatchNo, m.WhID, m.Change_Date )   ";
        query+=" ) t, IItems, IBinCard,sgodown s   ";
        query+=" Where IItems.ItCode = T.ItCode And IItems.ItCode = IBinCard.ItCode and s.Whno = t.whno and IItems.CompanyId="+CompID+" ";
        if(POSID!="null"){
        query+=" and t.whno = "+POSID+" ";
        }
        if(ItCode!="null"){
        query+=" and t.itcode = "+ItCode+" ";
        }
        if(Date!="null"){
        query+=" and t.StockDate <= '"+Date+"' ";
        }
        query+=" Group By s.GName, s.Abbreviation, IItems.ItCode, IItems.ItCodeD,IBinCard.BrandName,IBinCard.LeastTime,IBinCard.Mid, IItems.ItHead, IBinCard.MearsuringUnitDescrp, IItems.itl1, IItems.itl2, IItems.itl3, IItems.itl4,t.whno  ";
        query+=" Having (IsNull((Sum(T.OpnBalance) + Sum(T.AppQty) + Sum(T.AdjQty) + Sum(T.StnQtyPls) + Sum(T.FqtyPlus)) - (Sum(T.STNQtyMin) + Sum(T.POSQTY) + Sum(T.FqtyMin) + Sum(T.QtyIssue) + Sum(T.Qty) + Sum(T.RejQty)), 0)) <> 0   ";
        query+=" Order By  s.GName,IItems.itl1, IItems.itl2, IItems.itl3, IItems.itl4 "; 
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
router.get('/GetStockInHandValueOpening/:ItCode/:POSID/:CompID', function (req, res, next) {
    let ItCode= req.params.ItCode;
    let POSID= req.params.POSID;
    let CompID= req.params.CompID;
    let query="Select gname,abbreviation,ibincardd.itcode,ibincard.BrandName,ibincard.LeastTime,ibincard.Mid,itcoded,iitems.ithead,IBinCard.MearsuringUnitDescrp as UnitDescrp,IsNull(Sum(OpnBalance),0) OpnQty, IsNull(Sum(FaultyQty),0) FaultyQty, IsNull(Sum(UsedQty),0) UsedQty, 0 RecQty, 0 RejectQty, 0 Issued,  ";
    query+=" 0 DebitQty,0 AdjQty, 0 STNQtyPls, 0 STNQtyMin, 0 POSQty, 0 TransitQty, 0 FQtyMin, 0 FQtyPlus, 0 ReplaceQty  ,IsNull(Sum(OpnBalance),0) Qty,transdate StockDate1,itemfrom Srno,expirydate, 1 classification,itl1,itl2,itl3,itl4,whno, ";
    query+=" 0 bonusqty,supplierid,isnull((select Partycode from usuppliers where usuppliers.scode = ibincard.supplierid),'') suppliercode, isnull((select SName from usuppliers where usuppliers.scode = ibincard.supplierid),'') suppliername, ";
    query+=" PurchasePrice itRate,IsNull(Sum(OpnBalance),0) QtyTot,PurchasePrice * IsNull(Sum(OpnBalance),0)Value  ";
    query+=" From IBinCard, IBinCardD, SGodown,iitems ";
    query+=" Where WhNo = GodownId And ItBinCardNo = BinCardId  And IItems.ItCode = IBinCard.ItCode   ";
    if(ItCode!="null"){
    query+=" And IItems.ItCode in (Select ItCode From IITems Where ItL1 = "+ItCode+" Or ItL2 = "+ItCode+" Or ItL3 = "+ItCode+" Or ItL4 = "+ItCode+" )  ";
    }
    if(POSID!="null"){
    query+=" and whno = "+POSID+" ";
    }
    query+=" and IBinCard.CompanyId="+CompID+" ";
    query+=" Group By expirydate,IBinCardD.ItemFrom,gname,abbreviation,ibincardd.itcode,itcoded,ibincard.BrandName,ibincard.LeastTime,ibincard.Mid,iitems.ithead,IBinCard.MearsuringUnitDescrp,IBinCardD.ItCode, GName,transdate, Abbreviation,whno,itemfrom,itl1,itl2,itl3,itl4,PurchasePrice,expirydate,supplierid ";
    query+=" Order By Gname,itl1,itl2,itl3,itl4";
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
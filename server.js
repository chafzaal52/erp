var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Mango Api's :)
var indexRouter = require('./routes/index');
var ReportSettingRouter = require('./routes/ReportSetting');
var TherapticRouter = require('./routes/TherapticClass');
var StoreRouter = require('./routes/StoreDefinition');
var RackRouter = require('./routes/RackDefinition');
var ShelfRouter = require('./routes/ShelfDefinition');
var TollRouter = require('./routes/TollParty');
var LocationRouter = require('./routes/Job_Locat');
var AdjustmentRouter = require('./routes/AdjustmentReason');
var QualityRouter = require('./routes/QualityTest');
var UsersRouter = require('./routes/Users');
var CommonddlRouter = require('./routes/Commonddl');
var BrandRouter = require('./routes/Brand');
var MearsuringUnitRouter = require('./routes/MearsuringUnit');
var ItemTypeNRouter = require('./routes/ItemTypeN');
var UnitConversionRouter = require('./routes/UnitConversion');
var CategoryDefinitionRouter = require('./routes/CategoryDefinition');
var ClassDefinitionRouter = require('./routes/ClassDefinition');
var DeliveryPersonRouter = require('./routes/DeliveryPerson');
var DiscountRateRouter = require('./routes/DiscountRate');
var Regional_MgrRouter = require('./routes/Regional_Mgr');
var RepMgrRouter = require('./routes/RepMgr');
var MedicalRepRouter = require('./routes/MedicalRep');
var tb_SalRetResnRouter = require('./routes/tb_SalRetResn');
var ProductProfilerRouter = require('./routes/ProductProfiler');
var TestAllocationRouter = require('./routes/TestAllocation');
var SalesTypeRouter = require('./routes/SalesType');
var SalesManRouter = require('./routes/SalesMan');
var DesignationDefRouter = require('./routes/DesignationDef');
var CountryRouter = require('./routes/Country');
var RegionRouter = require('./routes/Region');
var CityRouter = require('./routes/City');
var PackingUnitRouter = require('./routes/PackingUnit');
var IItemsRouter = require('./routes/IItems');
var IBinCardRouter = require('./routes/IBinCard');
var IBinCardDRouter = require('./routes/IBinCardD');
var CRM_Services_MRouter = require('./routes/CRM_Services_M');
var CRM_Services_DRouter = require('./routes/CRM_Services_D');
var CRM_Services_DDRouter = require('./routes/CRM_Services_DD');
var UserLocationRouter = require('./routes/UserLocation');
var Cloud_CompaniesRouter = require('./routes/Cloud_Companies');
var USuppliers12Router = require('./routes/USuppliers12');
var ACLISTRouter = require('./routes/ACLIST');
var YearClosingRouter = require('./routes/YearClosing');
var USuppliersRouter = require('./routes/USuppliers');
var USuppliers_BonusRouter = require('./routes/USuppliers_Bonus');
var USuppliers_DiscRouter = require('./routes/USuppliers_Disc');
var USuppliers_Disc1Router = require('./routes/USuppliers_Disc1');
var CustomerRouter = require('./routes/Customer');
var MenueAccessRouter= require('./routes/MenueAccess');
var WebThemeRouter= require('./routes/WebTheme');
var DocAttachmentsRouter= require('./routes/DocAttachments');
var CompanyFieldRouter= require('./routes/CompanyField');

//Asad Data
var AreasRouter = require('./routes/Areas');
var SubAreaRouter = require('./routes/SubArea');
var HeadOfficeRouter = require('./routes/HeadOffice');
var LocationTypeRouter = require('./routes/LocationType');
var LocationDefinitionRouter = require('./routes/LocationDefinition');
var VoucherTypeRouter = require('./routes/VoucherType')
var FinYearRouter = require('./routes/FinYear')
var CurrencyRouter = require('./routes/Currency')
var ProjectCategRouter = require('./routes/ProjectCateg')
var ProjectNatureRouter = require('./routes/ProjectNature');
var CostCenterRouter = require('./routes/CostCenter');
var OBalanceRouter = require('./routes/OBalance');
var ProjectDefinitionRouter = require('./routes/ProjectDefinition');
var DepartmentRouter = require('./routes/Department');
var SubHeadRouter = require('./routes/SubHead');
var SetupRouter = require('./routes/Setup');
var RolesRouter = require('./routes/Roles');
var SpecialDiscountRateRouter = require('./routes/SpecialDiscountRate');
var ModuleRouter = require('./routes/Module');
var DirectorRouter = require('./routes/Director');
var MenueRouter = require('./routes/Menue');
var PagesRouter = require('./routes/Pages');
var TransportationRouter = require('./routes/Transportation');
var PaymentTermsRouter = require('./routes/PaymentTerms');
var SupplierTypeRouter = require('./routes/SupplierType');

///////// Accounts & Transectional //////////
/////////////// Afzaal Data ////////////////
var RCBankRouter = require('./finance/RCBank');

//////////////// Asad Data /////////////////
var FixationPlaceRouter = require('./finance/FixationPlace');
var FARServicesRouter = require('./finance/FARServices');
var FARParentRouter = require('./finance/FARParent');
var FarCategoryRouter = require('./finance/FarCategory');
var FARMRouter = require('./finance/FARM');
var FARDistRouter = require('./finance/FARDist');
var FARTransferRouter = require('./finance/FARTransfer');
var ChqBookRecordRouter = require('./finance/ChqBookRecord');
var RecoveryRecordRouter = require('./finance/RecoveryRecord');
var BankDepositRouter = require('./finance/BankDeposit');
var ChequeRefundRouter = require('./finance/ChequeRefund');

var app = express();
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Mango Api's :)
app.use('/', indexRouter);
app.use('/ReportSetting', ReportSettingRouter);
app.use('/TherapticClass', TherapticRouter);
app.use('/StoreDefinition', StoreRouter);
app.use('/RackDefinition', RackRouter);
app.use('/ShelfDefinition', ShelfRouter);
app.use('/TollParty', TollRouter);
app.use('/Job_Locat', LocationRouter);
app.use('/AdjustmentReason', AdjustmentRouter);
app.use('/QualityTest', QualityRouter);
app.use('/Users', UsersRouter);
app.use('/Commonddl', CommonddlRouter);
app.use('/Brand', BrandRouter);
app.use('/MearsuringUnit', MearsuringUnitRouter);
app.use('/ItemTypeN', ItemTypeNRouter);
app.use('/UnitConversion', UnitConversionRouter);
app.use('/CategoryDefinition', CategoryDefinitionRouter);
app.use('/ClassDefinition', ClassDefinitionRouter);
app.use('/DeliveryPerson', DeliveryPersonRouter);
app.use('/DiscountRate', DiscountRateRouter);
app.use('/Regional_Mgr', Regional_MgrRouter);
app.use('/RepMgr', RepMgrRouter);
app.use('/MedicalRep', MedicalRepRouter);
app.use('/tb_SalRetResn', tb_SalRetResnRouter);
app.use('/ProductProfiler', ProductProfilerRouter);
app.use('/TestAllocation', TestAllocationRouter);
app.use('/SalesType', SalesTypeRouter);
app.use('/SalesMan', SalesManRouter);
app.use('/DesignationDef', DesignationDefRouter);
app.use('/Country', CountryRouter);
app.use('/Region', RegionRouter);
app.use('/City', CityRouter);
app.use('/PackingUnit', PackingUnitRouter);
app.use('/IItems', IItemsRouter);
app.use('/IBinCard', IBinCardRouter);
app.use('/IBinCardD', IBinCardDRouter);
app.use('/CRM_Services_M', CRM_Services_MRouter);
app.use('/CRM_Services_D', CRM_Services_DRouter);
app.use('/CRM_Services_DD', CRM_Services_DDRouter);
app.use('/UserLocation', UserLocationRouter);
app.use('/Cloud_Companies', Cloud_CompaniesRouter);
app.use('/USuppliers12', USuppliers12Router);
app.use('/ACLIST', ACLISTRouter);
app.use('/YearClosing', YearClosingRouter);
app.use('/USuppliers', USuppliersRouter);
app.use('/USuppliers_Bonus', USuppliers_BonusRouter);
app.use('/USuppliers_Disc', USuppliers_DiscRouter);
app.use('/USuppliers_Disc1', USuppliers_Disc1Router);
app.use('/Customer', CustomerRouter);
app.use('/MenueAccess', MenueAccessRouter);
app.use('/WebTheme', WebThemeRouter);
app.use('/DocAttachments', DocAttachmentsRouter);
app.use('/CompanyField', CompanyFieldRouter);


//Asad Data
app.use('/Areas', AreasRouter);
app.use('/SubArea', SubAreaRouter);
app.use('/HeadOffice', HeadOfficeRouter);
app.use('/LocationType', LocationTypeRouter);
app.use('/LocationDefinition', LocationDefinitionRouter);
app.use('/VoucherType', VoucherTypeRouter);
app.use('/FinYear', FinYearRouter);
app.use('/Currency', CurrencyRouter);
app.use('/ProjectCateg', ProjectCategRouter);
app.use('/ProjectNature', ProjectNatureRouter);
app.use('/CostCenter', CostCenterRouter);
app.use('/OBalance', OBalanceRouter);
app.use('/ProjectDefinition', ProjectDefinitionRouter);
app.use('/Department', DepartmentRouter);
app.use('/SubHead', SubHeadRouter);
app.use('/Setup', SetupRouter);
app.use('/Roles', RolesRouter);
app.use('/SpecialDiscountRate', SpecialDiscountRateRouter);
app.use('/Module', ModuleRouter);
app.use('/Director', DirectorRouter);
app.use('/Menue', MenueRouter);
app.use('/Pages', PagesRouter);
app.use('/Transportation', TransportationRouter);
app.use('/PaymentTerms', PaymentTermsRouter);
app.use('/SupplierType', SupplierTypeRouter);
///////// Accounts & Transectional //////////
/////////////// Afzaal Data ////////////////
app.use('/Finance/RCBank', RCBankRouter);
//////////////// Asad Data /////////////////
app.use('/Finance/FixationPlace', FixationPlaceRouter);
app.use('/Finance/FARServices', FARServicesRouter);
app.use('/Finance/FARParent', FARParentRouter);
app.use('/Finance/FarCategory', FarCategoryRouter);
app.use('/Finance/FARM', FARMRouter);
app.use('/Finance/FARDist', FARDistRouter);
app.use('/Finance/FARTransfer', FARTransferRouter);
app.use('/Finance/ChqBookRecord', ChqBookRecordRouter);
app.use('/Finance/RecoveryRecord', RecoveryRecordRouter);
app.use('/Finance/BankDeposit', BankDepositRouter);
app.use('/Finance/ChequeRefund', ChequeRefundRouter);


///////// Inventory //////////
/////////////// Afzaal Data ////////////////
var MIRRouter = require('./Inventory/MIR');
app.use('/Inventory/MIR', MIRRouter);
var MIRouter = require('./Inventory/MI');
app.use('/Inventory/MI', MIRouter);
var POSSerialQtyRouter = require('./Inventory/POSSerialQty');
app.use('/Inventory/POSSerialQty', POSSerialQtyRouter);
var PurchaseReturnRouter = require('./Inventory/PurchaseReturn');
app.use('/Inventory/PurchaseReturn', PurchaseReturnRouter);
var ReleaseRouter = require('./routes/Release');
app.use('/Release', ReleaseRouter);
var EngineerRouter = require('./routes/Engineer');
app.use('/Engineer', EngineerRouter);
var DashboardRouter = require('./routes/Dashboard');
app.use('/Dashboard', DashboardRouter);
///////// Finance //////////
/////////////// Afzaal Data ////////////////
var JournalRouter = require('./finance/Journal');
app.use('/finance/Journal', JournalRouter);
var CurrGLBalRouter = require('./finance/CurrGLBal');
app.use('/finance/CurrGLBal', CurrGLBalRouter);
var FinancialBudgetingRouter = require('./finance/FinancialBudgeting');
app.use('/finance/FinancialBudgeting', FinancialBudgetingRouter);
var ChequeReplacementRouter = require('./finance/ChequeReplacement');
app.use('/finance/ChequeReplacement', ChequeReplacementRouter);
var BankReconRouter = require('./finance/BankRecon');
app.use('/finance/BankRecon', BankReconRouter);
///////// Sales //////////
/////////////// Afzaal Data ////////////////
var DeliveryChallanRouter = require('./sales/DeliveryChallan');
app.use('/sales/DeliveryChallan', DeliveryChallanRouter);
var SaleInvoiceRouter = require('./sales/SaleInvoice');
app.use('/sales/SaleInvoice', SaleInvoiceRouter);
var ReportsRouter = require('./Inventory/Reports');
app.use('/Inventory/Reports', ReportsRouter);
var SaleReturnRouter = require('./sales/SaleReturn');
app.use('/sales/SaleReturn', SaleReturnRouter);
var IssueReturnNoteRouter = require('./Inventory/IssueReturnNote');
app.use('/Inventory/IssueReturnNote', IssueReturnNoteRouter);
var QuotationEntryRouter = require('./sales/QuotationEntry');
app.use('/sales/QuotationEntry', QuotationEntryRouter);
var ServiceSaleInvoiceRouter = require('./sales/ServiceSaleInvoice');
app.use('/sales/ServiceSaleInvoice', ServiceSaleInvoiceRouter);
///////// Reports //////////
/////////////// Afzaal Data ////////////////
var StockInHandSummaryRouter = require('./reports/StockInHandSummary');
app.use('/reports/StockInHandSummary', StockInHandSummaryRouter);
var StockInHandWithValueRouter = require('./reports/StockInHandWithValue');
app.use('/reports/StockInHandWithValue', StockInHandWithValueRouter);
var CustomerLedgerDetailRouter = require('./reports/CustomerLedgerDetail');
app.use('/reports/CustomerLedgerDetail', CustomerLedgerDetailRouter);
var SupplierLedgerDetailRouter = require('./reports/SupplierLedgerDetail');
app.use('/reports/SupplierLedgerDetail', SupplierLedgerDetailRouter);
var SMSAPIRouter = require('./routes/SMSAPI');
app.use('/SMSAPI', SMSAPIRouter);
var SMSThemeRouter = require('./routes/SMSTheme');
app.use('/SMSTheme', SMSThemeRouter);
var ReceiptAgainstPORouter = require('./reports/ReceiptAgainstPO');
app.use('/reports/ReceiptAgainstPO', ReceiptAgainstPORouter);
var SalesReportRouter = require('./reports/SalesReport');
app.use('/reports/SalesReport', SalesReportRouter);
var DailyActivityRouter = require('./reports/DailyActivity');
app.use('/reports/DailyActivity', DailyActivityRouter);
var IssueReturnNoteReportRouter = require('./reports/IssueReturnNoteReport');
app.use('/reports/IssueReturnNoteReport', IssueReturnNoteReportRouter);
var VoucherPosting = require('./routes/VoucherPosting');
app.use('/VoucherPosting', VoucherPosting);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

module.exports = app;

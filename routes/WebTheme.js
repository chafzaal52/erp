
var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("WebTheme Work properly");
});


router.get('/GetList/:CompanyID/:UserID', function (req, res, next) {
    let UserID= req.params.UserID;
    let CompanyID= req.params.CompanyID;
    let query="select * from WebTheme where UserID="+UserID+" and CompanyID="+CompanyID;
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
        .input('ID', model.ID)
        .input('UserID', model.UserID)
        .input('CompanyID', model.CompanyID)
        .input('Layout', model.Layout)
        .input('IconColor', model.IconColor)
        .input('Headerbg', model.Headerbg)
        .input('Menubg', model.Menubg)
        .input('MenuBrandColor', model.MenuBrandColor)
        .input('NavbarImg', model.NavbarImg)
        .input('RTL', model.RTL)
        .input('MenuFixed', model.MenuFixed)
        .input('HeaderFixed', model.HeaderFixed)
        .input('BoxLayouts', model.BoxLayouts)
        .input('MenuDropdownIcon', model.MenuDropdownIcon)
        .input('MenuListIcon', model.MenuListIcon)
        .input('ActiveColor', model.ActiveColor)
        .input('MenuTitleColor', model.MenuTitleColor)
        .input('MenuTitleHide', model.MenuTitleHide)
        .execute('sp_InsertUpdateWebTheme')
    }).then(result => {
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from WebTheme where ID="+Id+";";
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
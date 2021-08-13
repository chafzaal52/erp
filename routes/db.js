// const config = {//Live
//     user: 'paratec1_alldatabases',
//     password: 'Paratech@786',
//     server: '198.38.83.224', // You can use 'localhost\\instance' to connect to named instance
//     database: 'paratec1_erp',
// }

// const config = {//Live Alsum Group ERP
//     user: 'alsumgro_sa',
//     password: 'Paratech@786',
//     server: 'wdb4.my-hosting-panel.com', // You can use 'localhost\\instance' to connect to named instance
//     database: 'alsumgro_erp_web',
// }
const config = {//Demo
    user: 'paratec1_alldatabases',
    password: 'Paratech@786',
    server: '198.38.83.224', // You can use 'localhost\\instance' to connect to named instance
    database: 'paratec1_demo_finance',
}

// const config = {//Local
//     user: 'sa',
//     password: 'Rehman',
//     server: 'DESKTOP-7F3CJIV', // You can use 'localhost\\instance' to connect to named instance
//     database: 'db_ERP',//db_ERP//db_finance
// }


const sql = require('mssql')
module.exports= {
    config,
    sql
};

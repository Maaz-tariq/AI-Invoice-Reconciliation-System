const express = require('express')
const cors = require('cors') 
const helmet = require('helmet')
const morgan = require('morgan')
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');


const app = express()


app.use(helmet())

app.use(cors())

app.use(express.json())

app.use(morgan('dev'))


app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "INVOICE RECONCILIATION API IS RUNNING"
    });
});

app.use('/api/auth', authRoutes);


app.use('/api/invoices', invoiceRoutes);


app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});


app.use(errorHandler)

module.exports = app

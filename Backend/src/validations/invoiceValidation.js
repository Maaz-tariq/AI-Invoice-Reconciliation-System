const AppError = require('../utils/AppError');

// CLIENT CAN ONLY ACCESS THESE FIELDS
const ALLOWED_FIELDS = [
    'vendor',
    'invoiceNumber',
    'invoiceDate',
    'currency',
    'subtotal',
    'tax',
    'totalAmount',
];

const validateCreateInvoice = (req, res, next) => {
    const { vendor, invoiceNumber, invoiceDate, currency, subtotal, tax, totalAmount } = req.body;

    if (!vendor || typeof vendor !== 'string') {
        return next(new AppError('Vendor is required and must be a string', 400));
    }

    if (!invoiceNumber || typeof invoiceNumber !== 'string') {
        return next(new AppError('Invoice number is required and must be a string', 400));
    }

    if (!invoiceDate || isNaN(Date.parse(invoiceDate))) {
        return next(new AppError('A valid invoice date is required', 400));
    }

    if (!currency || typeof currency !== 'string') {
        return next(new AppError('Currency is required and must be a string', 400));
    }

    if (subtotal === undefined || typeof subtotal !== 'number' || subtotal < 0) {
        return next(new AppError('Subtotal is required and must be a non-negative number', 400));
    }

    if (tax === undefined || typeof tax !== 'number' || tax < 0) {
        return next(new AppError('Tax is required and must be a non-negative number', 400));
    }

    if (totalAmount === undefined || typeof totalAmount !== 'number' || totalAmount < 0) {
        return next(new AppError('Total amount is required and must be a non-negative number', 400));
    }

    // CLIENT SE WAHI DETAILS LENGE JO REQUIRED HAI JAISE YE
    // NAAKI JAISE approvalStatus, uploadBy, 
    req.body = {
        vendor,
        invoiceNumber,
        invoiceDate,
        currency,
        subtotal,
        tax,
        totalAmount,
    };

    next();
};

const validateUpdateInvoice = (req, res, next) => {
    const updates = {};

    for (const field of ALLOWED_FIELDS) {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    }

    if (Object.keys(updates).length === 0) {
        return next(new AppError('At least one valid field must be provided to update', 400));
    }

    if (updates.subtotal !== undefined && (typeof updates.subtotal !== 'number' || updates.subtotal < 0)) {
        return next(new AppError('Subtotal must be a non-negative number', 400));
    }

    if (updates.tax !== undefined && (typeof updates.tax !== 'number' || updates.tax < 0)) {
        return next(new AppError('Tax must be a non-negative number', 400));
    }

    if (updates.totalAmount !== undefined && (typeof updates.totalAmount !== 'number' || updates.totalAmount < 0)) {
        return next(new AppError('Total amount must be a non-negative number', 400));
    }

    if (updates.invoiceDate !== undefined && isNaN(Date.parse(updates.invoiceDate))) {
        return next(new AppError('Invoice date must be a valid date', 400));
    }

    // REPLACE REQ BODY WITH SANITIZED LIST OF UPDATE FIELDS
    req.body = updates;
    next();
};

module.exports = { validateCreateInvoice, validateUpdateInvoice };
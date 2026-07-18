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
    const ALLOWED_FIELDS = [
        'vendor', 'invoiceNumber', 'invoiceDate', 'currency',
        'subtotal', 'tax', 'totalAmount',
        's3Key', 'originalName', 'mimeType', 'size',
    ];

    const cleaned = {};
    for (const field of ALLOWED_FIELDS) {
        if (req.body[field] !== undefined) cleaned[field] = req.body[field];
    }

    req.body = cleaned;
    next();
};


// invoice.service.js — required-field checks now happen HERE, inside rollback coverage
const createInvoice = async (data, userId) => {
    const { vendor, invoiceNumber, invoiceDate, currency, subtotal, tax, totalAmount, s3Key, originalName, mimeType, size } = data;

    try {
        if (!vendor) throw new AppError('Vendor is required', 400);

        if (!invoiceNumber) throw new AppError('Invoice number is required', 400);

        if (!invoiceDate || isNaN(Date.parse(invoiceDate))) throw new AppError('Valid invoice date is required', 400);

        if (subtotal === undefined || typeof subtotal !== 'number') throw new AppError('Subtotal is required', 400);

        if (tax === undefined || typeof tax !== 'number') throw new AppError('Tax is required', 400);

        if (totalAmount === undefined || typeof totalAmount !== 'number') throw new AppError('Total amount is required', 400);
        
        if (!s3Key) throw new AppError('s3Key is required', 400);

        const existing = await Invoice.findOne({ vendor, invoiceNumber });
        if (existing) {
            throw new AppError('An invoice with this vendor and invoice number already exists', 409);
        }

        const invoice = await Invoice.create({
            vendor, invoiceNumber, invoiceDate, currency, subtotal, tax, totalAmount,
            uploadedBy: userId,
            file: { originalName, mimeType, size, s3Key, bucket: process.env.AWS_BUCKET_NAME, uploadedAt: new Date() },
        });

        return invoice;
    } catch (error) {
        if (s3Key) {
            await s3Service.deleteObject(s3Key).catch(() => {});
        }
        throw error;
    }
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
const { Invoice } = require('../models');
const AppError = require('../utils/AppError');
;
const s3Service = require('./s3Services');

const createInvoice = async (data, userId) => {
    const { vendor, invoiceNumber, s3Key, originalName, mimeType, size, ...rest } = data;

    const existing = await Invoice.findOne({ vendor, invoiceNumber });
    if (existing) {
        // Rollback: an orphaned S3 object would result if we don't clean up here too,
        // since the file was already uploaded before this duplicate check runs on the metadata call
        await s3Service.deleteObject(s3Key).catch(() => {});
        throw new AppError('An invoice with this vendor and invoice number already exists', 409);
    }

    let invoice;
    try {
        invoice = await Invoice.create({
            ...rest,
            vendor,
            invoiceNumber,
            uploadedBy: userId,
            file: {
                originalName,
                mimeType,
                size,
                s3Key,
                bucket: process.env.AWS_BUCKET_NAME,
                uploadedAt: new Date(),
            },
        });
    } catch (error) {
        await s3Service.deleteObject(s3Key).catch(() => {});
        throw error;
    }

    return invoice;
};


const getInvoices = async ({ page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;

    const [invoices, total] = await Promise.all([
        Invoice.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        Invoice.countDocuments(),
    ]);

    return {
        invoices,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / limit),
        },
    };
};

const getInvoiceById = async (id) => {
    const invoice = await Invoice.findById(id);
    if (!invoice) {
        throw new AppError('Invoice not found', 404);
    }
    return invoice;
};

const updateInvoice = async (id, updates) => {
    const invoice = await Invoice.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
    });

    if (!invoice) {
        throw new AppError('Invoice not found', 404);
    }

    return invoice;
};

const deleteInvoice = async (id) => {
    const invoice = await Invoice.findByIdAndDelete(id);
    if (!invoice) {
        throw new AppError('Invoice not found', 404);
    }
    return invoice;
};

module.exports = { createInvoice, getInvoices, getInvoiceById, updateInvoice, deleteInvoice };
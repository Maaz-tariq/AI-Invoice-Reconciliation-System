const { Invoice } = require('../models');
const AppError = require('../utils/AppError');

const createInvoice = async (data, userId) => {
    const { vendor, invoiceNumber } = data;

    const existing = await Invoice.findOne({ vendor, invoiceNumber });
    if (existing) {
        throw new AppError('An invoice with this vendor and invoice number already exists', 409);
    }

    const invoice = await Invoice.create({
        ...data,
        uploadedBy: userId, // THIS userId DECIDES THE OWNERSHIP 
    });

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
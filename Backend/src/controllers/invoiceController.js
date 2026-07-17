
const AppError = require('../utils/AppError');
const invoiceService = require('../services/invoiceService')

const s3Service = require('../services/s3Services');

const createInvoice = async (req, res, next) => {
    try {
        const invoice = await invoiceService.createInvoice(req.body, req.user.id);
        res.status(201).json({
            success: true,
            message: 'Invoice created successfully',
            data: { invoice },
        });
    } catch (error) {
        next(error);
    }
};

const getInvoices = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await invoiceService.getInvoices({ page: Number(page), limit: Number(limit) });

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getInvoiceById = async (req, res, next) => {
    try {
        const invoice = await invoiceService.getInvoiceById(req.params.id);
        res.status(200).json({
            success: true,
            data: { invoice },
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return next(new AppError('Invalid invoice ID', 400));
        }
        next(error);
    }
};

const updateInvoice = async (req, res, next) => {
    try {
        const invoice = await invoiceService.updateInvoice(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Invoice updated successfully',
            data: { invoice },
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return next(new AppError('Invalid invoice ID', 400));
        }
        next(error);
    }
};

const deleteInvoice = async (req, res, next) => {
    try {
        await invoiceService.deleteInvoice(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Invoice deleted successfully',
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return next(new AppError('Invalid invoice ID', 400));
        }
        next(error);
    }
};




const getUploadUrl = async (req, res, next) => {
    try {
        const { fileName, contentType } = req.body;
        const result = await s3Service.generateUploadUrl({ fileName, contentType });

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = { createInvoice, getInvoices, getInvoiceById, updateInvoice, deleteInvoice, getUploadUrl };
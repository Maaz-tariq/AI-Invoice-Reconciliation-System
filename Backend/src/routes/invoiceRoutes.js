const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const ROLES = require('../constants/roles');
const { validateCreateInvoice, validateUpdateInvoice } = require('../validations/invoiceValidation');


const {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
} = require('../controllers/invoiceController');


// CREATES INVOICE 
router.post(
    '/',
    auth,
    authorize(ROLES.EMPLOYEE, ROLES.FINANCE, ROLES.ADMIN),
    validateCreateInvoice,
    createInvoice
);

// VIEW INVOICE - ONLY ADMIN AND FINANCE CAN VIEW THAM
router.get(
    '/',
    auth,
    authorize(ROLES.FINANCE, ROLES.ADMIN),
    getInvoices
);

// VIEW BY ID - FOR VIEWING A SPECIFIC INVOICE 
router.get(
    '/:id',
    auth,
    authorize(ROLES.FINANCE, ROLES.ADMIN),
    getInvoiceById
);

// UPDATE INVOICE - CAN BE DONE BY FINANCE AND ADMIN ONLY
router.patch(
    '/:id',
    auth,
    authorize(ROLES.FINANCE, ROLES.ADMIN),
    validateUpdateInvoice,
    updateInvoice
);

// DELETE INVOICE - CAN ONLY BE DONE BY ADMIN
router.delete(
    '/:id',
    auth,
    authorize(ROLES.ADMIN),
    deleteInvoice
);

module.exports = router;
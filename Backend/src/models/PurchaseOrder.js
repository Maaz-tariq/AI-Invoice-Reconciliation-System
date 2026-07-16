const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema(
    {
        poNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        vendor: {
            type: String,
            required: true,
            trim: true,
        },
        department: {
            type: String,
            trim: true,
        },
        expectedAmount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: 'USD',
        },
        status: {
            type: String,
            enum: ['OPEN', 'CLOSED', 'CANCELLED'],
            default: 'OPEN',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
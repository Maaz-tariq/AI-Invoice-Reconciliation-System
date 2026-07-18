const mongoose = require('mongoose');
const { PROCESSING_STATUS, APPROVAL_STATUS } = require('../constants/invoiceStatus');

const invoiceSchema = new mongoose.Schema({


        // USER INFO
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        

        // METADATA INFO OF FILE 
        file: {
            originalName: {
                type: String 
            },
            mimeType: {
                type: String 
            },
            size: {
                type: Number
            },
            s3Key: { 
                type: String 
            },      
            bucket: {
                type: String 
            },    
            uploadedAt: {
                type: Date 
            },
            
        },

        // INVOICE INFO
        vendor: {
            type: String,
            trim: true,
        },
        invoiceNumber: {
            type: String,
            trim: true,
        },
        invoiceDate: {
            type: Date,
        },
        currency: {
            type: String,
            default: 'USD',
        },
        subtotal: {
            type: Number,
        },
        tax: {
            type: Number,
        },
        totalAmount: {
            type: Number,
        },

        // AI FIELD
        ocrText: {
            type: String,
            default: null,
        },
        aiExtraction: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },
        aiConfidence: {
            type: Number,
            default: null,
        },

        // STATUS FIELD
        processingStatus: {
            type: String,
            enum: Object.values(PROCESSING_STATUS),
            default: PROCESSING_STATUS.UPLOADED,
        },
        approvalStatus: {
            type: String,
            enum: Object.values(APPROVAL_STATUS),
            default: APPROVAL_STATUS.PENDING,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);

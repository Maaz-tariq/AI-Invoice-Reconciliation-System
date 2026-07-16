const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            required: true, 
        },
        resourceType: {
            type: String,
            required: true, 
        },
        resourceId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } } 
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const { User, PurchaseOrder } = require('../models');
const ROLES = require('../constants/roles');

const upsertUser = async (data) => {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
        console.log(`Skipped (already exists): ${data.email}`);
        return existing;
    }
    const user = await User.create(data);
    console.log(`Created user: ${data.email}`);
    return user;
};

const upsertPO = async (data) => {
    const existing = await PurchaseOrder.findOne({ poNumber: data.poNumber });
    if (existing) {
        console.log(`Skipped (already exists): ${data.poNumber}`);
        return existing;
    }
    const po = await PurchaseOrder.create(data);
    console.log(`Created PO: ${data.poNumber}`);
    return po;
};

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected for seeding');

        const admin = await upsertUser({
            name: 'Admin User',
            email: 'admin@seed.com',
            password: 'password123',
            role: ROLES.ADMIN,
            department: 'IT',
        });

        const finance = await upsertUser({
            name: 'Finance User',
            email: 'finance@seed.com',
            password: 'password123',
            role: ROLES.FINANCE,
            department: 'Finance',
        });

        await upsertUser({
            name: 'Employee One',
            email: 'employee1@seed.com',
            password: 'password123',
            role: ROLES.EMPLOYEE,
            department: 'Sales',
        });

        await upsertUser({
            name: 'Employee Two',
            email: 'employee2@seed.com',
            password: 'password123',
            role: ROLES.EMPLOYEE,
            department: 'Marketing',
        });

        await upsertPO({
            poNumber: 'PO-1001',
            vendor: 'Acme Supplies',
            department: 'Sales',
            expectedAmount: 5000,
            currency: 'USD',
            createdBy: finance._id,
        });

        await upsertPO({
            poNumber: 'PO-1002',
            vendor: 'Globex Corp',
            department: 'Marketing',
            expectedAmount: 12000,
            currency: 'USD',
            createdBy: admin._id,
        });

        console.log('Seeding complete');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
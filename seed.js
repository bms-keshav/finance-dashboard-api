require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/modules/users/user.model');
const Record = require('./src/modules/records/record.model');

const MONGODB_URI = process.env.MONGODB_URI;

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected for seeding...');

        // 1. Delete all existing data
        await User.deleteMany({});
        await Record.deleteMany({});
        console.log('Cleared existing Users and Records.');

        // 2. Create users
        const usersData = [
            { name: 'Admin User', email: 'admin@test.com', password: 'admin123', role: 'ADMIN' },
            { name: 'Analyst User', email: 'analyst@test.com', password: 'analyst123', role: 'ANALYST' },
            { name: 'Viewer User', email: 'viewer@test.com', password: 'viewer123', role: 'VIEWER' },
        ];

        const createdUsers = await Promise.all(usersData.map(async (userData) => {
            return new User({
                name: userData.name,
                email: userData.email,
                role: userData.role,
                passwordHash: userData.password,
            }).save();
        }));

        console.log(`Created ${createdUsers.length} users.`);
        const adminUser = createdUsers.find(u => u.role === 'ADMIN');

        // 3. Create records
        const recordsData = [];
        const categories = ['Salary', 'Rent', 'Food', 'Utilities', 'Freelance', 'Entertainment', 'Healthcare', 'Transport'];
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const type = i % 2 === 0 ? 'INCOME' : 'EXPENSE';
            const category = categories[i % categories.length];
            
            // Dates spread across the last 6 months
            const date = new Date(today);
            date.setMonth(today.getMonth() - (i % 6));
            date.setDate(Math.floor(Math.random() * 28) + 1); // Random day

            let amount;
            if (category === 'Salary' || category === 'Freelance') {
                amount = Math.floor(Math.random() * (8000 - 3000 + 1)) + 3000;
            } else if (category === 'Rent') {
                amount = Math.floor(Math.random() * (2000 - 800 + 1)) + 800;
            } else if (category === 'Food') {
                amount = Math.floor(Math.random() * (300 - 50 + 1)) + 50;
            } else {
                amount = Math.floor(Math.random() * 500) + 50;
            }

            recordsData.push({
                amount,
                type: (category === 'Salary' || category === 'Freelance') ? 'INCOME' : 'EXPENSE',
                category,
                date,
                notes: `Sample record for ${category}`,
                createdBy: adminUser._id,
            });
        }

        await Record.insertMany(recordsData);
        console.log(`Created ${recordsData.length} records.`);

        console.log('Database seeding completed successfully!');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // 4. Disconnect from MongoDB
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
        process.exit(0);
    }
};

seedDatabase();

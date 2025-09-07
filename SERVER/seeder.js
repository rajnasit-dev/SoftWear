const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Product = require('./models/Product');
const products = require('./data/products');

//Connect to mongoDB
mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);

//Function to seed the database
const seedDB = async () => {
    try {
        //Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log('Existing data cleared');

        //Create an admin user
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@gmail.com',
            password: '123456',
            role: 'admin'
        });

        //Assign the default user to each product and save to DB
        const userID = adminUser._id;
        await adminUser.save();
        console.log('Admin user created');

        const sampleProducts = products.map((product) => {
            return { ...product, user: userID };
        });

        //Insert sample products into the database
        await Product.insertMany(sampleProducts);
        console.log('Database seeded successfully');
        process.exit();
    } catch (error) {
        console.log('Error seeding database:', error);
        process.exit(1);
    }
};
  
seedDB();
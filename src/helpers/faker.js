const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require("uuid");

function generateFakeProducts(count) {
    const products = [];

    for (let i = 1; i <= count; i++) {
        const data = {
            id: uuidv4(),
            name: faker.commerce.productName(),
            price: parseInt(faker.commerce.price({ min: 100, max: 1000, dec: 0 })),
            description: faker.commerce.productDescription(),
            product: faker.commerce.product(),
            color: faker.internet.color(),
            createdAt: faker.date.past(),
            image: faker.image.avatar(),
        };
        products.push(data);
    }

    return products;
}

module.exports = { generateFakeProducts };
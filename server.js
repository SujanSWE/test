const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;
const dataFilePath = path.join(__dirname, 'data', 'properties.json');

app.use(bodyParser.json());
app.use(express.static('public'));

// Helper function to read properties
const readProperties = () => {
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

// Helper function to write properties
const writeProperties = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Register user (simplified, no authentication)
app.post('/register', (req, res) => {
  // For simplicity, just acknowledge the registration
  res.send('User registered');
});

// Post property
app.post('/post-property', (req, res) => {
  const properties = readProperties();
  const newProperty = req.body;
  properties.push(newProperty);
  writeProperties(properties);
  res.send('Property posted successfully');
});

// Get all properties
app.get('/properties', (req, res) => {
  const properties = readProperties();
  res.json(properties);
});

// Handle interest in a property
app.post('/interest', (req, res) => {
  const { propertyId, buyerEmail, buyerName } = req.body;
  const properties = readProperties();
  const property = properties.find(prop => prop.id === propertyId);
  
  if (property) {
    // Send emails (simplified, replace with real email credentials)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
      }
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: property.sellerEmail,
      subject: 'New Interest in Your Property',
      text: `Buyer ${buyerName} (${buyerEmail}) is interested in your property.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res.send('Interest registered and email sent');
    });
  } else {
    res.status(404).send('Property not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

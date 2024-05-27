document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  const propertyForm = document.getElementById('property-form');
  const propertiesList = document.getElementById('properties-list');

  // Register user
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = {
      firstName: document.getElementById('first-name').value,
      lastName: document.getElementById('last-name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value
    };

    fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
  });

  // Post property
  propertyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const property = {
      id: Date.now().toString(),
      place: document.getElementById('place').value,
      area: document.getElementById('area').value,
      bedrooms: document.getElementById('bedrooms').value,
      bathrooms: document.getElementById('bathrooms').value,
      nearby: document.getElementById('nearby').value,
      sellerEmail: document.getElementById('seller-email').value
    };

    fetch('/post-property', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(property)
    })
    .then(response => response.text())
    .then(data => {
      alert(data);
      loadProperties();
    })
    .catch(error => console.error('Error:', error));
  });

  // Load properties
  const loadProperties = () => {
    fetch('/properties')
    .then(response => response.json())
    .then(properties => {
      propertiesList.innerHTML = '';
      properties.forEach(property => {
        const propertyDiv = document.createElement('div');
        propertyDiv.className = 'property';
        propertyDiv.innerHTML = `
          <h3>${property.place}</h3>
          <p>Area: ${property.area} sq ft</p>
          <p>Bedrooms: ${property.bedrooms}</p>
          <p>Bathrooms: ${property.bathrooms}</p>
          <p>Nearby: ${property.nearby}</p>
          <button onclick="showInterest('${property.id}')">I'm Interested</button>
        `;
        propertiesList.appendChild(propertyDiv);
      });
    })
    .catch(error => console.error('Error:', error));
  };

  // Show interest in property
  window.showInterest = (propertyId) => {
    const buyerEmail = prompt('Enter your email:');
    const buyerName = prompt('Enter your name:');
    
    fetch('/interest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId, buyerEmail, buyerName })
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
  };

  // Initial load
  loadProperties();
});

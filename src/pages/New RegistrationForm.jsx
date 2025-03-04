import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.scss';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    category: '',
  });

  const categories = [
    "Dance Challenge",
    "Singing Contest",
    "Drawing Competition",
    "Costume Parade",
    "Storytelling",
    "Spelling Bee",
    "Coloring Competition",
    "Handwriting",
    "Fastest Walking (9-15 months)",
    "Crawling (5-9 months)",
    "Art & Craft",
    "Yoga Competition",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Registration Successful! Redirecting to confirmation page...");
    navigate('/registration-success');  // Redirect to the success page
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        <h1>Competition Registration</h1>
        <p>Fill out the form below to register for your desired competition.</p>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Age:</label>
            <input type="number" name="age" required value={formData.age} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Competition Category:</label>
            <select name="category" required value={formData.category} onChange={handleChange}>
              <option value="" disabled>Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-btn">Submit Registration</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;

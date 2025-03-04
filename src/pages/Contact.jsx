import React, { useState } from 'react';
// Importing icons (using react-icons library for demonstration)
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import './ContactUs.scss';  // SCSS stylesheet for this component

function ContactUs() {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactMethod: 'Email'  // default preferred contact method
  });
  // State to track which FAQ item is open (by index); null means all collapsed
  const [openFAQ, setOpenFAQ] = useState(null);

  // Sample FAQ questions and answers
  const faqs = [
    {
      question: "Where are you located?",
      answer: "We are located at the New Convention Centre, CTC Complex, Nandambakkam, Chennai-600089."
    },
    {
      question: "What are your business hours?",
      answer: "Our business hours are Monday–Friday 9:00 AM to 6:00 PM, Saturday 10:00 AM to 4:00 PM, and we are closed on Sundays."
    },
    {
      question: "How can I contact support?",
      answer: "You can reach out to us via the contact form on this page or email us directly at contact@example.com. We’re also available by phone during business hours."
    }
  ];

  // Handler for form field changes (updates state for controlled inputs)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! We will get back to you soon.");  // feedback to user
    // TODO: send formData to server or email service in a real application
    // Reset the form fields after submit
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      contactMethod: 'Email'
    });
  };

  // Toggle an FAQ item's open/closed state
  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Contact Us</h1>
        {/* Contact Information and Contact Form Section */}
        <div className="contact-cards">
          {/* Contact Information Card */}
          <div className="card contact-info-card">
            <h2>Contact Information</h2>
            <p>Ranmars Corp</p>
                <p>Suite 402, 4th Floor</p>
                <p>Workafella, Highstreet</p>
                <p>No. 431, Anna Salai</p>
                <p>Teynampet</p>
                <p>Chennai – 600018</p>
            <p><FaPhone className="icon" /> <strong>Phone:</strong> +91-XXXXXXXXXX</p>
            <p><FaEnvelope className="icon" /> <strong>Email:</strong> contact@example.com</p>
            <h3>Business Hours <FaClock className="icon" /></h3>
            <ul className="business-hours">
              <li><strong>Monday – Friday:</strong> 9:00 AM – 6:00 PM</li>
              <li><strong>Saturday:</strong> 10:00 AM – 4:00 PM</li>
              <li><strong>Sunday:</strong> Closed</li>
            </ul>
            {/* Google Map Embed showing the location */}
            <div className="map-container">
              <iframe 
                title="Google Map"
                width="100%" 
                height="250" 
                frameBorder="0" 
                loading="lazy"
                allowFullScreen 
                src={`https://maps.google.com/maps?q=New%20Convention%20Centre%20CTC%20Complex%20Nandambakkam%20Chennai%20600089&output=embed`}>
              </iframe>
            </div>
            {/* Social Media Links */}
            <div className="social-links">
              <span>Follow us:</span>
              <a href="#" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="card contact-form-card">
            <h2>Send Us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject:</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message:</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="4"
                  value={formData.message} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Preferred Contact Method:</label>
                <div className="contact-method">
                  <label>
                    <input 
                      type="radio" 
                      name="contactMethod" 
                      value="Email" 
                      checked={formData.contactMethod === 'Email'} 
                      onChange={handleInputChange} 
                    />
                    Email
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="contactMethod" 
                      value="Phone" 
                      checked={formData.contactMethod === 'Phone'} 
                      onChange={handleInputChange} 
                    />
                    Phone
                  </label>
                </div>
              </div>
              <button type="submit">Send Message</button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          {faqs.map((item, idx) => (
            <div 
              key={idx} 
              className={`faq-item ${openFAQ === idx ? 'open' : ''}`}
            >
              <div className="question" onClick={() => toggleFAQ(idx)}>
                {item.question}
                <span className="faq-icon">{openFAQ === idx ? '−' : '+'}</span>
              </div>
              <div className="answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContactUs;

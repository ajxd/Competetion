import React, { useEffect, useRef } from 'react';
import Hero from '../components/Hero';
import BackgroundVideo from '../components/BackgroundVideo';
import InteractivePebbles from '../components/InteractivePebbles';

// Import venue images (update paths/extensions if needed)
import v1 from '../assets/images/v1.jpg';
import v2 from '../assets/images/v2.jpg';

import './Home.scss';

const Home = () => {
  // Create an array of section refs for IntersectionObserver animations.
  const sectionRefs = useRef([]);
  sectionRefs.current = []; // Reset the array on each render

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  useEffect(() => {
    // Using IntersectionObserver to add/remove the 'visible' class as sections enter/leave the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            entry.target.classList.remove('visible');
          }
        });
      },
      { threshold: 0.5 }
    );

    sectionRefs.current.forEach((section) => {
      observer.observe(section);
    });

    // Cleanup on unmount
    return () => {
      sectionRefs.current.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <>
      {/* Background elements and hero remain unchanged */}
      <BackgroundVideo />
      <InteractivePebbles />
      <Hero />

      {/* Contest Categories Section as the first section */}
      <section className="contest-categories section-content" ref={addToRefs}>
        <div className="container">
          <h2>Contest Categories</h2>
          <div className="categories-grid">
            <div className="category-card">
              <h3>Dance Challenge</h3>
              <p>"Let Your Feet Speak – Everyone's Stage, Equal for All!"</p>
              <a href="/contest/dance">View Details</a>
            </div>
            <div className="category-card">
              <h3>Singing Contest</h3>
              <p>"Sing Your Heart Out – A Voice for Every Dream!"</p>
              <a href="/contest/singing">View Details</a>
            </div>
            <div className="category-card">
              <h3>Drawing Competition</h3>
              <p>"Every Line Tells a Story – Equal Canvas for All!"</p>
              <a href="/contest/drawing">View Details</a>
            </div>
            <div className="category-card">
              <h3>Costume Parade</h3>
              <p>"Dress to Impress, Show Your Best – Equal for All!"</p>
              <a href="/contest/costume">View Details</a>
            </div>
            <div className="category-card">
              <h3>Storytelling</h3>
              <p>"Every Tale is Magical – Let Your Story Shine!"</p>
              <a href="/contest/storytelling">View Details</a>
            </div>
            <div className="category-card">
              <h3>Spelling Bee</h3>
              <p>"Spell Your Success – Equal Words for Every Child!"</p>
              <a href="/contest/spelling-bee">View Details</a>
            </div>
            <div className="category-card">
              <h3>Coloring Competition</h3>
              <p>"Color Your World – Creativity Knows No Boundaries!"</p>
              <a href="/contest/coloring">View Details</a>
            </div>
            <div className="category-card">
              <h3>Handwriting</h3>
              <p>"Write Your Way to Success – Every Stroke Matters!"</p>
              <a href="/contest/handwriting">View Details</a>
            </div>
            <div className="category-card">
              <h3>Fastest Walking (9-15 months)</h3>
              <p>"Step by Step, Everyone Can Win!"</p>
              <a href="/contest/fastest-walking">View Details</a>
            </div>
            <div className="category-card">
              <h3>Crawling (5-9 months)</h3>
              <p>"Crawl, Explore, and Grow – Equal for Every Little One!"</p>
              <a href="/contest/crawling">View Details</a>
            </div>
            <div className="category-card">
              <h3>Art & Craft </h3>
              <p>"Crawl, Explore, and Grow – Equal for Every Little One!"</p>
              <a href="/contest/Art">View Details</a>
            </div>
            <div className="category-card">
              <h3>Yoga Competition</h3>
              <p>"Stretch, Breathe, Achieve – Equal Flexibility for All!"</p>
              <a href="/contest/yoga">View Details</a>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Information Section (reduced size with advanced features) */}
      <section className="venue-info section-content" ref={addToRefs}>
        <div className="container">
          <div className="venue-wrapper">
            <div className="venue-text">
              <h2>Where it is happening?</h2>
              <p><strong>Venue:</strong></p>
              <p>
                New Convention Centre,<br />
                CTC Complex,<br />
                Nandambakkam,<br />
                Chennai-600089
              </p>
              <p>
                <a
                  href="http://www.chennaitradecentre.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.chennaitradecentre.org
                </a>
              </p>
            </div>
            <div className="venue-images">
              <img src={v1} alt="Venue Image 1" className="venue-image" />
              <img src={v2} alt="Venue Image 2" className="venue-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Info Section */}
      <section className="upcoming-info section-content" ref={addToRefs}>
        <div className="container">
          <h2>Upcoming Dates & Important Info</h2>
          <ul>
            <li><strong>Registration Deadline:</strong> [Date]</li>
            <li><strong>Event Dates:</strong> [Date(s)]</li>
            <li><strong>Results Announcement:</strong> [Date]</li>
          </ul>
          <a href="/registration" className="btn">Register Before It's Too Late!</a>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="highlights section-content" ref={addToRefs}>
        <div className="container">
          <h2>Highlights</h2>
          <p>Check out some moments from our past events!</p>
          <div className="gallery">
            <div className="gallery-item">Image 1</div>
            <div className="gallery-item">Image 2</div>
            <div className="gallery-item">Image 3</div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

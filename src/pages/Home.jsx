import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../components/Hero';
import BackgroundVideo from '../components/BackgroundVideo';
import InteractivePebbles from '../components/InteractivePebbles';
import './Home.scss';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  // Create an array of section refs for CSS-triggered animations.
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
      {/* Only on the homepage: render the background video and pebbles */}
      <BackgroundVideo />
      <InteractivePebbles />
      <Hero />

      <section className="why-contest section-content" ref={addToRefs}>
        <div className="container">
          <h2>Why This Contest?</h2>
          <p>
            Contest is an excellent opportunity to showcase the talents, aiming to
            recognize, nurture, and celebrate the creativity and skills of our kids.
            Through various categories and fun challenges, participants are inspired
            to reach new heights.
          </p>
          <a href="/about" className="btn">Learn More</a>
        </div>
      </section>

      {/* Contest Categories Section with Star-Shaped Cards */}
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
              <h3>Yoga Competition</h3>
              <p>"Stretch, Breathe, Achieve – Equal Flexibility for All!"</p>
              <a href="/contest/yoga">View Details</a>
            </div>
          </div>
        </div>
      </section>

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

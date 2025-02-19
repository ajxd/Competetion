import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Registration from './pages/Registration';
import Events from './pages/Events';
import Contact from './pages/Contact';

// Import contest category pages
import ContestDance from './pages/ContestDance';
import ContestSinging from './pages/ContestSinging';
import ContestDrawing from './pages/ContestDrawing';
import ContestCostume from './pages/ContestCostume';
import ContestStorytelling from './pages/ContestStorytelling';
import ContestSpellingBee from './pages/ContestSpellingBee';
import ContestColoring from './pages/ContestColoring';
import ContestHandwriting from './pages/ContestHandwriting';
import ContestFastestWalking from './pages/ContestFastestWalking';
import ContestCrawling from './pages/ContestCrawling';
import ContestYoga from './pages/ContestYoga';

import './styles/main.scss';

function App() {
  return (
    <Router>
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<Contact />} />
          {/* Contest Category Routes */}
          <Route path="/contest/dance" element={<ContestDance />} />
          <Route path="/contest/singing" element={<ContestSinging />} />
          <Route path="/contest/drawing" element={<ContestDrawing />} />
          <Route path="/contest/costume" element={<ContestCostume />} />
          <Route path="/contest/storytelling" element={<ContestStorytelling />} />
          <Route path="/contest/spelling-bee" element={<ContestSpellingBee />} />
          <Route path="/contest/coloring" element={<ContestColoring />} />
          <Route path="/contest/handwriting" element={<ContestHandwriting />} />
          <Route path="/contest/fastest-walking" element={<ContestFastestWalking />} />
          <Route path="/contest/crawling" element={<ContestCrawling />} />
          <Route path="/contest/yoga" element={<ContestYoga />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;

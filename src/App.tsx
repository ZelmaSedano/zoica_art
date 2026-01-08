import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Portfolio from './Portfolio'
import Resume from './Resume'
import Contact from './Contact'
import About from './About'


import Tarot from './pages/Tarot'
import Norse from './pages/Norse'
import Game from './pages/Game'
import Commissions from './pages/Commissions'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/tarot" element={<Tarot />} />
        <Route path="/norse" element={<Norse />} />
        <Route path="/game" element={<Game />} />
        <Route path="/commissions" element={<Commissions />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  )
}

export default App
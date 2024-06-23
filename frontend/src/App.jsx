import { useState, useEffect } from 'react'
import Menu from './Menu'
import Header from './Header'
import Content from './Content'
import ToggleMode from './ToggleMode'
function App() {


  return (
  <>
    <div className="app-container">
        <ToggleMode/>
        <Menu />
        <div className="app-content">
          <Header />
          <Content />
        </div>
    </div>
  </>
  );
}

export default App;

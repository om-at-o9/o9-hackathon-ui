import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, AppBarSection, AppBarSpacer } from '@progress/kendo-react-layout';
// Make sure you have a logo file in src/assets/
// import o9Logo from '../assets/o9-logo.png'; 

const Navbar = () => {
  return (
    <AppBar>
      <AppBarSection>
        {/* <img src={o9Logo} alt="o9 Solutions" style={{ height: '30px', margin: '0 10px' }} /> */}
        <h1 style={{ fontSize: '1.2rem', margin: 0 }}>o9 GenAI Assistant</h1>
      </AppBarSection>
      <AppBarSpacer />
      <AppBarSection>
        <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', margin: 0, paddingRight: '15px' }}>
          <li>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
          </li>
          <li>
            <Link to="/listbox" style={{ textDecoration: 'none', color: 'inherit' }}>ListBox Demo</Link>
          </li>
          <li>
            <Link to="/counter" style={{ textDecoration: 'none', color: 'inherit' }}>Counter Demo</Link>
          </li>
        </ul>
      </AppBarSection>
    </AppBar>
  );
};

export default Navbar;
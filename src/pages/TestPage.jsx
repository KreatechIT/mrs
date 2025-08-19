import React from 'react';

export default function TestPage() {
  console.log('TestPage is rendering');
  
  return (
    <div style={{ padding: '20px', backgroundColor: 'white', color: 'black', minHeight: '100vh' }}>
      <h1>Test Page</h1>
      <p>If you can see this, React is working!</p>
      <p>Current URL: {window.location.href}</p>
      <p>Current pathname: {window.location.pathname}</p>
    </div>
  );
}
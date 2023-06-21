import React from 'react';
import Sidebar from './Sidebar';

// radna povrsina za glumca

const Whiteboard = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '4000px',
        backgroundColor: 'white',
        border: '1px solid black',
      }}
    >
      <div>
        <Sidebar></Sidebar>
      </div>
      <div className='actor-cards'>
        {/*Actor cards*/}
      </div>
    </div>
  );
};

export default Whiteboard;
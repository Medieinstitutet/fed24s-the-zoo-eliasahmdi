import React from 'react';
import { Outlet } from 'react-router-dom';

const DjurLayout: React.FC = () => {
  return (
    <div className="space-y-6">
      <Outlet />
    </div>
  );
};

export default DjurLayout;
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/dashboard';
import SectionPaths from '../pages/section-paths';
import PathLevels from '../pages/path-levels';
import UserManagement from '../pages/user-management';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/section/:sectionId" element={<SectionPaths />} />
      <Route path="/path/:pathId" element={<PathLevels />} />
      <Route path="/users" element={<UserManagement />} />
    </Routes>
  );
};

export default AppRoutes;
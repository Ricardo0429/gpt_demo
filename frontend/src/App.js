import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Home from 'pages/home';
import Dashboard from 'pages/dashboard';
import MainHome from 'pages/main-home';
import Explorer from 'layout/Explorer';
import AdCopyGenerator from 'pages/ad-copy-generator';
import SocialMediaEngine from 'pages/social-media-engine';
import BlogAuthor from 'pages/blog-author';
import BrandGuidelines from 'pages/brand-guidelines';
import ArchetypeExplorer from 'pages/archetype-explorer';
import FutureModule from 'pages/future-module';
import Brainstorm from 'pages/brainstorm';
import History from 'pages/history';
import Trash from 'pages/trash';
import Setting from 'pages/settings';
import SignUp from 'pages/sign-up';

import './App.css';

function App() {
  return (
    <div className="app">
      <Box sx={{ flexGrow: 1, height: '100vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route element={<Dashboard />}>
            <Route path="home" element={<MainHome />} />
            <Route path="/home/brainstorm" element={<Brainstorm />} />
            <Route path="history" element={<History />} />
            <Route path="trash" element={<Trash />} />
            <Route path="setting" element={<Setting />} />
            <Route path="home/email-explorer" element={<Explorer />} />
            <Route path="home/blog-author" element={<BlogAuthor />} />
            <Route
              path="home/ad-copy-generator"
              element={<AdCopyGenerator />}
            />
            <Route
              path="home/social-media-engine"
              element={<SocialMediaEngine />}
            />
            <Route path="home/future-module" element={<FutureModule />} />
            <Route path="home/brand-guidelines" element={<BrandGuidelines />} />
            <Route
              path="home/archetype-explorer"
              element={<ArchetypeExplorer />}
            />
          </Route>
        </Routes>
      </Box>
    </div>
  );
}

export default App;

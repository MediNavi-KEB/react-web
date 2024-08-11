import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from '../home/Home';
import Locals from '../local/Locals';
import Chatbot from '../chatbot/Chatbot';
import MyPage from '../user/MyPage';
import Calendar from '../calendar/Calendar';
import Login from '../user/Login';
import Join from '../user/Join';
import { AnimatePresence, motion } from 'framer-motion';
import EntryPage from '../EntryPage';
import Account from '../user/Account';
import Faq from '../user/Faq';
import About from '../user/About';
import LocalList from '../local/LocalList';
import Saved from '../user/Saved';
import ChatDescription from '../chatbot/ChatDescription';

const RouteZip = () => {
  const location = useLocation();
  return (
    <div className="content">
      <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><EntryPage /></PageWrapper>} />
          <Route path='/login' element={<PageWrapper><Login /></PageWrapper>} />
          <Route path='/join' element={<PageWrapper><Join /></PageWrapper>} />
          <Route path='/home' element={<PageWrapper><Home /></PageWrapper>} />
          <Route path='/local' element={<PageWrapper><Locals /></PageWrapper>} />
          <Route path='/local/list' element={<PageWrapper><LocalList /></PageWrapper>} />
          <Route path='/mypage' element={<PageWrapper><MyPage /></PageWrapper>} />
          <Route path='/mypage/account' element={<PageWrapper><Account /></PageWrapper>} />
          <Route path='/mypage/saved' element={<PageWrapper><Saved /></PageWrapper>} />
          <Route path='/mypage/faq' element={<PageWrapper><Faq /></PageWrapper>} />
          <Route path='/mypage/about' element={<PageWrapper><About /></PageWrapper>} />
          <Route path='/calendar' element={<PageWrapper><Calendar /></PageWrapper>} />
          <Route path='/chatbot' element={<PageWrapper><Chatbot /></PageWrapper>} />
          <Route path='/description' element={<PageWrapper><ChatDescription /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};


export default RouteZip;

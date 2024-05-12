import styles from './sidebarnav.module.css';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

import {
  Home,
  SettingsSuggest,
  EmojiObjectsOutlined,
  History,
  Delete,
  KeyboardDoubleArrowLeft as KeyboardDoubleArrowLeftIcon,
  KeyboardDoubleArrowRight as KeyboardDoubleArrowRightIcon,
} from '@mui/icons-material';

const routes = [
  {
    to: '/home',
    content: 'Home',
    icon: <Home fontSize="large" sx={{ color: 'white' }} />,
  },
  {
    to: '/home/brainstorm',
    content: 'Brainstorm',
    icon: <EmojiObjectsOutlined fontSize="large" sx={{ color: 'white' }} />,
  },
  {
    to: '/history',
    content: 'History',
    icon: <History fontSize="large" sx={{ color: 'white' }} />,
  },
  {
    to: '/trash',
    content: 'Trash',
    icon: <Delete fontSize="large" sx={{ color: 'white' }} />,
  },
  {
    to: '/setting',
    content: 'Settings',
    icon: <SettingsSuggest fontSize="large" sx={{ color: 'white' }} />,
  },
];

export function Sidenav() {
  const [open, setopen] = useState(true);
  const toggleOpen = () => {
    setopen(!open);
  };
  return (
    <div className={open ? styles.sidenav : styles.sidenavClosed}>
      <button className={styles.menuBtn} onClick={toggleOpen}>
        {open ? (
          <KeyboardDoubleArrowLeftIcon />
        ) : (
          <KeyboardDoubleArrowRightIcon />
        )}
      </button>
      {routes.map((item, index) => {
        return (
          <NavLink key={index} className={styles.sideitem} to={item.to}>
            {item.icon}
            <span className={styles.linkText}>{item.content}</span>
          </NavLink>
        );
      })}
    </div>
  );
}

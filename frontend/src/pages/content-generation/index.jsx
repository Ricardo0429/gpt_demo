import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { Box, TextField, CircularProgress, Grid } from '@mui/material';
import Customization from 'pages/customization';
import PromptField from 'components/prompt';

const instance = axios.create({ baseURL: 'http://67.207.86.221:5000/api' });

export default function ContentGeneration() {
  const messageEndRef = useRef(null);
  const [prompt, setPrompt] = useState('');
  const [queries, setQueries] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const savedQueries = JSON.parse(localStorage.getItem('queries'));
    if (savedQueries && savedQueries?.length) {
      setQueries(savedQueries);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
    return () => {
      localStorage.setItem('queries', JSON.stringify(queries));
    };
  });

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('queries', JSON.stringify(queries));
  }, [queries]);

  const handleChange = (e) => {
    if (error) {
      setError(false);
    }
    setPrompt(e.target.value);
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      if (!prompt.length) {
        setError(true);
        return;
      }

      const archytype = localStorage.getItem('archytype');
      const options = JSON.parse(localStorage.getItem('options'));

      if (prompt.length) {
        const chats = queries;
        setIsTyping(true);
        chats.push({ role: 'user', content: prompt });
        setQueries(chats);
        setPrompt('');
        const {
          data: { text: answer },
        } = await instance.post('/content', { archytype, prompt, options });
        chats.push({ role: 'ai', content: answer });
        setQueries(chats);
        setIsTyping(false);
      }
    }
  };

  return (
    <Grid container sx={{ height: '100%' }} spacing={2}>
      <Customization />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '75%',
          width: '100%',
          boxShadow: 6,
          marginBottom: 2,
          borderRadius: 2,
          padding: 1,
          overflow: 'auto',
          '::-webkit-scrollbar': {
            width: '10px',
          },
          '::-webkit-scrollbar-thumb': {
            height: '50px',
            borderRadius: '10px',
            backgroundColor: 'darkgrey',
          },
        }}
      >
        {queries && queries.length
          ? queries?.map(({ role, content }, index) => (
              <PromptField prompt={content} key={index} left={role === 'ai'} />
            ))
          : ''}
        {isTyping && <CircularProgress disableShrink />}
        <div ref={messageEndRef}></div>
      </Box>
      <Box
        sx={{
          width: '100%',
          marginX: 6,
        }}
      >
        <TextField
          autoFocus
          label="Start Writing..."
          value={prompt}
          fullWidth
          required
          variant="filled"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          error={error}
          inputProps={{
            style: {
              height: '40px',
              fontSize: '1.5rem',
              color: '#291b1b',
            },
          }}
        />
      </Box>
    </Grid>
  );
}

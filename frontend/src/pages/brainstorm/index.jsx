import { useState, useEffect, useRef } from 'react';
import { Box, Button, Grid, TextField, CircularProgress } from '@mui/material';
import instance from 'utils/axios';
import { setAuth } from 'utils/setAuth';
import { useAuth } from 'hooks/useAuth';
import PromptField from 'components/prompt';

export default function Brainstorm() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setTyping] = useState(false);
  const textAreaRef = useRef(null);
  const { user } = useAuth();

  const handleQuestion = (e) => {
    setQuestion(e.target.value);
  };

  const askQuestion = async () => {
    if (question.length) {
      const chats = messages;
      try {
        setAuth(user);
        setTyping(true);
        chats.push({ role: 'user', content: question });
        setQuestion('');
        const {
          data: { answer },
        } = await instance.post('/brainstorm', { question });
        chats.push({ role: 'ai', content: answer });
        setMessages(chats);
        setTyping(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  return (
    <div className="h-full">
      <Grid
        item
        md={12}
        sx={{
          display: 'flex',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            width: '100%',
            boxShadow: 6,
            marginBottom: 4,
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
          {messages && messages.length
            ? messages?.map(({ role, content }, index) => (
                <PromptField
                  prompt={content}
                  key={index}
                  left={role === 'ai'}
                />
              ))
            : ''}
          {isTyping && <CircularProgress disableShrink />}
          <div ref={textAreaRef}></div>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <TextField
            fullWidth
            id="outlined-basic"
            variant="outlined"
            sx={{ borderColor: '#FA437F' }}
            value={question}
            onChange={handleQuestion}
          />
          <Button
            variant="contained"
            size="large"
            sx={{
              height: '56px',
              fontWeight: 700,
              fontSize: '20px',
              mx: 1,
              backgroundColor: '#FA437F',
            }}
            onClick={askQuestion}
          >
            Send
          </Button>
        </Box>
      </Grid>
    </div>
  );
}

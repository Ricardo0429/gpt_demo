import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import CommonExplorer from 'components/explorer';
import PromptField from 'components/prompt';
import instance from 'utils/axios';

import Upload from 'assets/images/upload_icon.png';

export default function BrandGuidelines() {
  const inputRef = useRef(null);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setTyping] = useState(false);

  const handleUpload = (e) => {
    inputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const fileObj = e.target.files && e.target.files[0];
    if (!fileObj) {
      return;
    }
    const formData = new FormData();
    formData.append('brand', fileObj);
    try {
      setLoading(true);
      await instance.post('/brand', formData);
      setLoading(false);
      e.target.value = null;
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuestion = (e) => {
    setQuestion(e.target.value);
  };

  const askQuestion = async () => {
    if (question.length) {
      const chats = messages;
      try {
        setTyping(true);
        chats.push({ role: 'user', content: question });
        setQuestion('');
        const {
          data: { answer },
        } = await instance.post('/brand/chat', { question });
        chats.push({ role: 'ai', content: answer });
        setMessages(chats);
        setTyping(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <CommonExplorer
      title="Brand Guidelines"
      description="Teach Archey about your distinct brand style, tone, and voice, ensuring you never go off-brand ever again."
    >
      <div className="brand-guidelines my-8">
        <Grid container spacing={4}>
          <Grid item md={3} sx={{ maxWidth: '488px' }}>
            <Paper
              elevation={3}
              sx={{
                height: '600px',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={handleUpload}
            >
              <p className="font-bold text-3xl text-center mb-8">File Upload</p>
              <Box
                className="border-dashed border-2 flex-1"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <img src={Upload} alt="upload_icon" className="mx-auto" />
                <input
                  hidden
                  type="file"
                  name="brand"
                  accept=".pdf,.docx"
                  ref={inputRef}
                  onChange={handleFileChange}
                />
              </Box>
              {loading && <LinearProgress />}
            </Paper>
          </Grid>
          <Grid
            item
            md={9}
            sx={{
              display: 'flex',
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
        </Grid>
      </div>
      <div className="templates">
        <Box>
          <p className="font-bold text-3xl mb-2">Templates</p>
          <p className="text-2xl mb-8">
            Use these preconfigured prompt templates to help Archey learn about
            your brand.
          </p>
        </Box>
        <Grid container spacing={4}>
          <Grid item md={3}>
            <Paper elevation={3} sx={{ height: '146px' }}></Paper>
          </Grid>
          <Grid item md={3}>
            <Paper elevation={3} sx={{ height: '146px' }}></Paper>
          </Grid>
          <Grid item md={3}>
            <Paper elevation={3} sx={{ height: '146px' }}></Paper>
          </Grid>
        </Grid>
      </div>
    </CommonExplorer>
  );
}

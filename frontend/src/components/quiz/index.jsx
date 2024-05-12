import { useState, useEffect } from 'react';
import {
  Button,
  ButtonGroup,
  Box,
  Typography,
  LinearProgress,
  Container,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from '@mui/material';

export default function Quiz({
  quizNum,
  quiz,
  completed,
  forwardQuiz,
  prevQuiz,
}) {
  const [answer, setAnswer] = useState('');
  useEffect(() => {
    // console.log(completed);
  }, [quiz]);

  const handleRadioChange = (e) => {
    setAnswer([quizNum, Number(e.target.value)]);
  };
  return (
    <Container>
      <Typography
        variant="h4"
        component="h3"
        sx={{ marginTop: 4, marginBottom: 4 }}
      >
        Find out which one you are...
      </Typography>
      <p className="mb-4">"*" indicates required fields</p>
      <LinearProgress
        variant="determinate"
        value={completed}
        sx={{ height: 15, borderRadius: 5, marginBottom: 4 }}
      />
      <p className="mb-2">{`Question #${quizNum + 1}*`}</p>
      <p className="mb-2">{quiz?.question}</p>
      <FormControl>
        <RadioGroup onChange={handleRadioChange}>
          {quiz?.samples.map((item, index) => (
            <FormControlLabel
              value={index}
              control={<Radio />}
              label={item}
              key={index}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Box sx={{ marginTop: 4, marginBottom: 4 }}>
        <ButtonGroup>
          {Boolean(quizNum) && (
            <Button variant="outlined" onClick={prevQuiz}>
              Previous
            </Button>
          )}
          <Button
            variant="contained"
            color="success"
            onClick={() => forwardQuiz(answer)}
          >
            Next
          </Button>
        </ButtonGroup>
      </Box>
    </Container>
  );
}

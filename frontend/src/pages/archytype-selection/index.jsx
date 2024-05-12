import { useState, useEffect } from 'react';
import { Box, Alert, AlertTitle, Typography } from '@mui/material';

import Quiz from 'components/quiz';
import { archetypes } from 'constants/archetypes';
import { quizzes } from 'constants/quiz';
import instance from 'utils/axios';
import { useAuth } from 'hooks/useAuth';
import { setAuth } from 'utils/setAuth';

const archyStats = archetypes.map(({ name }) => {
  return [name, 0];
});

export default function ArchytypeSelection({ setIsOpen }) {
  const [archytype, setArchytype] = useState('');
  const [quizIndex, setQuizIndex] = useState(0);
  const [completed, setCompleted] = useState(0);
  const { user } = useAuth();
  const [archytypeDesc, setArchytypeDesc] = useState(
    'Explanation of Archetype selected'
  );
  const [quiz, setQuiz] = useState(true);

  useEffect(() => {
    setAuth(user);
  }, []);

  const calcArchytypes = (answer) => {
    const [quizNum, answerIndex] = answer;
    const { answers } = quizzes[quizNum];
    const selectedAnswer = answers[answerIndex];
    if (Array.isArray(selectedAnswer)) {
      selectedAnswer.map((item) =>
        archyStats.forEach((archy) => {
          if (archy[0] === item) {
            archy[1]++;
          }
        })
      );
    } else {
      archyStats.forEach((archy) => {
        if (archy[0] === selectedAnswer) {
          archy[1]++;
        }
      });
    }
    const [result] = archyStats.sort((a, b) => b[1] - a[1]);
    return result[0];
  };

  const forwardQuiz = async (answer) => {
    if (Number(quizIndex) + 1 < quizzes.length) {
      calcArchytypes(answer);
      setQuizIndex(quizIndex + 1);
    } else {
      const yourArchy = calcArchytypes(answer);
      await instance.put('/brand/archetype', { archetype: yourArchy });
      setQuiz(false);
      setArchytype(yourArchy);
    }
  };

  const prevQuiz = () => {
    if (quizIndex - 1 >= 0) {
      setQuizIndex(quizIndex - 1);
    }
  };

  useEffect(() => {
    const selected = archetypes.filter((item) => item.name === archytype);
    if (selected.length) {
      setArchytypeDesc(selected[0].explanation);
    }
  }, [archytype]);

  useEffect(() => {
    setCompleted((quizIndex / quizzes.length) * 100);
  }, [quizIndex]);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        {quiz ? (
          <Quiz
            quiz={quizzes[quizIndex]}
            quizNum={quizIndex}
            completed={completed}
            prevQuiz={prevQuiz}
            forwardQuiz={forwardQuiz}
          />
        ) : (
          <Alert severity="success" sx={{ m: 4 }}>
            <AlertTitle>Success</AlertTitle>
            <Typography
              variant="h4"
              component="h4"
              sx={{ marginTop: 4, marginBottom: 4 }}
            >
              Your archytype is — <strong>{archytype}!</strong>
            </Typography>
          </Alert>
        )}
      </Box>
    </>
  );
}

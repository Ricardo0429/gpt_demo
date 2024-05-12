import { useState } from 'react';
import { useEffect } from 'react';
import instance from 'utils/axios';
import { setAuth } from 'utils/setAuth';
import { useAuth } from 'hooks/useAuth';

export default function History() {
  const [history, setHistory] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    async function fetchHistory() {
      setAuth(user);
      const {
        data: { history },
      } = await instance.post('/history');
      if (history) {
        setHistory(history.messages);
      } else {
        setHistory([]);
      }
    }

    fetchHistory();
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">My Prompt History</h1>
      {history.length ? (
        history.map((item, index) => {
          return (
            <div key={index} className="text-xl mb-2 ml-4">
              {index + 1}. {item.prompt}
            </div>
          );
        })
      ) : (
        <div className="text-xl">No prompts</div>
      )}
    </div>
  );
}

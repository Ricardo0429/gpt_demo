import { Paper } from '@mui/material';

export default function ArchetypeItem(props) {
  return (
    <Paper
      variant="outlined"
      square
      sx={{
        height: '200px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        '&:hover': {
          cursor: 'pointer',
        },
        border: props.item.name === props.activeName && '4px solid #fa437f',
      }}
    >
      <h2 className="text-2xl font-bold">{props.item.name}</h2>
      <p>{props.item.description}</p>
    </Paper>
  );
}

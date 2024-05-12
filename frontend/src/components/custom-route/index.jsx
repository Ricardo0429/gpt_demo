import { Route } from 'react-router-dom';
import { Grid } from '@mui/material';
import { Sidenav as Sidebar } from 'layout/Sidebar';

export default function CustomRoute({ ...props }) {
  return (
    <Route {...props} />
    // <Grid container>
    //   <Grid item md={2}>
    //     <Sidebar />
    //   </Grid>
    //   <Grid item md={10}>
    //     <div className="h-screen text-3xl text-gray-700 font-bold p-10">
    //     </div>
    //   </Grid>
    // </Grid>
  );
}

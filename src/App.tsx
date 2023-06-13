import {
  BrowserRouter,
  Route,
} from "react-router-dom";
import { Home } from './Home';
import { MeterDetailsPage } from './MeterDetailsPage';
import { useAsyncMeters } from './useAsyncMeters';


function App() {
  const { meters, errorMessage,  putAsyncMeters, postAsyncMeters, deleteAsyncMeters} = useAsyncMeters();
  if (errorMessage) {
    console.error(errorMessage);
  }
  return (
    <BrowserRouter>
      <Route exact path="/">
        <Home meters={meters} postAsyncMeters={postAsyncMeters} />
      </Route>
      <Route path="/:meterId">
        <MeterDetailsPage meters={meters} putAsyncMeters={putAsyncMeters} deleteAsyncMeters={deleteAsyncMeters} />
      </Route>
    </BrowserRouter>
  );
}

export default App;

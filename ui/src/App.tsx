import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { io } from "socket.io-client";

const App = () => {
  const socket = io('localhost:3000')

  socket.on('connect', () => {
    console.log(socket.id)
  })

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Homepage from './Homepage'; 
import Getstarted from './components/Getstarted';
import About from './components/Aboutus';
import Course from './Course';
import Courseoverview from './components/Courseoverview'; 
import { UserProvider } from './UserContext';
import CourseHome from './CourseHome';
import CourseModule from './components/CourseModule';
import UploadExcel from './components/UploadExcel';
import Course2 from './Course2';
function App() {
  return (
    <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/getstarted" element={<Getstarted />} />
        <Route path="/about" element={<About />} />


        <Route path="course" element={<Course />} />
        <Route path="enrolledcourse" element={<Course2 />} />
        <Route path="course/:id" element={<Courseoverview />} /> 

        <Route path='/learn/:id/home' element={<CourseHome />}></Route>
        <Route path='/admin/upload' element={<UploadExcel />}></Route>
        <Route path='/learn/:id/home/module/:moduleid' element={<CourseModule />}></Route>

      </Routes>
    </BrowserRouter>
    </UserProvider>
  );
}

export default App;

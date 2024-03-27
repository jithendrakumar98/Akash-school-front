import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import MainHome from './UI/mainhome';
import StudentLoginPage from './UI/Student/Studentlogin';
import AddTeacher from './UI/Admin/Addteacher';
import AddStudent from './UI/Admin/Addstudent';
import ViewTeachers from './UI/Admin/viewTeacher';
import AdminHome from './UI/Admin/Adminhome';
import ViewAllStudents from './UI/Admin/viewStudent';
import UpdateStudentFee from './UI/Admin/Feeupdate';
import AdminLogin from './UI/Admin/AdminLogin'
import AddBus from './UI/Admin/Addbus';
import ViewBus from './UI/Admin/viewBus';
import Newadmin from './UI/Admin/newadmin';
import Studenthome from './UI/Student/Studenthome';
import Footer from './footer';
import TeacherLogin from './UI/Teacher/TeacherLogin';
import Teacherhome from './UI/Teacher/Teacherhome'
import Addexam from './UI/Admin/Addexam';
import Addmarks from './UI/Teacher/Addmarks';
import Seemarks from'./UI/Student/marks';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/viewstudents" element={<ViewAllStudents />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/Adminhome" element={<AdminHome />} />
        <Route path="/studentlogin" element={<StudentLoginPage />} />
        <Route path="/Addstudent" element={<AddStudent/>}/>
        <Route path="/Addteacher" element={<AddTeacher/>}/>
        <Route path="/viewteachers" element={<ViewTeachers/>}/>
        <Route path="/updatefee" element={<UpdateStudentFee/>}/>
        <Route path="/addbus" element={<AddBus/>}/>
        <Route path="/viewbuses" element={<ViewBus/>}/>
        <Route path="/newadmin" element={<Newadmin/>}/>
        <Route path="/Studenthome" element={<Studenthome/>}/>
        <Route path="/teacherlogin" element={<TeacherLogin/>}/>
        <Route path="/Teacherhome" element={<Teacherhome/>}/>
        <Route path="/Addexam" element={<Addexam/>}/>
        <Route path="/Addmarks" element={<Addmarks/>}/>
        <Route path="seemarks" element={<Seemarks />}/>
        
        
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const TableContainer = styled.div`
  margin: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHead = styled.thead`
  background-color: #f2f2f2;
`;

const TableRow = styled.tr``;

const TableHeader = styled.th`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
`;

const TableBody = styled.tbody``;

const TableData = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Select = styled.select`
  margin-right: 10px;
`;

const Input = styled.input`
  margin-right: 10px;
`;

const Button = styled.button`
  margin-right: 10px;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const App = () => {
  const [studentMarks, setStudentMarks] = useState([]);
  const [filteredMarks, setFilteredMarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [teacherDetails, setTeacherDetails] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const userType = localStorage.getItem('userType');
      const teacherId = localStorage.getItem('adminUsername');
  
      if (!isLoggedIn || isLoggedIn !== 'true' || !teacherId) {
        navigate('/Teacherlogin');
      } else {
        fetchTeacherDetails(teacherId);
      }
    }, [navigate]);
  
    const fetchTeacherDetails = async (teacherId) => {
      try {
        const response = await fetch(`https://akash-school.onrender.com/api/Addteacher/teacher/${teacherId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch teacher details');
        }
        const data = await response.json();
        const filteredData = Object.fromEntries(
          Object.entries(data).filter(([key]) => !['_id', 'password', '__v'].includes(key))
        );
        setTeacherDetails(filteredData);
      } catch (error) {
        console.error('Error fetching teacher details:', error);
      }
    };
  

  useEffect(() => {
    fetchStudentMarks();
  }, []);

  const fetchStudentMarks = async () => {
    try {
      const response = await axios.get('https://akash-school.onrender.com/api/Addmarks');
      setStudentMarks(response.data);
      setFilteredMarks(response.data);
    } catch (error) {
      setError('Error fetching student marks');
      console.error('Error fetching student marks:', error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredMarks(studentMarks);
    } else {
      const filtered = studentMarks.filter(
        (mark) =>
          mark.Studentid.includes(term) ||
          mark.Studentname.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredMarks(filtered);
    }
  };

  const handleClassFilter = (e) => {
    const cls = e.target.value;
    setSelectedClass(cls);
    if (cls === 'All') {
      setFilteredMarks(studentMarks);
    } else {
      const filtered = studentMarks.filter((mark) => mark.class === cls);
      setFilteredMarks(filtered);
    }
  };

  const handleUpdateMarks = async (studentId, examName) => {
    try {
      const response = await axios.get(`https://akash-school.onrender.com/api/Addmarks/${studentId}/${examName}`);
      if (!response.data) {
        setError('Student not found!');
        return;
      }

      const telugu = parseFloat(prompt('Enter Telugu marks:'));
      const hindi = parseFloat(prompt('Enter Hindi marks:'));
      const english = parseFloat(prompt('Enter English marks:'));
      const maths = parseFloat(prompt('Enter Maths marks:'));
      const science = parseFloat(prompt('Enter Science marks:'));
      const social = parseFloat(prompt('Enter Social marks:'));

      if (
        isNaN(telugu) ||
        isNaN(hindi) ||
        isNaN(english) ||
        isNaN(maths) ||
        isNaN(science) ||
        isNaN(social)
      ) {
        setError('Invalid input! Please enter valid numbers.');
        return;
      }

      const updatedMarks = {
        Telugu: telugu || 0,
        Hindi: hindi || 0,
        English: english || 0,
        Maths: maths || 0,
        Science: science || 0,
        Social: social || 0,
      };

      for (const subject in updatedMarks) {
        if (updatedMarks[subject] < 0 || updatedMarks[subject] > 100) {
          setError(`Marks for ${subject} must be between 0 and 100.`);
          return;
        }
      }

      await axios.put(`https://akash-school.onrender.com/api/Addmarks/${studentId}/${examName}`, updatedMarks);
      setError('Marks updated successfully!');
      fetchStudentMarks();
    } catch (error) {
      setError('Failed to update marks!');
      console.error('Error updating marks:', error);
    }
  };

  const calculateTotalMarks = (marks) => {
    let total = 0;
    for (const subject in marks) {
      total += marks[subject];
    }
    return total;
  };

  return (
    <TableContainer>
      <ControlsContainer>
        <Input
          type="text"
          placeholder="Search by ID or Name"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Select onChange={handleClassFilter} value={selectedClass}>
          <option value="All">All Classes</option>
          <option value="1A">1A</option>
          <option value="1B">1B</option>
          <option value="2A">2A</option>
          <option value="2B">2B</option>
          <option value="3A">3A</option>
          <option value="3B">3B</option>
          <option value="4A">4A</option>
          <option value="4B">4B</option>
          <option value="5A">5A</option>
          <option value="5B">5B</option>
          <option value="6A">6A</option>
          <option value="6B">6B</option>
          <option value="7A">7A</option>
          <option value="7B">7B</option>
          <option value="8A">8A</option>
          <option value="8B">8B</option>
          <option value="9A">9A</option>
          <option value="9B">9B</option>
          <option value="10A">10A</option>
          <option value="10B">10B</option>
        </Select>
      </ControlsContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Student ID</TableHeader>
            <TableHeader>Student Name</TableHeader>
            <TableHeader>Class</TableHeader>
            <TableHeader>Exam Name</TableHeader>
            <TableHeader>Telugu</TableHeader>
            <TableHeader>Hindi</TableHeader>
            <TableHeader>English</TableHeader>
            <TableHeader>Maths</TableHeader>
            <TableHeader>Science</TableHeader>
            <TableHeader>Social</TableHeader>
            <TableHeader>Total Marks</TableHeader>
            <TableHeader>Update</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredMarks.map((mark) => (
            <TableRow key={`${mark.Studentid}-${mark.Examname}`}>
              <TableData>{mark.Studentid}</TableData>
              <TableData>{mark.Studentname}</TableData>
              <TableData>{mark.class}</TableData>
              <TableData>{mark.Examname}</TableData>
              <TableData>{Math.max(mark.Telugu,)}</TableData>
              <TableData>{Math.max(mark.Hindi,)}</TableData>
              <TableData>{Math.max(mark.English)}</TableData>
              <TableData>{Math.max(mark.Maths)}</TableData>
              <TableData>{Math.max(mark.Science)}</TableData>
              <TableData>{Math.max(mark.Social)}</TableData>
              <TableData>
                {calculateTotalMarks({
                  Telugu: mark.Telugu,
                  Hindi: mark.Hindi,
                  English: mark.English,
                  Maths: mark.Maths,
                  Science: mark.Science,
                  Social: mark.Social,
                })}
              </TableData>
              <TableData>
                <Button onClick={() => handleUpdateMarks(mark.Studentid, mark.Examname)}>
                  Update
                </Button>
              </TableData>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default App;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTable } from 'react-table';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  margin: 20px;
`;

const Title = styled.h1`
  text-align: center;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 10px;
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

const Select = styled.select`
  margin-right: 10px;
`;

const Button = styled.button`
  margin-right: 10px;
`;

const Input = styled.input`
  margin-right: 10px;
`;

const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ConfirmationModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
`;

const TableHeader = styled.th`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  background-color: #f2f2f2;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

const TableCell = styled.td`
  padding: 10px;
`;

function App() {
  const [studentMarks, setStudentMarks] = useState([]);
  const [filteredMarks, setFilteredMarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [examToDelete, setExamToDelete] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedExamName, setSelectedExamName] = useState('');

  useEffect(() => {
    fetchStudentMarks();
  }, []);

  const fetchStudentMarks = async () => {
    try {
      const response = await axios.get('https://akash-school.onrender.com/api/Addmarks');
      setStudentMarks(response.data);
      setFilteredMarks(response.data);
    } catch (error) {
      console.error('Error fetching student marks:', error);
    }
  };

  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const fetchAdminData = (loggedInUsername, navigate, setUsername) => {
    fetch('https://akash-school.onrender.com/api/Admin')
      .then(response => {
        if (!response.ok) {
          console.error('Error:', response.statusText);
          navigate('/Adminlogin');
          throw new Error('Unauthorized');
        }
        return response.json();
      })
      .then(data => {
        const isAdmin = data.some(admin => admin.Username === loggedInUsername);
        if (isAdmin) {
          setUsername(loggedInUsername);
        } else {
          console.log("User is not an admin, redirecting to login page");
          navigate('/Adminlogin');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        navigate('/Adminlogin');
      });
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loggedInUsername = localStorage.getItem('adminUsername');

    console.log("isLoggedIn:", isLoggedIn);
    console.log("loggedInUsername:", loggedInUsername);

    if (!isLoggedIn || isLoggedIn !== 'true' || !loggedInUsername) {
      console.log("Redirecting to login page");
      navigate('/Adminlogin');
    } else {
      fetchAdminData(loggedInUsername, navigate, setUsername);
    }
  }, [navigate, setUsername]);

  const addMarksForExam = async (examName) => {
    try {
      const students = await axios.get('https://akash-school.onrender.com/api/Addstudent');
      const studentMarksToAdd = students.data.map(student => ({
        Studentid: student.Studentid,
        Studentname: student.Studentname,
        class: student.class,
        Examname: examName,
        Telugu: -1,
        Hindi: -1,
        English: -1,
        Maths: -1,
        Science: -1,
        Social: -1
      }));

      await axios.post('https://akash-school.onrender.com/api/Addmarks', studentMarksToAdd);
      toast.success('Marks added successfully!');
      fetchStudentMarks();
    } catch (error) {
      console.error('Error adding marks for exam:', error);
      toast.error('Failed to add marks!');
    }
  };

  const updateMarksForStudent = async () => {
    try {
      const studentId = prompt('Enter student ID:');
      const examName = prompt('Enter exam name:');
      if (!studentId || !examName) return;

      const response = await axios.get(`https://akash-school.onrender.com/api/Addmarks/${studentId}/${examName}`);
      if (!response.data) {
        alert('Student not found!');
        return;
      }

      const updatedMarks = {
        Telugu: parseFloat(prompt('Enter Telugu marks:')),
        Hindi: parseFloat(prompt('Enter Hindi marks:')),
        English: parseFloat(prompt('Enter English marks:')),
        Maths: parseFloat(prompt('Enter Maths marks:')),
        Science: parseFloat(prompt('Enter Science marks:')),
        Social: parseFloat(prompt('Enter Social marks:'))
      };

      await axios.put(`https://akash-school.onrender.com/api/Addmarks/${studentId}/${examName}`, updatedMarks);
      toast.success('Marks updated successfully!');
      fetchStudentMarks();
    } catch (error) {
      console.error('Error updating marks:', error);
      toast.error('Failed to update marks!');
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = studentMarks.filter(mark =>
      mark.Studentid.includes(term) || mark.Studentname.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredMarks(filtered);
  };

  const handleClassFilter = (e) => {
    const cls = e.target.value;
    setSelectedClass(cls);
    if (cls === 'All') {
      setFilteredMarks(studentMarks);
    } else {
      const filtered = studentMarks.filter(mark => mark.class === cls);
      setFilteredMarks(filtered);
    }
  };

  const handleExport = () => {
    const header = [
      'Student ID',
      'Student Name',
      'class',
      'Exam Name',
      'Telugu',
      'Hindi',
      'English',
      'Maths',
      'Science',
      'Social',
      'Total'
    ];

    const data = filteredMarks.map(student => [
      student.Studentid,
      student.Studentname,
      student.class,
      student.Examname,
      student.Telugu === -1 ? 0 : student.Telugu,
      student.Hindi === -1 ? 0 : student.Hindi,
      student.English === -1 ? 0 : student.English,
      student.Maths === -1 ? 0 : student.Maths,
      student.Science === -1 ? 0 : student.Science,
      student.Social === -1 ? 0 : student.Social,
      (student.Telugu === -1 ? 0 : student.Telugu) +
      (student.Hindi === -1 ? 0 : student.Hindi) +
      (student.English === -1 ? 0 : student.English) +
      (student.Maths === -1 ? 0 : student.Maths) +
      (student.Science === -1 ? 0 : student.Science) +
      (student.Social === -1 ? 0 : student.Social)
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'student_marks');
    XLSX.writeFile(workbook, 'student_marks.xlsx');
  };

  const deleteAllData = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete all data?');
    if (!confirmDelete) return;

    try {
      await axios.delete('https://akash-school.onrender.com/api/Addmarks');
      toast.success('All data deleted successfully!');
      fetchStudentMarks();
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error('Failed to delete data!');
    }
  };

  const deleteRecordsByExamName = async () => {
    if (!examToDelete) {
      alert('Please select an exam to delete records for.');
      return;
    }

    try {
      await axios.delete(`https://akash-school.onrender.com/api/Addmarks/${examToDelete}`);
      toast.success(`All records for ${examToDelete} deleted successfully!`);
      fetchStudentMarks();
    } catch (error) {
      console.error(`Error deleting records for ${examToDelete}:`, error);
      toast.error(`Failed to delete records for ${examToDelete}!`);
    }
  };

  const handleConfirmationOpen = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmationClose = () => {
    setIsConfirmationOpen(false);
    setConfirmationCode('');
  };

  const handleExamNameFilter = (e) => {
    const examName = e.target.value;
    setSelectedExamName(examName);
    filterMarks(selectedClass, selectedExam, examName);
  };

  const filterMarks = (cls, exam, examName) => {
    let filtered = studentMarks;
    if (cls !== 'All') {
      filtered = filtered.filter((mark) => mark.class === cls);
    }
    if (exam !== 'All') {
      filtered = filtered.filter((mark) => mark.Examname === exam);
    }
    if (examName !== 'All') {
      filtered = filtered.filter((mark) => mark.Examname === examName);
    }
    setFilteredMarks(filtered);
  };

  const handleConfirmationSubmit = async () => {
    if (confirmationCode.length !== 6 || isNaN(confirmationCode)) {
      alert('Please enter a valid 6-digit number.');
      return;
    }

    const enteredCode = parseInt(confirmationCode);

    if (enteredCode === 903059) {
      await deleteAllData();
      handleConfirmationClose();
    } else {
      alert('Invalid confirmation code.');
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Student ID',
        accessor: 'Studentid'
      },
      {
        Header: 'Student Name',
        accessor: 'Studentname'
      },
      {
        Header: 'Class',
        accessor: 'class'
      },
      {
        Header: 'Exam Name',
        accessor: 'Examname'
      },
      {
        Header: 'Telugu',
        accessor: 'Telugu'
      },
      {
        Header: 'Hindi',
        accessor: 'Hindi'
      },
      {
        Header: 'English',
        accessor: 'English'
      },
      {
        Header: 'Maths',
        accessor: 'Maths'
      },
      {
        Header: 'Science',
        accessor: 'Science'
      },
      {
        Header: 'Social',
        accessor: 'Social'
      },
      {
        Header: 'Total',
        accessor: 'Total',
        Cell: ({ row }) => {
          const telugu = row.values.Telugu === -1 ? 0 : row.values.Telugu;
          const hindi = row.values.Hindi === -1 ? 0 : row.values.Hindi;
          const english = row.values.English === -1 ? 0 : row.values.English;
          const maths = row.values.Maths === -1 ? 0 : row.values.Maths;
          const science = row.values.Science === -1 ? 0 : row.values.Science;
          const social = row.values.Social === -1 ? 0 : row.values.Social;
          return telugu + hindi + english + maths + science + social;
        }
      }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data: filteredMarks });

  return (
    <Container>
      <Title>Student Marks</Title>
      <ControlsContainer>
        <ControlGroup>
          <Select onChange={(e) => setSelectedExam(e.target.value)} value={selectedExam}>
            <option value="">Select Exam</option>
            <option value="FA1">FA1</option>
            <option value="FA2">FA2</option>
            <option value="SA1">SA1</option>
            <option value="Final">Final</option>
          </Select>
          <Button onClick={() => addMarksForExam(selectedExam)}>Add Exam</Button>
          <Button onClick={updateMarksForStudent}>Update Marks</Button>
        </ControlGroup>
        <ControlGroup>
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
            <option value="6A">6A  </option>
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
          <Select onChange={handleExamNameFilter} value={selectedExamName}>
            <option value="All">All Exams</option>
            <option value="FA1">FA1</option>
            <option value="FA2">FA2</option>
            <option value="SA1">SA1</option>
            <option value="Final">Final</option>
          </Select>
        </ControlGroup>
        <ControlGroup>
          <Button onClick={handleExport}>Export to Excel</Button>
          <Button onClick={handleConfirmationOpen} style={{ backgroundColor: 'red', color: 'white' }}>
            Delete All Data
          </Button>
          <Select onChange={(e) => setExamToDelete(e.target.value)} value={examToDelete}>
            <option value="">Select Exam to Delete</option>
            <option value="FA1">FA1</option>
            <option value="FA2">FA2</option>
            <option value="SA1">SA1</option>
            <option value="Final">Final</option>
          </Select>
          <Button
            onClick={deleteRecordsByExamName}
            style={{ backgroundColor: 'orange', color: 'white' }}
          >
            Delete Records by Exam Name
          </Button>
        </ControlGroup>
      </ControlsContainer>
      {isConfirmationOpen && (
        <ConfirmationModal>
          <ConfirmationModalContent>
            <Input
              type="text"
              placeholder="Enter 6-digit code to confirm deletion"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              style={{ width: '300px', height: '40px', fontSize: '16px', marginRight: '10px' }}
            />
            <Button onClick={handleConfirmationSubmit}>Confirm</Button>
            <Button onClick={handleConfirmationClose}>Cancel</Button>
          </ConfirmationModalContent>
        </ConfirmationModal>
      )}
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableHeader {...column.getHeaderProps()}>{column.render('Header')}</TableHeader>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>;
                })}
              </TableRow>
            );
          })}
        </tbody>
      </Table>
      <ToastContainer />
    </Container>
  );
}

export default App;


     

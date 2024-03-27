import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

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
const MarksPage = ({ studentId }) => {
  const [studentMarks, setStudentMarks] = useState([]);
 
  useEffect(() => {
    fetchStudentMarks();
  }, []);

  const fetchStudentMarks = async () => {
    try {
      const response = await axios.get(`https://akash-school.onrender.com/api/addmarks/studentId/${localStorage.getItem('adminUsername')}`);
      setStudentMarks(response.data);
    } catch (error) {
      console.error('Error fetching student marks:', error);
    }
  };

  const calculateTotalMarks = (marks) => {
    let total = 0;
    for (const subject in marks) {
      const mark = marks[subject];
      total += mark === -1 ? 0 : mark;
    }
    return total;
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Student ID</TableHeader>
            <TableHeader>Student Name</TableHeader>
            <TableHeader>Exam Name</TableHeader>
            <TableHeader>Class</TableHeader>
            <TableHeader>Telugu</TableHeader>
            <TableHeader>Hindi</TableHeader>
            <TableHeader>English</TableHeader>
            <TableHeader>Maths</TableHeader>
            <TableHeader>Science</TableHeader>
            <TableHeader>Social</TableHeader>
            <TableHeader>Total</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {studentMarks.map((mark, index) => (
            <TableRow key={index}>
              <TableData>{mark.Studentid}</TableData>
              <TableData>{mark.Studentname}</TableData>
              <TableData>{mark.Examname}</TableData>
              <TableData>{mark.class}</TableData>
              <TableData>{mark.Telugu }</TableData>
              <TableData>{mark.Hindi}</TableData>
              <TableData>{mark.English}</TableData>
              <TableData>{mark.Maths }</TableData>
              <TableData>{mark.Science }</TableData>
              <TableData>{mark.Social }</TableData>
              <TableData>
                {calculateTotalMarks({
                  Telugu: mark.Telugu,
                  Hindi: mark.Hindi ,
                  English: mark.English ,
                  Maths: mark.Maths,
                  Science: mark.Science,
                  Social: mark.Social,
                })}
              </TableData>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MarksPage;
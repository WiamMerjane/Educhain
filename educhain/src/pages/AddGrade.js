import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import GradeVerificationJSON from '../contracts/GradeVerification.json'

const AddGrade = () => {
  const [accounts, setAccounts] = useState([]);
  const [gradeContract, setGradeContract] = useState(null);
  const [studentAddress, setStudentAddress] = useState('');
  const [courseName, setCourseName] = useState('');
  const [grade, setGrade] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
       
        await window.ethereum.request({ method: 'eth_requestAccounts' });
  
          const web3 = new Web3(window.ethereum);  // On utilise window.ethereum directement
          const userAccounts = await web3.eth.getAccounts();
          setAccounts(userAccounts);
        
        const gradeContractInstance = new web3.eth.Contract(
          GradeVerificationJSON.abi,
          '0xA73143dBd20572E436eF58C077811499bFFD3C64'
        );
        setGradeContract(gradeContractInstance);
      }
    };

    initWeb3();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (gradeContract) {
      await gradeContract.methods.addGrade(studentAddress, courseName, grade).send({ from: accounts[0] });
      alert('Grade added successfully!');
    } else {
      alert('Contract not initialized!');
    }
  };

  return (
    <div>
      <h1>Add Grade</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Student Address"
          value={studentAddress}
          onChange={(e) => setStudentAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />
        <button type="submit">Add Grade</button>
      </form>
    </div>
  );
};

export default AddGrade;

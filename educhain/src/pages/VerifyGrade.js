import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import GradeVerificationJSON from '../contracts/GradeVerification.json'

const VerifyGrade = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [gradeVerificationContract, setGradeVerificationContract] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      const web3Instance = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWeb3(web3Instance);

      const accounts = await web3Instance.eth.getAccounts();
      setAccounts(accounts);

      const networkId = await web3Instance.eth.net.getId();
      const gradeVerificationNetworkData = GradeVerificationJSON.networks[networkId];
      const gradeVerificationContractInstance = new web3Instance.eth.Contract(
        GradeVerificationJSON.abi,
        gradeVerificationNetworkData && gradeVerificationNetworkData.address
      );
      setGradeVerificationContract(gradeVerificationContractInstance);
    };

    initWeb3();
  }, []);

  const verifyGrade = async (studentAddress, gradeIndex) => {
    try {
      await gradeVerificationContract.methods.verifyGrade(studentAddress, gradeIndex).send({ from: accounts[0] });
      alert('Grade verified successfully!');
    } catch (error) {
      console.error('Error verifying grade:', error);
    }
  };

  return (
    <div>
      <h2>Verify Grade</h2>
      <input type="text" id="verifyStudentAddress" placeholder="Student Address" />
      <input type="number" id="gradeIndex" placeholder="Grade Index" />
      <button
        onClick={() => verifyGrade(
          document.getElementById('verifyStudentAddress').value,
          document.getElementById('gradeIndex').value
        )}
      >
        Verify Grade
      </button>
    </div>
  );
};

export default VerifyGrade;

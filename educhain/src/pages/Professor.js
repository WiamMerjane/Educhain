import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SidebarProf from './SidebarProf';
import SidebarAdmin from './SidebarAdmin';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Bar, Pie, Radar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  LineElement,
  Legend,
  RadarController,
  RadialLinearScale,
  PointElement,
  ArcElement,
  PieController,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  LineElement,
  Legend,
  RadarController,
  RadialLinearScale,
  PointElement,
  ArcElement,
  PieController
);

import StudentJSON from '../contracts/Student.json';


const Dashboard = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsByField, setStudentsByField] = useState({});
  const [studentsByYear, setStudentsByYear] = useState({});
  const [pieData, setPieData] = useState({ datasets: [] });
  const [radarData, setRadarData] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const contractInstance = new web3Instance.eth.Contract(
            StudentJSON.abi,
            '0x1f11EE6027486c7294e90D1c3A0094efA8cAf363'
          );
          setContract(contractInstance);
        } catch (error) {
          console.error('Error initializing web3:', error);
        }
      } else {
        alert('Please install MetaMask to access this feature.');
      }
    };

    initWeb3();
  }, []);

  useEffect(() => {
    const fetchAllStudents = async () => {
      if (!contract) return;

      try {
        const allStudents = await contract.methods.getAllStudents().call();
        setStudents(allStudents);
        processStudentData(allStudents);
      } catch (err) {
        console.error('Error fetching students:', err);
      }
    };

    fetchAllStudents();
  }, [contract]);

  const processStudentData = (data) => {
    const fieldCounts = data.reduce((acc, student) => {
      const field = student.filiere || 'Unknown';
      acc[field] = (acc[field] || 0) + 1;
      return acc;
    }, {});

    setStudentsByField(fieldCounts);

    const totalStudents = data.length;
    setPieData({
      labels: Object.keys(fieldCounts),
      datasets: [
        {
          data: Object.values(fieldCounts).map(
            (count) => (count / totalStudents) * 100
          ),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
        },
      ],
    });

    const yearCounts = data.reduce((acc, student) => {
      const year = student.anneeUniv || 'Unknown Year';
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {});

    setStudentsByYear(yearCounts);

    const radarData = data.map((student) => ({
      name: `${student.firstName} ${student.lastName}`,
      average: student.averageGrade || 0,
    }));

    setRadarData(radarData);
  };

  return (
    <div className="dashboard-container">
      <SidebarProf />

      <Container className="mt-4">
        <h2 className="text-center">Student Dashboard</h2>

        {students.length > 0 ? (
          <>
            <Row className="mb-4">
              <Col md={6}>
                <Card className="shadow-lg">
                  <Card.Body>
                    <Card.Title>Students by Field</Card.Title>
                    <Bar
                      data={{
                        labels: Object.keys(studentsByField),
                        datasets: [
                          {
                            label: "Number of Students",
                            data: Object.values(studentsByField),
                            backgroundColor: '#3b82f6',
                          },
                        ],
                      }}
                    />
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="shadow-lg">
                  <Card.Body>

                    <Card.Title>Students per Year</Card.Title>
                    <Bar
                      data={{
                        labels: Object.keys(studentsByYear),
                        datasets: [
                          {
                            label: "Number of Students",
                            data: Object.values(studentsByYear),
                            backgroundColor: '#4CAF50',
                          },
                        ],
                      }}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <Card className="shadow-lg">
                  <Card.Body>
                    <Card.Title>Field Distribution</Card.Title>
                    <Pie data={pieData} />
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="shadow-lg">
                  <Card.Body>
                    <Card.Title>Student Performance Radar</Card.Title>
                    <Radar
                      data={{
                        labels: radarData.map((item) => item.name),
                        datasets: [
                          {
                            label: 'Performance',
                            data: radarData.map((item) => item.average),
                            backgroundColor: 'rgba(255, 99, 132, 0.6)',
                            borderColor: '#ff6384',
                          },
                        ],
                      }}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <p>Loading student data...</p>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;

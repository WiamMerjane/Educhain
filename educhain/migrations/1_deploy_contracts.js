// Importation des contrats
const Student = artifacts.require("Student");
const Admin = artifacts.require("Admin");
const Certificate = artifacts.require("Certificate");
const GradeVerification = artifacts.require("GradeVerification");
const Professor = artifacts.require("Professor");

module.exports = async function (deployer) {
  // Déployer les contrats un par un

  await deployer.deploy(Student);
  const studentInstance = await Student.deployed();
  console.log('Student contract deployed at:', studentInstance.address);

  await deployer.deploy(Professor);
  const professorInstance = await Professor.deployed();
  console.log('Professor contract deployed at:', professorInstance.address);

  await deployer.deploy(Admin, studentInstance.address);
  const admin = await Admin.deployed();
  console.log('Admin contract deployed at:', admin.address);

  await deployer.deploy(Certificate);
  const certificate = await Certificate.deployed();
  console.log('Certificate contract deployed at:', certificate.address);

  await deployer.deploy(GradeVerification);
  const gradeVerification = await GradeVerification.deployed();
  console.log('GradeVerification contract deployed at:', gradeVerification.address);
};

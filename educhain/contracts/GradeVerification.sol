// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GradeVerification {
    struct Grade {
        string courseName;
        uint8 grade;
        bool isVerified;
    }

    mapping(address => Grade[]) public studentGrades;

    // Événement pour l'ajout de note
    event GradeAdded(address student, string courseName, uint8 grade);

    // Fonction pour ajouter une note
    function addGrade(address _student, string memory _courseName, uint8 _grade) public {
        studentGrades[_student].push(Grade(_courseName, _grade, false));
        emit GradeAdded(_student, _courseName, _grade);
    }

    // Fonction pour vérifier une note
    function verifyGrade(address _student, uint256 _index) public {
        require(_index < studentGrades[_student].length, "Index out of bounds");
        studentGrades[_student][_index].isVerified = true;
    }

    // Fonction pour récupérer les notes d'un étudiant
    function getGrades(address _student) public view returns (Grade[] memory) {
        return studentGrades[_student];
    }
}

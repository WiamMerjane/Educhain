// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Student {
    struct StudentData {
        string firstName;
        string lastName;
        string dateOfBirth;
        string email;
        string cne;
        string filiere;
        string anneeUniv;
        string transcript;
    }

    // Mapping basé sur le CNE pour une liste de données
    mapping(string => StudentData[]) public studentRecords;
    string[] public studentCNEs; // Liste des CNEs ajoutés (pour itération)

    event StudentAdded(
        string indexed cne,
        string firstName,
        string lastName,
        string dateOfBirth,
        string email,
        string filiere,
        string anneeUniv,
        string transcript
    );

    // Vérifier si un enregistrement existe déjà
    function isDuplicate(
        string memory _cne,
        string memory _anneeUniv,
        string memory _transcript
    ) internal view returns (bool) {
        StudentData[] storage records = studentRecords[_cne];
        for (uint i = 0; i < records.length; i++) {
            if (
                keccak256(abi.encodePacked(records[i].anneeUniv)) == keccak256(abi.encodePacked(_anneeUniv)) &&
                keccak256(abi.encodePacked(records[i].transcript)) == keccak256(abi.encodePacked(_transcript))
            ) {
                return true; // Enregistrement déjà existant
            }
        }
        return false; // Pas de doublon trouvé
    }

    // Ajouter un étudiant
    function addStudent(
        string memory _cne,
        string memory _firstName,
        string memory _lastName,
        string memory _dateOfBirth,
        string memory _email,
        string memory _filiere,
        string memory _anneeUniv,
        string memory _transcript
    ) public {
        // Vérifier si l'enregistrement est unique
        require(
            !isDuplicate(_cne, _anneeUniv, _transcript),
            "Duplicate record: This entry already exists for the student."
        );

        // Ajouter les données de l'étudiant comme un nouveau bloc
        studentRecords[_cne].push(
            StudentData({
                firstName: _firstName,
                lastName: _lastName,
                dateOfBirth: _dateOfBirth,
                email: _email,
                cne: _cne,
                filiere: _filiere,
                anneeUniv: _anneeUniv,
                transcript: _transcript
            })
        );

        // Ajouter à la liste des CNEs si c'est la première entrée pour ce CNE
        if (studentRecords[_cne].length == 1) {
            studentCNEs.push(_cne);
        }

        emit StudentAdded(_cne, _firstName, _lastName, _dateOfBirth, _email, _filiere, _anneeUniv, _transcript);
    }

    // Récupérer les blocs pour un CNE donné
    function getStudentRecords(string memory _cne) public view returns (StudentData[] memory) {
        return studentRecords[_cne];
    }

    // Récupérer tous les étudiants avec leur historique
    function getAllStudents() public view returns (StudentData[] memory) {
        uint totalRecords = 0;

        // Calculer le nombre total de blocs
        for (uint i = 0; i < studentCNEs.length; i++) {
            totalRecords += studentRecords[studentCNEs[i]].length;
        }

        // Créer un tableau pour contenir tous les blocs
        StudentData[] memory allStudents = new StudentData[](totalRecords);
        uint index = 0;

        for (uint i = 0; i < studentCNEs.length; i++) {
            StudentData[] storage records = studentRecords[studentCNEs[i]];
            for (uint j = 0; j < records.length; j++) {
                allStudents[index] = records[j];
                index++;
            }
        }

        return allStudents;
    }
}

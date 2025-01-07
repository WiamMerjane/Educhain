// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract Professor {
    struct ProfessorData {
        string firstName;
        string lastName;
        string dateOfBirth;
        string email;
        string cin; // Utilisé comme identifiant unique
        string filiere; // Remis le champ 'filiere'
    }

    // Mapping basé sur le CIN
    mapping(string => ProfessorData) public professors;
    string[] public professorCINs; // Liste de tous les CINs pour itération

    event ProfessorAdded(
        string indexed cin,
        string firstName,
        string lastName,
        string dateOfBirth,
        string email,
        string filiere // Utilisation du champ 'filiere'
    );

    // Ajouter un professeur
    function addProfessor(
        string memory _cin,
        string memory _firstName,
        string memory _lastName,
        string memory _dateOfBirth,
        string memory _email,
        string memory _filiere // Utilisation du champ 'filiere'
    ) public {
        // Vérifier si le professeur existe déjà
        require(bytes(professors[_cin].cin).length == 0, "Professor with this CIN already exists");

        professorCINs.push(_cin);

        ProfessorData storage newProfessor = professors[_cin];
        newProfessor.firstName = _firstName;
        newProfessor.lastName = _lastName;
        newProfessor.dateOfBirth = _dateOfBirth;
        newProfessor.email = _email;
        newProfessor.cin = _cin;
        newProfessor.filiere = _filiere; // Assignation du filière

        emit ProfessorAdded(_cin, _firstName, _lastName, _dateOfBirth, _email, _filiere);
    }

    // Récupérer les informations d'un professeur par CIN
    function getProfessorInfo(string memory _cin) public view returns (
        string memory firstName,
        string memory lastName,
        string memory dateOfBirth,
        string memory email,
        string memory filiere // Utilisation du champ 'filiere'
    ) {
        ProfessorData storage professor = professors[_cin];
        require(bytes(professor.cin).length > 0, "Professor not found");

        return (
            professor.firstName,
            professor.lastName,
            professor.dateOfBirth,
            professor.email,
            professor.filiere // Utilisation du champ 'filiere'
        );
    }

    // Récupérer la liste de tous les professeurs
    function getAllProfessors() public view returns (ProfessorData[] memory) {
        uint professorCount = professorCINs.length;
        ProfessorData[] memory allProfessors = new ProfessorData[](professorCount);

        for (uint i = 0; i < professorCount; i++) {
            allProfessors[i] = professors[professorCINs[i]];
        }

        return allProfessors;
    }

    // Récupérer les informations d'un professeur par email
    function getProfessorByEmail(string memory email) public view returns (
        string memory firstName,
        string memory lastName,
        string memory dateOfBirth,
        string memory emailAddress,
        string memory cin,
        string memory filiere // Utilisation du champ 'filiere'
    ) {
        for (uint i = 0; i < professorCINs.length; i++) {
            ProfessorData storage professor = professors[professorCINs[i]];
            if (keccak256(abi.encodePacked(professor.email)) == keccak256(abi.encodePacked(email))) {
                return (
                    professor.firstName,
                    professor.lastName,
                    professor.dateOfBirth,
                    professor.email,
                    professor.cin,
                    professor.filiere // Utilisation du champ 'filiere'
                );
            }
        }
        revert("Professor not found");
    }
}

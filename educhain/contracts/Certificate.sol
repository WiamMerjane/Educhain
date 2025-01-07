// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Certificate {
    struct CertificateDetails {
        string studentName;
        string certificateTitle; // Nouveau champ pour le titre du certificat
        string fileHash; // Hachage du fichier du certificat (SHA-256)
        bool isValid;
    }

    // Mapping pour stocker les certificats par hachage de fichier
    mapping(string => CertificateDetails) private certificates;

    // Liste des hachages de fichiers pour itérer sur les certificats
    string[] private certificateHashes;

    // Adresse du propriétaire du contrat (généralement l'entité qui valide les certificats)
    address private owner;

    // Événements pour enregistrer et vérifier les certificats
    event CertificateRegistered(string fileHash, string studentName, string certificateTitle);
    event CertificateVerified(string fileHash, bool isOriginal);

    // Constructeur pour définir le propriétaire du contrat
    constructor() {
        owner = msg.sender;
    }

    // Fonction pour enregistrer un certificat avec son nom, titre et le hachage du fichier
    function registerCertificate(
        string memory studentName,
        string memory certificateTitle,
        string memory fileHash
    ) public {
        require(bytes(fileHash).length > 0, "Le hachage du fichier est requis.");
        require(!certificates[fileHash].isValid, "Le certificat est deja enregistre.");

        certificates[fileHash] = CertificateDetails(studentName, certificateTitle, fileHash, true);
        certificateHashes.push(fileHash); // Ajouter le hachage du certificat à la liste

        emit CertificateRegistered(fileHash, studentName, certificateTitle);
    }

    // Fonction pour vérifier si un certificat est valide
    function verifyCertificate(string memory fileHash) public returns (bool) {
        bool isValid = certificates[fileHash].isValid;

        emit CertificateVerified(fileHash, isValid);
        return isValid;
    }

    // Fonction pour récupérer le nom de l'étudiant en fonction du hachage du certificat
    function getStudentName(string memory fileHash) public view returns (string memory) {
        require(certificates[fileHash].isValid, "Certificat non valide.");
        return certificates[fileHash].studentName;
    }

    // Fonction pour récupérer le titre du certificat en fonction du hachage
    function getCertificateTitle(string memory fileHash) public view returns (string memory) {
        require(certificates[fileHash].isValid, "Certificat non valide.");
        return certificates[fileHash].certificateTitle;
    }

    // Fonction pour récupérer tous les certificats enregistrés
    function getAllCertificates() public view returns (CertificateDetails[] memory) {
        uint256 count = certificateHashes.length;
        CertificateDetails[] memory allCertificates = new CertificateDetails[](count);

        for (uint256 i = 0; i < count; i++) {
            string memory fileHash = certificateHashes[i];
            allCertificates[i] = certificates[fileHash];
        }

        return allCertificates;
    }
}

pragma solidity >=0.4.21 <0.7.0;

contract PatientsList {
    uint256 public patientCount = 0;

    constructor() public {
        createPatient("Harry Potter", 30);
    }

    struct Patient {
        uint256 id;
        string name;
        uint8 age;
        bool isDischarged;
    }

    mapping(uint256 => Patient) public patients;

    function createPatient(string memory name, uint8 age) public {
        patientCount++;
        patients[patientCount] = Patient(patientCount, name, age, false);
    }
}

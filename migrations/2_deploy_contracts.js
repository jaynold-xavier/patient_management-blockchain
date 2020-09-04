const PatientsList = artifacts.require("PatientsList");

module.exports = function(deployer) {
  deployer.deploy(PatientsList);
};
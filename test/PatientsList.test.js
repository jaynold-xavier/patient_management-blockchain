const PatientsList = artifacts.require("PatientsList");

contract("PatientsList", (accounts) => {
  let contractInstance;
  const [alice, bob] = accounts;

  beforeEach(async () => {
    contractInstance = await PatientsList.new();
  })

  it("should create new patient record", async () => {
    const result = await contractInstance.createPatient("Jacob", 15, {from : alice});
    const count = await contractInstance.patientCount({from: alice});

    assert.equal(result.receipt.status, true);
    assert.equal(count.length, 1);
  })
})
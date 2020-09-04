App = {
        loading: false,
        contracts: {},

        load: async () => {
                await App.loadWeb3()
                await App.loadAccount()
                await App.loadContract()
                await App.render()
        },

        // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
        loadWeb3: async () => {
                if (typeof web3 !== 'undefined') {
                        App.web3Provider = web3.currentProvider
                        web3 = new Web3(web3.currentProvider)
                } else {
                        window.alert("Please connect to Metamask.")
                }
                // Modern dapp browsers...
                if (window.ethereum) {
                        window.web3 = new Web3(ethereum)
                        try {
                                // Request account access if needed
                                await ethereum.enable()
                                // Acccounts now exposed
                                web3.eth.sendTransaction({/* ... */ })
                        } catch (error) {
                                // User denied account access...
                        }
                }
                // Legacy dapp browsers...
                else if (window.web3) {
                        App.web3Provider = web3.currentProvider
                        window.web3 = new Web3(web3.currentProvider)
                        // Acccounts always exposed
                        web3.eth.sendTransaction({/* ... */ })
                }
                // Non-dapp browsers...
                else {
                        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
                }
        },

        loadAccount: async () => {
                // Set the current blockchain account
                App.account = web3.eth.accounts[0]
        },

        loadContract: async () => {
                // Create a JavaScript version of the smart contract
                const patientsList = await $.getJSON('../build/contracts/PatientsList.json')
                App.contracts.PatientsList = TruffleContract(patientsList)
                App.contracts.PatientsList.setProvider(App.web3Provider)

                // Hydrate the smart contract with values from the blockchain
                App.patientsList = await App.contracts.PatientsList.deployed()
        },

        render: async () => {
                // Prevent double render
                if (App.loading) {
                        return
                }

                // Update app loading state
                App.setLoading(true)

                // Render Account
                $('#account').html(App.account)

                // Render Patients
                await App.renderPatients()

                // Update loading state
                App.setLoading(false)
        },

        renderPatients: async () => {
                // Load the total patient count from the blockchain
                const patientCount = await App.patientsList.patientCount()

                var data = `<table class="table table-bordered table-striped">
                                <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Age</th>
                                        <th>isDischarged</th>
                                </tr>`;

                // Render out each patient with a new patient template
                if (patientCount == 0) {
                        data += '<tr><td colspan="4">Records not found!</td></tr>';
                } else {
                        for (var i = 1; i <= patientCount; i++) {
                                // Fetch the patient data from the blockchain
                                const patients = await App.patientsList.patients(i)
                                const patientId = patients[0].toNumber()
                                const patientName = patients[1]
                                const patientAge = patients[2]
                                const patientisDischarged = patients[3]

                                data += `<tr>
                                                <td>`+ patientId + `</td>
                                                <td>`+ patientName + `</td>
                                                <td>`+ patientAge + `</td>
                                                <td>`+ (patientisDischarged ? 'Yes' : 'No') + `</td>
                                </tr>`;

                        }
                }

                data += '</table>';

                // Create the html for the patient
                $('#patientsList').html(data)
        },

        setLoading: (boolean) => {
                App.loading = boolean
                const loader = $('#loader')
                const content = $('#content')
                if (boolean) {
                        loader.show()
                        content.hide()
                } else {
                        loader.hide()
                        content.show()
                }
        },

        createPatient: async () => {
                App.setLoading(true)
                const name = $('#pName').val()
                const age = $('#pAge').val()
                await App.patientsList.createPatient(name, age)
                window.location.reload()
        },
}

$(() => {
        $(window).load(() => {
                App.load()
        })
})
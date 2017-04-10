var RealityCheck = artifacts.require("./RealityCheck.sol");
var Arbitrator = artifacts.require("./Arbitrator.sol");

module.exports = function(deployer) {
  web3.eth.getAccounts(function(err, accs) {

    Arbitrator.deployed().then(function (instance) {
       var rc;
       var arb = instance;
       var question_id;
       var d = new Date();
       var deadline = Math.floor(d.getTime() / 1000) + 30 * 24 * 60 * 60;
       var step_delay = 7 * 24 * 60 * 60;

        RealityCheck.deployed().then(function (instance) {
           rc = instance;
           return rc.getQuestionID("What is 2 + 2?", arb.address, step_delay, deadline, 5);
       }).then(function (result) {
           question_id = result;
           console.log("getQuestionID is", question_id);
           return rc.askQuestion("What is 2 + 2?", arb.address, step_delay, deadline, 5, {from: accs[0]});
       }).then(function(){
           console.log("asked question");
           rc.submitAnswer(question_id, 4, "basic maths", {from: accs[2]}, {value: 100});
       });

        RealityCheck.deployed().then(function (instance) {
            rc = instance;
            return rc.getQuestionID("What is 3 + 3?", arb.address, step_delay, deadline, 6);
        }).then(function (result) {
            question_id = result;
            console.log("getQuestionID 2 is", question_id);
            return rc.askQuestion("What is 3 + 3?", arb.address, step_delay, deadline, 6, {from: accs[1]});
        }).then(function(){
            console.log("asked question 2");
        });
    });

    console.log(err, accs);
  });
};

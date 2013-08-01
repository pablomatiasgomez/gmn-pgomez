var Client = function() {
    //variables privadas
    var name;
    var privateID;
    var number;
    var guessingToID = '';
    var attempts = 0;
    var numbersSetted = [];
    
    var setName = function(value) {
        name = value;
        $("li#user").html("<u>Usuario</u>: " + value);
    }
    var getName = function() {
        return name;
    }
    var setPrivateID = function(value) {
        privateID = value;
        $("li#publicID").html("<u>ID</u>: " + value );
    }
    var getPrivateID = function() {
        return privateID;
    }
    var setNumber = function(value) {
        numbersSetted.push(value.toString());
        number = value;
        $("li#number").html("<u>N&uacute;mero</u>: " + value);
    }
    var getNumber = function() {
        return number;
    }
    var setGuessingToID = function(value) {
        guessingToID = value;
    }
    var getGuessingToID = function() {
        return guessingToID;
    }
    var setAttempts = function(value) {
        attempts = value;
        $("li#attempts").html("<u>Intentos</u>: " + value);
    }
    var getAttempts = function() {
        return attempts;
    }
    
    var checkPreviousNumbers = function(value) {
        return (numbersSetted.indexOf(value) != -1);
    }
    
    
    var numbers = []; // Array: [Number()];
    
    
    return {
        "setName": setName,
        "getName": getName,
        "setPrivateID": setPrivateID,
        "getPrivateID": getPrivateID,
        "setNumber": setNumber,
        "getNumber": getNumber,
        "setGuessingToID": setGuessingToID,
        "getGuessingToID": getGuessingToID,
        "setAttempts": setAttempts,
        "getAttempts": getAttempts,
        "checkPreviousNumbers": checkPreviousNumbers,
        "numbers": numbers,
        
    }
};


    
var Number = function(){
    //varibles
    var num = 0;
    
    var setNum = function(value) {
        num = value;
    }
    var getNum = function() {
        return num;
    }     
    
    var attempts = []; // Array: [Attempt()];    PREGUNTAR ESTO COMO HACERLO BIEN.
    
    return {
        "setNum": setNum,
        "getNum": getNum,
        "attempts": attempts,
    }
};

var Attempt = function () {
    //varibles
    var number;
    var correct;
    var existing;
    var wrong;
    
    var setNumber = function(value) {
        number = value;
    }
    var getNumber = function() {
        return number;
    }     
    var setCorrect = function(value) {
        correct = value;
    }
    var getCorrect = function() {
        return correct;
    }      
    var setExisting = function(value) {
        existing = value;
    }
    var getExisting = function() {
        return existing;
    }      
    var setWrong = function(value) {
        wrong = value;
    }
    var getWrong = function() {
        return wrong;
    }       
    
    return {
        "setNumber": setNumber,
        "getNumber": getNumber,
        "setCorrect": setCorrect,
        "getCorrect": getCorrect,
        "setExisting": setExisting,
        "getExisting": getExisting,
        "setWrong": setWrong,
        "getWrong": getWrong,
    }
};
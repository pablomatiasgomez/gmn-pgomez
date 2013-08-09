var Client = function() {
    //variables privadas
    var name;
    var privateID;
    var number;
    var guessingToID = '';
    var attempts = 0;
    var timerEnabled = false;
    var nextAttempt = new Date().getTime();
    var guessTimer;
    
    var numbers = {}; // Array: [Number()];
    var numbersSetted = [];
    
    
    var setName = function(value) {
        name = value;
        attempts = 0;
        number = '';
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
        $("li#number").html("<u>N&uacute;mero</u>: <img src='images/icons/number.ico' title='" + value + "' />");
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
    
    var startRefreshTimer = function(callback, interval) {
        timerEnabled = true;
        setTimeout(function(){
            if (timerEnabled){
                callback();
                startRefreshTimer(callback, interval);
            }
        }, interval);
    }
    
    var stopRefreshTimer = function(){
        timerEnabled = false;
    }
    
    var checkPreviousNumbers = function(value) {
        return (numbersSetted.indexOf(value) != -1);
    }
    
    var setInterval = function(value) {
        nextAttempt = new Date().getTime();
        nextAttempt += value ;
    }
    
    var timeToWait = function (){
        now = new Date().getTime();
        return (nextAttempt - now);   
    }
    
    var setGuessTimer = function(value) {
        guessTimer = value;
    }
    
    var clearGuessTimer = function() {
        if (guessTimer != undefined)
            clearTimeout(guessTimer);
    }
    
    var addTry = function(numberId, number, correctChars, existingChars, wrongChars){
        if (numbers[numberId] === undefined) numbers[numberId] = [];
        if (typeof numbers[numberId] != 'string'){
            numbers[numberId].push({
                "number": number,
                "correctChars": correctChars,
                "existingChars": existingChars,
                "wrongChars": wrongChars
            });
        }
        
        if (correctChars == 4){ // Adivne el numero !!
            guessingToID = '';
            numbers[numberId] = number.toString();
        }   
    }

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
        "startRefreshTimer": startRefreshTimer,
        "stopRefreshTimer": stopRefreshTimer,
        "checkPreviousNumbers": checkPreviousNumbers,
        "setInterval": setInterval,
        "timeToWait": timeToWait,
        "setGuessTimer": setGuessTimer,
        "clearGuessTimer": clearGuessTimer,
        "numbers": numbers,
        "addTry": addTry
    }
};
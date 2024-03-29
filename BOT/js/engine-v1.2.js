     ////////////OBJECT ENGINE////////////
    //*********************************//
   //         Gomez Pablo Matias      //
  //         July 2013               //
 //*********************************//
/////////////////////////////////////


var Engine = function() {
    var nameNumber = 0;
    var numbersSetted = [];
    var numbers = {}; 
    
    //CONST:
    NUM_LENGTH = 4;
    BOT_NAME = "pGomezBotv12";

    var repeatedNumbers = function(number){
        var repeated = false;
        number = number.toString();
        for (var i=0; i<NUM_LENGTH; i++){
            if (number.indexOf(number.substring(i,i+1),i+1) > 0) repeated = true;
        }
        return repeated;
    }
    
    var getRandomName = function(){
        nameNumber++;
        return (BOT_NAME + nameNumber.toString());
    }
    
    var getRandomNumber = function(){
        var random = Math.random().toString().substr(5, NUM_LENGTH);
        while (numbersSetted.indexOf(random) != -1 || repeatedNumbers(random)){
            random = Math.random().toString().substr(5, NUM_LENGTH);
        }
        return random;
    }
    

    var addNumberUsed = function(value){
        numbersSetted.push(value.toString());
    }


    var makeArray = function(tries){
        var possibleNums = [];
        //Disenio de todos los posibles numeros sin repetir: (5040)
        for (var i=0; i<=9; i++) for (var j=0; j<=9; j++) if (j != i) for (var k=0; k<=9; k++) if (k != j && k != i) for (var l=0; l<=9; l++) if (l != k && l != j && l != i) possibleNums.push(i.toString() + j.toString() + k.toString() + l.toString());

        var correctChars;
        var existingChars;
        var wrongChars;
        
        $.each(tries, function(index, tried){ //Aca quito todos los numeros que no coinciden con los intentos realizados!
            triedNumber = tried['number'];
            for (var index=0; index < possibleNums.length; index++){
                listNumber = possibleNums[index];
                correctChars = 0;
                existingChars = 0;
                wrongChars = 0;
                for(var i=0; i<triedNumber.toString().length; i++) {
                    if(triedNumber.toString().charAt(i) == listNumber.toString().charAt(i)) {
                        correctChars++;
                    } else if(listNumber.toString().indexOf(triedNumber.toString().charAt(i)) >= 0) {
                        existingChars++;
                    } else {
                        wrongChars++;
                    }
                }
                if (correctChars != tried['correctChars'] || existingChars != tried['existingChars'] || wrongChars != tried['wrongChars']){
                    possibleNums.splice(index,1); //Borro dicho elemento
                    index--;
                }
            };
        });
        
        //Aca voy a quitar los numeros que alguna vez ya encontre entonces no pueden ser:
        $.each(numbers, function(index, value){
            if (typeof value === 'string'){ // Un numero que alguna vez adivine
                for (indexList=0; indexList < possibleNums.length; indexList++){
                    if (possibleNums[indexList].toString() === value) {
                        possibleNums.splice(indexList,1);  //Borro dicho elemento ya que si alguna vez lo habia encontrado, es imposible que sea este
                        indexList--;
                        break;
                    } 
                }
            }
        });

        return possibleNums;
    }
    
    var selectNumFromArray = function (possibleNums){ //Aca busco al numero de la lista que menos igualdades tiene con los que ya habia intentado, simplemente para mezclar informacion y obtener mejores resultados
        var nums = [];
        for (i=0; i<10; i++) nums[i] = 0;
        
        $.each(possibleNums, function(index, value){ //Guardo cuants veces aparece cada numero
            for (i=0; i<value.toString().length; i++){
                num = value.toString().substr(i,1);
                num = parseInt(num);
                nums[num]++;
            }
        });
        
        var maxNums = [];
        for (i=0; i<possibleNums[0].toString().length; i++){
            max = 0;
            maxCant = 0;
            $.each(nums, function(index, value){
                if (value > maxCant) {
                    maxCant = value;
                    max = index;
                }
            });
            nums[max] = 0;
            maxNums[i] = max;
        }
        possibleNums[0].toString().length
        
        maxCant = -1;
        max = '';
        $.each(possibleNums, function(index, value){
            cant = 0;
            for (i=0; i<maxNums.length; i++){
                if(value.toString().indexOf(maxNums[i].toString()) >= 0) cant++;
            }
            if (cant > maxCant){
                maxCant = cant;
                max = value.toString();
            }
        });
        
        return max;
    }
    
    var getNumberToGuess = function(numberID){
        //return Math.random().toString().substr(2, NUM_LENGTH); // Numero random para probar
        var numReturn;
        
        if (typeof numbers[numberID] === 'string'){
            numReturn = numbers[numberID].toString();
        }
        else{
            var triesMade;
            if (numbers[numberID] === undefined) triesMade = 0; 
            if (typeof numbers[numberID] === 'object') triesMade = numbers[numberID].length;
            
            //if (triesMade == 0)  numReturn = '1470';
            //if (triesMade == 1)  numReturn = '2581';
            //if (triesMade == 2)  numReturn = '3692';
            
            if (triesMade == 0)  numReturn = Math.random().toString().substr(2, NUM_LENGTH);
            if (triesMade > 0)  numReturn = selectNumFromArray(makeArray(numbers[numberID]));
        }
        return numReturn;
    }
    
    var selectUser = function(players){
        var oponent = '';
        
        //Saco de la lista los que no tienen numero activo:
        var player;
        for (var index=0; index<players.length; index++){
            player = players[index];
            if (player['numberActivated'] == true) {
                if (knowNumber(player['numberId'])){  //Con esto verifico si hay alguno al que ya le conosco el numero
                    oponent = player['publicUuid'];
                    break;
                }
            }
            else{ //Si no tiene numero lo quito de la lista
                players.splice(index,1);  //Borro dicho elemento ya que si alguna vez lo habia encontrado, es imposible que sea este
                index--;
            }
        }
                
        //Elijo mediante random al user:
        if (players.length > 0){
            player = players[Math.floor(Math.random() * players.length)];
            oponent = player['publicUuid'];
        }
        
        return oponent;
    }
    var addTry = function(numberId, number, correctChars, existingChars, wrongChars){
        var adivino = false;
        if (numbers[numberId] === undefined) numbers[numberId] = [];
        if (typeof numbers[numberId] != 'string'){
            numbers[numberId].push({
                "number": number,
                "correctChars": correctChars,
                "existingChars": existingChars,
                "wrongChars": wrongChars
            });
        }
        if (correctChars == NUM_LENGTH){ // Adivne el numero !!
            numbers[numberId] = number.toString();
            adivino = true;
        }   
        return adivino;
    }

    var knowNumber = function(numberID){
        var know = false;
        if (typeof numbers[numberID] === 'string') know = true;
        return know;
    }
    
    return {
        "getRandomName": getRandomName,
        "getRandomNumber": getRandomNumber,
        "addNumberUsed": addNumberUsed,
        "getNumberToGuess": getNumberToGuess,
        "addTry": addTry,
        "knowNumber": knowNumber,
        "selectUser": selectUser,
    }
}
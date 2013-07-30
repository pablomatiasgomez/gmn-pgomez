////////////////////////
// Gomez Pablo Matias //
// July 2013          //
////////////////////////

/* 
preguntas a hacer:
    los usuarios que no tienen numero activo se los muestro ?
    lo de actualizar como seria? porque no se si es necesario.. voy actualizando por eventos o por timer?
    cancelar timer sino.
    cuando te adivinaban el numero te aparecia la pantalla para poner numero y no puedo jugar no?
    validacion con w3 errores de ISO y etc...
    
    that's it
*/


$(function(){ //ready function 
    $("#divServer").show();
    $("#txtServer").focus();
    $("#divData").draggable({ handle: "#divTitle" });
    
    $("#divData").css("top", $(window).height() - 200);
    $(window).resize(function() {
        $("#divData").css("top", $(window).height() - 200);
    });

    var oServer = function() {
        //variables privadas
        var url = "";
    
        var setUrl = function(value) {
            url = value;
        }
        
        return {
            "setUrl": setUrl,
            "getData": function(subUrl, callback){
                subUrl = subUrl.replace("<privateUuid>", oClient.getPrivateID());
                subUrl = subUrl.replace("<publicUuid>", oClient.getPrivateID());

                $.ajax({
                    type: 'GET',
                    url: url + subUrl,
                    dataType:"json",
                    success: function(data) {
                        callback(data);
                    },
                    error: function(data) {
                        callback(data);
                    }
                });
            }
        }
    }();
    
    var oClient = function() {
        //variables privadas
        var name;
        var privateID;
        var number;
        var guessingToID;
        
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
        
        var refreshBoard = function (){
            oServer.getData('players/board/<privateUuid>', function(data) {
                switch (data.status){
                    case undefined:
                        colorFormats = ['dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'inherit'];
                        
                        //Guardo datos
                        if (!data['me'][0]['numberActivated']) {
                            $("li#number").html("<u>N&uacute;mero</u>: No seteado");
                            // mostrar pantalla de numero !!
                        }
                        $("li#score").html("<u>Score</u>: " + data['me'][0]['score']);
                              
                        //Cargo lista (ordenada por score de mayor a menor):
                        data['players'].sort(function (a, b){ return ((a['score'] > b['score'] ) ? -1 : ((a['score'] < b['score']) ? 1 : 0)); });
                        $("#tblPlayers tbody").html('');
                        $.each(data['players'], function(index, value){ 
                            tr_html = "<tr id='<HASH>'> <td><div class='userColor'></div></td> <td><ACTIVE></td> <td><SCORE></td> <td><input type='button' value='Jugar' /></td> </tr>";
                            tr_html = tr_html.replace("<HASH>", value['publicUuid']);
                            tr_html = tr_html.replace("<ACTIVE>", (value['numberActivated'] == true) ? "S&iacute;" : "No");
                            tr_html = tr_html.replace("<SCORE>", value['score']);
                            //value['numberId'] 
                            
                            $("#tblPlayers tbody").append(tr_html);
                            if(value['numberActivated'] == false) $("#" + value['publicUuid'] + " input[type='button']").attr('disabled', 'disabled');
                            $("#" + value['publicUuid'] + " .userColor").css('border-style', colorFormats[Math.floor(Math.random()*9)]);
                            $("#" + value['publicUuid'] + " input[type='button']").click(function () {
                            });
                        });
                        break;
                    case 521: // Private Uuid not found !
                        setTimeout(function(){
                            $("#txtNumber").val('');
                            $("#txtUser").val('');
                            $("#divMain").fadeOut(300, function(){ $("#divUser").fadeIn(300, function(){ $("#txtUser").focus(); })});
                            $("#divUser .result span").html("ID de user inexistente.");
                            $("#divUser .result").slideDown(500);
                        },3000);
                        break;
                }
            });
        }
        return {
            "setName": setName,
            "getName": getName,
            "setPrivateID": setPrivateID,
            "getPrivateID": getPrivateID,
            "setNumber": setNumber,
            "getNumber": getNumber,
            "refreshBoard": refreshBoard,
            "setGuessingToID": setGuessingToID,
            "getGuessingToID": getGuessingToID,
        }
    }();
    
    $("#frmServer input[type='text']").keyup(function (event) { if (event.keyCode === 13) $($($(this).parent()).find("input[type='button']")).click(); else validateForm(1); });
    $("#frmUser input[type='text']").keyup(function (event) { if (event.keyCode === 13) $($($(this).parent()).find("input[type='button']")).click(); else validateForm(2); });
    $("#frmNumber input[type='text']").keyup(function (event) { if (event.keyCode === 13) $($($(this).parent()).find("input[type='button']")).click(); else validateForm(3); });
    
    $("#btnServer_Save").click(function (){
        if (validateForm(1)){
            $("#divServer .result").slideUp(200);
            $.ajax({
                type: 'GET',
                url: "http://" +  $("#txtServer").val() + ((parseInt($("#txtPort").val()) === 80) ? '' : $("#txtPort").val()) + "/version",
                dataType:"json",
                success: function(data){
                    if (data['version']) {
                        //Guardo datos del servidor
                        oServer.setUrl("http://" +  $("#txtServer").val() + ((parseInt($("#txtPort").val()) === 80) ? '' : $("#txtPort").val()) + "/")
                        //Muestro siguiente form
                        $("#divServer").fadeOut(300, function(){ $("#divUser").fadeIn(300, function(){ $("#txtUser").focus(); })});
                    }
                },
                error: function() {
                    $("#divServer .result span").html("Error de conexion al servidor");
                    $("#divServer .result").slideDown(500);
                    $("#txtServer").focus();
                    $("#frmServer").css('box-shadow', '0 0 10px 2px #FF0000');
                }
             });
        }
    });
    
    $("#btnUser_Save").click(function (){
        if (validateForm(2)){
            $("#divUser .result").slideUp(200);
            oServer.getData('players/register/' + $("#txtUser").val(), function(data) {
                switch (data.status){
                    case undefined:
                        //Guardo datos
                        oClient.setName(data['name']);
                        oClient.setPrivateID(data['privateUuid']);
                        //Muestro siguiente form
                        $("#divUser").fadeOut(300, function(){ $("#divNumber").fadeIn(300, function(){ $("#txtNumber").focus(); })});
                        break;
                    case 520: // Nombre de usuario ya existente
                        $("#divUser .result span").html("El nombre de usuario ya ha sido elegido");
                        $("#divUser .result").slideDown(500);
                        $("#txtUser").focus();
                        $("#frmUser").css('box-shadow', '0 0 10px 2px #FF0000');
                        break;
                }
            });
        }
    });
    
    $("#btnNumber_Save").click(function (){
        if (validateForm(3)){
            $("#divNumber .result").slideUp(200);
            oServer.getData('play/setnumber/<privateUuid>/' + $("#txtNumber").val(), function(data) {
                switch (data.status){
                    case undefined:
                        //Guardo datos
                        oClient.setNumber(data['number']);
                        //Muestro siguiente form
                        $("#divNumber").fadeOut(300, function(){ $("#divMain").fadeIn(300, function() { oClient.refreshBoard(); } )});
                        break;
                    case 521: // Uuid inexistente
                        setTimeout(function(){
                            $("#txtNumber").val('');
                            $("#txtUser").val('');
                            $("#divNumber .result").slideUp(200);
                            $("#divNumber").fadeOut(300, function(){ $("#divUser").fadeIn(300, function(){ $("#txtUser").focus(); })});
                        },3000);
                        $("#divNumber .result span").html("ID de user inexistente, volviendo en 3 seg..");
                        $("#divNumber .result").slideDown(500);
                        $("#frmNumber").css('box-shadow', '0 0 10px 2px #FF0000');
                        break;
                    case 528: // Invalid number
                        $("#divNumber .result span").html("N&uacute;mero inv&aacute;lido. Chequear repetidos");
                        $("#divNumber .result").slideDown(500);
                        $("#txtNumber").focus();
                        $("#frmNumber").css('box-shadow', '0 0 10px 2px #FF0000');
                        break;
                    case 523: // Already active number
                        $("#divNumber").fadeOut(3000, function(){ $("#divMain").fadeIn(300, function(){})});
                        $("#divNumber .result span").html("Ya ten&eacute;s un n&uacute;mero activo.");
                        $("#divNumber .result").slideDown(500);
                        break;
                }
            });
        }
    });
});


function validateForm(form){
    flag = true;
    if (form === 1){
        serverRegExp = /^[A-z0-9\.\-]+$/
        portRegExp = /^[0-9]{1,5}$/

        if (parseInt($("#txtPort").val(), 10) != $("#txtPort").val() || !(portRegExp.test($("#txtPort").val()))) {
            validateControl($("#txtPort"), false);
            flag = false;
        } else validateControl($("#txtPort"), true);
        
        if (($("#txtServer").val()).length < 1 || !(serverRegExp.test($("#txtServer").val()))){
            validateControl($("#txtServer"), false);
            flag = false;
        } else validateControl($("#txtServer"), true);
        
        if (flag) 
            $("#frmServer").css('box-shadow', '0 0 10px 2px #00FF00')
        else
            $("#frmServer").css('box-shadow', '0 0 10px 2px #FF0000')
        
    }
    else if (form === 2){
        userRegExp = /^[A-z0-9]+$/
        if (($("#txtUser").val()).length < 1 || !(userRegExp.test($("#txtUser").val()))) {
            validateControl($("#txtUser"), false);
            flag = false;
        }
        else validateControl($("#txtUser"), true);
        
        if (flag) 
            $("#frmUser").css('box-shadow', '0 0 10px 2px #00FF00')
        else
            $("#frmUser").css('box-shadow', '0 0 10px 2px #FF0000')
    }
    else if (form === 3){
        numberRegExp = /^[0-9]{4,4}$/
        if ((parseInt($("#txtNumber").val(), 10) != $("#txtNumber").val()) || (repeatedNumbers($("#txtNumber").val())) || !(numberRegExp.test($("#txtNumber").val()))) {
            validateControl($("#txtNumber"), false);
            flag = false;
        }
        else validateControl($("#txtNumber"), true);
        
        if (flag) 
            $("#frmNumber").css('box-shadow', '0 0 10px 2px #00FF00')
        else
            $("#frmNumber").css('box-shadow', '0 0 10px 2px #FF0000')
    }
    return flag;
}

function repeatedNumbers(number){
    repeated = false;
    number = number.toString();
    for (var i=0; i<4; i++){
        if (number.indexOf(number.substring(i,i+1),i+1) > 0) repeated = true;
    }
    return repeated;
}
    
function validateControl(control, valid) {
    if (valid)
        $(control).animate({ backgroundColor: '#C0FFC0', borderColor: '#00FF00'  }, 300);
    else
        $(control).animate({ backgroundColor: '#FFD0D0', borderColor: '#FF0000' }, 300);
}
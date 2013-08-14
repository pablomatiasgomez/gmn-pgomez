
      /////////////////////////////////////
     //*********************************//
    //         Gomez Pablo Matias      //
   //         July 2013               //
  //                                 //
 //*********************************//
/////////////////////////////////////

/* 
preguntas a hacer:

    validateform... ?
*/

KEY_ENTER = 13;

$(function(){ //ready function 
    oServer = Server();
    oClient = Client(oServer);
    
    $("#divServer").show();
    $("#txtServer").focus();
    $("#divData").draggable({ handle: "#divTitle" });
    
    $("#divData").css("top", $(window).height() - 160);
    $(window).resize(function() {
        $("#divData").css("top", $(window).height() - 160);
    });

    $("#frmServer input[type='text']").keyup(function (event) { if (event.keyCode === KEY_ENTER) $($($(this).parent()).find("input[type='button']")).click(); else oClient.validateForm(1); });
    $("#frmUser input[type='text']").keyup(function (event) { if (event.keyCode === KEY_ENTER) $($($(this).parent()).find("input[type='button']")).click(); else oClient.validateForm(2); });
    $("#frmNumber input[type='text']").keyup(function (event) { if (event.keyCode === KEY_ENTER) $($($(this).parent()).find("input[type='button']")).click(); else oClient.validateForm(3); });
    
    $("#txtGuessNumber").keyup(function (event) { 
        numberRegExp = /^[0-9]{4,4}$/
        if (numberRegExp.test($("#txtGuessNumber").val())){
            $("#btnGuess").removeAttr("disabled");   
        }
        else $("#btnGuess").attr('disabled', 'disabled');         
        if (event.keyCode === KEY_ENTER) $("#btnGuess").click();
    });
    
    $("#btnServer_Save").click(function (){ oClient.setServer($("#txtServer").val(), $("#txtPort").val()); });
    
    $("#btnUser_Save").click(function (){ oClient.setName($("#txtUser").val()); });
    
    $("#btnNumber_Save").click(function (){ oClient.setNumber($("#txtNumber").val()); });
        
    $("#btnGuess").click(function (){ oClient.guessNumber($("#txtGuessNumber").val()); });

    $("#btnRefreshLobby").click(function() { oClient.refreshBoard(); });
});
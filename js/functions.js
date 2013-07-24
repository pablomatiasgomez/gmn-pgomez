////////////////////////
// Gomez Pablo Matias //
//                    //
////////////////////////















$(document).ready(function() { $("#divServer").show(); });

$(function(){ //ready function 

    $(".initForm input[type='text']").keyup(function (event) { $($($(this).parent()).find("input[type='button']")).click();  });
    
    $("#btnServer_Save").click(function (){
        alert($.md5("1234"));
//  10000000000000
//  99999999999999999
//0.77453316655009981


        return;
        flag = true;
        if (parseInt($("#txtPort").val(), 10) != $("#txtPort").val()) {
            validateControl($("#txtPort"), false);
            flag = false;
        } else validateControl($("#txtPort"), true);
        if (($("#txtServer").val()).length < 1){
            validateControl($("#txtServer"), false);
            flag = false;
        } else validateControl($("#txtServer"), true);
        if (flag && event.keyCode === 13){
            $("#divServer").fadeOut(500, function(){ $("#divUser").fadeIn(500, function(){ $("#txtUser").focus() })});
        }
    });
    
    
    $("#btnUser_Save").click(function (){
        
        if (($("#txtUser").val()).length < 1)
            validateControl($("#txtUser"), false);
        else 
            if (event.keyCode === 13) $("#divUser").fadeOut(500, function(){ $("#divNumber").fadeIn(500, function(){ $("#txtNumber").focus() })});
   
    });
    
    $("#btnNumber_Save").click(function (){
        if ((parseInt($("#txtNumber").val(), 10) != $("#txtNumber").val()) || ($("#txtNumber").val()).length != 4 )
            validateControl($("#txtNumber"), false);
        else
            if (event.keyCode === 13) $("#divNumber").fadeOut(500, function(){ $("#divMain").fadeIn(500, function(){})});
    });
});




function validateControl(control, valid) {
    if (valid)
        $(control).animate({ backgroundColor: '#C0FFC0' }, 300);
    else
        $(control).animate({ backgroundColor: '#FFD0D0' }, 300);
}
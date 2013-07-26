////////////////////////
// Gomez Pablo Matias //
//                    //
////////////////////////


/*for(x=10000000000000; x <= 99999999999999999; x++){
            if ($.md5(1234 + x) == "cd579ee4ac1487196859e3799a0c9861")
                alert (x);
            if ((x % 10000000) == 0)
                console.log((x-10000000000000) * 100 / 9989999999999999);
        }

        
//  10000000000000
//  99999999999999999
//0.77453316655009981


        return;*/

$(document).ready(function() { $("#divServer").show(); });

$(function(){ //ready function 

    $("#frmServer input[type='text']").keyup(function (event) { if (event.keyCode === 13) $($($(this).parent()).find("input[type='button']")).click(); else validateForm(1); });
    $("#frmUser input[type='text']").keyup(function (event) { if (event.keyCode === 13) $($($(this).parent()).find("input[type='button']")).click(); else validateForm(2); });
    $("#frmNumber input[type='text']").keyup(function (event) { if (event.keyCode === 13) $($($(this).parent()).find("input[type='button']")).click(); else validateForm(3); });
    
    
    $("#btnServer_Save").click(function (){
        if (validateForm(1))
            $("#divServer").fadeOut(500, function(){ $("#divUser").fadeIn(500, function(){ $("#txtUser").focus(); })});
    });
    
    $("#btnUser_Save").click(function (){
        if (validateForm(2))
            $("#divUser").fadeOut(500, function(){ $("#divNumber").fadeIn(500, function(){ $("#txtNumber").focus(); })});
    });
    
    $("#btnNumber_Save").click(function (){
        if (validateForm(3))
            $("#divNumber").fadeOut(500, function(){ $("#divMain").fadeIn(500, function(){})});
    });
    $("#txtServer").focus();
});


function validateForm(form){
    flag = true;
    if (form === 1){
        if (parseInt($("#txtPort").val(), 10) != $("#txtPort").val()) {
            validateControl($("#txtPort"), false);
            flag = false;
        } else validateControl($("#txtPort"), true);
        
        if (($("#txtServer").val()).length < 1){
            validateControl($("#txtServer"), false);
            flag = false;
        } else validateControl($("#txtServer"), true);
        
        if (flag) 
            $("#frmServer").animate({ 'boxShadow': '0 0 10px 2px #00FF00', borderColor: '#00FF00'  } , 300 );
        else
            $("#frmServer").animate({ borderColor: '#FF0000',  boxShadow : '0px 0px 10px 2px #FF0000'}, 300 );
        
    }
    else if (form === 2){
        if (($("#txtUser").val()).length < 1) {
            validateControl($("#txtUser"), false);
            flag = false;
        }
        else validateControl($("#txtUser"), true);
    }
    else if (form === 3){
        if ((parseInt($("#txtNumber").val(), 10) != $("#txtNumber").val()) || ($("#txtNumber").val()).length != 4) {
            validateControl($("#txtNumber"), false);
            flag = false;
        }
        else validateControl($("#txtNumber"), true);
    }
    return flag;
}

function validateControl(control, valid) {
    if (valid)
        $(control).animate({ backgroundColor: '#C0FFC0', borderColor: '#00FF00'  }, 300);
    else
        $(control).animate({ backgroundColor: '#FFD0D0', borderColor: '#FF0000' }, 300);
}
(function() {
  var globalindex = 0;

  var entries = [];

  function parseFractionalValue(value) {
    var valueArray = String(value).split("/");
    if (valueArray.length > 1) {
      return ((parseFloat(valueArray[0]) + parseFloat(valueArray[1])) / 2).toFixed(2);
    }
    return value;
  }

  function checkIntValue(value) {
    if (typeof value === "undefined" || value == NaN)
      value = 0;
    return parseFloat(value).toFixed(2);
  }


  function detectEndterKey(e) {
    if (e.keyCode == 13) {
      var pointXValues = parseFractionalValue($("#pointXValues").val());
      pointYValues = parseFractionalValue($("#pointYValues").val());
      if ($.isNumeric(pointXValues) && $.isNumeric(pointYValues)) {
        runMidPoinCalculation();
      }
    }
  }

  function runMidPoinCalculation() {
    makeMidPointRows(globalindex);
    $(".pointValue").unbind("keyup", demandOfferChangeEvent);
    $(".pointValue").bind("keyup", demandOfferChangeEvent);
    calculateMidPoint();
    globalindex++;
    $(window).scrollTop($(window).height())
  }

  function runInCalculationClean() {
    $("#pointXValues").val('');
    $("#pointYValues").val('');
  }

  $(".btnInCalculate").click(runMidPoinCalculation);
  $(".btnInCalculateClean").click(runInCalculationClean);

  $("#pointXValues").keyup(detectEndterKey);
  $("#pointYValues").keyup(detectEndterKey);

  function demandOfferChangeEvent(e) {
    console.log("demandOfferChangeEvent");
    calculateMidPoint($(e.currentTarget).attr("indexValue"))
  }

  function makeMidPointRows1() {
    return "<div class=\"row\"><div class=\"row text-center\"><div class=\"col-md-4 text-left\"><input id=\"pointValues" + i + "\" class=\"pointValue\" indexValue=\"" + i + "\"></div></div><div class = \"row text-center\"><div class=\"col-md-1\">&nbsp;</div><div class=\"col-md-4\" id=\"demand" + i + "\"></div>              <div class=\"col-md-2\" id=\"midpoint" + i + "\"></div>              <div class=\"col-md-4\" id=\"offer" + i + "\"></div>              <div class=\"col-md-1\">&nbsp;</div>            </div>            <div class=\"row text-center\">              <div class=\"col-md-6 text-left\" id=\"pleft" + i + "\">%</div> <div class=\"col-md-6 text-right\" id=\"pright" + i + "\">%</div> </div></div>";
  }

  function makeMidPointRows(i) {
    $('#dataTable > tr:last').before('<tr><td id="pleft' + (i - 1) + '" class="text-center warning"></td><td><input id="demand' + i + '" class="disabled pointValue col-md-12 text-center success" indexValue="' + i + '"></td><td id="midpoint' + i + '" class="text-center info"></td><td class="success"><input id="offer' + i + '" class="disabled pointValue col-md-12 text-center" indexValue="' + i + '"></td><td id="pright' + (i - 1) + '" class="text-center warning"></td></tr>');
  }

  function calculateMidPoint(_indexValue) {
    console.log("calculateMidPoint", _indexValue);
    if (typeof _indexValue === "undefined") {
      var target = $("#pointValues"),
        indexValue = globalindex,
        targetValueArray = String(target.val()).split("-");

      var valueX = parseFractionalValue($("#pointXValues").val()),
        valueY = parseFractionalValue($("#pointYValues").val());
    } else {
      var target = $("#pointValues"),
        indexValue = _indexValue,
        valueX = parseFractionalValue($("#demand" + indexValue).val()),
        valueY = parseFractionalValue($("#offer" + indexValue).val());

    }
    var
      midpoint = $("#midpoint" + indexValue),
      demand = $("#demand" + indexValue),
      demand1 = $("#demand" + indexValue + 1),
      offer = $("#offer" + indexValue),
      offer1 = $("#offer" + indexValue + 1),
      pleft = $("#pleft" + indexValue),
      pright = $("#pright" + indexValue);

    if ($.isNumeric(valueX) && $.isNumeric(valueY)) {
      demand.val(valueX);
      offer.val(valueY);
      midpoint.html(((parseFloat(valueX) + parseFloat(valueY)) / 2));

      if (indexValue > 0) {
        $("#pleft" + (indexValue - 1)).html(calculateDifferntials($("#demand" + (indexValue)).val(), $("#demand" + (indexValue - 1)).val()) + "%");
        $("#pright" + (indexValue - 1)).html(calculateDifferntials($("#offer" + (indexValue)).val(), $("#offer" + (indexValue - 1)).val()) + "%");

        $("#pleft" + indexValue).html(calculateDifferntials($("#demand" + (indexValue + 1)).val(), $("#demand" + indexValue).val()));
        $("#pright" + indexValue).html(calculateDifferntials($("#offer" + (indexValue + 1)).val(), $("#offer" + indexValue).val()));
      }

      $("#pointYValues").val("");
      $("#pointXValues").val("").focus();
    }

  }

  function calculateDifferntials(newValue, oldValue) {
    var difference = 0,
      flag = 1;
    newValue = checkIntValue(newValue);
    oldValue = checkIntValue(oldValue);

    if (newValue > oldValue) {
      console.log("if condition", newValue, oldValue);
      difference = newValue - oldValue;
      if (newValue < 0 && oldValue < 0)
        flag = 1
      else if (newValue < 0)
        flag = -1;
    } else {
      console.log("else condition", newValue, oldValue);
      difference = oldValue - newValue;

      flag = -1
    }
    console.log("flag", flag);
    if (oldValue < 0)
      oldValue *= -1;
    return parseFloat(checkIntValue(difference / oldValue) * 100 * flag).toFixed(2);
  }

  var lastValue = 0,
    fixedFlag = true;
  $(window).scroll(function(event) {
    if (fixedFlag) {
      $("#inputTable").css("position", "fixed");
      $("#inputTable").css("bottom", "0px");
      // $("#midPointRows").css("margin-bottom", "70px!important");
      fixedFlag = false;
    }
    var scroll = $(window).scrollTop();
    if (lastValue > scroll) {
      //scrolling up
      $("#inputTable").hide("fast");
    } else {
      //scrolling down
      $("#inputTable").show("fast");
    }
    lastValue = scroll;
  });

  $('.btnSendEmail').click(function(event) {
    console.log("button clicked");
    // var email = '';
    // var subject = ''History of Demands and Offers'';
    // // var emailBody = '<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8" /></head><body>'+$("#midPointRows").html()+'</body></html>';
    // var emailBody = 'There will be image to attach';
    // window.location = 'mailto:' + email + '?subject=' + subject + '&body=' + emailBody;


    html2canvas(document.body, {
      onrendered: function(canvas) {
        // document.body.appendChild(canvas);


        var img = new Image();
        img.src = canvas.toDataURL();
        // document.body.appendChild(img);

        // console.log("img", $(img));

        var email = '';
        var subject = 'History of Demands and Offers';
        // var emailBody = '<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8" /></head><body><img src="'+img.src+'"></img></body></html>';
        console.log("canvas", $(canvas));
        // var emailBody = img.src;
        emailBody = 'testing123';
        window.location = 'mailto:' + email + '?subject=' + subject + '&body='+emailBody;



        // repo = "Sebaza";
        // list = "groceries";
        // semail = $("#shemail").val();
        // //(semail);
        // urri = 'mailto:' + semail + '?subject=share this list with me' + '&cc=' + semail + '&body=Hi, I think it would be cool if we shared this ' + list + ' list on our phones. That way when either of us modified it we would see the update. http://10.0.1.18/webeshoppin/stuff2get/www/food2buy.html?repo=' + repo + '&list=' + list + '&email=' + semail;
        // window.location = urri;
      }
    });
  });

  $(".btnCalculate").click(function() {

    var demand = parseFractionalValue($("#calcDemand").val()),
      mid = parseFractionalValue($("#calcMid").val()),
      offer = parseFractionalValue($("#calcOffer").val());

    if ($.isNumeric(demand) && $.isNumeric(mid)) {
      // mid = demand+offer/2
      mid = checkIntValue(mid);
      demand = checkIntValue(demand);

      offer = (mid * 2) - demand;
      $("#calcOffer").val(offer);

    } else if ($.isNumeric(demand) && $.isNumeric(offer)) {
      demand = checkIntValue(demand);
      offer = checkIntValue(offer);

      mid = (parseFloat(demand) + parseFloat(offer)) / 2;

      $("#calcMid").val(mid);
    } else if ($.isNumeric(offer) && $.isNumeric(mid)) {
      offer = checkIntValue(offer);
      mid = checkIntValue(mid);

      demand = (mid * 2) - offer;
      $("#calcDemand").val(demand);
    }
  });

  $(".btnCalculateClean").click(function() {
    $("#calcDemand").val('');
    $("#calcMid").val('');
    $("#calcOffer").val('');
  });

})();


// $(this).scroll(function (e) {
//   $('#testRow').attr('style', 'bottom:10px; position:fixed');
//   $('#midPointRows').attr('style', 'margin-bottom:70dp');

// });

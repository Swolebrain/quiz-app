 
var userAnswers = {};
var good = 0;
var bad = 0;
var numQuestions = 0; //this is calculated when loading the questions but could be assumed to be 5
                      //because API always returns 5 questions

$(document).ready( retrieveQuestions );
 
$("#validate").on("click", function(e){
    var correctAnswers = {};
    var numAnswered = 0;
    var responseCounter = 0;
    for(var x in userAnswers){
      numAnswered++;
      $.ajax({
          url: "http://fvi-grad.com:4004/quiz-get-answer/"+x+"",
          success: function(resp, txt, xhr){
            responseCounter++;
            var answer = eval(resp);
            var qid = this.url.split("/");
            qid = qid[qid.length-1];
            correctAnswers[qid] = answer;
            if(responseCounter === numAnswered)
              alert("Result: "+compareAnswers(userAnswers, correctAnswers)+"/ "+numQuestions);
              //TODO: make this an UI update
          }
          
      });
    }
});
 
//EVERY TIME THE USER CLICKS A CHOICE, HIS ANSWER IS SAVED TO GLOBAL VAR
$(".panel-body").on("click", "input", function(e){
    var id = $(this).attr("name");
    var value = $(this).val();
    userAnswers[id] = value;
});
 
function retrieveQuestions(){
    $.getJSON(
        "http://fvi-grad.com:4004/quiz",
        function(resp,txt,xhr){
           for (var x in resp){
               numQuestions++;
               $(".panel-body").find("ul").append(
                   `<li data-question-id='${resp[x].id}'>${resp[x].questionText}</li>`);
                $request = $(".panel-body").find("li");
                for(var y in resp[x].answers){
                    if(resp[x].id == $($request[x]).data("question-id")){
                            $($request[x]).append(`<p><label><input type='radio' 
                            name='${resp[x].id}' value='${(resp[x].answers)[y]}'>${(resp[x].answers)[y]}</label></p>`);
                    }
                }
            }
           
        }
    );
}

function compareAnswers(answers, key){ 
  var correct = 0;
  for (var ans in answers){
    if (answers[ans] === key[ans]) correct++;
  }
  return correct;
}
 


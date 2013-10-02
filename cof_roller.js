var Context = function(){
    this.text = "";
    this.currentIndex = 0;
    this.currentToken = "";
};
Context.prototype.setTextAndParse = function(textInput){
    this.text = textInput;
    //console.log(this.text);
    this.nextToken();
};
Context.prototype.nextToken = function(){
    if(this.text.length < 1){
        return null;
    }
    this.currentIndex = this.text.indexOf("+");
    // ex) text = "2d6+3+1d6"
    if(this.currentIndex < 0){
        this.currentToken = this.text;
        this.currentIndex = this.text.length;
        this.text = "";
    }else{
        this.currentToken = this.text.substring(0, this.currentIndex);// ex) currentToken = 2d6
        this.text = this.text.substring(this.currentIndex+1, this.text.length);// ex) text = 3+1d6
    }
    //console.log("text", this.text);
    //console.log("currentIndex", this.currentIndex);
    //console.log("currentToken", this.currentToken);
    return this.currentToken;
};

//$("#container").ready(function(){  
$("#container").ready(function(){  
    $("#submitter").bind('click', function(){
        var context = new Context();
        var text = $("#context").val();
        context.setTextAndParse(text);
        var node = new ProgramNode();
        var resultSet = node.parse(context)
        var result = resultSet.sum
        var max = resultSet.max;
        var min = resultSet.min;
        console.log(resultSet);
        //console.log(result);
        if(result == max){
            $("#result-body").prepend("<tr><td>" + result + "&nbsp;&nbsp;<span class=\"label label-success\">max</span></td><td>" + text + "</td></tr>");
        }else if(result == min){
            $("#result-body").prepend("<tr><td>" + result + "&nbsp;&nbsp;<span class=\"label label-danger\">min</span></td><td>" + text + "</td></tr>");
        }else{
            $("#result-body").prepend("<tr><td>" + result + "</td><td>" + text + "</td></tr>");
        }
    });
});

var ProgramNode = function(){
};
ProgramNode.prototype.parse = function(context){
    var sum = 0;
    var max = 0;
    var min = 0;
    while(true){
        var token = context.currentToken;
        var node = new NumericNode();
        sum = sum + node.parse(token).sum;
        max = max + node.parse(token).max;
        min = min + node.parse(token).min;
        if(context.nextToken() === null){
            break;
        }
    }
    return {"sum":sum, "max":max, "min":min};
}
var NumericNode = function(){
};
NumericNode.prototype.parse = function(token){
    //console.log("token", token);
    var indexOfD;
    if((indexOfD = token.indexOf("d")) > 0){
        var numOfDice = parseInt(token.substring(0,indexOfD));
        var sizeOfDice = parseInt(token.substring(indexOfD+1, token.length));
        var sum = 0;
        var max = 0;
        var min = 0;
        for(var i=0; i < numOfDice; i++){
            sum = sum + Math.floor( Math.random() * sizeOfDice + 1);
            max = max + sizeOfDice;
            min = 1
        }
        return {"sum":sum, "max":max, "min":min};
    }else{
        var sum = parseInt(token);
        var max = parseInt(token);
        var min = parseInt(token);
        return {"sum":sum, "max":max, "min":min};
    }
};







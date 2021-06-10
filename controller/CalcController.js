//O que não importa é a class, mas sim o que tem dentro dela, vai ser encontrado variavéis e funções
//passa a ser chamada de atributos e metódos só que dentro de uma class.

class CalcController{

    /* o metodo constructor é aquele chamado automaticamente quando existe a instância de uma classe */
    constructor(){ //chamar tudo aqui no constructor 
        //basta colocar this e o nome do metodo
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';

        this._operation = [];
        this._locale = 'pt-BR' //vamos criar vários atributos com esse idioma
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");

        /*a linha abaixo foi trocada de var para this, a intenção é chamar essa variável ao longo do código*/    
        // this._displayCalc = "0";
        this._currentDate; // antigo dataAtual 
        this.initialize(); //
        this.initButtonsEvents();
        this.initKeyboard();
    }

    copyToClipboard(){
            let input = document.createElement('input');

            input.value = this.displayCalc;
            
            document.body.appendChild(input);

            input.select();

            document.execCommand("Copy");

            input.remove();

    }

    pasteFromClipboard(){

        document.addEventListener('paste', e => {

            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);
            
            console.log(text);
        })
    }

    initialize(){ //método inicial
        
        // displayCalcEl.innerHTML = "4567";
        // this._dateEl.innerHTML = "12/3/2021"
        // this._timeEl.innerHTML = "4h20"
        this.setDisplayDateTime();

        //quero que você execute isso por essa quantidade de segundos
        setInterval(() => {
            /* DATA E HORA */
          this.setDisplayDateTime();   
        },1000);

        /*
        setTimeout(()=>{
            clearInterval(interval);
        } 10000);
        */
       this.setLastNumberToDisplay();

       this.pasteFromClipboard();
       
       document.querySelectorAll('btn-ac').forEach(btn=>{

        btn.addEventListener('dbclick', e =>{

            this.toggleAudio();

        });
       });
    }

    toggleAudio(){ //expressao util para interruptor
      this._audioOnOff = !this._audioOnOff; 
        // this._audioOnOff = (this._audioOnOff) ? false : true; 
        //  if (this._audioOnOff) {
        //     this._audioOnOff = false;
        // } else {
        //     this._audioOnOff = true;
        // }
    }

    playAudio(){
        if (this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();

    }
}


    initKeyboard(){
        document.addEventListener('keyup', e => {

            this.playAudio();
            
            // console.log(e.key);
            switch(e.key){
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspaace':
                    this.clearEntry()
                    break;
                
                    case '+':
                    case '-':
                    case '*':
                    case '/':
                    case '%':
                    this.addOperation(parseInt(e.key));
                    break;
    
                case 'igual':
                    this.calc();
                break;
    
                case 'ponto':
                this.addDot()
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':  
                    
                  this.addOperation(parseInt(value))
                                          break;
                                          
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
            }
                });
    }

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);

        })
    }

    clearAll(){
        
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    clearEntry(){
        this._operation.pop();

        this.setLastNumberToDisplay();
    }

    //ultimo item
    getLastOperation(){
        return this._operation[this._operation.length - 1];
    }
    setLastOperation(value){
        this._operation[this._operation.length - 1] = value;
    }
    //aqui dentro desse metodo podemos criar um Array só com sinais com  +-*/ e pergunta se está ai dentro; 
    isOperator(value){
       
        return (['+', '-', '*', '/', '%'].indexOf(value) > -1);
    }

    pushOperation(value) {
        this._operation.push(value);

        if(this._operation.length > 3){

            // let last = this._operation.pop();

            this.calc();

            // console.log(this._operation);
        }
    }

    getResult(){
        return eval(this._operation.join(""))
    }

    calc(){
     
        let last = '';
        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if(this._operation.length > 3){

            last = this._operation.pop();
            this._lastNumber = this.getResult();
            // let result = this.getResult();
        } else if (this._operation.length == 3){
            // this._lastOperator = this.getLastItem();
            this._lastNumber = this.getLastItem(false);
        }
        // console.log('_lastOperator', this._lastOperator);
        // console.log('_lastNumber', this._lastNumber);

        // let last = this._operation.pop();
        
        let result = this.getResult();
        if(last == '%') {

    result /= 100;
    this._operation = [result];
        
        } else {
            
        this._operation = [result, last];
            if (last) this._operation.push(last)
        }
        this.setLastNumberToDisplay();

    }

    getLastItem(isOperator = true ){
  
         let lastItem;

         for (let i = this._operation.length - 1; i >= 0; i--){
            if (this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            }
         }
        if (!lastItem){

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
            //dois pontos em cima significa senão
            }   

        return lastItem;
        }

    setLastNumberToDisplay(){

    //     let lastNumber;

    //     for (let i = this._operation.length-1; i >= 0; i--){
    //         if(!this.isOperator(this._operation[i])){
    //             lastNumber = this._operation[i];
    //             break;
    //         }

    //     }

    //     if(!lastNumber) lastNumber = 0;
    //     this.displayCalc = lastNumber;
    // }
        
        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
}
    addOperation(value){

        //se vier um numero isso de cima vai dar false por causa do debaixo

    // console.log('A', isNaN(this.getLastOperation()));

        if(isNaN(this.getLastOperation())){
            //string
        if (this.isOperator(value)){
            // //trocar o operador
            // this._operation[this._operation.length -1] = value;
            this.setLastOperation(value);
            
        // } else if (isNaN(value)) {
        //     //outra coisa 
        //     console.log('Outra coisa', value)
        //     }
        } else {
                this.pushOperation(value)
            this.setLastNumberToDisplay();
            }
        
        } else{

            if (this.isOperator(value)){

                this.pushOperation(value);

            } else { //adiconar um simbolo  + - * / 
            
                //number
            let newValue = this.getLastOperation().toString() + value.toString();
            // this._operation.push(newValue);
            this.setLastOperation(parseFloat(newValue));
                
            //atualizar display
            this.setLastNumberToDisplay();
            }
            
        }
    
    // console.log(this._operation);
    }

    setError(){
        this.displayCalc = "Error";
    }

    addDot(){
        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;


        if (this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');

        }
        this.setLastNumberToDisplay();

    }

    execBtn(value){

        this.playAudio();

        switch(value){
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry()
                break;
            
                case 'soma':
                this.addOperation('+')
                break;

            case 'subtração':
            this.addOperation('-')
                break;

            case 'multiplicação':
            this.addOperation('*')
                break;

            case 'divisao':
            this.addOperation('/')
                break;

            case 'porcento':
            this.addOperation('%')
                break;

            case 'igual':
                this.calc();
            break;

            case 'ponto':
            this.addDot()
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':  
                
              this.addOperation(parseInt(value))
                                      break;
                                      
            default:
                this.setError();
                break;
        }
    }


    initButtonsEvents(){

       let buttons = document.querySelectorAll("#buttons > g, #parts > g");
    //    console.log(buttons);


    //só um argumento só um parentes, se dois coloque dois. 
    buttons.forEach((btn, index)=>{
        
       this.addEventListenerAll(btn, 'click drag', e =>{
        
        let textBtn = btn.className.baseVal.replace("btn-", "");
        // console.log(btn.className.baseVal.replace("btn-", ""));
        this.execBtn(textBtn);
       });
//replace quer dizer substitua 

       this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
          btn.style.cursor = "pointer";
    
       });
    });
    }

     setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {day: "2-digit", month: "long", year:"numeric"});
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayTime(){
        return this._timeEl.innerHTML;
    }

    set displayTime(value){
        return this._timeEl.innerHTML = value;
    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }
    set displayDate(value){
        return this._dateEl.innerHTML = value;
    }



//só quero que ele me devolva 
    get displayCalc(){
 /* poderia colocar qualquer regra que acho interessante. Ex.: registrar em um log quantas vezes foram chamadas, de onde veio essa chamada.  */
        return this._displayCalcEl.innerHTML;

    }
/* mudar o valor do atributo displayCalc */
    set displayCalc(value){
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date();
        // return this._currentDate
    }

    set currentDate(value){
        this._currentDate = value;
    }
}

 
//budget controller

var budgetctrl=(function(){

var Expense=function(id,description,value)
{
this.id=id;
this.description=description;
this.value=value;
this.percentage=-1;
};

Expense.prototype.calcPercentage=function(totalinc){
if(totalinc>0)
{
    this.percentage=Math.round((this.value/totalinc)*100);
}
else{
    this.percentage=-1;

}
};

Expense.prototype.getPercentage=function()
{
return this.percentage;
};

var Income=function(id,description,value)
{
    this.id=id;
    this.description=description;
    this.value=value;
};

var calculateTotal=function(type)
{
var sum=0;

data.allItems[type].forEach(function(cur){

    sum+=cur.value;
})
data.totals[type]=sum;
};

var data={
allItems:{
    exp:[],
    inc:[]
},
totals:{
    exp:0,
    inc:0
},
budget:0,
percentage:-1
};

 return{
     addItem: function(type,des,val)
     {
         var newItem,Id;
         if(data.allItems[type].length>0)
         Id=data.allItems[type][data.allItems[type].length-1].id+1;
         else
         Id=0;
         if(type==='exp')
         {
             newItem=new Expense(Id,des,val);

         }
         else if(type==='inc')
         {
             newItem=new Income(Id,des,val);
         }
         data.allItems[type].push(newItem);
         return newItem;
     },

     deleteItem:function(type,id)
     {
         var ids,index;
         console.log("data-->"+data.allItems[type]);
        //id=3  
        ids=data.allItems[type].map(function(current){
            return current.id;
        });

        index=ids.indexOf(id);
        if(index!==-1)
        {
            //delete item usinf splice method
            data.allItems[type].splice(index,1);
        }

     },
     calculatePercentages:function()
     {
         data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
         });

     },
     getPercentage:function()
     {
        var allPerc=data.allItems.exp.map(function(cur){
            return cur.getPercentage();
        });
        return allPerc;
     },
     calculateBudget:function(){
        //calculate total income and the expenses
        calculateTotal('exp');
        calculateTotal('inc');
        //calculate the budget : income-expenses
        data.budget=data.totals.inc-data.totals.exp;
        //calculate the percentage of income that we spent
        if(data.totals.inc>0)
        {data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
        }
        else{
            data.percentage=-1;
        }


     },
     getBudget:function(){
        return{
            budget:data.budget,
            totalincome:data.totals.inc,
            totalexpenses:data.totals.exp,
            percentage:data.percentage
        }
     },

     testing:function(){
         console.log(data);
     }
 };

})();

var uictrl=(function(){

    var DOMstrings={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputvalue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensesPercentageLabel:'.item__percentage',
        dateLabel:'.budget__title--month'
        
    }
    var nodeListForeach=function(list,callback)
    {
        for(var i=0;i<list.length;i++){
            callback(list[i],i);
        }
    };

    
    var formatNumber=function(num,type)
    {
        /*
        + or - before number 
        exactly 2 decimal points
        comma separating  the thousands
                    */
                   var numSplit,int,dec,type;
                   num=Math.abs(num);
                   num=num.toFixed(2);
                   numSplit=num.split('.');
                   int =numSplit[0];
                   if(int.length>3){
                       int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
                   }

                   dec=numSplit[1];
                   

                   return (type==='exp'?'-':'+') + ' '+int+'.'+dec;

    }

    return{

        getinput:function(){
            return{
                type:document.querySelector(DOMstrings.inputType).value,  //will be inc/exp

                decription:document.querySelector(DOMstrings.inputDescription).value,
                value:parseFloat(document.querySelector(DOMstrings.inputvalue).value) 

            };
        },

        addListItem:function(obj,type){
            var html,element,newHtml;
            //create HTML string with placeholder text
           
            if(type==='inc')
            {
            element=DOMstrings.incomeContainer;
            html= '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i>del</i></button></div></div></div>';
            }
            else if(type==='exp'){
                element=DOMstrings.expensesContainer;
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i>del</i></button></div></div></div>';
            }
           

           
            //Replace the placeholder text with some actual data

            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));
            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

        }, 

        deleteListItems:function(selectorID){
            var el=document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        
        clearFields:function(){

            var fields,fieldsArray;
            fields=document.querySelectorAll(DOMstrings.inputDescription+','+DOMstrings.inputvalue);
            fieldsArray=Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(current,index,array)
            {
                current.value="";
            });
            fieldsArray[0].focus();
        },

         displayBudget:function(obj){
             var type;
             obj.budget>0?type='inc':type='exp';
            
            document.querySelector(DOMstrings.budgetLabel).      textContent=formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLabel).           textContent=formatNumber(obj.totalincome,'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent=formatNumber(obj.totalexpenses,'exp');
            

            if(obj.percentage>0)
            {
                document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage+'%';
            }
            else{
                document.querySelector(DOMstrings.percentageLabel).textContent='---';
            } 




        },

        displayPercentages:function(percentage)
        {
            var fields=document.querySelectorAll(DOMstrings.expensesPercentageLabel);
            
         

            nodeListForeach(fields,function(current,index){
                if(percentage[index]>0)
                {
                    current.textContent=percentage[index]+'%';
                }
                else{
                    current.textContent='---';
                }
            });
        },

        displayMonth:function(){
            var now,year,month,months;
            now=new Date();
            months=['January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'];
                month=now.getMonth();


            year=now.getFullYear()
            document.querySelector(DOMstrings.dateLabel).textContent=months[month]+' '+year;
        },

        changedType:function(){
            var fields=document.querySelectorAll(
                DOMstrings.inputType+','+DOMstrings.inputDescription+','+DOMstrings.inputvalue
            );

              nodeListForeach(fields,function(cur){
                cur.classList.toggle('red-focus');
              });  
              document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },
        getDOMStrings:function()
        {
            return DOMstrings;

        }
    };

})();


var controller=(function(bctrl,uctrl){

var setupEventListeners=function()
{
    var DOM=uctrl.getDOMStrings();
    document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

    document.addEventListener('keypress',function(event){
    
        if(event.keyCode==13 || event.which==13)
        {
            ctrlAddItem();
        }
      
    })

    document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change',uictrl.changedType);
};


var updatePercentage=function(){
    //1 calculate percentage
    budgetctrl.calculatePercentages();


    //2 read percentage from the budget controller 

    var per=budgetctrl.getPercentage();
    uictrl.displayPercentages(per);
    //3 update UI with the new perentage
console.log(per);
}

var updateBudget=function(){
//1. calculate the budget
budgetctrl.calculateBudget();
//2. Return the budget
var budget=budgetctrl.getBudget();

// console.log(budget);
//3. Display budget on the UI
// console.log("this is budget obj->",budget);
uictrl.displayBudget(budget);
};


var ctrlAddItem=function()
{
    var input,newItem;
    //get the field input data 
    
     input=uctrl.getinput(); 
    if(input.description!==""&&!isNaN(input.value)&&input.value>0)
     //Add items to the budget controller
    {
     newItem= budgetctrl.addItem(input.type,input.decription,input.value); //return obj
   console.log(newItem);
    //Add items to the ui
    uictrl.addListItem(newItem,input.type);

    //clear the fields
    uictrl.clearFields();
    //calculate the budget
    updateBudget();
 
    //Display the budget on the ui
    updatePercentage();    
}
};
var ctrlDeleteItem=function(event){
// console.log(event.target);
var itemID,splitID,type,ID;
itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
 
if(itemID){
    //inc-1
    splitID=itemID.split('-');
    type=splitID[0];
    ID=parseInt(splitID[1]);
   console.log("TYPEe",type);
    //delete item from data structure
    budgetctrl.deleteItem(type,ID);
    //delete from UI
    uictrl.deleteListItems(itemID);
    //update and show the new budget
    updateBudget();
    updatePercentage();
}
};


return{
 init:function()
{
    console.log('Application has Started');
    uictrl.displayMonth();
    uictrl.displayBudget({
        budget:0,
        totalincome:0,
        totalexpenses:0,
        percentage:-1
    });
    setupEventListeners();
}
};

})(budgetctrl,uictrl);


controller.init();  
let landing_page = document.querySelector("section.landing-page-container");
let admin_page = document.querySelector("section.admin-panel-container");
let quiz_page = document.querySelector("section.quiz-container");
let result_page = document.querySelector("section.final-result-container");

var quizController = (function(){
    /******ADMIN PAGE*********/
    function Question(id, questionText, options, correctAns){
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAns = correctAns;
    }
    return{
        
        saveToLocal: function(question){
            localStorage.setItem(str(id), JSON.stringify(question));
        },
        deleteFromLocal: function(question_id){
            localStorage.removeItem(str(question_id));
        },
        getItemsFromLocal: function(){
            let values = [],
            keys = Object.keys(localStorage),
            i = keys.length;

            while ( i-- ) {
                values.push( JSON.parse(localStorage.getItem( keys[i])) );
            }
            return values;
        },
        updateItemToLocal: function(question){
            let q_in_local = JSON.parse(localStorage.getItem(question.id))
            if(q_in_local === null) {
                return;
            } else {
                this.deleteFromLocal(q_in_local.id)
                this.saveToLocal(question)
            }
            
        },
        clearLocal: function(){
            let keys = Object.keys(localStorage),
            i = keys.length;

            while ( i-- ) {
                this.deleteFromLocal(keys[i])
            }
            
        }
    }
    
    
    
})();

var UIController = (function(){
    /*****LANDING PAGE******/
        const DOM_CONST = {
            start_btn: document.getElementById("start-quiz-btn"),
            first_name: document.getElementById("firstname"),
            last_name: document.getElementById("lastname"),
            op_container: document.getElementsByClassName("admin-option-container"),
            insert_btn: document.getElementById("question-insert-btn"),
            new_op: document.createElement("div")
        }
        
        
    

    return{
        
    }
})();

var controller = (function(quizCntrl, UICntrl){
    function create_question(){
        let quizDom = UICntrl.getCreateQuizDom;
        quizDom.op_container.addEventListener("focus", function(event){
            
            quizDom.new_op.setAttribute("class", "admin-option-wrapper");
            
            quizDom.op_container.append_child(new_div);
        });
    }
    
    let landingDom = UICntrl.getLandingDom;
    landingDom.start_btn.addEventListener('click', function(event){
        event.preventDefault();
            
            if(landingDom.first_name.value === "" || landingDom.last_name.value === "") {
                alert("You should complete both inputs");
            } else if(landingDom.first_name.value === "rozhan" && landingDom.last_name.value === "mirzaei") {
                landing_page.style.display = "none";
                quiz_page.style.display = "none";
                result_page.style.display = "none";
                create_question()
            } else {
                /*To DO: CHECK IF QUIZ EXISTS*/
                landing_page.style.display = "none";
                admin_page.style.display = "none";
                result_page.style.display = "none";
            }
        
    })

})(quizController, UIController);












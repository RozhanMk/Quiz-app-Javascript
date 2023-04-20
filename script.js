let question_count = 0;

var quizController = (function(){
    function Question(questionText, options, correctAns){
        this.id = question_count++;
        this.questionText = questionText;
        this.options = options;
        this.correctAns = correctAns;
    }
    return{
        
        saveToLocal: function(question){
            localStorage.setItem(String(id), JSON.stringify(question));
        },
        deleteFromLocal: function(question_id){
            localStorage.removeItem(String(question_id));
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
        getOneItemFromLocal: function(id){
            return JSON.parse(localStorage.getItem(String(id)));
        },
        updateItemToLocal: function(question){
            let q_in_local = JSON.parse(localStorage.getItem(question.id));
            if(q_in_local === null) {
                return;
            } else {
                this.deleteFromLocal(q_in_local.id);
                this.saveToLocal(question);
            }
            
        },
        clearLocal: function(){
            let keys = Object.keys(localStorage),
            i = keys.length;

            while ( i-- ) {
                this.deleteFromLocal(keys[i]);
            }
            
        }
    }
    
    
    
})();

var UIController = (function(){
        const DOM_CONST = {
            landing_page: document.querySelector("section.landing-page-container"),
            admin_page: document.querySelector("section.admin-panel-container"),
            quiz_page: document.querySelector("section.quiz-container"),
            result_page: document.querySelector("section.final-result-container"),
            start_btn: document.getElementById("start-quiz-btn"),
            first_name: document.getElementById("firstname"),
            last_name: document.getElementById("lastname"),
            question_box: document.getElementById('new-question-text'),
            options_container: document.getElementsByClassName("admin-option-container"),
            q_insert_btn: document.getElementById("question-insert-btn"),
            inserted_q_section: document.getElementsByClassName("inserted-questions-wrapper"),
            update_btn: document.getElementById("question-update-btn"),
            delete_btn: document.getElementById("question-delete-btn"),
        }
        
    
    return{
        populateQuestionLists: function(q_list){
            q_list.foreach(function(q){
                this.insertQuestionInSection(q);
            })
        },
        insertQuestionInSection: function(question){
            let new_p = document.createElement("p");
            new_p.setAttribute("id", "question-p-"+String(question.id));
            new_p.innerHTML = `<span>${String(question.id)}- ${question.questionText}</span><button id="question-${question.id}">Edit</button>`;
            DOM_CONST.inserted_q_section.append_child(new_p);
        },
        createNewOption: function(){
            let options_count = document.getElementsByClassName("admin-option-wrapper").length;
            let new_op = document.createElement("div");
            new_op.className = "admin-option-wrapper";
            new_op.innerHTML = `<input type="radio" class="admin-option-${String(options_count)}" name="answer" value="${String(options_count)}">
            <input type="text" class="admin-option admin-option-${String(options_count)}" value="">`;
            DOM_CONST.options_container.append_child(new_op);
        },
        editQuestionItem: function(question){
            DOM_CONST.update_btn.style.display = "block";
            DOM_CONST.delete_btn.style.display = "block";
            let selected_question = document.getElementById("question-p-"+String(question.id));
            let op_count = DOM_CONST.options_container.children.length;
            if (selected_question !== null) {
                DOM_CONST.question_box.value = question.questionText;
                for(let i=0; i<question.options.length - op_count; i++) {
                    this.createNewOption();
                }
                let radios = Array.from(document.getElementsByName('answer'));
                for(let i = 0; i < question.options.length; i++){
                    document.querySelector("input.admin-option-"+i).value = question.options[i];
                    if (question.correctAns === question.options[i]) {
                        radios[i].checked = true;
                    }
                }
                
            }
        },
        updateQuestionItem: function(question){
            let values = [];
            let radios = document.getElementsByName("answer");
            let options_html = document.getElementsByClassName("admin-option");
            for(let i=0; i < radios.length; i++){
                if (radios.checked) {
                    question.correctAns = options_html[i].value;
                    break;
                }
            }
            for(let i=0; i < options_html.length; i++){
                values.push(options_html[i].value);
            }
            question.questionText = DOM_CONST.question_box.value;
            this.clearAdminContainer();
            
        },
        deleteQuestionItem: function(question){
            let p_tag = document.getElementById("question-p-"+String(question.id));
            p_tag.remove();
            this.clearAdminContainer();
        },
        clearAdminContainer: function(question){
            DOM_CONST.question_box.value = "";
            DOM_CONST.options_container.innerHTML = `<div class="admin-option-wrapper">
            <input type="radio" class="admin-option-0" name="answer" value="0">
            <input type="text" class="admin-option admin-option-0" value="">
            </div>
            <div class="admin-option-wrapper">
                <input type="radio" class="admin-option-1" name="answer" value="1">
                <input type="text" class="admin-option admin-option-1" value="">
            </div>`;
            DOM_CONST.update_btn.style.display = "none";
            DOM_CONST.delete_btn.style.display = "none";
            
        },
        goToLandingPage: function(){
            DOM_CONST.admin_page.style.display = "none";
            DOM_CONST.landing_page.style.display = "block";
        }

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


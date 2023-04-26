
var quizController = (function(){
    getItemsFromLocal = function(){
        let values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

        while ( i-- ) {
            values.push( JSON.parse(localStorage.getItem( String(keys[i]))) );
        }
        return values;
    }
    question_count = function(){
        let items = getItemsFromLocal();
        return items.length;
    }
    function Question(questionText, options, correctAns){
        this.id = question_count();
        this.questionText = questionText;
        this.options = options;
        this.correctAns = correctAns;
    }
    return{
        Question: Question,
        
        saveToLocal: function(question){
            localStorage.setItem(String(question.id), JSON.stringify(question));
        },
        getItemsFromLocal: getItemsFromLocal,
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
        deleteFromLocal: function(question_id){
            localStorage.removeItem(String(question_id));
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
        let DOM_CONST = {
            landing_page: document.querySelector("section.landing-page-container"),
            admin_page: document.querySelector("section.admin-panel-container"),
            quiz_page: document.querySelector("section.quiz-container"),
            result_page: document.querySelector("section.final-result-container"),
            start_btn: document.getElementById("start-quiz-btn"),
            first_name: document.getElementById("firstname"),
            last_name: document.getElementById("lastname"),
            question_box: document.getElementById('new-question-text'),
            options_container: document.querySelector(".admin-options-container"),
            options: document.getElementsByClassName("admin-option-wrapper"),
            q_insert_btn: document.getElementById("question-insert-btn"),
            inserted_q_section: document.querySelector(".inserted-questions-wrapper"),
            update_btn: document.getElementById("question-update-btn"),
            delete_btn: document.getElementById("question-delete-btn"),
            logout_btn: document.getElementById("admin-logout-btn"),
            clear_btn: document.getElementById("questions-clear-btn"),
            
        };
        
    
    return{
        getSelectors: function(){
            return DOM_CONST;
        },
        populateQuestionLists: function(q_list){
            if(q_list.length !== 0){
                q_list.forEach(function(q){
                    this.insertQuestionInSection(q);
                }, this);
            }
        },
        insertQuestionInSection: function(question){
            let new_p = document.createElement("p");
            new_p.setAttribute("id", "question-p-"+String(question.id));
            new_p.innerHTML = `<span>${String(question.id)}- ${question.questionText}</span><button id="question-${question.id}">Edit</button>`;
            DOM_CONST.inserted_q_section.appendChild(new_p);
        },
        createNewOption: function(){
            let options_count = document.getElementsByClassName("admin-option-wrapper").length;
            if (options_count == 6) {
                alert("Maxium number of options is 6");
                return;
            }
            let new_op = document.createElement("div");
            new_op.className = "admin-option-wrapper";
            new_op.innerHTML = `<input type="radio" class="admin-option-${String(options_count)}" name="answer" value="${String(options_count)}">
            <input type="text" class="admin-option admin-option-${String(options_count)}" value="">`;
            DOM_CONST.options_container.appendChild(new_op);
        },
        editQuestionItem: function(question){
            DOM_CONST.q_insert_btn.style.visibility = "hidden";
            DOM_CONST.update_btn.style.visibility = "visible";
            DOM_CONST.delete_btn.style.visibility = "visible";
            let selected_question = document.getElementById("question-p-"+String(question.id));
            let op_count = DOM_CONST.options_container.children.length;
            if (selected_question !== null) {
                DOM_CONST.question_box.value = question.questionText;
                for(let i=0; i<question.options.length - op_count; i++) {
                    this.createNewOption();
                }
                let texts_options = document.getElementsByClassName("admin-option");
                for(let i=0; i<question.options.length; i++) {
                    texts_options[i].value = question.options[i];
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
            console.log(radios.length);

            for(let i=0; i < radios.length; i++){
                if (radios[i].checked) {
                    question.correctAns = options_html[i].value;
                    break;
                }
            }
            if(!question.correctAns.trim()){
                alert("You must choose an answer!");
                return;
            }
            for(let i=0; i < options_html.length; i++){
                if (options_html[i].value.trim()){
                    values.push(options_html[i].value);
                }
            }
            if (values.length < 2){
                alert("You must write more than one option!");
                return;
            }
            question.options = values;
            question.questionText = DOM_CONST.question_box.value;
        },
        deleteQuestionItem: function(question){
            let p_tag = document.getElementById("question-p-"+String(question.id));
            p_tag.remove();
        },
        clearAdminContainer: function(){
            DOM_CONST.q_insert_btn.style.visibility = "visible";
            DOM_CONST.question_box.value = "";
            DOM_CONST.options_container.innerHTML = `<div class="admin-option-wrapper">
            <input type="radio" class="admin-option-0" name="answer" value="0">
            <input type="text" class="admin-option admin-option-0" value="">
            </div>
            <div class="admin-option-wrapper">
                <input type="radio" class="admin-option-1" name="answer" value="1">
                <input type="text" class="admin-option admin-option-1" value="">
            </div>`;
            DOM_CONST.update_btn.style.visibility = "hidden";
            DOM_CONST.delete_btn.style.visibility = "hidden";
            
        },
        goToLandingPage: function(){
            DOM_CONST.admin_page.style.display = "none";
            DOM_CONST.landing_page.style.display = "block";
        },
        changeQuestionSection(question){
            let q_text = document.getElementById("question-"+question.id);
            q_text.previousElementSibling.textContent = question.questionText;
        }
    }
})();

var controller = (function(quizCntrl, UICntrl){

    const UIselect = UICntrl.getSelectors();
    let q_target = "";

    
    const loadEventListener = function(){
        UIselect.start_btn.addEventListener('click', startQuizClick);
        UIselect.options[UIselect.options.length - 1].addEventListener("mouseup", addOptionClick);
        document.getElementById("question-insert-btn").addEventListener('click', inserQuestionClick);
        let elements_in_edit = document.querySelectorAll('.inserted-questions-wrapper button');
        for (let i = 0; i < elements_in_edit.length; i++) {
            elements_in_edit[i].addEventListener('click', editQuestionClick);
        }
        UIselect.update_btn.addEventListener('click', updateQuestionClick);
        UIselect.delete_btn.addEventListener('click', deleteQuestionClick);
        UIselect.logout_btn.addEventListener('click', logoutClick);
        UIselect.clear_btn.addEventListener("click", function(){
            UICntrl.clearAdminContainer();
            loadEventListener();
        })
    }
    const addOptionClick = function(e){
        UICntrl.createNewOption();
        this.removeEventListener('mouseup', addOptionClick);

        UIselect.options[UIselect.options.length - 1].addEventListener('mouseup', addOptionClick);
    }
    const startQuizClick = function(e){
        e.preventDefault();
            
        if(UIselect.first_name.value === "" || UIselect.last_name.value === "") {
            alert("You should complete both inputs");
        } else if(UIselect.first_name.value === "rozhan" && UIselect.last_name.value === "mirzaei") {
            UIselect.admin_page.style.display = "block";
            UIselect.landing_page.style.display = "none";
            UIselect.quiz_page.style.display = "none";
            UIselect.result_page.style.display = "none";

        } else {
            if (quizCntrl.getItemsFromLocal().length !== 0){
                UIselect.quiz_page.style.display = "block";
                UIselect.landing_page.style.display = "none";
                UIselect.admin_page.style.display = "none";
                UIselect.result_page.style.display = "none";
            } else {
                alert("There is no quiz available!");
            }
        }
    }
    const loadQuestionsAdmin = function(){
        let q_list = Array.from(quizCntrl.getItemsFromLocal());
        UICntrl.populateQuestionLists(q_list);
    }
    const inserQuestionClick = function(){
        let text = UIselect.question_box.value;
        if (!text.trim()) {
            alert("You must write the question!");
            return;
        }

        let answer = "";
        let values = [];
        let options = Array.from(document.querySelectorAll("input.admin-option"));
        let radios = Array.from(document.getElementsByName("answer"));
        // put value of options in 'values'
        options.forEach(function(op){
            if (op.value !== ""){
                values.push(op.value);
            }
        });
        if (values.length < 2) {
            alert("number of options must be 2 at least.");
            return;
        }
        // Finding answer(radio that is checked)
        radios.forEach(function(radio, index){
            if (radio.checked) {
                answer = options[index].value;
            }
        })
        if (answer === "") {
            alert("you must choose an answer!");
            return;
        }
        let q = new quizCntrl.Question(text, values, answer);
        UICntrl.insertQuestionInSection(q);
        quizCntrl.saveToLocal(q);
        UICntrl.clearAdminContainer();
        loadEventListener();
    }

    const editQuestionClick = function(e){
        UICntrl.clearAdminContainer();
        loadEventListener();
        let id = e.target.getAttribute('id').split("-")[1];
        q_target = id;
        let q = quizCntrl.getOneItemFromLocal(id);
        UICntrl.editQuestionItem(q);
        UIselect.options[UIselect.options.length - 1].addEventListener("mouseup", addOptionClick);
    }
    const updateQuestionClick = function(){
        let question = quizCntrl.getOneItemFromLocal(q_target);
        UICntrl.updateQuestionItem(question);
        UICntrl.clearAdminContainer();
        loadEventListener();
        quizCntrl.updateItemToLocal(question);
        UICntrl.changeQuestionSection(question);
    }
    const deleteQuestionClick = function(){
        let question = quizCntrl.getOneItemFromLocal(q_target);
        UICntrl.deleteQuestionItem(question);
        UICntrl.clearAdminContainer();
        loadEventListener();
        quizCntrl.deleteFromLocal(q_target);
    }
    const logoutClick = function(){
        UICntrl.goToLandingPage();
        UIselect.first_name.value = "";
        UIselect.last_name.value = "";
    }
    return{
        init: function(){
            UIselect.landing_page.style.display = "block";
            UIselect.quiz_page.style.display = "none";
            UIselect.admin_page.style.display = "none";
            UIselect.result_page.style.display = "none";
            UICntrl.clearAdminContainer();
            loadQuestionsAdmin();
            loadEventListener();
        }
    }

})(quizController, UIController);

controller.init();

let landing_page = document.querySelector("section.landing-page-container");
let admin_page = document.querySelector("section.admin-panel-container");
let quiz_page = document.querySelector("section.quiz-container");
let result_page = document.querySelector("section.final-result-container");

var quizController = (function(){
    /******ADMIN PAGE*********/

})();

var UIController = (function(){
    /*****LANDING PAGE******/
    function handle_input(){
        let start_btn = document.getElementById("start-quiz-btn");
        start_btn.addEventListener('click', function(event){
            event.preventDefault();
            let first_name = document.getElementById("firstname").value;
            let last_name = document.getElementById("lastname").value;
            if(first_name === "" || last_name === "") {
                alert("You should complete both inputs");
            } else if(first_name === "rozhan" && last_name === "mirzaei") {
                landing_page.style.display = "none";
                quiz_page.style.display = "none";
                result_page.style.display = "none";
            } else {
                /*To DO: CHECK IF QUIZ EXISTS*/
                landing_page.style.display = "none";
                admin_page.style.display = "none";
                result_page.style.display = "none";
            }
        })
    }
    
    return{
        handle_input: handle_input()
    }
})();

var controller = (function(quizCntrl, UICntrl){
    UICntrl.handle_input();
})(quizController, UIController);












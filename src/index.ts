import "systemjs";


window.onload = function () {

    const btnTest = document.getElementById('btnTest');

    btnTest.addEventListener('click', fnTest);
}

function fnTest(): void {
    System.import('/assets/js/tool.js').then(m=>{
        console.log(1,m);
        
    });
}
const CURRENT_URL = JSON.parse(document.getElementById('url').innerHTML);
var admins;
var user = JSON.parse(document.getElementById('user').innerHTML);



fetch(`${CURRENT_URL}/user/getAdmins`)
  .then((response) => response.json())
  .then((data) => admins=data);

// fetch(`${CURRENT_URL}/user/getUser/${id}`)
//     .then((response) => response.json())
//     .then((data) => user=data);
// console.log(admins);
// console.log(user);

var date = document.getElementById('date');
var today = new Date();
date.innerHTML = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();



//QR CODE

let link=`${CURRENT_URL}/download/${user._id}`;
// console.log(link);

var qrcode = new QRCode(document.querySelector(".qrCode"), {
    text: link,
    width: 100, //128
    height: 100,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
});

let a=document.getElementById('atag');
a.setAttribute('href',link);

//PDF Download

var downloadbtn=document.getElementById('download');
downloadbtn.addEventListener('click',download5);

function download(){
    console.log("Hello");
    
    let doc = new jsPDF('p','pt','a4');
    var content=document.getElementById('body');
    console.log(content);
    doc.addHTML(content,function() {
        doc.save('No-Dues.pdf');
    });
    // how to convert an html to pdf using javascript?
}
function download1(){
    const doc = new jsPDF({
        orientation: 'p',
        });

    // var width=doc.internal.pageSize.getWidth();
    // var height=doc.internal.pageSize.getHeight();

    // var width=10000000;
    // var height=1000000;
 

    var content=document.body;

    html2canvas(content, {
        allowTaint:true,
        useCORS: true,
        scale: 1
    }).then((canvas) => {
        const img = canvas.toDataURL("image/png");

        doc.addImage(img, "PNG", 7,13,150,250);
        doc.save("No-Dues.pdf");
        // 3508 x 2480 px
    })
}
function download3(){
    var doc = new jsPDF();          
    var elementHandler = {
        '#download': function (element, renderer) {
            return true;   
        },
        '#user': function (element, renderer) {
            return true;   
        },
        '#url': function (element, renderer) {
            return true;   
        }
    };
    
    var source = window.document.getElementsByTagName("body")[0];
    doc.fromHTML(
        source,
        15,
        15,
        {
        'width': 180,'elementHandlers': elementHandler,
        });

    doc.output("dataurlnewwindow");
}
function download4() {
    let pdf = new jsPDF('p','pt','a4');
 
    // source can be HTML-formatted string, or a reference
    // to an actual DOM element from which the text will be scraped.
    source = document.body;

    // we support special element handlers. Register them with jQuery-style 
    // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
    // There is no support for any other type of selectors 
    // (class, of compound) at this time.
    specialElementHandlers = {
        // element with id of "bypass" - jQuery style selector
        'download': function (element, renderer) {
            // true = "handled elsewhere, bypass text extraction"
            return true
        }
    };
    margins = {
        top: 80,
        bottom: 60,
        left: 40,
        width: 522
    };
    // all coords and widths are in jsPDF instance's declared units
    // 'inches' in this case
    pdf.fromHTML(
        source, // HTML string or DOM elem ref.
        margins.left, // x coord
        margins.top, { // y coord
            'width': margins.width, // max width of content on PDF
            'elementHandlers': specialElementHandlers
        },

        function (dispose) {
            // dispose: object with X, Y of the last line add to the PDF 
            //          this allow the insertion of new lines after html
            pdf.save('Test.pdf');
        }, margins
    );
}
function download5(){
    downloadbtn.style.display='none';
    window.print();
    downloadbtn.style.display='block';
}

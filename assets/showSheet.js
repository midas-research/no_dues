values = [];
values.push(['Name', 'Roll no.', 'Email', 'Design Lab', 'Library', 'Admin Facilities', 
    'System Admin', 'Sports', 'Hostel', 'ECE Labs', 'Placement', 'Incubation', 'Finance',
    'Academics', 'IP', 'BTP']);
//var docs = await User.find({});
var request = new XMLHttpRequest();
const CURRENT_URL= JSON.parse(document.getElementById('CURRENT_URL').innerHTML);

request.open('GET', `${CURRENT_URL}/user/getStudentsLoggedIn`, false);
request.send(null);
if (request.status === 200) {
  docs = JSON.parse(request.responseText);
}
console.log(docs);
for (var i in docs) {
    if (docs[i]['type'] === undefined) {
        var temp = [];
        temp.push(docs[i]['name']);
        temp.push(docs[i]['roll']);
        temp.push(docs[i]['email']);
        temp.push(docs[i]['designLab']);
        temp.push(docs[i]['library']);
        temp.push(docs[i]['adminFacilities']);
        temp.push(docs[i]['systemAdminAndNetworking']);
        temp.push(docs[i]['sportsAndStudentFacilities']);
        temp.push(docs[i]['hostel']);
        temp.push(docs[i]['eceLabs']);
        temp.push(docs[i]['placementIncharge']);
        temp.push(docs[i]['incubationCenter']);
        temp.push(docs[i]['finance']);
        temp.push(docs[i]['academics']);        
        temp.push(docs[i]['ip']);
        temp.push(docs[i]['btp']);        
        values.push(temp);
    }
}
console.log(values);
var table = document.getElementById('table');
// for (var i = 0, row; row = table.rows[i]; i++) {
//     for (var j = 0, col; col = row.cells[j]; j++) {
//         col.innerHTML = 'hello world!';
//         console.log(i, j);
//     }
// }
for (var i=1; i<values.length; i++) {
    var row = table.insertRow(i);
    for (var j=0; j<values[i].length; j++) {
        var cell = row.insertCell(j);
        cell.innerHTML = values[i][j];
    }
    // var cell1 = row.insertCell(0);
    // var cell2 = row.insertCell(1);
    // cell1.innerHTML = "NEW CELL1";
    // cell2.innerHTML = "NEW CELL2";
}
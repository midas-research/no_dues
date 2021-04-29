var professorList = {
    'scheduler@iiitd.ac.in' : 'Raghava Mutharaju',
};

var proffEmail = document.getElementById('proffEmail').innerText;
var id = document.getElementById('id').innerText;
var studentList = JSON.parse(document.getElementById('studentList').innerText);
console.log(studentList);

var students = []
var studentsBtech = []
var studentsMtech = []
var studentsPhd = []
for (var i in studentList) {
    if (studentList[i]['ip']==proffEmail) {
        students.push([studentList[i]['email'], 'ip']);
        if (studentList[i]['branch'] == 'btech') {
            studentsBtech.push([studentList[i]['email'], 'ip']);
        }
        if (studentList[i]['branch'] == 'mtech') {
            studentsBtech.push([studentList[i]['email'], 'ip']);
        }
        if (studentList[i]['branch'] == 'phd') {
            studentsBtech.push([studentList[i]['email'], 'ip']);
        }
    }
    if (studentList[i]['btp']==proffEmail) {
        students.push([studentList[i]['email'], 'btp']);
        if (studentList[i]['branch'] == 'btech') {
            studentsBtech.push([studentList[i]['email'], 'btp']);
        }
        if (studentList[i]['branch'] == 'mtech') {
            studentsBtech.push([studentList[i]['email'], 'btp']);
        }
        if (studentList[i]['branch'] == 'phd') {
            studentsBtech.push([studentList[i]['email'], 'btp']);
        }
    }
}
console.log(students);
console.log(studentsBtech);
console.log(studentsMtech);
console.log(studentsPhd);
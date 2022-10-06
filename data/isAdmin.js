adminNames=require('./getAdminName');

module.exports.isAdmin = (email) => {

    // const arr = [
    //     'no-dues@iiitd.ac.in',
    //     'rajendra@iiitd.ac.in',
    //     'admin-facilities@iiitd.ac.in',
    //     'abhinay@iiitd.ac.in',
    //     'ravi@iiitd.ac.in',
    //     'rahul@iiitd.ac.in',
    //     'rashmil@iiitd.ac.in',
    //     'geetagupta@iiitdic.in',
    //     'varsha@iiitd.ac.in',
    //     'admin-btech@iiitd.ac.in',
    //     'admin-mtech@iiitd.ac.in',
    //     'admin-phd@iiitd.ac.in',
    // ];
    if (email in adminNames.adminNames) {
        return true;
    } else {
        return false;
    }
}
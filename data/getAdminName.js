var adminNames = {"admin-dilabs@iiitd.ac.in":"designLab","rajendra@iiitd.ac.in":"library","admin-facilities@iiitd.ac.in":"adminFacilities","abhinay@iiitd.ac.in":"systemAdminAndNetworking","admin-sports@iiitd.ac.in":"sportsAndStudentFacilities","no-dues@iiitd.ac.in":"hostel","rahul@iiitd.ac.in":"eceLabs","admin-placement@iiitd.ac.in":"placementIncharge","incubation@iiitd.ac.in":"incubationCenter","kapildev@iiitd.ac.in":"researchAndProject","varsha@iiitd.ac.in":"finance","admin-btech@iiitd.ac.in":"academics","admin-mtech@iiitd.ac.in":"academics","admin-phd@iiitd.ac.in":"academics"}
module.exports.getAdminName = (email) => {
        if (email in adminNames) {
            return adminNames[email];
        } else {
            return 'student';
        }
    }
    module.exports.adminNames = adminNames;  
    
    
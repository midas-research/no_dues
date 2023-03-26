var adminNames = {"Name":"admin","Abhijeet Mishra ":"designLab","Rajendra Singh":"library","Sanjay Ray":"adminFacilities","Abhinav Saxena":"systemAdminAndNetworking","Ravi Bhasin":"hostel","Rahul Gupta":"eceLabs","Rashmil Mishra":"placementIncharge","Geeta Gupta":"incubationCenter","Kapil Dev Garg":"researchAndProject","Admin Finance":"finance","Admin B.Tech.":"academics","Admin M.Tech.":"academics","Admin PhD":"academics","Admin CSE":"adminCSE","Admin ECE":"adminECE","Admin Maths":"adminMaths","Admin SSH":"adminSSH","Admin HCD":"adminHCD","Admin CB":"adminCB"};
module.exports.getAdminName = (email) => {
        if (email in adminNames) {
            return adminNames[email];
        } else {
            return 'student';
        }
    };
    module.exports.adminNames = adminNames;
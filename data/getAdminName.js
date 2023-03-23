var adminNames = {"Name":"admin","Abhijeet Mishra ":"designLab","Rajendra Singh":"library","Sanjay Ray":"adminFacilities","Abhinav Saxena":"systemAdminAndNetworking","Ravi Bhasin":"hostel","Rahul Gupta":"eceLabs","Rashmil Mishra":"placementIncharge","Geeta Gupta":"incubationCenter","Kapil Dev Garg":"researchAndProject","Varsha":"finance","Nisha Narwal":"academics","Mohit Kumar":"academics","Anshu Dureja":"academics"};
module.exports.getAdminName = (email) => {
        if (email in adminNames) {
            return adminNames[email];
        } else {
            return 'student';
        }
    };
    module.exports.adminNames = adminNames;
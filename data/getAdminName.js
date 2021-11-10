module.exports.getAdminName = (email) => {
    if (email == 'no-dues@iiitd.ac.in') {
        return 'designLab';
    } else if (email == 'rajendra@iiitd.ac.in') {
        return 'library';
    } else if (email == 'admin-facilities@iiitd.ac.in') {
        return 'adminFacilities';
    }  else if (email == 'ravi@iiitd.ac.in') {
      return 'hostel';
    } else if (email == 'abhinay@iiitd.ac.in') {
        return 'systemAdmin';
    } else if (email == 'ravi@iiitd.ac.in') {
        return 'sports';
    } else if (email == 'rahul@iiitd.ac.in') {
        return 'eceLabs';
    } else if (email == 'rashmil@iiitd.ac.in') {
        return 'placement';
    } else if (email == 'geetagupta@iiitdic.in') {
        return 'incubation';
    } else if (email == 'varsha@iiitd.ac.in') {
        return 'finance';
    } else if (email == 'admin-btech@iiitd.ac.in') {
        return 'academics';
    } else {
        return 'student';
    }
  }
a = `PRODUCT SPECIALIST	Full time		DUOPHARMA (M) SENDIRIAN BERHAD	ETHICAL SPECIALTY BUSINESS
SR EXECUTIVE, TECHNOLOGY TRANSFER	Full time		DUOPHARMA INNOVATION SDN BHD	FORMULATION
SR SUPERVISOR, ANALYTICAL	Full time		DUOPHARMA INNOVATION SDN BHD	ANALYTICAL
INTEGRITY ADMINISTRATOR	Full time		DUOPHARMA BIOTECH BERHAD	GROUP INTERNAL AUDIT & INTEGRITY
CHARGEMAN	Full time		DUOPHARMA (M) SENDIRIAN BERHAD	PRODUCTION MAINTENANCE
BOILERMAN	Full time		DUOPHARMA (M) SENDIRIAN BERHAD	PRODUCTION MAINTENANCE
MANAGER	Full time		DUOPHARMA (M) SENDIRIAN BERHAD	BUSINESS DEVELOPMENT
ASSISTANT MANAGER	Full time		DUOPHARMA (M) SENDIRIAN BERHAD	STRATEGY
SUPERVISOR	Full time		DUOPHARMA BIOTECH BERHAD	LEGAL & COMPANY SECRETARY
SR EXECUTIVE, IT (SAP)	Full time		DUOPHARMA MARKETING SDN BHD	IT
SR EXECUTIVE, IT (INFRASTRUCTURE & IT SUPPORT)	Full time		DUOPHARMA MARKETING SDN BHD	IT
EXECUTIVE, IT (LIMS)	Full time		DUOPHARMA MARKETING SDN BHD	IT
SR EXECUTIVE, VALIDATION	Full time		DUOPHARMA MANUFACTURING (BANGI) SDN BHD	VALIDATION
TECHNICIAN	Full time		DUOPHARMA MANUFACTURING (BANGI) SDN BHD	VALIDATION
SR EXECUTIVE, STABILITY	Full time		DUOPHARMA MANUFACTURING (BANGI) SDN BHD	STABILITY
TECHNICIAN	Full time		DUOPHARMA MANUFACTURING (BANGI) SDN BHD	QC
TECHNICIAN, QC (CONTRACT)	Full time		DUOPHARMA MANUFACTURING (BANGI) SDN BHD	QC
HR EXECUTIVE	Full time		DUOPHARMA MANUFACTURING (BANGI) SDN BHD	HR
CHARGEMAN (A4)	Full time		DUOPHARMA MANUFACTURING (BANGI) SDN BHD	ENGINEERING
MEDICAL REPRESENTATIVE	Full time		DUOPHARMA MARKETING SDN BHD	ETHICAL SALES
COMPLIANCE EXEC	Full time		DUOPHARMA MANUFACTURING (BANGI) SDN BHD	COMPLIANCE
TRADE MARKETING EXECUTIVE	Full time		DUOPHARMA MARKETING SDN BHD	CHC MKTG
EXECUTIVE, BUSINESS IMPROVEMENT	Full time		DUOPHARMA MANUFACTURING (BANGI) SDN BHD	BUSINESS IMP
TELESALES	Full time		DUOPHARMA MARKETING SDN BHD	TELESALES
COMPLIANCE ANALYST	Full time		DUOPHARMA MANUFACTURING (BANGI) SDN BHD	COMPLIANCE`;

a = a.split("\n");
sql = "";
for(var _a of a){
    _a = _a.split("\t");
    console.log(_a);

    let title = _a[0];
    let type = _a[1];
    let location = _a[3];
    let desc = "Department : " +  _a[4];
    let cid = 698;

    sql += `INSERT INTO vacancies (company_id, title, location, description, type, created_by) 
    VALUES ('${cid}', '${title}', '${location}', '${desc}', '${type}', 1); \n`;
}

console.log(sql)
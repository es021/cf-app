a = `Application
Assembly Equipment 
Automation 
Automotive/Motorcycle 
BIM 
CAD 
Civil 
Component Mfg Test 
Construction 
Cyber Security & Network
Debug 
Development
Electrical 
Electronic 
Energy Project Survey 
Engineering and Maintenance 
Environmental 
Equipment 
Failure Analysis 
Field Technical Support
Fire & Gas 
Helpdesk Support
Instrument 
IoT 
Lab 
Marine 
Marketing 
Material
Mechanical 
Mechanical Design
Mechatronic 
Metrology 
NFVi System Integrator
NPI 
Oil & Gas
Op Feature Enablement 
Planning 
PLC
PM 
Power and Energy 
PQA 
Process 
Product Marketing
Product Reliabilty Test 
Production 
Project 
QA 
R&D 
Reliability 
Resident 
RODI/WWTP 
Sales
Service
SMT Process 
Software
Spare Part 
System 
Technical
Test Development
Vision
Water Process
Wire Bond 
Wireless/Microwave Network 
Others`

r = a.split("\n").map((d)=>{
  return `INSERT INTO ref_oejf21_interested_job (val) VALUES ('${d.trim()}');`
}).join("\n");

console.log(r)
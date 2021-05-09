a = `Accounting / Tax Services 
Advertising / Marketing / PR 
Agriculture / Poultry / Fisheries 
Apparel 
Architecture / Interior Design 
Arts / Design / Fashion 
Automobile / Automotive 
Aviation / Airline 
Banking / Finance 
Beauty / Fitness 
BioTech / Pharmaceutical 
Business / Mgmt Consulting 
Call Center / BPO 
Chemical / Fertilizers 
Construction / Building 
Consumer Products / FMCG 
Education 
Electrical & Electronics 
Engineering / Technical Consulting 
Entertainment / Media 
Environment / Health / Safety 
Exhibitions / Event Mgmt 
Food & Beverage 
Gems / Jewellery 
General & Wholesale Trading 
Government / Defence 
Healthcare / Medical 
Heavy Industrial / Machinery 
Hotel / Hospitality 
HR Mgmt / Consulting 
Insurance 
IT / Hardware 
IT / Software 
Journalism 
Law / Legal 
Manufacturing / Production 
Marine / Aquaculture 
Mining 
Oil / Gas / Petroleum 
Polymer / Rubber 
Printing / Publishing 
Property / Real Estate 
R&D 
Repair / Maintenance 
Retail / Merchandise 
Science & Technology 
Security / Law Enforcement 
Semiconductor 
Social Services / NGO 
Sports 
Stockbroking / Securities 
Telecommunication 
Textiles / Garment 
Tobacco 
Transportation / Logistics 
Travel / Tourism 
Utilities / Power 
Wood / Fibre / Paper 
Others`

r = a.split("\n").map((d) => {
    return `INSERT INTO ref_oejf21_industry (val) VALUES ('${d.trim()}');`
}).join("\n");

console.log(r)
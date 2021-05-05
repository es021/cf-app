a = `Accounting and Finance](https://university.sunway.edu.my/subs/bsc-acc-fin)
Advertising and Branding](https://university.sunway.edu.my/soa/ba-advertising-branding)
Business Analytics](https://university.sunway.edu.my/subs/bbs-analytics)
Actuarial Studies](https://university.sunway.edu.my/math-sc/bsc-actuarial)
American Degree Transfer Program](https://university.sunway.edu.my/american/programme)
Biology with Psychology](https://university.sunway.edu.my/sci/bsc-bio-psy)
Biomedicine](https://university.sunway.edu.my/sci/bsc-biomed)
Business Management](https://university.sunway.edu.my/subs/bsc-b-mgmt)
Business Studies](https://university.sunway.edu.my/subs/bsc-b-studies)
Communication](https://university.sunway.edu.my/soa/ba-communication)
Computer Science](https://university.sunway.edu.my/tech/bsc-comp-sc)
Contemporary Music (Audio Technology)](https://university.sunway.edu.my/soa/ba-music-audiotech)
Conventions and Events Management](https://university.sunway.edu.my/hospitality/bsc-events-conv)
Culinary Arts
Culinary Management](https://university.sunway.edu.my/hospitality/bsc-culinary-mgmt)
Design Communication](https://university.sunway.edu.my/soa/ba-design-comm)
Digital Film Production](https://university.sunway.edu.my/soa/ba-film-production)
Entrepreneurship](https://university.sunway.edu.my/subs/ba-entrepreneurship)
Events Management
Finance
Financial Analysis](https://university.sunway.edu.my/subs/bsc-fin-analysis)
Financial Economics](https://university.sunway.edu.my/subs/bsc-fin-econs)
Financial Risk Management
Graphic & Multimedia Design
Global Supply Chain Management](https://university.sunway.edu.my/subs/bsc-supply-chain)
Hotel Management
Industrial Statistics](https://university.sunway.edu.my/math-sc/bsc-industry-stat)
Information Systems (Data Analytics)](https://university.sunway.edu.my/tech/bsc-data-analytics)
Information Technology](https://university.sunway.edu.my/tech/bsc-info-tech)
Information Technology (Computer Networking and Security)](https://university.sunway.edu.my/tech/bsc-network-security)
Interior Architecture](https://university.sunway.edu.my/soa/ba-interior-architecture)
International Business](https://university.sunway.edu.my/subs/bsc-b-international)
Interior Design
International Hospitality Management](https://university.sunway.edu.my/hospitality/intl-mgmt)
International Trade
Management & Innovation
Marketing](https://university.sunway.edu.my/subs/bsc-marketing)
Medical Biotechnology](https://university.sunway.edu.my/sci/bsc-med-biotech)
Mobile Computing with Entrepreneurship](https://university.sunway.edu.my/tech/bis-mobile-comp)
Music Performance](https://university.sunway.edu.my/soa/ba-music-performance)
Nursing
Performing Arts
Psychology](https://university.sunway.edu.my/sci/bsc-psychology)
Software Engineering](https://university.sunway.edu.my/tech/bsc-software-eng)
Supply Chain & Logistics Management
ACCA
ICAEW
CPA Australia
Other`


a.split("\n").map((d) => {
    d = d.split("]")[0]
    return `INSERT INTO wp_career_fair.ref_sunwaygrad21_program (val) VALUES ('${d.trim()}');`
}).join("\n");
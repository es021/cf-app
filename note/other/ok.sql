Select 
CONVERT(
    CAST(
        CONVERT(
REPLACE(REPLACE(REPLACE(REPLACE(message, ".", ""), "’", "'"), "!", ""), ",", "")
            USING latin1
        ) AS BINARY
    ) USING utf8
) as xx, 


message, 

REPLACE(REPLACE(REPLACE(REPLACE(message, ".", ""), "’", "'"), "!", ""), ",", ""), 

created_at
from messages
Having xx is null 
order by created_at desc
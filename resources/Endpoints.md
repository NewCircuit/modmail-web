## Endpoints used by the web server

## Endpoint Requests
|Method|Name|Description|Request Type|Response Body Type|Authenticated|Version|
|---|---|---|:---:|:---:|:---:|---|
|POST|/api/oauth|For Discord|   |   |No|v1|
|GET|/api/categories|For listing out the user's categories|None|Category[]|Yes|v1|
|GET|/api/categories/{category ID}/threads|For listing out the threads of a category|GetThreads|Thread[]|Yes|v1|
|GET|/api/categories/{category ID}/threads/{thread ID}|For listing out messages of a thread|GetMessages|Message[]|Yes|v1|
|GET|/api/categories/{category ID}/users/{user ID}|For getting a specific user|None|User|Yes|v1|
|GET|/api/categories/{category ID}/members/{user ID}|For getting a specific member|None|Member|Yes|v1|
|GET|/api/categories/{category ID}/members|For getting a list of members|None|Member[]|Yes|v1|
|GET|/api/stats/{category ID}|For getting basic stats|TBD|TBD|Yes|v1|
|GET|/api/sr|For getting standard replies|StandardReply[]|None|Yes|v2|
|GET|/api/sr/{standard reply ID}|For getting a single standard reply|StandardReply|None|Yes|v2|
|POST|/api/sr/{standard reply ID}|For creating a standard reply|StandardReply|None|Yes|v2|
|DELETE|/api/sr/{standard reply ID}|For deleting a standard reply|None|None|Yes|v2|
|PUT|/api/sr/{standard reply ID}|For deleting a standard reply|StandardReply|None|Yes|v2|


## GetThreads
|Name|Type|Description|Default|
|---|---|---|---|
|after|Snowflake|Get threads past a certain Snowflake|None|
|before|Snowflake|Get threads before a certain Snowflake|None|
|limit|Integer|The maximum number of Threads to return|100|


## GetMessages
|Name|Type|Description|Default|
|---|---|---|---|
|after|Snowflake|Get messages past a certain Snowflake|None|
|before|Snowflake|Get messages before a certain Snowflake|None|
|limit|Integer|The maximum number of Threads to return|100|

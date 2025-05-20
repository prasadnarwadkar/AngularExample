var config = {
    //apiBaseUrl: "http://localhost:84/api/",// ASP.NET 4.8 Web API
    //apiBaseUrl: "http://localhost:82/api/",// NodeJS Web API
    apiBaseUrl: "http://localhost:81/api/",// Flask Web API
    //apiBaseUrl2: "http://localhost:83/api/" // NodeJS Web API for auth
    apiBaseUrl2: "http://localhost:8083/api/" // NodeJS Web API for auth
}

function getConfig()
{
    return config;
}
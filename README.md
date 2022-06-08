# sfdc-jwt
simple as possible

For generating certificates, unless you have a requirement to use CA issued certs, please use this openssl command:
openssl req -x509 -newkey rsa:4096 -nodes -keyout openssl.key -out openssl.crt -subj /CN=SFDS -days 1000

There are a lot of bad articles and videos all over the place. 
The only one that I found that made sense is this one:
https:medium.com/@tou_sfdx/salesforce-oauth-jwt-bearer-flow-cc70bfc626c2



## Need keys and certs? 
    openssl req -x509 -newkey rsa:4096 -nodes -keyout openssl.key -out openssl.crt -subj /CN=SFDS -days 1000

    privateKey      
    publicCertificate  

    sfdc_consumer_key | connected app api key (NOT SECRET)
    sfdc_user_login_id | your login id (NOT THE ID OF THE APP)
    sfdc_auth_url | https:login.salesforce.com
    sfdc_oauth_url | https:login.salesforce.com/services/oauth2/token

    testBool  | true if you want to test signing. false or null or undefined for actually using the functions
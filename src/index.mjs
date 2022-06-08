import qs from 'qs';
import axios from 'axios'
import {createSign, createVerify} from 'crypto'

export async function generateJWT(sfdc_consumer_key, sfdc_user, sfdc_auth_url){
    try{
        var signObj = createSign('RSA-SHA256')
        var jwtHeader = {
            "alg": "RS256",
            "typ": "JWT"
        }
        var jwtBody = {
            "iss": sfdc_consumer_key,
            "sub": sfdc_user,
            "aud": sfdc_auth_url,
            "exp": Math.trunc(Date.now()/1000)+119
        }
        var jwtPreSign = [Buffer.from(JSON.stringify(jwtHeader)).toString('base64url'), Buffer.from(JSON.stringify(jwtBody)).toString('base64url')]
        signObj.update(new Buffer.from(jwtPreSign.join('.')))
        var jwtArr = [...jwtPreSign, signObj.sign(Buffer.from(privateKey)).toString('base64url')]
        return jwtArr.join('.')
    } catch (err){
        console.error(`SFDC JWT | Generate JWT | Error: ${err}`)
    }
}

export async function getAccess({privateKey, publicCertificate},{sfdc_consumer_key, sfdc_user, sfdc_auth_url, sfdc_oauth_url}, testBool){

  async function testSigning(privateKey, publicCertificate){
    try{
      var testMsg = Buffer.from('test')
      var signObj = createSign('RSA-SHA256')
      signObj.update(testMsg)
      var signature = signObj.sign(Buffer.from(privateKey)).toString('base64url')
      var verifyObj = createVerify('RSA-SHA256')
      verifyObj.write(testMsg)
      return verifyObj.verify(Buffer.from(publicCertificate), signature, 'base64url')
    } catch (err){
      console.error(`SFDC JWT | Test Signing | Error: ${err}`)
      return null
    }
  }

  async function getAccessToken(jwtToken, sfdc_oauth_url){
    try{
      const data = { "grant_type":"urn:ietf:params:oauth:grant-type:jwt-bearer", "assertion": jwtToken};
      const client = new axios.create({
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        timeout: 5000
      })
      var res = await client.post(sfdc_oauth_url, qs.stringify(data)).catch(err=>{console.log(`SFDC JWT | Get Access Token | Axios Error: ${err.message ||err.response}`)})
      return res.data.access_token
    } catch (err){
      console.error(`SFDC JWT | Get Access Token | Error: ${err}`)
      return null
    }
  }

  try{
    if (testBool === true){
      return testSigning(privateKey, publicCertificate)
    } else {
      const jwtToken = await generateJWT(sfdc_consumer_key, sfdc_user, sfdc_auth_url)
      const accessToken = await getAccessToken(jwtToken, sfdc_oauth_url)
      return accessToken
    }
  } catch (err){
    console.error(`SFDC JWT | Error: ${err}`)
    return null
  }
}
//https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
//parameters
import asyncHandler from "express-async-handler";
import { createHmac } from 'crypto';
import { request } from 'https';


//json object send to MoMo endpoint
const paymentItems = asyncHandler(async (req, res) => {
    const {
      amount
    } = req.query

    console.log(amount)
    if (amount && amount.length === 0) {
        res.status(400)
        throw new Error('No payment items')
    } else {
        var partnerCode = process.env.partnerCode;
        var accessKey = process.env.accessKey;
        var secretKey = process.env.secretKey;
        var requestId = partnerCode + new Date().getTime();
        var orderId = requestId;
        var orderInfo = "pay with MoMo";
        var redirectUrl = "http://success";
        var ipnUrl = "https://callback.url/notify";
        // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
        var requestType = "captureWallet"
        var extraData = ""; //pass empty value if your merchant does not have stores

        //before sign HMAC SHA256 with format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        var rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
        //puts raw signature
        console.log("--------------------RAW SIGNATURE----------------")
        console.log(rawSignature)
        //signature
        var signature = createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
        console.log("--------------------SIGNATURE----------------")
        console.log(signature)
        console.log(amount)
        const requestBody = JSON.stringify({
            partnerCode : partnerCode,
            accessKey : accessKey,
            requestId : requestId,
            amount : amount,
            orderId : orderId,
            orderInfo : orderInfo,
            redirectUrl : redirectUrl,
            ipnUrl : ipnUrl,
            extraData : extraData,
            requestType : requestType,
            signature : signature,
            lang: 'en'
        });
        //Create the HTTPS objects
        
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        }
        //Send the request and get the response
        const req2 = request(options, res2 => {
            console.log(`Status: ${res2.statusCode}`);
            console.log(`Headers: ${JSON.stringify(res2.headers)}`);
            res2.setEncoding('utf8');
            res2.on('data', (body) => {
                console.log('Body: ');
                console.log(body);
                console.log('payUrl: ');
                console.log(JSON.parse(body).payUrl);
                res.status(201).send(JSON.parse(body).payUrl)
            });
            res2.on('end', () => {
                console.log('No more data in response.');
            });
        })
        
        req2.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
            res.status(500).send("Payment error!")
        });
        // write data to request body
        console.log("Sending....")
        req2.write(requestBody);
        req2.end();
    }
})

export { 
    paymentItems
    }
//https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
//parameters
import asyncHandler from "express-async-handler";
import { createHmac } from 'crypto';
import { request } from 'https';
import axios from 'axios'; // npm install axios
import CryptoJS from 'crypto-js'; // npm install crypto-js
import { v1 as uuid } from 'uuid'; // npm install uuid
import moment from 'moment'; // npm install moment
import dateFormat from 'dateformat';
import querystring from 'qs'
import crypto from "crypto"
import Order from "../models/orderModel.js";


//json object send to MoMo endpoint
const paymentItems = asyncHandler(async (req, res) => {
    const {
        amount
    } = req.query

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
        var redirectUrl = "about:blank";
        var ipnUrl = "https://callback.url/notify";
        // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
        var requestType = "captureWallet"
        var extraData = ""; //pass empty value if your merchant does not have stores

        //before sign HMAC SHA256 with format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType
        //puts raw signature
        //signature
        var signature = createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            accessKey: accessKey,
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            extraData: extraData,
            requestType: requestType,
            signature: signature,
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
            res.status(500).send("Payment error!")
        });
        // write data to request body
        console.log("Sending....")
        req2.write(requestBody);
        req2.end();
    }
})

const zaloPaymentItems = asyncHandler(async (req, res) => {
    const { amount, orderId } = req.query

    if (amount && amount.length === 0) {
        res.status(400)
        throw new Error('No payment items')
    }


    const config = {
        app_id: process.env.app_id,
        key1: process.env.key1,
        key2: process.env.key2,
        endpoint: "https://mep.zpapps.vn/v2/zlp-demo/create_order"
    };

    const embed_data = {
        orderId: orderId
    };

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: "demo",
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: amount,
        description: `Lazada - Payment for the order #${transID}`,
        bank_code: "zalopayapp",
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    // axios.post(config.endpoint, null, { params: order })
    // .then(res2 => {
    //     console.log(res2);
    //     let order_url = JSON.parse(res2.data.response_data).order_url;
    //     res.status(201).send(order_url)
    // })
    // .catch(err2 => console.log(err2)); 

    // axios.post(`${config.endpoint}?app_id=${order.app_id}&key1=${config.key1}&key2=${config.key2}&amount=${order.amount}&app_user=demo&embed_data=%7B%22promotioninfo%22%3A%22%22%2C%22merchantinfo%22%3A%22embeddata123%22%7D&item=%5B%7B%22itemid%22%3A%22knb%22%2C%22itemname%22%3A%22kim%20nguyen%20bao%22%2C%22itemprice%22%3A198400%2C%22itemquantity%22%3A1%7D%5D&description=Demo%20%26%2345%3B%20Thanh%20to%26%23225%3Bn%20%26%23273%3B%26%23417%3Bn%20h%26%23224%3Bng%20%26%2335%3B%26%2360%3BORDERID%26%2362%3B`)
    // .then(res2 => {
    //         console.log(res2);
    //         let order_url = JSON.parse(res2.data.response_data).order_url;
    //         res.status(201).send(order_url)
    //     })
    //     .catch(err2 => console.log(err2)); 


    var des = `Thanh toán đơn hàng trên Martee: - ${orderId}`
    var redirect_url = "https://www.google.com"
    axios.post(`${config.endpoint}?app_id=${config.app_id}&key1=PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL&key2=kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz&amount=${amount}&app_user=userdemo&embed_data=${JSON.stringify(embed_data)}&item=%5B%7B%22itemid%22%3A%22knb%22%2C%22itemname%22%3A%22kim%20nguyen%20bao%22%2C%22itemprice%22%3A198400%2C%22itemquantity%22%3A1%7D%5D&description=${des}&redirect_url=${redirect_url}`)
        .then(res2 => {
            console.log(res2);
            let order_url = JSON.parse(res2.data.response_data).order_url;
            res.status(201).send(order_url)
        })
        .catch(err2 => console.log(err2));

})

function sortObject(obj) {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
const vnpayPaymentItems = asyncHandler(async (req, res) => {
    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;


    var tmnCode = "TSDZWTE9"
    var secretKey = "MCDQCMMHIMUMDYIGHOYBASQKGJSHUSKY"
    var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
    var returnUrl = 'http://localhost:5000/api/payment/vnpay_check'


    var createDate = dateFormat(date, 'yyyymmddHHmmss');
    var orderId = dateFormat(date, 'HHmmss');
    var amount = req.query.amount;
    var bankCode = req.query.bankCode;

    var orderInfo = req.query.orderDescription;
    var orderType = req.query.orderType;
    var locale = "vn"
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;

    var date = new Date();
    date.setDate(date.getDate() + 1)
    vnp_Params['vnp_ExpireDate'] = dateFormat(date, 'yyyymmddHHmmss')
    // if (bankCode !== null && bankCode !== '') {
    //     vnp_Params['vnp_BankCode'] = bankCode;
    // }

    vnp_Params = sortObject(vnp_Params);

    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    console.log(vnpUrl);
    res.status(201).send(vnpUrl)
})

const vnpayPaymentCheck = asyncHandler(async (req, res) => {
    var vnp_Params = req.query;
    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    var secretKey = "MCDQCMMHIMUMDYIGHOYBASQKGJSHUSKY"
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");


    if (secureHash === signed) {
        var orderId = vnp_Params['vnp_TxnRef'];
        var rspCode = vnp_Params['vnp_ResponseCode'];
        //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi

        const order = await Order.findById(vnp_Params['vnp_OrderInfo'])
        if (order) {
            order.isPaid = true
            order.paidAt = Date.now()
            order.paymentMethod= "VNPay"
            const updatedOrder = await order.save()
            res.json(updatedOrder)
        } else {
            res.status(404)
            throw new Error('Order not found')
        }
    }
    else {
        res.status(200).json({ RspCode: '97', Message: 'Fail checksum' })
    }
})

export { paymentItems, zaloPaymentItems, vnpayPaymentItems, vnpayPaymentCheck }
import React from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { payOrder } from '../actions/orderActions'

const MomoPay = () => {
    const params = useParams()
    const dispatch = useDispatch()
    const orderId = params.orderid
    
    const handleLoad = (e) =>{
        let current_url = e.target.contentWindow.location
        if (current_url){
            console.log(current_url);
            if (current_url.href.includes("Success")){
                dispatch(payOrder(orderId, {
                    id: "",
                    status: "",
                    update_time: "",
                    email_address: ""
                }))
                setTimeout(function(){
                    window.close()
                }, 2000);
            }else{
                if (current_url.href.includes("denied")){
                    alert('fail')
                }
            } 
        }
    }
    return (
    <iframe id="iframe" src={window.atob(params.momourl)}
        onLoad={e => handleLoad(e)}
        style={{position:"fixed", top:0, left:0, bottom:0, right:0, width:"100%", height:"100%", border:"none", margin:0, padding:0, overflow:"hidden", zIndex:999999}}>
        Your browser doesn't support iframes
    </iframe>
    )
}
export default MomoPay
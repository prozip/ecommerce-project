import axios from 'axios'
import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'



const OrderScreen = () => {
    const navigate = useNavigate()
    const params = useParams()
    const orderId = params.id


    const dispatch = useDispatch()


    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin


    if (!loading) {
        //Calculate prices
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2)
        }
        order.itemsPrice = addDecimals(order.orderItems.reduce(
            (acc, item) => acc + item.price * item.qty * 24000, 0
        ))
    }
    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        }
        if (!order || successPay || successDeliver) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })
            dispatch(getOrderDetails(orderId))
        } else if (!order.isPaid) {
        }
    }, [dispatch, orderId, successPay, successDeliver, order, navigate, userInfo])


    const Handler = () => {
        axios.get(`${process.env.REACT_APP_FETCH_URL}/api/payment/zalo`, {
            params: {
                amount: String(parseInt(order.totalPrice*24000)),
                orderId:orderId
            }
        }).then((res) => {
            let order_param = res.data.split('order=')[1];
            console.log(res.data, order_param);
            var neww = window.open(`/zalopay/${order_param}/${orderId}`, '_blank', 'noreferer');
            var timer = setInterval(function() { 
                if(neww.closed) {
                    clearInterval(timer);
                    window.location.reload();
                }
            }, 1000);
        })
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }
    return loading ? <Loader /> : error ? <Message variant='danger'>{error}
    </Message> : <>
        <h1>Order{order._id}</h1>
        <Row>
            <Col md={8} >
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p>
                            <strong>Name:</strong> {order.user.name}
                        </p>
                        <p>
                            <strong>Email:</strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                        </p>
                        <p>
                            <strong>Address:</strong>
                            {order.shippingAddress.address},
                            {order.shippingAddress.city}{' '}
                            {order.shippingAddress.postalCode},{' '}
                            {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? <Message variant='success'>Delivered on {order.deliveredAt}</Message> :
                            <Message variant='danger'>Not Delivered</Message>}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p>
                            <strong>Method: </strong>
                            {order.paymentMethod}
                        </p>
                        {order.isPaid ? <Message variant='success'>Paid on {order.paidAt}</Message> :
                            <Message variant='danger'>Not paid</Message>}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {order.orderItems.length === 0 ? <Message>Order is empty</Message> : (
                            <ListGroup variant='flush'>
                                {order.orderItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md='5'>
                                                <Image src={`${process.env.REACT_APP_FETCH_URL}/${item.image}`} alt={item.name} fluid round />
                                            </Col>

                                            <Col>
                                                <Link to={`/product/${item.product}`}>
                                                    {item.name}
                                                </Link>
                                            </Col>

                                            <Col md={4}>
                                                {item.qty} x ${item.price} = ${item.qty * item.price}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </ListGroup.Item>
                </ListGroup>
            </Col>

            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Items</Col>
                                <Col>{order.itemsPrice} VND</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping</Col>
                                <Col>{order.shippingPrice*24000} VND</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Tax</Col>
                                <Col>{order.taxPrice*24000} VND</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Total</Col>
                                <Col>{order.totalPrice*24000} VND</Col>
                            </Row>
                        </ListGroup.Item>
                        {!order.isPaid && (
                            <ListGroup.Item>
                                {loadingPay && <Loader></Loader>}
                                <img onClick={Handler} class='centermomo' src="https://idgv.vn/Event/RetailBanking/wp-content/uploads/2022/03/ZaloPay_color_hoz.png" alt="sZSTOb.png" border="0" />
                            </ListGroup.Item>
                        )}
                        {loadingDeliver && <Loader />}
                        {userInfo && userInfo.isAdmin && order.isPaid && !orderDeliver && (
                            <ListGroup.Item>
                                <Button type='button' className='btn btn-block' onClick={deliverHandler}>
                                    Mark as Delivered
                                </Button>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </>
}

export default OrderScreen
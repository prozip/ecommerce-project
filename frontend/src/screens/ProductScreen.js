import React , {useState, useEffect} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form} from 'react-bootstrap'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProductDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

const ProductScreen = () => {
    const params = useParams()
    const navigate = useNavigate();

    // const product = products.find((p)=>p._id === params.id)

    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product} = productDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const { 
        success: successProductReview, 
        error: errorProductReview, 
    } = productReviewCreate
      
    useEffect(() => {
        dispatch(listProductDetails(params.id))
     }, [dispatch, params])

     const addToCartHandler = () => {
        navigate(`/cart/${params.id}?qty=${qty}`)
     }

    return (<>
        <Link className='btn btn-light my-3' to='/'> 
        Go Back
        </Link>
        {loading ? <Loader /> : error ? <Message variant = 'danger'>{error}</Message> : (
            <>
            <Row>
            <Col md={6}>
                <Image src={product.image} alt={product.name} fluid/>
            </Col>
            <Col md={3}>
                <ListGroup variant='flush'>
                    <ListGroupItem>
                        <h2>{product.name}</h2>
                    </ListGroupItem>

                    <ListGroupItem>
                        <Rating value={product.rating} text={`${product.numReviews} reviews` }/>
                    </ListGroupItem>

                    <ListGroupItem>Price: ${product.price}</ListGroupItem>
                    <ListGroupItem>Description: ${product.description}</ListGroupItem>

                </ListGroup>
            </Col>
            <Col md={3}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    Price :                            
                                </Col>
                                <Col>
                                    <strong>${product.price}</strong>
                                </Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    Status :                           
                                </Col>
                                <Col>
                                    {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        
                        {product.countInStock > 0 && (
                            <ListGroup.Item>
                                 <Row>
                                    <Col>Qty</Col>
                                    <Col>
                                        <Form.Control 
                                            as='select' 
                                            value={qty} 
                                            onChange={(e) => setQty(e.target.value)}
                                        >
                                            {[...Array(product.countInStock).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>

                                 </Row>
                            </ListGroup.Item>
                        )}
 
                        <ListGroup.Item>
                            
                            <Button 
                            onClick={addToCartHandler}
                            className='btn-block' type='button' disabled={product.countInStock === 0}>
                                Add To Cart
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col md={6}>
                <h2>Reviews</h2>
                {product.reviews.length === 0 && <Message>No Reviews</Message> }
            </Col>
        </Row>
        </>
        )}

        
    </>)
    
}

export default ProductScreen
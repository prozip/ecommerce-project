import React , {useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form} from 'react-bootstrap'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProductDetails } from '../actions/productActions'

const ProductScreen = () => {
    const params = useParams()
    // const product = products.find((p)=>p._id === params.id)

    const [qty, setQty] = useState(0)

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product} = productDetails
      
    useEffect(() => {
        dispatch(listProductDetails(params.id))
     }, [dispatch, params])

    return (<>
        <Link className='btn btn-light my-3' to='/'> 
        Go Back
        </Link>
        {loading ? <Loader /> : error ? <Message variant = 'danger'>{error}</Message> : (
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
                                            {[...Array(product.countInStock).key()].map((x) => (
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
                            <Button className='btn-block' type='button' disabled={product.countInStock === 0}>
                                Add To Cart
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
        )}

        
    </>)
    
}

export default ProductScreen
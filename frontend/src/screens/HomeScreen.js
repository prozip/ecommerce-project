import React , { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row,Col } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'

import { Link } from 'react-router-dom'


import { listProducts } from '../actions/productActions'

const HomeScreen = () => {
  const dispatch = useDispatch()

  const productList = useSelector(state => state.productList)
  const {loading , error, products } = productList

  useEffect(() => {
    dispatch(listProducts())
  }, [dispatch])

  return (
    <>
        <h1> Latest Products</h1>
        {loading ? (
        <Loader /> 
        ): error ? (
          <Message variant='danger'>{error}</Message> 
          ) : (
            <Row>
                {products.map((product) => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                       <Product product={product} />
                    </Col>
                ))}
                <Link to={`/order/63035406121877f2ead90b20`}>
                  <h1>Hello</h1>
                </Link>
            </Row>

          )} 
    </>
  )
}

export default HomeScreen
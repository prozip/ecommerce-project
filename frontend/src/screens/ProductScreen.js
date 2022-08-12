import React from 'react'
import { Link, useParams } from 'react-router-dom'
import {Row, Col, Image, ListGroup, Card, Button} from 'react-bootstrap'
import Rating from '../components/Rating'
import products from '../products'


const ProductScreen = () => {
    const params = useParams()
    const product = products.find((p)=>p._id === params.id)
    return <div>{product.name}</div>
    
}

export default ProductScreen
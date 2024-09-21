import React from 'react'
import LeftNav from './LeftNav'
import ProductList from './ProductList'

import { useParams } from 'react-router-dom'
export default function Shop() {
    var {mc,sc,br,search} = useParams()
    return (
        <div className='container-fluid mt-2'>
            <div className='row'>
                <div className='col-lg-2 col-md-4 col-12'>
                <h5 className='background text-light text-center p-1'>Menu</h5>
                    <LeftNav/>
                </div>
                <div className='col-lg-10 col-md-8 col-12'>
                    <h5 className='background text-light text-center p-1'>Shop Section</h5>
                    <ProductList mc={mc} sc={sc} br={br} search = {search}/>
                </div>
            </div>
        </div>
    )
}

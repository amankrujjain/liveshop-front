import React, { useContext, useState, useEffect } from 'react'

import { Product } from '../Store/ProductContextProvider';
import ProductItem from './ProductItem';
export default function ProductList(props) {
    var [products, setproducts] = useState([])
    var { getProduct } = useContext(Product)
    async function getAPIData() {
        var response = await getProduct()
        var p = []
        if (props.search === "None" || props.search === "") {
            if (props.mc === "All" && props.sc === "All" && props.br === "All")
                p = response.data
            else if (props.mc !== "All" && props.sc === "All" && props.br === "All")
                p = response.data.filter((item) => item.maincategory === props.mc)
            else if (props.mc === "All" && props.sc !== "All" && props.br === "All")
                p = response.data.filter((item) => item.subcategory === props.sc)
            else if (props.mc === "All" && props.sc === "All" && props.br !== "All")
                p = response.data.filter((item) => item.brand === props.br)
            else if (props.mc !== "All" && props.sc !== "All" && props.br === "All")
                p = response.data.filter((item) => item.maincategory === props.mc && item.subcategory === props.sc)
            else if (props.mc !== "All" && props.sc === "All" && props.br !== "All")
                p = response.data.filter((item) => item.maincategory === props.mc && item.brand === props.br)
            else if (props.mc === "All" && props.sc !== "All" && props.br !== "All")
                p = response.data.filter((item) => item.brand === props.br && item.subcategory === props.sc)
            else
                p = response.data.filter((item) => item.maincategory === props.mc && item.brand === props.br && item.subcategory === props.sc)
        }
        else{
             response = await fetch("/search",{
                method:"post",
                headers:{
                    "content-type":"application/json"
                },
                body:JSON.stringify({search:props.search})
            })
            response = await response.json()
            p = response.data
        }
        setproducts(p)
    }
    useEffect(() => {
        getAPIData()
    }, [props.mc, props.sc, props.br,props.search])
    return (
        <div className='container-fluid'>
            <div className='row'>
                {
                    products.map((item, index) => {
                        return <div key={index} className='col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 mb-2'>
                            <ProductItem name={item.name} baseprice={item.baseprice} discount={item.discount} finalprice={item.finalprice} pic={item.pic1} _id={item._id} />
                        </div>
                    })
                }
            </div>
        </div>
    )
}

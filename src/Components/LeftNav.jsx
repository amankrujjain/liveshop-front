import React, { useState, useEffect, useContext } from 'react'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

import { Link, useParams } from 'react-router-dom';

import { Maincategory } from "../Store/MaincategoryContextProvider"
import { Subcategory } from "../Store/SubcategoryContextProvider"
import { Brand } from "../Store/BrandContextProvider"
export default function LeftNav() {
    var [maincategory, setmaincategory] = useState([])
    var [subcategory, setsubcategory] = useState([])
    var [brand, setbrand] = useState([])
    var { getMaincategory } = useContext(Maincategory)
    var { getSubcategory } = useContext(Subcategory)
    var { getBrand } = useContext(Brand)
    var { mc, sc, br } = useParams()

    async function getAPIData() {
        var response = await getMaincategory()
        setmaincategory(response.data)

        response = await getSubcategory()
        setsubcategory(response.data)

        response = await getBrand()
        setbrand(response.data)
    }
    useEffect(() => {
        getAPIData()
    }, [])
    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <nav aria-label="secondary mailbox folders">
                <List>
                    <h6 className='background text-light text-center p-1'>Maincategory</h6>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <Link to={`/shop/All/${sc}/${br}`} className='text-decoration-none text-danger'>All</Link>
                        </ListItemButton>
                    </ListItem>
                    {
                        maincategory.map((item, index) => {
                            return <ListItem key={index} disablePadding>
                                <ListItemButton>
                                    <Link to={`/shop/${item.name}/${sc}/${br}`} className='text-decoration-none text-danger'>{item.name}</Link>
                                </ListItemButton>
                            </ListItem>
                        })
                    }
                </List>
                <List>
                    <h6 className='background text-light text-center p-1'>Subcategory</h6>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <Link to={`/shop/${mc}/All/${br}`} className='text-decoration-none text-danger'>All</Link>
                        </ListItemButton>
                    </ListItem>
                    {
                        subcategory.map((item, index) => {
                            return <ListItem key={index} disablePadding>
                                <ListItemButton>
                                    <Link to={`/shop/${mc}/${item.name}/${br}`} className='text-decoration-none text-danger'>{item.name}</Link>
                                </ListItemButton>
                            </ListItem>
                        })
                    }
                </List>
                <List>
                    <h6 className='background text-light text-center p-1'>Brands</h6>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <Link to={`/shop/${mc}/${sc}/All`} className='text-decoration-none text-danger'>All</Link>
                        </ListItemButton>
                    </ListItem>
                    {
                        brand.map((item, index) => {
                            return <ListItem key={index} disablePadding>
                                <ListItemButton>
                                    <Link to={`/shop/${mc}/${sc}/${item.name}`} className='text-decoration-none text-danger'>{item.name}</Link>
                                </ListItemButton>
                            </ListItem>
                        })
                    }
                </List>
            </nav>
        </Box>
    )
}

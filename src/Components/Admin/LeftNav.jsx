import React from 'react'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';


import { Link } from 'react-router-dom';
export default function LeftNav() {
    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <h5 className='background text-light text-center p-1'>Menu</h5>
            <nav aria-label="secondary mailbox folders">
                <List>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <Link to="/admin-home" className='btn mybtn'>Home</Link>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <Link to="/admin-userlist" className='btn mybtn'>User List</Link>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <Link to="/admin-maincategory" className='btn mybtn'>MainCategory</Link>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <Link to="/admin-subcategory" className='btn mybtn'>SubCategory</Link>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <Link to="/admin-brand" className='btn mybtn'>Brand</Link>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <Link to="/admin-product" className='btn mybtn'>Product</Link>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <Link to="/admin-checkout" className='btn mybtn'>Checkout</Link>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <Link to="/admin-contact" className='btn mybtn'>Contact</Link>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <Link to="/admin-newslatter" className='btn mybtn'>Newslatter</Link>
                        </ListItemButton>
                    </ListItem>
                </List>
            </nav>
        </Box>
    )
}

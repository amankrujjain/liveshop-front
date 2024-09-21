import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Components/App'

import MaincategoryContextProvider from './Store/MaincategoryContextProvider'
import SubcategoryContextProvider from './Store/SubcategoryContextProvider'
import BrandContextProvider from './Store/BrandContextProvider'
import ProductContextProvider from './Store/ProductContextProvider'
import UserContextProvider from './Store/UserContextProvider'
import ContactContextProvider from './Store/ContactContextProvider'
import NewslatterContextProvider from './Store/NewslatterContextProvider'
import CartContextProvider from './Store/CartContextProvider'
import WishlistContextProvider from './Store/WishlistContextProvider'
import CheckoutContextProvider from './Store/CheckoutContextProvider'


const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <>
        <MaincategoryContextProvider>
            <SubcategoryContextProvider>
                <BrandContextProvider>
                    <ProductContextProvider>
                        <UserContextProvider>
                            <ContactContextProvider>
                               <NewslatterContextProvider>
                                   <CartContextProvider>
                                    <WishlistContextProvider>
                                        <CheckoutContextProvider>
                                            <App />
                                        </CheckoutContextProvider>
                                    </WishlistContextProvider>
                                   </CartContextProvider>
                               </NewslatterContextProvider>
                            </ContactContextProvider>
                        </UserContextProvider>
                    </ProductContextProvider>
                </BrandContextProvider>
            </SubcategoryContextProvider>
        </MaincategoryContextProvider>
    </>
)
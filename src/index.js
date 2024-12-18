import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Components/App'
import {Toaster} from 'react-hot-toast'


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
                                                <Toaster
                                                    position="top-right"
                                                    reverseOrder={false}
                                                    gutter={8}
                                                    containerClassName=""
                                                    containerStyle={{}}
                                                    toastOptions={{
                                                        // Define default options
                                                        className: '',
                                                        duration: 5000,
                                                        style: {
                                                            background: '#FFFFFF',
                                                            color: 'black',
                                                        },

                                                        // Default options for specific types
                                                        success: {
                                                            duration: 3000,
                                                            theme: {
                                                                primary: 'green',
                                                                secondary: 'black',
                                                            },
                                                        },
                                                    }}
                                                />
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
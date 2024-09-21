import React,{createContext} from "react"

export const Subcategory = createContext()
async function addSubcategory(item){
    var rawdata = await fetch("/subcategory",{
        method:"post",
        headers:{
            "content-type":"application/json",
            "authorization": localStorage.getItem("token"),
            "username": localStorage.getItem("username")
        },
        body:JSON.stringify(item)
    })
    return await rawdata.json()
}
async function updateSubcategory(item){
    var rawdata = await fetch("/subcategory/"+item._id,{
        method:"put",
        headers:{
            "content-type":"application/json",
            "authorization": localStorage.getItem("token"),
            "username": localStorage.getItem("username")
        },
        body:JSON.stringify(item)
    })
    return await rawdata.json()
}
async function getSubcategory(item){
    var rawdata = await fetch("/subcategory",{
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
async function getSingleSubcategory(item){
    var rawdata = await fetch("/subcategory/"+item._id,{
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
async function deleteSubcategory(item){
    var rawdata = await fetch("/subcategory/"+item._id,{
        method:"delete",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
export default function SubcategoryContextProvider(props){
    return <Subcategory.Provider value={
            {
                add:addSubcategory,
                getSubcategory:getSubcategory,
                deleteData:deleteSubcategory,
                getSingle:getSingleSubcategory,
                update:updateSubcategory
            }
        }>
        {props.children}
    </Subcategory.Provider>
}
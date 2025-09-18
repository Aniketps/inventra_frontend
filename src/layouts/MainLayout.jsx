import { useState } from "react";
import { MainHeader, SimpleStatusContainer, MainFooter } from "../components/mainComponent";

function MainLayout({ children }){
    
    return <>
        <MainHeader/>
        <div style={{ height : "90px"}}/>
        {children}
        <MainFooter/>
    </>
}

export default MainLayout;
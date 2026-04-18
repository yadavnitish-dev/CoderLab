import React from "react";
import { useAuthStore } from "../store/useAuthStore";


interface LogoutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({children, onClick, className, ...props})=>{
    const {logout} = useAuthStore()

    const handleLogout = async(e: React.MouseEvent<HTMLButtonElement>)=>{
        if(onClick) onClick(e);
        await logout();
    }

    return (
        <button className={className || "btn btn-primary"} onClick={handleLogout} {...props}> 
            {children}
        </button>
    )
}

export default LogoutButton;
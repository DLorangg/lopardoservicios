import React, { useEffect } from "react";

export function Home() {
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('loggedIn');
        console.log('Is logged in:', isLoggedIn === 'true');
    }, []);

    return (
        <div className="container my-5">
            <h2 className="text-center mb-3">Home Page</h2>
        </div>
    );
}
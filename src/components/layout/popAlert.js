"use client"
import { useState } from "react";
export function PopAlert({ message, type = "success" }) {
    let alertColor = "text-green-700";

    switch (type) {
        case "success":
            alertColor = "text-green-700";
            break;
        case "warning":
            alertColor = "text-orange-700";
            break;
        case "error":
            alertColor = "text-red-700";
            break;
        case "normal":
            alertColor = "text-gray-700";
            break;
        case "primary":
            alertColor = "text-blue-700";
            break;
        default:
            alertColor = "text-green-700";
            break;
    }
    return (
        <div className={`
              ${alertColor}
              p-3
              rounded-xl
            `}>

            {message}

        </div>
    )
}
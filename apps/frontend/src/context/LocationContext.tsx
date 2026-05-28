import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface IContext {
    location: string;
    loading: boolean;
    error: string | string[];
}

const LocationContext = createContext<IContext>({
    location: "",
    loading: true,
    error: ""
});

interface IProps {
    children: ReactNode
}

interface Address {
    city: string;
    county: string;
    state: string;
    "ISO3166-2-lvl4": string;
    country: string;
    country_code: string;
}

export const LocationProvider = ({ children }: IProps) => {
    const [location, setLocation] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | string[]>("");


    const fetchLocationData = async (latitude: number, longitude: number) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            const raw: unknown = await res.json();
            const json = raw as { address: Address };
            const address: Address = json.address;
            const userLocation = address.state;
            setLocation(userLocation);
        } catch {
            setError("Failed to fetch location data");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // Js logic to fetch and set user default location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                void fetchLocationData(latitude, longitude);
            },
            (error) => {
                setError(`Error Code: ${error.code} - ${error.message}`);
                setLoading(false);
            }
        );
    }, []);

    return <LocationContext.Provider value={{ location, loading, error }}>
        {children}
    </LocationContext.Provider>
}

export const useLocation = () => useContext(LocationContext);
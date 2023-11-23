import { FaRunning } from "react-icons/fa";
import { MdPedalBike } from "react-icons/md";

export function metresToKM(distance: number) {
    const kms = Math.round(distance / 10) / 100;
    return kms;
}

export function ISOtoTime(ISO: string) {
    const ISODate = new Date(ISO);
    const time = ISODate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
    return time;
}

export function ISOtoDate(ISO: string) {
    const ISODate = new Date(ISO);
    const date = ISODate.toLocaleDateString([], {
        weekday: "long",
        day: "numeric",
        month: "short",
    });
    return date;
}

export function secondsToDuration(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return hours ? `${hours}h ${minutes}m` : `${minutes}m ${remainingSeconds}s`;
}

export function getSportIcon(sportType: string) {
    switch (sportType) {
        case "Ride" || "ride":
            return <MdPedalBike size={"16px"} />;
        case "Run" || "run":
            return <FaRunning size={"16px"} />;
    }
    return null;
}

export function getPace(metres: number, seconds: number) {
    if (metres == 0 || seconds == 0) return "0:0";
    const msPace = seconds / 60 / (metres / 1000);
    const minutes = Math.floor(msPace);
    const remainingSeconds = Math.round((msPace - minutes) * 60);
    return remainingSeconds < 10 ? `${minutes}:0${remainingSeconds}` : `${minutes}:${remainingSeconds}`;
}

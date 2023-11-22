// Function to calculate the time difference in hours between two timestamps
export function calculateTimeDifference(startTime: number, endTime: number) {
    const diffInMilliseconds = endTime - startTime;
    const diffInSeconds = diffInMilliseconds / 1000;
    const diffInHours = diffInSeconds / 3600;
    return diffInHours;
}

export function calculateDistance(lat1, lon1, lat2, lon2, elev1 = 0, elev2 = 0) {
    const R = 637100; // Earth radius in meters
    const phi1 = lat1 * (Math.PI / 180);
    const phi2 = lat2 * (Math.PI / 180);
    const deltaPhi = (lat2 - lat1) * (Math.PI / 180);
    const deltaLambda = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const deltaElev = elev2 - elev1;
    const distance = Math.sqrt(Math.pow(c * R, 2) + Math.pow(deltaElev, 2));

    return distance * 10;
}

// Function to calculate the overall distance traveled
export function calculateOverallDistance(coordinates: any) {
    let overallDistance = 0;

    for (let i = 0; i < coordinates.length - 1; i++) {
        const { lat: lat1, lon: lon1, elevation: elev1 } = coordinates[i];
        const { lat: lat2, lon: lon2, elevation: elev2 } = coordinates[i + 1];
        overallDistance += calculateDistance(lat1, lon1, lat2, lon2, elev1, elev2);
    }

    return Math.floor(overallDistance);
}

// Function to calculate the total moving time
export function calculateTotalMovingTime(points, speedThreshold: number) {
    let totalMovingTime = 0;

    for (let i = 0; i < points.length - 1; i++) {
        const { lat: lat1, lon: lon1, elevation: elev1, time: time1 } = points[i];
        const { lat: lat2, lon: lon2, elevation: elev2, time: time2 } = points[i + 1];

        const distance = calculateDistance(lat1, lon1, lat2, lon2, elev1, elev2);
        const timeDifference = calculateTimeDifference(time1, time2);
        const speed = distance / timeDifference;

        // Check if the speed exceeds the threshold for considering the user to be moving
        if (speed > speedThreshold) {
            totalMovingTime += timeDifference;
        }
    }

    return totalMovingTime;
}

export function convertGPXData(gpxData: any) {
    const trkpts = gpxData.trkseg[0].trkpt;

    // Convert each track point to the desired format
    const convertedData = trkpts.map((trkpt: any) => {
        const lat = parseFloat(trkpt.$.lat);
        const lon = parseFloat(trkpt.$.lon);
        const elevation = parseFloat(trkpt.ele[0]);
        const time = new Date(trkpt.time[0]);

        return {
            lat,
            lon,
            elevation,
            time,
        };
    });

    return convertedData;
}

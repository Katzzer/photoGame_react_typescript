export interface Photo {
    id?: number,
    photoOwner?: string,
    gpsPositionLatitude: number,
    gpsPositionLongitude: number,
    city?: string,
    region?: string,
    locality?: string,
    country?: string,
    continent?: string
    image?: string | undefined
}
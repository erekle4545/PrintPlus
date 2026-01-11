import {PageCover} from "@/types/page/page";

export interface ContactTypes {
    keys:object,
    meta:meta,
    phone:string,
    email:string,
    info:infoContact
}



interface infoContact{
    address:string,
    title:string,
    settings_id:bigint,
    description:string,
    language_id:bigint,
    covers:PageCover[]
}

interface meta{
    facebook:string,
    instagram:string,
    youtube:string
}
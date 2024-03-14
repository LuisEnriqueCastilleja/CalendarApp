import { parseISO } from "date-fns"

export const convertEventsToDateEvents = (events = []) => {
    return events.map(event => {
        //Para transformar de un string a una fecha usamos parseISO
        event.start = parseISO(event.start);
        event.end = parseISO(event.end);

        return event;
    });

}

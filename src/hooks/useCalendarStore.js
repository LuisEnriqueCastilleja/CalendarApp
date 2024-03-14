import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onLoadEvents, onUpdateEvent } from "../store/calendar/calendarSlice";
import calendarApi from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers";
import Swal from "sweetalert2";

export const useCalendarStore = () => {

    const dispatch = useDispatch();

    const { events, activeEvent } = useSelector(state => state.calendar);
    const { user } = useSelector(state => state.auth);

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent));
    }

    const startSavingEvent = async (calendarEvent) => {

        try {
            //SI estoy actualizando un evento tiene el id
            if (calendarEvent.id) {

                //Le mandamos el id del evento que queremos editar
                await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);

                //No es necesario ...calendarEvent pero  es para asegurarse mandar una nueva instancia
                //sobreescribimos el usuario activo, lo obtenemos del store
                dispatch(onUpdateEvent({ ...calendarEvent, user }));

                return;
            }

            //Sino estoy registrando uno nuevo
            //Peticion para registrar un nuevo evento
            const { data } = await calendarApi.post("/events", calendarEvent)

            dispatch(onAddNewEvent({
                ...calendarEvent,
                id: data.evento.id,
                user
            }));
        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data.msg, 'error');
        }


    };

    const startDeletingEvent = async (calendarEvent) => {

        try {
            if (calendarEvent.id) {
                await calendarApi.delete(`/events/${calendarEvent.id}`,)
                dispatch(onDeleteEvent());

                return;
            }
        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data.msg, 'error');
        }

    };

    const startLoadingEvents = async () => {
        try {
            const { data } = await calendarApi.get("/events");
            const events = convertEventsToDateEvents(data.eventos);

            dispatch(onLoadEvents(events));

        } catch (error) {
            console.log('Error cargando eventos');
            console.log(error);
        }
    }

    return {
        activeEvent,
        events,
        //Si hay un evento seleccionado regresa true, sino false
        hasEventSelected: !!activeEvent,
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,
        startLoadingEvents
    }
}

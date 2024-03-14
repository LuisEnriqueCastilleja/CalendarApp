import { Calendar } from 'react-big-calendar';
import { NavBar, CalendarEvent, CalendarModal, FabAddNew, FabDelete } from '../';
import { getMessagesES, localizer } from '../../helpers';
import { useEffect, useState } from 'react';
import { useAuthStore, useUiStore, useCalendarStore } from '../../hooks';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export const CalendarPage = () => {

    const { user } = useAuthStore();
    const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();
    const { openDateModal } = useUiStore();
    //evenPropGetter:      
    // Aqui viene el inicio, termino del evento, isSelected
    // Entre otras propieades

    //messages:
    //Para mostrar los dias y mesese y botones del calendario
    //en español
    //TIene todas las propiedades del calendario 
    const onDoubleClick = (event) => {
        openDateModal();
    }

    const onSelect = (event) => {
        setActiveEvent(event);
    }

    //CUando la vista cambia almacenare en localStorage la view
    //En que se quedo
    const onViewChanged = (event) => {
        localStorage.setItem('lastView', event);
        setLastView(event);
    }

    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week');


    const eventStyleGetter = (event, start, end, isSelected) => {

        const isMyEvent = (user.uid === event.user._id) || (user.uid === event.user.uid);
        const style = {
            backGroundColor: isMyEvent ? '##347CF7' : '#465660',
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white'
        }

        return {
            style
        }
    }

    useEffect(() => {
        startLoadingEvents();
    }, [])


    return (
        <>
            <NavBar />
            <Calendar
                culture='es'
                localizer={localizer}
                events={events}
                defaultView={lastView}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc(100vh - 80px)' }}
                messages={getMessagesES()}
                eventPropGetter={eventStyleGetter}
                components={{
                    //Para sobreescribir el event que viene por defecto
                    //Y mandarle la referencia al CalendarEvent
                    //Para cambiar el diseño
                    event: CalendarEvent
                }}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelect}
                onView={onViewChanged}
            />
            <CalendarModal />
            <FabAddNew />
            <FabDelete />
        </>
    );
}

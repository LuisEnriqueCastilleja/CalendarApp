import { useCalendarStore, useUiStore } from "../../hooks"

export const FabDelete = () => {

    const { startDeletingEvent, hasEventSelected, activeEvent } = useCalendarStore();
    const onDeleteEvent = () => {
        startDeletingEvent(activeEvent);
    }

    return (
        <button
            onClick={onDeleteEvent}
            style={{
                display: hasEventSelected ? '' : 'none'
            }}
            className="btn btn-danger fab-danger">
            <i className="fas fa-trash-alt"></i>
        </button>
    )
}

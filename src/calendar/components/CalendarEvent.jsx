export const CalendarEvent = ({ event }) => {
    //Las props vienen:
    //event con toda la info
    //localizer, slot end, slot start, title, continues after, etc

    const { title, user } = event;

    return <>
        <strong>{title}</strong>
        <span>- {user.name}</span>

    </>
}

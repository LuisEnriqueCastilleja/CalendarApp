import { addHours, differenceInSeconds } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale/es';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useCalendarStore, useUiStore } from '../../hooks';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

registerLocale('es', es);

//Esto me va a ayudar a que se sobreponga entre todo lo demas
//De la pagina
Modal.setAppElement('#root');

export const CalendarModal = () => {

    const { isDateModalOpen } = useUiStore();
    const { activeEvent, startSavingEvent } = useCalendarStore();
    const [formSubmitted, setFormSubmitted] = useState(false);
    const { closeDateModal } = useUiStore();


    const onCloseModal = () => {
        closeDateModal();
    }

    const [formValues, setFormValues] = useState(
        {
            title: 'Luis Castilleja',
            notes: 'Tristan',
            start: new Date(),
            end: addHours(new Date(), 2)
        }
    );

    const titleClass = useMemo(() => {
        if (!formSubmitted) return '';

        return (formValues.title.length > 0) ? '' : 'is-invalid'
    }, [formValues.title, formSubmitted])

    const onInputChanged = ({ target }) => {
        setFormValues({
            //Para pasar todas las propiedades como estaban
            ...formValues,
            //Y solo actualizar la del target.name
            //Por su nuevo value
            [target.name]: target.value
        })
    };

    const onDateChanged = (event, changing) => {
        setFormValues({
            //Para pasar todas las propiedades como estaban
            ...formValues,
            //Y solo actualizar la propiedad start o end
            [changing]: event
        })
    };

    useEffect(() => {
        //Si es nulo no quiero establecer nulo al formulario porque los campos perderian el enlace
        if (activeEvent !== null) {
            //Esparcimos el activeEvent para crear una nueva instancia de ese objeto
            setFormValues({ ...activeEvent });
        }
        //Cada vez que la nota cambie
    }, [activeEvent]);

    const onSubmit = async (event) => {
        event.preventDefault();
        setFormSubmitted(true);

        const difference = differenceInSeconds(formValues.end, formValues.start);

        if (isNaN(difference) || difference <= 0) {
            Swal.fire('Fechas incorrectas', 'Revisar las fechas ingresadas');
            return;
        }

        if (formValues.title.length <= 0) return;

        await startSavingEvent(formValues);
        closeDateModal();
        setFormSubmitted(false);
    }


    return (
        <Modal isOpen={isDateModalOpen}
            onRequestClose={onCloseModal}
            style={customStyles}
            className="modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={200}
        >

            <h1> Nuevo evento </h1>
            <hr />
            <form className="container" onSubmit={onSubmit}>

                <div className="form-group mb-2">
                    <label>Fecha y hora inicio</label>
                    <DatePicker
                        timeCaption='Hora'
                        locale="es"
                        selected={formValues.start}
                        className='form-control'
                        onChange={(event) => onDateChanged(event, 'start')}
                        dateFormat="Pp"
                        showTimeSelect
                    />
                </div>

                <div className="form-group mb-2">
                    <label>Fecha y hora fin</label>
                    <DatePicker
                        timeCaption='Hora'
                        locale="es"
                        minDate={formValues.start}
                        selected={formValues.end}
                        className='form-control'
                        onChange={(event) => onDateChanged(event, 'end')}
                        dateFormat="Pp"
                        showTimeSelect
                    />
                </div>

                <hr />
                <div className="form-group mb-2">
                    <label>Titulo y notas</label>
                    <input
                        type="text"
                        className={`form-control ${titleClass}`}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={formValues.title}
                        onChange={onInputChanged}
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group mb-2">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={formValues.notes}
                        onChange={onInputChanged}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>
        </Modal>
    )
}

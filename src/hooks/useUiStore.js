import { useDispatch, useSelector } from "react-redux"
import { onCloseDateModal, onOpenDateModal } from "../store";

export const useUiStore = () => {
    const { isDateModalOpen } = useSelector(state => state.ui);

    const dispatch = useDispatch();

    //Para abrir el modal
    const openDateModal = () => {
        //Esto hace que el isDateModalOpen sea true
        dispatch(onOpenDateModal());
    };

    const closeDateModal = () => {
        dispatch(onCloseDateModal());
    }

    const toogleDateModal = () => {
        (isDateModalOpen)
            ? openDateModal()
            : closeDateModal();
    }

    return {
        isDateModalOpen,
        openDateModal,
        closeDateModal,
        toogleDateModal
    }
}
